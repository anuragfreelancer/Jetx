import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Dimensions,
} from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface CustomCalendarModalProps {
  isVisible: boolean;
  mode?: 'date';
  date?: Date;
  minimumDate?: Date;
  onConfirm: (date: Date) => void;
  onCancel: () => void;
  themeVariant?: 'light' | 'dark';
}

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const CustomCalendarModal: React.FC<CustomCalendarModalProps> = ({
  isVisible,
  date,
  minimumDate,
  onConfirm,
  onCancel,
  themeVariant = 'light',
}) => {
  const initialDate = date || new Date();
  const [currentMonth, setCurrentMonth] = useState(initialDate.getMonth());
  const [currentYear, setCurrentYear] = useState(initialDate.getFullYear());
  const [selectedDate, setSelectedDate] = useState<Date>(initialDate);
  const [viewMode, setViewMode] = useState<'calendar' | 'month' | 'year'>('calendar');

  // Year range: current year - 1 to current year + 10
  const startYear = new Date().getFullYear() - 1;
  const endYear = new Date().getFullYear() + 10;
  const yearList = Array.from({ length: endYear - startYear + 1 }, (_, i) => startYear + i);

  useEffect(() => {
    if (isVisible) {
      const d = date || new Date();
      setSelectedDate(d);
      setCurrentMonth(d.getMonth());
      setCurrentYear(d.getFullYear());
      setViewMode('calendar');
    }
  }, [isVisible, date]);

  const isDark = themeVariant === 'dark';
  const colors = {
    bg: isDark ? '#1C1C1E' : '#FFFFFF',
    surface: isDark ? '#2C2C2E' : '#F2F2F7',
    primary: 'black',
    text: isDark ? '#FFFFFF' : '#000000',
    subText: isDark ? '#8E8E93' : '#6C6C70',
    disabled: isDark ? '#3A3A3C' : '#D1D1D6',
    disabledText: isDark ? '#48484A' : '#AEAEB2',
    todayBg: isDark ? '#3A3A3C' : '#E5E5EA',
    border: isDark ? '#38383A' : '#E5E5EA',
    overlay: 'rgba(0,0,0,0.5)',
    white: '#FFFFFF',
  };

  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (month: number, year: number) => {
    return new Date(year, month, 1).getDay();
  };

  const isSameDay = (d1: Date, d2: Date) => {
    return (
      d1.getDate() === d2.getDate() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getFullYear() === d2.getFullYear()
    );
  };

  const isToday = (d: Date) => isSameDay(d, new Date());

  const isDisabled = (d: Date) => {
    if (!minimumDate) return false;
    const minD = new Date(minimumDate);
    minD.setHours(0, 0, 0, 0);
    const checkD = new Date(d);
    checkD.setHours(0, 0, 0, 0);
    return checkD < minD;
  };

  const buildCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentMonth, currentYear);
    const firstDay = getFirstDayOfMonth(currentMonth, currentYear);
    const days: (number | null)[] = [];

    for (let i = 0; i < firstDay; i++) days.push(null);
    for (let i = 1; i <= daysInMonth; i++) days.push(i);

    // Pad to complete last row
    while (days.length % 7 !== 0) days.push(null);
    return days;
  };

  const goToPrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(y => y - 1);
    } else {
      setCurrentMonth(m => m - 1);
    }
  };

  const goToNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(y => y + 1);
    } else {
      setCurrentMonth(m => m + 1);
    }
  };

  const handleDayPress = (day: number) => {
    const picked = new Date(currentYear, currentMonth, day);
    if (isDisabled(picked)) return;
    setSelectedDate(picked);
  };

  const handleConfirm = () => {
    onConfirm(selectedDate);
  };

  const calendarDays = buildCalendarDays();

  const renderCalendarView = () => (
    <View>
      {/* Month/Year Header */}
      <View style={[s.monthRow]}>
        <TouchableOpacity onPress={goToPrevMonth} style={s.navBtn}>
          <Text style={[s.navArrow, { color: colors.primary }]}>‹</Text>
        </TouchableOpacity>

        <View style={s.monthYearGroup}>
          <TouchableOpacity onPress={() => setViewMode('month')} style={[s.monthYearBtn, { backgroundColor: colors.surface }]}>
            <Text style={[s.monthYearText, { color: colors.text }]}>
              {MONTHS[currentMonth]}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setViewMode('year')} style={[s.monthYearBtn, { backgroundColor: colors.surface }]}>
            <Text style={[s.monthYearText, { color: colors.text }]}>
              {currentYear}
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={goToNextMonth} style={s.navBtn}>
          <Text style={[s.navArrow, { color: colors.primary }]}>›</Text>
        </TouchableOpacity>
      </View>

      {/* Day Labels */}
      <View style={s.dayLabelsRow}>
        {DAYS.map(d => (
          <View key={d} style={s.dayLabelCell}>
            <Text style={[s.dayLabel, { color: colors.subText }]}>{d}</Text>
          </View>
        ))}
      </View>

      {/* Calendar Grid */}
      <View style={s.grid}>
        {calendarDays.map((day, idx) => {
          if (day === null) {
            return <View key={`empty-${idx}`} style={s.dayCell} />;
          }
          const dateObj = new Date(currentYear, currentMonth, day);
          const isSelected = isSameDay(dateObj, selectedDate);
          const isTodayDate = isToday(dateObj);
          const disabled = isDisabled(dateObj);

          return (
            <TouchableOpacity
              key={`day-${idx}`}
              style={[
                s.dayCell,
                isSelected && [s.selectedDay, { backgroundColor: colors.primary }],
                !isSelected && isTodayDate && [s.todayDay, { backgroundColor: colors.todayBg }],
              ]}
              onPress={() => handleDayPress(day)}
              disabled={disabled}
            >
              <Text
                style={[
                  s.dayText,
                  { color: colors.text },
                  isSelected && { color: colors.white, fontWeight: '700' },
                  disabled && { color: colors.disabledText },
                  isTodayDate && !isSelected && { color: colors.primary, fontWeight: '600' },
                ]}
              >
                {day}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );

  const renderMonthView = () => (
    <View style={s.gridPicker}>
      {MONTHS.map((m, idx) => {
        const isSelected = idx === currentMonth;
        return (
          <TouchableOpacity
            key={m}
            style={[
              s.pickerCell,
              isSelected && { backgroundColor: colors.primary, borderRadius: 10 },
            ]}
            onPress={() => {
              setCurrentMonth(idx);
              setViewMode('calendar');
            }}
          >
            <Text style={[s.pickerText, { color: isSelected ? colors.white : colors.text }]}>
              {m.slice(0, 3)}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );

  const renderYearView = () => (
    <FlatList
      data={yearList}
      keyExtractor={item => item.toString()}
      numColumns={4}
      style={{ maxHeight: 240 }}
      showsVerticalScrollIndicator={false}
      initialScrollIndex={Math.max(0, yearList.indexOf(currentYear) - 4)}
      getItemLayout={(_, index) => ({ length: 56, offset: 56 * Math.floor(index / 4), index })}
      renderItem={({ item }) => {
        const isSelected = item === currentYear;
        return (
          <TouchableOpacity
            style={[
              s.pickerCell,
              isSelected && { backgroundColor: colors.primary, borderRadius: 10 },
            ]}
            onPress={() => {
              setCurrentYear(item);
              setViewMode('calendar');
            }}
          >
            <Text style={[s.pickerText, { color: isSelected ? colors.white : colors.text }]}>
              {item}
            </Text>
          </TouchableOpacity>
        );
      }}
    />
  );

  const formattedSelected = selectedDate.toLocaleDateString('en-US', {
    weekday: 'short', day: 'numeric', month: 'short', year: 'numeric',
  });

  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="slide"
      onRequestClose={onCancel}
    >
      <View style={[s.overlay, { backgroundColor: colors.overlay }]}>
        <View style={[s.container, { backgroundColor: colors.bg }]}>

          {/* Top Selected Date Bar */}
          <View style={[s.selectedBar, { backgroundColor: colors.primary }]}>
            <Text style={s.selectedLabel}>Selected Date</Text>
            <Text style={s.selectedValue}>{formattedSelected}</Text>
          </View>

          {/* Back button if in month/year picker */}
          {viewMode !== 'calendar' && (
            <TouchableOpacity
              style={[s.backBtn, { borderBottomColor: colors.border }]}
              onPress={() => setViewMode('calendar')}
            >
              <Text style={[s.backBtnText, { color: colors.primary }]}>
                ← Back to Calendar
              </Text>
            </TouchableOpacity>
          )}

          <View style={s.body}>
            {viewMode === 'calendar' && renderCalendarView()}
            {viewMode === 'month' && renderMonthView()}
            {viewMode === 'year' && renderYearView()}
          </View>

          {/* Action Buttons */}
          <View style={[s.actions, { borderTopColor: colors.border }]}>
            <TouchableOpacity
              style={[s.actionBtn, { borderRightColor: colors.border }]}
              onPress={onCancel}
            >
              <Text style={[s.actionText, { color: colors.subText }]}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={s.actionBtn}
              onPress={handleConfirm}
            >
              <Text style={[s.actionText, { color: colors.primary, fontWeight: '700' }]}>
                Confirm
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const CELL_SIZE = Math.floor((SCREEN_WIDTH * 0.9 - 32) / 7);

const s = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  container: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: 'hidden',
    paddingBottom: 24,
  },
  selectedBar: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  selectedLabel: {
    color: 'rgba(255,255,255,0.75)',
    fontSize: 12,
    marginBottom: 2,
    letterSpacing: 0.5,
  },
  selectedValue: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  backBtn: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  backBtnText: {
    fontSize: 14,
    fontWeight: '600',
  },
  body: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  monthRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
    paddingTop: 4,
  },
  navBtn: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navArrow: {
    fontSize: 28,
    lineHeight: 32,
    fontWeight: '400',
  },
  monthYearGroup: {
    flexDirection: 'row',
    gap: 8,
  },
  monthYearBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  monthYearText: {
    fontSize: 16,
    fontWeight: '600',
  },
  dayLabelsRow: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  dayLabelCell: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 4,
  },
  dayLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayCell: {
    width: `${100 / 7}%`,
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 1,
  },
  selectedDay: {
    borderRadius: 999,
    transform: [{ scale: 0.85 }],
  },
  todayDay: {
    borderRadius: 999,
    transform: [{ scale: 0.85 }],
  },
  dayText: {
    fontSize: 14,
    fontWeight: '400',
  },
  gridPicker: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingVertical: 8,
  },
  pickerCell: {
    width: '25%',
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pickerText: {
    fontSize: 14,
    fontWeight: '500',
  },
  actions: {
    flexDirection: 'row',
    borderTopWidth: StyleSheet.hairlineWidth,
    marginTop: 12,
    marginHorizontal: 16,
  },
  actionBtn: {
    flex: 1,
    paddingVertical: 14,
    alignItems: 'center',
    borderRightWidth: StyleSheet.hairlineWidth,
  },
  actionText: {
    fontSize: 16,
  },
});

export default CustomCalendarModal;