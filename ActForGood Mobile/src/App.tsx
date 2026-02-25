import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import {NavigationContainer} from '@react-navigation/native';
import {useFonts} from 'expo-font';
import React from 'react';
import {ActivityIndicator, StyleSheet, View} from 'react-native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {PaperProvider} from 'react-native-paper';
import AppNavigator from './Presentation/Navigation/AppNavigator';

const App: React.FC = () => {
  const [fontsLoaded] = useFonts({
    ...MaterialIcons.font,
  });

  if (!fontsLoaded) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#F5A623" />
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <PaperProvider>
        <NavigationContainer>
          <AppNavigator />
        </NavigationContainer>
      </PaperProvider>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});

export default App;
