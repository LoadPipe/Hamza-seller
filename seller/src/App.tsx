import { RouterProvider } from '@tanstack/react-router';
import { useAccount } from 'wagmi';
import { router } from './routes.tsx';
import LoginPage from './pages/login/LoginPage.tsx';

function App() {
    return (
        <div>
            {/* Show LoginPage if wallet is not connected */}
            <RouterProvider router={router} />
        </div>
    );
}

export default App;
