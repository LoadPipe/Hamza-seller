import { RouterProvider } from '@tanstack/react-router';
import { useAccount } from 'wagmi';
import { router } from './routes.tsx';
import LoginPage from './pages/login/LoginPage.tsx';
import getNonce from './utils/authentication/getNonce.ts';
import sendVerifyRequest from './utils/authentication/sendVerifyRequest.ts';

function App() {
    const { isConnected } = useAccount();

    return (
        <div>
            {/* Show LoginPage if wallet is not connected */}
            {!isConnected ? <LoginPage /> : <RouterProvider router={router} />}
        </div>
    );
}

export default App;
