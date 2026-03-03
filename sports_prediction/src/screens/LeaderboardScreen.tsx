import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../theme';
import { LEADERBOARD } from '../data/mockData';
import { useAppStore } from '../store/AppContext';
import { GlassCard, CoinBadge, LevelProgressBar } from '../components';

export default function LeaderboardScreen() {
  const { user } = useAppStore();

  return (
    <LinearGradient colors={['#0B0E1A', '#111427']} style={styles.container}>
      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        <Text style={styles.title}>🏆 Leaderboard</Text>

        {/* Your profile card */}
        <GlassCard style={styles.profileCard}>
          <View style={styles.profileRow}>
            <Text style={styles.profileEmoji}>🌟</Text>
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>{user.username}</Text>
              <Text style={styles.profileRecord}>
                {user.wins}W – {user.losses}L · 🔥 {user.streak} streak
              </Text>
            </View>
            <CoinBadge coins={user.coins} size="sm" />
          </View>
          <View style={styles.levelWrap}>
            <LevelProgressBar level={user.level} xp={user.xp} xpToNext={user.xpToNext} />
          </View>
        </GlassCard>

        {/* Leaderboard list */}
        <FlatList
          data={LEADERBOARD}
          keyExtractor={(item) => String(item.rank)}
          renderItem={({ item }) => {
            const isTop3 = item.rank <= 3;
            const rankColors = ['#FFD700', '#C0C0C0', '#CD7F32'];
            return (
              <GlassCard style={styles.rowCard}>
                <View style={styles.row}>
                  <View
                    style={[
                      styles.rankBadge,
                      isTop3 && { backgroundColor: rankColors[item.rank - 1] + '22', borderColor: rankColors[item.rank - 1] },
                    ]}
                  >
                    <Text style={[styles.rankText, isTop3 && { color: rankColors[item.rank - 1] }]}>
                      {item.rank}
                    </Text>
                  </View>

                  <Text style={styles.avatar}>{item.avatar}</Text>

                  <View style={styles.info}>
                    <Text style={styles.name}>{item.username}</Text>
                    <Text style={styles.meta}>
                      LVL {item.level} · {item.wins}W
                    </Text>
                  </View>

                  <CoinBadge coins={item.coins} size="sm" />
                </View>
              </GlassCard>
            );
          }}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  title: {
    color: Colors.textPrimary,
    fontSize: 24,
    fontWeight: '900',
    textAlign: 'center',
    paddingTop: 12,
    paddingBottom: 8,
    letterSpacing: 2,
  },
  profileCard: { marginHorizontal: 20, marginBottom: 16 },
  profileRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  profileEmoji: { fontSize: 32 },
  profileInfo: { flex: 1 },
  profileName: { color: Colors.textPrimary, fontSize: 16, fontWeight: '700' },
  profileRecord: { color: Colors.textSecondary, fontSize: 12, marginTop: 2 },
  levelWrap: { marginTop: 12 },
  list: { paddingHorizontal: 20, paddingBottom: 100 },
  rowCard: { marginBottom: 8, padding: 12 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  rankBadge: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  rankText: { color: Colors.textPrimary, fontSize: 14, fontWeight: '800' },
  avatar: { fontSize: 24 },
  info: { flex: 1 },
  name: { color: Colors.textPrimary, fontSize: 14, fontWeight: '600' },
  meta: { color: Colors.textMuted, fontSize: 11, marginTop: 1 },
});
