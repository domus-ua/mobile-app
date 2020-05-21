//This is an example code for Bottom Navigation//
import React from "react";
//import react in our code.
import {
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  StyleSheet,
  Image,
  AsyncStorage,
  ActivityIndicator,
  RefreshControl,
  TextInput
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { moderateScale } from "react-native-size-matters";
const { width, height } = Dimensions.get("screen");
import theme from "../constants/theme.style.js";

export default class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      displaySearchString:"",
      searchString: "",
      SharedLoading: true,
      userName: null,
      userPassword: null,
      userToken: null,
      userCode: null,
      name: null,
      nameCompany: null,
      baseURL: "http://192.168.160.220:8080/",
      data: null,
      ndepartments: null,
      nrooms: null,
      nteams: null,
      nsuspectemployees: null,
      npersons: null,
      nbadaccesses: null,
      refreshing: false
    };
  }

  async getInfo() {
    const { userCode, userToken, baseURL, userName, userPassword } = this.state;

    login_info = "Basic " + Base64.btoa(userName + ":" + userPassword);

    // fetch data
    fetch(baseURL + "api/v1/app_info", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: login_info
      }
    })
      .then(response => {
        if (!response.ok) throw new Error(response.status);
        else return response.json();
      })
      .then(data => {
        this.setState({
          ndepartments: data["ndepartments"],
          nrooms: data["nrooms"],
          nteams: data["nteams"],
          nsuspectemployees: data["nsuspectEmployees"],
          npersons: data["npersons"],
          nbadaccesses: data["nbadAccess"],
          isLoading: false,
          refreshing: false
        });
      })
      .catch(error => {
        console.log("error: " + error);
      });
  }

  _retrieveData = async () => {
    try {
      const userName = await AsyncStorage.getItem("username");
      const name = await AsyncStorage.getItem("name");
      const nameCompany = await AsyncStorage.getItem("nameCompany");

      const pwd = await AsyncStorage.getItem("pwd");
      const value = await AsyncStorage.getItem("cod");
      const token = await AsyncStorage.getItem("token");
      console.log(userName, name, nameCompany, pwd, value, token);
      if (
        value !== null &&
        pwd !== null &&
        userName !== null &&
        token !== null
      ) {
        // We have data!!

        this.setState({
          SharedLoading: false,
          userCode: value,
          userToken: token,
          userName: userName,
          userPassword: pwd,
          nameCompany: nameCompany,
          name: name,
          isLoading: true
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  handleRefresh = () => {
    // Refresh a zona de filtros tambem?

    this.setState(
      {
        refreshing: true
      },
      () => {
        this.getInfo();
      }
    );
  };

  async componentDidMount() {
    await this._retrieveData();
    if (this.state.SharedLoading == false) {
      this.getInfo();
    }
  }
  render() {
    if (this.state.isLoading) {
      return (
        <View style={styles.container}>
          <ActivityIndicator size={"large"} />
        </View>
      );
    } else {
      return (
        <View style={styles.container}>
          <View style={{ flex: 0.2}}>
            <View style={styles.searchSection}>
              <TextInput
                style={styles.input}
                placeholder="Find a Room in"
                onChangeText={searchString => {
                  this.setState({ searchString });
                }}
                underlineColorAndroid="transparent"
              />
              <TouchableOpacity>
                <Ionicons
                  style={styles.searchIcon}
                  name="md-search"
                  size={moderateScale(25)}
                  color="black"
                />
              </TouchableOpacity>
            </View>
            <View style={styles.querySection}>
              <Text style={styles.queryText}>{this.state.displaySearchString}</Text>
            </View>
          </View>
          <View style={{ flex: 0.8 }}></View>
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 30
  },
  squareView: {
    flex: 1,
    width: moderateScale(150),
    height: moderateScale(150),
    marginVertical: width * 0.03,
    marginHorizontal: moderateScale(11),
    borderRadius: moderateScale(10),
    backgroundColor: "#fea01c",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4
  },
  squareView2: {
    flex: 1,
    width: moderateScale(150),
    height: moderateScale(150),
    marginVertical: width * 0.03,
    marginHorizontal: moderateScale(11),
    borderRadius: moderateScale(10),
    backgroundColor: "#a23cb6",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4
  },
  squareView3: {
    flex: 1,
    width: moderateScale(150),
    height: moderateScale(150),
    marginVertical: width * 0.03,
    marginHorizontal: moderateScale(11),
    borderRadius: moderateScale(10),
    backgroundColor: "#5ab25e",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4
  },
  squareView4: {
    flex: 1,
    width: moderateScale(150),
    height: moderateScale(150),
    marginVertical: width * 0.03,
    marginHorizontal: moderateScale(11),
    borderRadius: moderateScale(10),
    backgroundColor: "#4caf50",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4
  },
  squareView5: {
    flex: 1,
    width: moderateScale(150),
    height: moderateScale(150),
    marginVertical: width * 0.03,
    marginHorizontal: moderateScale(11),
    borderRadius: moderateScale(10),
    backgroundColor: "#ea4744",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4
  },
  squareView6: {
    flex: 1,
    width: moderateScale(150),
    height: moderateScale(150),
    marginVertical: width * 0.03,
    marginHorizontal: moderateScale(11),
    borderRadius: moderateScale(10),
    backgroundColor: "#1cbfd3",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4
  },
  squaretext: {
    fontSize: moderateScale(30),
    textAlign: "center",
    width: "100%",
    color: "white",
    fontWeight: "bold"
  },
  searchSection: {
    flex: 0.5,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: moderateScale(25)
  },
  querySection: {
    flex: 0.5,
    marginHorizontal:moderateScale(25)
  },
  searchIcon: {
    padding: 10,
    backgroundColor: "gray",
    opacity: 0.1,
    borderRadius: 40
  },
  input: {
    flex: 1,
    paddingTop: 10,
    paddingRight: 10,
    paddingBottom: 10,
    paddingLeft: 0,
    fontSize: moderateScale(22),
    backgroundColor: "#fff",
    color: "#424242"
  },
  queryText:{
    
    fontSize: moderateScale(34),
    textDecorationLine:"underline",
    color: "#FF6E6C"
  }
});

const chars =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
const Base64 = {
  btoa: (input: string = "") => {
    let str = input;
    let output = "";

    for (
      let block = 0, charCode, i = 0, map = chars;
      str.charAt(i | 0) || ((map = "="), i % 1);
      output += map.charAt(63 & (block >> (8 - (i % 1) * 8)))
    ) {
      charCode = str.charCodeAt((i += 3 / 4));

      if (charCode > 0xff) {
        throw new Error(
          "'btoa' failed: The string to be encoded contains characters outside of the Latin1 range."
        );
      }

      block = (block << 8) | charCode;
    }

    return output;
  },

  atob: (input: string = "") => {
    let str = input.replace(/=+$/, "");
    let output = "";

    if (str.length % 4 == 1) {
      throw new Error(
        "'atob' failed: The string to be decoded is not correctly encoded."
      );
    }
    for (
      let bc = 0, bs = 0, buffer, i = 0;
      (buffer = str.charAt(i++));
      ~buffer && ((bs = bc % 4 ? bs * 64 + buffer : buffer), bc++ % 4)
        ? (output += String.fromCharCode(255 & (bs >> ((-2 * bc) & 6))))
        : 0
    ) {
      buffer = chars.indexOf(buffer);
    }

    return output;
  }
};
