import * as SplashScreen from 'expo-splash-screen';
import React from 'react';
import { StatusBar } from 'react-native';
import { AppProvider } from './store/AppContext';
import { Navigation } from './navigation';

SplashScreen.preventAutoHideAsync();

export function App() {
  return (
    <AppProvider>
      <StatusBar barStyle="light-content" backgroundColor="#0B0E1A" />
      <Navigation
        onReady={() => {
          SplashScreen.hideAsync();
        }}
      />
    </AppProvider>
  );
}
