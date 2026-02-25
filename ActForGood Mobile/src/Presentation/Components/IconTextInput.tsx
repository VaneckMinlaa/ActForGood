import React from 'react';
import {
  View,
  StyleSheet,
  Text,
  TextInput as RNTextInput,
  TextInputProps,
} from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

type Props = {
  label: string;
  icon: React.ComponentProps<typeof MaterialIcons>['name'];
  errorText?: string;
} & TextInputProps;

const IconTextInput: React.FC<Props> = ({
  label,
  icon,
  errorText,
  style,
  ...inputProps
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.inputWrapper}>
        <MaterialIcons name={icon} size={22} color="#999" style={styles.icon} />
        <RNTextInput
          style={[styles.input, style]}
          placeholderTextColor="#999"
          {...inputProps}
        />
      </View>
      {errorText ? <Text style={styles.error}>{errorText}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 10,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e8e8e8',
    paddingHorizontal: 16,
  },
  icon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    paddingVertical: 16,
    fontSize: 16,
    color: '#1a1a1a',
  },
  error: {
    marginTop: 4,
    fontSize: 12,
    color: '#D32F2F',
  },
});

export default IconTextInput;

