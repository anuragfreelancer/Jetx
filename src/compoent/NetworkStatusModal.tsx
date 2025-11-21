// import React, { useEffect, useRef } from 'react';
// import { View, Text, Modal, StyleSheet, TouchableOpacity, Linking, Platform, Animated } from 'react-native';

// type Props = {
//   isConnected: boolean | null;
//   modalVisible: boolean;
//   onClose?: () => void;
//   onlineText?: string;
//   offlineText?: string;
//   checkingText?: string;
// };

// const NetworkStatusModal: React.FC<Props> = ({
//   isConnected,
//   modalVisible,
//   onClose,
//   onlineText,
//   offlineText,
//   checkingText,
// }) => {
//   const slideAnim = useRef(new Animated.Value(-100)).current;

//   const openSettings = () => {
//     if (Platform.OS === 'ios') {
//       Linking.openURL('App-Prefs:root=MOBILE_DATA_SETTINGS_ID');
//     } else {
//       Linking.openSettings();
//     }
//   };

//   useEffect(() => {
//     if (modalVisible) {
//       // Slide down animation
//       Animated.timing(slideAnim, {
//         toValue: 0,
//         duration: 300,
//         useNativeDriver: true,
//       }).start();

//       // Auto close when online
//       if (isConnected) {
//         const timer = setTimeout(() => {
//           onClose?.();
//         }, 3000);
//         return () => clearTimeout(timer);
//       }
//     } else {
//       // Reset animation when modal closes
//       slideAnim.setValue(-100);
//     }
//   }, [modalVisible, isConnected]);

//   const getStatusContent = () => {
//     if (isConnected === null) {
//       return {
//         title: checkingText || 'Checking connection...',
//         subtitle: 'Please wait while we check your network',
//         icon: '🔄',
//         color: '#FFA500',
//         showButton: false
//       };
//     }

//     if (isConnected) {
//       return {
//         title: onlineText || 'Connection restored',
//         subtitle: 'You are back online',
//         icon: '✅',
//         color: '#4CAF50',
//         showButton: false
//       };
//     }

//     return {
//       title: offlineText || 'No internet connection',
//       subtitle: 'Check your network settings and try again',
//       icon: '❌',
//       color: '#FF4444',
//       showButton: true
//     };
//   };

//   const content = getStatusContent();

//   return (
//     <Modal visible={modalVisible} transparent animationType="none">
//       <View style={styles.modalContainer}>
//         <Animated.View 
//           style={[
//             styles.modalContent,
//             { 
//               backgroundColor: '#FFFFFF',
//               borderLeftColor: content.color,
//               transform: [{ translateY: slideAnim }]
//             }
//           ]}
//         >
//           <View style={styles.contentWrapper}>
//             <View style={styles.iconContainer}>
//               <Text style={styles.emoji}>{content.icon}</Text>
//             </View>
            
//             <View style={styles.textContainer}>
//               <Text style={styles.title} numberOfLines={1}>
//                 {content.title}
//               </Text>
//               <Text style={styles.subtitle} numberOfLines={2}>
//                 {content.subtitle}
//               </Text>
//             </View>

//             {content.showButton && (
//               <TouchableOpacity 
//                 style={[styles.button, { backgroundColor: content.color }]} 
//                 onPress={openSettings}
//               >
//                 <Text style={styles.buttonText}>Settings</Text>
//               </TouchableOpacity>
//             )}

//             {isConnected && (
//               <View style={styles.autoCloseContainer}>
//                 <View style={styles.progressBar}>
//                   <View style={[styles.progressFill, { backgroundColor: content.color }]} />
//                 </View>
//               </View>
//             )}
//           </View>

//           {/* Close button for offline state */}
//           {!isConnected && (
//             <TouchableOpacity style={styles.closeButton} onPress={onClose}>
//               <Text style={styles.closeIcon}>×</Text>
//             </TouchableOpacity>
//           )}
//         </Animated.View>
//       </View>
//     </Modal>
//   );
// };

// const styles = StyleSheet.create({
//   modalContainer: {
//     flex: 1,
//     backgroundColor: 'transparent',
//   },
//   modalContent: {
//     marginTop: Platform.OS === 'ios' ? 50 : 30,
//     marginHorizontal: 16,
//     borderRadius: 12,
//     borderLeftWidth: 4,
//     shadowColor: '#000',
//     shadowOffset: {
//       width: 0,
//       height: 2,
//     },
//     shadowOpacity: 0.25,
//     shadowRadius: 3.84,
//     elevation: 5,
//     overflow: 'hidden',
//   },
//   contentWrapper: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     padding: 16,
//     paddingRight: 45, // Space for close button
//   },
//   iconContainer: {
//     marginRight: 12,
//   },
//   emoji: {
//     fontSize: 20,
//   },
//   textContainer: {
//     flex: 1,
//     marginRight: 8,
//   },
//   title: {
//     fontSize: 14,
//     fontWeight: '600',
//     color: '#0F0F0F',
//     marginBottom: 2,
//   },
//   subtitle: {
//     fontSize: 12,
//     color: '#606060',
//     lineHeight: 16,
//   },
//   button: {
//     paddingHorizontal: 16,
//     paddingVertical: 8,
//     borderRadius: 18,
//     minWidth: 70,
//   },
//   buttonText: {
//     color: '#FFFFFF',
//     fontSize: 12,
//     fontWeight: '500',
//     textAlign: 'center',
//   },
//   autoCloseContainer: {
//     position: 'absolute',
//     bottom: 0,
//     left: 0,
//     right: 0,
//   },
//   progressBar: {
//     height: 3,
//     backgroundColor: '#E0E0E0',
//   },
//   progressFill: {
//     height: '100%',
//     width: '100%',
//   },
//   closeButton: {
//     position: 'absolute',
//     top: 8,
//     right: 8,
//     width: 24,
//     height: 24,
//     borderRadius: 12,
//     backgroundColor: 'transparent',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   closeIcon: {
//     fontSize: 18,
//     color: '#606060',
//     fontWeight: '300',
//   },
// });

