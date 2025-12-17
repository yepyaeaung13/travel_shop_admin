import {
  getDeleteUser,
  getUserById,
  getUsers,
  registerUser,
  updateUserStatus,
} from "@/services/user.service";
import { getUserResponse, getUsersResponse, User, UserSortOption } from "@/types/users.types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

interface UseUsersParams {
  sort?: UserSortOption;
  page?: number;
  limit?: number;
  searchText?: string;
}

export const useRegisterUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: Partial<User>) => registerUser(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["Users"] });
    },
  });
};

export const useUsers = (params?: UseUsersParams) => {
  return useQuery({
    queryKey: ["Users", params],
    queryFn: ():Promise<getUsersResponse> => getUsers(params),
  });
};

export const useGetUserById = (id: string) => {
  return useQuery({
    queryKey: ["User", id],
    queryFn: () : Promise<getUserResponse> => getUserById(id),
    retry:false,
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => getDeleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["Users"] });
    },
  });
};

export const useUpdateUserStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: { userId: number; status: string }) =>
      updateUserStatus(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["Users"] });
    },
  });
};
