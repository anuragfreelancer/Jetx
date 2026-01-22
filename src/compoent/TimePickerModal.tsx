import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  ScrollView,
  Dimensions,
  StyleSheet,
} from 'react-native';

const { width } = Dimensions.get('window');

const TimeSlider = ({ selectedTime, onTimeSelect }) => {
  const generateTimeSlots = () => {
    const slots = [];
    // Generate times from 05:00 to 23:30 every 30 minutes
    for (let hour = 5; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        const displayHour = hour > 12 ? hour - 12 : hour;
        const period = hour >= 12 ? 'PM' : 'AM';
        slots.push({
          value: timeString,
          display: `${displayHour}:${minute.toString().padStart(2, '0')}`,
          period: period
        });
      }
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();

  return (
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.timeSliderContent}
    >
      {timeSlots.map((slot) => (
        <TouchableOpacity
          key={slot.value}
          style={[
            styles.timeChip,
            selectedTime === slot.value && styles.timeChipSelected
          ]}
          onPress={() => onTimeSelect(slot.value)}
        >
          <Text style={[
            styles.timeChipText,
            selectedTime === slot.value && styles.timeChipTextSelected
          ]}>
            {slot.display}
          </Text>
          <Text style={[
            styles.timeChipPeriod,
            selectedTime === slot.value && styles.timeChipPeriodSelected
          ]}>
            {slot.period}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const TimeSelectionModal = ({ 
  visible, 
  onClose, 
  onTimeSelect,
  title = "Select Departure Time",
  selectedTime = "08:00"
}) => {
  const [currentTime, setCurrentTime] = useState(selectedTime);

  useEffect(() => {
    setCurrentTime(selectedTime);
  }, [selectedTime]);

  const commonTimes = [
    { time: '06:00', label: '6:00 AM', period: 'Early Morning' },
    { time: '08:00', label: '8:00 AM', period: 'Morning' },
    { time: '10:00', label: '10:00 AM', period: 'Late Morning' },
    { time: '12:00', label: '12:00 PM', period: 'Noon' },
    { time: '14:00', label: '2:00 PM', period: 'Afternoon' },
    { time: '16:00', label: '4:00 PM', period: 'Late Afternoon' },
    { time: '18:00', label: '6:00 PM', period: 'Evening' },
    { time: '20:00', label: '8:00 PM', period: 'Night' },
    { time: '22:00', label: '10:00 PM', period: 'Late Night' },
  ];

  const handleConfirm = () => {
    onTimeSelect(currentTime);
    onClose();
  };

  const formatTimeForDisplay = (time) => {
    const [hours, minutes] = time.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
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
            <Text style={styles.modalTitle}>{title}</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeIcon}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Selected Time Display */}
          <View style={styles.selectedTimeContainer}>
            <Text style={styles.selectedTimeLabel}>Selected Time:</Text>
            <Text style={styles.selectedTime}>{formatTimeForDisplay(currentTime)}</Text>
          </View>

          {/* Quick Time Selection */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Popular Times</Text>
            <View style={styles.quickTimeGrid}>
              {commonTimes.map((item) => (
                <TouchableOpacity
                  key={item.time}
                  style={[
                    styles.quickTimeButton,
                    currentTime === item.time && styles.quickTimeButtonSelected
                  ]}
                  onPress={() => setCurrentTime(item.time)}
                >
                  <Text style={[
                    styles.quickTimeText,
                    currentTime === item.time && styles.quickTimeTextSelected
                  ]}>
                    {item.label}
                  </Text>
                  <Text style={[
                    styles.quickTimePeriod,
                    currentTime === item.time && styles.quickTimePeriodSelected
                  ]}>
                    {item.period}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Time Slider */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Select Exact Time</Text>
            <TimeSlider 
              selectedTime={currentTime}
              onTimeSelect={setCurrentTime}
            />
          </View>

          {/* Note */}
          <View style={styles.noteContainer}>
            <Text style={styles.noteIcon}>⏰</Text>
            <Text style={styles.noteText}>
              Private jets offer flexible departure times. Your selected time will be confirmed with the operator.
            </Text>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity 
              style={[styles.actionButton, styles.cancelButton]}
              onPress={onClose}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.actionButton, styles.confirmButton]}
              onPress={handleConfirm}
            >
              <Text style={styles.confirmButtonText}>Confirm Time</Text>
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
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    maxHeight: '85%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  closeButton: {
    padding: 8,
  },
  closeIcon: {
    fontSize: 24,
    color: '#666',
  },
  selectedTimeContainer: {
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 24,
  },
  selectedTimeLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  selectedTime: {
    fontSize: 32,
    fontWeight: '700',
    color: '#FF3B30',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  quickTimeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickTimeButton: {
    width: (width - 72) / 3,
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  quickTimeButtonSelected: {
    backgroundColor: '#FF3B30',
    borderColor: '#FF3B30',
  },
  quickTimeText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  quickTimeTextSelected: {
    color: 'white',
  },
  quickTimePeriod: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  quickTimePeriodSelected: {
    color: 'rgba(255, 255, 255, 0.9)',
  },
  timeSliderContent: {
    paddingRight: 20,
  },
  timeChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginRight: 10,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  timeChipSelected: {
    backgroundColor: '#FF3B30',
    borderColor: '#FF3B30',
  },
  timeChipText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  timeChipTextSelected: {
    color: 'white',
  },
  timeChipPeriod: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  timeChipPeriodSelected: {
    color: 'rgba(255, 255, 255, 0.9)',
  },
  noteContainer: {
    flexDirection: 'row',
    backgroundColor: '#e8f4fd',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 24,
  },
  noteIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  noteText: {
    flex: 1,
    fontSize: 14,
    color: '#0066cc',
    lineHeight: 20,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginHorizontal: 8,
  },
  cancelButton: {
    backgroundColor: '#f5f5f5',
  },
  confirmButton: {
    backgroundColor: '#FF3B30',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
});

export default TimeSelectionModal;