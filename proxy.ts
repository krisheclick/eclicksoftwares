import { NextResponse, NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
    const ip =
        request.headers.get('x-forwarded-for')?.split(',')[0] ||
        request.headers.get('x-real-ip') ||
        request.ip ||
        'Unknown';

    console.log('Client IP (proxy):', ip);
    const response = NextResponse.next();
    response.headers.set('x-client-ip', ip);

    return response;
}

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico|robots.txt).*)'
    ],
};
