import React, { useEffect, useState } from 'react';
import { Text, StyleSheet } from 'react-native';
import { Colors } from '../theme';

interface CountdownTimerProps {
  /** ISO timestamp or mock future string */
  targetDate?: Date;
  /** seconds override for mock */
  initialSeconds?: number;
  onComplete?: () => void;
}

export default function CountdownTimer({
  initialSeconds = 300,
  onComplete,
}: CountdownTimerProps) {
  const [seconds, setSeconds] = useState(initialSeconds);

  useEffect(() => {
    if (seconds <= 0) {
      onComplete?.();
      return;
    }
    const id = setInterval(() => setSeconds((s) => s - 1), 1000);
    return () => clearInterval(id);
  }, [seconds, onComplete]);

  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;

  return (
    <Text style={styles.timer}>
      {String(mins).padStart(2, '0')}:{String(secs).padStart(2, '0')}
    </Text>
  );
}

const styles = StyleSheet.create({
  timer: {
    color: Colors.neonOrange,
    fontSize: 42,
    fontWeight: '900',
    letterSpacing: 4,
    fontVariant: ['tabular-nums'],
    textShadowColor: 'rgba(255,107,43,0.4)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 12,
  },
});
