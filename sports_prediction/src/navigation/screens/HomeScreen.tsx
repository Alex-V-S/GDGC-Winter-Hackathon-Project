import React, { useState } from 'react';
import { View, TextInput, StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  // State to hold the user's search input
  const [searchQuery, setSearchQuery] = useState('');

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
          clearButtonMode="while-editing" // Adds a handy clear button on iOS
        />
      </View>
      
      {/* Temporary visual feedback to ensure state is working */}
      <View style={styles.resultsContainer}>
        <Text style={styles.text}>Current Input: {searchQuery}</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5', // Light background for contrast
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
  resultsContainer: {
    padding: 16,
  },
  text: {
    fontSize: 16,
    color: '#333',
  }
});