import { AxiosError } from 'axios';
import toast from 'react-hot-toast';
import useLoadingStore from '../stores/error-handler/loadingStore';

function errorHandler(error: AxiosError): Promise<never> {
    const setLoading = useLoadingStore.getState().setLoading;
    setLoading(false); // Stop the global loading state

    // Show a toast notification with an error message
    toast.error('An error occurred. Please try again.');

    return Promise.reject(error);
}

export default errorHandler;
