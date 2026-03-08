import { Box } from '@mui/material';
import Navbar from '../../ux/디자인과/components/Navbar';
import HeroSection from '../../ux/디자인과/components/HeroSection';
import AboutSection from '../../ux/디자인과/components/AboutSection';
import PerformancesSection from '../../ux/디자인과/components/PerformancesSection';
import GallerySection from '../../ux/디자인과/components/GallerySection';
import ContactSection from '../../ux/디자인과/components/ContactSection';

export default {
    title: 'Pages/LandingPage',
    parameters: {
        layout: 'fullscreen',
    },
};

export const Default = () => (
    <>
        <Navbar />
        <Box component="main">
            <HeroSection />
            <AboutSection />
            <PerformancesSection />
            <GallerySection />
            <ContactSection />
        </Box>
    </>
);
