// import { useNavigation, useRoute } from '@react-navigation/native';
// import React from 'react';
// import { 
//   View, 
//   Text, 
//   FlatList, 
//   StyleSheet, 
//   TouchableOpacity, 
//   Animated
//  } from 'react-native';
// import CustomHeader from '../../../compoent/CustomHeader';
// import imageIndex from '../../../assets/imageIndex';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import StatusBarComponent from '../../../compoent/StatusBarCompoent';
// import ScreenNameEnum from '../../../routes/screenName.enum';
 
// function parseDuration(pt) {
//   if (!pt) return '';
//   const matchH = pt.match(/(\d+)H/);
//   const matchM = pt.match(/(\d+)M/);
//   const h = matchH ? matchH[1] : '0';
//   const m = matchM ? matchM[1] : '0';
//   return `${h}h ${m}m`;
// }

// function currencyFormat(amount, currency) {
//   return `${currency} ${amount}`;
// }

// export default function FlightOffersScreen() {
//   const navigation = useNavigation();
//   const route = useRoute();
//   const flightData = route.params || {};
//   const offers = flightData.flights || [];
//   const dictionaries = flightData.dictionaries || {};

//   // FlightOfferCard component
//   function FlightOfferCard({ offer, dictionaries }) {
//     const itinerary = offer.itineraries?.[0];
//     const segments = itinerary?.segments || [];
//     const scaleValue = new Animated.Value(1);

//     const handlePressIn = () => {
//       Animated.spring(scaleValue, {
//         toValue: 0.98,
//         useNativeDriver: true,
//       }).start();
//     };

//     const handlePressOut = () => {
//       Animated.spring(scaleValue, {
//         toValue: 1,
//         useNativeDriver: true,
//       }).start();
//     };

//     return (
//       <Animated.View style={{ transform: [{ scale: scaleValue }] }}>
//         <TouchableOpacity
//           activeOpacity={0.9}
//           onPressIn={handlePressIn}
//           onPressOut={handlePressOut}
//           onPress={() => navigation.navigate(ScreenNameEnum.JetDetails, { flight: offer })}
//         >
//           <View
           
//             style={styles.card}
//           >
//             {/* Card Header */}
//             <View style={styles.cardHeader}>
//               <View style={styles.priceContainer}>
//                 <Text style={styles.priceText}>{currencyFormat(offer.price.total, offer.price.currency)}</Text>
//                 <View style={styles.seatBadge}>
//                   <Text style={styles.seatText}>{offer.numberOfBookableSeats} seats left</Text>
//                 </View>
//               </View>
              
//               <View style={styles.durationContainer}>
//                 <Text style={styles.durationText}>{parseDuration(itinerary?.duration)}</Text>
//               </View>
//             </View>

//             {/* Airline Info */}
//             <View style={styles.airlineContainer}>
//               <Text style={styles.airlineText}>
//                 {offer.validatingAirlineCodes?.join(', ')}
//               </Text>
//             </View>

//             <View style={styles.divider} />

//             {/* Flight Segments */}
//             {segments.map((seg, index) => (
//               <View key={`${seg.id}-${index}`} style={styles.segmentRow}>
//                 {/* Departure */}
//                 <View style={styles.timeBlock}>
//                   <Text style={styles.timeText}>
//                     {new Date(seg.departure.at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
//                   </Text>
//                   <Text style={styles.airportCode}>{seg.departure.iataCode}</Text>
//                   <Text style={styles.terminalText}>
//                     Terminal {seg.departure.terminal || '?'}
//                   </Text>
//                 </View>

//                 {/* Flight Path */}
//                 <View style={styles.middleBlock}>
//                   <View style={styles.flightPath}>
//                     <View style={styles.dot} />
//                     <View style={styles.line} />
//                     {/* <View style={styles.planeIcon}>
//                       <Text style={styles.planeText}>✈️</Text>
//                     </View> */}
//                     <View style={styles.line} />
//                     <View style={styles.dot} />
//                   </View>
//                   <Text style={styles.flightInfo}>
//                     {dictionaries?.carriers?.[seg.carrierCode] || seg.carrierCode} {seg.number}
//                   </Text>
//                   <Text style={styles.durationSmall}>{parseDuration(seg.duration)}</Text>
//                 </View>

