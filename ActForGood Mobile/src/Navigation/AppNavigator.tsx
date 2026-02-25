import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createStackNavigator} from '@react-navigation/stack';
import React, {useEffect} from 'react';
import authRepository from '../Repository/auth.repository';
import {MainTabParamList, RootStackParamList} from '../Types/navigation';
import {useAuthViewModel} from '../ViewModel/useAuthViewModel';

// Screens
import LoginScreen from '../Presentation/Screens/Auth/LoginScreen';
import RegisterFormScreen from '../Presentation/Screens/Auth/RegisterFormScreen';
import RegisterScreen from '../Presentation/Screens/Auth/RegisterScreen';
import CampaignDetailScreen from '../Presentation/Screens/Campaigns/CampaignDetailScreen';
import CampaignsScreen from '../Presentation/Screens/Campaigns/CampaignsScreen';
import DashboardScreen from '../Presentation/Screens/Dashboard/DashboardScreen';
import HomeScreen from '../Presentation/Screens/Home/HomeScreen';
import ProfileScreen from '../Presentation/Screens/Profile/ProfileScreen';
import WelcomeScreen from '../Presentation/Screens/Welcome/WelcomeScreen';

const Stack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

const MainTabs = () => (
  <Tab.Navigator>
    <Tab.Screen name="Home" component={HomeScreen} />
    <Tab.Screen name="Campaigns" component={CampaignsScreen} />
    <Tab.Screen name="Dashboard" component={DashboardScreen} />
    <Tab.Screen name="Profile" component={ProfileScreen} />
  </Tab.Navigator>
);

const AppNavigator: React.FC = () => {
  const {user, isGuest, setUser} = useAuthViewModel();
  const isAuthenticated = Boolean(user || isGuest);

  useEffect(() => {
    const checkAuth = async () => {
      const storedUser = await authRepository.getUser();
      if (storedUser) {
        setUser(storedUser);
      }
    };
    checkAuth();
  }, [setUser]);

  return (
    <Stack.Navigator
      screenOptions={{headerShown: false}}
      initialRouteName={isAuthenticated ? 'MainTabs' : 'Welcome'}>
      {isAuthenticated ? (
        <>
          <Stack.Screen name="MainTabs" component={MainTabs} />
          <Stack.Screen
            name="CampaignDetail"
            component={CampaignDetailScreen}
          />
        </>
      ) : (
        <>
          <Stack.Screen name="Welcome" component={WelcomeScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen name="RegisterForm" component={RegisterFormScreen} />
        </>
      )}
    </Stack.Navigator>
  );
};

export default AppNavigator;
