import axiosClient from '../src/api/axiosClient'; // Use the exact instance from your apiService
import AxiosMockAdapter from 'axios-mock-adapter';
import { get, post, put, del } from '../src/api/apiService';
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
    mock.onGet('/test-endpoint').reply(200, { data: { message: 'success' } });
    mock.onAny().reply(500);

    const setLoadingSpy = jest.spyOn(useLoadingStore.getState(), 'setLoading');
    await get('/test-endpoint');

    expect(setLoadingSpy).toHaveBeenCalledWith(true); // Loading starts
    expect(setLoadingSpy).toHaveBeenCalledWith(false); // Loading ends
});

test('shows toast error message on GET failure', async () => {
    mock.onGet('/test-endpoint').reply(500, {
        data: { message: 'Internal Server Error' },
    });

    const toastSpy = jest.spyOn(toast, 'error');
    await expect(get('/test-endpoint')).rejects.toThrow();

    expect(toastSpy).toHaveBeenCalledWith('Internal Server Error');
});

test('sets loading to true and then false on POST success', async () => {
    mock.onPost('/test-endpoint').reply(200, {
        data: { message: 'post success' },
    });
    mock.onAny().reply(500);

    const setLoadingSpy = jest.spyOn(useLoadingStore.getState(), 'setLoading');
    const response = await post('/test-endpoint', { key: 'value' });

    expect(response).toEqual({ message: 'post success' });
    expect(setLoadingSpy).toHaveBeenCalledWith(true);
    expect(setLoadingSpy).toHaveBeenCalledWith(false);
});

test('shows toast error message on POST failure', async () => {
    mock.onPost('/test-endpoint').reply(500, {
        data: { message: 'Internal Server Error' },
    });

    const toastSpy = jest.spyOn(toast, 'error');
    await expect(post('/test-endpoint', { key: 'value' })).rejects.toThrow();

    expect(toastSpy).toHaveBeenCalledWith('Internal Server Error');
});

test('sets loading to true and then false on PUT success', async () => {
    mock.onPut('/test-endpoint').reply(200, {
        data: { message: 'put success' },
    });
    mock.onAny().reply(500);

    const setLoadingSpy = jest.spyOn(useLoadingStore.getState(), 'setLoading');
    const response = await put('/test-endpoint', { key: 'value' });

    expect(response).toEqual({ message: 'put success' });
    expect(setLoadingSpy).toHaveBeenCalledWith(true);
    expect(setLoadingSpy).toHaveBeenCalledWith(false);
});

test('shows toast error message on PUT failure', async () => {
    mock.onPut('/test-endpoint').reply(500, {
        data: { message: 'Internal Server Error' },
    });

    const toastSpy = jest.spyOn(toast, 'error');
    await expect(put('/test-endpoint', { key: 'value' })).rejects.toThrow();

    expect(toastSpy).toHaveBeenCalledWith('Internal Server Error');
});

test('sets loading to true and then false on DELETE success', async () => {
    mock.onDelete('/test-endpoint').reply(200, {
        data: { message: 'delete success' },
    });
    mock.onAny().reply(500);

    const setLoadingSpy = jest.spyOn(useLoadingStore.getState(), 'setLoading');
    const response = await del('/test-endpoint');

    expect(response).toEqual({ message: 'delete success' });
    expect(setLoadingSpy).toHaveBeenCalledWith(true);
    expect(setLoadingSpy).toHaveBeenCalledWith(false);
});

test('shows toast error message on DELETE failure', async () => {
    mock.onDelete('/test-endpoint').reply(500, {
        data: { message: 'Internal Server Error' },
    });

    const toastSpy = jest.spyOn(toast, 'error');
    await expect(del('/test-endpoint')).rejects.toThrow();

    expect(toastSpy).toHaveBeenCalledWith('Internal Server Error');
});
