import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from '../src/system/theme/theme';
import '../src/ux/디자인과/styles/global.css';

/** @type { import('@storybook/react-vite').Preview } */
const preview = {
    parameters: {
        controls: {
            matchers: {
                color: /(background|color)$/i,
                date: /Date$/i,
            },
        },
        a11y: {
            test: 'todo',
        },
        layout: 'fullscreen',
        backgrounds: {
            disable: true,
        },
    },
    decorators: [
        (Story) => (
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <Story />
            </ThemeProvider>
        ),
    ],
};

export default preview;
