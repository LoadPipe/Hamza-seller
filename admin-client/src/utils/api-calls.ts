import axios from 'axios';
import { getJwtToken } from './authentication';
const BACKEND_URL =
    import.meta.env.VITE_MEDUSA_BACKEND_URL || 'http://localhost:9000';

export async function axiosCall(
    verb: 'get' | 'post' | 'patch' | 'put' | 'delete',
    path: string,
    payload: any,
    requiresSecurity: boolean = false,
    returnRaw: boolean = false
): Promise<any> {
    try {
        console.log(
            `calling ${verb.toUpperCase()} ${path} ${payload ? JSON.stringify(payload) : ''}`
        );
        let url = path;
        if (!url.startsWith('/')) url = '/' + url;
        url = `${BACKEND_URL}${url}`;

        let config: any = {
            cache: false,
            headers: { 'Cache-Control': 'no-cache, no-store' },
        };
        if (requiresSecurity) {
            config.headers.authorization = `Bearer ${getJwtToken()}`;
        }

        let response = { data: undefined };
        switch (verb) {
            case 'get':
                {
                    const input: any = {};
                    if (payload) input.params = payload;
                    if (requiresSecurity) input.headers = config?.headers;
                    if (!input.cache) {
                        input.cache = false;
                    }

                    response = await axios.get(url, input);
                }
                break;
            case 'delete':
                {
                    const input: any = {};
                    if (payload) input.data = payload;
                    if (requiresSecurity) input.headers = config?.headers;
                    if (!input.cache) {
                        input.cache = false;
                    }

                    response = await axios.delete(url, input);
                }
                break;
            case 'put':
                response = await axios.put(url, payload, config);
                break;
            case 'post':
                response = await axios.post(url, payload, config);
                break;
            case 'patch':
                response = await axios.patch(url, payload, config);
                break;
        }

        if (returnRaw) {
            console.log(response);
        }
        return returnRaw ? response : response.data;
    } catch (error: any) {
        console.error(
            `${verb.toUpperCase()} ${path} ${JSON.stringify(payload) ?? ''} error: `,
            error
        );
        throw error;
        //return returnRaw ? error : error.data;
    }
}

export async function get(
    url: string,
    params: any = null,
    requiresSecurity: boolean = false,
    returnRaw: boolean = false
): Promise<any> {
    return axiosCall('get', url, params, requiresSecurity, returnRaw);
}

export async function post(
    url: string,
    payload: any,
    requiresSecurity: boolean = false,
    returnRaw: boolean = false
): Promise<any> {
    return axiosCall('post', url, payload, requiresSecurity, returnRaw);
}

export async function put(
    url: string,
    payload: any,
    requiresSecurity: boolean = false,
    returnRaw: boolean = false
): Promise<any> {
    return axiosCall('put', url, payload, requiresSecurity, returnRaw);
}

export async function del(
    url: string,
    payload: any,
    requiresSecurity: boolean = false,
    returnRaw: boolean = false
): Promise<any> {
    return axiosCall('delete', url, payload, requiresSecurity, returnRaw);
}

export async function patch(
    url: string,
    payload: any,
    requiresSecurity: boolean = false,
    returnRaw: boolean = false
): Promise<any> {
    return axiosCall('patch', url, payload, requiresSecurity, returnRaw);
}

export async function getSecure(
    url: string,
    params: any,
    returnRaw: boolean = false
) {
    return get(url, params, true, returnRaw);
}

export async function postSecure(
    url: string,
    payload: any,
    returnRaw: boolean = false
) {
    return post(url, payload, true, returnRaw);
}

export async function putSecure(
    url: string,
    payload: any,
    returnRaw: boolean = false
) {
    return put(url, payload, true, returnRaw);
}

export async function delSecure(
    url: string,
    payload: any,
    returnRaw: boolean = false
) {
    return del(url, payload, true, returnRaw);
}

export async function patchSecure(
    url: string,
    payload: any,
    returnRaw: boolean = false
) {
    return patch(url, payload, true, returnRaw);
}
