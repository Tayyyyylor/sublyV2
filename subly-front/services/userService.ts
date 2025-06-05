import axiosInstance from '@/helpers/axiosInstance';
import { UserType } from '@/types/global';

export interface UpdateUserResponse {
  user: UserType;
  access_token: string;
}

export const updateUserName = async (
  id: string,
  user: Partial<UserType>,
): Promise<UpdateUserResponse> => {
  try {
    const response = await axiosInstance.patch(`/users/${id}`, user);
    return response.data;
  } catch (error: any) {
    console.error(
      'Erreur de modification :',
      error.response?.data || error.message,
    );
    throw error;
  }
};
