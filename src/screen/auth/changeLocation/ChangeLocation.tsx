import {
  View,
  Text,
  Image,
  ScrollView,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import React, { useState } from 'react';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
 import ScreenNameEnum from '../../../routes/screenName.enum';
import { useNavigation } from '@react-navigation/native';
import CustomHeader from '../../../compoent/CustomHeader';
import StatusBarComponent from '../../../compoent/StatusBarCompoent';
import CustomButton from '../../../compoent/CustomButton';
import imageIndex from '../../../assets/imageIndex';
import SearchBar from '../../../compoent/SearchBar';

export default function ChangeLocation() {
  const navigation = useNavigation()
  const recentSearches = [{
    name: "Indore",
    imageIndex: imageIndex.Nearby
  },


  {
    name: "Nearby",
    imageIndex: imageIndex.search2
  }
];
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <StatusBarComponent />
      <ScrollView showsVerticalScrollIndicator={false} >
        <View style={{ marginTop: 18 }}>
          <CustomHeader imageSource={imageIndex.backorange} />
        </View>
        <View
          style={{
            backgroundColor: '#FFF',
            padding: 15,
            marginTop: hp(1)
          }}>
             <SearchBar />

 
          <View style={stylesA.container}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Image source={imageIndex.Nearby}
                style={{
                  height: 24,
                  width: 24
                }}
              />
              <Text style={stylesA.sectionTitle}>Nearby</Text>
            </View>


            <View style={stylesA.sectionHeader}>
              <Text style={stylesA.sectionTitle}>Recent Searches</Text>
              <TouchableOpacity>
                <Text style={stylesA.clearText}>Clear</Text>
              </TouchableOpacity>
            </View>

            <FlatList
              data={recentSearches}
              renderItem={({ item }) => (
                <View style={stylesA.searchItem}>
                  <Image source={item.imageIndex}
                    style={{
                      height: 24,
                      width: 24
                    }}
                    resizeMode='contain'
                  />
                  <Text style={stylesA.searchText}>{item.name}</Text>
                </View>
              )}
              keyExtractor={(item, index) => index.toString()}
            />
          </View>



        </View>



      </ScrollView>
      <View style={{
        justifyContent: 'flex-start', marginBottom: 20
        ,
        marginHorizontal: 15
      }}>
        <CustomButton
          title={'Next'}
         onPress={() => navigation.navigate(ScreenNameEnum.HomeScreen)}
         />
      </View>

    </SafeAreaView>
  );
}



const stylesA = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    marginTop:12
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#777777',
    marginLeft: 8
  },
  clearText: {
    fontSize: 11,
    color: '#777777', // iOS-like blue color
    fontWeight: "700"
  },
  searchItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    flexDirection:"row",
    alignItems:"center"
  },
  searchText: {
    fontSize: 14,
    color: '#000',
    marginLeft:8,
    fontWeight:"500"
  },
});



          
