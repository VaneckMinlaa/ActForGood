import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput as RNTextInput,
} from 'react-native';
import {Text} from 'react-native-paper';
import {useDispatch} from 'react-redux';
import {login} from '../../Store/Slices/authSlice';
import {AppDispatch} from '../../Store/store';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import type {RootStackParamList} from '../../Types/navigation';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

type LoginScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Login'
>;

const LoginScreen: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = () => {
    dispatch(login({email, password}));
  };

  const handleGoogleLogin = () => {
    // TODO: Implémenter la connexion Google
    console.log('Google login');
  };

  const handleAppleLogin = () => {
    // TODO: Implémenter la connexion Apple
    console.log('Apple login');
  };

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        {/* Flèche retour */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}>
          <MaterialIcons name="arrow-back" size={24} color="#1a1a1a" />
        </TouchableOpacity>

        {/* Logo ActForGood */}
        <View style={styles.logoContainer}>
          <Text style={styles.logo}>ActForGood</Text>
        </View>

        {/* Titre et sous-titre */}
        <Text style={styles.title}>Content de vous revoir</Text>
        <Text style={styles.subtitle}>
          Saisissez vos identifiants pour continuer
        </Text>

        {/* Champ Email ou nom d'utilisateur */}
        <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            <MaterialIcons
              name="email"
              size={22}
              color="#999"
              style={styles.inputIcon}
            />
            <RNTextInput
              value={email}
              onChangeText={setEmail}
              placeholder="Email ou nom d'utilisateur"
              placeholderTextColor="#999"
              keyboardType="email-address"
              autoCapitalize="none"
              style={styles.input}
            />
          </View>
        </View>

        {/* Champ Mot de passe */}
        <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            <MaterialIcons
              name="lock"
              size={22}
              color="#999"
              style={styles.inputIcon}
            />
            <RNTextInput
              value={password}
              onChangeText={setPassword}
              placeholder="Mot de passe"
              placeholderTextColor="#999"
              secureTextEntry={!showPassword}
              style={[styles.input, styles.passwordInput]}
            />
            <TouchableOpacity
              style={styles.eyeIcon}
              onPress={() => setShowPassword(!showPassword)}
              activeOpacity={0.7}>
              <MaterialIcons
                name={showPassword ? 'visibility' : 'visibility-off'}
                size={22}
                color="#666"
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Mot de passe oublié */}
        <TouchableOpacity style={styles.forgotPassword} activeOpacity={0.7}>
          <Text style={styles.forgotPasswordText}>Mot de passe oublié ?</Text>
        </TouchableOpacity>

        {/* Bouton Se connecter */}
        <TouchableOpacity
          style={[
            styles.loginButton,
            (!email || !password) && styles.loginButtonDisabled,
          ]}
          onPress={handleLogin}
          disabled={!email || !password}
          activeOpacity={0.85}>
          <Text style={styles.loginButtonText}>Se connecter</Text>
        </TouchableOpacity>

        {/* Bouton Apple */}
        <TouchableOpacity
          style={styles.appleButton}
          onPress={handleAppleLogin}
          activeOpacity={0.85}>
          <MaterialCommunityIcons
            name="apple"
            size={24}
            color="#fff"
            style={styles.socialIcon}
          />
          <Text style={styles.appleButtonText}>Se connecter avec Apple</Text>
        </TouchableOpacity>

        {/* Bouton Google */}
        <TouchableOpacity
          style={styles.googleButton}
          onPress={handleGoogleLogin}
          activeOpacity={0.85}>
          <MaterialCommunityIcons
            name="google"
            size={22}
            color="#4285F4"
            style={styles.socialIcon}
          />
          <Text style={styles.googleButtonText}>Se connecter avec Google</Text>
        </TouchableOpacity>

        {/* S'inscrire */}
        <View style={styles.signupContainer}>
          <Text style={styles.signupText}>Pas encore de compte ? </Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('Register')}
            activeOpacity={0.7}>
            <Text style={styles.signupLink}>S'inscrire</Text>
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
    paddingHorizontal: 28,
    paddingTop: 52,
    paddingBottom: 48,
    alignItems: 'center',
  },
  backButton: {
    alignSelf: 'flex-start',
    padding: 8,
    marginBottom: 8,
  },
  logoContainer: {
    marginBottom: 28,
    alignItems: 'center',
  },
  logo: {
    fontSize: 26,
    fontWeight: '800',
    color: '#F5A623',
    letterSpacing: 0.5,
    textAlign: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 6,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    color: '#666',
    lineHeight: 22,
    marginBottom: 28,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 14,
    alignSelf: 'stretch',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#e8e8e8',
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    paddingVertical: 16,
    fontSize: 16,
    color: '#1a1a1a',
  },
  passwordInput: {
    paddingRight: 16,
  },
  eyeIcon: {
    padding: 8,
    marginLeft: 8,
  },
  forgotPassword: {
    alignSelf: 'center',
    marginBottom: 22,
  },
  forgotPasswordText: {
    color: '#F5A623',
    fontSize: 14,
    fontWeight: '600',
  },
  loginButton: {
    alignSelf: 'stretch',
    backgroundColor: '#F5A623',
    borderRadius: 14,
    paddingVertical: 17,
    alignItems: 'center',
    marginBottom: 14,
    shadowColor: '#F5A623',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  loginButtonDisabled: {
    opacity: 0.5,
    shadowOpacity: 0,
    elevation: 0,
  },
  loginButtonText: {
    color: '#1a1a1a',
    fontSize: 17,
    fontWeight: '700',
  },
  appleButton: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1a1a1a',
    borderRadius: 14,
    paddingVertical: 17,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  appleButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  googleButton: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderWidth: 1.5,
    borderColor: '#e0e0e0',
    borderRadius: 14,
    paddingVertical: 17,
    marginBottom: 28,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  googleButtonText: {
    color: '#1a1a1a',
    fontSize: 16,
    fontWeight: '600',
  },
  socialIcon: {
    marginRight: 12,
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  signupText: {
    color: '#666',
    fontSize: 15,
  },
  signupLink: {
    color: '#F5A623',
    fontSize: 15,
    fontWeight: '700',
  },
});

export default LoginScreen;
