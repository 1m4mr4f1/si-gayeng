import { jwtVerify } from 'jose';
import { cookies } from 'next/headers';

// KITA PERTAHANKAN LOGIKA INI AGAR STABIL
const SECRET_ENV = process.env.AUTH_SECRET || "rahasia_default_debug_123456";
const SECRET_KEY = new TextEncoder().encode(SECRET_ENV);

export async function getSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get('session_token')?.value;

  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, SECRET_KEY, {
      algorithms: ['HS256'],
    });
    return payload; 
  } catch (error) {
    return null;
  }
}