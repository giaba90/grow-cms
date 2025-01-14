/* eslint-disable @typescript-eslint/no-unused-vars */
import { SignJWT, jwtVerify } from "jose";

const key = new TextEncoder().encode("your-secret-key");

const cookie = {
  name: "session",
  options: {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
  },
  duration: 60 * 60 * 24 * 1000,
};

export async function encrypt(payload: any) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("2h")
    .sign(key);
}

export async function decrypt(session: string | Uint8Array<ArrayBufferLike>) {
  try {
    const { payload } = await jwtVerify(session, key, {
      algorithms: ["HS256"],
    });
    return payload;
  } catch (error) {
    return null;
  }
}
export async function createSession() {}
export async function verifySession() {}
export async function deleteSession() {}
