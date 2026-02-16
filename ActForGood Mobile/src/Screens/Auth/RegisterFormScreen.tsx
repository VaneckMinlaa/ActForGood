import React, {useState, useMemo, useEffect} from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput as RNTextInput,
  Text,
  Alert,
} from 'react-native';
import {useNavigation, useRoute, RouteProp} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import type {RootStackParamList} from '../../Types/navigation';
import type {UserType} from '../../Types/navigation';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import {useDispatch, useSelector} from 'react-redux';
import {register, clearRegistrationPendingMessage} from '../../Store/Slices/authSlice';
import {AppDispatch, RootState} from '../../Store/store';
import RegisterOngSteps, {OngFormData} from './RegisterOngSteps';

type RegisterFormScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'RegisterForm'
>;
type RegisterFormScreenRouteProp = RouteProp<RootStackParamList, 'RegisterForm'>;

type FieldConfig = {
  key: string;
  label: string;
  placeholder: string;
  icon: 'person' | 'email' | 'lock' | 'phone' | 'business' | 'location-on' | 'description';
  keyboardType?: 'default' | 'email-address' | 'phone-pad';
  secure?: boolean;
  multiline?: boolean;
};

const FIELDS_BY_TYPE: Record<UserType, FieldConfig[]> = {
  DONOR: [
    {key: 'firstName', label: 'Prénom', placeholder: 'Entrez votre prénom', icon: 'person', keyboardType: 'default'},
    {key: 'lastName', label: 'Nom', placeholder: 'Entrez votre nom', icon: 'person', keyboardType: 'default'},
    {key: 'email', label: 'Email', placeholder: 'exemple@email.com', icon: 'email', keyboardType: 'email-address'},
    {key: 'password', label: 'Mot de passe', placeholder: 'Entrez votre mot de passe', icon: 'lock', secure: true},
  ],
  ONG: [
    {key: 'organizationName', label: 'Nom de l\'organisation', placeholder: 'Nom de votre ONG', icon: 'business', keyboardType: 'default'},
    {key: 'email', label: 'Email', placeholder: 'contact@organisation.org', icon: 'email', keyboardType: 'email-address'},
    {key: 'phone', label: 'Téléphone', placeholder: '06 12 34 56 78', icon: 'phone', keyboardType: 'phone-pad'},
    {key: 'description', label: 'Description (optionnel)', placeholder: 'Présentez votre organisation...', icon: 'description', keyboardType: 'default', multiline: true},
    {key: 'password', label: 'Mot de passe', placeholder: 'Choisissez un mot de passe', icon: 'lock', secure: true},
  ],
  ORPHANAGE: [
    {key: 'orphanageName', label: 'Nom de l\'orphelinat', placeholder: 'Nom de l\'établissement', icon: 'business', keyboardType: 'default'},
    {key: 'email', label: 'Email', placeholder: 'contact@orphelinat.org', icon: 'email', keyboardType: 'email-address'},
    {key: 'phone', label: 'Téléphone', placeholder: '06 12 34 56 78', icon: 'phone', keyboardType: 'phone-pad'},
    {key: 'address', label: 'Adresse', placeholder: 'Adresse complète', icon: 'location-on', keyboardType: 'default'},
    {key: 'password', label: 'Mot de passe', placeholder: 'Choisissez un mot de passe', icon: 'lock', secure: true},
  ],
  PARTNER: [
    {key: 'companyName', label: 'Nom de l\'entreprise', placeholder: 'Raison sociale', icon: 'business', keyboardType: 'default'},
    {key: 'email', label: 'Email', placeholder: 'contact@entreprise.com', icon: 'email', keyboardType: 'email-address'},
    {key: 'phone', label: 'Téléphone', placeholder: '01 23 45 67 89', icon: 'phone', keyboardType: 'phone-pad'},
    {key: 'password', label: 'Mot de passe', placeholder: 'Choisissez un mot de passe', icon: 'lock', secure: true},
  ],
};

const TYPE_LABELS: Record<UserType, string> = {
  DONOR: 'Donateur',
  ONG: 'ONG / Organisation Sociale',
  ORPHANAGE: 'Orphelinat',
  PARTNER: 'Entreprise / Partenaire',
};

