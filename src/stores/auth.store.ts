import { create } from 'zustand';

interface AuthStore {
  id: string | null;
  name: string | null;
  email: string | null;
  avatarUrl: string | null;
  accessToken: string | null;
  refreshToken: string | null;

  setName: ( name: string | null) => void;
  setEmail: ( email: string | null) => void;
  setAvatarUrl: ( avatarUrl: string | null) => void;
  setAccessToken: ( accessToken: string | null) => void;
  setRefreshToken: ( refreshToken: string | null) => void;
  setId: ( id: string | null) => void;
  isEmailValid: () => string;
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  id: "123",
  name: "Binh",
  email: "binh@gmail.com",
  avatarUrl: "https://i.pravatar.cc/150?img=3",
  accessToken: "123456789",
  refreshToken: "987654321",

  setName: (name) => {
    set( {name});
  },
  setEmail: (email) => {
    set( {email});
  },
  setAvatarUrl: (avatarUrl) => {
    set( {avatarUrl});    
  },
  setAccessToken: (accessToken) => {
    set( {accessToken});    
  },
  setRefreshToken: (refreshToken) => {
    set( {refreshToken});    
  },
  setId: (id) => {
    set( {id});    
  },

  isEmailValid: () => {
    const email = get().email;
    if (!email) return "NULL"
    else return "VALID";
  }
}))