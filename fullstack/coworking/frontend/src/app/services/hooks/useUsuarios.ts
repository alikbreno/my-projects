import {
  useMutation,
  useInfiniteQuery,
  useQuery,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { API } from "../api";
import { FormUsuario } from "../../schemas/UsuarioSchema";
import { PublicUsuarioType } from "../../types/PublicUsuarioType";

export type UpdateUsuarioPayload = Partial<
  Pick<PublicUsuarioType, "nome" | "email" | "telefone" | "cpf">
> & {
  senha?: string;
};

type usuario = {
  id: string;
  data: FormUsuario;
};

type UsuariosResponse = {
  usuarios: PublicUsuarioType[];
  nextCursor: string | null;
};
export type AdminUsuarioPayload = {
  nome: string;
  email: string;
  cpf: string;
  telefone?: string;
  senha?: string;
  eAdmin?: boolean;
};

export function useInfiniteUsuarios(enabled = true) {
  return useInfiniteQuery({
    queryKey: ["usuarios", "admin-list"],
    enabled,
    initialPageParam: undefined as string | undefined,
    queryFn: async ({ pageParam }) => {
      const response = await API.get<UsuariosResponse>("/usuarios", {
        params: { limit: 6, ...(pageParam && { cursor: pageParam }) },
      });
      return response.data;
    },
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    select: (data) => data.pages.flatMap((page) => page.usuarios),
  });
}

export function useCreateAdminUsuario() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: AdminUsuarioPayload) =>
      API.post<PublicUsuarioType>("/usuarios", data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["usuarios"] }),
  });
}

export function useUpdateAdminUsuario() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Partial<AdminUsuarioPayload>;
    }) => API.put<PublicUsuarioType>(`/usuarios/${id}`, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["usuarios"] }),
  });
}

export function useGetUsuarios() {
  return useSuspenseQuery({
    queryKey: ["usuarios"],
    queryFn: async () => {
      const result = await API.get("/usuarios");
      return result;
    },
  });
}

export function useUsuario(id: string | null) {
  return useQuery({
    queryKey: ["usuario", id],
    enabled: Boolean(id),
    queryFn: async () => {
      const response = await API.get<PublicUsuarioType>(`/usuarios/${id}`);
      return response.data;
    },
  });
}

export function useUpdateUsuarioAtual() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: UpdateUsuarioPayload;
    }) => {
      const response = await API.put<PublicUsuarioType>(
        `/usuarios/${id}`,
        data,
      );
      return response.data;
    },
    onSuccess: (usuario) => {
      queryClient.setQueryData(["usuario", usuario.id], usuario);
      queryClient.invalidateQueries({ queryKey: ["usuarios"] });
    },
  });
}

export function useAddUsuarios() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (usuario: Omit<FormUsuario, "confirmaSenha">) => {
      await API.post("/usuarios", usuario);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["usuarios"],
      });
    },
  });
}

export function useUpdateUsuarios() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: usuario) => {
      await API.put(`/usuarios/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["usuarios"],
      });
    },
  });
}

export function useDeleteUsuarios() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await API.delete(`/usuarios/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["usuarios"],
      });
    },
  });
}
