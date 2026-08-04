declare module "js-cookie" {
  type SameSite = "lax" | "strict" | "none";

  type CookieAttributes = {
    expires?: number | Date;
    path?: string;
    sameSite?: SameSite;
  };

  const Cookies: {
    get(name: string): string | undefined;
    set(name: string, value: string, attributes?: CookieAttributes): void;
    remove(name: string, attributes?: CookieAttributes): void;
  };

  export default Cookies;
}
