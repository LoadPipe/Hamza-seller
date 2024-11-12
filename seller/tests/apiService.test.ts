import axiosClient from '../src/api/axiosClient'; // Use the exact instance from your apiService
import AxiosMockAdapter from 'axios-mock-adapter';
import { get } from '../src/api/apiService';
import { toast } from 'react-hot-toast';
import useLoadingStore from '../src/stores/error-handler/loadingStore';

let mock: InstanceType<typeof AxiosMockAdapter>;

beforeAll(() => {
    // Initialize the mock adapter on the custom axios instance
    mock = new AxiosMockAdapter(axiosClient);
});

beforeEach(() => {
    mock.reset();
    jest.clearAllMocks();
});

test('sets loading to true and then false on GET success', async () => {
    // Mocking the GET request specifically for success
    mock.onGet('/test-endpoint').reply(200, { data: { message: 'success' } });

    // Apply a catch-all after specific mocks
    mock.onAny().reply(500);

    const setLoadingSpy = jest.spyOn(useLoadingStore.getState(), 'setLoading');
    await get('/test-endpoint');

    expect(setLoadingSpy).toHaveBeenCalledWith(true); // Loading starts
    expect(setLoadingSpy).toHaveBeenCalledWith(false); // Loading ends
});

test('shows toast error message on API failure', async () => {
    // Mocking the GET request specifically for failure with the correct error structure
    mock.onGet('/test-endpoint').reply(500, {
        data: { message: 'Internal Server Error' }, // Ensure message is nested under `data`
    });

    const toastSpy = jest.spyOn(toast, 'error');
    await expect(get('/test-endpoint')).rejects.toThrow();

    expect(toastSpy).toHaveBeenCalledWith('Internal Server Error');
});
