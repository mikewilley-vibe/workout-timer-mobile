import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  return (
    <>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen
          name="workout"
          options={{
            title: 'Workout Screen',
            headerBackTitle: 'Back',
            headerShadowVisible: false,
            headerStyle: { backgroundColor: '#F3F3F1' },
            headerTintColor: '#1A1A1A',
          }}
        />
      </Stack>
      <StatusBar style="dark" />
    </>
  );
}
