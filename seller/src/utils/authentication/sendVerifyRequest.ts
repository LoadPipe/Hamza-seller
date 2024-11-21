import axios from 'axios';

const VERIFY_MSG_URL = `${import.meta.env.VITE_MEDUSA_BACKEND_URL || 'http://localhost:9000'}/seller/auth`;

export default async function sendVerifyRequest(
    message: string,
    signature: string
) {
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
