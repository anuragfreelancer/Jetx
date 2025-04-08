import React from 'react';
import { View, Text, FlatList, Image, StyleSheet, ImageBackground, TouchableOpacity, SafeAreaView } from 'react-native';
import imageIndex from '../../../assets/imageIndex';
import StatusBarComponent from '../../../compoent/StatusBarCompoent';
import CustomHeader from '../../../compoent/CustomHeader';
 import styles from './style';

const flightData = [
  {
    id: '1',
    name: 'Cessna Citation X+',
    image: imageIndex.fliteBag,
    speed: '647 mph',
    range: '7,500 miles',
    price: '$96,000/hr',
  },
  
];


const SavedPreferences = () => {
   const FlightCard = ({ item }:any) => (
    <TouchableOpacity style={styles.card}
    activeOpacity={0.5}
      // onPress={() => navigation.navigate(ScreenNameEnum.JetDetails)}
    >
      <ImageBackground source={item.image} style={styles.image} >
        <Image source={imageIndex.archiveSave} style={{ height: 24, width: 24, marginLeft: 7, marginTop: 9 }} resizeMode='contain' />
      </ImageBackground>
      <View style={styles.info}>
        <Text style={styles.title}>{item.name}</Text>
        <View style={[styles.row, {
          marginTop: 8
        }]}>
          <Image source={imageIndex.seat} style={{
            height: 16,
            width: 16
          }}
            resizeMode='contain'
          />
          <Text style={styles.text}>18</Text>
          <Image source={imageIndex.speed} style={{
            height: 16,
            width: 16,
            marginLeft: 5
          }}
            resizeMode='contain'
          />
          <Text style={styles.text}>610 mph</Text>
        </View>
        <View style={{
          flexDirection: 'row',
          marginTop: 4,
          justifyContent: "space-between"
        }}>
          <View style={{
            flexDirection: "row",
          }}>
            <Image source={imageIndex.distance} style={{
              height: 16,
              width: 16
            }}
              resizeMode='contain' />
            <Text style={styles.text}>{item.range}</Text>
          </View>
          <Text style={styles.price}>{item.price}</Text>
        </View>

      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={{
      flex: 1,
      backgroundColor: "white"
    }}>
      <StatusBarComponent />
      <CustomHeader imageSource={imageIndex.backorange} label={"Saved Preferences"} />
      <View style={styles.container}>
        <FlatList
          data={flightData}

          style={{
            marginTop: 22

          }}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <FlightCard item={item} />}
        />
      </View>
    </SafeAreaView>
  );
};



export default SavedPreferences;
