import React, {useEffect} from 'react';
import {View, StyleSheet, ScrollView} from 'react-native';
import {Card, Text, Button, ActivityIndicator} from 'react-native-paper';
import {useDispatch, useSelector} from 'react-redux';
import {RootState, AppDispatch} from '../../Store/store';
import {fetchCampaign} from '../../Store/Slices/campaignSlice';
import {useRoute, RouteProp} from '@react-navigation/native';
import {RootStackParamList} from '../../Types/navigation';

type CampaignDetailRouteProp = RouteProp<RootStackParamList, 'CampaignDetail'>;

const CampaignDetailScreen: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const route = useRoute<CampaignDetailRouteProp>();
  const {id} = route.params;
  const {selectedCampaign, loading} = useSelector(
    (state: RootState) => state.campaigns
  );

  useEffect(() => {
    dispatch(fetchCampaign(id));
  }, [dispatch, id]);

  if (loading || !selectedCampaign) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  const progress = (selectedCampaign.currentAmount / selectedCampaign.targetAmount) * 100;

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
            Collecté: {selectedCampaign.currentAmount} FCFA ({progress.toFixed(1)}%)
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
