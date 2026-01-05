import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose'; 

// KITA PERTAHANKAN LOGIKA INI AGAR STABIL
const SECRET_ENV = process.env.AUTH_SECRET || "rahasia_default_debug_123456";
const SECRET_KEY = new TextEncoder().encode(SECRET_ENV);

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('session_token')?.value;
  const { pathname } = request.nextUrl;

  // 1. JIKA TOKEN TIDAK ADA (Belum Login)
  if (!token && pathname.startsWith('/dashboard')) {
    const loginUrl = pathname.startsWith('/dashboard/admin') ? '/LoginAdmin' : '/LoginMitra';
    return NextResponse.redirect(new URL(loginUrl, request.url));
  }

  // 2. JIKA TOKEN ADA (Sudah Login)
  if (token) {
    try {
      const { payload } = await jwtVerify(token, SECRET_KEY, { algorithms: ['HS256'] });
      const role = payload.role as string;

      // Redirect User Login ke Dashboard jika mencoba akses halaman login
      if (['/', '/LoginAdmin', '/LoginMitra'].includes(pathname)) {
        if (role === 'admin') return NextResponse.redirect(new URL('/dashboard/admin', request.url));
        if (role === 'mitra') return NextResponse.redirect(new URL('/dashboard/mitra', request.url));
      }

      // Proteksi Lintas Role
      if (pathname.startsWith('/dashboard/admin') && role !== 'admin') {
         return NextResponse.redirect(new URL('/dashboard/mitra', request.url));
      }
      if (pathname.startsWith('/dashboard/mitra') && role !== 'mitra') {
         return NextResponse.redirect(new URL('/dashboard/admin', request.url));
      }

    } catch (error) {
      // Token Invalid -> Paksa logout
      const response = NextResponse.redirect(new URL('/LoginAdmin', request.url));
      response.cookies.delete('session_token');
      response.cookies.delete('user_role');
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/LoginAdmin', '/LoginMitra', '/dashboard/:path*'],
};