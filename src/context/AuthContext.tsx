import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import * as SecureStore from "expo-secure-store";
import { router } from "expo-router";
import { login as apiLogin } from "../api/surveys";
import { AuthResponse } from "../types/survey";

interface AuthContextType {
  user: AuthResponse | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Restore session on app launch
  useEffect(() => {
    restoreSession();
  }, []);

  const restoreSession = async () => {
    try {
      const token = await SecureStore.getItemAsync("jwt_token");
      const userData = await SecureStore.getItemAsync("user_data");
      if (token && userData) {
        setUser(JSON.parse(userData));
      }
    } catch {
      // corrupted store — clear it
      await SecureStore.deleteItemAsync("jwt_token");
      await SecureStore.deleteItemAsync("user_data");
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    // apiLogin sends XML, receives XML, returns parsed AuthResponse
    const authData: AuthResponse = await apiLogin(email, password);
    //console.log(authData);
    // Persist token + user data securely on device
    await SecureStore.setItemAsync("jwt_token", authData.token);
    await SecureStore.setItemAsync("user_data", JSON.stringify(authData));

    setUser(authData);

    router.replace("/(app)/surveys");
  };

  const logout = async () => {
    await SecureStore.deleteItemAsync("jwt_token");
    await SecureStore.deleteItemAsync("user_data");
    setUser(null);
    router.replace("/(auth)/login");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