//                 {/* Arrival */}
//                 <View style={styles.timeBlock}>
//                   <Text style={styles.timeText}>
//                     {new Date(seg.arrival.at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
//                   </Text>
//                   <Text style={styles.airportCode}>{seg.arrival.iataCode}</Text>
//                   <Text style={styles.terminalText}>
//                     Terminal {seg.arrival.terminal || '?'}
//                   </Text>
//                 </View>
//               </View>
//             ))}

//             {/* Card Footer */}
//             <View style={styles.cardFooter}>
//               <View style={styles.priceBreakdown}>
//                 <Text style={styles.basePriceText}>
//                   Base: {currencyFormat(offer.price.base, offer.price.currency)}
//                 </Text>
//                 <Text style={styles.taxesText}>
//                   Taxes: {currencyFormat(offer.price.grandTotal - offer.price.base, offer.price.currency)}
//                 </Text>
//               </View>
              
//               <View
               
//                 style={styles.selectButton}
//               >
//                 <Text style={styles.selectButtonText}>Select Flight</Text>
//               </View>
//             </View>
//           </View>
//         </TouchableOpacity>
//       </Animated.View>
//     );
//   }

//   return (
//     <SafeAreaView style={styles.container}>
//       <StatusBarComponent />
      
//          <CustomHeader imageSource={imageIndex.backorange} label='✈️ Flight Offers' />
       

