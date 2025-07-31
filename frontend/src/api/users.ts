import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from '../lib/axios';
import { type UserRole } from '../store/auth';

export type UserEntity = {
  id: string;
  email: string;
  fullName?: string;
  dateOfBirth?: string;
  role: UserRole;
};

type UpdateUserRolePayload = {
  id: string;
  role: UserRole;
};

export const useUserApi = () => {
  const queryClient = useQueryClient();
  const getUsers = () =>
    useQuery<UserEntity[]>({
      queryKey: ['users'],
      queryFn: async () => {
        const res = await axios.get<UserEntity[]>('/users');
        return res.data;
      },
    });

  const updateUserRole = useMutation({
    mutationFn: async ({ id, role }: UpdateUserRolePayload): Promise<UserEntity> => {
      const res = await axios.patch<UserEntity>(`/users/${id}/role`, { role });
      return res.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['users'] }),
  });

  return {
    getUsers,
    updateUserRole,
  };
};
