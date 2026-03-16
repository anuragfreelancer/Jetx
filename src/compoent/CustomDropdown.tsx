import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  StyleSheet,
  TouchableWithoutFeedback,
} from "react-native";

interface DropdownOption {
  label: string;
  value: any;
}

interface Props {
  label?: string;
  options: DropdownOption[];
  selectedValue: any;
  onSelect: (item: DropdownOption) => void;
  placeholder?: string;
}

const CustomDropdown = ({
  label,
  options,
  selectedValue,
  onSelect,
  placeholder = "Select...",
}: Props) => {
  const [visible, setVisible] = useState(false);

  const selectedOption = options.find((o) => o.value === selectedValue);

  const handleSelect = (item: DropdownOption) => {
    onSelect(item);
    setVisible(false);
  };
  console.log("label",options)

  return (
    <View style={{ marginTop: 5 }}>
      {label && <Text style={styles.label}>{label}</Text>}

      {/* Trigger Button */}
      <TouchableOpacity style={styles.dropdown} onPress={() => setVisible(true)}>
        <Text style={selectedOption ? styles.selectedText : styles.placeholderText}>
          {selectedOption ? selectedOption.label : placeholder}
        </Text>
        <Text style={styles.arrow}>▼</Text>
      </TouchableOpacity>

      {/* Modal */}
      <Modal
        transparent
        visible={visible}
        animationType="fade"
        onRequestClose={() => setVisible(false)}
      >
        {/* Outer touchable closes modal when tapping outside */}
        <TouchableWithoutFeedback onPress={() => setVisible(false)}>
          <View style={styles.modalOverlay}>
            {/* Inner view stops propagation so tapping list doesn't close modal */}
            <TouchableWithoutFeedback onPress={() => {}}>
              <View style={styles.modalContent}>
                {/* Header */}
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Select Aircraft</Text>
                  <TouchableOpacity onPress={() => setVisible(false)}>
                    <Text style={styles.closeBtn}>✕</Text>
                  </TouchableOpacity>
                </View>

                {options.length === 0 ? (
                  <View style={styles.emptyBox}>
                    <Text style={styles.emptyText}>No aircraft available</Text>
                  </View>
                ) : (
                  <FlatList
                    data={options}
                    keyExtractor={(item) => String(item.value)}
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        style={[
                          styles.item,
                          item.value === selectedValue && styles.itemSelected,
                        ]}
                        onPress={() => handleSelect(item)}
                        activeOpacity={0.7}
                      >
                        <Text
                          style={[
                            styles.itemText,
                            item.value === selectedValue && styles.itemTextSelected,
                          ]}
                        >
                          {item.label}
                        </Text>
                      
                      </TouchableOpacity>
                    )}
                  />
                )}
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

export default CustomDropdown;

const styles = StyleSheet.create({
  label: { fontSize: 14, marginBottom: 4, fontWeight: "bold" },
  dropdown: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    backgroundColor: "#fff",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  selectedText: { fontSize: 15, color: "#000", flex: 1 },
  placeholderText: { fontSize: 15, color: "#999", flex: 1 },
  arrow: { fontSize: 12, color: "#666", marginLeft: 8 },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 12,
    maxHeight: 400,
    overflow: "hidden",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  modalTitle: { fontSize: 16, fontWeight: "bold", color: "#222" },
  closeBtn: { fontSize: 20, color: "#666", paddingHorizontal: 5 },
  item: {
    padding: 15,
    borderBottomWidth: 0.5,
    borderBottomColor: "#eee",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  itemSelected: { backgroundColor: "#e8f0fe" },
  itemText: { fontSize: 15, color: "#333", flex: 1 },
  itemTextSelected: { color: "#007bff", fontWeight: "bold" },
  checkmark: { color: "#007bff", fontSize: 16, fontWeight: "bold" },
  emptyBox: { padding: 30, alignItems: "center" },
  emptyText: { color: "#999", fontSize: 15 },
});