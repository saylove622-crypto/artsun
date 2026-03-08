import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import AboutSection from '../components/AboutSection';
import PerformancesSection from '../components/PerformancesSection';
import GallerySection from '../components/GallerySection';
import ContactSection from '../components/ContactSection';
import ActivityHistorySection from '../components/ActivityHistorySection';
import RecruitmentSection from '../components/RecruitmentSection';
import DonationSection from '../components/DonationSection';
import LocationSection from '../components/LocationSection';
import AdminFooterIcon from '../../admin/AdminFooterIcon';

export default function HomePage() {
    return (
        <>
            <Navbar />
            <Box component="main">
                <HeroSection />
                <AboutSection />
                <ActivityHistorySection />
                <RecruitmentSection />
                <PerformancesSection />
                <GallerySection />
                <DonationSection />
                <ContactSection />
                <LocationSection />

                {/* Footer relocated here */}
                <Box
                    sx={{
                        py: { xs: 6, md: 8 },
                        borderTop: '1px solid rgba(0,0,0,0.05)',
                        textAlign: 'center',
                        bgcolor: 'background.default'
                    }}
                >
                    <Typography
                        sx={{
                            fontFamily: '"Noto Serif KR", serif',
                            fontSize: '0.85rem',
                            color: 'text.secondary',
                            opacity: 0.5,
                            letterSpacing: '0.1em',
                            mb: 1,
                        }}
                    >
                        아트컴퍼니 아르-선
                    </Typography>
                    <Typography
                        sx={{
                            fontSize: '0.7rem',
                            color: 'text.secondary',
                            opacity: 0.3,
                            letterSpacing: '0.05em',
                        }}
                    >
                        © {new Date().getFullYear()} Art Company ART-SUN. All rights reserved.
                    </Typography>
                </Box>
            </Box>
            <AdminFooterIcon />
        </>
    );
}