const RegisterFormScreen: React.FC = () => {
  const navigation = useNavigation<RegisterFormScreenNavigationProp>();
  const route = useRoute<RegisterFormScreenRouteProp>();
  const dispatch = useDispatch<AppDispatch>();
  const {userType} = route.params;
  const registrationPendingMessage = useSelector(
    (state: RootState) => state.auth.registrationPendingMessage
  );

  useEffect(() => {
    if (registrationPendingMessage) {
      Alert.alert(
        'Compte créé',
        registrationPendingMessage,
        [
          {
            text: 'OK',
            onPress: () => {
              dispatch(clearRegistrationPendingMessage());
              navigation.navigate('Login');
            },
          },
        ]
      );
    }
  }, [registrationPendingMessage, dispatch, navigation]);

  const fields = useMemo(() => FIELDS_BY_TYPE[userType], [userType]);
  const [values, setValues] = useState<Record<string, string>>(() =>
    fields.reduce((acc, f) => ({...acc, [f.key]: ''}), {}),
  );
  const [showPassword, setShowPassword] = useState(false);

  const handleOngComplete = (ongData: OngFormData) => {
    dispatch(
      register({
        email: ongData.email,
        firstName: ongData.contactName,
        lastName: '',
        phone: ongData.phone,
        userType: 'ONG',
        location: ongData.postalAddress,
      })
    );
  };

  const updateField = (key: string, value: string) => {
    setValues(prev => ({...prev, [key]: value}));
  };

  const isFormValid = () => {
    return fields.every(f => {
      if (f.key === 'description') return true;
      return (values[f.key] ?? '').trim().length > 0;
    });
  };

  const handleSubmit = () => {
    if (!isFormValid()) return;
    const payload = {
      email: values.email ?? '',
      password: values.password ?? '',
      firstName: values.firstName ?? values.organizationName ?? values.orphanageName ?? values.companyName ?? '',
      lastName: values.lastName ?? '',
      phone: values.phone || undefined,
      userType,
      location: values.address || undefined,
    };
    dispatch(register(payload));
  };

  const renderField = (field: FieldConfig) => {
    const value = values[field.key] ?? '';
    const isPassword = field.secure;

    return (
      <View key={field.key} style={styles.inputContainer}>
        <Text style={styles.label}>{field.label}</Text>
        <View style={[styles.inputWrapper, field.multiline && styles.inputWrapperMultiline]}>
          <MaterialIcons
            name={field.icon}
            size={22}
            color="#999"
            style={styles.inputIcon}
          />
          <RNTextInput
            value={value}
            onChangeText={text => updateField(field.key, text)}
            placeholder={field.placeholder}
            placeholderTextColor="#999"
            keyboardType={field.keyboardType ?? 'default'}
            autoCapitalize={field.key === 'email' ? 'none' : 'sentences'}
            secureTextEntry={isPassword ? !showPassword : false}
            style={[styles.input, isPassword && styles.passwordInput, field.multiline && styles.inputMultiline]}
            multiline={field.multiline}
            numberOfLines={field.multiline ? 3 : 1}
          />
          {isPassword && (
            <TouchableOpacity
              style={styles.eyeIcon}
              onPress={() => setShowPassword(!showPassword)}>
              <MaterialIcons
                name={showPassword ? 'visibility' : 'visibility-off'}
                size={22}
                color="#666"
              />
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  if (userType === 'ONG') {
    return (
      <RegisterOngSteps
        onComplete={handleOngComplete}
        onBack={() => navigation.goBack()}
        onLogin={() => navigation.navigate('Login')}
      />
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.content}>
        <TouchableOpacity
          style={styles.backLink}
          onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back" size={24} color="#F5A623" />
          <Text style={styles.backLinkText}>Retour</Text>
        </TouchableOpacity>
        <Text style={styles.logo}>ActForGood</Text>
        <Text style={styles.title}>Créer un compte</Text>
        <Text style={styles.subtitle}>{TYPE_LABELS[userType]}</Text>

        {fields.map(renderField)}

        <TouchableOpacity
          style={[styles.submitButton, !isFormValid() && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={!isFormValid()}>
          <Text style={styles.submitButtonText}>S'inscrire</Text>
        </TouchableOpacity>

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
    paddingHorizontal: 40,
    paddingTop: 40,
    paddingBottom: 40,
  },
  backLink: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginBottom: 16,
  },
  backLinkText: {
    color: '#F5A623',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 4,
  },
  logo: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#F5A623',
    textAlign: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#1a1a1a',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: '#666',
    textAlign: 'center',
    marginBottom: 28,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 10,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e8e8e8',
    paddingHorizontal: 16,
  },
  inputWrapperMultiline: {
    alignItems: 'flex-start',
    minHeight: 100,
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
  inputMultiline: {
    minHeight: 80,
    textAlignVertical: 'top',
    paddingTop: 16,
    paddingBottom: 16,
  },
  passwordInput: {
    paddingRight: 16,
  },
  eyeIcon: {
    padding: 8,
    marginLeft: 8,
  },
  submitButton: {
    backgroundColor: '#F5A623',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 24,
  },
  submitButtonDisabled: {
    opacity: 0.5,
  },
  submitButtonText: {
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

export default RegisterFormScreen;
