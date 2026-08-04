import { jwtDecode } from "jwt-decode";
import { TokenPayloadType } from "../types/TokenPayloadType";

export function DecodeToken(token: string): TokenPayloadType | null {
  try {
    return jwtDecode<TokenPayloadType>(token);
  } catch {
    return null;
  }
}
