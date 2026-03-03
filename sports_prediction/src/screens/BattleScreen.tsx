import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../theme';
import { NBAGame } from '../types/index';
import { MOCK_OPPONENTS } from '../data/mockData';
import { useAppStore } from '../store/AppContext';
import { GlassCard, CountdownTimer, CoinBadge } from '../components';

const SCORE_DIFFS = [1, 5, 10, 15, 20];

export default function BattleScreen({ route, navigation }: any) {
  const game: NBAGame = route.params.game;
  const { user, addCoins, recordWin, recordLoss } = useAppStore();

  const [selectedWinner, setSelectedWinner] = useState<string | null>(null);
  const [selectedDiff, setSelectedDiff] = useState<number | null>(null);
  const [battleResult, setBattleResult] = useState<'win' | 'loss' | null>(null);
  const [locked, setLocked] = useState(false);

  const handleLockPrediction = useCallback(() => {
    if (!selectedWinner || selectedDiff === null) {
      Alert.alert('Incomplete', 'Pick a winner and score difference!');
      return;
    }
    setLocked(true);
  }, [selectedWinner, selectedDiff]);

  const handleTimerComplete = useCallback(() => {
    // Mock result: 60% chance of win
    const won = Math.random() > 0.4;
    if (won) {
      recordWin();
      setBattleResult('win');
    } else {
      recordLoss();
      setBattleResult('loss');
    }
  }, [recordWin, recordLoss]);

  const handlePlayAgain = () => {
    setSelectedWinner(null);
    setSelectedDiff(null);
    setBattleResult(null);
    setLocked(false);
  };

  // ── Result overlay ──────────────────────────────────────────────
  if (battleResult) {
    const isWin = battleResult === 'win';
    return (
      <LinearGradient colors={['#0B0E1A', '#1A1040', '#0B0E1A']} style={styles.container}>
        <SafeAreaView style={styles.resultSafe}>
          <Text style={styles.resultEmoji}>{isWin ? '🏆' : '😞'}</Text>
          <Text style={[styles.resultTitle, isWin ? styles.winText : styles.loseText]}>
            {isWin ? 'VICTORY!' : 'DEFEATED'}
          </Text>
          <Text style={styles.resultSub}>
            {isWin ? 'Your prediction was correct!' : 'Better luck next time!'}
          </Text>

          <GlassCard style={styles.rewardCard}>
            <Text style={styles.rewardLabel}>Reward</Text>
            <CoinBadge coins={isWin ? 100 : 10} size="lg" />
            <Text style={styles.rewardXP}>{isWin ? '+50' : '+10'} XP</Text>
          </GlassCard>

          <View style={styles.resultActions}>
            <TouchableOpacity style={styles.resultBtn} onPress={handlePlayAgain}>
              <Text style={styles.resultBtnText}>Play Again</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.resultBtn, styles.resultBtnHome]}
              onPress={() => navigation.popToTop()}
            >
              <Text style={styles.resultBtnText}>Back to Home</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  // ── Battle UI ───────────────────────────────────────────────────
  return (
    <LinearGradient colors={['#0B0E1A', '#1A1040', '#0B0E1A']} style={styles.container}>
      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>⚔️ BATTLE ARENA</Text>
            <CoinBadge coins={user.coins} />
          </View>

          {/* Matchup */}
          <GlassCard style={styles.matchupCard}>
            <View style={styles.matchRow}>
              <View style={styles.matchTeam}>
                <Text style={styles.matchLogo}>{game.homeTeam.logo}</Text>
                <Text style={styles.matchAbbr}>{game.homeTeam.abbr}</Text>
              </View>
              <Text style={styles.matchVs}>VS</Text>
              <View style={styles.matchTeam}>
                <Text style={styles.matchLogo}>{game.awayTeam.logo}</Text>
                <Text style={styles.matchAbbr}>{game.awayTeam.abbr}</Text>
              </View>
            </View>
          </GlassCard>

          {/* Timer */}
          <View style={styles.timerSection}>
            <Text style={styles.timerLabel}>
              {locked ? 'Time Remaining' : 'Battle starts when you lock in'}
            </Text>
            {locked && (
              <CountdownTimer initialSeconds={10} onComplete={handleTimerComplete} />
            )}
          </View>

          {/* Pick Winner */}
          <Text style={styles.sectionTitle}>Pick the Winner</Text>
          <View style={styles.pickerRow}>
            {[game.homeTeam, game.awayTeam].map((team) => (
              <TouchableOpacity
                key={team.id}
                disabled={locked}
                style={[
                  styles.pickerCard,
                  selectedWinner === team.id && styles.pickerActive,
                  locked && styles.pickerLocked,
                ]}
                onPress={() => setSelectedWinner(team.id)}
              >
                <Text style={styles.pickerLogo}>{team.logo}</Text>
                <Text style={styles.pickerAbbr}>{team.abbr}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Score Difference */}
          <Text style={styles.sectionTitle}>Score Difference</Text>
          <View style={styles.diffRow}>
            {SCORE_DIFFS.map((d) => (
              <TouchableOpacity
                key={d}
                disabled={locked}
                style={[
                  styles.diffChip,
                  selectedDiff === d && styles.diffActive,
                  locked && styles.pickerLocked,
                ]}
                onPress={() => setSelectedDiff(d)}
              >
                <Text
                  style={[styles.diffText, selectedDiff === d && styles.diffTextActive]}
                >
                  +{d}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Opponents */}
          <Text style={styles.sectionTitle}>Your Opponents</Text>
          <View style={styles.opponentRow}>
            {MOCK_OPPONENTS.map((o) => (
              <GlassCard key={o.id} style={styles.opponentCard}>
                <Text style={styles.opponentAvatar}>{o.avatar}</Text>
                <Text style={styles.opponentName}>{o.name}</Text>
                <Text style={styles.opponentLevel}>LVL {o.level}</Text>
              </GlassCard>
            ))}
          </View>

          {/* Lock-in Button */}
          {!locked && (
            <TouchableOpacity activeOpacity={0.85} onPress={handleLockPrediction}>
              <LinearGradient
                colors={[Colors.neonOrange, '#FF8F5E']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.lockBtn}
              >
                <Text style={styles.lockBtnText}>🔒 LOCK IN PREDICTION</Text>
              </LinearGradient>
            </TouchableOpacity>
          )}
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { paddingHorizontal: 20, paddingBottom: 40 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  headerTitle: { color: Colors.textPrimary, fontSize: 22, fontWeight: '900', letterSpacing: 2 },
  // Matchup
  matchupCard: { alignItems: 'center', paddingVertical: 20 },
  matchRow: { flexDirection: 'row', alignItems: 'center', gap: 24 },
  matchTeam: { alignItems: 'center' },
  matchLogo: { fontSize: 40 },
  matchAbbr: { color: Colors.textPrimary, fontSize: 18, fontWeight: '800', marginTop: 4 },
  matchVs: { color: Colors.neonOrange, fontSize: 20, fontWeight: '900' },
  // Timer
  timerSection: { alignItems: 'center', paddingVertical: 20 },
  timerLabel: { color: Colors.textSecondary, fontSize: 13, marginBottom: 8 },
  // Sections
  sectionTitle: { color: Colors.textPrimary, fontSize: 16, fontWeight: '700', marginTop: 20, marginBottom: 10 },
  // Pick winner
  pickerRow: { flexDirection: 'row', gap: 12 },
  pickerCard: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: 16,
    paddingVertical: 20,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  pickerActive: { borderColor: Colors.neonOrange, backgroundColor: 'rgba(255,107,43,0.1)' },
  pickerLocked: { opacity: 0.6 },
  pickerLogo: { fontSize: 36 },
  pickerAbbr: { color: Colors.textPrimary, fontSize: 16, fontWeight: '800', marginTop: 6 },
  // Diff
  diffRow: { flexDirection: 'row', gap: 8 },
  diffChip: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: 12,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  diffActive: { borderColor: Colors.electricBlue, backgroundColor: 'rgba(59,130,246,0.12)' },
  diffText: { color: Colors.textSecondary, fontSize: 14, fontWeight: '700' },
  diffTextActive: { color: Colors.electricBlue },
  // Opponents
  opponentRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  opponentCard: { width: '47%', alignItems: 'center', padding: 12 },
  opponentAvatar: { fontSize: 28 },
  opponentName: { color: Colors.textPrimary, fontSize: 12, fontWeight: '600', marginTop: 4 },
  opponentLevel: { color: Colors.textMuted, fontSize: 10, marginTop: 2 },
  // Lock button
  lockBtn: {
    borderRadius: 20,
    paddingVertical: 18,
    alignItems: 'center',
    marginTop: 28,
    shadowColor: Colors.neonOrange,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 10,
  },
  lockBtnText: { color: '#fff', fontSize: 16, fontWeight: '900', letterSpacing: 2 },
  // Result
  resultSafe: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32 },
  resultEmoji: { fontSize: 80 },
  resultTitle: { fontSize: 36, fontWeight: '900', marginTop: 16, letterSpacing: 4 },
  winText: { color: Colors.success },
  loseText: { color: Colors.danger },
  resultSub: { color: Colors.textSecondary, fontSize: 15, marginTop: 8 },
  rewardCard: { alignItems: 'center', marginTop: 32, paddingVertical: 24, width: '80%' },
  rewardLabel: { color: Colors.textMuted, fontSize: 13, marginBottom: 8 },
  rewardXP: { color: Colors.accentPurple, fontSize: 16, fontWeight: '700', marginTop: 8 },
  resultActions: { flexDirection: 'row', gap: 12, marginTop: 32 },
  resultBtn: {
    backgroundColor: Colors.neonOrange,
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 14,
  },
  resultBtnHome: { backgroundColor: Colors.electricBlue },
  resultBtnText: { color: '#fff', fontWeight: '700', fontSize: 14 },
});
