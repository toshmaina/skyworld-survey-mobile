import { Stack, router } from 'expo-router';
import { TouchableOpacity, Text } from 'react-native';
import { useAuth } from '@/context/AuthContext';

export default function AppLayout() {
  const { logout } = useAuth();

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: '#1a1a2e' },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: '600' },
        headerRight: () => (
          <TouchableOpacity onPress={logout} style={{ marginRight: 4 }}>
            <Text style={{ color: '#a5b4fc', fontSize: 14 }}>Logout</Text>
          </TouchableOpacity>
        ),
      }}
    />
  );
}
