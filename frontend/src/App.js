import React from 'react';
import TodoApp from './components/TodoApp';
import { useTheme } from '@mui/material/styles';
import { Box, CssBaseline } from '@mui/material';

function App() {
    const theme = useTheme();

    return (
        // Застосовуємо загальний фон до всього body, використовуючи theme.palette.background.default
        <Box sx={{ minHeight: '100vh', backgroundColor: theme.palette.background.default }}>
            <CssBaseline />
            <TodoApp />
        </Box>
    );
}

export default App;