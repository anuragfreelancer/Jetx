import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  Animated,
  Easing,
  Dimensions,
  Image
} from 'react-native';
import imageIndex from '../../assets/imageIndex';

const { width } = Dimensions.get('window');
const THEME_COLOR = 'red';

const LoadingModal = ({ visible, message = "Loading..." }) => {
  const spinValue = useRef(new Animated.Value(0)).current;
  const fadeValue = useRef(new Animated.Value(0)).current;
  const scaleValue = useRef(new Animated.Value(0.8)).current;
  const floatValue = useRef(new Animated.Value(0)).current;
  const pulse1 = useRef(new Animated.Value(0)).current;
  const pulse2 = useRef(new Animated.Value(0)).current;
  const pulse3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.loop(
          Animated.timing(spinValue, {
            toValue: 1,
            duration: 1500,
            easing: Easing.linear,
            useNativeDriver: true,
          })
        ),
        Animated.timing(fadeValue, {
          toValue: 1,
          duration: 300,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(scaleValue, {
          toValue: 1,
          duration: 400,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.loop(
          Animated.sequence([
            Animated.timing(floatValue, {
              toValue: 1,
              duration: 1200,
              easing: Easing.inOut(Easing.sin),
              useNativeDriver: true,
            }),
            Animated.timing(floatValue, {
              toValue: 0,
              duration: 1200,
              easing: Easing.inOut(Easing.sin),
              useNativeDriver: true,
            }),
          ])
        ),
        Animated.loop(
          Animated.stagger(300, [
            createPulseAnimation(pulse1, 0),
            createPulseAnimation(pulse2, 200),
            createPulseAnimation(pulse3, 400),
          ])
        ),
      ]).start();
    } else {
      spinValue.setValue(0);
      fadeValue.setValue(0);
      scaleValue.setValue(0.8);
      floatValue.setValue(0);
      pulse1.setValue(0);
      pulse2.setValue(0);
      pulse3.setValue(0);
    }
  }, [visible]);

  const createPulseAnimation = (animatedValue, delay) => {
    return Animated.sequence([
      Animated.delay(delay),
      Animated.timing(animatedValue, {
        toValue: 1,
        duration: 500,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(animatedValue, {
        toValue: 0,
        duration: 500,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }),
    ]);
  };

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const float = floatValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -10],
  });

  const scale = scaleValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0.8, 1],
  });

  if (!visible) return null;

  return (
    <Modal transparent animationType="fade" visible={visible}>
      <View style={styles.overlay}>
        <Animated.View
          style={[
            styles.modalContainer,
            {
              opacity: fadeValue,
              transform: [
                { translateY: float },
                { scale: scale }
              ]
            }
          ]}
        >

          <View style={styles.spinnerContainer}>
            <Animated.View
              style={[
                styles.spinner,
                { transform: [{ rotate: spin }] }
              ]}
            >
              <View style={styles.spinnerInner} />
              <View style={styles.spinnerArc} />
            </Animated.View>

            {/* CENTER LOGO */}
            <View style={styles.centerIcon}>
              <View style={styles.logoBox}>
                <Image
                  source={imageIndex.appLogo}
                  resizeMode="contain"
                  style={styles.logoStyle}
                />
              </View>
            </View>
          </View>

        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    justifyContent: 'center',
    width: width * 0.7,
  },

  spinnerContainer: {
    width: 90,
    height: 90,
    justifyContent: 'center',
    alignItems: 'center',
  },

  spinner: {
    width: 85,
    height: 85,
    borderRadius: 50.5,
    borderWidth: 2,
    borderColor: '#E3E3E3',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
  },

  spinnerInner: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#F8F8F8',
  },

  spinnerArc: {
    position: 'absolute',
    width: 85,
    height: 85,
    borderRadius: 42.5,
    borderWidth: 3,
    borderLeftColor: THEME_COLOR,
    borderTopColor: THEME_COLOR,
    borderRightColor: 'transparent',
    borderBottomColor: 'transparent',
  },

  centerIcon: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },

  logoBox: {
    width: 55,
    height: 55,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },

  logoStyle: {
    width: 55,
    height: 55,
  },
});

export default LoadingModal;
