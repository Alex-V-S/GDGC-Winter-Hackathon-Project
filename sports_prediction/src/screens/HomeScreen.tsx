import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { CompositeScreenProps } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Colors } from '../theme';
import { useAppStore } from '../store/AppContext';
import { MainTabParamList, NBAGame, NBAPlayer, NBATeam, RootStackParamList } from '../types/index';
import { GameCard, CoinBadge, LevelProgressBar } from '../components';
import { supabase, isConfigured } from '../services/supabase';

const FALLBACK_TEAM: NBATeam = {
  id: 'unknown', abbr: '???', name: 'Unknown', city: '', logo: '🏀', color: '#666',
};

const FALLBACK_TOP_PLAYERS: NBAPlayer[] = [];

const TEAM_ABBR_MAP: Record<string, string> = {
  Lakers: 'LAL',
  Warriors: 'GSW',
  Celtics: 'BOS',
  Heat: 'MIA',
  Nuggets: 'DEN',
  Suns: 'PHX',
  Bucks: 'MIL',
  Knicks: 'NYK',
  Clippers: 'LAC',
  '76ers': 'PHI',
  Bulls: 'CHI',
  Mavericks: 'DAL',
};

function buildTeam(name: string): NBATeam {
  return {
    ...FALLBACK_TEAM,
    id: name.toLowerCase().replace(/\s+/g, '-'),
    name,
    abbr: TEAM_ABBR_MAP[name] ?? name.slice(0, 3).toUpperCase(),
  };
}

interface SupabaseGameRow {
  id: string;
  home_team: string;
  away_team: string;
  tip_off: string;
  winner: string | null;
  home_score: number | null;
  away_score: number | null;
}

function mapSupabaseGame(row: SupabaseGameRow): NBAGame {
  const home = buildTeam(row.home_team);
  const away = buildTeam(row.away_team);

  const tipOff = new Date(row.tip_off);
  const time = tipOff.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const date = tipOff.toLocaleDateString([], { month: 'short', day: 'numeric' });

  return {
    id: row.id,
    homeTeam: home,
    awayTeam: away,
    date,
    time,
    arena: `${home.city} Arena`,
    homeOdds: -110,
    awayOdds: +110,
    status: row.winner ? 'finished' : 'upcoming',
    homeScore: row.home_score ?? undefined,
    awayScore: row.away_score ?? undefined,
    topPlayers: FALLBACK_TOP_PLAYERS,
  };
}

type HomeScreenProps = CompositeScreenProps<
  BottomTabScreenProps<MainTabParamList, 'Home'>,
  NativeStackScreenProps<RootStackParamList>
>;

export default function HomeScreen({ navigation }: HomeScreenProps) {
  const { user } = useAppStore();
  const [search, setSearch] = useState('');
  const [games, setGames] = useState<NBAGame[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGames();
  }, []);

  const fetchGames = async () => {
    if (!isConfigured) {
      setGames([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const now = new Date();
    const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    const { data, error } = await supabase
      .from('games')
      .select('*')
      .eq('date', today);

    if (error) {
      console.warn('Failed to fetch games:', error.message);
      setGames([]);
    } else {
      setGames(((data ?? []) as SupabaseGameRow[]).map(mapSupabaseGame));
    }
    setLoading(false);
  };

  const filtered: NBAGame[] = games.filter((g) => {
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
        {loading ? (
          <ActivityIndicator color={Colors.neonOrange} size="large" style={{ marginTop: 40 }} />
        ) : (
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
              <Text style={styles.empty}>{search ? 'No games match your search.' : 'No games today.'}</Text>
            }
          />
        )}
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
