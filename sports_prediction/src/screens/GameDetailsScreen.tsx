import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LineChart } from 'react-native-gifted-charts';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Colors } from '../theme';
import { NBAGame, NBAPlayer, RootStackParamList } from '../types/index';
import { GlassCard, PlayerStatCard } from '../components';
import { getPlayerPrediction, PlayerPredictionResponse } from '../services/api';

const { width: SCREEN_W } = Dimensions.get('window');

const TEAM_STAR_PLAYERS: Record<string, string> = {
  Lakers: 'LeBron James',
  Warriors: 'Stephen Curry',
  Celtics: 'Jayson Tatum',
  Heat: 'Jimmy Butler',
  Nuggets: 'Nikola Jokic',
  Suns: 'Kevin Durant',
  Bucks: 'Giannis Antetokounmpo',
  Knicks: 'Jalen Brunson',
  Clippers: 'Kawhi Leonard',
  '76ers': 'Joel Embiid',
  Bulls: 'DeMar DeRozan',
  Mavericks: 'Luka Doncic',
};

type GameDetailsProps = NativeStackScreenProps<RootStackParamList, 'GameDetails'>;

export default function GameDetailsScreen({ route, navigation }: GameDetailsProps) {
  const game: NBAGame = route.params.game;
  const [playersWithPredictions, setPlayersWithPredictions] = useState<NBAPlayer[]>(game.topPlayers);
  const [loadingPredictions, setLoadingPredictions] = useState(false);
  const [mlData, setMlData] = useState<PlayerPredictionResponse | null>(null);

  // Animated 3D basketball
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(scaleAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.loop(
        Animated.timing(rotateAnim, { toValue: 1, duration: 4000, useNativeDriver: true })
      ),
    ]).start();
  }, []);

  useEffect(() => {
    let cancelled = false;

    const loadPredictions = async () => {
      setPlayersWithPredictions(game.topPlayers);
      setLoadingPredictions(true);

      const homeTeamName = game.homeTeam.name;
      const starPlayer = TEAM_STAR_PLAYERS[homeTeamName];

      let starPrediction: PlayerPredictionResponse | null = null;
      if (starPlayer) {
        starPrediction = await getPlayerPrediction(starPlayer, homeTeamName);
      }

      const updatedPlayers = game.topPlayers.map((player) => {
        if (!starPrediction || player.name !== starPrediction.player.name) {
          return player;
        }

        const recentGames = starPrediction.historical_performance.map((item) => item.points);
        return {
          ...player,
          ppg: starPrediction.season_averages.ppg,
          rpg: starPrediction.season_averages.rpg,
          apg: starPrediction.season_averages.apg,
          recentGames: recentGames.length > 0 ? recentGames : player.recentGames,
          projection: starPrediction.prediction.projected_points,
        };
      });

      if (!cancelled) {
        setMlData(starPrediction);
        setPlayersWithPredictions(updatedPlayers);
        setLoadingPredictions(false);
      }
    };

    loadPredictions();

    return () => {
      cancelled = true;
    };
  }, [game]);

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  // Chart data for first top player
  const chartPlayer = playersWithPredictions[0];
  const chartData = chartPlayer
    ? [
        ...chartPlayer.recentGames.map((v: number, i: number) => ({
          value: v,
          label: `G${i + 1}`,
          dataPointColor: Colors.electricBlue,
        })),
        {
          value: chartPlayer.projection,
          label: 'PROJ',
          dataPointColor: Colors.neonOrange,
          labelTextStyle: { color: Colors.neonOrange, fontWeight: 'bold' as const, fontSize: 10 },
        },
      ]
    : [];

  return (
    <LinearGradient colors={['#0B0E1A', '#1A1040', '#0B0E1A']} style={styles.container}>
      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          {/* Animated header */}
          <View style={styles.heroSection}>
            <Animated.Text
              style={[
                styles.heroBall,
                { transform: [{ rotate: spin }, { scale: scaleAnim }] },
              ]}
            >
              🏀
            </Animated.Text>

            <View style={styles.heroMatchup}>
              <View style={styles.heroTeam}>
                <Text style={styles.heroLogo}>{game.homeTeam.logo}</Text>
                <Text style={styles.heroAbbr}>{game.homeTeam.abbr}</Text>
              </View>
              <View style={styles.heroVs}>
                <Text style={styles.heroVsText}>VS</Text>
              </View>
              <View style={styles.heroTeam}>
                <Text style={styles.heroLogo}>{game.awayTeam.logo}</Text>
                <Text style={styles.heroAbbr}>{game.awayTeam.abbr}</Text>
              </View>
            </View>

            <Text style={styles.heroDate}>
              {game.date} · {game.time}
            </Text>
            <Text style={styles.heroArena}>📍 {game.arena}</Text>
          </View>

          {mlData && (
            <View style={styles.mlCard}>
              <Text style={styles.mlTitle}>🤖 AI Player Projection</Text>
              <Text style={styles.mlPlayer}>{mlData.player.name}</Text>
              <View style={styles.mlStats}>
                <View style={styles.mlStat}>
                  <Text style={styles.mlStatValue}>{mlData.prediction.projected_points}</Text>
                  <Text style={styles.mlStatLabel}>Proj PTS</Text>
                </View>
                <View style={styles.mlStat}>
                  <Text style={styles.mlStatValue}>{mlData.season_averages.ppg}</Text>
                  <Text style={styles.mlStatLabel}>Avg PTS</Text>
                </View>
                <View style={styles.mlStat}>
                  <Text style={styles.mlStatValue}>{mlData.season_averages.rpg}</Text>
                  <Text style={styles.mlStatLabel}>Avg REB</Text>
                </View>
                <View style={styles.mlStat}>
                  <Text style={styles.mlStatValue}>{mlData.season_averages.apg}</Text>
                  <Text style={styles.mlStatLabel}>Avg AST</Text>
                </View>
              </View>
            </View>
          )}

          {/* Player Stats Cards */}
          <Text style={styles.sectionTitle}>⭐ Key Players</Text>
          {playersWithPredictions.map((p) => (
            <PlayerStatCard key={p.id} player={p} />
          ))}

          {loadingPredictions && (
            <Text style={styles.mlStatusText}>Updating projections from ML engine...</Text>
          )}

          {/* Performance Trend Chart */}
          {chartPlayer && (
            <>
              <Text style={styles.sectionTitle}>📈 Performance Trend</Text>
              <GlassCard style={styles.chartCard}>
                <Text style={styles.chartTitle}>{chartPlayer.name} – Points</Text>
                <View style={styles.chartWrap}>
                  <LineChart
                    data={chartData}
                    width={SCREEN_W - 110}
                    height={160}
                    thickness={3}
                    color={Colors.electricBlue}
                    maxValue={45}
                    noOfSections={4}
                    yAxisTextStyle={{ color: Colors.textMuted, fontSize: 10 }}
                    xAxisLabelTextStyle={{ color: Colors.textMuted, fontSize: 10 }}
                    hideRules
                    isAnimated
                    animationDuration={1000}
                    startFillColor="rgba(59,130,246,0.2)"
                    endFillColor="rgba(59,130,246,0)"
                    areaChart
                    curved
                  />
                </View>
              </GlassCard>
            </>
          )}

          {/* Analytics Explanation */}
          <Text style={styles.sectionTitle}>🧠 Quick Analysis</Text>
          <GlassCard style={styles.analysisCard}>
            <Text style={styles.analysisText}>
              Based on recent performance, <Text style={styles.highlight}>{game.homeTeam.name}</Text> have
              a slight edge at home. {chartPlayer?.name} has been averaging{' '}
              <Text style={styles.highlight}>{chartPlayer?.ppg} PPG</Text> and is projected for{' '}
              <Text style={styles.highlightOrange}>{chartPlayer?.projection} points</Text> in this
              matchup. The odds favor the home team at{' '}
              <Text style={styles.highlight}>{game.homeOdds}</Text>.
            </Text>
          </GlassCard>

          {/* Join Battle CTA */}
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => navigation.navigate('Battle', { game })}
          >
            <LinearGradient
              colors={[Colors.neonOrange, '#FF8F5E']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.battleBtn}
            >
              <Text style={styles.battleBtnText}>⚔️ JOIN BATTLE</Text>
            </LinearGradient>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { paddingHorizontal: 20, paddingBottom: 40 },
  // Hero
  heroSection: { alignItems: 'center', paddingTop: 8, paddingBottom: 20 },
  heroBall: { fontSize: 64, marginBottom: 12 },
  heroMatchup: { flexDirection: 'row', alignItems: 'center', gap: 20 },
  heroTeam: { alignItems: 'center' },
  heroLogo: { fontSize: 44 },
  heroAbbr: { color: Colors.textPrimary, fontSize: 22, fontWeight: '900', letterSpacing: 3, marginTop: 4 },
  heroVs: {
    backgroundColor: 'rgba(255,107,43,0.15)',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: 'rgba(255,107,43,0.3)',
  },
  heroVsText: { color: Colors.neonOrange, fontSize: 16, fontWeight: '900' },
  heroDate: { color: Colors.textSecondary, fontSize: 14, marginTop: 12 },
  heroArena: { color: Colors.textMuted, fontSize: 12, marginTop: 4 },
  // Sections
  sectionTitle: {
    color: Colors.textPrimary,
    fontSize: 18,
    fontWeight: '800',
    marginTop: 20,
    marginBottom: 12,
  },
  mlStatusText: {
    color: Colors.textMuted,
    fontSize: 12,
    marginTop: 4,
    marginBottom: 8,
  },
  mlCard: {
    backgroundColor: 'rgba(255,107,0,0.1)',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginTop: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,107,0,0.3)',
  },
  mlTitle: { color: '#FF6B00', fontSize: 12, fontWeight: '600', marginBottom: 8 },
  mlPlayer: { color: '#FFFFFF', fontSize: 16, fontWeight: '700', marginBottom: 12 },
  mlStats: { flexDirection: 'row', justifyContent: 'space-around' },
  mlStat: { alignItems: 'center' },
  mlStatValue: { color: '#FF6B00', fontSize: 20, fontWeight: '800' },
  mlStatLabel: { color: '#888', fontSize: 11, marginTop: 2 },
  // Chart
  chartCard: { alignItems: 'center', paddingVertical: 20 },
  chartTitle: { color: Colors.textSecondary, fontSize: 13, marginBottom: 12 },
  chartWrap: { marginLeft: -10 },
  // Analysis
  analysisCard: { marginBottom: 8 },
  analysisText: { color: Colors.textSecondary, fontSize: 14, lineHeight: 22 },
  highlight: { color: Colors.electricBlue, fontWeight: '700' },
  highlightOrange: { color: Colors.neonOrange, fontWeight: '700' },
  // Battle CTA
  battleBtn: {
    borderRadius: 20,
    paddingVertical: 18,
    alignItems: 'center',
    marginTop: 24,
    shadowColor: Colors.neonOrange,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 10,
  },
  battleBtnText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 3,
  },
});
