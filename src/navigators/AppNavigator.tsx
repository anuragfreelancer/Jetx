import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import RegistrationRoutes from './RegistrationRoutes';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { persistor, store } from '../redux/store';
import Toast from 'react-native-toast-message';
import toastConfig from '../utils/customToast';
import NetInfo from '@react-native-community/netinfo';
import { SafeAreaView } from 'react-native-safe-area-context';
import NetworkStatusModal from '../compoent/NetworkStatusModal';

const AppNavigator: React.FC = () => {
  const [isConnected, setIsConnected] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state:any) => {
       setIsConnected(state.isConnected);
      setModalVisible(!state.isConnected); // Agar internet off ho to modal show kare, on ho to hide kare
    });

    return () => unsubscribe();
  }, []);
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <SafeAreaView edges={['bottom']} style={{ flex: 1 }}>
          <NavigationContainer>
            {/* <NetworkStatusModal 
  isConnected={isConnected}
  modalVisible={showModal}
  onClose={() => setModalVisible(false)}
/> */}
        {/* <NetworkStatusModal modalVisible={isConnected} offlineText="No Internet! Please check your connection." />   */}
            <RegistrationRoutes />
            <Toast config={toastConfig} />
          </NavigationContainer>
          </SafeAreaView>
        </GestureHandlerRootView>
      </PersistGate>
    </Provider>
  );
};

export default AppNavigator;
