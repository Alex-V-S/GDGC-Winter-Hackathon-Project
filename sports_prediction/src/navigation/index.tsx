import React from 'react';
import { Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Colors } from '../theme';

import {
  LoginScreen,
  HomeScreen,
  GameDetailsScreen,
  BattleScreen,
  LeaderboardScreen,
} from '../screens';

// ── Tab Navigator ─────────────────────────────────────────────────
const Tab = createBottomTabNavigator();

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
    </Tab.Navigator>
  );
}

// ── Root Stack ────────────────────────────────────────────────────
const Stack = createNativeStackNavigator();

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
  return (
    <NavigationContainer theme={arenaTheme} onReady={onReady}>
      <Stack.Navigator
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
