/**
 * 유튜브 URL에서 비디오 ID를 추출합니다.
 * 지원 포맷: watch?v=, youtu.be/, embed/
 */
export function getYouTubeVideoId(url) {
    if (!url) return null;
    const match = url.match(
        /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&?/]+)/
    );
    return match ? match[1] : null;
}

/**
 * 유튜브 URL을 embed URL로 변환합니다.
 */
export function getYouTubeEmbedUrl(url) {
    const id = getYouTubeVideoId(url);
    return id ? `https://www.youtube.com/embed/${id}` : null;
}

/**
 * 유튜브 비디오 ID로부터 썸네일 URL을 반환합니다.
 * quality: 'default' | 'mqdefault' | 'hqdefault' | 'sddefault' | 'maxresdefault'
 */
export function getYouTubeThumbnailUrl(urlOrId, quality = 'hqdefault') {
    if (!urlOrId) return null;
    // 이미 ID만 들어온 경우 (11자 내외)
    const id = urlOrId.length < 20 ? urlOrId : getYouTubeVideoId(urlOrId);
    if (!id) return null;
    return `https://img.youtube.com/vi/${id}/${quality}.jpg`;
}

/**
 * URL로부터 유튜브 watch URL을 반환합니다.
 */
export function getYouTubeWatchUrl(url) {
    const id = getYouTubeVideoId(url);
    return id ? `https://www.youtube.com/watch?v=${id}` : url;
}
