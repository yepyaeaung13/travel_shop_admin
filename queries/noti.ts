import { successToast } from "@/components/toast";
import {
  getNoti,
  markAsAllRead,
  updateSeenNoti,
} from "@/services/noti.service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useGetNoti = (limit: number, isSeen?: boolean) => {
  return useQuery({
    queryKey: ["noti-list", limit, isSeen],
    queryFn: () => getNoti(limit, isSeen),
    refetchInterval: 15000,
    refetchIntervalInBackground: false,
  });
};

export const useSeenNoti = () => {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (payload: { ids: number[] }) => updateSeenNoti(payload),
    onSuccess: () => {
      client.invalidateQueries({
        queryKey: ["noti-list"],
        refetchType: "active",
      });
    },
  });
};

export const useNotiMarkAsAllRead = () => {
  const client = useQueryClient();
  return useMutation({
    mutationFn: () => markAsAllRead(),
    onSuccess: () => {
      client.invalidateQueries({
        queryKey: ["noti-list"],
        refetchType: "all",
      });

      successToast(
        "Success",
        "All unread notifications have been marked as read.",
      );
    },
  });
};