//       {offers.length === 0 ? (
//         <View style={styles.emptyState}>
//           <Text style={styles.emptyEmoji}>🛫</Text>
//           <Text style={styles.emptyTitle}>No flights found</Text>
//           <Text style={styles.emptySubtitle}>
//             Try adjusting your search criteria or dates
//           </Text>
//         </View>
//       ) : (
//         <FlatList
//           data={offers}
//           keyExtractor={(item) => item.id}
//           contentContainerStyle={styles.listContent}
//           renderItem={({ item }) => (
//             <FlightOfferCard offer={item} dictionaries={dictionaries} />
//           )}
//           ItemSeparatorComponent={() => <View style={styles.separator} />}
//           showsVerticalScrollIndicator={false}
//         />
//       )}
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   container: { 
//     flex: 1, 
//     backgroundColor: 'white' 
//   },
//   headerContainer: {
//     paddingHorizontal: 20,
//     paddingVertical: 10,
//     backgroundColor: 'white',
//     borderBottomLeftRadius: 20,
//     borderBottomRightRadius: 20,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 8,
//     elevation: 4,
//   },
//   subtitle: {
//     fontSize: 14,
//     color: '#666',
//     marginTop: 5,
//     marginLeft: 10,
//   },
//   listContent: {
//     paddingHorizontal: 16,
//     paddingVertical: 16,
//   },
//   card: {
//     backgroundColor: '#FFF',
//     borderRadius: 20,
//     padding: 20,
//     shadowColor: 'red',
//     shadowOffset: { width: 0, height: 8 },
//     shadowOpacity: 0.1,
//     shadowRadius: 16,
//     elevation: 8,
//     borderWidth: 1,
//     borderColor: '#E8F0FE',
//   },
//   cardHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'flex-start',
//     marginBottom: 12,
//   },
//   priceContainer: {
//     alignItems: 'flex-start',
//   },
//   priceText: {
//     fontSize: 26,
//     fontWeight: '800',
//     color: '#1a1a1a',
//     marginBottom: 8,
//   },
//   seatBadge: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: 'rgba(255, 107, 53, 0.1)',
//     paddingHorizontal: 12,
//     paddingVertical: 6,
//     borderRadius: 16,
//     borderWidth: 1,
//     borderColor: '#FF6B35',
//   },
//   seatText: {
//     color: '#FF6B35',
//     fontSize: 12,
//     fontWeight: '700',
//   },
//   durationContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//      paddingHorizontal: 14,
//     paddingVertical: 8,
//     borderRadius: 16,
//     borderWidth: 1,
//     borderColor: 'red',
//   },
//   durationText: {
//     fontSize: 14,
//     fontWeight: '700',
//     color: 'black',
//   },
//   airlineContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 16,
//     gap: 8,
//   },
//   airlineText: {
//     fontSize: 14,
//     color: '#666',
//     fontWeight: '600',
//   },
//   divider: {
//     height: 1,
//     backgroundColor: 'rgba(0,0,0,0.05)',
//     marginVertical: 8,
//   },
//   segmentRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginVertical: 16,
//   },
//   timeBlock: {
//     width: 80,
//     alignItems: 'center',
//   },
//   timeText: {
//     fontSize: 16,
//     fontWeight: '700',
//     color: '#1a1a1a',
//     marginBottom: 4,
//   },
//   airportCode: {
//     fontSize: 20,
//     fontWeight: '500',
//     color: 'black',
//     marginBottom: 2,
//   },
//   terminalText: {
//     fontSize: 11,
//     color: '#888',
//     fontWeight: '600',
//   },
//   middleBlock: {
//     flex: 1,
//     alignItems: 'center',
//     paddingHorizontal: 12,
//   },
//   flightPath: {
//     alignItems: 'center',
//     marginBottom: 8,
//     flexDirection: 'row',
//   },
//   dot: {
//     width: 10,
//     height: 10,
//     borderRadius: 5,
//     backgroundColor: '#FF3B30',
//   },
//   line: {
//     flex: 1,
//     height: 1,
//     backgroundColor: '#FF3B30',
//     marginHorizontal: 4,
//   },
//   planeIcon: {
//     width: 12,
//     height: 12,
//     borderRadius: 12,
//     backgroundColor: '#FF3B30',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   planeText: {
//     fontSize: 12,
//   },
//   flightInfo: {
//     fontSize: 13,
//     fontWeight: '600',
//     color: '#444',
//     textAlign: 'center',
//     marginBottom: 4,
//   },
//   durationSmall: {
//     fontSize: 11,
//     color: '#888',
//     fontWeight: '500',
//   },
//   cardFooter: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginTop: 16,
//     paddingTop: 16,
//     borderTopWidth: 1,
//     borderTopColor: 'rgba(0,0,0,0.05)',
//   },
//   priceBreakdown: {
//     flex: 1,
//   },
//   basePriceText: {
//     fontSize: 13,
//     color: '#666',
//     fontWeight: '500',
//     marginBottom: 2,
//   },
//   taxesText: {
//     fontSize: 12,
//     color: '#888',
//     fontWeight: '500',
//   },
//   selectButton: {
//     paddingHorizontal: 20,
//     paddingVertical: 12,
//     borderRadius: 12,
    
//     backgroundColor:"red"
//   },
//   selectButtonText: {
//     color: '#FFF',
//     fontSize: 14,
//     fontWeight: '700',
//   },
//   separator: {
//     height: 16,
//   },
//   emptyState: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 40,
//   },
//   emptyEmoji: {
//     fontSize: 64,
//     marginBottom: 16,
//   },
//   emptyTitle: {
//     fontSize: 22,
//     fontWeight: '700',
//     color: '#1a1a1a',
//     marginBottom: 8,
//   },
//   emptySubtitle: {
//     fontSize: 16,
//     color: '#666',
//     textAlign: 'center',
//     lineHeight: 22,
//   },
// });

import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useRef } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  StyleSheet, 
  TouchableOpacity, 
  Animated,
  Easing
 } from 'react-native';
import CustomHeader from '../../../compoent/CustomHeader';
import imageIndex from '../../../assets/imageIndex';
import { SafeAreaView } from 'react-native-safe-area-context';
import StatusBarComponent from '../../../compoent/StatusBarCompoent';
import ScreenNameEnum from '../../../routes/screenName.enum';
 
function parseDuration(pt) {
  if (!pt) return '';
  const matchH = pt.match(/(\d+)H/);
  const matchM = pt.match(/(\d+)M/);
  const h = matchH ? matchH[1] : '0';
  const m = matchM ? matchM[1] : '0';
  return `${h}h ${m}m`;
}

function currencyFormat(amount, currency) {
  return `${currency} ${amount}`;
}

