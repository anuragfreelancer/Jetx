import React, { useEffect } from 'react';
import { View, Image, StyleSheet,   SafeAreaView } from 'react-native';
    import imageIndex from '../../../assets/imageIndex';
import StatusBarComponent from '../../../compoent/StatusBarCompoent';
 import useSplash from './useSplash';
import { styles } from './style';
 const Splash: React.FC = () => {
 const {} = useSplash()
    return (
        <View style={styles.container}>
            <SafeAreaView>
              <StatusBarComponent  />
                 <Image source={imageIndex.appLogo} style={styles.logo} resizeMode="contain" />
            </SafeAreaView>
        </View>
    );
};

 
export default Splash;
