import React, { useMemo, useState } from 'react';
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import * as Clipboard from 'expo-clipboard';
import { calculateVolume, formatVolume, formatCopyText } from './src/calculator';

const INK = '#173A56';
const MUTED = '#637789';
const ACCENT = '#1473C9';
const BG = '#F4F7FA';
const UNITS = [
  { value: 'cm', label: 'cm' },
  { value: 'in', label: 'inch' },
  { value: 'ft', label: 'feet' },
];
const INITIAL = { length: '48', width: '40', height: '40', quantity: '2', unit: 'in' };

function Field({ label, value, onChange, suffix, accessibilityLabel }) {
  return (
    <View style={styles.fieldGroup}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <View style={styles.fieldBox}>
        <TextInput
          accessibilityLabel={accessibilityLabel || label}
          style={styles.fieldInput}
          keyboardType="decimal-pad"
          returnKeyType="done"
          onSubmitEditing={Keyboard.dismiss}
          value={value}
          onChangeText={onChange}
          placeholder="0"
          placeholderTextColor="#9AA9B8"
          maxLength={12}
          selectTextOnFocus
        />
        <Text style={styles.fieldSuffix}>{suffix}</Text>
      </View>
    </View>
  );
}

function CalculatorScreen() {
  const [values, setValues] = useState(INITIAL);
  const [copyLabel, setCopyLabel] = useState('Copy result');
  const setValue = (key, value) => {
    setValues((previous) => ({ ...previous, [key]: value }));
    setCopyLabel('Copy result');
  };
  const result = useMemo(() => calculateVolume(values), [values]);

  async function copyResult() {
    if (!result.ok) return;
    try {
      const succeeded = await Clipboard.setStringAsync(formatCopyText(values, result));
      if (!succeeded) throw new Error('Copy unsuccessful');
      setCopyLabel('Copied!');
    } catch {
      Alert.alert('Unable to copy', 'Please try again.');
    }
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <StatusBar barStyle="dark-content" />
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          contentContainerStyle={styles.page}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.brandRow}>
            <View style={styles.brandIcon}>
              <Text style={styles.brandGlyph}>▣</Text>
            </View>
            <View style={styles.flex}>
              <Text style={styles.brandTitle}>Freight CBM</Text>
              <Text style={styles.brandSubtitle}>Quick volume calculator for logistics</Text>
            </View>
          </View>

          <View style={styles.card}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Cargo dimensions</Text>
              <Text style={styles.stepTag}>01 / INPUT</Text>
            </View>
            <Text style={styles.helpText}>Select a unit for all three measurements.</Text>
            <View style={styles.unitSelector} accessibilityRole="radiogroup">
              {UNITS.map((unit) => {
                const selected = values.unit === unit.value;
                return (
                  <Pressable
                    key={unit.value}
                    accessibilityRole="radio"
                    accessibilityState={{ selected }}
                    accessibilityLabel={`Unit ${unit.label}`}
                    onPress={() => setValue('unit', unit.value)}
                    style={[styles.unitButton, selected && styles.unitButtonSelected]}
                  >
                    <Text style={[styles.unitLabel, selected && styles.unitLabelSelected]}>{unit.label}</Text>
                  </Pressable>
                );
              })}
            </View>

            <Field label="Length" value={values.length} suffix={values.unit} onChange={(v) => setValue('length', v)} />
            <Field label="Width" value={values.width} suffix={values.unit} onChange={(v) => setValue('width', v)} />
            <Field label="Height" value={values.height} suffix={values.unit} onChange={(v) => setValue('height', v)} />
            <View style={styles.separator} />
            <Field
              label="Quantity"
              accessibilityLabel="Quantity in pieces"
              value={values.quantity}
              suffix="pcs"
              onChange={(v) => setValue('quantity', v)}
            />
          </View>

          <View style={styles.resultCard} accessibilityLiveRegion="polite">
            <View style={styles.sectionHeader}>
              <Text style={styles.resultHeading}>Total volume</Text>
              <Text style={styles.stepTagLight}>02 / RESULT</Text>
            </View>
            {result.ok ? (
              <>
                <View style={styles.resultMainRow}>
                  <Text adjustsFontSizeToFit numberOfLines={1} style={styles.resultNumber}>
                    {formatVolume(result.cbm)}
                  </Text>
                  <Text style={styles.resultUnit}>CBM</Text>
                </View>
                <Text style={styles.resultSecondary}>
                  {formatVolume(result.cft, 2)} CFT · {result.quantity.toLocaleString('en-US')} pcs
                </Text>
              </>
            ) : (
              <View style={styles.invalidMessage}>
                <Text style={styles.invalidTitle}>Check your inputs</Text>
                <Text style={styles.invalidDetail}>{result.error}</Text>
              </View>
            )}
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Copy volume result"
              disabled={!result.ok}
              onPress={copyResult}
              style={[styles.copyButton, !result.ok && styles.buttonDisabled]}
            >
              <Text style={styles.copyButtonText}>{copyLabel}</Text>
            </Pressable>
          </View>

          <Pressable
            accessibilityRole="button"
            onPress={() => { setValues({ length: '', width: '', height: '', quantity: '1', unit: 'cm' }); setCopyLabel('Copy result'); }}
            style={styles.clearButton}
          >
            <Text style={styles.clearButtonText}>Clear inputs</Text>
          </Pressable>
          <Text style={styles.disclaimer}>
            CBM = L × W × H (in metres) × quantity. Use external package dimensions and verify measurements before booking.
          </Text>
          <Text style={styles.footer}>OFFLINE · NO ACCOUNT · NO TRACKING</Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <CalculatorScreen />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  safeArea: { flex: 1, backgroundColor: BG },
  page: { width: '100%', maxWidth: 560, alignSelf: 'center', paddingHorizontal: 22, paddingTop: 24, paddingBottom: 32 },
  brandRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 28 },
  brandIcon: { width: 52, height: 52, backgroundColor: INK, borderRadius: 15, alignItems: 'center', justifyContent: 'center' },
  brandGlyph: { color: '#FFFFFF', fontSize: 29, fontWeight: '600' },
  brandTitle: { fontSize: 24, fontWeight: '800', color: INK, letterSpacing: -0.6 },
  brandSubtitle: { fontSize: 12, color: MUTED, marginTop: 3 },
  card: { backgroundColor: '#FFFFFF', borderRadius: 22, padding: 20, borderWidth: 1, borderColor: '#E6EDF3', marginBottom: 16 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: INK },
  stepTag: { color: '#8AA0B2', fontSize: 10, fontWeight: '800', letterSpacing: 1.1 },
  helpText: { color: MUTED, fontSize: 12, marginBottom: 16, lineHeight: 18 },
  unitSelector: { flexDirection: 'row', gap: 8, marginBottom: 20 },
  unitButton: { flex: 1, paddingVertical: 12, alignItems: 'center', borderWidth: 1, borderColor: '#DCE5ED', borderRadius: 11, backgroundColor: '#F7F9FC' },
  unitButtonSelected: { backgroundColor: '#E6F2FD', borderColor: ACCENT },
  unitLabel: { fontSize: 14, fontWeight: '600', color: MUTED },
  unitLabelSelected: { color: '#0868B5', fontWeight: '800' },
  fieldGroup: { marginBottom: 13 },
  fieldLabel: { color: INK, fontSize: 13, fontWeight: '600', marginBottom: 7 },
  fieldBox: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#DCE5ED', borderRadius: 12, backgroundColor: '#FAFCFE', paddingHorizontal: 14, minHeight: 48 },
  fieldInput: { flex: 1, color: INK, fontSize: 17, fontWeight: '600', paddingVertical: 11 },
  fieldSuffix: { color: MUTED, fontWeight: '600', fontSize: 13, marginLeft: 6 },
  separator: { height: 1, backgroundColor: '#ECF0F4', marginTop: 3, marginBottom: 16 },
  resultCard: { backgroundColor: INK, borderRadius: 22, padding: 22 },
  resultHeading: { color: '#FFFFFF', fontSize: 17, fontWeight: '700' },
  stepTagLight: { color: '#9ABED8', fontSize: 10, fontWeight: '800', letterSpacing: 1.1 },
  resultMainRow: { flexDirection: 'row', alignItems: 'baseline', gap: 10, paddingTop: 16 },
  resultNumber: { color: '#FFFFFF', fontSize: 48, fontWeight: '800', letterSpacing: -1.8, flexShrink: 1 },
  resultUnit: { fontSize: 18, color: '#82D8FF', fontWeight: '800' },
  resultSecondary: { marginTop: 5, color: '#CFDFEA', fontSize: 14 },
  invalidMessage: { paddingVertical: 20 },
  invalidTitle: { fontSize: 18, fontWeight: '700', color: '#FFFFFF' },
  invalidDetail: { fontSize: 12, color: '#D4E4EF', marginTop: 5 },
  copyButton: { backgroundColor: ACCENT, alignItems: 'center', borderRadius: 12, paddingVertical: 14, marginTop: 19 },
  copyButtonText: { color: '#FFFFFF', fontWeight: '800', fontSize: 14 },
  buttonDisabled: { opacity: 0.4 },
  clearButton: { alignSelf: 'center', padding: 13, marginTop: 12 },
  clearButtonText: { color: ACCENT, fontWeight: '700', fontSize: 14 },
  disclaimer: { color: MUTED, fontSize: 11, textAlign: 'center', lineHeight: 17, marginTop: 7, marginHorizontal: 9 },
  footer: { fontSize: 10, fontWeight: '800', color: '#91A4B4', letterSpacing: 1.3, textAlign: 'center', marginTop: 18 },
});
