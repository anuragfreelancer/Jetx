import React from "react";
import { View, Text, TouchableOpacity, Modal, StyleSheet, Image } from "react-native";
import imageIndex from "../assets/imageIndex";

interface DeleteProfileModalProps {
  isVisible: boolean;
  onClose: () => void;
  onYes: () => void;
  onNo: () => void;
}

const DeleteProfileModal = ({ isVisible, onClose, onYes, onNo }: DeleteProfileModalProps) => {
  return (
    <Modal
      transparent
      animationType="fade"
      visible={isVisible}
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <View style={styles.content} onStartShouldSetResponder={() => true}>
          <TouchableOpacity style={styles.closeWrap} onPress={onClose}>
            <Image source={imageIndex.closeImg} style={styles.closeImg} />
          </TouchableOpacity>

          <Text style={styles.title}>Delete Profile?</Text>
          <Text style={styles.subtitle}>
            Are you sure you want to delete your profile? This action cannot be undone.
          </Text>

          <View style={styles.buttonsRow}>
            <TouchableOpacity style={styles.noButton} onPress={onNo}>
              <Text style={styles.noText}>No</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.yesButton} onPress={onYes}>
              <Text style={styles.yesText}>Yes</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    backgroundColor: "#fff",
    padding: 24,
    borderRadius: 28,
    width: 320,
  },
  closeWrap: {
    alignSelf: "flex-end",
    padding: 4,
  },
  closeImg: {
    height: 30,
    width: 30,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "rgba(0, 0, 0, 1)",
    lineHeight: 32,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 15,
    color: "rgba(157, 178, 191, 1)",
    lineHeight: 22,
    textAlign: "center",
    marginTop: 10,
    marginBottom: 24,
  },
  buttonsRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 16,
  },
  noButton: {
    backgroundColor: "rgba(157, 178, 191, 0.25)",
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 15,
  },
  noText: {
    color: "rgba(0, 0, 0, 0.8)",
    fontSize: 15,
    fontWeight: "600",
  },
  yesButton: {
    backgroundColor: "black",
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 15,
  },
  yesText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
  },
});

export default DeleteProfileModal;
