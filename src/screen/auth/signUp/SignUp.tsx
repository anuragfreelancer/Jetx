import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
 } from 'react-native';
import React from 'react';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import TextInputField from '../../../utils/TextInputField';
import StatusBarCompoent from '../../../compoent/StatusBarCompoent';
import imageIndex from '../../../assets/imageIndex';
import ResponsiveSize from '../../../utils/ResponsiveSize';
 import CustomButton from '../../../compoent/CustomButton';
import ScreenNameEnum from '../../../routes/screenName.enum';
 import LoadingModal from '../../../utils/Loader';
import CountryCodeModal from '../../../compoent/CountryCodeModal';
 import useSignup from './useSinup';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SignUp() {
  const {
    credentials,
    errors,
    isLoading,
    handleChange,
    handleSignup,
    navigation,
    selectedOption,
    setSelectedOption,
    dropOpen,
    setDropOpen,
    selectedCountryCode,
    setSelectedCountryCode,
    countyModal,
    setCountyModal,
    handleCountryCodeSelect,
  } = useSignup();

 

  return (
    <SafeAreaView style={styles.container}>
      <StatusBarCompoent />
       <LoadingModal visible={isLoading}/>

      
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.content}>
          {/* Header Section */}
          <View style={styles.header}>
            <Image
              source={imageIndex.appLogo}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>

          <View style={styles.titleContainer}>
            <Text style={styles.title}>Create Your Account</Text>
          </View>

          {/* Form Section */}
          <View style={styles.formContainer}>
            {/* Full Name */}
            <TextInputField
              onChangeText={(value: string) => handleChange('fullName', value)}
              placeholder="Full Name"
              value={credentials.fullName}
              firstLogo={true}
              img={imageIndex.Fideuser}
            />
            {errors.fullName && (
              <Text style={styles.errorText}>{errors.fullName}</Text>
            )}

            {/* Email */}
            <TextInputField
              onChangeText={(value: string) => handleChange('email', value)}
              placeholder="Email"
              value={credentials.email}
              firstLogo={true}
              img={imageIndex.emai}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            {errors.email && (
              <Text style={styles.errorText}>{errors.email}</Text>
            )}

            {/* Phone with Country Code */}
            <View style={styles.phoneContainer}>
              <TouchableOpacity 
                style={styles.countryCodeButton}
                onPress={() => setCountyModal(true)}
              >
                <Text style={styles.countryCodeText}>{selectedCountryCode}</Text>
              </TouchableOpacity>
              <View style={styles.phoneInput}>
                <TextInputField
                  onChangeText={(value: string) => handleChange('mobile', value)}
                  value={credentials.mobile}
                  placeholder="Phone Number"
                  firstLogo={false}
                  showEye={false}
                  type="phone-pad"
                />
              </View>
            </View>
            {errors.mobile && (
              <Text style={styles.errorText}>{errors.mobile}</Text>
            )}

            {/* Password */}
            <TextInputField
              onChangeText={(value: string) => handleChange('password', value)}
              placeholder="Password"
              value={credentials.password}
              firstLogo={true}
              showEye={true}
              img={imageIndex.lock}
              secureTextEntry
            />
            {errors.password && (
              <Text style={styles.errorText}>{errors.password}</Text>
            )}

            {/* City */}
            {/* <TextInputField
              onChangeText={(value: string) => handleChange('city', value)}
              placeholder="City"
              value={credentials.city}
              firstLogo={true}
              showEye={false}
              img={imageIndex.city}
            /> */}

          
 
          
          </View>

          {/* Sign Up Button */}
          <CustomButton
            title="Sign up"
            onPress={handleSignup}
            buttonStyle={styles.signupButton}
            disabled={isLoading}
          />

          {/* Login Redirect */}
          <View style={styles.loginRedirect}>
            <Text style={styles.redirectText}>
              Already have an account?{' '}
            </Text>
            <TouchableOpacity
              onPress={() => navigation.navigate(ScreenNameEnum.LoginScreen)}
            >
              <Text style={styles.loginText}>Login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Modals */}
      <CountryCodeModal
        visible={countyModal}
        onSelect={handleCountryCodeSelect}
        onClose={() => setCountyModal(false)}
      />
{/*       
      <DropdownModal
        visible={dropOpen}
        options={injuryOptions}
        onSelect={handleOptionSelect}
        onClose={() => setDropOpen(false)}
        selectedValue={selectedOption}
      /> */}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    backgroundColor: '#FFF',
    padding: 15,
    flex: 1,
    marginTop: hp(5),
  },
  header: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  logo: {
    height: 59,
    width: 200,
  },
  titleContainer: {
    marginTop: 22,
    alignItems: 'center',
  },
  title: {
    color: 'black',
    fontSize: 24,
    fontWeight: '900',
  },
  formContainer: {
    marginTop: ResponsiveSize.marginTop(25),
    paddingVertical: hp(2),
  },
  phoneContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  countryCodeButton: {
    padding: 15,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  countryCodeText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'black',
  },
  phoneInput: {
    flex: 1,
  },
  dropdownTrigger: {
    padding: 15,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    marginTop: 10,
  },
  dropdownText: {
    fontSize: 16,
    color: 'black',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 5,
    marginLeft: 5,
  },
  signupButton: {
    width: '100%',
   },
  loginRedirect: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 40,
    alignSelf: 'center',
    justifyContent: 'flex-end',
    marginBottom: 20,
  },
  redirectText: {
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 22,
    color: '#909090',
  },
  loginText: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '700',
    color: 'black',
  },
});