import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function WorkoutScreen() {
  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <View style={styles.content}>
        <View style={styles.card}>
          <Text style={styles.title}>Workout Screen</Text>
          <Text style={styles.body}>Run the workout.</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F3F3F1',
  },
  content: {
    flex: 1,
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
});
