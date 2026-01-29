import React, {useEffect} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {useSelector, useDispatch} from 'react-redux';
import {RootState} from '../store/store';
import {setUser} from '../store/slices/authSlice';
import authService from '../services/auth.service';
import {RootStackParamList, MainTabParamList} from '../types/navigation';

// Screens
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import HomeScreen from '../screens/home/HomeScreen';
import CampaignsScreen from '../screens/campaigns/CampaignsScreen';
import CampaignDetailScreen from '../screens/campaigns/CampaignDetailScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';
import DashboardScreen from '../screens/dashboard/DashboardScreen';

const Stack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

const AuthStack = () => (
  <Stack.Navigator screenOptions={{headerShown: false}}>
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="Register" component={RegisterScreen} />
  </Stack.Navigator>
);

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
  const {user} = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    // Check if user is already logged in
    const checkAuth = async () => {
      const storedUser = await authService.getUser();
      if (storedUser) {
        dispatch(setUser(storedUser));
      }
    };
    checkAuth();
  }, [dispatch]);

  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      {user ? (
        <>
          <Stack.Screen name="MainTabs" component={MainTabs} />
          <Stack.Screen name="CampaignDetail" component={CampaignDetailScreen} />
        </>
      ) : (
        <Stack.Screen name="Auth" component={AuthStack} />
      )}
    </Stack.Navigator>
  );
};

export default AppNavigator;
