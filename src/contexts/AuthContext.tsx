import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthContextType {
  isLoggedIn: boolean;
  login: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // 앱 시작 시 저장된 로그인 상태 확인
    checkLoginStatus();
  }, []);

  const checkLoginStatus = async () => {
    try {
      const value = await AsyncStorage.getItem('isLoggedIn');
      if (value === 'true') {
        setIsLoggedIn(true);
      }
    } catch (error) {
      console.error('로그인 상태 확인 오류:', error);
    }
  };

  const login = async () => {
    try {
      await AsyncStorage.setItem('isLoggedIn', 'true');
      setIsLoggedIn(true);
    } catch (error) {
      console.error('로그인 상태 저장 오류:', error);
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('isLoggedIn');
      setIsLoggedIn(false);
    } catch (error) {
      console.error('로그아웃 오류:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

