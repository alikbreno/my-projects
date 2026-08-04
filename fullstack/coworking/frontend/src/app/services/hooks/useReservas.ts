import {
  useMutation,
  useInfiniteQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { API } from "../api";
import {
  ReservaPost,
  ReservaType,
  ReservaUpdate,
} from "../../types/ReservaType";

type ReservaMutation = {
  id: string;
  data: ReservaUpdate;
};

type ReservasResponse = {
  reservas: ReservaType[];
  nextCursor: string | null;
};

export function useInfiniteReservas() {
  return useInfiniteQuery({
    queryKey: ["reservas"],
    initialPageParam: undefined as string | undefined,
    queryFn: async ({ pageParam }) => {
      const response = await API.get<ReservasResponse>("/reservas", {
        params: { limit: 6, ...(pageParam && { cursor: pageParam }) },
      });
      return response.data;
    },
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
  });
}

export function useAddReservas() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (reserva: ReservaPost) => {
      await API.post("/reservas", reserva);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["reservas"],
      });
    },
  });
}

export function useUpdateReservas() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: ReservaMutation) => {
      await API.put(`/reservas/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["reservas"],
      });
    },
  });
}

export function useDeleteReservas() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await API.delete(`/reservas/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["reservas"],
      });
    },
  });
}
