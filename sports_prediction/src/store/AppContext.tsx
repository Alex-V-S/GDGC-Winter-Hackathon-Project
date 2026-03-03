import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { UserProfile } from '../types/index';

// ── State shape ───────────────────────────────────────────────────
interface AppState {
  user: UserProfile;
  isLoggedIn: boolean;
  login: () => void;
  logout: () => void;
  addCoins: (amount: number) => void;
  removeCoins: (amount: number) => void;
  addXP: (amount: number) => void;
  recordWin: () => void;
  recordLoss: () => void;
}

const DEFAULT_USER: UserProfile = {
  id: 'me',
  username: 'Rookie',
  coins: 2500,
  level: 5,
  xp: 320,
  xpToNext: 500,
  wins: 22,
  losses: 18,
  streak: 3,
};

const AppContext = createContext<AppState | undefined>(undefined);

// ── Provider ──────────────────────────────────────────────────────
export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile>(DEFAULT_USER);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const login = useCallback(() => setIsLoggedIn(true), []);
  const logout = useCallback(() => setIsLoggedIn(false), []);

  const addCoins = useCallback((amount: number) => {
    setUser((prev: UserProfile) => ({ ...prev, coins: prev.coins + amount }));
  }, []);

  const removeCoins = useCallback((amount: number) => {
    setUser((prev: UserProfile) => ({ ...prev, coins: Math.max(0, prev.coins - amount) }));
  }, []);

  const addXP = useCallback((amount: number) => {
    setUser((prev: UserProfile) => {
      let newXP = prev.xp + amount;
      let newLevel = prev.level;
      let newXpToNext = prev.xpToNext;

      while (newXP >= newXpToNext) {
        newXP -= newXpToNext;
        newLevel += 1;
        newXpToNext = Math.floor(newXpToNext * 1.3);
      }

      return { ...prev, xp: newXP, level: newLevel, xpToNext: newXpToNext };
    });
  }, []);

  const recordWin = useCallback(() => {
    setUser((prev: UserProfile) => ({
      ...prev,
      wins: prev.wins + 1,
      streak: prev.streak + 1,
    }));
    addCoins(100);
    addXP(50);
  }, [addCoins, addXP]);

  const recordLoss = useCallback(() => {
    setUser((prev: UserProfile) => ({
      ...prev,
      losses: prev.losses + 1,
      streak: 0,
    }));
    addXP(10);
  }, [addXP]);

  return (
    <AppContext.Provider
      value={{ user, isLoggedIn, login, logout, addCoins, removeCoins, addXP, recordWin, recordLoss }}
    >
      {children}
    </AppContext.Provider>
  );
}

// ── Hook ──────────────────────────────────────────────────────────
export function useAppStore(): AppState {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppStore must be inside <AppProvider>');
  return ctx;
}
