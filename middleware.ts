import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose'; 

// WAJIB SAMA DENGAN AUTH ACTION
const SECRET_ENV = process.env.AUTH_SECRET || "rahasia_default_debug_123456";
const SECRET_KEY = new TextEncoder().encode(SECRET_ENV);

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('session_token')?.value;
  const { pathname } = request.nextUrl;

  // ✅ Debugging Log (Lihat di Terminal Server Anda saat login)
  console.log(`[Middleware] Path: ${pathname} | Token Ada? ${!!token}`);

  // 1. JIKA TOKEN TIDAK ADA (Belum Login)
  if (!token) {
    if (pathname.startsWith('/dashboard')) {
      console.log(`[Middleware] Redirect: ${pathname} -> Login (No Token)`);
      const loginUrl = pathname.startsWith('/dashboard/admin') ? '/LoginAdmin' : '/LoginMitra';
      return NextResponse.redirect(new URL(loginUrl, request.url));
    }
    // Jika tidak akses dashboard, biarkan lewat
    return NextResponse.next();
  }

  // 2. JIKA TOKEN ADA (Sudah Login)
  try {
    const { payload } = await jwtVerify(token, SECRET_KEY, { algorithms: ['HS256'] });
    const role = payload.role as string;

    // ✅ Debug Log Role
    console.log(`[Middleware] Path: ${pathname} | Role: ${role}`);

    // A. Redirect User Login ke Dashboard jika mencoba akses halaman login lagi
    if (['/', '/LoginAdmin', '/LoginMitra'].includes(pathname)) {
      if (role === 'admin') {
        console.log(`[Middleware] Redirect: ${pathname} -> /dashboard/admin (Already Logged In)`);
        return NextResponse.redirect(new URL('/dashboard/admin', request.url));
      }
      if (role === 'mitra') {
        console.log(`[Middleware] Redirect: ${pathname} -> /dashboard/mitra (Already Logged In)`);
        return NextResponse.redirect(new URL('/dashboard/mitra', request.url));
      }
    }

    // B. Proteksi Lintas Role (Salah Kamar)
    if (pathname.startsWith('/dashboard/admin') && role !== 'admin') {
      console.log(`[Middleware] Redirect: ${pathname} -> /dashboard/mitra (Wrong Role)`);
      return NextResponse.redirect(new URL('/dashboard/mitra', request.url));
    }
    if (pathname.startsWith('/dashboard/mitra') && role !== 'mitra') {
      console.log(`[Middleware] Redirect: ${pathname} -> /dashboard/admin (Wrong Role)`);
      return NextResponse.redirect(new URL('/dashboard/admin', request.url));
    }

    // Jika semua cek lolos, izinkan lanjut
    console.log(`[Middleware] Access Granted: ${pathname}`);
    return NextResponse.next();

  } catch (error) {
    console.error("[Middleware] Token Invalid/Expired:", error);
    
    // Hapus cookie dan lempar ke LoginMitra (Default)
    const response = NextResponse.redirect(new URL('/LoginMitra', request.url)); 
    response.cookies.delete('session_token');
    response.cookies.delete('user_role');
    return response;
  }
}

export const config = {
  // Matcher untuk menentukan rute mana yang kena middleware
  matcher: ['/', '/LoginAdmin', '/LoginMitra', '/dashboard/:path*'],
};