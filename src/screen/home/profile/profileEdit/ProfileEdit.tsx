import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, FlatList, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import TextInputField from '../../../../utils/TextInputField';
import imageIndex from '../../../../assets/imageIndex';
import CustomHeader from '../../../../compoent/CustomHeader';
import StatusBarComponent from '../../../../compoent/StatusBarCompoent';
import CustomButton from '../../../../compoent/CustomButton';
import { useNavigation } from '@react-navigation/native';


const ProfileEdit = () => {
  const navigation = useNavigation()

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <StatusBarComponent />
      <CustomHeader imageSource={imageIndex.backorange} label="Profile" />

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>

        <View style={{
          alignItems: 'center',

        }}>
          <Image
            source={{ uri: 'https://randomuser.me/api/portraits/women/44.jpg' }}
            style={styles.avatar}
          />
          <View style={{ marginHorizontal: 15, marginTop: 30 }}>
            <TextInputField
              imgStyle={{
                tintColor: "#FF3B30"
              }}

              placeholderTextColor={"#FF3B30"}
              placeholder={'Full Name '}

              firstLogo={true}
              img={imageIndex.Fideuser}
            />
            <TextInputField
              imgStyle={{
                tintColor: "#FF3B30"
              }}

              placeholderTextColor={"#FF3B30"}
              placeholder={'Email '}

              firstLogo={true}
              img={imageIndex.emai}
            />
            <TextInputField
              imgStyle={{
                tintColor: "#FF3B30"
              }}

              placeholderTextColor={"#FF3B30"}
              placeholder={'City  '}

              firstLogo={true}
              img={imageIndex.city}
            />
            <TextInputField
              imgStyle={{
                tintColor: "#FF3B30"
              }}

              placeholderTextColor={"#FF3B30"}
              placeholder={'Country'}

              firstLogo={true}
              img={imageIndex.country}
            />
          </View>
        </View>



      </ScrollView>

      <View style={{
        justifyContent: 'flex-start',
        marginHorizontal: 15
      }}>
        <CustomButton
          title={'Profile'}
          onPress={() => navigation.goBack()
          }
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    backgroundColor: '#fff',
  },
  backButton: {
    position: 'absolute',
    top: 60,
    left: 20,
  },
  header: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 20,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 120,
   },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  editText: {
    color: 'gray',
    marginBottom: 20,
  },
  menuList: {
    width: '100%',
    paddingHorizontal: 20,
    marginTop: 11
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 12,
    marginBottom: 10,
    elevation: 4, // Android shadow
    shadowColor: '#000', // iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3.84,
  },
  icon: {
    marginRight: 15,
    height: 40,
    width: 40
  },
  menuText: {
    fontSize: 14,
    color: '#352C48',
    fontWeight: "500"
  },
});

export default ProfileEdit;
