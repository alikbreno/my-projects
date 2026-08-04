import axios from "axios";
import { useAuth } from "../../context/useAuth";

const baseURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3333";

type ApiErrorResponse = {
  message?: string;
};

export class ApiRequestError extends Error {
  constructor(
    message: string,
    public readonly status?: number,
  ) {
    super(message);
    this.name = "ApiRequestError";
  }
}

export const API = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

API.interceptors.request.use((config) => {
  const accessToken = useAuth.getState().auth?.accessToken;

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

API.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    if (!axios.isAxiosError<ApiErrorResponse>(error)) {
      return Promise.reject(
        new ApiRequestError("Não foi possível concluir a solicitação."),
      );
    }

    const status = error.response?.status;
    const message =
      error.response?.data?.message ||
      "Não foi possível concluir a solicitação.";
    const isAuthRequest = error.config?.url?.startsWith("/auth/");

    // Requests de login/cadastro também podem retornar 401; elas não devem
    // limpar uma sessão existente nem redirecionar antes do feedback do formulário.
    if (status === 401 && !isAuthRequest) {
      useAuth.getState().clearAuth();

      if (
        typeof window !== "undefined" &&
        window.location.pathname !== "/sign-in"
      ) {
        window.location.assign("/sign-in");
      }
    }

    return Promise.reject(new ApiRequestError(message, status));
  },
);
