import {
    useMutation,
    useQuery,
    UseMutationResult,
    UseQueryResult,
} from '@tanstack/react-query';
import { get, post, put, del } from '../api/apiService';

// Define a hook for POST request with generic types
export const usePostData = <T, R>(
    endpoint: string,
    data: T
): UseMutationResult<R, unknown, void, unknown> => {
    return useMutation<R, unknown, void>({
        mutationFn: () => post(endpoint, data),
    });
};

// Define a hook for GET request with a generic return type
export const useGetData = <R>(endpoint: string): UseQueryResult<R, unknown> => {
    return useQuery<R, unknown>({
        queryKey: [endpoint],
        queryFn: () => get(endpoint),
    });
};

// Define a hook for PUT request with generic types
export const usePutData = <T, R>(
    endpoint: string,
    data: T
): UseMutationResult<R, unknown, void, unknown> => {
    return useMutation<R, unknown, void>({
        mutationFn: () => put(endpoint, data),
    });
};

// Define a hook for DELETE request with a generic return type
export const useDeleteData = <R>(
    endpoint: string
): UseMutationResult<R, unknown, void, unknown> => {
    return useMutation<R, unknown, void>({
        mutationFn: () => del(endpoint),
    });
};
