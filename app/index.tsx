import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

function TimerCard({ title, timing, duration, accent, onPress }: { title: string; timing: string; duration: string; accent: string; onPress: () => void }) {
  return <Pressable onPress={onPress} style={({ pressed }) => [styles.timerCard, { borderLeftColor: accent }, pressed && styles.pressed]}><View style={styles.cardText}><Text style={styles.cardTitle}>{title}</Text><Text style={styles.cardTiming}>{timing}</Text></View><View style={styles.durationPill}><Text style={styles.durationText}>{duration}</Text></View><Text style={styles.arrow}>›</Text></Pressable>;
}

function NumberControl({ label, value, unit, minimum, maximum, step, onChange }: { label: string; value: number; unit: string; minimum: number; maximum: number; step: number; onChange: (value: number) => void }) {
  return <View style={styles.numberControl}>
    <View><Text style={styles.label}>{label}</Text><Text style={styles.controlValue}>{value} <Text style={styles.controlUnit}>{unit}</Text></Text></View>
    <View style={styles.stepper}>
      <Pressable accessibilityLabel={`Decrease ${label.toLowerCase()}`} disabled={value <= minimum} onPress={() => onChange(Math.max(minimum, value - step))} style={({ pressed }) => [styles.stepButton, value <= minimum && styles.stepDisabled, pressed && styles.pressed]}><Text style={styles.stepText}>−</Text></Pressable>
      <Pressable accessibilityLabel={`Increase ${label.toLowerCase()}`} disabled={value >= maximum} onPress={() => onChange(Math.min(maximum, value + step))} style={({ pressed }) => [styles.stepButton, value >= maximum && styles.stepDisabled, pressed && styles.pressed]}><Text style={styles.stepText}>+</Text></Pressable>
    </View>
  </View>;
}

export default function HomeScreen() {
  const [work, setWork] = useState(45);
  const [rest, setRest] = useState(15);
  const [minutes, setMinutes] = useState(20);

  function openTimer(title: string, workSeconds: number, restSeconds: number, totalMinutes: number) {
    router.push({ pathname: '/workout', params: { title, work: String(workSeconds), rest: String(restSeconds), minutes: String(totalMinutes) } });
  }

  function openCustomTimer() {
    openTimer('Custom workout', work, rest, minutes);
  }

  return <SafeAreaView style={styles.safeArea}><ScrollView contentContainerStyle={styles.content}>
    <View style={styles.hero}><Text style={styles.kicker}>READY. SET. SWEAT.</Text><Text style={styles.title}>HIIT Timer</Text><Text style={styles.subtitle}>Simple intervals. Big effort. No account required.</Text></View>
    <Text style={styles.sectionTitle}>QUICK START</Text>
    <TimerCard title="Go Hard 30" timing="60 sec work  •  30 sec rest" duration="30 min" accent="#20B86A" onPress={() => openTimer('Go Hard 30', 60, 30, 30)} />
    <TimerCard title="Fast 40/20" timing="40 sec work  •  20 sec rest" duration="10 min" accent="#FF9F1C" onPress={() => openTimer('Fast 40/20', 40, 20, 10)} />
    <View style={styles.customCard}><Text style={styles.customTitle}>Build your own</Text><Text style={styles.customSubtitle}>Use the controls to set each interval.</Text><View style={styles.controlsList}>
      <NumberControl label="WORK" value={work} unit="sec" minimum={5} maximum={600} step={5} onChange={setWork} />
      <NumberControl label="REST" value={rest} unit="sec" minimum={5} maximum={600} step={5} onChange={setRest} />
      <NumberControl label="TOTAL" value={minutes} unit="min" minimum={1} maximum={120} step={1} onChange={setMinutes} />
    </View><Pressable onPress={openCustomTimer} style={({ pressed }) => [styles.customButton, pressed && styles.pressed]}><Text style={styles.customButtonText}>START CUSTOM TIMER</Text></Pressable></View>
    <Text style={styles.credit}>Built with VibeCode Coach</Text>
  </ScrollView></SafeAreaView>;
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F6F4EF' }, content: { padding: 22, paddingBottom: 40, gap: 14 }, hero: { paddingVertical: 20 }, kicker: { color: '#148A50', fontSize: 13, fontWeight: '900', letterSpacing: 2 }, title: { color: '#171A18', fontSize: 48, lineHeight: 54, fontWeight: '900', letterSpacing: -1.8, marginTop: 6 }, subtitle: { color: '#666C68', fontSize: 17, lineHeight: 24, marginTop: 8, maxWidth: 310 }, sectionTitle: { color: '#777B78', fontSize: 12, fontWeight: '900', letterSpacing: 1.5, marginTop: 4 },
  timerCard: { minHeight: 96, backgroundColor: '#FFF', borderRadius: 18, borderLeftWidth: 7, padding: 18, flexDirection: 'row', alignItems: 'center', gap: 12, shadowColor: '#111', shadowOpacity: 0.05, shadowRadius: 10, shadowOffset: { width: 0, height: 4 }, elevation: 2 }, cardText: { flex: 1 }, cardTitle: { color: '#171A18', fontSize: 21, fontWeight: '800' }, cardTiming: { color: '#717672', fontSize: 13, marginTop: 7 }, durationPill: { backgroundColor: '#F0F1EE', paddingHorizontal: 11, paddingVertical: 7, borderRadius: 12 }, durationText: { color: '#343835', fontSize: 12, fontWeight: '800' }, arrow: { color: '#8C918D', fontSize: 32, marginLeft: -4 },
  customCard: { backgroundColor: '#1D211E', borderRadius: 22, padding: 20, marginTop: 8 }, customTitle: { color: '#FFF', fontSize: 24, fontWeight: '900' }, customSubtitle: { color: '#B9BFBA', fontSize: 14, marginTop: 5 }, controlsList: { gap: 10, marginTop: 20 }, numberControl: { minHeight: 68, paddingHorizontal: 14, borderRadius: 14, backgroundColor: '#303531', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }, label: { color: '#AEB4AF', fontSize: 10, fontWeight: '900', letterSpacing: 1 }, controlValue: { color: '#FFF', fontSize: 24, fontWeight: '900', marginTop: 3 }, controlUnit: { color: '#9DA39E', fontSize: 12, fontWeight: '700' }, stepper: { flexDirection: 'row', gap: 8 }, stepButton: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#484E49', alignItems: 'center', justifyContent: 'center' }, stepDisabled: { opacity: 0.3 }, stepText: { color: '#FFF', fontSize: 28, lineHeight: 31, fontWeight: '700' }, customButton: { backgroundColor: '#20B86A', minHeight: 52, borderRadius: 14, alignItems: 'center', justifyContent: 'center', marginTop: 18 }, customButtonText: { color: '#FFF', fontSize: 14, fontWeight: '900', letterSpacing: 0.8 }, pressed: { opacity: 0.82, transform: [{ scale: 0.99 }] }, credit: { textAlign: 'center', color: '#9A9D9A', fontSize: 12, marginTop: 10 },
});
