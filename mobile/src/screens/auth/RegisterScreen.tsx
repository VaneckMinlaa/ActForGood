import React, {useState} from 'react';
import {View, StyleSheet, ScrollView} from 'react-native';
import {TextInput, Button, Text, Card} from 'react-native-paper';
import {useDispatch} from 'react-redux';
import {register} from '../../store/slices/authSlice';
import {AppDispatch} from '../../store/store';

const RegisterScreen: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    userType: 'DONOR',
  });

  const handleRegister = () => {
    dispatch(register(formData));
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Text variant="headlineMedium" style={styles.title}>
            Inscription
          </Text>
          <TextInput
            label="Prénom"
            value={formData.firstName}
            onChangeText={text => setFormData({...formData, firstName: text})}
            mode="outlined"
            style={styles.input}
          />
          <TextInput
            label="Nom"
            value={formData.lastName}
            onChangeText={text => setFormData({...formData, lastName: text})}
            mode="outlined"
            style={styles.input}
          />
          <TextInput
            label="Email"
            value={formData.email}
            onChangeText={text => setFormData({...formData, email: text})}
            mode="outlined"
            keyboardType="email-address"
            autoCapitalize="none"
            style={styles.input}
          />
          <TextInput
            label="Mot de passe"
            value={formData.password}
            onChangeText={text => setFormData({...formData, password: text})}
            mode="outlined"
            secureTextEntry
            style={styles.input}
          />
          <Button
            mode="contained"
            onPress={handleRegister}
            style={styles.button}
            disabled={
              !formData.firstName ||
              !formData.lastName ||
              !formData.email ||
              !formData.password
            }>
            S'inscrire
          </Button>
        </Card.Content>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  card: {
    padding: 20,
  },
  title: {
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    marginBottom: 15,
  },
  button: {
    marginTop: 10,
  },
});

export default RegisterScreen;
