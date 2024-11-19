import { RouterProvider } from '@tanstack/react-router';
import { useAccount } from 'wagmi';
import { router } from './routes.tsx';
import { LoginPage } from './pages/login/LoginPage.tsx';

function App() {
    const { isConnected } = useAccount(); // Check if the wallet is connected

    return (
        <div>
            {/* Show LoginPage if wallet is not connected */}
            {!isConnected ? <LoginPage /> : <RouterProvider router={router} />}
        </div>
    );
}

export default App;
