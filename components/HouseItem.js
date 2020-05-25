//This is an example code for Bottom Navigation//
import React from "react";
import theme from "../constants/theme.style.js";
import { scale, verticalScale, moderateScale } from "react-native-size-matters";

import Constants from "expo-constants"; //import react in our code.
import {
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  Platform,
  TextInput,
  DatePickerAndroid,
  Text,
  AsyncStorage,
  KeyboardAvoidingView,
  Dimensions,
  ImageBackground,
  RefreshControl,
} from "react-native";
import {
  Ionicons,
  MaterialCommunityIcons,
  SimpleLineIcons,
  MaterialIcons,
} from "@expo/vector-icons";

import { ScrollView, FlatList } from "react-native-gesture-handler";
import themeStyle from "../constants/theme.style.js";
const { width, height } = Dimensions.get("screen");
const API_URL = "http://mednat.ieeta.pt:8442";

//import all the basic component we have used

export default class Register extends React.Component {
  //Detail Screen to show from any Open detail button
  constructor(props) {
    super(props);
  }
  state = {
    email: "",
    first_name: "",
    last_name: "",
    password: "",
    height: "",
    current_weight: "",
    weight_goal: "",
    day: "Pick a day",
    sex: "",
    phone_number: "",
    photo: "../assets/tomas.png",
    photo_base64: "",
    number_of_servings: "",
    choosen_type_of_meal: "",
    dataSourceIngredients: [
      {
        compare: false,
        Name: "Arroz de Pato",
        Calories: 30,
        Proteins: 30,
        Fat: 40,
        Carbs: 50,
        id: 1,
        quantity: 100,
      },
    ],
    type_of_meal: [
      { label: "Traditional", value: "Traditional" },
      { label: "Fast Food", value: "Fast Food" },
    ],
    placeholder_1: {
      label: "Pick a type of meal",
      value: "0",
    },
    placeholder_2: {
      label: "Pick a meal",
      value: "0",
    },
  };

  async componentDidMount() {
    //this.handleIngredients();
  }

  renderHeart() {
    if (this.props.favorite) {
      return (
        <View style={{ flex: 0.5 }}>
          <View
            style={{
              flex: 0.2,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "flex-start",
              marginLeft: 10,
              marginTop: 10,
            }}
          >
            <TouchableOpacity
              style={{ flex: 0.2, justifyContent: "flex-start" }}
              onPress={() => {
                this.props.seguirRestaurante(this.props.codrestaurante, 1);
              }}
            >
              <Ionicons
                ios="md-heart"
                name="md-heart"
                size={moderateScale(40)}
                style={{ color: theme.red }}
              >
                {" "}
              </Ionicons>
            </TouchableOpacity>
          </View>
          <View style={{ flex: 0.8 }}></View>
        </View>
      );
    } else {
      return (
        <View style={{ flex: 0.5 }}>
          <View
            style={{
              flex: 0.2,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "flex-start",
              marginLeft: 10,
              marginTop: 10,
            }}
          >
            <TouchableOpacity
              style={{ flex: 0.2, justifyContent: "flex-start" }}
              onPress={() => {
                this.props.seguirRestaurante(this.props.codrestaurante, 0);
              }}
            >
              <Ionicons
                ios="md-heart-empty"
                name="md-heart-empty"
                size={moderateScale(40)}
                style={{ color: "white" }}
              >
                {" "}
              </Ionicons>
            </TouchableOpacity>
          </View>
          <View style={{ flex: 0.8 }}></View>
        </View>
      );
    }
  }

