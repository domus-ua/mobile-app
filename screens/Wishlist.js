//This is an example code for Bottom Navigation//
import React from "react";
import BottomSheet from "reanimated-bottom-sheet";
import { LinearGradient } from "expo-linear-gradient";

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
  TextInput,
  FlatList,
} from "react-native";
import Animated from "react-native-reanimated";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { moderateScale } from "react-native-size-matters";
const { width, height } = Dimensions.get("screen");
import theme from "../constants/theme.style.js";
import OfflineNotice from "../components/OfflineNotice";
import HouseItem from "../components/HouseItemWishlist";
import { NavigationEvents } from "react-navigation";

export default class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      displaySearchString: "",
      searchString: "",
      SharedLoading: true,
      refresh: false,
      bedroomNo1: false,
      bedroomNo2: false,
      bedroomNo3: false,
      bedroomNo4: false,
      bedroomNo5: false,
      higherRating: false,
      lowerRating: false,
      higherPrice: false,
      lowerPrice: false,
      isLoading: true,
      userName: null,
      userPassword: null,
      userToken: null,
      userCode: null,
      city: null,
      minPrice: "",
      maxPrice: "",
      baseURL: "http://192.168.160.60:8080/",

      refreshing: false,
      houseDataSource: [],
    };
  }
  async getInfo() {
    const { baseURL, userName, userPassword, houseId, userCode } = this.state;

    console.log(baseURL + "api/locatarios/wishlist/" + userCode);
    // fetch data
    fetch(baseURL + "api/locatarios/wishlist/" + userCode, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) throw new Error(response.status);
        else return response.json();
      })
      .then((data) => {
        console.log(data);
        this.setState({
          houseDataSource: data,
        });
        console.log(data["street"]);
      })
      .catch((error) => {
        console.log("error: " + error);
      });
  }

  async getInfo() {
    const { baseURL, userName, userPassword, houseId, userCode } = this.state;

    console.log(baseURL + "api/locatarios/wishlist/" + userCode);
    // fetch data
    fetch(baseURL + "api/locatarios/wishlist/" + userCode, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) throw new Error(response.status);
        else return response.json();
      })
      .then((data) => {
        console.log(data);
        this.setState({
          houseDataSource: data,
          isLoading: false,
          refresh: false,
        });
      })
      .catch((error) => {
        console.log("error: " + error);
      });
  }

  _retrieveData = async () => {
    try {
      const value = await AsyncStorage.getItem("cod");
      const userName = await AsyncStorage.getItem("username");
      const userPassword = await AsyncStorage.getItem("pwd");

      if (value !== null) {
        // We have data!!

        this.setState({
          SharedLoading: false,
          userName: userName,
          userPassword: userPassword,
          userCode: value,
        });
      } else {
        this.setState({
          SharedLoading: false,
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
        refresh: true,
      },
      () => {
        this.getInfo();
      }
    );
  };

  async componentDidMount() {
    await this._retrieveData();
    if (this.state.SharedLoading == false) {
      console.log(this.state.userCode);
      this.getInfo();
    }
  }

  _listEmptyComponent = () => {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          padding: 10,
          margin: 10,
          borderRadius: 10,
        }}
      >
        <Text style={{ fontSize: 20, textAlign: "center", color: theme.black }}>
          There are no houses in your wishlist 😔
        </Text>
      </View>
    );
  };

  renderFooterList = () => {
    return <View style={{ paddingVertical: 40 }}></View>;
  };

  renderList() {
    const { searchType, refresh } = this.state;

    return (
      <View style={{ flex: 1 }}>
        <FlatList
          Vertical
          showsVericalScrollIndicator={false}
          data={this.state.houseDataSource}
          extraData={this.state.refresh}
          ListEmptyComponent={this._listEmptyComponent}
          ListFooterComponent={this.renderFooterList}
          refreshControl={
            <RefreshControl
              refreshing={refresh}
              onRefresh={this.handleRefresh}
            />
          }
          renderItem={(item, index) => this.renderItem(item, index)}
          keyExtractor={(val) => val.id}
          initialNumToRender={2}
        />
      </View>
    );
  }

  renderItem = ({ item, index }) => {
    console.log("Houses: " + item);

    if (item.photos.length == 0) {
      photo = "http://192.168.160.60:3000/static/media/home.200c1988.jpg";
    } else {
      photo = "data:image/jpeg;base64,"+item.photos[0];
    }

    return (
      <HouseItem
        id={item.id}
        locatarioId={this.state.userCode}
        photo={photo}
        name={item.name}
        price={item.price}
        rooms={item.noRooms}
        bathrooms={item.noBathrooms}
        area={item.habitableArea}
        city={item.city}
        rating={item.averageRating}
        favorite={true}
        refresh={this.handleRefresh}
      />
    );
  };

  searchCity = () => {
    console.log(this.state.searchString);
    this.setState(
      {
        displaySearchString: this.state.searchString,
        searchString: "",
        isLoading: true,
      },
      () => {
        this.getInfo();
      }
    );
  };

  renderCitytext = () => {
    if (this.state.displaySearchString != "") {
      return (
        <View style={styles.querySection}>
          <TouchableOpacity>
            <MaterialIcons
              style={styles.featureIcon}
              name="location-on"
              size={moderateScale(30)}
              color="#FF6E6C"
            />
          </TouchableOpacity>
          <Text style={styles.queryText}>{this.state.displaySearchString}</Text>
        </View>
      );
    } else {
      console.log("here");
      return null;
    }
  };

  renderContent = () => <View style={styles.panel}></View>;
  /* render */

  handleBedroomButton = (index) => {
    if (index == 1) {
      this.setState({
        bedroomNo1: !this.state.bedroomNo1,
        bedroomNo2: false,
        bedroomNo3: false,
        bedroomNo4: false,
        bedroomNo5: false,
      });
    } else if (index == 2) {
      this.setState({
        bedroomNo1: false,
        bedroomNo2: !this.state.bedroomNo2,
        bedroomNo3: false,
        bedroomNo4: false,
        bedroomNo5: false,
      });
    } else if (index == 3) {
      this.setState({
        bedroomNo1: false,
        bedroomNo2: false,
        bedroomNo3: !this.state.bedroomNo3,
        bedroomNo4: false,
        bedroomNo5: false,
      });
    } else if (index == 4) {
      this.setState({
        bedroomNo1: false,
        bedroomNo2: false,
        bedroomNo3: false,
        bedroomNo4: !this.state.bedroomNo4,
        bedroomNo5: false,
      });
    } else if (index == 5) {
      this.setState({
        bedroomNo1: false,
        bedroomNo2: false,
        bedroomNo3: false,
        bedroomNo4: false,
        bedroomNo5: !this.state.bedroomNo5,
      });
    }
  };

  renderBedroomButton = (flag, index) => {
    if (flag) {
      return (
        <TouchableOpacity
          style={styles.bedroomButtonActive}
          onPress={() => this.handleBedroomButton(index)}
        >
          <Text style={styles.bedroomButtonActiveText}>{index}</Text>
        </TouchableOpacity>
      );
    } else {
      return (
        <TouchableOpacity
          style={styles.bedroomButton}
          onPress={() => this.handleBedroomButton(index)}
        >
          <Text style={styles.bedroomButtonText}>{index}</Text>
        </TouchableOpacity>
      );
    }
  };

  handleOrderButton = (index) => {
    if (index == 1) {
      this.setState({
        higherRating: !this.state.higherRating,
        lowerRating: false,
        higherPrice: false,
        lowerPrice: false,
      });
    } else if (index == 2) {
      this.setState({
        higherRating: false,
        lowerRating: !this.state.lowerRating,
        higherPrice: false,
        lowerPrice: false,
      });
    } else if (index == 3) {
      this.setState({
        higherRating: false,
        lowerRating: false,
        higherPrice: !this.state.higherPrice,
        lowerPrice: false,
      });
    } else if (index == 4) {
      this.setState({
        higherRating: false,
        lowerRating: false,
        higherPrice: false,
        lowerPrice: !this.state.lowerPrice,
      });
    }
  };

  renderOrderByButton = (flag, index, text) => {
    if (flag) {
      return (
        <TouchableOpacity
          style={styles.orderButtonActive}
          onPress={() => this.handleOrderButton(index)}
        >
          <Text style={styles.bedroomButtonActiveText}>{text}</Text>
        </TouchableOpacity>
      );
    } else {
      return (
        <TouchableOpacity
          style={styles.orderButton}
          onPress={() => this.handleOrderButton(index)}
        >
          <Text style={styles.bedroomButtonText}>{text}</Text>
        </TouchableOpacity>
      );
    }
  };

  renderInner = () => (
    <View style={styles.panel}>
      <View style={{ flex: 0.15, paddingHorizontal: 26 }}>
        <Text style={styles.titleBottomSheet}>Filter by</Text>
      </View>
      <View style={{ flex: 0.2, paddingHorizontal: 26 }}>
        <View style={{ flex: 0.5, justifyContent: "center" }}>
          <Text style={styles.optionsTitle}>Price</Text>
        </View>
        <View style={{ flex: 0.5, flexDirection: "row" }}>
          <View
            style={{
              flex: 0.5,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <TextInput
              style={styles.optionsInput}
              placeholder="Min price"
              maxLength={6}
              keyboardType={"numeric"}
              returnKeyType="next"
              onSubmitEditing={() => this.maxPrice.focus()}
              ref={(input) => (this.minPrice = input)}
              onChangeText={(minPrice) => {
                this.setState({ minPrice });
              }}
              underlineColorAndroid="transparent"
            />
          </View>
          <View
            style={{
              flex: 0.5,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <TextInput
              style={styles.optionsInput}
              placeholder="Max price"
              maxLength={6}
              keyboardType={"numeric"}
              returnKeyType="next"
              //onSubmitEditing={() => this.fatInput.focus()}
              ref={(input) => (this.maxPrice = input)}
              onChangeText={(maxPrice) => {
                this.setState({ maxPrice });
              }}
              underlineColorAndroid="transparent"
            />
          </View>
        </View>
      </View>
      <View style={{ flex: 0.2, paddingHorizontal: 26 }}>
        <View style={{ flex: 0.5, justifyContent: "center" }}>
          <Text style={styles.optionsTitle}>Bedroom</Text>
        </View>
        <View
          style={{
            flex: 0.5,
            flexDirection: "row",
            justifyContent: "space-around",
          }}
        >
          {this.renderBedroomButton(this.state.bedroomNo1, 1)}
          {this.renderBedroomButton(this.state.bedroomNo2, 2)}

          {this.renderBedroomButton(this.state.bedroomNo3, 3)}

          {this.renderBedroomButton(this.state.bedroomNo4, 4)}

          {this.renderBedroomButton(this.state.bedroomNo5, 5)}
        </View>
      </View>
      <View style={{ flex: 0.2, paddingHorizontal: 26, marginBottom: 10 }}>
        <View style={{ flex: 0.5, justifyContent: "center" }}>
          <Text style={styles.optionsTitle}>Order By</Text>
        </View>
        <View
          style={{
            flex: 0.5,
            flexDirection: "row",
            justifyContent: "space-around",
          }}
        >
          {this.renderOrderByButton(
            this.state.higherRating,
            1,
            "Higher Rating"
          )}
          {this.renderOrderByButton(this.state.lowerRating, 2, "Lower Rating")}
          {this.renderOrderByButton(this.state.higherPrice, 3, "Higher Price")}
          {this.renderOrderByButton(this.state.lowerPrice, 4, "Lower Price")}
        </View>
      </View>
    </View>
  );

  renderHeader = () => <View style={styles.header} />;
  bs = React.createRef();
  fall = new Animated.Value(1);

  render() {
    if (this.state.isLoading) {
      return (
        <View style={{ flex: 1 }}>
          <OfflineNotice />

          <View style={{ flex: 1, justifyContent: "center" }}>
            <ActivityIndicator size="large" color={theme.secondary} />
          </View>
        </View>
      );
    } else {
      return (
        <View style={{ flex: 1 }}>
          <OfflineNotice />
          <View
            style={{
              flex: 1,
              marginTop: 30,
            }}
          >
            <View
              style={{
                flex: 0.1,
                flexDirection: "row",
                marginLeft: moderateScale(15),
                marginTop: moderateScale(20),
              }}
            >
              <View
                style={{ flex: 1, alignItems: "flex-start", color: "white" }}
              >
                <TouchableOpacity
                  onPress={() => {
                    this.props.navigation.goBack(null);
                  }}
                >
                  <Ionicons
                    color="#0D2D53"
                    name="md-arrow-back"
                    size={moderateScale(28)}
                  ></Ionicons>
                </TouchableOpacity>
              </View>

              <Text
                style={{
                  flex: 4,
                  fontSize: moderateScale(22),
                  color: "#0D2D53",
                  fontWeight: "500",
                  alignItems: "center",
                }}
              >
                Wishlist
              </Text>
            </View>
            <View style={{ flex: 0.9 }}>{this.renderList()}</View>
          </View>
          <NavigationEvents onDidFocus={() => this.handleRefresh()} />

        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  bedroomButton: {
    flex: 0.1,
    height: "65%",
    width: "65%",
    padding: 5,
    fontSize: moderateScale(18),
    borderColor: "#A7D7FC",
    borderWidth: 1,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",

    color: "white",
  },
  bedroomButtonActiveText: {
    fontSize: moderateScale(18),
    textAlign: "center",

    color: "#6C4EEE",
  },
  bedroomButtonActive: {
    flex: 0.1,
    height: "65%",
    width: "65%",
    padding: 5,
    fontSize: moderateScale(18),
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#D8FCFF",

    color: "white",
  },
  orderButton: {
    flex: 0.2,
    height: "90%",
    width: "100%",
    padding: 5,
    fontSize: moderateScale(18),
    borderColor: "#A7D7FC",
    borderWidth: 1,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",

    color: "white",
  },
  orderButtonActive: {
    flex: 0.2,
    height: "90%",
    width: "100%",
    padding: 5,
    fontSize: moderateScale(18),
    borderColor: "#A7D7FC",
    backgroundColor: "#D8FCFF",
    borderRadius: 10,

    justifyContent: "center",
    alignItems: "center",

    color: "white",
  },
  applyButtonText: {
    fontSize: moderateScale(18),
    textAlign: "center",

    color: "#F3F1FF",
  },
  bedroomButtonText: {
    fontSize: moderateScale(18),
    textAlign: "center",

    color: theme.gray2,
  },
  container: {
    flex: 1,
    marginTop: 30,
  },
  optionsTitle: {
    color: "#A7D7FC",
    fontSize: moderateScale(20),
  },
  titleBottomSheet: {
    color: "#D8FCFF",
    fontSize: moderateScale(34),
  },
  panelContainer: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  panel: {
    height: 600,
    paddingTop: 26,
    backgroundColor: theme.secondary,
    paddingTop: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 5,
    shadowOpacity: 0.4,
  },
  filter: {
    shadowColor: "rgba(0,0,0, .4)", // IOS
    backgroundColor: theme.primary_color,
    shadowOffset: { height: 1, width: 1 }, // IOS
    shadowOpacity: 1, // IOS
    shadowRadius: 1, //IOS
    elevation: 0, // TODO change elevation
    width: moderateScale(105),
    height: moderateScale(48),
    right: "37%",
    bottom: 20,
    borderRadius: 40,
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
  },
  filterText: {
    color: "#F3F1FF",
    fontSize: moderateScale(20),
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
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
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
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
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
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
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
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
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
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
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
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  squaretext: {
    fontSize: moderateScale(30),
    textAlign: "center",
    width: "100%",
    color: "white",
    fontWeight: "bold",
  },
  searchSection: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: moderateScale(25),
  },
  querySection: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: moderateScale(25),
  },
  searchIcon: {
    padding: 10,
    backgroundColor: "gray",
    opacity: 0.1,
    borderRadius: 40,
  },
  optionsInput: {
    flex: 0.5,
    height: "50%",
    width: "60%",
    padding: 5,
    fontSize: moderateScale(18),
    borderColor: "#A7D7FC",
    borderWidth: 1,
    borderRadius: 10,

    color: "white",
  },
  input: {
    flex: 1,
    paddingTop: 10,
    paddingRight: 10,
    paddingBottom: 10,
    paddingLeft: 0,
    fontSize: moderateScale(22),
    backgroundColor: "#fff",
    color: "#424242",
  },
  queryText: {
    fontSize: moderateScale(34),
    textDecorationLine: "underline",
    color: "#FF6E6C",
  },
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
  },
};
