import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

// Routes that don't require authentication
const publicRoutes = ['/', '/login', '/register'];

// API routes that don't require authentication
const publicApiRoutes = ['/api/auth/login', '/api/auth/register'];

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Allow public routes
    if (publicRoutes.includes(pathname)) {
        return NextResponse.next();
    }

    // Allow public API routes
    if (publicApiRoutes.some(route => pathname.startsWith(route))) {
        return NextResponse.next();
    }

    // Check for session cookie
    const sessionCookie = request.cookies.get('caretrail_session');

    if (!sessionCookie) {
        // Redirect to login for protected pages
        if (!pathname.startsWith('/api')) {
            return NextResponse.redirect(new URL('/login', request.url));
        }

        // Return 401 for protected API routes
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        // Verify JWT token using jose (Edge Runtime compatible)
        const sessionSecret = process.env.SESSION_SECRET;
        if (!sessionSecret) {
            throw new Error('SESSION_SECRET not configured');
        }

        const secret = new TextEncoder().encode(sessionSecret);
        await jwtVerify(sessionCookie.value, secret);

        // Session is valid, allow request
        return NextResponse.next();
    } catch (error) {
        // Invalid session
        const response = pathname.startsWith('/api')
            ? NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
            : NextResponse.redirect(new URL('/login', request.url));

        // Clear invalid session cookie
        response.cookies.delete('caretrail_session');

        return response;
    }
}

export const config = {
    matcher: [
        /*
         * Match all request paths except:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public files (public folder)
         */
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
};
