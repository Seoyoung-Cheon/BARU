import React, { useRef, useState } from 'react';
import { View, Image, StyleSheet, StatusBar, Text, TouchableOpacity, Animated, TextInput } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../types/navigation';
import { useAuth } from '../contexts/AuthContext';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
type LoginScreenRouteProp = {
  key: string;
  name: 'Login';
  params: {
    redirectTo?: 'Detail';
    detailParams?: {
      flight: any;
      hotels: any[];
      exchange?: any;
      budget?: string;
      peopleCount?: string;
      departureDate?: Date;
      arrivalDate?: Date;
    };
  };
};

export default function LoginScreen() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<LoginScreenRouteProp>();
  const { login } = useAuth();
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(1)).current;
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

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

  const handleLogin = () => {
    // TODO: 실제 로그인 API 호출
    // 임시로 로그인 성공 처리
    if (email && password) {
      login(); // 로그인 상태 저장
      
      // Detail로 리다이렉트해야 하는 경우
      if (route.params?.redirectTo === 'Detail' && route.params?.detailParams) {
        // Login 화면을 스택에서 제거하고 Detail로 이동
        // 이렇게 하면 Detail에서 뒤로가기를 누를 때 Result 화면으로 돌아감
        navigation.replace('Detail', route.params.detailParams);
      } else {
        navigation.navigate('Home');
      }
    }
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
        <Text style={styles.title}>로그인</Text>
        
        <View style={styles.inputContainer}>
          <Text style={styles.label}>이메일</Text>
          <TextInput
            style={styles.input}
            placeholder="이메일을 입력하세요"
            placeholderTextColor="#999999"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>비밀번호</Text>
          <TextInput
            style={styles.input}
            placeholder="비밀번호를 입력하세요"
            placeholderTextColor="#999999"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>

        <TouchableOpacity
          style={styles.loginButton}
          onPress={handleLogin}
          activeOpacity={0.8}
        >
          <Text style={styles.loginButtonText}>로그인</Text>
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
  },
  title: {
    fontSize: 24,
    fontFamily: 'Juache',
    color: '#000000',
    fontWeight: 'bold',
    marginBottom: 32,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontFamily: 'Juache',
    color: '#333333',
    marginBottom: 8,
  },
  input: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    fontFamily: 'Juache',
    color: '#000000',
    backgroundColor: '#ffffff',
  },
  loginButton: {
    backgroundColor: '#D7E3A1',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
    marginTop: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  loginButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontFamily: 'Juache',
    fontWeight: 'bold',
  },
});

