import {RouteProp, useRoute} from '@react-navigation/native';
import React, {useEffect} from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import {ActivityIndicator, Button, Card, Text} from 'react-native-paper';
import {RootStackParamList} from '../../../Types/navigation';
import {useCampaignViewModel} from '../../../ViewModel/useCampaignViewModel';

type CampaignDetailRouteProp = RouteProp<RootStackParamList, 'CampaignDetail'>;

const CampaignDetailScreen: React.FC = () => {
  const route = useRoute<CampaignDetailRouteProp>();
  const {id} = route.params;
  const {selectedCampaign, loading, fetchCampaign} = useCampaignViewModel();

  useEffect(() => {
    fetchCampaign(id);
  }, [fetchCampaign, id]);

  if (loading || !selectedCampaign) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  const progress =
    (selectedCampaign.currentAmount / selectedCampaign.targetAmount) * 100;

  return (
    <ScrollView style={styles.container}>
      <Card>
        <Card.Content>
          <Text variant="headlineMedium">{selectedCampaign.title}</Text>
          <Text variant="bodyLarge" style={styles.description}>
            {selectedCampaign.description}
          </Text>
          <Text variant="bodyMedium" style={styles.info}>
            Localisation: {selectedCampaign.location}
          </Text>
          <Text variant="bodyMedium" style={styles.info}>
            Objectif: {selectedCampaign.targetAmount} FCFA
          </Text>
          <Text variant="bodyMedium" style={styles.info}>
            Collecté: {selectedCampaign.currentAmount} FCFA (
            {progress.toFixed(1)}%)
          </Text>
          <Button mode="contained" style={styles.button}>
            Faire un don
          </Button>
        </Card.Content>
      </Card>
    </ScrollView>
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
  description: {
    marginVertical: 15,
  },
  info: {
    marginVertical: 5,
  },
  button: {
    marginTop: 20,
  },
});

export default CampaignDetailScreen;
