import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../utils/supabase';

const SECTIONS_KEY = 'arseon_admin_sections';
const INQUIRIES_KEY = 'arseon_admin_inquiries';

const VALID_KEYS = ['hero', 'about', 'performances', 'gallery'];

const DEFAULT_SECTIONS = [
    { key: 'hero', label: 'Hero 메인 배경', images: [], videoUrl: '', videoUrls: [] },
    { key: 'about', label: '단체 소개', images: [], videoUrl: '', videoUrls: [] },
    { key: 'performances', label: '공연 활동', images: [], videoUrl: '', videoUrls: [] },
    { key: 'gallery', label: '영상/사진 갤러리', images: [], videoUrl: '', videoUrls: [] },
];

/** 구버전 데이터(videoUrls 없음 / 삭제된 섹션 존재)를 마이그레이션 */
function migrateSections(stored) {
    const validStored = stored.filter((s) => VALID_KEYS.includes(s.key));
    const merged = DEFAULT_SECTIONS.map((def) => {
        const existing = validStored.find((s) => s.key === def.key);
        if (!existing) return def;
        return {
            ...def,
            ...existing,
            videoUrls: existing.videoUrls ?? (existing.videoUrl ? [existing.videoUrl] : []),
        };
    });
    return merged;
}

export function useAdminSections() {
    const [sections, setSections] = useState(() => {
        try {
            const stored = localStorage.getItem(SECTIONS_KEY);
            return stored ? migrateSections(JSON.parse(stored)) : DEFAULT_SECTIONS;
        } catch {
            return DEFAULT_SECTIONS;
        }
    });

    // 1. Fetch from Supabase on mount
    useEffect(() => {
        const fetchFromSupabase = async () => {
            const { data, error } = await supabase
                .from('sections')
                .select('*, section_images(*)');

            if (!error && data && data.length > 0) {
                const mapped = data.map(s => ({
                    key: s.key,
                    label: s.label,
                    videoUrls: s.video_urls || [],
                    images: (s.section_images || []).map(img => ({
                        id: img.id,
                        url: img.url,
                        name: img.name,
                        order: img.order_index
                    })).sort((a, b) => a.order - b.order)
                }));
                // Merge with default to ensure all keys exist
                const merged = migrateSections(mapped);
                setSections(merged);
            }
        };
        fetchFromSupabase();
    }, []);

    // 2. Save to local storage whenever sections change
    useEffect(() => {
        localStorage.setItem(SECTIONS_KEY, JSON.stringify(sections));
    }, [sections]);

    const updateSection = useCallback(async (key, updates) => {
        setSections((prev) =>
            prev.map((s) => (s.key === key ? { ...s, ...updates } : s))
        );

        // Sync to Supabase
        if (updates.videoUrls) {
            await supabase
                .from('sections')
                .update({ video_urls: updates.videoUrls, updated_at: new Date().toISOString() })
                .eq('key', key);
        }
    }, []);

    // 이미지 추가 (Supabase Storage & DB 연동)
    const addImage = useCallback(async (sectionKey, imageFile, fileName, insertIndex = null) => {
        // 1. Local Preview Update (Optimistic UI part)
        const reader = new FileReader();
        reader.onload = (e) => {
            const imageDataUrl = e.target.result;
            setSections((prev) =>
                prev.map((s) => {
                    if (s.key !== sectionKey) return s;
                    const newImg = {
                        id: 'temp-' + Date.now(),
                        url: imageDataUrl,
                        name: fileName,
                        addedAt: new Date().toISOString(),
                    };
                    const imgs = [...s.images];
                    if (insertIndex !== null) imgs.splice(insertIndex, 0, newImg);
                    else imgs.push(newImg);
                    return { ...s, images: imgs };
                })
            );
        };
        reader.readAsDataURL(imageFile);

        // 2. Supabase Upload
        try {
            const filePath = `${sectionKey}/${Date.now()}_${fileName}`;
            const { data: uploadData, error: uploadError } = await supabase.storage
                .from('media')
                .upload(filePath, imageFile);

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from('media')
                .getPublicUrl(filePath);

            // 3. Database Sync
            const { data: dbData, error: dbError } = await supabase
                .from('section_images')
                .insert([{
                    section_key: sectionKey,
                    url: publicUrl,
                    name: fileName,
                    order_index: insertIndex ?? 999
                }])
                .select()
                .single();

            if (dbError) throw dbError;

            // 4. Update with real ID
            setSections((prev) =>
                prev.map((s) => {
                    if (s.key !== sectionKey) return s;
                    return {
                        ...s,
                        images: s.images.map(img => img.id.startsWith('temp-') && img.name === fileName ? { ...img, id: dbData.id, url: publicUrl } : img)
                    };
                })
            );
        } catch (err) {
            console.error('Failed to upload image to Supabase:', err);
        }
    }, []);

    const removeImage = useCallback(async (sectionKey, imageId) => {
        // Optimistic UI
        setSections((prev) =>
            prev.map((s) => {
                if (s.key !== sectionKey) return s;
                return { ...s, images: s.images.filter((img) => img.id !== imageId) };
            })
        );

        // 1. Get storage path from DB or URL
        // If it's a UUID (Supabase ID), delete from DB
        if (imageId.length > 20) {
            try {
                // Delete from DB (RLS and FK cascade should handle storage if configured, or we do it manually)
                const { data, error } = await supabase
                    .from('section_images')
                    .delete()
                    .eq('id', imageId)
                    .select('url')
                    .single();

                if (!error && data) {
                    // Extract path from URL to delete from storage if needed
                    const url = data.url;
                    const path = url.split('/storage/v1/object/public/media/')[1];
                    if (path) {
                        await supabase.storage.from('media').remove([path]);
                    }
                }
            } catch (err) {
                console.error('Failed to delete from Supabase:', err);
            }
        }
    }, []);

    const reorderImages = useCallback((sectionKey, fromIndex, toIndex) => {
        setSections((prev) =>
            prev.map((s) => {
                if (s.key !== sectionKey) return s;
                const imgs = [...s.images];
                const [moved] = imgs.splice(fromIndex, 1);
                imgs.splice(toIndex, 0, moved);
                return { ...s, images: imgs };
            })
        );
    }, []);

    const updateVideoUrl = useCallback(
        (sectionKey, videoUrl) => {
            updateSection(sectionKey, { videoUrl });
        },
        [updateSection]
    );

    const addVideoUrl = useCallback((sectionKey, videoUrl) => {
        const trimmed = videoUrl.trim();
        if (!trimmed) return;
        setSections((prev) => {
            const updated = prev.map((s) => {
                if (s.key !== sectionKey) return s;
                if (s.videoUrls.includes(trimmed)) return s;
                const newUrls = [...s.videoUrls, trimmed];
                // Async sync
                supabase
                    .from('sections')
                    .update({ video_urls: newUrls, updated_at: new Date().toISOString() })
                    .eq('key', sectionKey)
                    .then();
                return { ...s, videoUrls: newUrls };
            });
            return updated;
        });
    }, []);

    const removeVideoUrl = useCallback((sectionKey, index) => {
        setSections((prev) => {
            const updated = prev.map((s) => {
                if (s.key !== sectionKey) return s;
                const newUrls = s.videoUrls.filter((_, i) => i !== index);
                supabase
                    .from('sections')
                    .update({ video_urls: newUrls, updated_at: new Date().toISOString() })
                    .eq('key', sectionKey)
                    .then();
                return { ...s, videoUrls: newUrls };
            });
            return updated;
        });
    }, []);

    const reorderVideoUrls = useCallback((sectionKey, fromIndex, toIndex) => {
        setSections((prev) => {
            const updated = prev.map((s) => {
                if (s.key !== sectionKey) return s;
                const urls = [...s.videoUrls];
                const [moved] = urls.splice(fromIndex, 1);
                urls.splice(toIndex, 0, moved);
                supabase
                    .from('sections')
                    .update({ video_urls: urls, updated_at: new Date().toISOString() })
                    .eq('key', sectionKey)
                    .then();
                return { ...s, videoUrls: urls };
            });
            return updated;
        });
    }, []);

    return {
        sections,
        updateSection,
        addImage,
        removeImage,
        reorderImages,
        updateVideoUrl,
        addVideoUrl,
        removeVideoUrl,
        reorderVideoUrls,
    };
}

