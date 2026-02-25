import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput as RNTextInput,
  Text,
  Alert,
} from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import * as DocumentPicker from 'expo-document-picker';

const MAX_FILE_MB = 5;

export type OngFormData = {
  organizationName: string;
  registrationNumber: string;
  missionAndObjectives: string;
  contactName: string;
  email: string;
  phone: string;
  postalAddress: string;
  password: string;
  statutesDocumentUri?: string;
  financialReportUri?: string;
  campaignTitle?: string;
  campaignDescription?: string;
  campaignTargetAmount?: string;
  campaignDurationDays?: string;
};

const STEP_TITLES = [
  'Informations générales',
  'Coordonnées',
  'Pièces justificatives',
  'Créer une campagne (optionnel)',
];

type Props = {
  onComplete: (data: OngFormData) => void;
  onBack: () => void;
  onLogin: () => void;
};

const RegisterOngSteps: React.FC<Props> = ({onComplete, onBack, onLogin}) => {
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [values, setValues] = useState<OngFormData>({
    organizationName: '',
    registrationNumber: '',
    missionAndObjectives: '',
    contactName: '',
    email: '',
    phone: '',
    postalAddress: '',
    password: '',
    campaignTitle: '',
    campaignDescription: '',
    campaignTargetAmount: '',
    campaignDurationDays: '',
  });

  const update = (key: keyof OngFormData, value: string) => {
    setValues(prev => ({...prev, [key]: value}));
  };

  const pickDocument = async (key: 'statutesDocumentUri' | 'financialReportUri') => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/pdf',
        copyToCacheDirectory: true,
      });
      if (result.canceled) return;
      const file = result.assets[0];
      const sizeMB = (file.size ?? 0) / (1024 * 1024);
      if (sizeMB > MAX_FILE_MB) {
        Alert.alert('Fichier trop volumineux', `Taille max : ${MAX_FILE_MB} MB`);
        return;
      }
      update(key, file.uri);
    } catch (e) {
      Alert.alert('Erreur', 'Impossible d\'ouvrir le sélecteur de fichiers.');
    }
  };

  const isStep1Valid = () =>
    values.organizationName.trim().length > 0 && values.registrationNumber.trim().length > 0;

  const isStep2Valid = () =>
    values.contactName.trim().length > 0 &&
    values.email.trim().length > 0 &&
    values.phone.trim().length > 0 &&
    values.postalAddress.trim().length > 0 &&
    values.password.trim().length > 0;

  const isStep3Valid = () =>
    (values.statutesDocumentUri ?? '').length > 0 &&
    (values.financialReportUri ?? '').length > 0;

  const canGoNext = () => {
    if (step === 1) return isStep1Valid();
    if (step === 2) return isStep2Valid();
    if (step === 3) return isStep3Valid();
    return true;
  };

  const handleNext = () => {
    if (step < 4) setStep(step + 1);
    else handleSubmit();
  };

  const handleSubmit = () => {
    onComplete(values);
  };

  const renderStepIndicator = () => (
    <View style={styles.stepIndicator}>
      {[1, 2, 3, 4].map(i => (
        <View
          key={i}
          style={[
            styles.stepDot,
            i === step && styles.stepDotActive,
            i < step && styles.stepDotDone,
          ]}
        />
      ))}
      <Text style={styles.stepText}>Étape {step} / 4</Text>
    </View>
  );

  const renderInput = (
    key: keyof OngFormData,
    label: string,
    placeholder: string,
    icon: string,
    options?: { multiline?: boolean; keyboardType?: 'default' | 'email-address' | 'phone-pad' | 'numeric' }
  ) => (
    <View style={styles.inputContainer}>
      <Text style={styles.label}>{label}</Text>
      <View style={[styles.inputWrapper, options?.multiline && styles.inputWrapperMultiline]}>
        <MaterialIcons name={icon as any} size={22} color="#999" style={styles.inputIcon} />
        <RNTextInput
          value={values[key] as string}
          onChangeText={v => update(key, v)}
          placeholder={placeholder}
          placeholderTextColor="#999"
          multiline={options?.multiline}
          numberOfLines={options?.multiline ? 4 : 1}
          keyboardType={options?.keyboardType ?? 'default'}
          style={[styles.input, options?.multiline && styles.inputMultiline]}
        />
      </View>
    </View>
  );

  const renderFileBlock = (
    key: 'statutesDocumentUri' | 'financialReportUri',
    title: string,
    subtitle: string
  ) => {
    const uri = values[key];
    return (
      <View style={styles.fileBlock}>
        <MaterialIcons name="cloud-upload" size={32} color="#F5A623" style={styles.fileIcon} />
        <Text style={styles.fileTitle}>{title}</Text>
        <Text style={styles.fileSubtitle}>{subtitle}</Text>
        <TouchableOpacity
          style={styles.fileButton}
          onPress={() => pickDocument(key)}>
          <Text style={styles.fileButtonText}>
            {uri ? 'Fichier choisi' : 'Choisir un fichier'}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        <TouchableOpacity style={styles.backLink} onPress={onBack}>
          <MaterialIcons name="arrow-back" size={24} color="#F5A623" />
        </TouchableOpacity>
        <Text style={styles.title}>Enregistrement ONG</Text>
        {renderStepIndicator()}
        <Text style={styles.sectionTitle}>{STEP_TITLES[step - 1]}</Text>

        {step === 1 && (
          <>
            {renderInput(
              'organizationName',
              'Nom de l\'organisation',
              'Nom complet de l\'ONG',
              'business'
            )}
            {renderInput(
              'registrationNumber',
              'Numéro d\'enregistrement',
              'Ex: 123456789 (Registre des Associations)',
              'label'
            )}
            {renderInput(
              'missionAndObjectives',
              'Mission et objectifs',
              'Décrivez la mission principale et les objectifs de votre organisation...',
              'description',
              { multiline: true }
            )}
          </>
        )}

        {step === 2 && (
          <>
            {renderInput(
              'contactName',
              'Nom du contact',
              'Nom et prénom du représentant légal',
              'person'
            )}
            {renderInput('email', 'Adresse e-mail', 'exemple@organisation.org', 'email', { keyboardType: 'email-address' })}
            {renderInput('phone', 'Numéro de téléphone', '+237 6 XX XX XX XX', 'phone', { keyboardType: 'phone-pad' })}
            {renderInput(
              'postalAddress',
              'Adresse postale',
              'Rue, ville, code postal, pays',
              'location-on'
            )}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Mot de passe</Text>
              <View style={styles.inputWrapper}>
                <MaterialIcons name="lock" size={22} color="#999" style={styles.inputIcon} />
                <RNTextInput
                  value={values.password}
                  onChangeText={v => update('password', v)}
                  placeholder="Choisissez un mot de passe"
                  placeholderTextColor="#999"
                  secureTextEntry={!showPassword}
                  style={[styles.input, styles.passwordInput]}
                />
                <TouchableOpacity style={styles.eyeIcon} onPress={() => setShowPassword(!showPassword)}>
                  <MaterialIcons name={showPassword ? 'visibility' : 'visibility-off'} size={22} color="#666" />
                </TouchableOpacity>
              </View>
            </View>
          </>
        )}

        {step === 3 && (
          <>
            {renderFileBlock(
              'statutesDocumentUri',
              'Statuts et récépissé de déclaration',
              'Téléchargez votre document officiel (format PDF, max 5MB).'
            )}
            {renderFileBlock(
              'financialReportUri',
              'Rapport financier de l\'année précédente',
              'Fournissez un aperçu de vos activités financières récentes (format PDF, max 5MB).'
            )}
          </>
        )}

        {step === 4 && (
          <>
            {renderInput(
              'campaignTitle',
              'Titre de la campagne',
              'Ex: Soutien aux enfants orphelins',
              'flag'
            )}
            {renderInput(
              'campaignDescription',
              'Description de la campagne',
              'Décrivez l\'objectif, les besoins et l\'impact attendu de votre campagne...',
              'description',
              { multiline: true }
            )}
            <View style={styles.row}>
              <View style={styles.halfInput}>
                {renderInput(
                  'campaignTargetAmount',
                  'Montant ciblé (FCFA)',
                  'Ex: 500000',
                  'payments',
                  { keyboardType: 'numeric' }
                )}
              </View>
              <View style={styles.halfInput}>
                {renderInput(
                  'campaignDurationDays',
                  'Durée (jours)',
                  'Ex: 30',
                  'event',
                  { keyboardType: 'numeric' }
                )}
              </View>
            </View>
          </>
        )}

        <View style={styles.buttonsRow}>
          
          <TouchableOpacity
            style={[styles.primaryButton, !canGoNext() && step < 4 && styles.primaryButtonDisabled]}
            onPress={handleNext}
            disabled={step < 4 && !canGoNext()}>
            <Text style={styles.primaryButtonText}>
              {step < 4 ? 'Suivant' : 'Enregistrer l\'ONG'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.loginContainer}>
          <Text style={styles.loginText}>Déjà un compte ? </Text>
          <TouchableOpacity onPress={onLogin}>
            <Text style={styles.loginLink}>Se connecter</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: '#fff' },
  content: { paddingHorizontal: 24, paddingTop: 48, paddingBottom: 40 },
  backLink: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  backLinkText: { color: '#F5A623', fontSize: 16, fontWeight: '600', marginLeft: 4 },
  logo: { fontSize: 26, fontWeight: '800', color: '#F5A623', textAlign: 'center', marginBottom: 8 },
  title: { fontSize: 22, fontWeight: 'bold', color: '#F5A623', textAlign: 'center', marginBottom: 20 },
  stepIndicator: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 24 },
  stepDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#e0e0e0', marginHorizontal: 4 },
  stepDotActive: { backgroundColor: '#F5A623', transform: [{ scale: 1.2 }] },
  stepDotDone: { backgroundColor: '#F5A623', opacity: 0.6 },
  stepText: { marginLeft: 12, fontSize: 14, color: '#666' },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#F5A623', marginBottom: 20, textAlign: 'center' },
  inputContainer: { marginBottom: 18 },
  label: { fontSize: 14, fontWeight: '600', color: '#1a1a1a', marginBottom: 8 },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e8e8e8',
    paddingHorizontal: 16,
  },
  inputWrapperMultiline: { alignItems: 'flex-start', minHeight: 100 },
  inputIcon: { marginRight: 12 },
  input: { flex: 1, paddingVertical: 14, fontSize: 16, color: '#1a1a1a' },
  inputMultiline: { minHeight: 90, textAlignVertical: 'top', paddingTop: 14 },
  passwordInput: { paddingRight: 16 },
  eyeIcon: { padding: 8, marginLeft: 8 },
  row: { flexDirection: 'row', marginHorizontal: -8 },
  halfInput: { flex: 1, marginHorizontal: 8 },
  fileBlock: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e8e8e8',
    padding: 20,
    marginBottom: 16,
    alignItems: 'center',
  },
  fileIcon: { marginBottom: 8 },
  fileTitle: { fontSize: 15, fontWeight: '600', color: '#1a1a1a', marginBottom: 4, textAlign: 'center' },
  fileSubtitle: { fontSize: 13, color: '#666', marginBottom: 12, textAlign: 'center' },
  fileButton: {
    backgroundColor: '#e8e8e8',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  fileButtonText: { fontSize: 14, fontWeight: '600', color: '#1a1a1a' },
  buttonsRow: { flexDirection: 'row', marginTop: 28, marginBottom: 24, gap: 12 },
  primaryButton: {
    flex: 1,
    backgroundColor: '#F5A623',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  primaryButtonDisabled: { opacity: 0.5 },
  primaryButtonText: { color: '#1a1a1a', fontSize: 16, fontWeight: '700' },
  secondaryButton: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#F5A623',
    justifyContent: 'center',
  },
  secondaryButtonText: { color: '#F5A623', fontSize: 16, fontWeight: '600' },
  loginContainer: { flexDirection: 'row', justifyContent: 'center' },
  loginText: { color: '#666', fontSize: 14 },
  loginLink: { color: '#F5A623', fontSize: 14, fontWeight: '700' },
});

export default RegisterOngSteps;
