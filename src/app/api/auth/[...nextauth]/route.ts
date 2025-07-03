import { betterAuth } from 'better-auth'
import { authConfig } from '@/auth/auth'

const auth = betterAuth(authConfig)

export async function GET(request: Request) {
    return auth.handler(request)
}
export async function POST(request: Request) {
    return auth.handler(request)
}
