import React, { useState } from 'react';
import { View, TextInput, StyleSheet, Text, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

// 1. Mock Data Array
const MOCK_PLAYERS = [
  { id: '1', name: 'LeBron James', team: 'LAL', position: 'SF' },
  { id: '2', name: 'Stephen Curry', team: 'GSW', position: 'PG' },
  { id: '3', name: 'Kevin Durant', team: 'PHX', position: 'PF' },
  { id: '4', name: 'Luka Doncic', team: 'DAL', position: 'PG' },
  { id: '5', name: 'Giannis Antetokounmpo', team: 'MIL', position: 'PF' },
  { id: '6', name: 'Nikola Jokic', team: 'DEN', position: 'C' },
  { id: '7', name: 'Jayson Tatum', team: 'BOS', position: 'SF' },
  { id: '8', name: 'Shai Gilgeous-Alexander', team: 'OKC', position: 'PG' },
];

export default function HomeScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const navigation = useNavigation<any>();

  // 2. Filtering Logic
  // This runs every time the search bar text changes, returning only matching players.
  const filteredPlayers = MOCK_PLAYERS.filter(player =>
    player.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    player.team.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // 3. Render Individual List Item
  // TouchableOpacity makes the card act like a button so we can tap it later.
  const renderItem = ({ item }: {item: any}) => (
    <TouchableOpacity 
      style={styles.playerCard} 
      onPress={() => navigation.navigate('PlayerDashboard', { player: item })}>
      <View>
        <Text style={styles.playerName}>{item.name}</Text>
        <Text style={styles.playerInfo}>{item.team} | {item.position}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search NBA players or teams..."
          placeholderTextColor="#888"
          value={searchQuery}
          onChangeText={setSearchQuery}
          autoCorrect={false}
          clearButtonMode="while-editing"
        />
      </View>
      
      {/* 4. Display the Filtered List */}
      <FlatList
        data={filteredPlayers}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
        // This shows up if the user types a name not in the mock array
        ListEmptyComponent={<Text style={styles.emptyText}>No players found.</Text>} 
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  searchContainer: {
    padding: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  searchInput: {
    height: 45,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 16,
  },
  listContainer: {
    padding: 16,
  },
  playerCard: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2, // Gives Android cards a slight drop shadow
  },
  playerName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  playerInfo: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  emptyText: {
    textAlign: 'center',
    color: '#888',
    marginTop: 20,
    fontSize: 16,
  }
});