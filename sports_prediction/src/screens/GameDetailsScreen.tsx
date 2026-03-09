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
import { GlassCard } from '../components';
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
  const [awayData, setAwayData] = useState<PlayerPredictionResponse | null>(null);

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
      const awayTeamName = game.awayTeam.name;
      const homeStar = TEAM_STAR_PLAYERS[homeTeamName];
      const awayStar = TEAM_STAR_PLAYERS[awayTeamName];

      const [homePrediction, awayPrediction] = await Promise.all([
        homeStar ? getPlayerPrediction(homeStar, homeTeamName) : Promise.resolve(null),
        awayStar ? getPlayerPrediction(awayStar, awayTeamName) : Promise.resolve(null),
      ]);

      const updatedPlayers = game.topPlayers.map((player) => {
        const match = [homePrediction, awayPrediction].find(
          (pred) => pred && pred.player.name === player.name
        );
        if (!match) return player;

        const recentGames = match.historical_performance.map((item) => item.points);
        return {
          ...player,
          ppg: match.season_averages.ppg,
          rpg: match.season_averages.rpg,
          apg: match.season_averages.apg,
          recentGames: recentGames.length > 0 ? recentGames : player.recentGames,
          projection: match.prediction.projected_points,
        };
      });

      if (!cancelled) {
        setMlData(homePrediction);
        setAwayData(awayPrediction);
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

          {/* Key Players — side-by-side ML cards */}
          <Text style={styles.sectionTitle}>⭐ Key Players</Text>
          {loadingPredictions ? (
            <Text style={styles.mlStatusText}>Loading player projections...</Text>
          ) : (
            <View style={styles.playerCardsRow}>
              {mlData && (
                <GlassCard style={styles.playerCard}>
                  <Text style={styles.playerCardTeam}>{game.homeTeam.abbr}</Text>
                  <Text style={styles.playerCardName}>{mlData.player.name}</Text>
                  <Text style={styles.playerCardProjValue}>{mlData.prediction.projected_points}</Text>
                  <Text style={styles.playerCardProjLabel}>Proj PTS</Text>
                  <View style={styles.playerCardMiniStats}>
                    <View style={styles.playerCardMiniStat}>
                      <Text style={styles.miniStatVal}>{mlData.season_averages.ppg}</Text>
                      <Text style={styles.miniStatLbl}>PTS</Text>
                    </View>
                    <View style={styles.playerCardMiniStat}>
                      <Text style={styles.miniStatVal}>{mlData.season_averages.rpg}</Text>
                      <Text style={styles.miniStatLbl}>REB</Text>
                    </View>
                    <View style={styles.playerCardMiniStat}>
                      <Text style={styles.miniStatVal}>{mlData.season_averages.apg}</Text>
                      <Text style={styles.miniStatLbl}>AST</Text>
                    </View>
                  </View>
                </GlassCard>
              )}
              {awayData && (
                <GlassCard style={styles.playerCard}>
                  <Text style={styles.playerCardTeam}>{game.awayTeam.abbr}</Text>
                  <Text style={styles.playerCardName}>{awayData.player.name}</Text>
                  <Text style={styles.playerCardProjValue}>{awayData.prediction.projected_points}</Text>
                  <Text style={styles.playerCardProjLabel}>Proj PTS</Text>
                  <View style={styles.playerCardMiniStats}>
                    <View style={styles.playerCardMiniStat}>
                      <Text style={styles.miniStatVal}>{awayData.season_averages.ppg}</Text>
                      <Text style={styles.miniStatLbl}>PTS</Text>
                    </View>
                    <View style={styles.playerCardMiniStat}>
                      <Text style={styles.miniStatVal}>{awayData.season_averages.rpg}</Text>
                      <Text style={styles.miniStatLbl}>REB</Text>
                    </View>
                    <View style={styles.playerCardMiniStat}>
                      <Text style={styles.miniStatVal}>{awayData.season_averages.apg}</Text>
                      <Text style={styles.miniStatLbl}>AST</Text>
                    </View>
                  </View>
                </GlassCard>
              )}
              {!mlData && !awayData && (
                <Text style={styles.mlStatusText}>Player projections unavailable</Text>
              )}
            </View>
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
            {mlData && awayData ? (
              <Text style={styles.analysisText}>
                <Text style={styles.highlight}>{game.homeTeam.name}</Text> host{' '}
                <Text style={styles.highlight}>{game.awayTeam.name}</Text> tonight.{`\n\n`}
                {mlData.player.name} leads {game.homeTeam.name} averaging{' '}
                <Text style={styles.highlightOrange}>{mlData.season_averages.ppg} PPG</Text> this season
                — our AI projects{' '}
                <Text style={styles.highlightOrange}>{mlData.prediction.projected_points} points</Text>{' '}
                tonight.{`\n\n`}
                {awayData.player.name} counters for {game.awayTeam.name} with{' '}
                <Text style={styles.highlightOrange}>{awayData.season_averages.ppg} PPG</Text>, projected
                at <Text style={styles.highlightOrange}>{awayData.prediction.projected_points}</Text>{' '}
                tonight.{`\n\n`}
                {mlData.prediction.projected_points > awayData.prediction.projected_points
                  ? `Edge: ${game.homeTeam.name} 🏠`
                  : `Edge: ${game.awayTeam.name} 🚀`}
              </Text>
            ) : (
              <Text style={styles.analysisText}>
                {loadingPredictions ? 'Loading AI analysis...' : 'AI analysis unavailable — ML service may be offline.'}
              </Text>
            )}
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
  // Side-by-side player cards
  playerCardsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  playerCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 8,
  },
  playerCardTeam: {
    color: Colors.textMuted,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 2,
    marginBottom: 4,
  },
  playerCardName: {
    color: Colors.textPrimary,
    fontSize: 13,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 8,
  },
  playerCardProjValue: {
    color: Colors.neonOrange,
    fontSize: 32,
    fontWeight: '900',
  },
  playerCardProjLabel: {
    color: Colors.textMuted,
    fontSize: 10,
    marginBottom: 10,
  },
  playerCardMiniStats: {
    flexDirection: 'row',
    gap: 12,
  },
  playerCardMiniStat: {
    alignItems: 'center',
  },
  miniStatVal: {
    color: Colors.textSecondary,
    fontSize: 13,
    fontWeight: '700',
  },
  miniStatLbl: {
    color: Colors.textMuted,
    fontSize: 9,
    marginTop: 1,
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