export function useAdminInquiries() {
    const [inquiries, setInquiries] = useState([]);

    // 1. Fetch from Supabase
    useEffect(() => {
        const fetchInquiries = async () => {
            const { data, error } = await supabase
                .from('inquiries')
                .select('*')
                .order('created_at', { ascending: false });

            if (!error && data) {
                setInquiries(data.map(inq => ({
                    id: inq.id,
                    name: inq.name,
                    email: inq.email,
                    phone: inq.phone || '',
                    subject: inq.subject || '',
                    message: inq.message,
                    isRead: inq.is_read,
                    createdAt: inq.created_at
                })));
            } else {
                // Fallback to local storage if Supabase fails
                const stored = localStorage.getItem(INQUIRIES_KEY);
                if (stored) setInquiries(JSON.parse(stored));
            }
        };
        fetchInquiries();
    }, []);

    // 2. Sync to localStorage for redundancy
    useEffect(() => {
        localStorage.setItem(INQUIRIES_KEY, JSON.stringify(inquiries));
    }, [inquiries]);

    const addInquiry = useCallback(async (inquiry) => {
        const newInq = {
            id: Date.now().toString(), // Temp ID
            ...inquiry,
            createdAt: new Date().toISOString(),
            isRead: false,
        };

        setInquiries((prev) => [newInq, ...prev]);

        // Sync to Supabase
        await supabase
            .from('inquiries')
            .insert([{
                name: inquiry.name,
                email: inquiry.email,
                phone: inquiry.phone,
                subject: inquiry.subject,
                message: inquiry.message,
                is_read: false
            }]);
    }, []);

    const markAsRead = useCallback(async (id) => {
        setInquiries((prev) =>
            prev.map((inq) => (inq.id === id ? { ...inq, isRead: true } : inq))
        );

        // Sync to Supabase (only if ID is UUID)
        if (id.length > 20) {
            await supabase
                .from('inquiries')
                .update({ is_read: true })
                .eq('id', id);
        }
    }, []);

    const deleteInquiry = useCallback(async (id) => {
        setInquiries((prev) => prev.filter((inq) => inq.id !== id));

        // Sync to Supabase
        if (id.length > 20) {
            await supabase
                .from('inquiries')
                .delete()
                .eq('id', id);
        }
    }, []);

    const unreadCount = inquiries.filter((inq) => !inq.isRead).length;

    return { inquiries, addInquiry, markAsRead, deleteInquiry, unreadCount };
}

