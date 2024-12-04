import axiosClient from './axiosClient';
import useLoadingStore from '../stores/error-handler/loadingStore';
import { toast } from 'react-hot-toast';

// Define the structure of RequestOptions for configuring requests
interface RequestOptions {
    headers?: Record<string, string>;
    params?: Record<string, unknown>; // Adjust the types as necessary
}

// Define the structure of an API error response
interface ApiErrorResponse {
    message?: string;
    response?: {
        data?: {
            message?: string;
            [key: string]: unknown;
        };
        status?: number;
        [key: string]: unknown;
    };
}

// Define a generic interface for API responses
interface ApiResponse<T> {
    data: T;
}

// Error handler function
const errorHandler = (error: ApiErrorResponse) => {
    const setLoading = useLoadingStore.getState().setLoading;
    setLoading(false);

    const errorMessage =
        error.response?.data?.message || 'Internal Server Error';
    toast.error(errorMessage);

    return Promise.reject(error);
};

// Generic CRUD functions

export const post = async <T, R>(
    endpoint: string,
    data: T,
    options: RequestOptions = {}
): Promise<R> => {
    const setLoading = useLoadingStore.getState().setLoading;
    setLoading(true);
    try {
        const response = await axiosClient.post<ApiResponse<R>>(
            endpoint,
            data,
            options
        );
        setLoading(false);
        return response.data.data; // Access `data` from `ApiResponse`
    } catch (error) {
        return errorHandler(error as ApiErrorResponse);
    }
};

export const get = async <R>(
    endpoint: string,
    options: RequestOptions = {}
): Promise<R> => {
    const setLoading = useLoadingStore.getState().setLoading;
    setLoading(true);
    try {
        const response = await axiosClient.get<ApiResponse<R>>(
            endpoint,
            options
        );
        setLoading(false);
        return response.data.data; // Access `data` from `ApiResponse`
    } catch (error) {
        return errorHandler(error as ApiErrorResponse);
    }
};

export const put = async <T, R>(
    endpoint: string,
    data: T,
    options: RequestOptions = {}
): Promise<R> => {
    const setLoading = useLoadingStore.getState().setLoading;
    setLoading(true);
    try {
        const response = await axiosClient.put<ApiResponse<R>>(
            endpoint,
            data,
            options
        );
        setLoading(false);
        return response.data.data; // Access `data` from `ApiResponse`
    } catch (error) {
        return errorHandler(error as ApiErrorResponse);
    }
};

export const del = async <R>(
    endpoint: string,
    options: RequestOptions = {}
): Promise<R> => {
    const setLoading = useLoadingStore.getState().setLoading;
    setLoading(true);
    try {
        const response = await axiosClient.delete<ApiResponse<R>>(
            endpoint,
            options
        );
        setLoading(false);
        return response.data.data; // Access `data` from `ApiResponse`
    } catch (error) {
        return errorHandler(error as ApiErrorResponse);
    }
};
