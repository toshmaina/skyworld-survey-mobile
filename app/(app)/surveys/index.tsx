import React from 'react';
import {
  View, Text, FlatList, TouchableOpacity,
  StyleSheet, RefreshControl,
} from 'react-native';
import { router, Stack } from 'expo-router';
import { useSurveys } from '@/hooks/useSurveys';
import { Survey } from '@/types/survey';
import LoadingScreen from '@/components/ui/LoadingScreen';
import ErrorScreen from '@/components/ui/ErrorScreen';

export default function SurveysScreen() {
  const { surveys, loading, error, refresh } = useSurveys();
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await refresh();
    setRefreshing(false);
  };

  if (loading && !refreshing) return <LoadingScreen message="Loading surveys..." />;
  if (error) return <ErrorScreen message={error} onRetry={refresh} />;

  const renderItem = ({ item }: { item: Survey }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => router.push(`/(app)/surveys/${item.id}`)}
      activeOpacity={0.7}
    >
      <View style={styles.cardIcon}>
        <Text style={styles.cardIconText}>📋</Text>
      </View>
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle} numberOfLines={2}>{item.name}</Text>
        {item.description ? (
          <Text style={styles.cardDesc} numberOfLines={2}>{item.description}</Text>
        ) : null}
      </View>
      <Text style={styles.chevron}>›</Text>
    </TouchableOpacity>
  );

  return (
    <>
      <Stack.Screen options={{ title: 'Available Surveys', headerBackVisible: false }} />
      <View style={styles.container}>
        <FlatList
          data={surveys}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#6366f1"
            />
          }
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text style={styles.emptyIcon}>📭</Text>
              <Text style={styles.emptyText}>No surveys available</Text>
              <Text style={styles.emptySubtext}>Pull down to refresh</Text>
            </View>
          }
          ListHeaderComponent={
            <View style={styles.listHeader}>
              <Text style={styles.listHeaderText}>
                {surveys.length} survey{surveys.length !== 1 ? 's' : ''} available
              </Text>
            </View>
          }
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb' },
  list: { padding: 16, gap: 12 },
  listHeader: { marginBottom: 4 },
  listHeaderText: { fontSize: 13, color: '#9ca3af' },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  cardIcon: {
    width: 44, height: 44,
    borderRadius: 12,
    backgroundColor: '#eef2ff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardIconText: { fontSize: 20 },
  cardContent: { flex: 1, gap: 3 },
  cardTitle: { fontSize: 15, fontWeight: '600', color: '#111827' },
  cardDesc: { fontSize: 13, color: '#6b7280' },
  chevron: { fontSize: 22, color: '#d1d5db', marginRight: -4 },
  empty: { alignItems: 'center', justifyContent: 'center', paddingTop: 80, gap: 8 },
  emptyIcon: { fontSize: 48 },
  emptyText: { fontSize: 16, fontWeight: '600', color: '#374151' },
  emptySubtext: { fontSize: 13, color: '#9ca3af' },
});
