import React from 'react';
import {StyleSheet, View} from 'react-native';
import {Card, Text} from 'react-native-paper';
import {useAuthViewModel} from '../../../ViewModel/useAuthViewModel';

const DashboardScreen: React.FC = () => {
  const {user} = useAuthViewModel();

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Text variant="headlineMedium">Tableau de bord</Text>
          <Text variant="bodyLarge" style={styles.info}>
            Bienvenue, {user?.email}
          </Text>
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
});

export default DashboardScreen;
