// App.jsx
import React from 'react';
import { RouterProvider } from '@tanstack/react-router';

// Import your components
import { router } from './routes.tsx';

// Initialize the Query Client

function App() {
    return (
        <>
            <RouterProvider router={router} />
        </>
    );
}

export default App;
