import React from 'react';
import { StatusBar, SafeAreaView, View } from 'react-native';

type StatusBarComponentProps = {
  barStyle?: 'default' | 'light-content' | 'dark-content';
  backgroundColor?: string;
  translucent?: boolean;
};

const StatusBarComponent: React.FC<StatusBarComponentProps> = ({
  barStyle = 'dark-content',
  backgroundColor = 'white',
  translucent = false,
}) => {
  return (
    <>
      <StatusBar
        barStyle={barStyle}
        backgroundColor={backgroundColor}
        translucent={translucent}
      />
      <SafeAreaView style={{ backgroundColor }} />
    </>
  );
};

export default StatusBarComponent;
