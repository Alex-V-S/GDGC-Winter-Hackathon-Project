import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../theme';
import { useAppStore } from '../store/AppContext';
import { GAMES } from '../data/mockData';
import { NBAGame } from '../types/index';
import { GameCard, CoinBadge, LevelProgressBar } from '../components';

export default function HomeScreen({ navigation }: any) {
  const { user } = useAppStore();
  const [search, setSearch] = useState('');

  const filtered: NBAGame[] = GAMES.filter((g) => {
    const q = search.toLowerCase();
    return (
      g.homeTeam.name.toLowerCase().includes(q) ||
      g.awayTeam.name.toLowerCase().includes(q) ||
      g.homeTeam.abbr.toLowerCase().includes(q) ||
      g.awayTeam.abbr.toLowerCase().includes(q) ||
      g.arena.toLowerCase().includes(q)
    );
  });

  return (
    <LinearGradient colors={['#0B0E1A', '#111427']} style={styles.container}>
      <StatusBar barStyle="light-content" />
      <SafeAreaView style={styles.safe} edges={['top']}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Welcome back,</Text>
            <Text style={styles.username}>{user.username} 🏀</Text>
          </View>
          <CoinBadge coins={user.coins} />
        </View>

        {/* Level bar */}
        <View style={styles.levelBar}>
          <LevelProgressBar level={user.level} xp={user.xp} xpToNext={user.xpToNext} />
        </View>

        {/* Search bar */}
        <View style={styles.searchWrap}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search games, teams, arenas..."
            placeholderTextColor={Colors.textMuted}
            value={search}
            onChangeText={setSearch}
            autoCorrect={false}
            clearButtonMode="while-editing"
          />
          <Text style={styles.searchIcon}>🔍</Text>
        </View>

        {/* Section title */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>🔥 Today's Games</Text>
          <Text style={styles.gameCount}>{filtered.length} matchups</Text>
        </View>

        {/* Games list */}
        <FlatList
          data={filtered}
          keyExtractor={(g) => g.id}
          renderItem={({ item }) => (
            <GameCard
              game={item}
              onPress={() => navigation.navigate('GameDetails', { game: item })}
            />
          )}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <Text style={styles.empty}>No games match your search.</Text>
          }
        />
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safe: { flex: 1 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 4,
  },
  greeting: { color: Colors.textSecondary, fontSize: 13 },
  username: { color: Colors.textPrimary, fontSize: 22, fontWeight: '800' },
  levelBar: { paddingHorizontal: 20, marginTop: 8, marginBottom: 4 },
  searchWrap: {
    marginHorizontal: 20,
    marginTop: 12,
    marginBottom: 8,
    position: 'relative',
  },
  searchInput: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 14,
    paddingHorizontal: 44,
    paddingVertical: 14,
    color: Colors.textPrimary,
    fontSize: 15,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  searchIcon: {
    position: 'absolute',
    left: 14,
    top: 14,
    fontSize: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 8,
    marginBottom: 4,
  },
  sectionTitle: {
    color: Colors.textPrimary,
    fontSize: 18,
    fontWeight: '800',
  },
  gameCount: {
    color: Colors.textMuted,
    fontSize: 12,
  },
  list: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 100,
  },
  empty: {
    color: Colors.textMuted,
    textAlign: 'center',
    marginTop: 40,
    fontSize: 14,
  },
});
