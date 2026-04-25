import React, {FunctionComponent} from 'react';
import {LogBox,} from 'react-native';

import 'react-native-gesture-handler';
import AppNavigator from './src/navigators/AppNavigator';



LogBox.ignoreAllLogs();

const App: FunctionComponent<any> = () => <AppNavigator />;

export default App;

  






// App.js
// React Navigation setup — SearchScreen se ResultsScreen tak

// import React from 'react';
// import { NavigationContainer } from '@react-navigation/native';
// import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import SearchScreen from './SearchScreen';
// import ResultsScreen from './ResultsScreen';
 

// const Stack = createNativeStackNavigator();

// export default function App() {
//   return (
//     <NavigationContainer>
//       <Stack.Navigator
//          screenOptions={{ headerShown: false }}
//       >
//         <Stack.Screen name="Search" component={SearchScreen} />
//         {/* <Stack.Screen name="Results" component={ResultsScreen} /> */}
//       </Stack.Navigator>
//     </NavigationContainer>
//   );
// }
