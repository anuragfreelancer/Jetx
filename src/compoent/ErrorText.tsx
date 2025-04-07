import React from "react";
import { Text, TextStyle } from "react-native";

interface ErrorTextProps {
  message?: string;
  Styles?: TextStyle;
}

const ErrorText: React.FC<ErrorTextProps> = ({ message, Styles }) => {
  if (!message) return null; // If there's no error message, return null

  return <Text style={[{ color: "red", fontSize: 12 }, Styles]}>{message}</Text>;
};

export default ErrorText;
