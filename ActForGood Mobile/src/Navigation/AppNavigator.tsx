import React, {useEffect} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {useSelector, useDispatch} from 'react-redux';
import {RootState} from '../Store/store';
import {setUser} from '../Store/Slices/authSlice';
import authService from '../Services/auth.service';
import {RootStackParamList, MainTabParamList} from '../Types/navigation';

// Screens
import WelcomeScreen from '../Screens/Welcome/WelcomeScreen';
import LoginScreen from '../Screens/Auth/LoginScreen';
import RegisterScreen from '../Screens/Auth/RegisterScreen';
import RegisterFormScreen from '../Screens/Auth/RegisterFormScreen';
import HomeScreen from '../Screens/Home/HomeScreen';
import CampaignsScreen from '../Screens/Campaigns/CampaignsScreen';
import CampaignDetailScreen from '../Screens/Campaigns/CampaignDetailScreen';
import ProfileScreen from '../Screens/Profile/ProfileScreen';
import DashboardScreen from '../Screens/Dashboard/DashboardScreen';

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
  const dispatch = useDispatch();
  const {user, isGuest} = useSelector((state: RootState) => state.auth);
  const isAuthenticated = Boolean(user || isGuest);

  useEffect(() => {
    const checkAuth = async () => {
      const storedUser = await authService.getUser();
      if (storedUser) {
        dispatch(setUser(storedUser));
      }
    };
    checkAuth();
  }, [dispatch]);

  return (
    <Stack.Navigator
      screenOptions={{headerShown: false}}
      initialRouteName={isAuthenticated ? 'MainTabs' : 'Welcome'}>
      {isAuthenticated ? (
        <>
          <Stack.Screen name="MainTabs" component={MainTabs} />
          <Stack.Screen name="CampaignDetail" component={CampaignDetailScreen} />
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
