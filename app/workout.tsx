import * as Haptics from 'expo-haptics';
import { useKeepAwake } from 'expo-keep-awake';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type Phase = 'work' | 'rest';
type Clock = { phase: Phase; phaseRemaining: number; totalRemaining: number; round: number; complete: boolean };

function numberParam(value: string | string[] | undefined, fallback: number) {
  const parsed = Number(Array.isArray(value) ? value[0] : value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function formatTime(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60);
  return `${minutes}:${(totalSeconds % 60).toString().padStart(2, '0')}`;
}

export default function WorkoutScreen() {
  useKeepAwake();
  const params = useLocalSearchParams<{ title?: string; work?: string; rest?: string; minutes?: string }>();
  const workSeconds = numberParam(params.work, 60);
  const restSeconds = numberParam(params.rest, 30);
  const totalSeconds = numberParam(params.minutes, 30) * 60;
  const title = params.title ?? 'HIIT workout';
  const initialClock = useMemo<Clock>(() => ({ phase: 'work', phaseRemaining: Math.min(workSeconds, totalSeconds), totalRemaining: totalSeconds, round: 1, complete: false }), [totalSeconds, workSeconds]);
  const [clock, setClock] = useState(initialClock);
  const [running, setRunning] = useState(false);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (!running || clock.complete) return;
    const interval = setInterval(() => setClock((current) => {
      if (current.totalRemaining <= 1) return { ...current, phaseRemaining: 0, totalRemaining: 0, complete: true };
      if (current.phaseRemaining > 1) return { ...current, phaseRemaining: current.phaseRemaining - 1, totalRemaining: current.totalRemaining - 1 };
      const nextPhase: Phase = current.phase === 'work' ? 'rest' : 'work';
      const nextDuration = nextPhase === 'work' ? workSeconds : restSeconds;
      return { phase: nextPhase, phaseRemaining: Math.min(nextDuration, current.totalRemaining - 1), totalRemaining: current.totalRemaining - 1, round: nextPhase === 'work' ? current.round + 1 : current.round, complete: false };
    }), 1000);
    return () => clearInterval(interval);
  }, [clock.complete, restSeconds, running, workSeconds]);

  useEffect(() => {
    if (!started) return;
    if (clock.complete) {
      setRunning(false);
      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } else {
      void Haptics.impactAsync(clock.phase === 'work' ? Haptics.ImpactFeedbackStyle.Heavy : Haptics.ImpactFeedbackStyle.Medium);
    }
  }, [clock.complete, clock.phase, started]);

  function startOrPause() { setStarted(true); setRunning((current) => !current); }
  function restart() { setRunning(false); setStarted(false); setClock(initialClock); }

  if (clock.complete) return <SafeAreaView style={styles.completeSafe}><View style={styles.completeContent}><Text style={styles.completeMark}>✓</Text><Text style={styles.completeTitle}>Workout complete!</Text><Text style={styles.completeCopy}>You finished {title}. Nice work.</Text><Pressable onPress={restart} style={styles.darkButton}><Text style={styles.darkButtonText}>DO IT AGAIN</Text></Pressable><Pressable onPress={() => router.back()} style={styles.linkButton}><Text style={styles.linkText}>CHOOSE ANOTHER TIMER</Text></Pressable></View></SafeAreaView>;

  const isWork = clock.phase === 'work';
  return <SafeAreaView style={[styles.safeArea, isWork ? styles.workBackground : styles.restBackground]}>
    <View style={styles.topRow}><Pressable onPress={() => router.back()} style={styles.closeButton}><Text style={styles.closeText}>×</Text></Pressable><Text style={styles.workoutName}>{title}</Text><View style={styles.closeButton} /></View>
    <View style={styles.content}><Text style={styles.round}>ROUND {clock.round}</Text><Text style={styles.phase}>{started ? (isWork ? 'GO HARD!' : 'REST') : 'READY?'}</Text><Text adjustsFontSizeToFit numberOfLines={1} style={styles.timer}>{formatTime(clock.phaseRemaining)}</Text><Text style={styles.next}>{started ? (isWork ? `Rest is next • ${formatTime(restSeconds)}` : `Work is next • ${formatTime(workSeconds)}`) : `${formatTime(workSeconds)} work • ${formatTime(restSeconds)} rest`}</Text></View>
    <View style={styles.controls}><Text style={styles.totalLabel}>TOTAL TIME LEFT</Text><Text style={styles.totalTime}>{formatTime(clock.totalRemaining)}</Text><Pressable onPress={startOrPause} style={({ pressed }) => [styles.mainButton, pressed && styles.pressed]}><Text style={styles.mainButtonText}>{!started ? 'START' : running ? 'PAUSE' : 'RESUME'}</Text></Pressable>{started && <Pressable onPress={restart} style={styles.resetButton}><Text style={styles.resetText}>RESET WORKOUT</Text></Pressable>}</View>
  </SafeAreaView>;
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 }, workBackground: { backgroundColor: '#16A85F' }, restBackground: { backgroundColor: '#E4473E' }, topRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 18, paddingTop: 8 }, closeButton: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' }, closeText: { color: '#FFF', fontSize: 34, fontWeight: '300' }, workoutName: { color: '#FFF', fontSize: 15, fontWeight: '800' }, content: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 20 }, round: { color: 'rgba(255,255,255,0.72)', fontSize: 14, fontWeight: '900', letterSpacing: 2 }, phase: { color: '#FFF', fontSize: 46, lineHeight: 54, fontWeight: '900', letterSpacing: -1, marginTop: 14 }, timer: { color: '#FFF', fontSize: 112, lineHeight: 125, fontWeight: '900', letterSpacing: -5, marginTop: 4 }, next: { color: 'rgba(255,255,255,0.82)', fontSize: 16, fontWeight: '700', marginTop: 8 }, controls: { padding: 24, alignItems: 'center' }, totalLabel: { color: 'rgba(255,255,255,0.65)', fontSize: 10, fontWeight: '900', letterSpacing: 1.5 }, totalTime: { color: '#FFF', fontSize: 22, fontWeight: '800', marginTop: 3, marginBottom: 18 }, mainButton: { width: '100%', minHeight: 64, borderRadius: 32, backgroundColor: '#FFF', alignItems: 'center', justifyContent: 'center' }, mainButtonText: { color: '#1F2420', fontSize: 18, fontWeight: '900', letterSpacing: 1 }, resetButton: { paddingVertical: 16 }, resetText: { color: 'rgba(255,255,255,0.86)', fontSize: 12, fontWeight: '900', letterSpacing: 1 }, pressed: { opacity: 0.85, transform: [{ scale: 0.99 }] },
  completeSafe: { flex: 1, backgroundColor: '#F6F4EF' }, completeContent: { flex: 1, padding: 28, alignItems: 'center', justifyContent: 'center', gap: 18 }, completeMark: { color: '#16A85F', fontSize: 88, fontWeight: '900' }, completeTitle: { color: '#171A18', fontSize: 38, fontWeight: '900', textAlign: 'center' }, completeCopy: { color: '#686D69', fontSize: 17, lineHeight: 24, textAlign: 'center', marginBottom: 16 }, darkButton: { width: '100%', minHeight: 58, borderRadius: 29, backgroundColor: '#1D211E', alignItems: 'center', justifyContent: 'center' }, darkButtonText: { color: '#FFF', fontSize: 15, fontWeight: '900', letterSpacing: 1 }, linkButton: { padding: 12 }, linkText: { color: '#343936', fontSize: 12, fontWeight: '900', letterSpacing: 0.8 },
});
