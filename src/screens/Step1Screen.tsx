import React from 'react';
import { View, Image, StyleSheet, StatusBar, TouchableOpacity, Text } from 'react-native';

const styleOptions = [
  { id: 1, name: '스타일 1' },
  { id: 2, name: '스타일 2' },
  { id: 3, name: '스타일 3' },
  { id: 4, name: '스타일 4' },
];

export default function Step1Screen() {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.logoContainer}>
        <Image
          source={require('../../assets/logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>
      <View style={styles.gridContainer}>
        {styleOptions.map((style) => (
          <TouchableOpacity key={style.id} style={styles.styleCard}>
            <Text style={styles.styleText}>{style.name}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  logoContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 10,
  },
  logo: {
    width: 500,
    height: 200,
  },
  gridContainer: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    paddingTop: 40,
    justifyContent: 'space-between',
  },
  styleCard: {
    width: '48%',
    aspectRatio: 1,
    backgroundColor: '#D7E3A1',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  styleText: {
    color: '#000000',
    fontSize: 18,
    fontWeight: '600',
  },
});
