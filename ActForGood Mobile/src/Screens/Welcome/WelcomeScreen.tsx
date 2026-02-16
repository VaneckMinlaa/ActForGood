import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useDispatch} from 'react-redux';
import type {StackNavigationProp} from '@react-navigation/stack';
import type {RootStackParamList} from '../../Types/navigation';
import {setGuest} from '../../Store/Slices/authSlice';

type WelcomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Welcome'>;

const WELCOME_BG =
  'https://images.unsplash.com/photo-1542810634-71277d95dcbb?w=800';

const WelcomeScreen: React.FC = () => {
  const navigation = useNavigation<WelcomeScreenNavigationProp>();
  const dispatch = useDispatch();

  const handleGuest = () => {
    dispatch(setGuest());
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ImageBackground
        source={{uri: WELCOME_BG}}
        style={styles.background}
        resizeMode="cover">
        <View style={styles.overlay} />
        <View style={styles.content}>
          <Text style={styles.logo}>ActForGood</Text>
          <Text style={styles.tagline}>
            Chaque don{'\n'}compte. Chaque{'\n'}action change{'\n'}une vie.
          </Text>
          <View style={styles.buttons}>
            <TouchableOpacity
              style={styles.primaryButton}
              activeOpacity={0.9}
              onPress={() => navigation.navigate('Register')}>
              <Text style={styles.primaryButtonText}>Créer un compte</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.secondaryButton}
              activeOpacity={0.9}
              onPress={() => navigation.navigate('Login')}>
              <Text style={styles.secondaryButtonText}>Se connecter</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={styles.guestLink}
            activeOpacity={0.8}
            onPress={handleGuest}>
            <Text style={styles.guestLinkText}>Explorer en tant qu'invité</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  content: {
    flex: 1,
    paddingHorizontal: 28,
    paddingTop: 56,
    paddingBottom: 40,
    justifyContent: 'space-between',
  },
  logo: {
    fontSize: 32,
    fontWeight: '800',
    color: '#F5C518',
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  tagline: {
    fontSize: 38,
    fontWeight: '900',
    color: '#FFFFFF',
    lineHeight: 38,
    textAlign: 'center',
    marginTop: 64,
  },
  buttons: {
    gap: 14,
    marginTop: 24,
  },
  primaryButton: {
    backgroundColor: '#F5C518',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: {
    color: '#1a1a1a',
    fontSize: 17,
    fontWeight: '700',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#F5C518',
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryButtonText: {
    color: '#F5C518',
    fontSize: 17,
    fontWeight: '700',
  },
  guestLink: {
    alignSelf: 'center',
    paddingVertical: 12,
    marginBottom: 16,
  },
  guestLinkText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '500',
  },
});

export default WelcomeScreen;
