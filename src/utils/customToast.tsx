import React from 'react';
import {Image, StyleSheet, View, Dimensions} from 'react-native';
import Toast from 'react-native-toast-message';
import TextCompoent, { Size } from './Text';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const toastConfig = {
  successResponse: ({text1}: any) => (
    <View style={styles.successContainer}>
      <View style={styles.iconContainer}>
        <View style={[styles.iconBackground, styles.successIconBg]}>
          {/* Add your success icon here */}
          <TextCompoent style={styles.iconText} color="#fff">✓</TextCompoent>
        </View>
      </View>
      <View style={styles.textContainer}>
        <TextCompoent
          style={styles.titleStyle}
          size={Size.Small}
          color={'#1F7722'}
          fontWeight="600">
          {text1}
        </TextCompoent>
      </View>
    </View>
  ),
  errorResponse: ({text1}: any) => (
    <View style={styles.errorContainer}>
      <View style={styles.iconContainer}>
        <View style={[styles.iconBackground, styles.errorIconBg]}>
          {/* Add your error icon here */}
          <TextCompoent style={styles.iconText} color="#fff">✕</TextCompoent>
        </View>
      </View>
      <View style={styles.textContainer}>
        <TextCompoent
          fontWeight="600"
          style={styles.titleStyle}
          size={Size.Small}
          color={'#fff'}>
          {text1}
        </TextCompoent>
      </View>
    </View>
  ),
  normalResponse: ({text1}: any) => (
    <View style={styles.normalContainer}>
      <View style={styles.iconContainer}>
        <View style={[styles.iconBackground, styles.normalIconBg]}>
          {/* Add your info icon here */}
          <TextCompoent style={styles.iconText} color="#fff">ℹ</TextCompoent>
        </View>
      </View>
      <View style={styles.textContainer}>
        <TextCompoent
          fontWeight="600"
          style={styles.titleStyle}
          size={Size.Small}
          color={'#1E293B'}>
          {text1}
        </TextCompoent>
      </View>
    </View>
  ),
};

export const successToast = (message: string, time: number = 3000) => {
  Toast.show({
    type: 'successResponse',
    text1: message,
    position: 'top',
    visibilityTime: time,
    topOffset: 60,
  });
};

export const errorToast = (message: string, time: number = 3000, position: string = 'top') => {
  Toast.show({
    type: 'errorResponse',
    text1: message,
    position: position,
    visibilityTime: time,
    topOffset: 60,
  });
};

export const normalToast = (message: string, time: number = 3000) => {
  Toast.show({
    type: 'normalResponse',
    text1: message,
    position: 'top',
    visibilityTime: time,
    topOffset: 60,
  });
};

export default toastConfig;

const styles = StyleSheet.create({
  // Common Styles
  titleStyle: {
    lineHeight: 20,
  },
  iconContainer: {
    marginLeft: 16,
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
    marginRight: 16,
  },
  iconBackground: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  
  // Success Toast
  successContainer: {
    height: 60,
    width: SCREEN_WIDTH * 0.9,
    backgroundColor: '#F0F9F0',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderLeftWidth: 4,
    borderLeftColor: '#22C55E',
    shadowColor: '#22C55E',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5,
  },
  successIconBg: {
    backgroundColor: '#22C55E',
  },

  // Error Toast
  errorContainer: {
    height: 60,
    width: SCREEN_WIDTH * 0.9,
    backgroundColor: '#DC2626',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#DC2626',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 6,
  },
  errorIconBg: {
    backgroundColor: '#fff',
  },

  // Normal/Info Toast
  normalContainer: {
    height: 60,
    width: SCREEN_WIDTH * 0.9,
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderLeftWidth: 4,
    borderLeftColor: '#3B82F6',
    shadowColor: '#64748B',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5,
  },
  normalIconBg: {
    backgroundColor: '#3B82F6',
  },
});