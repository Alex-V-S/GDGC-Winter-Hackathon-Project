import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  TextInput,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../theme';
import { useAppStore } from '../store/AppContext';
import { supabase, isConfigured } from '../services/supabase';

const { width } = Dimensions.get('window');

export default function LoginScreen({ navigation }: any) {
  const { login } = useAppStore();

  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);

  // Animated values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const ballBounce = useRef(new Animated.Value(-60)).current;

  useEffect(() => {
    // Entrance animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();

    // Pulse loop for the button
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.05, duration: 1200, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 1200, useNativeDriver: true }),
      ])
    ).start();

    // Basketball bounce loop
    Animated.loop(
      Animated.sequence([
        Animated.timing(ballBounce, { toValue: 0, duration: 600, useNativeDriver: true }),
        Animated.timing(ballBounce, { toValue: -60, duration: 600, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  const handleAuth = async () => {
    // If Supabase isn't configured yet, fall back to mock login
    if (!isConfigured) {
      await login();
      navigation.replace('MainTabs');
      return;
    }

    if (!email || !password) {
      Alert.alert('Missing fields', 'Please enter email and password.');
      return;
    }
    if (mode === 'register' && !username) {
      Alert.alert('Missing fields', 'Please choose a username.');
      return;
    }

    setLoading(true);
    try {
      if (mode === 'login') {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) { Alert.alert('Login failed', error.message); return; }
        await login(data.user?.id);
      } else {
        const { data, error } = await supabase.auth.signUp({ email, password });
        if (error) { Alert.alert('Sign-up failed', error.message); return; }

        // Create profile row for the new user
        if (data.user) {
          const { error: profileError } = await supabase.from('profiles').insert({
            id: data.user.id,
            auth_id: data.user.id,
            username,
          });
          if (profileError) { Alert.alert('Profile error', profileError.message); return; }
          await login(data.user.id);
        }
      }

      navigation.replace('MainTabs');
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient colors={['#0B0E1A', '#1A1040', '#0B0E1A']} style={styles.container}>
      <SafeAreaView style={styles.safe}>
        <Animated.View style={[styles.content, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
          {/* Bouncing basketball */}
          <Animated.Text style={[styles.ball, { transform: [{ translateY: ballBounce }] }]}>
            🏀
          </Animated.Text>

          {/* Title */}
          <Text style={styles.title}>NBA</Text>
          <Text style={styles.subtitle}>PREDICTION ARENA</Text>

          {/* Tagline */}
          <Text style={styles.tagline}>
            Pick winners. Battle rivals. Earn coins.
          </Text>

          {/* Decorative court lines */}
          <View style={styles.courtLine} />
          <View style={styles.courtCircle} />

          {/* Auth form */}
          {mode === 'register' && (
            <TextInput
              style={styles.input}
              placeholder="Username"
              placeholderTextColor={Colors.textMuted}
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
            />
          )}
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor={Colors.textMuted}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor={Colors.textMuted}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          {/* Enter button */}
          <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
            <TouchableOpacity style={styles.enterButton} activeOpacity={0.8} onPress={handleAuth} disabled={loading}>
              <LinearGradient
                colors={[Colors.neonOrange, '#FF8F5E']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.enterGradient}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.enterText}>
                    {mode === 'login' ? '⚡ ENTER ARENA' : '🏀 CREATE ACCOUNT'}
                  </Text>
                )}
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>

          {/* Toggle login / register */}
          <TouchableOpacity onPress={() => setMode(mode === 'login' ? 'register' : 'login')} style={styles.toggleButton}>
            <Text style={styles.toggleText}>
              {mode === 'login' ? "Don't have an account? Sign Up" : 'Already have an account? Log In'}
            </Text>
          </TouchableOpacity>

          {/* Stats teaser */}
          <View style={styles.statsTeaser}>
            <View style={styles.teaserItem}>
              <Text style={styles.teaserValue}>6</Text>
              <Text style={styles.teaserLabel}>Games Today</Text>
            </View>
            <View style={styles.teaserDivider} />
            <View style={styles.teaserItem}>
              <Text style={styles.teaserValue}>1.2K</Text>
              <Text style={styles.teaserLabel}>Active Players</Text>
            </View>
            <View style={styles.teaserDivider} />
            <View style={styles.teaserItem}>
              <Text style={styles.teaserValue}>50K</Text>
              <Text style={styles.teaserLabel}>Coins Pool</Text>
            </View>
          </View>
        </Animated.View>

        <Text style={styles.footer}>CourtCall v1.0</Text>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safe: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  content: { alignItems: 'center', paddingHorizontal: 32 },
  ball: { fontSize: 72, marginBottom: 8 },
  title: {
    fontSize: 56,
    fontWeight: '900',
    color: Colors.textPrimary,
    letterSpacing: 10,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.neonOrange,
    letterSpacing: 6,
    marginTop: 4,
  },
  tagline: {
    color: Colors.textSecondary,
    fontSize: 15,
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 32,
    lineHeight: 22,
  },
  courtLine: {
    width: width * 0.6,
    height: 1,
    backgroundColor: 'rgba(255,107,43,0.2)',
    marginBottom: 12,
  },
  courtCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,107,43,0.15)',
    marginBottom: 20,
  },
  input: {
    width: width * 0.78,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    color: Colors.textPrimary,
    fontSize: 15,
    paddingHorizontal: 18,
    paddingVertical: 14,
    marginBottom: 12,
  },
  toggleButton: {
    marginTop: 16,
  },
  toggleText: {
    color: Colors.electricBlue,
    fontSize: 13,
    fontWeight: '600',
  },
  enterButton: {
    borderRadius: 30,
    overflow: 'hidden',
    shadowColor: Colors.neonOrange,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 12,
  },
  enterGradient: {
    paddingHorizontal: 48,
    paddingVertical: 18,
    borderRadius: 30,
    alignItems: 'center',
  },
  enterText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 2,
  },
  statsTeaser: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 48,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  teaserItem: { alignItems: 'center', flex: 1 },
  teaserValue: { color: Colors.electricBlue, fontSize: 20, fontWeight: '800' },
  teaserLabel: { color: Colors.textMuted, fontSize: 10, marginTop: 2 },
  teaserDivider: {
    width: 1,
    height: 30,
    backgroundColor: Colors.border,
  },
  footer: {
    position: 'absolute',
    bottom: 32,
    color: Colors.textMuted,
    fontSize: 11,
  },
});
