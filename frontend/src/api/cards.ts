import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from '../lib/axios';
import type { CardCategory, CardLanguage } from '../constants/card';
import type { UserEntity } from './users';

export type CardEntity = {
  id: string;
  description: string;
  category: CardCategory;
  language: CardLanguage;
  imageUrl: string | null;
  isApproved: boolean;
  isDeleted: boolean;
  createdAt: string;
  publisher: UserEntity;
  isLiked?: boolean;
  likeCount?: number;
};

type CreateCardPayload = {
  description: string;
  category: string;
  language: string;
  imageUrl: string;
};

type UpdateCardPayload = Partial<CreateCardPayload>;

export const useCardsApi = () => {
  const queryClient = useQueryClient();

  const createCard = useMutation({
    mutationFn: async (data: CreateCardPayload): Promise<CardEntity> => {
      const res = await axios.post<CardEntity>('/cards', data);
      return res.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['cards'] }),
  });

  const getActiveCards = (enabled: boolean) =>
    useQuery({
      queryKey: ['cards', 'active'],
      queryFn: async (): Promise<CardEntity[]> => {
        const res = await axios.get('/cards/active');
        return res.data;
      },
      enabled,
    });

  const getAwaitingCards = () =>
    useQuery({
      queryKey: ['cards', 'awaiting'],
      queryFn: async (): Promise<CardEntity[]> => {
        const res = await axios.get('/cards/awaiting');
        return res.data;
      },
    });

  const getUsersCards = (enabled: boolean) =>
    useQuery({
      queryKey: ['cards'],
      queryFn: async (): Promise<CardEntity[]> => {
        const res = await axios.get('/cards');
        return res.data;
      },
      enabled: enabled,
    });

  const getCardById = (id: string) =>
    useQuery({
      queryKey: ['cards', id],
      queryFn: async (): Promise<CardEntity> => {
        const res = await axios.get(`/cards/${id}`);
        return res.data;
      },
    });

  const updateCard = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateCardPayload }): Promise<CardEntity> => {
      const res = await axios.put(`/cards/${id}`, data);
      return res.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['cards'] }),
  });

  const deleteCard = useMutation({
    mutationFn: async (id: string): Promise<CardEntity> => {
      const res = await axios.delete(`/cards/${id}`);
      return res.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['cards'] }),
  });

  const approveCard = useMutation({
    mutationFn: async ({ id, isApproved }: { id: string; isApproved: boolean }): Promise<CardEntity> => {
      const res = await axios.patch(`/cards/${id}/approve`, null, {
        params: { isApproved },
      });
      return res.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['cards'] }),
  });

  const toggleLike = useMutation({
    mutationFn: async (id: string): Promise<CardEntity> => {
      const res = await axios.patch(`/cards/${id}/like`);
      return res.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['cards'] }),
  });

  return {
    createCard,
    getActiveCards,
    getAwaitingCards,
    getUsersCards,
    getCardById,
    updateCard,
    deleteCard,
    approveCard,
    toggleLike,
  };
};
