import React, { useState, useMemo } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ThemeProvider } from '@mui/material/styles';
import getAppTheme from './Theme';
import { Box, IconButton, Tooltip } from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';

// Контекст для перемикання теми
const ColorModeContext = React.createContext({ toggleColorMode: () => {} });

function Main() {
    const [mode, setMode] = useState('light'); 

    const colorMode = useMemo(
        () => ({
            toggleColorMode: () => {
                setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
            },
        }),
        [],
    );

    const theme = useMemo(() => getAppTheme(mode), [mode]);

    return (
        <ColorModeContext.Provider value={colorMode}>
            <ThemeProvider theme={theme}>
                <App />
                
                {/* Кнопка перемикання теми (розташована внизу праворуч) */}
                <Box
                    sx={{
                        position: 'fixed',
                        bottom: 16,
                        right: 16,
                        zIndex: 1000,
                        backgroundColor: theme.palette.background.paper,
                        borderRadius: '50%',
                        boxShadow: theme.shadows[6],
                    }}
                >
                    <Tooltip title={`Увімкнути ${mode === 'light' ? 'темну' : 'світлу'} тему`}>
                        <IconButton sx={{ ml: 1 }} onClick={colorMode.toggleColorMode} color="inherit">
                            {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
                        </IconButton>
                    </Tooltip>
                </Box>
            </ThemeProvider>
        </ColorModeContext.Provider>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <Main />
    </React.StrictMode>
);

export { ColorModeContext };