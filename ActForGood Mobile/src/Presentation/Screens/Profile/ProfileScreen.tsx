import React from 'react';
import {StyleSheet, View} from 'react-native';
import {Button, Card, Text} from 'react-native-paper';
import {useAuthViewModel} from '../../../ViewModel/useAuthViewModel';

const ProfileScreen: React.FC = () => {
  const {user, logout} = useAuthViewModel();

  const handleLogout = () => {
    logout();
  };

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Text variant="headlineMedium">Mon Profil</Text>
          <Text variant="bodyLarge" style={styles.info}>
            Email: {user?.email}
          </Text>
          <Text variant="bodyLarge" style={styles.info}>
            Type: {user?.userType}
          </Text>
          <Button mode="contained" onPress={handleLogout} style={styles.button}>
            Déconnexion
          </Button>
        </Card.Content>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  card: {
    marginTop: 20,
  },
  info: {
    marginTop: 10,
  },
  button: {
    marginTop: 20,
  },
});

export default ProfileScreen;
