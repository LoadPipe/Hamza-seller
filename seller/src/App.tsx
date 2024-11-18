import { RouterProvider } from '@tanstack/react-router';

import { router } from './routes.tsx';

function App() {
    return (
        <div>
            <RouterProvider router={router} />
        </div>
    );
}

export default App;
