import { jwtVerify } from 'jose';
import { cookies } from 'next/headers';

// WAJIB SAMA DENGAN MIDDLEWARE & ACTION
const SECRET_ENV = process.env.AUTH_SECRET || "rahasia_default_debug_123456";
const SECRET_KEY = new TextEncoder().encode(SECRET_ENV);

export async function getSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get('session_token')?.value;

  // ✅ Debug Log
  console.log(`[Auth.ts] Token ada? ${!!token}`);

  if (!token) {
    console.log(`[Auth.ts] Return: null (No Token)`);
    return null;
  }

  try {
    const { payload } = await jwtVerify(token, SECRET_KEY, {
      algorithms: ['HS256'],
    });

    // ✅ Debug Log Payload
    console.log(`[Auth.ts] Payload:`, {
      id: payload.id,
      role: payload.role,
      nama: payload.nama
    });

    return payload;
  } catch (error) {
    console.error('[Auth.ts] JWT Verify Error:', error);
    return null;
  }
}