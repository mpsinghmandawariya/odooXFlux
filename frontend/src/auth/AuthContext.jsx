import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const AuthContext = createContext(null);
const TOKEN_KEY = "subscriptiq_token";
const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: { "Content-Type": "application/json", ...options.headers },
  });
  const result = await response.json().catch(() => ({}));
  if (!response.ok)
    throw new Error(result.message || "The request could not be completed.");
  return result;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const signOut = useCallback(() => {
    window.localStorage.removeItem(TOKEN_KEY);
    setUser(null);
  }, []);

  useEffect(() => {
    let mounted = true;
    const token = window.localStorage.getItem(TOKEN_KEY);
    if (!token) {
      setIsLoading(false);
      return () => {
        mounted = false;
      };
    }

    request("/auth/me", { headers: { Authorization: `Bearer ${token}` } })
      .then(({ user: currentUser }) => {
        if (mounted) setUser(currentUser);
      })
      .catch(() => {
        window.localStorage.removeItem(TOKEN_KEY);
        if (mounted) setUser(null);
      })
      .finally(() => {
        if (mounted) setIsLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const authenticate = useCallback(async (endpoint, credentials) => {
    const result = await request(endpoint, {
      method: "POST",
      body: JSON.stringify(credentials),
    });
    window.localStorage.setItem(TOKEN_KEY, result.token);
    setUser(result.user);
    return result.user;
  }, []);

  const signIn = useCallback(
    (credentials) => authenticate("/auth/login", credentials),
    [authenticate],
  );
  const register = useCallback(
    (details) => authenticate("/auth/register", details),
    [authenticate],
  );

  const value = useMemo(
    () => ({ user, isLoading, signIn, register, signOut }),
    [user, isLoading, signIn, register, signOut],
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider.");
  return context;
}
