export function getCookieValue(cookieName: string): string | undefined {
    if (!cookieName) return document.cookie;
    const cookies = document.cookie.split('; ');
    const cookie = cookies.find((item) => item.startsWith(`${cookieName}=`));
    return cookie ? cookie.split('=')[1] : undefined;
}