// export default NetworkStatusModal;import React, { useState, useEffect } from 'react';
import { View, Text, Modal, StyleSheet, TouchableOpacity, Linking, Platform, Animated } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import { useEffect } from 'react';

type Props = {
  isConnected: boolean | null;
  modalVisible: boolean;
  onClose?: () => void;
  onlineText?: string;
  offlineText?: string;
  checkingText?: string;
};

const NetworkStatusModal: React.FC<Props> = ({
  isConnected,
  modalVisible,
  onClose,
  onlineText,
  offlineText,
  checkingText,
}) => {
  const slideAnim = useRef(new Animated.Value(-100)).current;

  const openSettings = () => {
    if (Platform.OS === 'ios') {
      Linking.openURL('App-Prefs:root=MOBILE_DATA_SETTINGS_ID');
    } else {
      Linking.openSettings();
    }
  };

  useEffect(() => {
    if (modalVisible) {
      // Slide down animation
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();

      // Auto close when online
      if (isConnected) {
        const timer = setTimeout(() => {
          onClose?.();
        }, 3000);
        return () => clearTimeout(timer);
      }
    } else {
      // Reset animation when modal closes
      slideAnim.setValue(-100);
    }
  }, [modalVisible, isConnected]);

  const getStatusContent = () => {
    if (isConnected === null) {
      return {
        title: checkingText || 'Checking connection...',
        subtitle: 'Please wait while we check your network',
        icon: '🔄',
        color: '#FFA500',
        showButton: false
      };
    }

    if (isConnected) {
      return {
        title: onlineText || 'Connection restored',
        subtitle: 'You are back online',
        icon: '✅',
        color: '#4CAF50',
        showButton: false
      };
    }

    return {
      title: offlineText || 'No internet connection',
      subtitle: 'Check your network settings and try again',
      icon: '❌',
      color: '#FF4444',
      showButton: true
    };
  };

  const content = getStatusContent();

  return (
    <Modal visible={modalVisible} transparent animationType="none">
      <View style={styles.modalContainer}>
        <Animated.View 
          style={[
            styles.modalContent,
            { 
              backgroundColor: '#FFFFFF',
              borderLeftColor: content.color,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          <View style={styles.contentWrapper}>
            <View style={styles.iconContainer}>
              <Text style={styles.emoji}>{content.icon}</Text>
            </View>
            
            <View style={styles.textContainer}>
              <Text style={styles.title} numberOfLines={1}>
                {content.title}
              </Text>
              <Text style={styles.subtitle} numberOfLines={2}>
                {content.subtitle}
              </Text>
            </View>

            {content.showButton && (
              <TouchableOpacity 
                style={[styles.button, { backgroundColor: content.color }]} 
                onPress={openSettings}
              >
                <Text style={styles.buttonText}>Settings</Text>
              </TouchableOpacity>
            )}

            {isConnected && (
              <View style={styles.autoCloseContainer}>
                <View style={styles.progressBar}>
                  <View style={[styles.progressFill, { backgroundColor: content.color }]} />
                </View>
              </View>
            )}
          </View>

          {/* Close button for offline state */}
          {!isConnected && (
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Text style={styles.closeIcon}>×</Text>
            </TouchableOpacity>
          )}
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  modalContent: {
    marginTop: Platform.OS === 'ios' ? 50 : 30,
    marginHorizontal: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    overflow: 'hidden',
  },
  contentWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    paddingRight: 45, // Space for close button
  },
  iconContainer: {
    marginRight: 12,
  },
  emoji: {
    fontSize: 20,
  },
  textContainer: {
    flex: 1,
    marginRight: 8,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0F0F0F',
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 12,
    color: '#606060',
    lineHeight: 16,
  },
  button: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 18,
    minWidth: 70,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
  },
  autoCloseContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  progressBar: {
    height: 3,
    backgroundColor: '#E0E0E0',
  },
  progressFill: {
    height: '100%',
    width: '100%',
  },
  closeButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeIcon: {
    fontSize: 18,
    color: '#606060',
    fontWeight: '300',
  },
}); 
