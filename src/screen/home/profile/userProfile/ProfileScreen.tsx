import React, {  useState } from 'react';
import { View, Text,  Image, TouchableOpacity, FlatList, ScrollView } from 'react-native';
import imageIndex from '../../../../assets/imageIndex';
import CustomHeader from '../../../../compoent/CustomHeader';
import { SafeAreaView } from 'react-native-safe-area-context';
 import { useNavigation } from '@react-navigation/native';
import StatusBarComponent from '../../../../compoent/StatusBarCompoent';
import LogoutModal from '../../../../compoent/LogoutModal';
import styles from './style';
import MenuItems from './customData';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../../../redux/feature/authSlice';
import ScreenNameEnum from '../../../../routes/screenName.enum';
 
const ProfileScreen = () => {
  const navigation = useNavigation()
const dispatch = useDispatch()
     const userGet = useSelector((state: any) => state.feature);
     const userData = userGet?.userGetData
    const handleLogout = () => async () => {
  try {
    setLogoutModal(false)
    dispatch(logout()); 
 navigation.reset({
          index: 0,
          routes: [{ name: ScreenNameEnum.LoginScreen }],
        });
   } catch (error) {
    console.log('Error clearing user data:', error);
  }
};
// get-profile
//  
  const renderItem = ({ item }:any) => (
    <TouchableOpacity style={styles.menuItem}
      onPress={() => {
        if (item?.label === "Log Out") {
          setLogoutModal(true);
        } else {
          navigation.navigate(item?.screen);
        }
      }}
    >
      <Image source={item.icon} style={styles.icon} />
      <Text style={styles.menuText}>{item.label}</Text>
    </TouchableOpacity>
  );
  const [logoutModal, setLogoutModal] = useState(false)
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <StatusBarComponent />
      <CustomHeader imageSource={imageIndex.backorange} label="Profile" />
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={{
          alignItems: 'center',

        }}>
          {userData?.image ? (  <Image
            source={{ uri: userData?.image }}
            style={styles.avatar}
          />):(
              <Image
            source={{ uri: 'https://randomuser.me/api/portraits/women/44.jpg' }}
            style={styles.avatar}
          />
          )}
          
          <Text style={styles.name}>{userData?.user_name}</Text>
          <Text style={styles.editText}>{userData?.email}</Text>
        </View>
        <FlatList
          data={MenuItems}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.menuList}
          scrollEnabled={false}
          showsVerticalScrollIndicator={false}
          style={{
            marginTop:6
          }}
        />
      </ScrollView>
      <LogoutModal isVisible={logoutModal}
        close={() => setLogoutModal(false)}
        onSumbit={
          handleLogout()}
      />
    </SafeAreaView>
  );
};



export default ProfileScreen;
