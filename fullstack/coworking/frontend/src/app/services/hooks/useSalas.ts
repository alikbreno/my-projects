import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
  useSuspenseInfiniteQuery,
} from "@tanstack/react-query";
import { FormSala } from "../../schemas/SalaSchema";
import {
  SalaApiSchema,
  SalasApiResponseSchema,
} from "../../schemas/SalasApiSchema";
import { API } from "../api";

export type SalasFilters = {
  search: string;
  date: string;
  time: string;
};

type SalaMutation = {
  id: string;
  data: FormSala;
};

export function useInfiniteSalas(filters: SalasFilters) {
  return useSuspenseInfiniteQuery({
    queryKey: ["salas", filters],
    initialPageParam: undefined as string | undefined,
    queryFn: async ({ pageParam }) => {
      const response = await API.get("/salas", {
        params: {
          limit: 6,
          ...(filters.search && { search: filters.search }),
          ...(filters.date && { date: filters.date }),
          ...(filters.date && filters.time && { time: filters.time }),
          ...(pageParam && { cursor: pageParam }),
        },
      });

      return SalasApiResponseSchema.parse(response.data);
    },
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
  });
}

export function useSalaAvailability(salaId: string, date?: string) {
  return useQuery({
    queryKey: ["sala-availability", salaId, date],
    enabled: Boolean(date),
    queryFn: async () => {
      const response = await API.get(`/salas/${salaId}`, { params: { date } });
      return SalaApiSchema.parse(response.data);
    },
  });
}

// Mantido para as telas administrativas que carregam uma única página de salas.
export function useGetSalas(enabled = true) {
  return useInfiniteQuery({
    queryKey: ["salas", "admin-list"],
    enabled,
    initialPageParam: undefined as string | undefined,
    queryFn: async ({ pageParam }) => {
      const response = await API.get("/salas", {
        params: { limit: 6, ...(pageParam && { cursor: pageParam }) },
      });
      return SalasApiResponseSchema.parse(response.data);
    },
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    select: (data) => data.pages.flatMap((page) => page.salas),
  });
}

export function useAddSalas() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (sala: FormSala) => API.post("/salas", sala),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["salas"] }),
  });
}

export function useUpdateSalas() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: SalaMutation) => API.put(`/salas/${id}`, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["salas"] }),
  });
}

export function useDeleteSalas() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => API.delete(`/salas/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["salas"] }),
  });
}
