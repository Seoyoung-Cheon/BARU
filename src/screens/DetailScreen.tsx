import React, { useRef } from 'react';
import { View, Image, StyleSheet, StatusBar, Text, TouchableOpacity, Animated, ScrollView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../types/navigation';
import type { FlightItem, HotelPrice, ExchangeAmount } from './ResultScreen';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
type DetailScreenRouteProp = {
  key: string;
  name: 'Detail';
  params: {
    flight: FlightItem;
    hotels: HotelPrice[];
    exchange?: ExchangeAmount;
    budget?: string;
    peopleCount?: string;
    departureDate?: Date;
    arrivalDate?: Date;
  };
};

export default function DetailScreen() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<DetailScreenRouteProp>();
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(1)).current;

  const { flight, hotels, exchange, departureDate } = route.params;
  
  const formatDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}.${month}.${day}`;
  };

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

  const formatDuration = (isoDuration: string): string => {
    const matches = isoDuration.match(/PT(?:(\d+)H)?(?:(\d+)M)?/);
    if (!matches) return isoDuration;

    const hours = matches[1] ? parseInt(matches[1], 10) : 0;
    const minutes = matches[2] ? parseInt(matches[2], 10) : 0;

    let formatted = '';
    if (hours > 0) formatted += `${hours}시간 `;
    if (minutes > 0) formatted += `${minutes}분`;
    return formatted.trim() || '정보 없음';
  };

  const formatFlightPrice = (price: string, currency: string): string => {
    const numPrice = parseFloat(price) || 0;
    if (currency === 'KRW') {
      return numPrice.toLocaleString('ko-KR') + '원';
    }
    return `${currency} ${numPrice.toLocaleString('ko-KR')}`;
  };

  const formatPrice = (price: number): string => {
    return price.toLocaleString('ko-KR') + '원';
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

      <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.scrollContent}>
        {/* 항공권 정보 섹션 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>항공권 정보</Text>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>항공사:</Text>
            <Text style={styles.infoValue}>{flight.airline || '알 수 없음'}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>가격:</Text>
            <Text style={styles.infoValue}>
              {formatFlightPrice(flight.price.total, flight.price.currency)}
            </Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>출발지:</Text>
            <Text style={styles.infoValue}>
              {flight.departure.airport} {flight.departure.time}
            </Text>
          </View>
          
          {departureDate && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>출발일자:</Text>
              <Text style={styles.infoValue}>
                {formatDate(departureDate)}
              </Text>
            </View>
          )}
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>도착지:</Text>
            <Text style={styles.infoValue}>
              {flight.arrival.airport}
              {flight.destinationName && ` (${flight.destinationName})`} {flight.arrival.time}
            </Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>소요시간:</Text>
            <Text style={styles.infoValue}>{formatDuration(flight.duration)}</Text>
          </View>
          
          {flight.segments && flight.segments.length > 0 && (
            <>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>경유:</Text>
                <Text style={styles.infoValue}>
                  {flight.segments.length > 1 ? `${flight.segments.length - 1}회` : '직항'}
                </Text>
              </View>
              
              <View style={styles.segmentsContainer}>
                <Text style={styles.segmentsTitle}>편명 정보:</Text>
                {flight.segments.map((segment, idx) => (
                  <View key={`segment-${idx}`} style={styles.segmentItem}>
                    <Text style={styles.segmentText}>
                      {segment.flightNumber} ({segment.departure.airport} → {segment.arrival.airport})
                    </Text>
                    <Text style={styles.segmentTime}>
                      {segment.departure.time} → {segment.arrival.time}
                    </Text>
                  </View>
                ))}
              </View>
            </>
          )}
        </View>

        {/* 호텔 정보 섹션 */}
        {hotels.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>호텔 가격 비교</Text>
            {hotels.map((hotel, idx) => (
              <View key={`hotel-${idx}`} style={styles.hotelItem}>
                <View style={styles.hotelInfo}>
                  <Text style={styles.hotelName}>{hotel.hotelName}</Text>
                  {hotel.rating && (
                    <Text style={styles.hotelRating}>⭐ {hotel.rating}</Text>
                  )}
                </View>
                <Text style={styles.hotelPrice}>
                  {formatPrice(hotel.price)} {hotel.currency}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* 환전가능금액 섹션 */}
        {exchange && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>환전가능금액</Text>
            <View style={styles.exchangeContainer}>
              <Text style={styles.exchangeAmount}>
                {exchange.amount.toLocaleString('ko-KR')} {exchange.currency}
              </Text>
              <Text style={styles.exchangeRate}>
                환율: {exchange.exchangeRate.toLocaleString('ko-KR')}
              </Text>
            </View>
          </View>
        )}
      </ScrollView>
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
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  section: {
    marginBottom: 30,
    padding: 20,
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Juache',
    color: '#000000',
    fontWeight: 'bold',
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 12,
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 16,
    fontFamily: 'Juache',
    color: '#666666',
    width: 100,
  },
  infoValue: {
    fontSize: 16,
    fontFamily: 'Juache',
    color: '#000000',
    flex: 1,
  },
  segmentsContainer: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  segmentsTitle: {
    fontSize: 16,
    fontFamily: 'Juache',
    color: '#000000',
    fontWeight: 'bold',
    marginBottom: 12,
  },
  segmentItem: {
    marginBottom: 12,
    padding: 12,
    backgroundColor: '#ffffff',
    borderRadius: 8,
  },
  segmentText: {
    fontSize: 14,
    fontFamily: 'Juache',
    color: '#000000',
    marginBottom: 4,
  },
  segmentTime: {
    fontSize: 12,
    fontFamily: 'Juache',
    color: '#666666',
  },
  hotelItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  hotelInfo: {
    flex: 1,
  },
  hotelName: {
    fontSize: 16,
    fontFamily: 'Juache',
    color: '#000000',
    fontWeight: 'bold',
    marginBottom: 4,
  },
  hotelRating: {
    fontSize: 14,
    fontFamily: 'Juache',
    color: '#666666',
  },
  hotelPrice: {
    fontSize: 16,
    fontFamily: 'Juache',
    color: '#D7E3A1',
    fontWeight: 'bold',
  },
  exchangeContainer: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#ffffff',
    borderRadius: 8,
  },
  exchangeAmount: {
    fontSize: 24,
    fontFamily: 'Juache',
    color: '#D7E3A1',
    fontWeight: 'bold',
    marginBottom: 8,
  },
  exchangeRate: {
    fontSize: 14,
    fontFamily: 'Juache',
    color: '#666666',
  },
});



