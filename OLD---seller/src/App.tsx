import { RouterProvider } from '@tanstack/react-router';
import { router } from './routes.tsx';

function App() {
    return (
        <div>
            {/* Show LoginPage if wallet is not connected */}
            <RouterProvider router={router} />
        </div>
    );
}

export default App;
