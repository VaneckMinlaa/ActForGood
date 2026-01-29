import React, {useEffect} from 'react';
import {View, StyleSheet, FlatList} from 'react-native';
import {Card, Text, ActivityIndicator} from 'react-native-paper';
import {useDispatch, useSelector} from 'react-redux';
import {RootState, AppDispatch} from '../../store/store';
import {fetchCampaigns} from '../../store/slices/campaignSlice';
import {useNavigation} from '@react-navigation/native';
import {RootStackScreenProps} from '../../types/navigation';

const CampaignsScreen: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigation = useNavigation<RootStackScreenProps<'CampaignDetail'>['navigation']>();
  const {campaigns, loading} = useSelector((state: RootState) => state.campaigns);

  useEffect(() => {
    dispatch(fetchCampaigns());
  }, [dispatch]);

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
      <FlatList
        data={campaigns}
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

export default CampaignsScreen;
