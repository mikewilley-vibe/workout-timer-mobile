import { router } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

function TimerCard({ title, timing, duration, accent, onPress }: { title: string; timing: string; duration: string; accent: string; onPress: () => void }) {
  return <Pressable onPress={onPress} style={({ pressed }) => [styles.timerCard, { borderLeftColor: accent }, pressed && styles.pressed]}><View style={styles.cardText}><Text style={styles.cardTitle}>{title}</Text><Text style={styles.cardTiming}>{timing}</Text></View><View style={styles.durationPill}><Text style={styles.durationText}>{duration}</Text></View><Text style={styles.arrow}>›</Text></Pressable>;
}

export default function HomeScreen() {
  const [work, setWork] = useState('45');
  const [rest, setRest] = useState('15');
  const [minutes, setMinutes] = useState('20');
  const [error, setError] = useState('');

  function openTimer(title: string, workSeconds: number, restSeconds: number, totalMinutes: number) {
    router.push({ pathname: '/workout', params: { title, work: String(workSeconds), rest: String(restSeconds), minutes: String(totalMinutes) } });
  }

  function openCustomTimer() {
    const workSeconds = Number(work);
    const restSeconds = Number(rest);
    const totalMinutes = Number(minutes);
    const invalid = !Number.isInteger(workSeconds) || workSeconds < 5 || workSeconds > 600 || !Number.isInteger(restSeconds) || restSeconds < 5 || restSeconds > 600 || !Number.isInteger(totalMinutes) || totalMinutes < 1 || totalMinutes > 120;
    if (invalid) {
      setError('Use 5–600 seconds for work/rest and 1–120 minutes total.');
      return;
    }
    setError('');
    openTimer('Custom workout', workSeconds, restSeconds, totalMinutes);
  }

  return <SafeAreaView style={styles.safeArea}><KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}><ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
    <View style={styles.hero}><Text style={styles.kicker}>READY. SET. SWEAT.</Text><Text style={styles.title}>HIIT Timer</Text><Text style={styles.subtitle}>Simple intervals. Big effort. No account required.</Text></View>
    <Text style={styles.sectionTitle}>QUICK START</Text>
    <TimerCard title="Go Hard 30" timing="60 sec work  •  30 sec rest" duration="30 min" accent="#20B86A" onPress={() => openTimer('Go Hard 30', 60, 30, 30)} />
    <TimerCard title="Fast 40/20" timing="40 sec work  •  20 sec rest" duration="10 min" accent="#FF9F1C" onPress={() => openTimer('Fast 40/20', 40, 20, 10)} />
    <View style={styles.customCard}><Text style={styles.customTitle}>Build your own</Text><Text style={styles.customSubtitle}>Set the intervals and total workout time.</Text><View style={styles.inputRow}>
      <View style={styles.field}><Text style={styles.label}>WORK</Text><View style={styles.inputWrap}><TextInput value={work} onChangeText={setWork} keyboardType="number-pad" maxLength={3} style={styles.input} /><Text style={styles.unit}>sec</Text></View></View>
      <View style={styles.field}><Text style={styles.label}>REST</Text><View style={styles.inputWrap}><TextInput value={rest} onChangeText={setRest} keyboardType="number-pad" maxLength={3} style={styles.input} /><Text style={styles.unit}>sec</Text></View></View>
      <View style={styles.field}><Text style={styles.label}>TOTAL</Text><View style={styles.inputWrap}><TextInput value={minutes} onChangeText={setMinutes} keyboardType="number-pad" maxLength={3} style={styles.input} /><Text style={styles.unit}>min</Text></View></View>
    </View>{error ? <Text style={styles.error}>{error}</Text> : null}<Pressable onPress={openCustomTimer} style={({ pressed }) => [styles.customButton, pressed && styles.pressed]}><Text style={styles.customButtonText}>START CUSTOM TIMER</Text></Pressable></View>
    <Text style={styles.credit}>Built with VibeCode Coach</Text>
  </ScrollView></KeyboardAvoidingView></SafeAreaView>;
}

const styles = StyleSheet.create({
  flex: { flex: 1 }, safeArea: { flex: 1, backgroundColor: '#F6F4EF' }, content: { padding: 22, paddingBottom: 40, gap: 14 }, hero: { paddingVertical: 20 }, kicker: { color: '#148A50', fontSize: 13, fontWeight: '900', letterSpacing: 2 }, title: { color: '#171A18', fontSize: 48, lineHeight: 54, fontWeight: '900', letterSpacing: -1.8, marginTop: 6 }, subtitle: { color: '#666C68', fontSize: 17, lineHeight: 24, marginTop: 8, maxWidth: 310 }, sectionTitle: { color: '#777B78', fontSize: 12, fontWeight: '900', letterSpacing: 1.5, marginTop: 4 },
  timerCard: { minHeight: 96, backgroundColor: '#FFF', borderRadius: 18, borderLeftWidth: 7, padding: 18, flexDirection: 'row', alignItems: 'center', gap: 12, shadowColor: '#111', shadowOpacity: 0.05, shadowRadius: 10, shadowOffset: { width: 0, height: 4 }, elevation: 2 }, cardText: { flex: 1 }, cardTitle: { color: '#171A18', fontSize: 21, fontWeight: '800' }, cardTiming: { color: '#717672', fontSize: 13, marginTop: 7 }, durationPill: { backgroundColor: '#F0F1EE', paddingHorizontal: 11, paddingVertical: 7, borderRadius: 12 }, durationText: { color: '#343835', fontSize: 12, fontWeight: '800' }, arrow: { color: '#8C918D', fontSize: 32, marginLeft: -4 },
  customCard: { backgroundColor: '#1D211E', borderRadius: 22, padding: 20, marginTop: 8 }, customTitle: { color: '#FFF', fontSize: 24, fontWeight: '900' }, customSubtitle: { color: '#B9BFBA', fontSize: 14, marginTop: 5 }, inputRow: { flexDirection: 'row', gap: 8, marginTop: 20 }, field: { flex: 1 }, label: { color: '#AEB4AF', fontSize: 10, fontWeight: '900', letterSpacing: 1, marginBottom: 6 }, inputWrap: { backgroundColor: '#303531', borderRadius: 12, paddingHorizontal: 10, flexDirection: 'row', alignItems: 'center' }, input: { flex: 1, color: '#FFF', fontSize: 21, fontWeight: '800', paddingVertical: 12 }, unit: { color: '#9DA39E', fontSize: 11 }, error: { color: '#FF9D91', fontSize: 12, lineHeight: 17, marginTop: 12 }, customButton: { backgroundColor: '#20B86A', minHeight: 52, borderRadius: 14, alignItems: 'center', justifyContent: 'center', marginTop: 18 }, customButtonText: { color: '#FFF', fontSize: 14, fontWeight: '900', letterSpacing: 0.8 }, pressed: { opacity: 0.82, transform: [{ scale: 0.99 }] }, credit: { textAlign: 'center', color: '#9A9D9A', fontSize: 12, marginTop: 10 },
});
