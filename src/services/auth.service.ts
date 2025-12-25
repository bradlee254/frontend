import api from '../lib/api';

export interface AuthResponse{
    token: string;
}

export async function login(email: string, password: string){
    const {data} = await api.post<AuthResponse>('/auth/login', {email, password});

    localStorage.setItem('token', data.token);


}
export async function register(email: string, password: string){
    const {data} = await api.post<AuthResponse>('/auth/register', {email, password});

    localStorage.setItem('token', data.token);
}

export function logout(){
    localStorage.removeItem('token');
}