import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import React, {useState} from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import type {RootStackParamList, UserType} from '../../../Types/navigation';

type RegisterScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Register'
>;

const OPTIONS: Array<{
  id: UserType;
  title: string;
  description: string;
  icon: 'favorite' | 'group' | 'child-care' | 'work';
}> = [
  {
    id: 'DONOR',
    title: 'Donateur',
    description: 'Faites des dons et suivez votre impact.',
    icon: 'favorite',
  },
  {
    id: 'ONG',
    title: 'ONG / Organisation Sociale',
    description: 'Enregistrez votre organisation et vos projets.',
    icon: 'group',
  },
  {
    id: 'ORPHANAGE',
    title: 'Orphelinat',
    description: 'Inscrivez votre orphelinat et recevez du soutien.',
    icon: 'child-care',
  },
  {
    id: 'PARTNER',
    title: 'Entreprise / Partenaire',
    description: 'Devenez partenaire et soutenez nos causes.',
    icon: 'work',
  },
];

const RegisterScreen: React.FC = () => {
  const navigation = useNavigation<RegisterScreenNavigationProp>();
  const [selectedType, setSelectedType] = useState<UserType | null>(null);

  const handleNext = () => {
    if (selectedType) {
      navigation.navigate('RegisterForm', {userType: selectedType});
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.content}>
        {/* Logo */}
        <Text style={styles.logo}>ActForGood</Text>

        {/* Titre */}
        <Text style={styles.title}>Créer un compte</Text>
        <Text style={styles.subtitle}>Qui êtes-vous ?</Text>

        {/* Options */}
        {OPTIONS.map(option => (
          <TouchableOpacity
            key={option.id}
            style={[
              styles.optionCard,
              selectedType === option.id && styles.optionCardSelected,
            ]}
            onPress={() => setSelectedType(option.id)}
            activeOpacity={0.7}>
            <View style={styles.optionIconWrapper}>
              <MaterialIcons name={option.icon} size={32} color="#F5A623" />
            </View>
            <View style={styles.optionTextWrapper}>
              <Text style={styles.optionTitle}>{option.title}</Text>
              <Text style={styles.optionDescription}>{option.description}</Text>
            </View>
          </TouchableOpacity>
        ))}

        {/* Bouton Suivant */}
        <TouchableOpacity
          style={[
            styles.nextButton,
            selectedType ? styles.nextButtonActive : styles.nextButtonDisabled,
          ]}
          onPress={handleNext}
          disabled={!selectedType}>
          <Text style={styles.nextButtonText}>Suivant</Text>
        </TouchableOpacity>

        {/* Lien Se connecter */}
        <View style={styles.loginContainer}>
          <Text style={styles.loginText}>Déjà un compte ? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.loginLink}>Se connecter</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
  },
  logo: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#F5A623',
    textAlign: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#1a1a1a',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 32,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#e8e8e8',
    padding: 16,
    marginBottom: 12,
  },
  optionCardSelected: {
    borderColor: '#F5A623',
    backgroundColor: '#FFFBF5',
  },
  optionIconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFF8E7',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  optionTextWrapper: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  optionDescription: {
    fontSize: 13,
    color: '#666',
    lineHeight: 18,
  },
  nextButton: {
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 24,
  },
  nextButtonActive: {
    backgroundColor: '#F5A623',
  },
  nextButtonDisabled: {
    backgroundColor: '#9E9E9E',
    opacity: 0.9,
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  loginText: {
    color: '#666',
    fontSize: 14,
  },
  loginLink: {
    color: '#F5A623',
    fontSize: 14,
    fontWeight: '700',
  },
});

export default RegisterScreen;
