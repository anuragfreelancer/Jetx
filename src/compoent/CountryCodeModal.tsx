import React, { useState } from 'react';
import { Modal, View, Text, TouchableOpacity, FlatList, StyleSheet, TextInput } from 'react-native';
import { CountryCodes } from './constData';
import EmptyListComponent from './EmptyListComponent';
 
const CountryCodeModal = ({ visible, onSelect, onClose }:any) => {
  const [searchText, setSearchText] = useState('');

  // Search ko filter karne ka function
  const filteredCountries = CountryCodes.filter(item =>
    item.country.toLowerCase().includes(searchText.toLowerCase()) ||
    item.code.includes(searchText)
  );

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <Text allowFontScaling={false} style={styles.title}>Select Country Code</Text>

          {/* Search Input Field */}
          <TextInput
            style={styles.searchInput}
            placeholder="Search country or code"
            value={searchText}
            placeholderTextColor={"black"}
            onChangeText={setSearchText}
          />
          {/* Country List */}
          <FlatList
            data={filteredCountries}
            ListEmptyComponent={<EmptyListComponent message="No items Found"
              textStyle={{ color: "black" }}
            />}  
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.codeItem} onPress={() => onSelect(item)}>
                <Text allowFontScaling={false} style={styles.codeText}>
                  {item.flag} {item.country} ({item.code})
                </Text>
              </TouchableOpacity>
            )}
            keyExtractor={(item, index) => index.toString()}
            style={styles.codeList}
          />

          {/* Close Button */}
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text allowFontScaling={false} style={styles.closeText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: '85%',
    maxHeight: '80%',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    color: '#333',
  },
  searchInput: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 10,
    color:"black"
  },
  codeList: {
    maxHeight: 300,
  },
  codeItem: {
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  codeText: {
    fontSize: 16,
    color: '#333',
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: '#FF3B30',
    padding: 12,
    borderRadius: 10,
  },
  closeText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
  },
});

export default CountryCodeModal;