export default function FlightOffersScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const flightData = route.params || {};
  const offers = flightData.flights || [];
  const dictionaries = flightData.dictionaries || {};
  
  // Animation values for list entrance
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  React.useEffect(() => {
    // Animate list entrance when offers are loaded
    if (offers.length > 0) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
          easing: Easing.out(Easing.cubic)
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
          easing: Easing.out(Easing.cubic)
        })
      ]).start();
    }
  }, [offers.length]);

  // FlightOfferCard component
  function FlightOfferCard({ offer, dictionaries, index }) {
    const itinerary = offer.itineraries?.[0];
    const segments = itinerary?.segments || [];
    
    // Individual card animations
    const cardScale = useRef(new Animated.Value(1)).current;
    const cardOpacity = useRef(new Animated.Value(0)).current;
    const cardTranslateY = useRef(new Animated.Value(30)).current;

    React.useEffect(() => {
      // Staggered animation for cards
      Animated.sequence([
        Animated.delay(index * 100),
        Animated.parallel([
          Animated.timing(cardOpacity, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
            easing: Easing.out(Easing.cubic)
          }),
          Animated.timing(cardTranslateY, {
            toValue: 0,
            duration: 400,
            useNativeDriver: true,
            easing: Easing.out(Easing.cubic)
          })
        ])
      ]).start();
    }, []);

    const handlePressIn = () => {
      Animated.spring(cardScale, {
        toValue: 0.96,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }).start();
    };

    const handlePressOut = () => {
      Animated.spring(cardScale, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }).start();
    };

    const handlePress = () => {
      // Scale down then navigate
      Animated.sequence([
        Animated.spring(cardScale, {
          toValue: 0.95,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.spring(cardScale, {
          toValue: 1,
          friction: 8,
          useNativeDriver: true,
        })
      ]).start();
      
      setTimeout(() => {
        navigation.navigate(ScreenNameEnum.JetDetails, { flight: offer });
      }, 150);
    };

    return (
      <Animated.View 
        style={{ 
          transform: [{ scale: cardScale }, { translateY: cardTranslateY }],
          opacity: cardOpacity
        }}
      >
        <TouchableOpacity
          activeOpacity={1}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          onPress={handlePress}
          delayPressIn={50}
        >
          <View style={styles.card}>
            {/* Card Header */}
            <View style={styles.cardHeader}>
              <View style={styles.priceContainer}>
                <Text style={styles.priceText}>{currencyFormat(offer.price.total, offer.price.currency)}</Text>
                <View style={styles.seatBadge}>
                  <Text style={styles.seatText}>{offer.numberOfBookableSeats} seats left</Text>
                </View>
              </View>
              
              <View style={styles.durationContainer}>
                <Text style={styles.durationText}>{parseDuration(itinerary?.duration)}</Text>
              </View>
            </View>

            {/* Airline Info */}
            <View style={styles.airlineContainer}>
              <Text style={styles.airlineText}>
                {offer.validatingAirlineCodes?.join(', ')}
              </Text>
            </View>

            <View style={styles.divider} />

            {/* Flight Segments */}
            {segments.map((seg, segmentIndex) => (
              <FlightSegment 
                key={`${seg.id}-${segmentIndex}`} 
                segment={seg} 
                dictionaries={dictionaries}
                index={segmentIndex}
              />
            ))}

            {/* Card Footer */}
            <View style={styles.cardFooter}>
              <View style={styles.priceBreakdown}>
                <Text style={styles.basePriceText}>
                  {offer.price.base}
                  Base: {currencyFormat(offer.price.base, offer.price.currency)}
                </Text>
                {/* <Text style={styles.taxesText}>
                  Taxes: {currencyFormat(offer.price.grandTotal - offer.price.base, offer.price.currency)}
                </Text> */}
              </View>
              
              <View style={styles.selectButton}>
                <Text style={styles.selectButtonText}>Select Flight</Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  }

  // Separate component for flight segments with their own animations
  function FlightSegment({ segment, dictionaries, index }) {
    const segmentOpacity = useRef(new Animated.Value(0)).current;
    const segmentTranslateX = useRef(new Animated.Value(20)).current;

    React.useEffect(() => {
      Animated.sequence([
        Animated.delay(300 + (index * 150)),
        Animated.parallel([
          Animated.timing(segmentOpacity, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(segmentTranslateX, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          })
        ])
      ]).start();
    }, []);

    return (
      <Animated.View 
        style={[
          styles.segmentRow,
          {
            opacity: segmentOpacity,
            transform: [{ translateX: segmentTranslateX }]
          }
        ]}
      >
        {/* Departure */}
        <View style={styles.timeBlock}>
          <Text style={styles.timeText}>
            {new Date(segment.departure.at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Text>
          <Text style={styles.airportCode}>{segment.departure.iataCode}</Text>
          <Text style={styles.terminalText}>
            Terminal {segment.departure.terminal || '?'}
          </Text>
        </View>

        {/* Flight Path */}
        <View style={styles.middleBlock}>
          <View style={styles.flightPath}>
            <View style={styles.dot} />
            <View style={styles.line} />
            <View style={styles.planeIcon}>
              <Text style={styles.planeText}>✈️</Text>
            </View>
            <View style={styles.line} />
            <View style={styles.dot} />
          </View>
          <Text style={styles.flightInfo}>
            {dictionaries?.carriers?.[segment.carrierCode] || segment.carrierCode} {segment.number}
          </Text>
          <Text style={styles.durationSmall}>{parseDuration(segment.duration)}</Text>
        </View>

        {/* Arrival */}
        <View style={styles.timeBlock}>
          <Text style={styles.timeText}>
            {new Date(segment.arrival.at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Text>
          <Text style={styles.airportCode}>{segment.arrival.iataCode}</Text>
          <Text style={styles.terminalText}>
            Terminal {segment.arrival.terminal || '?'}
          </Text>
        </View>
      </Animated.View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBarComponent />
      
      <CustomHeader imageSource={imageIndex.backorange} label='✈️ Flight Offers' />

      {offers.length === 0 ? (
        <Animated.View 
          style={[
            styles.emptyState,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          <Text style={styles.emptyEmoji}>🛫</Text>
          <Text style={styles.emptyTitle}>No flights found</Text>
          <Text style={styles.emptySubtitle}>
            Try adjusting your search criteria or dates
          </Text>
        </Animated.View>
      ) : (
        <Animated.View
          style={{
            flex: 1,
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }]
          }}
        >
          <FlatList
            data={offers}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            renderItem={({ item, index }) => (
              <FlightOfferCard 
                offer={item} 
                dictionaries={dictionaries} 
                index={index}
              />
            )}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
            showsVerticalScrollIndicator={false}
          />
        </Animated.View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: 'white' 
  },
  headerContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: 'white',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
    marginLeft: 10,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 8,
    borderWidth: 1,
    borderColor: '#E8F0FE',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  priceContainer: {
    alignItems: 'flex-start',
  },
  priceText: {
    fontSize: 26,
    fontWeight: '800',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  seatBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 107, 53, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#FF6B35',
  },
  seatText: {
    color: '#FF6B35',
    fontSize: 12,
    fontWeight: '700',
  },
  durationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'red',
  },
  durationText: {
    fontSize: 14,
    fontWeight: '700',
    color: 'black',
  },
  airlineContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  airlineText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(0,0,0,0.05)',
    marginVertical: 8,
  },
  segmentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16,
  },
  timeBlock: {
    width: 80,
    alignItems: 'center',
  },
  timeText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  airportCode: {
    fontSize: 20,
    fontWeight: '500',
    color: 'black',
    marginBottom: 2,
  },
  terminalText: {
    fontSize: 11,
    color: '#888',
    fontWeight: '600',
  },
  middleBlock: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  flightPath: {
    alignItems: 'center',
    marginBottom: 8,
    flexDirection: 'row',
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#FF3B30',
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#FF3B30',
    marginHorizontal: 4,
  },
  planeIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FF3B30',
    justifyContent: 'center',
    alignItems: 'center',
    transform: [{ rotate: '45deg' }],
  },
  planeText: {
    fontSize: 12,
    transform: [{ rotate: '-45deg' }],
  },
  flightInfo: {
    fontSize: 13,
    fontWeight: '600',
    color: '#444',
    textAlign: 'center',
    marginBottom: 4,
  },
  durationSmall: {
    fontSize: 11,
    color: '#888',
    fontWeight: '500',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },
  priceBreakdown: {
    flex: 1,
  },
  basePriceText: {
    fontSize: 13,
    color: '#666',
    fontWeight: '500',
    marginBottom: 2,
  },
  taxesText: {
    fontSize: 12,
    color: '#888',
    fontWeight: '500',
  },
  selectButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: "red"
  },
  selectButtonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '700',
  },
  separator: {
    height: 16,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyEmoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
  },
});