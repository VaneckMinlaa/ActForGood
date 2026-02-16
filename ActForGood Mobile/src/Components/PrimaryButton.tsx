import React from 'react';
import {TouchableOpacity, Text, StyleSheet, ViewStyle} from 'react-native';

type Props = {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  style?: ViewStyle;
};

const PrimaryButton: React.FC<Props> = ({label, onPress, disabled, style}) => {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        disabled ? styles.buttonDisabled : styles.buttonActive,
        style,
      ]}
      onPress={onPress}
      disabled={disabled}>
      <Text style={styles.label}>{label}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  buttonActive: {
    backgroundColor: '#F5A623',
  },
  buttonDisabled: {
    backgroundColor: '#9E9E9E',
    opacity: 0.9,
  },
  label: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});

export default PrimaryButton;

