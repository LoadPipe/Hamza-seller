import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import '@rainbow-me/rainbowkit/styles.css';

import App from './App.tsx';

import { RainbowWrapper } from './rainbowkit/RainbowProvider.tsx';

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <RainbowWrapper>
            <App />
        </RainbowWrapper>
    </StrictMode>
);
