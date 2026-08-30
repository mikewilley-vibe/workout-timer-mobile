import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

function formatTime(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  const paddedSeconds = secs < 10 ? `0${secs}` : `${secs}`;
  return `${minutes}:${paddedSeconds}`;
}

export default function HomeScreen() {
  const [isRunning, setIsRunning] = useState(false);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    if (!isRunning) {
      return;
    }

    const intervalId = setInterval(() => {
      setSeconds((current) => current + 1);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [isRunning]);

  function startWorkout() {
    setIsRunning(true);
    router.push('/workout');
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.card}>
          <Text style={styles.title}>Workout timer</Text>
          <Text style={styles.body}>
            User various HIIT workout timers set and ready for use on an app. We
            want it to have 1 minute on 30 seconds off for 30 minutes, then 40
            seconds on, 20 seconds off for 10 minutes, then customizable other
            versions. We want it to have a green screen during the on time and
            say sometihng like Go Hard! Then be red during the rest time and say
            something about resting
          </Text>
          {isRunning ? (
            <Text style={styles.timer}>{formatTime(seconds)}</Text>
          ) : null}
          <Pressable onPress={startWorkout} style={styles.button}>
            <Text style={styles.buttonText}>Start Workout</Text>
          </Pressable>
          <Text style={styles.credit}>Built with VibeCode Coach</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F3F3F1',
  },
  content: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E6E6E3',
    borderWidth: 1,
    borderRadius: 16,
    padding: 24,
    gap: 20,
  },
  title: {
    fontSize: 34,
    fontWeight: '700',
    color: '#1A1A1A',
    letterSpacing: -0.4,
  },
  body: {
    fontSize: 17,
    lineHeight: 26,
    color: '#3D3D3D',
  },
  timer: {
    fontSize: 48,
    fontWeight: '700',
    color: '#1A1A1A',
    letterSpacing: -0.6,
  },
  button: {
    backgroundColor: '#1A1A1A',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 17,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  credit: {
    fontSize: 13,
    color: '#8A8A8A',
    marginTop: 8,
  },
});
