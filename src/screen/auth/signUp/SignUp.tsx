import {
    View,
    Text,
    Image,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    SafeAreaView,
} from 'react-native';
import React from 'react';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import TextInputField from '../../../utils/TextInputField';
import StatusBarCompoent from '../../../compoent/StatusBarCompoent';
import imageIndex from '../../../assets/imageIndex';
import ResponsiveSize from '../../../utils/ResponsiveSize';
import { wp } from '../../../utils/Constant';
import CustomButton from '../../../compoent/CustomButton';
import ScreenNameEnum from '../../../routes/screenName.enum';
import useSignup from './useSinup';
import LoadingModal from '../../../utils/Loader';
import CountryCodeModal from '../../../compoent/CountryCodeModal';
import DropdownModal from '../../../compoent/DropdownModal';

export default function SignUp() {
    const {
        credentials,
        errors,
        isLoading,
        handleChange,
        handleSignup,
        navigation,
        selectedOption, setSelectedOption,
        dropOpen, setDropOpen,
        selectedCountryCode, setSelectedCountryCode,
        countyModal, setCountyModal,
        handleCountryCodeSelect
    } = useSignup()
    const injuryOptions = [
        { id: '1', label: 'No Injury' },
        { id: '2', label: 'Select Previous Injuries' },
        { id: '3', label: 'Beginner' }
      ];
    
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
            <StatusBarCompoent />
            {isLoading ? <LoadingModal /> : null}
            <ScrollView showsVerticalScrollIndicator={false} >
                <View
                    style={{
                        backgroundColor: '#FFF',
                        padding: 15,
                        flex: 1,
                        marginTop: hp(5)
                    }}>
                    <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>

                        <Image
                            source={imageIndex.appLogo}
                            style={{ height: 57, width: 176 }} resizeMode='contain'
                        />
                    </View>
                    <View style={{ marginTop: 22, alignItems: "center" }}>
                        <Text style={{
                            color: "black",
                            fontSize: 24,
                            fontWeight: "900"
                        }}>Create Your Account.</Text>

                    </View>
                    <View style={{ marginTop: ResponsiveSize.marginTop(25), paddingVertical: hp(2), }}>


                        <TextInputField
                            //  onChangeText={(value: string) => handleChange('email', value)} // Handles email input dynamically
                            placeholder={'Full Name '}
                            // text={credentials.email}
                            firstLogo={true}
                            img={imageIndex.Fideuser}
                        />
                        <TextInputField
                            //  onChangeText={(value: string) => handleChange('email', value)} // Handles email input dynamically
                            placeholder={'Email '}
                            // text={credentials.email}
                            firstLogo={true}
                            img={imageIndex.emai}
                        />
                        {errors.email ? <Text style={{ color: 'red', fontSize: 12, marginTop: 10 }}>{errors.email}</Text> : null}
                        <TextInputField
                            onChangeText={(value: string) => handleChange('mobile', value)} // Handles email input dynamically
                            text={credentials.mobile}
                            placeholder={'Phone'}
                            firstLogo={true}
                            showEye={false}
                            img={imageIndex.phone}
                            type="decimal-pad"
                        />
                        {errors.mobile ? <Text style={{ color: 'red', fontSize: 12, marginTop: 10 }}>{errors.mobile}</Text> : null}
                        <TextInputField
                            lable={"Password"}
                            placeholder="Password"
                            firstLogo={true}
                            showEye={true}
                            img={imageIndex.lock}
                        />
                        {errors.password ? <Text style={{ color: 'red', fontSize: 12, marginTop: 10 }}>{errors.password}</Text> : null}

                        <TextInputField
                            placeholder="City"
                            firstLogo={true}
                            showEye={false}
                            img={imageIndex.city}
                        />
                        <TextInputField
                            placeholder="Country"
                            firstLogo={true}
                            showEye={false}
                            img={imageIndex.country}
                        />
                        <TextInputField
                            placeholder="Password"
                            firstLogo={true}
                            showEye={false}
                            img={imageIndex.lock}
                        />
                    </View>
                    <CustomButton
                        title={'Sign up'}
                        onPress={() => navigation.navigate(ScreenNameEnum.LoginScreen)}
                        // onPress={() => handleSignup()}
                        buttonStyle={{ width: "100%", marginTop: 28 }}
                    />
                </View>
                <View
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginTop: 40,
                        alignSelf: 'center',
                        justifyContent: 'flex-end', // Change this to flex-end 
                        marginBottom: 20
                    }}>
                    <Text style={{ fontSize: 16, fontWeight: "600", lineHeight: 22, color: '#909090' }}>
                        Alrady have an account?{' '}
                    </Text>
                    <TouchableOpacity
                        onPress={() => navigation.navigate(ScreenNameEnum.LoginScreen)}

                    >
                        <Text style={Styles.text}>Login</Text>
                    </TouchableOpacity>
                </View>

            </ScrollView>
            <CountryCodeModal
                visible={countyModal}
                onSelect={handleCountryCodeSelect}
                onClose={() => setCountyModal(false)}
            />
            <DropdownModal
                visible={false}
                options={injuryOptions}
            />
        </SafeAreaView>
    );
}

const Styles = StyleSheet.create({
    text: {
        fontSize: 16,
        lineHeight: 24,
        fontWeight: '700',
        color: 'black',
        bottom: 2
    },
    btn: {
        alignSelf: 'center',
        backgroundColor: '#E8442E',
        height: 55,

        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 30,
        width: wp(90),
    },
});


