import React, { useRef } from 'react';
import { View, Image, StyleSheet, StatusBar, Text, TouchableOpacity, Animated } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../types/navigation';
import { useAuth } from '../contexts/AuthContext';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function MyPageScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { logout } = useAuth();
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(1)).current;

  const handleGoBack = () => {
    navigation.goBack();
  };

  const handlePressIn = () => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 0.95,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 0.8,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handlePressOut = () => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 3,
        tension: 40,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleLogout = () => {
    logout();
    navigation.navigate('Home');
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.logoContainer}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={handleGoBack}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          activeOpacity={0.8}
        >
          <Animated.View
            style={[
              styles.backButtonInner,
              {
                transform: [{ scale: scaleAnim }],
                opacity: opacityAnim,
              },
            ]}
          >
            <Image
              source={require('../../assets/arrow.png')}
              style={styles.backButtonIcon}
              resizeMode="contain"
            />
          </Animated.View>
        </TouchableOpacity>
        <Image
          source={require('../../assets/logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>
      <View style={styles.content}>
        <Text style={styles.title}>마이페이지</Text>
        <Text style={styles.subtitle}>마이페이지 내용이 여기에 표시됩니다.</Text>
        
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
          activeOpacity={0.8}
        >
          <Text style={styles.logoutButtonText}>로그아웃</Text>
        </TouchableOpacity>
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
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    left: 20,
    top: 85,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  backButtonInner: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  backButtonIcon: {
    width: 18,
    height: 18,
    tintColor: '#333333',
  },
  logo: {
    width: 500,
    height: 200,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 40,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontFamily: 'Juache',
    color: '#000000',
    fontWeight: 'bold',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Juache',
    color: '#666666',
    marginBottom: 40,
  },
  logoutButton: {
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 8,
    width: '100%',
    maxWidth: 300,
    alignItems: 'center',
    marginTop: 20,
  },
  logoutButtonText: {
    fontSize: 16,
    fontFamily: 'Juache',
    color: '#666666',
    fontWeight: 'bold',
  },
});

