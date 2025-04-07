import React from 'react';
import { View, Text, ImageBackground, SafeAreaView, Dimensions, Image, FlatList, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import imageIndex from '../../../assets/imageIndex';
import CustomButton from '../../../compoent/CustomButton';
import StatusBarComponent from '../../../compoent/StatusBarCompoent';
import { useNavigation } from '@react-navigation/native';
import ScreenNameEnum from '../../../routes/screenName.enum';
import styles from './style';

const HomeScreen = () => {
    const { height } = Dimensions.get('window');
    const privateJets = [
        {
            id: '1',
            name: 'Gulfstream G650',
            image: 'https://i.imgur.com/qkdpN.jpg',
            speed: '690 mph',
            range: '7,000 miles',
            seats: 18,
            price: '$15,000/hr',
        },
        {
            id: '2',
            name: 'HondaJet Elite',
            image: 'https://i.imgur.com/qkdpN.jpg',
            speed: '485 mph',
            range: '1,437 miles',
            seats: 6,
            price: '$13,000/hr',
        },
    ];
    const navigation = useNavigation()

    return (
        <SafeAreaView style={styles.container}>
            <StatusBarComponent backgroundColor='#FF3B30' barStyle="light-content'" />
            <View style={[styles.header, { height: height * 0.2 }]}>
                <View style={styles.headerContent}>
                    <Text style={styles.headerText}>
                        Let's book your{"\n"} next flight
                    </Text>
                    <View
                        style={{ flexDirection: "row", alignItems: "center" }}
                    >
                        <TouchableOpacity

                            onPress={() => navigation.navigate(ScreenNameEnum.Notifications)}
                        >
                            <Image
                                source={imageIndex.notifications}
                                style={{
                                    height: 22,
                                    width: 22,
                                    right: 11
                                }}
                                resizeMode='contain'
                            />
                        </TouchableOpacity>
                        <TouchableOpacity

                            onPress={() => navigation.navigate(ScreenNameEnum.ProfileScreen)}
                        >
                            <Image
                                source={imageIndex.Ellipse}
                                style={{
                                    height: 45,
                                    width: 45,
                                }}
                                resizeMode='contain'
                            />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
            <View style={styles.formContainer}>
                <ScrollView showsVerticalScrollIndicator={false} >
                    <View  >
                        <View style={styles.input}>
                            <Text style={{
                                fontSize: 14,
                                color: '#C9C9C9',
                                fontWeight: '600',

                            }}>From</Text>
                            <TextInput
                                placeholder="Miami FL (MΙΑ) "
                                placeholderTextColor="black"
                                style={styles.inuptSum}
                            />
                        </View>
                        <View style={styles.input}>
                            <Text style={{
                                fontSize: 14,
                                color: '#C9C9C9',
                                fontWeight: '600',

                            }}>To</Text>
                            <TextInput
                                placeholder="Mexico City (MEX) "
                                placeholderTextColor="black"
                                style={styles.inuptSum}
                            />
                        </View>

                        <View style={{
                            flexDirection: "row", justifyContent: "space-between",
                            marginTop: 8
                        }}>

                            <View style={[styles.input, {
                                width: "48%"
                            }]}>
                                <Text style={styles.depTitle}>Departure </Text>
                                <TextInput
                                    placeholder="10 Nov, 2027 "
                                    placeholderTextColor="black"
                                    style={styles.date}
                                />
                            </View>
                            <View style={[styles.input, {
                                width: "48%"

                            }]}>
                                <Text style={styles.depTitle}>Return </Text>
                                <TextInput
                                    placeholder="12 Νον, 2027"
                                    placeholderTextColor="black"
                                    style={styles.date}
                                />
                            </View>
                        </View>
                        <CustomButton
                            title={'Search flight '}
                            buttonStyle={{
                                marginTop: 25
                            }}
                            onPress={() => navigation.navigate(ScreenNameEnum.SearchFlight)}
                        />
                    </View>
                    <View style={styles.jetSection}>
                        <View style={styles.jetHeader}>
                            <Text style={styles.jetTitle}>Private Jets</Text>
                            <TouchableOpacity>
                                <Text style={styles.viewAll}>View All</Text>
                            </TouchableOpacity>
                        </View>
                        <FlatList
                            horizontal
                            showsVerticalScrollIndicator={false}
                            data={privateJets}
                            keyExtractor={(item) => item.id}
                            showsHorizontalScrollIndicator={false}
                            renderItem={({ item }) => (
                                <TouchableOpacity style={styles.card}
                                    onPress={() => navigation.navigate(ScreenNameEnum.SearchFlight)}
                                >
                                    <ImageBackground source={imageIndex.flite} style={styles.cardImage} >
                                        <View style={{ alignItems: "flex-end", marginTop: 12 }}>
                                            <Image source={imageIndex.archive}
                                                style={{
                                                    height: 24,
                                                    width: 24,
                                                    right: 10,

                                                }}
                                                resizeMode='contain'
                                            />
                                        </View>

                                    </ImageBackground>

                                    <Text style={styles.cardTitle}>{item.name}</Text>
                                    <View style={styles.cardInfo}>
                                        <View style={{ flexDirection: "row", alignItems: "center" }}>

                                            <Image source={imageIndex.seat} style={{
                                                height: 16,
                                                width: 16
                                            }} />

                                            <Text style={styles.cardText}> {item.seats} </Text>
                                        </View>
                                        <View style={{ flexDirection: "row", alignItems: "center" }}>

                                            <Image source={imageIndex.speed} style={{
                                                height: 16,
                                                width: 16
                                            }} />

                                            <Text style={styles.cardText}>{item.speed}</Text>
                                        </View>
                                        <View style={{ flexDirection: "row", alignItems: "center" }}>

                                            <Image source={imageIndex.distance} style={{
                                                height: 16,
                                                width: 16
                                            }} />

                                            <Text style={styles.cardText}>{item.range} </Text>
                                        </View>
                                    </View>



                                    <Text style={styles.cardPrice}>{item.price}</Text>
                                </TouchableOpacity>
                            )}
                        />
                    </View>
                </ScrollView>
            </View>
        </SafeAreaView>
    );
};

export default HomeScreen;
