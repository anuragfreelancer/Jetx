import React from 'react';
import {
    View,
    Text,
    Image,
    ScrollView,
    TouchableOpacity,
    FlatList,
    ImageBackground,
    SafeAreaView,
} from 'react-native';
import imageIndex from '../../../assets/imageIndex';
import StatusBarComponent from '../../../compoent/StatusBarCompoent';
import CustomButton from '../../../compoent/CustomButton';
import { useNavigation } from '@react-navigation/native';
import ScreenNameEnum from '../../../routes/screenName.enum';
import styles from './style';

const JetDetails = () => {
    const amenitiesImages = [
        'https://via.placeholder.com/120x80',
        'https://via.placeholder.com/120x80',
        'https://via.placeholder.com/120x80',
    ];

    const renderAmenityImage = ({ item }: any) => (
        <Image source={imageIndex.fliteBag} style={styles.amenityImage} />
    );
    const navigation = useNavigation<any>()
    const reviews = [
        {
            id: '1',
            name: 'Kadin Calzonl',
            text: 'The lavatories are very professional and the sounds also surprisingly low. It was very smooth',
            image: 'https://randomuser.me/api/portraits/women/1.jpg',
        },
        {
            id: '2',
            name: 'Hanna Dokidis',
            text: 'Great luxury experience!',
            image: 'https://randomuser.me/api/portraits/women/2.jpg',
        },
    ];

    const AmenityItem = ({ label, label2 }: any) => (
        <View style={styles.amenityItem}>
            <Image style={{
                height: 24,
                width: 24
            }} source={imageIndex.bageverfiyPng}

                resizeMode='contain'
            />
            <Text style={styles.amenityText}>{label}</Text>
            <Image style={{
                height: 24,
                width: 24,
                marginLeft: 13
            }} source={imageIndex.bageverfiyPng}

                resizeMode='contain'
            />
            <Text style={[styles.amenityText, {
                marginLeft: 5,

            }]}>{label2}</Text>
        </View>
    );

    const ReviewItem = ({ name, text, image }: any) => (
        <View style={{ marginTop: 10 }}>
            <View style={styles.reviewItem}>
                <Image source={{ uri: image }} style={styles.avatar} />
                <View
                    style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        flex: 1,
                        marginLeft: 10,
                    }}
                >
                    <Text style={styles.reviewName}>{name}</Text>
                    <Image
                        source={imageIndex.viewStar}
                        style={{ height: 13, width: 78 }}
                        resizeMode="contain"
                    />
                </View>
            </View>
            <Text style={styles.reviewText}>{text}</Text>
            <View
                style={{
                    borderBottomWidth: 1,
                    marginTop: 15,
                    borderColor: '#CEC9C1',
                }}
            />
        </View>
    );
    return (
        <SafeAreaView style={{
            backgroundColor: "white",
            flex: 1
        }}>
            <StatusBarComponent />
            <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
                <ImageBackground
                    source={imageIndex.filtie}
                    style={{
                        height: 430,
                        paddingHorizontal: 18,
                        paddingBottom: 20,
                        overflow: 'hidden',
                    }}
                    resizeMode='cover'
                >
                    <View style={{ marginTop: 15 }}
                    >
                        <TouchableOpacity
                            onPress={() => navigation.goBack()}
                        >
                            <Image source={imageIndex.backorange}
                                style={styles.img}
                                tintColor={"white"}
                                resizeMode='contain'
                            />
                        </TouchableOpacity>
                    </View>
                    <View style={{
                        justifyContent: 'flex-end',
                        overflow: 'hidden',
                        flex: 1
                    }}>
                        <Text style={styles.title}>Gulfstream G650</Text>
                        <View style={styles.featuresRow}>
                            <View style={{
                                flexDirection: "row",
                            }}>
                                <Image
                                    source={imageIndex.seta}
                                    style={styles.img}
                                />
                                <View>
                                    <Text style={styles.bagText}>Seating Capacity</Text>
                                    <Text style={styles.bagSum}>18</Text>

                                </View>
                            </View>
                            <View style={{
                                flexDirection: "row",
                                marginLeft: 18
                            }}>
                                <Image
                                    source={imageIndex.time}
                                    style={{ height: 34, width: 34 }}
                                />
                                <View>
                                    <Text style={styles.bagText}>Speed</Text>
                                    <Text style={styles.bagSum}>18</Text>
                                </View>
                            </View>
                            <View style={{
                                flexDirection: "row",
                                marginLeft: 18
                            }}>
                                <Image
                                    source={imageIndex.seped}
                                    style={{ height: 34, width: 34 }}
                                />
                                <View>
                                    <Text style={styles.bagText}>Range</Text>
                                    <Text style={styles.bagSum}>7,500 miles</Text>

                                </View>
                            </View>
                        </View>
                        <Text style={styles.priceText}>$15,000/hr</Text>
                    </View>
                </ImageBackground>
                <View style={styles.detailsContainer}>
                    <Text style={styles.sectionTitle}>Amenities</Text>
                    <FlatList
                        horizontal
                        data={amenitiesImages}
                        renderItem={renderAmenityImage}
                        keyExtractor={(_, index) => index.toString()}
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={{ marginVertical: 10, marginTop: 15 }}
                    />
                    <Text style={[styles.sectionTitle, {
                        marginTop: 15
                    }]}>Amenities</Text>
                    <View style={styles.amenitiesList}>
                        <AmenityItem label="Wi-Fi" label2={"4K Entertainment System"} />
                        <AmenityItem label="Private Bedroom" label2={"Fine Dining & Catering"} />
                    </View>

                    <View style={styles.reviewHeader}>
                        <Text style={styles.sectionTitle}>Review</Text>
                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                            <Image style={{
                                height: 24,
                                width: 24
                            }}
                                resizeMode='contain'
                                source={imageIndex.messEdit} />
                            <Text style={styles.addReview}>Add Review</Text>
                        </View>
                    </View>
                    <FlatList
                        data={reviews}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => (
                            <ReviewItem name={item.name} text={item.text} image={item.image} />
                        )}
                        contentContainerStyle={{ padding: 10 }}
                    />
                </View>
            </ScrollView>
            <CustomButton
                title={'Book Now'}
                onPress={() => navigation.navigate(ScreenNameEnum.BookNow)}
                buttonStyle={{ marginHorizontal: 17, marginTop: 20, marginBottom: 12 }}
            />
        </SafeAreaView>
    );
};






export default JetDetails;