export function useAdminActivities() {
    const [activities, setActivities] = useState([]);

    const fetchActivities = useCallback(async () => {
        const { data, error } = await supabase
            .from('activities')
            .select('*')
            .order('event_date', { ascending: false });
        if (!error && data) setActivities(data);
    }, []);

    useEffect(() => {
        fetchActivities();
    }, [fetchActivities]);

    const addActivity = async (activity, posterFile) => {
        let posterUrl = activity.poster_url;

        if (posterFile) {
            const filePath = `activities/${Date.now()}_${posterFile.name}`;
            const { data: uploadData, error: uploadError } = await supabase.storage
                .from('media')
                .upload(filePath, posterFile);

            if (!uploadError) {
                const { data: { publicUrl } } = supabase.storage
                    .from('media')
                    .getPublicUrl(filePath);
                posterUrl = publicUrl;
            }
        }

        const { data, error } = await supabase
            .from('activities')
            .insert([{ ...activity, poster_url: posterUrl }])
            .select()
            .single();

        if (!error && data) {
            setActivities(prev => [data, ...prev].sort((a, b) => new Date(b.event_date) - new Date(a.event_date)));
        }
        return { data, error };
    };

    const updateActivity = async (id, updates, posterFile) => {
        let posterUrl = updates.poster_url;

        if (posterFile) {
            const filePath = `activities/${Date.now()}_${posterFile.name}`;
            await supabase.storage.from('media').upload(filePath, posterFile);
            const { data: { publicUrl } } = supabase.storage.from('media').getPublicUrl(filePath);
            posterUrl = publicUrl;
        }

        const { data, error } = await supabase
            .from('activities')
            .update({ ...updates, poster_url: posterUrl })
            .eq('id', id)
            .select()
            .single();

        if (!error && data) {
            setActivities(prev => prev.map(a => a.id === id ? data : a));
        }
        return { data, error };
    };

    const deleteActivity = async (id) => {
        const activity = activities.find(a => a.id === id);
        const { error } = await supabase.from('activities').delete().eq('id', id);
        if (!error) {
            setActivities(prev => prev.filter(a => a.id !== id));
            if (activity?.poster_url) {
                const path = activity.poster_url.split('/storage/v1/object/public/media/')[1];
                if (path) await supabase.storage.from('media').remove([path]);
            }
        }
    };

    return { activities, addActivity, updateActivity, deleteActivity, refresh: fetchActivities };
}

