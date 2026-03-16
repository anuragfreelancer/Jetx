import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle, Platform, Image } from 'react-native';
 
// Define props type
interface CustomButtonProps {
  title: string;
  onPress: () => void;
  buttonStyle?: ViewStyle;
  textStyle?: TextStyle;
  disabled?: boolean;
  secoundImg?: any;  // Optional image
}

// Functional component with React.memo
const CustomButton: React.FC<CustomButtonProps> = React.memo(({
  title,
  onPress,
  buttonStyle,
  textStyle,
  disabled = false,
  secoundImg,
}) => {
  return (
    <TouchableOpacity
      style={[styles.button, buttonStyle, disabled && styles.disabledButton]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
    >
      <Text style={[styles.buttonText, textStyle]}>{title}</Text>
      {secoundImg && (
        <Image 
          source={secoundImg} 
          style={styles.image} 
        />
      )}
    </TouchableOpacity>
  );
});

// Default styles
const styles = StyleSheet.create({
  button: {
    backgroundColor: 'black',
    paddingVertical: 12,
    paddingHorizontal: 20,
    height: 58,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
   
      
 
  },
  buttonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '600',
    lineHeight: 20,
  },
  disabledButton: {
   },
  image: {
    height: 24,
    width: 24,
    resizeMode: 'contain',
    marginLeft: 20,
  },
});

export default CustomButton;
