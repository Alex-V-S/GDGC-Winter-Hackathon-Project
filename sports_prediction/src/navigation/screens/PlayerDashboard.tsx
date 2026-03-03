import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { LineChart } from 'react-native-gifted-charts';

// Get the screen width so the chart scales properly
const screenWidth = Dimensions.get('window').width;

export default function PlayerDashboard() {
  const route = useRoute();
  const { player } = route.params as any; 

  // Mock data: Last 5 games + 1 Projection (The green dot)
  const mockChartData = [
    { value: 22, label: 'G1' },
    { value: 28, label: 'G2' },
    { value: 24, label: 'G3' },
    { value: 31, label: 'G4' },
    { value: 26, label: 'G5' },
 { 
      value: 29, 
      label: 'Proj', 
      labelTextStyle: { color: '#2ecc71', fontWeight: 'bold' as 'bold' }, 
      dataPointColor: '#2ecc71' 
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.name}>{player.name}</Text>
        <Text style={styles.subtitle}>{player.team} | {player.position}</Text>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>PPG</Text>
          <Text style={styles.statValue}>25.4</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>RPG</Text>
          <Text style={styles.statValue}>8.2</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>APG</Text>
          <Text style={styles.statValue}>7.5</Text>
        </View>
      </View>

      <View style={styles.predictionSection}>
        <Text style={styles.sectionTitle}>Points Projection</Text>
        
        {/* Render the Line Chart */}
        <LineChart
          data={mockChartData}
          width={screenWidth - 80} // Adds some padding so it doesn't clip
          height={180}
          thickness={3}
          color="#3498db"
          maxValue={40}
          noOfSections={4}
          yAxisTextStyle={{ color: '#888' }}
          xAxisLabelTextStyle={{ color: '#888' }}
          hideRules
          isAnimated
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', padding: 16 },
  header: { alignItems: 'center', marginBottom: 24, marginTop: 20 },
  name: { fontSize: 28, fontWeight: 'bold', color: '#333' },
  subtitle: { fontSize: 18, color: '#666', marginTop: 4 },
  statsContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 30 },
  statBox: { 
    backgroundColor: '#fff', padding: 16, borderRadius: 10, alignItems: 'center', width: '30%', 
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2, elevation: 2 
  },
  statLabel: { fontSize: 14, color: '#888', marginBottom: 4 },
  statValue: { fontSize: 20, fontWeight: 'bold', color: '#111' },
  predictionSection: { 
    backgroundColor: '#fff', padding: 20, borderRadius: 10, alignItems: 'center', 
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2, elevation: 2 
  },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 20, color: '#333' },
});