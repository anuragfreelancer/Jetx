import React from "react";
import { View, Text, TouchableOpacity, Modal, StyleSheet, Image } from "react-native";
import imageIndex from "../assets/imageIndex";

const LogoutModal = ({ isVisible, close, onSumbit }: any) => {
  return (
    <Modal
      transparent={true}
      animationType="fade"
      visible={isVisible}
      onRequestClose={close}
    >
      <TouchableOpacity 
        style={styles.modalOverlay} 
        activeOpacity={1} 
        onPress={close} // Close modal when tapping outside
      >
        <View style={styles.modalContent}>
          {/* Close Button */}
          <TouchableOpacity onPress={close}  >
            <Image source={imageIndex.closeImg} style={{ height: 30, width: 30 }} />
          </TouchableOpacity>

          <Text style={styles.title}>Log Out?</Text>
          <Text style={styles.subtitle}>Are you sure want to log out?</Text>

          <TouchableOpacity style={styles.logoutButton} onPress={onSumbit}>
            <Text style={styles.logoutText}>Log Out</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 28,
    width: 300,
   },
  closeButton: {
    alignSelf: "flex-end",
    padding: 10,
  },
  title: {
    fontSize: 23,
    fontWeight: "700",
    color: "rgba(0, 0, 0, 1)",
    lineHeight: 36,
    textAlign:"center"

  },
  subtitle: {
    fontSize: 16,
    color: "rgba(157, 178, 191, 1)",
    marginBottom: 20,
    lineHeight: 24,
    textAlign:"center",
    marginTop: 8,
  },
  logoutButton: {
    backgroundColor: "black",
    paddingVertical: 12,
    paddingHorizontal: 55,
    borderRadius: 15,
    marginBottom: 10,
    marginTop: 16,
    marginHorizontal:20
  },
  logoutText: {
    color: "rgba(255, 255, 255, 1)",
    fontSize: 13,
    fontWeight: "600",
    lineHeight: 18,
    textAlign:"center"
  },
});

export default LogoutModal;
