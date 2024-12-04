import axios from 'axios';
import { getCookieValue } from '../cookies';
import { jwtDecode } from 'jwt-decode';

//TODO: why no process.env?
const GET_NONCE_URL = `${import.meta.env.VITE_MEDUSA_BACKEND_URL || 'http://localhost:9000'}/seller/auth/nonce`;
const VERIFY_MSG_URL = `${import.meta.env.VITE_MEDUSA_BACKEND_URL || 'http://localhost:9000'}/seller/auth`;

export async function getNonce() {
    //const response = await fetch(GET_NONCE_URL);
    //const data = await response.json();
    const output = await axios.get(GET_NONCE_URL, {
        headers: {
            'Content-Type': 'application/json',
            'Cache-control': 'no-cache, no-store',
            Accept: 'application/json',
        },
    });

    return output?.data?.nonce ?? '';
}

export async function sendVerifyRequest(message: string, signature: string) {
    return await axios.post(
        VERIFY_MSG_URL,
        {
            message,
            signature,
        },
        {
            headers: {
                'Content-Type': 'application/json',
                'Cache-control': 'no-cache, no-store',
                Accept: 'application/json',
            },
        }
    );
}

export function getJwtToken(): string | undefined {
    return getCookieValue('jwt');
}

export function getJwtField(fieldName: string): string | undefined {
    const tokenString = getJwtToken();
    if (tokenString) {
        try {
            const jwtToken: any = jwtDecode(tokenString);
            if (jwtToken) {
                return jwtToken[fieldName];
            }
        } catch (e: any) {
            console.error(`error decoding JWT: ${tokenString}`);
        }
    }

    return undefined;
}
