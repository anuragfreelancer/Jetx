import React, { useState, useRef } from 'react';
import { View, Text, FlatList, Dimensions, SafeAreaView, ImageBackground } from 'react-native';
import imageIndex from '../../../assets/imageIndex';
import CustomButton from '../../../compoent/CustomButton';
import ScreenNameEnum from '../../../routes/screenName.enum';
import styles from './style'
import slides, { Slide } from './coustomData';
import StatusBarComponent from '../../../compoent/StatusBarCompoent';
const OnboardingScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
    const [currentIndex, setCurrentIndex] = useState<number>(0);
    const flatListRef = useRef<FlatList>(null);
    const updateCurrentIndex = (event: any) => {
        const contentOffsetX = event.nativeEvent.contentOffset.x;
        const index = Math.round(contentOffsetX / width);
        setCurrentIndex(index);
    };
    const renderSlide = ({ item }: { item: Slide }) => (
        <View style={styles.slide}>
            <ImageBackground source={imageIndex.onBag} style={styles.image} resizeMode='cover'  >
            </ImageBackground>

            <Text style={{
                fontSize: 25,
                fontWeight: "700",
                color: "black",
                textAlign: "center",
            }}>Ready to Start?</Text>
            <Text style={styles.description}>
                Sign in or create an account to unlock all {"\n"} features!
            </Text>        </View>
    );
    const { width } = Dimensions.get('window');

    return (
        <SafeAreaView style={styles.container}>
            <StatusBarComponent backgroundColor='black' barStyle='default' />

            <FlatList
                data={slides}
                horizontal
                pagingEnabled
                ref={flatListRef}
                showsHorizontalScrollIndicator={false}
                keyExtractor={item => item.id}
                renderItem={renderSlide}
                onScroll={updateCurrentIndex}
                scrollEventThrottle={16}
            />
            <View style={{
                position: 'absolute',
                bottom: 120,
                alignSelf: 'center',
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                width: '100%',
            }}>
                {slides.map((_, index) => (
                    <View
                        key={index}
                        style={[
                            styles.dot,
                            currentIndex === index ? styles.activeDot : styles.inactiveDot,
                        ]}
                    />
                ))}
            </View>
            <View style={{
                marginHorizontal: 20,
                flexDirection: "row",
                justifyContent: "space-between", // Even spacing between buttons
                alignItems: "center",
                marginBottom: 20
            }}>
                <CustomButton
                    title={'Sign Up'}
                    onPress={() => navigation.replace(ScreenNameEnum.SignUpScreen)}
                    buttonStyle={{
                        width: 150, // or adjust to your design,
                        height: 52
                    }}
                />
                <CustomButton
                    title={'Sign In'}
                    onPress={() => navigation.replace(ScreenNameEnum.LoginScreen)}
                    buttonStyle={{
                        width: 150, // or adjust to your design,
                        height: 52, backgroundColor: "white",
                        borderColor: "#FF3B30",
                        borderWidth: 1
                    }}
                    textStyle={{
                        color: "#FF3B30"
                    }}
                />
            </View>

        </SafeAreaView>
    );
};

export default OnboardingScreen;


