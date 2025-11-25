import { createTheme } from '@mui/material/styles';

const CATEGORY_COLORS = {
    personal: '#e879f9', work: '#f97316', study: '#06b6d4',
    sport: '#4ade80', finance: '#facc15', other: '#9ca3af',
};

const getAppTheme = (mode) => createTheme({
    palette: {
        mode,
        primary: { main: mode === 'dark' ? '#9FA8DA' : '#667eea' },
        secondary: { main: mode === 'dark' ? '#E0B9FF' : '#764ba2' },
        background: {
            default: mode === 'dark' ? '#121212' : '#f0f4f8', 
            paper: mode === 'dark' ? '#1e1e1e' : '#ffffff', 
        },
        text: {
            // Робимо текст більш "м'яким" чорним, а не #000000
            primary: mode === 'dark' ? '#fff' : '#111827', 
            secondary: mode === 'dark' ? '#a1a1aa' : '#6b7280',
        },
        error: { main: '#EF4444' },
        success: { main: '#10B981' },
        category: CATEGORY_COLORS,
    },
    typography: {
        // Встановлюємо сучасний шрифт Inter (або Poppins, якщо він підключений)
        fontFamily: ['"Inter"', '"Poppins"', 'sans-serif'].join(','),
        h1: { fontWeight: 800 },
        h2: { fontWeight: 800 },
        h3: {
            fontWeight: 900, // Дуже жирний
            fontSize: '2.5rem',
            color: mode === 'dark' ? '#fff' : '#111827',
            letterSpacing: '-0.03em', // Стильний "щільний" текст
        },
        h4: { // Це використовується для заголовка "Усі Задачі"
             fontWeight: 800,
             color: mode === 'dark' ? '#fff' : '#1f2937',
             letterSpacing: '-0.025em',
        },
        h5: { fontWeight: 700, letterSpacing: '-0.01em' },
        h6: {
            fontWeight: 600,
            fontSize: '1.1rem',
            lineHeight: 1.4,
        },
        body1: {
            fontSize: '1rem',
            lineHeight: 1.6,
            fontWeight: 500, // Трохи жирніший основний текст
        },
        body2: {
            fontSize: '0.875rem',
            fontWeight: 400,
            color: mode === 'dark' ? '#9ca3af' : '#4b5563',
        },
        button: {
            fontWeight: 700,
            textTransform: 'none', 
            fontSize: '0.9rem',
            letterSpacing: '0.01em'
        },
    },
    components: {
        // ... (інші стилі залишаються, але оновлені для чистоти)
        MuiCssBaseline: {
            styleOverrides: {
                body: {
                    '&::-webkit-scrollbar': { width: '6px', height: '6px' },
                    '&::-webkit-scrollbar-thumb': { backgroundColor: mode === 'dark' ? '#444' : '#ccc', borderRadius: '3px' },
                    '&::-webkit-scrollbar-track': { backgroundColor: 'transparent' },
                },
            },
        },
        MuiDrawer: {
            styleOverrides: {
                paper: { 
                    '&::-webkit-scrollbar': { width: '6px' },
                    '&::-webkit-scrollbar-thumb': { backgroundColor: mode === 'dark' ? '#555' : '#bbb', borderRadius: '3px' },
                    '&::-webkit-scrollbar-track': { backgroundColor: 'transparent' },
                }
            }
        },
        MuiButton: {
            styleOverrides: {
                root: { borderRadius: 12, boxShadow: '0 4px 10px rgba(0,0,0,0.05)', transition: 'all 0.2s', '&:hover': { transform: 'translateY(-1px)', boxShadow: '0 6px 15px rgba(0,0,0,0.1)' }, },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: { borderRadius: 16, boxShadow: mode === 'light' ? '0 4px 20px rgba(0,0,0,0.03)' : '0 10px 30px rgba(0,0,0,0.4)', transition: 'all 0.3s ease-in-out', },
            },
        },
        MuiCard: {
            styleOverrides: {
                 root: {
                    borderRadius: 16, transition: 'all 0.2s cubic-bezier(.25,.8,.25,1)', 
                    boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                    '&:hover': { boxShadow: '0 8px 24px rgba(0,0,0,0.08)', transform: 'translateY(-2px)', },
                },
            },
        },
        MuiInputAdornment: {
            styleOverrides: { root: ({ theme }) => ({ color: theme.palette.primary.main }) },
        },
        MuiMenu: {
            styleOverrides: { paper: ({ theme }) => ({ backgroundColor: theme.palette.background.paper, boxShadow: theme.shadows[10] }) },
        },
        MuiPickersPopper: {
             styleOverrides: { paper: ({ theme }) => ({ backgroundColor: theme.palette.background.paper, boxShadow: theme.shadows[10] }) },
        }
    },
});

export default getAppTheme;