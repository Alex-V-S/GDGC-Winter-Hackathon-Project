import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Colors } from '../theme';
import { MainTabParamList, RootStackParamList } from '../types';

import {
  LoginScreen,
  HomeScreen,
  GameDetailsScreen,
  BattleScreen,
  LeaderboardScreen,
  ProfileScreen,
} from '../screens';
import { isConfigured, supabase } from '../services/supabase';

// ── Tab Navigator ─────────────────────────────────────────────────
const Tab = createBottomTabNavigator<MainTabParamList>();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: Colors.bgPrimary,
          borderTopColor: Colors.border,
          borderTopWidth: 1,
          height: 60,
          paddingBottom: 8,
        },
        tabBarActiveTintColor: Colors.neonOrange,
        tabBarInactiveTintColor: Colors.textMuted,
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>🏀</Text>,
        }}
      />
      <Tab.Screen
        name="Leaderboard"
        component={LeaderboardScreen}
        options={{
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>🏆</Text>,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>👤</Text>,
        }}
      />
    </Tab.Navigator>
  );
}

// ── Root Stack ────────────────────────────────────────────────────
const Stack = createNativeStackNavigator<RootStackParamList>();

const arenaTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: Colors.bgPrimary,
    card: Colors.bgSecondary,
    text: Colors.textPrimary,
    border: Colors.border,
    primary: Colors.neonOrange,
  },
};

export function Navigation({ onReady }: { onReady?: () => void }) {
  const [checkingSession, setCheckingSession] = useState(true);
  const [initialRoute, setInitialRoute] = useState<'Login' | 'MainTabs'>('Login');

  useEffect(() => {
    const checkSession = async () => {
      if (!isConfigured) {
        setInitialRoute('Login');
        setCheckingSession(false);
        return;
      }

      const {
        data: { session },
      } = await supabase.auth.getSession();

      setInitialRoute(session ? 'MainTabs' : 'Login');
      setCheckingSession(false);
    };

    checkSession();
  }, []);

  if (checkingSession) {
    return (
      <View style={{ flex: 1, backgroundColor: Colors.bgPrimary, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator color={Colors.neonOrange} size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer theme={arenaTheme} onReady={onReady}>
      <Stack.Navigator
        initialRouteName={initialRoute}
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
          contentStyle: { backgroundColor: Colors.bgPrimary },
        }}
      >
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="MainTabs" component={MainTabs} />
        <Stack.Screen
          name="GameDetails"
          component={GameDetailsScreen}
          options={{
            headerShown: true,
            headerTransparent: true,
            headerTintColor: Colors.textPrimary,
            headerTitle: '',
          }}
        />
        <Stack.Screen
          name="Battle"
          component={BattleScreen}
          options={{
            headerShown: true,
            headerTransparent: true,
            headerTintColor: Colors.textPrimary,
            headerTitle: '',
            presentation: 'modal',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
