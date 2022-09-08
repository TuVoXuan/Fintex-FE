import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import APP_PATH from './constants/app-path';

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    if (
        pathname.startsWith('/_next') ||
        pathname.startsWith('/favicon.ico') ||
        pathname.startsWith('/logo.svg') ||
        pathname.startsWith('/logo-and-brand-name.svg')
    ) {
        return NextResponse.next();
    }
    const cookie = request.cookies.get('Authorization');
    const noAuthPage = [APP_PATH.SIGN_IN, APP_PATH.SIGN_UP, APP_PATH.VERIFY_OTP, APP_PATH.SEND_OTP];
    if (cookie && noAuthPage.includes(pathname)) {
        return NextResponse.redirect(new URL('/', request.url));
    }
    if (!cookie && !noAuthPage.includes(pathname)) {
        return NextResponse.redirect(new URL('/sign-in', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: '/:path*',
};