  render() {
    return (
      <View
        style={{
          height: moderateScale(300),
          borderColor: theme.gray,
          marginBottom: moderateScale(20),
          marginHorizontal: moderateScale(10),
        }}
      >
        <View
          style={{
            flex: 0.7,
            marginBottom: moderateScale(14),
            overflow: "hidden",
          }}
        >
          <ImageBackground
            borderTopLeftRadius={12}
            borderTopRightRadius={12}
            borderBottomRightRadius={12}
            borderBottomLeftRadius={12}
            imageStyle={{ opacity: 0.9 }}
            source={{ uri: this.props.photo }}
            style={{
              width: "100%",
              flex: 1,
            }}
          >
            <TouchableOpacity
              style={{
                flex: 1,
                flexDirection: "row",
                justifyContent: "space-between",
                backgroundColor: "rgba(0,0,0,0.5)",
                borderRadius: 12,
              }}
            >
              {this.renderHeart()}
              <View style={{ flex: 0.5 }}>
                <View
                  style={{
                    flex: 0.2,
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "flex-end",
                    marginRight: 10,
                    marginTop: 10,
                  }}
                >
                  <Text style={styles.ratingText}>{this.props.rating} </Text>
                  <Ionicons
                    name="ios-star"
                    size={moderateScale(30)}
                    style={{ color: "#f2b01e" }}
                  ></Ionicons>
                </View>
                <View style={{ flex: 0.8 }}></View>
              </View>
            </TouchableOpacity>
          </ImageBackground>
        </View>
        <View style={{ flex: 0.3, marginLeft: moderateScale(10) }}>
          <View style={{ flex: 0.33 }}>
            <Text style={styles.nameText}>{this.props.name}</Text>
          </View>
          <View style={{ flex: 0.33, flexDirection: "row" }}>
            <View
              style={{
                flex: 0.2,
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Text style={styles.priceText}>{this.props.price} €</Text>
            </View>
            <View
              style={{
                flex: 0.8,
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <View
                style={{
                  width: moderateScale(80),
                  height: moderateScale(26),
                  backgroundColor: theme.tertiary,
                  borderRadius: 10,
                  elevation: 4,
                  flex: 0.3,
                  opacity: 0.8,
                  justifyContent: "center",

                  alignItems: "center",
                }}
              >
                <Text style={styles.cityText}>{this.props.city}</Text>
              </View>
            </View>
          </View>
          <View
            style={{
              flex: 0.33,
              flexDirection: "row",
              justifyContent: "space-around",
            }}
          >
            <View
              style={{
                flex: 0.33,
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <TouchableOpacity>
                <Ionicons
                  style={styles.featureIcon}
                  name="ios-bed"
                  size={moderateScale(25)}
                  color="#8696A9"
                />
              </TouchableOpacity>
              <Text style={styles.featureText}>{this.props.rooms} Bedroom</Text>
            </View>
            <View
              style={{
                flex: 0.35,
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <TouchableOpacity>
                <MaterialCommunityIcons
                  style={styles.featureIcon}
                  name="shower"
                  size={moderateScale(25)}
                  color="#8696A9"
                />
              </TouchableOpacity>
              <Text style={styles.featureText}>
                {this.props.bathrooms} Bathroom
              </Text>
            </View>
            <View
              style={{
                flex: 0.33,
                flexDirection: "row",
                alignItems: "center",
                marginLeft: moderateScale(10),
              }}
            >
              <TouchableOpacity>
                <SimpleLineIcons
                  style={styles.featureIcon}
                  name="size-fullscreen"
                  size={moderateScale(20)}
                  color="#8696A9"
                />
              </TouchableOpacity>
              <Text style={styles.featureText}>{this.props.area} m2</Text>
            </View>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  nameText: {
    fontSize: moderateScale(20),
    color: "#3D5775",
  },
  ratingText: {
    fontSize: moderateScale(20),
    color: "white",
  },
  featureIcon: {},
  featureText: {
    fontSize: moderateScale(15),
    color: "#8696A9",
    fontWeight: "400",
    marginLeft: moderateScale(7),
  },
  cityText: {
    fontSize: moderateScale(15),
    color: "#0D2D53",
    fontWeight: "500",
  },
  priceText: {
    fontSize: moderateScale(20),
    color: "#0D2D53",
    fontWeight: "500",
  },
  secondHeaderText: {
    fontSize: moderateScale(20),
    textAlign: "left",
    width: "100%",
    color: "white",
    marginLeft: 10,
    fontWeight: "500",
  },
  squaretext: {
    fontSize: moderateScale(20),
    textAlign: "center",
    width: "100%",
    color: "white",
    fontWeight: "bold",
  },
  squareView: {
    flex: 1,
    width: moderateScale(75),
    height: moderateScale(75),
    marginVertical: width * 0.03,
    marginHorizontal: moderateScale(11),
    borderRadius: moderateScale(10),
    backgroundColor: theme.primary_color_2,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },

  addButton: {
    shadowColor: "rgba(0,0,0, .4)", // IOS
    backgroundColor: theme.primary_color,
    shadowOffset: { height: 1, width: 1 }, // IOS
    shadowOpacity: 1, // IOS
    shadowRadius: 1, //IOS
    elevation: 2, // Android
    width: moderateScale(70),
    height: moderateScale(70),
    right: 30,
    bottom: 30,
    borderRadius: 40,
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
  },
  loginGoogleButton: {
    shadowColor: "rgba(0,0,0, .4)", // IOS
    backgroundColor: "#fb5b5a",
    shadowOffset: { height: 1, width: 1 }, // IOS
    shadowOpacity: 1, // IOS
    shadowRadius: 1, //IOS
    elevation: 2, // Android
    width: moderateScale(150),
    height: moderateScale(40),
    margin: 10,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  loginButtonText: {
    textAlign: "center",
    color: "#FFF",
    fontWeight: "700",
    width: "100%",
    fontSize: moderateScale(25),
  },
  loginText: {
    color: "white",
  },
  photoText: {
    color: theme.primary_color,
  },
  photoButton: {
    width: "80%",
    backgroundColor: theme.white,
    borderRadius: 5,
    height: 45,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40,
    marginBottom: 10,
  },
  container: {
    marginTop: Platform.OS === "ios" ? 0 : Constants.statusBarHeight,
    flex: 1,
    //backgroundColor: theme.primary_color,
    alignItems: "center",

    justifyContent: "center",
  },

  containerScroll: {
    flex: 0.4,
    marginLeft: 10,
    marginTop: 10,
    //backgroundColor: theme.black,
    alignItems: "flex-start",
    justifyContent: "flex-start",
  },

  inputView: {
    width: "80%",
    backgroundColor: theme.white,
    color: theme.primary_color,
    borderColor: theme.primary_color_2,
    borderWidth: 2,
    borderRadius: 20,
    height: 45,
    marginBottom: 20,
    justifyContent: "center",
    padding: 20,
  },
  inputView3: {
    width: "30%",
    backgroundColor: theme.white,
    color: theme.primary_color,
    borderColor: theme.primary_color_2,
    borderWidth: 2,
    borderRadius: 10,
    height: 10,

    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 5,
  },

  inputView_2: {
    flex: 0.6,
    backgroundColor: theme.white,
    color: theme.primary_color,
    borderColor: theme.primary_color_2,
    borderWidth: 2,
    borderRadius: 20,
    height: 45,
    marginBottom: 20,
    justifyContent: "center",
    padding: 20,
  },

  birthday_placeholder: {
    fontSize: 0.02 * height,
    paddingHorizontal: 5,
    paddingVertical: 4,
    height: height * 0.05,
    color: "#FFFFFF",
    fontWeight: "normal",
    paddingRight: 30, // to ensure the text is never behind the icon
  },

  inputText: {
    fontSize: 0.02 * height,
    paddingHorizontal: 5,
    paddingVertical: 4,
    height: height * 0.05,
    color: "black",
    fontWeight: "normal",
    paddingRight: 30, // to ensure the text is never behind the icon
  },
  inputText3: {
    fontSize: 0.02 * height,
    textAlign: "center",
    paddingVertical: 2,
    height: height * 0.05,
    color: "black",
    fontWeight: "normal",
  },

  forgot: {
    color: theme.white,
    fontSize: 14,
  },

  loginBtn: {
    width: "80%",
    backgroundColor: "#fb5b5a",
    borderRadius: 25,
    height: 45,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40,
    marginBottom: 10,
  },

  register_title: {
    fontSize: theme.h2,
    color: theme.black,
    fontWeight: "bold",
  },

  logo_text: {
    fontSize: theme.h1,
    color: theme.white,
    fontWeight: "bold",
  },

  icon: {
    color: "#636e72",
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 0.02 * height,
    paddingVertical: 12,
    paddingHorizontal: 10,
    height: height * 0.05,

    color: "black",
    fontWeight: "normal",
    paddingRight: 30, // to ensure the text is never behind the icon
  },
  inputAndroid: {
    fontSize: 0.02 * height,
    paddingHorizontal: 5,
    paddingVertical: 4,
    height: height * 0.05,
    color: "black",
    fontWeight: "normal",
    paddingRight: 30, // to ensure the text is never behind the icon
  },
});