export function useAdminSideNotices() {
    const [notices, setNotices] = useState([]);

    useEffect(() => {
        const fetchNotices = async () => {
            const { data, error } = await supabase.from('side_notices').select('*').order('created_at', { ascending: false });
            if (!error && data) setNotices(data);
        };
        fetchNotices();
    }, []);

    const addNotice = async (content) => {
        const { data, error } = await supabase.from('side_notices').insert([{ content }]).select().single();
        if (!error && data) setNotices(prev => [data, ...prev]);
        return { data, error };
    };

    const deleteNotice = async (id) => {
        const { error } = await supabase.from('side_notices').delete().eq('id', id);
        if (!error) setNotices(prev => prev.filter(n => n.id !== id));
    };

    return { notices, addNotice, deleteNotice };
}

export function useAdminSiteSettings() {
    const [settings, setSettings] = useState({});

    useEffect(() => {
        const fetchSettings = async () => {
            const { data, error } = await supabase.from('site_settings').select('*');
            if (!error && data) {
                const mapped = data.reduce((acc, curr) => {
                    acc[curr.key] = curr.value;
                    return acc;
                }, {});
                setSettings(mapped);
            }
        };
        fetchSettings();
    }, []);

    const updateSetting = async (key, value) => {
        const { error } = await supabase.from('site_settings').upsert({ key, value, updated_at: new Date().toISOString() });
        if (!error) {
            setSettings(prev => ({ ...prev, [key]: value }));
        }
        return { error };
    };

    return { settings, updateSetting };
}

export function useAdminDonors() {
    const [donors, setDonors] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchDonors = useCallback(async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('donors')
            .select('*')
            .order('donated_at', { ascending: false });
        if (!error && data) setDonors(data);
        setLoading(false);
    }, []);

    useEffect(() => {
        fetchDonors();
    }, [fetchDonors]);

    const addDonor = async (donor) => {
        const { data, error } = await supabase
            .from('donors')
            .insert([donor])
            .select()
            .single();
        if (!error && data) {
            setDonors(prev => [data, ...prev].sort((a, b) => {
                if (!a.donated_at) return 1;
                if (!b.donated_at) return -1;
                return new Date(b.donated_at) - new Date(a.donated_at);
            }));
        }
        return { data, error };
    };

    const updateDonor = async (id, updates) => {
        const { data, error } = await supabase
            .from('donors')
            .update(updates)
            .eq('id', id)
            .select()
            .single();
        if (!error && data) {
            setDonors(prev => prev.map(d => d.id === id ? data : d));
        }
        return { data, error };
    };

    const deleteDonor = async (id) => {
        const { error } = await supabase.from('donors').delete().eq('id', id);
        if (!error) setDonors(prev => prev.filter(d => d.id !== id));
        return { error };
    };

    const toggleVisibility = async (id, is_visible) => {
        return updateDonor(id, { is_visible });
    };

    return { donors, loading, addDonor, updateDonor, deleteDonor, toggleVisibility, refresh: fetchDonors };
}
