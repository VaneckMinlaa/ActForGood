import React from 'react';
import {View, StyleSheet} from 'react-native';
import {Card, Text, Button} from 'react-native-paper';
import {useDispatch, useSelector} from 'react-redux';
import {RootState, AppDispatch} from '../../store/store';
import {logout} from '../../store/slices/authSlice';

const ProfileScreen: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {user} = useSelector((state: RootState) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
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
