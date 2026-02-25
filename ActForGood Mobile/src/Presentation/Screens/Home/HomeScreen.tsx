import {useNavigation} from '@react-navigation/native';
import React, {useEffect} from 'react';
import {FlatList, StyleSheet, View} from 'react-native';
import {ActivityIndicator, Button, Card, Text} from 'react-native-paper';
import {RootStackScreenProps} from '../../../Types/navigation';
import {useCampaignViewModel} from '../../../ViewModel/useCampaignViewModel';

const HomeScreen: React.FC = () => {
  const navigation =
    useNavigation<RootStackScreenProps<'CampaignDetail'>['navigation']>();
  const {activeCampaigns, loading, fetchActiveCampaigns} =
    useCampaignViewModel();

  useEffect(() => {
    fetchActiveCampaigns();
  }, [fetchActiveCampaigns]);

  const renderCampaign = ({item}: any) => (
    <Card
      style={styles.card}
      onPress={() => navigation.navigate('CampaignDetail', {id: item.id})}>
      <Card.Content>
        <Text variant="titleLarge">{item.title}</Text>
        <Text variant="bodyMedium" style={styles.description}>
          {item.description}
        </Text>
        <Text variant="bodySmall">
          {item.currentAmount} / {item.targetAmount} FCFA
        </Text>
      </Card.Content>
      <Card.Actions>
        <Button
          onPress={() => navigation.navigate('CampaignDetail', {id: item.id})}>
          Voir détails
        </Button>
      </Card.Actions>
    </Card>
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text variant="headlineMedium" style={styles.title}>
        Campagnes Actives
      </Text>
      <FlatList
        data={activeCampaigns}
        renderItem={renderCampaign}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    marginBottom: 15,
    padding: 10,
  },
  list: {
    paddingBottom: 20,
  },
  card: {
    marginBottom: 15,
  },
  description: {
    marginVertical: 10,
  },
});

export default HomeScreen;
