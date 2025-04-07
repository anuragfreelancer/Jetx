import React from "react";
import { View, Text, ScrollView,   Image } from "react-native";
   import imageIndex from '../../../assets/imageIndex'
import StatusBarComponent from "../../../compoent/StatusBarCompoent";
import CustomHeader from "../../../compoent/CustomHeader";
const Notification = () => {
 
  const notifications = [
    {
      date: "Today",
      data: [
        {
          icon: imageIndex.filiteNotf,
          title: "Air tour has been processed",
          subtitle: "Airfield: Bychye Polye, July 30th",
        },
      ],
    },
    {
      date: "November 16, 2027",
      data: [
        {
            icon: imageIndex.filiteNotf,
            title: "Refund issued",
          subtitle: "Airfield: Bychye Polye, November 16",
        },
        {
            icon: imageIndex.filiteNotf,
            title: "Flight for November 16 canceled",
          subtitle: "Inclement weather",
        },
      ],
    },
    {
      date: "November 14, 2027",
      data: [
        {
            icon: imageIndex.filiteNotf,
            title: "Air tour has been processed",
          subtitle: "Airfield: Bychye Polye, November 16",
        },
        {
            icon: imageIndex.filiteNotf,
            title: "Welcome to Flights ✈️",
          subtitle: "Enjoy your flights and have a great experience!",
        },
      ],
    },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: "#fff",  }}>
    <StatusBarComponent/>
    <CustomHeader imageSource={imageIndex.backorange} label='Notification' />
       <ScrollView contentContainerStyle={{ paddingHorizontal: 20 ,marginTop:30 }} showsVerticalScrollIndicator={false}>
        {notifications?.map((section, index) => (
          <View key={index} style={{ marginBottom: 30 }}>
            <Text style={{ color: "#667085", fontWeight: "700", marginBottom: 10,fontSize:14 }}>
              {section.date}
            </Text>
            {section.data.map((item, i) => (
              <View
                key={i}
                style={{
                  backgroundColor: "#f8f8f8",
                  borderRadius: 12,
                  padding: 15,
                   flexDirection: "row",
                  alignItems: "center",
                  marginBottom:15
                }}
              >
                <Image
                  source={item.icon}
                  style={{ width: 40, height: 40, marginRight: 15 }}
                />
                <View>
                  <Text style={{ fontWeight: "500", marginBottom: 5 ,color:"#1D2939",fontSize:16}}>{item.title}</Text>
                  <Text style={{ color: "#667085",fontSize:12,fontWeight:"400"}}>{item.subtitle}</Text>
                </View>
              </View>
            ))}
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

export default Notification;
