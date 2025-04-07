import 'react-native-gesture-handler';
import React, { FunctionComponent } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
 import _routes from '../routes/routes';
 const Stack = createNativeStackNavigator();



const RegistrationRoutes: FunctionComponent = () => {
  const routes = _routes(); // पहले _routes() को कॉल करें

  return (
    <Stack.Navigator
      // initialRouteName={ScreenNameEnum.SPLASH_SCREEN}
      screenOptions={{
        headerShown: false,
        gestureEnabled: true,
        gestureDirection: 'horizontal',

      }}>
      {routes.REGISTRATION_ROUTE.map(screen => (
        <Stack.Screen
          key={screen.name}
          name={screen.name}
          component={screen.Component}
        />
      ))}
   
 
 

    </Stack.Navigator>
  );
};

export default RegistrationRoutes;
