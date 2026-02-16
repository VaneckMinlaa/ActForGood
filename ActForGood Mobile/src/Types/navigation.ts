import {StackScreenProps} from '@react-navigation/stack';
import {BottomTabScreenProps} from '@react-navigation/bottom-tabs';

export type UserType = 'DONOR' | 'ONG' | 'ORPHANAGE' | 'PARTNER';

export type RootStackParamList = {
  Welcome: undefined;
  Auth: undefined;
  MainTabs: undefined;
  CampaignDetail: {id: string};
  Login: undefined;
  Register: undefined;
  RegisterForm: {userType: UserType};
};

export type MainTabParamList = {
  Home: undefined;
  Campaigns: undefined;
  Dashboard: undefined;
  Profile: undefined;
};

export type RootStackScreenProps<T extends keyof RootStackParamList> =
  StackScreenProps<RootStackParamList, T>;

export type MainTabScreenProps<T extends keyof MainTabParamList> =
  BottomTabScreenProps<MainTabParamList, T>;

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
