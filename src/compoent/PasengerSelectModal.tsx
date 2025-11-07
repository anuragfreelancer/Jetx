import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  ScrollView,
} from 'react-native';

interface PassengerModalProps {
  visible: boolean;
  onClose: () => void;
  passengerCount: PassengerCount;
  onPassengerChange: (count: PassengerCount) => void;
}

const PassengerModal: React.FC<PassengerModalProps> = ({
  visible,
  onClose,
  passengerCount,
  onPassengerChange,
}) => {
  const passengerTypes: PassengerType[] = [
    {
      type: 'adults',
      label: 'Adults',
      description: '12+ years',
      min: 1,
      max: 9,
    },
    {
      type: 'children',
      label: 'Children',
      description: '2-12 years',
      min: 0,
      max: 8,
    },
    {
      type: 'infants',
      label: 'Infants',
      description: 'Under 2 years',
      min: 0,
      max: 5,
    },
  ];

  const updatePassengerCount = (type: keyof PassengerCount, value: number) => {
    const newCount = { ...passengerCount };
    newCount[type] = Math.max(
      passengerTypes.find(pt => pt.type === type)?.min || 0,
      Math.min(
        passengerTypes.find(pt => pt.type === type)?.max || 9,
        value
      )
    );
    
    // Ensure at least 1 adult is selected
    if (type === 'adults' && value === 0) {
      newCount.adults = 1;
    }
    
    onPassengerChange(newCount);
  };

  const getTotalPassengers = (): number => {
    return passengerCount.adults + passengerCount.children + passengerCount.infants;
  };

  const isDecrementDisabled = (type: keyof PassengerCount): boolean => {
    if (type === 'adults') return passengerCount[type] <= 1;
    return passengerCount[type] <= 0;
  };

  const isIncrementDisabled = (type: keyof PassengerCount): boolean => {
    const max = passengerTypes.find(pt => pt.type === type)?.max || 0;
    return passengerCount[type] >= max;
  };

  const canAddMoreInfants = (): boolean => {
    return passengerCount.infants < passengerCount.adults;
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          {/* Header */}
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Select Passengers</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Passenger Selection */}
          <ScrollView style={styles.passengerList}>
            {passengerTypes.map((passengerType) => (
              <View key={passengerType.type} style={styles.passengerRow}>
                <View style={styles.passengerInfo}>
                  <Text style={styles.passengerLabel}>{passengerType.label}</Text>
                  <Text style={styles.passengerDescription}>
                    {passengerType.description}
                  </Text>
                </View>
                
                <View style={styles.counterContainer}>
                  <TouchableOpacity
                    style={[
                      styles.counterButton,
                      isDecrementDisabled(passengerType.type) && styles.disabledButton,
                    ]}
                    onPress={() => updatePassengerCount(passengerType.type, passengerCount[passengerType.type] - 1)}
                    disabled={isDecrementDisabled(passengerType.type)}
                  >
                    <Text style={[
                      styles.counterButtonText,
                      isDecrementDisabled(passengerType.type) && styles.disabledButtonText,
                    ]}>-</Text>
                  </TouchableOpacity>
                  
                  <Text style={styles.countText}>
                    {passengerCount[passengerType.type]}
                  </Text>
                  
                  <TouchableOpacity
                    style={[
                      styles.counterButton,
                      (isIncrementDisabled(passengerType.type) || 
                       (passengerType.type === 'infants' && !canAddMoreInfants())) && 
                      styles.disabledButton,
                    ]}
                    onPress={() => updatePassengerCount(passengerType.type, passengerCount[passengerType.type] + 1)}
                    disabled={
                      isIncrementDisabled(passengerType.type) || 
                      (passengerType.type === 'infants' && !canAddMoreInfants())
                    }
                  >
                    <Text style={[
                      styles.counterButtonText,
                      (isIncrementDisabled(passengerType.type) || 
                       (passengerType.type === 'infants' && !canAddMoreInfants())) && 
                      styles.disabledButtonText,
                    ]}>+</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </ScrollView>

          {/* Footer with Total */}
          <View style={styles.modalFooter}>
            <Text style={styles.totalText}>
              Total: {getTotalPassengers()} Passenger{getTotalPassengers() !== 1 ? 's' : ''}
            </Text>
            <TouchableOpacity 
              style={styles.doneButton} 
              onPress={onClose}
            >
              <Text style={styles.doneButtonText}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 4,
  },
  closeText: {
    fontSize: 18,
    color: '#FF3B30',
  },
  passengerList: {
    paddingHorizontal: 20,
  },
  passengerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  passengerInfo: {
    flex: 1,
  },
  passengerLabel: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  passengerDescription: {
    fontSize: 14,
    color: '#666',
  },
  counterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  counterButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FF3B30',
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#e0e0e0',
  },
  counterButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  disabledButtonText: {
    color: '#999',
  },
  countText: {
    fontSize: 18,
    fontWeight: '500',
    marginHorizontal: 16,
    minWidth: 20,
    textAlign: 'center',
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  totalText: {
    fontSize: 16,
    fontWeight: '500',
  },
  doneButton: {
    backgroundColor: '#FF3B30',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  doneButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default PassengerModal;