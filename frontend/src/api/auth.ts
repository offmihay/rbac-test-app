import { useMutation } from '@tanstack/react-query';

import { type UserRole } from '../store/auth';
import axios from '../lib/axios';

type SignupPayload = {
  email: string;
  password: string;
  fullName?: string;
};

type SignInPayload = {
  email: string;
  password: string;
};

interface AuthResponse {
  access_token: string;
  sub: string;
  email: string;
  role: UserRole;
}

export const useAuthApi = () => {
  const signUp = useMutation({
    mutationFn: async (data: SignupPayload): Promise<AuthResponse> => {
      const res = await axios.post<AuthResponse>('/auth/signup', data);
      return res.data;
    },
  });

  const signIn = useMutation({
    mutationFn: async (data: SignInPayload): Promise<AuthResponse> => {
      const res = await axios.post<AuthResponse>('/auth/login', data);
      return res.data;
    },
  });

  return {
    signUp,
    signIn,
  };
};
