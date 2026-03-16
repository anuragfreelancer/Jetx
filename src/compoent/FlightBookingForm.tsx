import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  Platform,
  Modal,
  FlatList,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { SafeAreaView } from 'react-native-safe-area-context';
import StatusBarComponent from './StatusBarCompoent';
import imageIndex from '../assets/imageIndex';
import CustomHeader from './CustomHeader';

// Custom Dropdown Component (replace with your actual component)
const CustomDropdown = ({ 
  value, 
  onValueChange, 
  items, 
  placeholder = "Select...",
  style = {} 
}) => {
  const [isVisible, setIsVisible] = useState(false);

  const selectedItem = items.find(item => item.value === value);

  return (
    <View style={[styles.dropdownContainer, style]}>
      <TouchableOpacity
        style={styles.dropdownHeader}
        onPress={() => setIsVisible(true)}
      >
        <Text style={selectedItem ? styles.dropdownText : styles.dropdownPlaceholder}>
          {selectedItem ? selectedItem.label : placeholder}
        </Text>
        <Text style={styles.dropdownArrow}>▼</Text>
      </TouchableOpacity>

      <Modal
        visible={isVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setIsVisible(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay}
          onPress={() => setIsVisible(false)}
        >
          <View style={styles.modalContent}>
            <FlatList
              data={items}
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.dropdownItem,
                    item.value === value && styles.dropdownItemSelected
                  ]}
                  onPress={() => {
                    onValueChange(item.value);
                    setIsVisible(false);
                  }}
                >
                  <Text style={[
                    styles.dropdownItemText,
                    item.value === value && styles.dropdownItemTextSelected
                  ]}>
                    {item.label}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const FlightBookingForm = ({ onSubmit, initialData }) => {
  // Form state
  const [formData, setFormData] = useState({
    traveler: {
      id: '',
      dateOfBirth: new Date('1982-01-16'),
      name: {
        firstName: '',
        lastName: '',
      },
      gender: 'MALE',
      contact: {
        emailAddress: '',
        phones: [
          {
            deviceType: 'MOBILE',
            countryCallingCode: '34',
            number: '',
          },
        ],
      },
      documents: [
        {
          documentType: 'PASSPORT',
          birthPlace: '',
          issuanceLocation: '',
          issuanceDate: new Date('2015-04-14'),
          number: '',
          expiryDate: new Date('2030-04-14'),
          issuanceCountry: 'ES',
          validityCountry: 'ES',
          nationality: 'ES',
          holder: true,
        },
      ],
    },
  });

  // UI state
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showPassportIssuanceDatePicker, setShowPassportIssuanceDatePicker] = useState(false);
  const [showPassportExpiryDatePicker, setShowPassportExpiryDatePicker] = useState(false);
  const [currentDateField, setCurrentDateField] = useState('');
  const [errors, setErrors] = useState({});

  // Countries list
  const countries = [
    { value: 'ES', label: 'Spain' },
    { value: 'FR', label: 'France' },
    { value: 'DE', label: 'Germany' },
    { value: 'IT', label: 'Italy' },
    { value: 'GB', label: 'United Kingdom' },
    { value: 'US', label: 'United States' },
    { value: 'CA', label: 'Canada' },
    { value: 'AU', label: 'Australia' },
  ];

  // Document types
  const documentTypes = [
    { value: 'PASSPORT', label: 'Passport' },
    { value: 'NATIONAL_ID', label: 'National ID' },
    { value: 'DRIVING_LICENSE', label: 'Driving License' },
    { value: 'VISA', label: 'Visa' },
    { value: 'RESIDENCE_PERMIT', label: 'Residence Permit' },
  ];

  // Genders
  const genders = [
    { value: 'MALE', label: 'Male' },
    { value: 'FEMALE', label: 'Female' },
    { value: 'OTHER', label: 'Other' },
  ];

  
  // Initialize form with data if provided
  useEffect(() => {
    if (initialData) {
      const processedData = {
        traveler: {
          ...initialData.traveler,
          dateOfBirth: new Date(initialData.traveler.dateOfBirth),
          documents: initialData.traveler.documents.map(doc => ({
            ...doc,
            issuanceDate: new Date(doc.issuanceDate),
            expiryDate: new Date(doc.expiryDate),
          })),
        },
      };
      setFormData(processedData);
    }
  }, [initialData]);

  // Handle text input changes
  const handleInputChange = (path, value) => {
    setFormData(prev => {
      const keys = path.split('.');
      const lastKey = keys.pop();
      const target = keys.reduce((obj, key) => obj[key], prev);
      target[lastKey] = value;
      return { ...prev };
    });
  };

  // Handle date changes
  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    setShowPassportIssuanceDatePicker(false);
    setShowPassportExpiryDatePicker(false);

    if (selectedDate) {
      handleInputChange(currentDateField, selectedDate);
    }
  };

  // Format date for display
  const formatDate = (date) => {
    if (!date) return '';
    return date.toLocaleDateString('en-CA'); // YYYY-MM-DD format
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    // Required fields validation
    if (!formData.traveler.name.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    if (!formData.traveler.name.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    if (!formData.traveler.contact.emailAddress.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.traveler.contact.emailAddress)) {
      newErrors.email = 'Email is invalid';
    }
    if (!formData.traveler.contact.phones[0].number.trim()) {
      newErrors.phone = 'Phone number is required';
    }

    // Document validation
    const document = formData.traveler.documents[0];
    if (!document.number.trim()) {
      newErrors.passportNumber = 'Passport number is required';
    }
    if (!document.birthPlace.trim()) {
      newErrors.birthPlace = 'Birth place is required';
    }
    if (!document.issuanceLocation.trim()) {
      newErrors.issuanceLocation = 'Issuance location is required';
    }

    // Date validation
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Compare dates only
    
    if (formData.traveler.dateOfBirth > today) {
      newErrors.dateOfBirth = 'Date of birth cannot be in the future';
    }
    
    const expiryDate = new Date(document.expiryDate);
    expiryDate.setHours(0, 0, 0, 0);
    if (expiryDate <= today) {
      newErrors.passportExpiry = 'Passport must be valid (expiry date > today)';
    }
    
    const issuanceDate = new Date(document.issuanceDate);
    issuanceDate.setHours(0, 0, 0, 0);
    if (issuanceDate > today) {
      newErrors.passportIssuance = 'Issuance date cannot be in the future';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = () => {
    if (validateForm()) {
      // Convert dates to ISO string for API
      const submitData = {
        traveler: {
          ...formData.traveler,
          dateOfBirth: formatDate(formData.traveler.dateOfBirth),
          documents: formData.traveler.documents.map(doc => ({
            ...doc,
            issuanceDate: formatDate(doc.issuanceDate),
            expiryDate: formatDate(doc.expiryDate),
          })),
        },
      };
      
      onSubmit(submitData);
    } else {
      Alert.alert('Validation Error', 'Please check all required fields');
    }
  };

  // Render date picker
  const renderDatePicker = () => {
    let dateValue;
    switch (currentDateField) {
      case 'traveler.dateOfBirth':
        dateValue = formData.traveler.dateOfBirth;
        break;
      case 'traveler.documents.0.issuanceDate':
        dateValue = formData.traveler.documents[0].issuanceDate;
        break;
      case 'traveler.documents.0.expiryDate':
        dateValue = formData.traveler.documents[0].expiryDate;
        break;
      default:
        dateValue = new Date();
    }

    return (
      <DateTimePicker
        value={dateValue}
        mode="date"
        display={Platform.OS === 'ios' ? 'spinner' : 'default'}
        onChange={handleDateChange}
        maximumDate={currentDateField === 'traveler.dateOfBirth' ? new Date() : undefined}
        minimumDate={currentDateField === 'traveler.documents.0.expiryDate' ? new Date() : undefined}
      />
    );
  };

  return (
    <SafeAreaView style={{
      flex:1 ,
      backgroundColor:"white"
    }}>
            <StatusBarComponent />
      <CustomHeader imageSource={imageIndex.backorange} label="Personal Information" />

    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
 
      {/* Name */}
      <View style={styles.row}>
        <View style={[styles.inputContainer, { flex: 1, marginRight: 8 }]}>
          <Text style={styles.label}>First Name *</Text>
          <TextInput
            style={[styles.input, errors.firstName && styles.inputError]}
            value={formData.traveler.name.firstName}
            onChangeText={(value) => handleInputChange('traveler.name.firstName', value)}
            placeholder="Enter first name"
          />
          {errors.firstName && <Text style={styles.errorText}>{errors.firstName}</Text>}
        </View>

        <View style={[styles.inputContainer, { flex: 1, marginLeft: 8 }]}>
          <Text style={styles.label}>Last Name *</Text>
          <TextInput
            style={[styles.input, errors.lastName && styles.inputError]}
            value={formData.traveler.name.lastName}
            onChangeText={(value) => handleInputChange('traveler.name.lastName', value)}
            placeholder="Enter last name"
          />
          {errors.lastName && <Text style={styles.errorText}>{errors.lastName}</Text>}
        </View>
      </View>

      {/* Date of Birth */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Date of Birth *</Text>
        <TouchableOpacity
          style={[styles.input, styles.dateInput, errors.dateOfBirth && styles.inputError]}
          onPress={() => {
            setCurrentDateField('traveler.dateOfBirth');
            setShowDatePicker(true);
          }}
        >
          <Text style={styles.dateText}>{formatDate(formData.traveler.dateOfBirth)}</Text>
        </TouchableOpacity>
        {errors.dateOfBirth && <Text style={styles.errorText}>{errors.dateOfBirth}</Text>}
      </View>
      {(showDatePicker || showPassportIssuanceDatePicker || showPassportExpiryDatePicker) && renderDatePicker()}

      {/* Gender */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Gender *</Text>
        <CustomDropdown
          value={formData.traveler.gender}
          onValueChange={(value) => handleInputChange('traveler.gender', value)}
          items={genders}
          placeholder="Select gender"
        />
      </View>

      <Text style={styles.sectionTitle}>Contact Information</Text>

      {/* Email */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Email Address *</Text>
        <TextInput
          style={[styles.input, errors.email && styles.inputError]}
          value={formData.traveler.contact.emailAddress}
          onChangeText={(value) => handleInputChange('traveler.contact.emailAddress', value)}
          placeholder="Enter email address"
          keyboardType="email-address"
          autoCapitalize="none"
        />
        {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
      </View>

      {/* Phone */}
      <View style={styles.row}>
        <View style={[styles.inputContainer, { flex: 0.3 }]}>
          <Text style={styles.label}>Country Code</Text>
          <TextInput
            style={styles.input}
            value={formData.traveler.contact.phones[0].countryCallingCode}
            onChangeText={(value) => handleInputChange('traveler.contact.phones.0.countryCallingCode', value)}
            placeholder="Code"
            keyboardType="phone-pad"
          />
        </View>

        <View style={[styles.inputContainer, { flex: 0.7, marginLeft: 8 }]}>
          <Text style={styles.label}>Phone Number *</Text>
          <TextInput
            style={[styles.input, errors.phone && styles.inputError]}
            value={formData.traveler.contact.phones[0].number}
            onChangeText={(value) => handleInputChange('traveler.contact.phones.0.number', value)}
            placeholder="Enter phone number"
            keyboardType="phone-pad"
          />
          {errors.phone && <Text style={styles.errorText}>{errors.phone}</Text>}
        </View>
      </View>

      <Text style={styles.sectionTitle}>Passport Information</Text>

      {/* Document Type */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Document Type *</Text>
        <CustomDropdown
          value={formData.traveler.documents[0].documentType}
          onValueChange={(value) => handleInputChange('traveler.documents.0.documentType', value)}
          items={documentTypes}
          placeholder="Select document type"
        />
      </View>

      {/* Passport Number */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Passport Number *</Text>
        <TextInput
          style={[styles.input, errors.passportNumber && styles.inputError]}
          value={formData.traveler.documents[0].number}
          onChangeText={(value) => handleInputChange('traveler.documents.0.number', value)}
          placeholder="Enter passport number"
          autoCapitalize="characters"
        />
        {errors.passportNumber && <Text style={styles.errorText}>{errors.passportNumber}</Text>}
      </View>

      {/* Birth Place and Issuance Location */}
      <View style={styles.row}>
        <View style={[styles.inputContainer, { flex: 1, marginRight: 8 }]}>
          <Text style={styles.label}>Birth Place *</Text>
          <TextInput
            style={[styles.input, errors.birthPlace && styles.inputError]}
            value={formData.traveler.documents[0].birthPlace}
            onChangeText={(value) => handleInputChange('traveler.documents.0.birthPlace', value)}
            placeholder="City of birth"
          />
          {errors.birthPlace && <Text style={styles.errorText}>{errors.birthPlace}</Text>}
        </View>

        <View style={[styles.inputContainer, { flex: 1, marginLeft: 8 }]}>
          <Text style={styles.label}>Issuance Location *</Text>
          <TextInput
            style={[styles.input, errors.issuanceLocation && styles.inputError]}
            value={formData.traveler.documents[0].issuanceLocation}
            onChangeText={(value) => handleInputChange('traveler.documents.0.issuanceLocation', value)}
            placeholder="City of issuance"
          />
          {errors.issuanceLocation && <Text style={styles.errorText}>{errors.issuanceLocation}</Text>}
        </View>
      </View>

      {/* Passport Dates */}
      <View style={styles.row}>
        <View style={[styles.inputContainer, { flex: 1, marginRight: 8 }]}>
          <Text style={styles.label}>Issuance Date *</Text>
          <TouchableOpacity
            style={[styles.input, styles.dateInput, errors.passportIssuance && styles.inputError]}
            onPress={() => {
              setCurrentDateField('traveler.documents.0.issuanceDate');
              setShowPassportIssuanceDatePicker(true);
            }}
          >
            <Text style={styles.dateText}>{formatDate(formData.traveler.documents[0].issuanceDate)}</Text>
          </TouchableOpacity>
          {errors.passportIssuance && <Text style={styles.errorText}>{errors.passportIssuance}</Text>}
        </View>

        <View style={[styles.inputContainer, { flex: 1, marginLeft: 8 }]}>
          <Text style={styles.label}>Expiry Date *</Text>
          <TouchableOpacity
            style={[styles.input, styles.dateInput, errors.passportExpiry && styles.inputError]}
            onPress={() => {
              setCurrentDateField('traveler.documents.0.expiryDate');
              setShowPassportExpiryDatePicker(true);
            }}
          >
            <Text style={styles.dateText}>{formatDate(formData.traveler.documents[0].expiryDate)}</Text>
          </TouchableOpacity>
          {errors.passportExpiry && <Text style={styles.errorText}>{errors.passportExpiry}</Text>}
        </View>
      </View>

      {/* Nationality and Countries */}
      <View style={styles.row}>
        <View style={[styles.inputContainer, { flex: 1, marginRight: 8 }]}>
          <Text style={styles.label}>Nationality *</Text>
          <CustomDropdown
            value={formData.traveler.documents[0].nationality}
            onValueChange={(value) => handleInputChange('traveler.documents.0.nationality', value)}
            items={countries}
            placeholder="Select nationality"
          />
        </View>

        <View style={[styles.inputContainer, { flex: 1, marginLeft: 8 }]}>
          <Text style={styles.label}>Issuance Country *</Text>
          <CustomDropdown
            value={formData.traveler.documents[0].issuanceCountry}
            onValueChange={(value) => handleInputChange('traveler.documents.0.issuanceCountry', value)}
            items={countries}
            placeholder="Select issuance country"
          />
        </View>
      </View>

      {/* Submit Button */}
      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>Complete Booking</Text>
      </TouchableOpacity>

      {/* Date Pickers */}
    </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 16,
    color: '#333',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 6,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
    minHeight: 50,
  },
  dateInput: {
    justifyContent: 'center',
  },
  dateText: {
    fontSize: 16,
    color: '#333',
  },
  inputError: {
    borderColor: '#FF3B30',
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 12,
    marginTop: 4,
  },
  // Custom Dropdown Styles
  dropdownContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  dropdownHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    minHeight: 50,
  },
  dropdownText: {
    fontSize: 16,
    color: '#333',
  },
  dropdownPlaceholder: {
    fontSize: 16,
    color: '#999',
  },
  dropdownArrow: {
    fontSize: 12,
    color: '#666',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 8,
    maxHeight: 300,
    width: '80%',
  },
  dropdownItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  dropdownItemSelected: {
    backgroundColor: '#FF3B30',
  },
  dropdownItemText: {
    fontSize: 16,
    color: '#333',
  },
  dropdownItemTextSelected: {
    color: '#fff',
    fontWeight: '500',
  },
  submitButton: {
    backgroundColor: '#FF3B30',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 40,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default FlightBookingForm;