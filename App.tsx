import React, {FunctionComponent} from 'react';
import {LogBox,} from 'react-native';

import 'react-native-gesture-handler';
import AppNavigator from './src/navigators/AppNavigator';



LogBox.ignoreAllLogs();

const App: FunctionComponent<any> = () => <AppNavigator />;

export default App;

  
