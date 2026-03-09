import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../theme';
import { GlassCard } from '../components';
import { useAppStore } from '../store/AppContext';
import { supabase, isConfigured } from '../services/supabase';
import { CommonActions } from '@react-navigation/native';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { MainTabParamList, RootStackParamList } from '../types';
import type { CompositeScreenProps } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

type ProfileScreenProps = CompositeScreenProps<
  BottomTabScreenProps<MainTabParamList, 'Profile'>,
  NativeStackScreenProps<RootStackParamList>
>;

interface ProfileData {
  username: string;
  fanIq: number;
  streak: number;
  coins: number;
}

export default function ProfileScreen({ navigation }: ProfileScreenProps) {
  const { user, logout } = useAppStore();
  const [profile, setProfile] = useState<ProfileData>({
    username: user.username,
    fanIq: user.fanIq,
    streak: user.streak,
    coins: user.coins,
  });
  const [totalPicks, setTotalPicks] = useState(0);
  const [correctPicks, setCorrectPicks] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    if (!isConfigured) {
      setProfile({
        username: user.username,
        fanIq: user.fanIq,
        streak: user.streak,
        coins: user.coins,
      });
      setLoading(false);
      return;
    }

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.user) {
        setLoading(false);
        return;
      }

      const { data: profileRow } = await supabase
        .from('profiles')
        .select('*')
        .eq('auth_id', session.user.id)
        .single();

      if (profileRow) {
        setProfile({
          username: profileRow.username ?? user.username,
          fanIq: profileRow.fan_iq ?? 0,
          streak: profileRow.streak ?? 0,
          coins: profileRow.coins ?? 0,
        });

        const { count: total } = await supabase
          .from('picks')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', profileRow.id);

        const { count: correct } = await supabase
          .from('picks')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', profileRow.id)
          .eq('is_correct', true);

        setTotalPicks(total ?? 0);
        setCorrectPicks(correct ?? 0);
      }
    } catch (err) {
      console.warn('Profile fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const accuracy =
    totalPicks > 0 ? ((correctPicks / totalPicks) * 100).toFixed(1) : '0.0';

  const handleLogout = async () => {
    if (isConfigured) {
      await supabase.auth.signOut();
    }
    logout();
    navigation.dispatch(
      CommonActions.reset({ index: 0, routes: [{ name: 'Login' }] })
    );
  };

  if (loading) {
    return (
      <LinearGradient colors={['#0B0E1A', '#1A1040', '#0B0E1A']} style={styles.container}>
        <View style={styles.centered}>
          <ActivityIndicator color={Colors.neonOrange} size="large" />
        </View>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={['#0B0E1A', '#1A1040', '#0B0E1A']} style={styles.container}>
      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.avatarCircle}>
              <Text style={styles.avatarEmoji}>👤</Text>
            </View>
            <Text style={styles.username}>{profile.username}</Text>
          </View>

          {/* Fan IQ Hero */}
          <GlassCard style={styles.fanIqCard}>
            <Text style={styles.fanIqLabel}>Fan IQ</Text>
            <Text style={styles.fanIqValue}>{profile.fanIq}</Text>
          </GlassCard>

          {/* Streak & Coins Row */}
          <View style={styles.statsRow}>
            <GlassCard style={styles.statCard}>
              <Text style={styles.statIcon}>🔥</Text>
              <Text style={styles.statValue}>{profile.streak}</Text>
              <Text style={styles.statLabel}>Current Streak</Text>
            </GlassCard>
            <GlassCard style={styles.statCard}>
              <Text style={styles.statIcon}>🪙</Text>
              <Text style={styles.statValue}>{profile.coins}</Text>
              <Text style={styles.statLabel}>Coins</Text>
            </GlassCard>
          </View>

          {/* Pick Stats */}
          <Text style={styles.sectionTitle}>📊 Pick Stats</Text>
          <GlassCard style={styles.pickStatsCard}>
            <View style={styles.pickStatRow}>
              <Text style={styles.pickStatLabel}>Total Picks</Text>
              <Text style={styles.pickStatValue}>{totalPicks}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.pickStatRow}>
              <Text style={styles.pickStatLabel}>Correct Picks</Text>
              <Text style={[styles.pickStatValue, { color: Colors.success }]}>{correctPicks}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.pickStatRow}>
              <Text style={styles.pickStatLabel}>Accuracy</Text>
              <Text style={[styles.pickStatValue, { color: Colors.neonOrange }]}>{accuracy}%</Text>
            </View>
          </GlassCard>

          {/* How Fan IQ Works */}
          <Text style={styles.sectionTitle}>💡 How Fan IQ Works</Text>
          <GlassCard style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Text style={styles.infoEmoji}>✅</Text>
              <Text style={styles.infoText}>Correct pick = +10 Fan IQ</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoEmoji}>❌</Text>
              <Text style={styles.infoText}>Wrong pick = streak resets to 0</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoEmoji}>🔥</Text>
              <Text style={styles.infoText}>Streak = consecutive correct picks</Text>
            </View>
          </GlassCard>

          {/* Logout */}
          <TouchableOpacity activeOpacity={0.85} onPress={handleLogout}>
            <LinearGradient
              colors={[Colors.danger, '#B91C1C']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.logoutBtn}
            >
              <Text style={styles.logoutText}>Log Out</Text>
            </LinearGradient>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  scroll: { paddingHorizontal: 20, paddingBottom: 40 },
  // Header
  header: { alignItems: 'center', paddingTop: 16, paddingBottom: 8 },
  avatarCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,107,43,0.15)',
    borderWidth: 2,
    borderColor: Colors.neonOrange,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarEmoji: { fontSize: 36 },
  username: {
    color: Colors.textPrimary,
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: 1,
  },
  // Fan IQ
  fanIqCard: { alignItems: 'center', marginTop: 16, paddingVertical: 24 },
  fanIqLabel: {
    color: Colors.textSecondary,
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  fanIqValue: {
    color: Colors.neonOrange,
    fontSize: 56,
    fontWeight: '900',
  },
  // Stats row
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 16,
  },
  statIcon: { fontSize: 28, marginBottom: 4 },
  statValue: {
    color: Colors.textPrimary,
    fontSize: 26,
    fontWeight: '900',
  },
  statLabel: {
    color: Colors.textMuted,
    fontSize: 11,
    marginTop: 2,
  },
  // Section
  sectionTitle: {
    color: Colors.textPrimary,
    fontSize: 18,
    fontWeight: '800',
    marginTop: 24,
    marginBottom: 12,
  },
  // Pick Stats
  pickStatsCard: { paddingVertical: 12 },
  pickStatRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 4,
  },
  pickStatLabel: {
    color: Colors.textSecondary,
    fontSize: 15,
  },
  pickStatValue: {
    color: Colors.textPrimary,
    fontSize: 18,
    fontWeight: '800',
  },
  divider: {
    height: 1,
    backgroundColor: Colors.divider,
  },
  // Info card
  infoCard: { gap: 12 },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  infoEmoji: { fontSize: 18 },
  infoText: {
    color: Colors.textSecondary,
    fontSize: 14,
  },
  // Logout
  logoutBtn: {
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 32,
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 1,
  },
});
