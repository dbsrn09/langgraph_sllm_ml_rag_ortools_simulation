import { useState } from "react";


import { AuthContext, type AuthProviderType } from "./auth.contex";
import type { AuthUser } from "../../models/auth.model";

type Props = {
  children: React.ReactNode;
};

export const AuthProvider = ({ children }: Props) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [provider, setProvider] = useState<AuthProviderType>(null);

  const setAuth = ({
    user,
    token,
    provider,
  }: {
    user: AuthUser;
    token: string;
    provider: AuthProviderType;
  }) => {
    setUser(user);
    setToken(token);
    setProvider(provider);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setProvider(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        provider,
        setAuth,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
