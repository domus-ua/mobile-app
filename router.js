//This is an example code for Bottom Navigation//
import React from "react";
import {
  Button,
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  Platform,
  StatusBar,
} from "react-native";
import { Ionicons, Foundation, AntDesign } from "@expo/vector-icons";

//import all the basic component we have used
//import Ionicons to show the icon for bottom options
//For React Navigation 2.+ import following
//import {createStackNavigator,createBottomTabNavigator} from 'react-navigation';
//For React Navigation 3.+ import following
import { createAppContainer, createSwitchNavigator } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
import { createBottomTabNavigator } from "react-navigation-tabs";

//import createStackNavigator, createBottomTabNavigator, createAppContainer in our project

import Login from "./screens/Login";
import AuthLoadingScreen from "./components/auth/AuthLoadingScreen";
import HeaderRightNavBar from "./components/HeaderRightNavBar";
import theme from "./constants/theme.style.js";
import HouseDetail from "./screens/HouseDetail";
import Profile from "./screens/Profile";
import Wishlist from "./screens/Wishlist";



import Home from "./screens/Home";

const LoginStack = createStackNavigator(
  //SignedOut Stack
  {
    //Defination of Navigaton from home screen
    Login: {
      screen: Login,
      navigationOptions: {
        header: null,
      },
    },
  },
  {
    //For React Navigation 2.+ change defaultNavigationOptions->navigationOptions
    defaultNavigationOptions: {
      //Header customization of the perticular Screen

      headerStyle: {
        marginTop: Platform.OS === "android" ? 0 : 20,
      },
    },
  }
);

const HouseStackNoLogin = createStackNavigator(
  //SignedOut Stack
  {
    //Defination of Navigaton from home screen
    HomeNoLogin: {
      screen: Home,
      
    },
    HouseDetail: {
      screen: HouseDetail,
    },
  },
  {
    //For React Navigation 2.+ change defaultNavigationOptions->navigationOptions
    defaultNavigationOptions: {
      //Header customization of the perticular Screen

      header: null,
    },
  }
);

const HouseStack = createStackNavigator(
  //SignedOut Stack
  {
    //Defination of Navigaton from home screen
    Home: {
      screen: Home,
    },
    HouseDetail: {
      screen: HouseDetail,
    },
  },
  {
    //For React Navigation 2.+ change defaultNavigationOptions->navigationOptions
    defaultNavigationOptions: {
      //Header customization of the perticular Screen

      header: null,
    },
  }
);

const ProfileStack = createStackNavigator(
  //SignedOut Stack
  {
    //Defination of Navigaton from home screen
    Profile: {
      screen: Profile,
    },
    Wishlist: {
      screen: Wishlist,
    },
    HouseDetail: {
      screen: HouseDetail,
    },
  },
  {
    //For React Navigation 2.+ change defaultNavigationOptions->navigationOptions
    defaultNavigationOptions: {
      //Header customization of the perticular Screen

      header: null,
    },
  }
);

const AppNavigatorNoLogin = createBottomTabNavigator(
  //Signed In Stack
  {
    Home: {
      screen: HouseStackNoLogin,
      navigationOptions: {
        tabBarLabel: "Houses",
        tabBarIcon: ({ tintColor }) => (
          <Ionicons name="md-home" color={tintColor} size={25} />
        ),
      },
    },
    Login: {
      screen: Login,
      navigationOptions: {
        tabBarLabel: "Login",
        tabBarVisible: false,
        tabBarIcon: ({ tintColor }) => (
          <Ionicons name="md-person" color={tintColor} size={25} />
        ),
      },
    },
  },
  {
    defaultNavigationOptions: ({ navigation }) => ({
      header: null,
    }),
    tabBarOptions: {
      activeTintColor: theme.primary_color,
      inactiveTintColor: "gray",
    },
  }
);

const AppNavigator = createBottomTabNavigator(
  //Signed In Stack
  {
    Home: {
      screen: HouseStack,
      navigationOptions: {
        tabBarLabel: "Houses",
        tabBarIcon: ({ tintColor }) => (
          <Ionicons name="md-home" color={tintColor} size={25} />
        ),
      },
    },

    Profile: {
      screen: ProfileStack,
      navigationOptions: {
        tabBarLabel: "Profile",
        tabBarIcon: ({ tintColor }) => (
          <Ionicons name="md-person" color={tintColor} size={25} />
        ),
      },
    },
  },
  {
    defaultNavigationOptions: ({ navigation }) => ({
      header: null,
    }),
    tabBarOptions: {
      activeTintColor: theme.primary_color,
      inactiveTintColor: "gray",
    },
  }
);

//For React Navigation 2.+ need to export App only
//export default App;
//For React Navigation 3.+

//Business Mode Routing, mudar nas opçoes
const AppNavigatorFinal = createSwitchNavigator(
  {
    App: {
      screen: AppNavigator,
    },
    AppNoLogin: {
      screen: AppNavigatorNoLogin,
    },

    Auth: {
      screen: LoginStack,
    },
    AuthLoading: AuthLoadingScreen,
  },
  {
    initialRouteName: "AuthLoading",
  }
);

export default createAppContainer(AppNavigatorFinal);
