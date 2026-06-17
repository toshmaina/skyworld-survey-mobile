import { Redirect } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import LoadingScreen from '@/components/ui/LoadingScreen';

export default function Index() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) return <LoadingScreen />;

  return isAuthenticated
    ? <Redirect href="/(app)/surveys" />
    : <Redirect href="/(auth)/login" />;
}
