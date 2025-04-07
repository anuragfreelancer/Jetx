import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Image, SafeAreaView, ScrollView, ImageBackground } from "react-native";
import StatusBarComponent from "../../../compoent/StatusBarCompoent";
import CustomHeader from "../../../compoent/CustomHeader";
import imageIndex from "../../../assets/imageIndex";
import CustomButton from "../../../compoent/CustomButton";
 import useBookPayment from "./useBookPayment";
import ScreenNameEnum from "../../../routes/screenName.enum";
import styles from "./style";

const BookPayment = () => {
  const {
    isLoading,
    navigation,
    cardNumber, setCardNumber,
    validThruMonth, setValidThruMonth,
    cvv, setCvv,
    cardHolderName, setCardHolderName,
    validThruYear, setValidThruYear,
    validationMessages, setValidationMessages,
    handleSubmit
  } = useBookPayment()

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <StatusBarComponent />
      <CustomHeader imageSource={imageIndex.backorange} label="Payment" />
      <ScrollView style={styles.container1} showsVerticalScrollIndicator={false}>
      <TouchableOpacity style={styles.cardView}
            onPress={() => navigation.navigate(ScreenNameEnum.JetDetails)}
          >
            <ImageBackground source={imageIndex.fliteBag} style={styles.image} >
            </ImageBackground>
            <View style={styles.info}>
              <Text style={styles.title}>Gulfstream G650</Text>
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
                  <Text style={styles.text}>7,000 miles</Text>

                </View>
                <Text style={styles.price}>$15,000/hr</Text>

              </View>

            </View>
          </TouchableOpacity>
        <Text style={styles.sectionTitle}>Credit & Debit Cards</Text>
        <View style={styles.container}>
          <TouchableOpacity style={styles.card} activeOpacity={0.7}>
            <View style={styles.cardLeft}>
              <Image
                source={imageIndex.Rupespay}
                style={{ height: 34, width: 34 }}
                resizeMode="contain"
              />
              <Text style={styles.cardText}>  Axis Bank**** **** 8532</Text>
            </View>
            <Image source={imageIndex.radioButt} style={styles.radioButton} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.card} activeOpacity={0.7}>
            <View style={styles.cardLeft}>
              <Image
                source={imageIndex.visa}
                style={{ height: 34, width: 34 }}
                resizeMode="contain"
              />
              <Text style={styles.cardText}>  HDFC Bank ******** 8532</Text>
            </View>
            <Image source={imageIndex.radioButt} style={styles.radioButton} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.addNewCard}>
            <Image
              source={imageIndex.addPayment}
              style={{ height: 24, width: 24 }}
              resizeMode="contain"
            />
            <Text style={styles.addNewCardText}>Add New Card</Text>
          </TouchableOpacity>
        </View>

        {/* Card Number */}
        <Text style={[styles.sectionTitle, { marginTop: 18 }]}>Card Number</Text>
        <View style={{
          height: 55,
          borderColor: "F8F8F8",
          borderRadius: 15,
          paddingHorizontal: 10,
          backgroundColor: "#F8F8F8",
          justifyContent: "center",
        }}>
          <TextInput
            style={styles.cardName}
            placeholder="Enter 12 digit card number"
            keyboardType="numeric"
            placeholderTextColor="#979797"
            value={cardNumber}
            onChangeText={setCardNumber}
          />
        </View>
        {validationMessages.cardNumber ? (
          <Text style={{ color: 'red', marginLeft: 10 }}>{validationMessages.cardNumber}</Text>
        ) : null}

        {/* Valid Thru and CVV */}
        <View style={{ flexDirection: "row", alignItems: "center", marginTop: 18, marginBottom: 5 }}>
          <Text style={styles.sectionTitle}>Valid Thru</Text>
          <Text style={[styles.sectionTitle, { left: 100 }]}>CVV</Text>
        </View>
        <View style={styles.rowBetween}>
          <View style={{
             alignItems: "center", justifyContent: "center", backgroundColor: "#F8F8F8", flexDirection: "row", borderRadius: 10, marginBottom: 10, marginTop: 15
          }}>
            <TextInput
              editable={false}
              placeholder="Month"
              value={validThruMonth}
              onChangeText={setValidThruMonth}
            />
            <Image source={imageIndex.arrowDown} style={{ height: 17, width: 17, right: 3 }} resizeMode="contain" />
          </View>
          <View style={{ marginLeft: 12, alignItems: "center", justifyContent: "center", backgroundColor: "#F8F8F8", flexDirection: "row", borderRadius: 10, marginBottom: 10, marginTop: 15 }}>
            <TextInput
              editable={false}
              placeholder="Year"
              value={validThruYear}
              onChangeText={setValidThruYear}
            />
            <Image source={imageIndex.arrowDown} style={{ height: 17, width: 17, right: 3 }} resizeMode="contain" />
          </View>
          <View style={{ marginLeft: 12, alignItems: "center", justifyContent: "center", backgroundColor: "#F8F8F8", flexDirection: "row", borderRadius: 10, marginBottom: 10, marginTop: 15 }}>
            <TextInput
              editable={false}
              placeholder="CVV"
              value={cvv}
              onChangeText={setCvv}
            />
            <Image source={imageIndex.eye} style={{ height: 17, width: 17, right: 3 }} resizeMode="contain" />
          </View>
        </View>
        {validationMessages.validThru ? (
          <Text style={{ color: 'red', marginLeft: 10 }}>{validationMessages.validThru}</Text>
        ) : null}
        {validationMessages.cvv ? (
          <Text style={{ color: 'red', marginLeft: 10 }}>{validationMessages.cvv}</Text>
        ) : null}

        {/* Card Holder Name */}
        <Text style={[styles.sectionTitle, { marginTop: 18 }]}>Card Holder’s Name</Text>
        <View style={styles.inputView}>
          <TextInput
            style={styles.cardName}
            placeholder="Name on Card"
            placeholderTextColor="#979797"
            value={cardHolderName}
            onChangeText={setCardHolderName}
          />
        </View>
        {validationMessages.cardHolderName ? (
          <Text style={{ color: 'red', marginLeft: 10 }}>{validationMessages.cardHolderName}</Text>
        ) : null}
      </ScrollView>

      <View style={styles.butt}>
        <CustomButton
          title={'Book Now'}
           onPress={() =>       navigation.navigate(ScreenNameEnum.PaymentVerify)
          }
        />
      </View>
    </SafeAreaView>
  );
};

export default BookPayment;
