import { FormUsuario } from "../schemas/UsuarioSchema";

export type UsuarioType = FormUsuario & {
    id: string,
    dtCriacao: string,
    dtAtualizacao: string,
    eAdmin: boolean
}