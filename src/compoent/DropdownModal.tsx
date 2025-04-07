import React, { useState, useMemo } from "react";
import {
  View,
  FlatList,
  TouchableOpacity,
  Text,
  StyleSheet,
  Modal,
  TextInput,
  Pressable,
} from "react-native";
import EmptyListComponent from "./EmptyListComponent";

interface DropdownModalProps {
  visible: boolean;
  options: any[];
  onClose: () => void;
  onSelect: (item: string) => void;
}

const DropdownModal: React.FC<DropdownModalProps> = ({ visible, options, onClose, onSelect }) => {
  const [searchText, setSearchText] = useState("");

  const filteredOptions = useMemo(() => {
    return options.filter((item) => {
      const value = item?.team_name || item?.name || item?.position_name || item?.load_type || "";
      return value.toLowerCase().includes(searchText.toLowerCase());
    });
  }, [searchText, options]);

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        {/* Background Pressable */}
        <Pressable style={styles.backgroundTouchable} onPress={onClose} />

        <View style={styles.modalContainer}>
          <View style={styles.handle} />

          <TextInput
            style={styles.searchInput}
            placeholder="Search..."
            value={searchText}
            onChangeText={setSearchText}
            placeholderTextColor="#888"
          />

          <FlatList
            data={filteredOptions}
            keyExtractor={(item, index) => index.toString()}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={<EmptyListComponent message="No Results Found" />}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.option}
                onPress={() => {
                  onSelect(item);
                  onClose();
                }}
              >
                <Text style={styles.optionText}>
                  {item?.team_name || item?.name || item?.position_name || item?.load_type}
                </Text>
              </TouchableOpacity>
            )}
          />

          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  backgroundTouchable: {
    flex: 1,
  },
  modalContainer: {
    backgroundColor: "white",
    paddingVertical: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 15,
    maxHeight: "80%",
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: "#ccc",
    borderRadius: 10,
    alignSelf: "center",
    marginBottom: 10,
  },
  searchInput: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
     color: "black",
   },
  option: {
    paddingVertical: 10,
    borderBottomWidth: 0.8,
    borderColor: "#9DB2BF",
    alignItems: "center",
  },
  optionText: {
    fontSize: 14,
    color: "black",
    fontWeight: "500",
    textTransform: "uppercase",
  },
  closeButton: {
    marginTop: 15,
    padding: 13,
    backgroundColor: "#FF3B30",
    borderRadius: 15,
    alignItems: "center",
  },
  closeButtonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 16,
  },
});

export default DropdownModal;
