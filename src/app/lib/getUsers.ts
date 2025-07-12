// lib/getUsers.ts
import { fetchData } from './fetchData';

interface UsersResponse {
    message: string;
    users: UserData[];
}

export async function getUsers(): Promise<UserData[]> {
    const data = await fetchData<UsersResponse>('/api/dashboard/users');
    return data?.users ?? [];
}