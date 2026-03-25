import { createContext } from "react";
import type { AuthUser } from "../../models/auth.model";

export type AuthProviderType = | "browser" | "teams" | null;

export type AuthContextType = {
  user: AuthUser | null;
  token: string | null;
  provider: AuthProviderType;

  // actions
  setAuth: (data: {
    user: AuthUser;
    token: string;
    provider: AuthProviderType;
  }) => void;

  logout: () => void;
};

export const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  provider: null,
  setAuth: () => {},
  logout: () => {},
});
