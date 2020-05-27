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
  ImageBackground,
  Platform,
  Linking,
} from "react-native";
import Animated from "react-native-reanimated";
import {
  Ionicons,
  MaterialIcons,
  AntDesign
} from "@expo/vector-icons";
import { moderateScale } from "react-native-size-matters";
const { width, height } = Dimensions.get("screen");
import theme from "../constants/theme.style.js";
import OfflineNotice from "../components/OfflineNotice";
import HouseItem from "../components/HouseItem";
import NavigationService from "../components/NavigationService";
import MapView, { Marker } from "react-native-maps";
export default class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      displaySearchString: "",
      searchString: "",
      SharedLoading: true,
      refresh: false,
      houseId: "",
      isLoading: true,
      userName: null,
      favorite: false,
      userPassword: null,
      userToken: null,
      userCode: null,
      city: null,
      minPrice: "",
      maxPrice: "",
      baseURL: "http://192.168.160.60:8080/",
      googleAPI: "AIzaSyDoZX2PofG0w-AOuHSWD8RRtSq6dxeS9mA",
      location: null,

      refreshing: false,
      userDataSource: null,
    };
  }

  async getInfo() {
    const { baseURL, userName, userPassword, houseId, userCode } = this.state;

    console.log(baseURL + "api/houses/" + houseId);
    // fetch data
    fetch(baseURL + "api/locatarios/" + userCode, {
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
          userDataSource: data,
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
          There are no houses with the current filters 😔
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
      photo = item.photos[0];
    }

    return (
      <HouseItem
        photo={photo}
        name={item.name}
        price={item.price}
        rooms={item.noRooms}
        bathrooms={item.noBathrooms}
        area={item.habitableArea}
        city={item.city}
        rating={item.averageRating}
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

  renderHeart() {
    if (this.state.userCode == null) {
      return (
        <View
          style={{
            flex: 0.5,
            alignItems: "flex-end",
            justifyContent: "center",
          }}
        ></View>
      );
    } else {
      if (this.state.favorite) {
        return (
          <View
            style={{
              flex: 0.5,
              alignItems: "flex-end",
              justifyContent: "center",
            }}
          >
            <View
              style={{
                flex: 1,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "flex-end",
              }}
            >
              <TouchableOpacity
                style={{ flex: 0.5, alignItems: "center" }}
                onPress={() => {
                  this.removeFavorite();
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
          </View>
        );
      } else {
        return (
          <View
            style={{
              flex: 0.5,
              alignItems: "flex-end",
              justifyContent: "center",
            }}
          >
            <View
              style={{
                flex: 1,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "flex-end",
              }}
            >
              <TouchableOpacity
                style={{ flex: 0.5, alignItems: "center" }}
                onPress={() => {
                  this.addFavorite();
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
          </View>
        );
      }
    }
  }

  renderFacilities = (facilities) => {
    if (facilities.length != 0) {
      facilitiesArray = facilities.split(";");

      var half_length = Math.ceil(facilitiesArray.length / 2);

      var leftSide = facilitiesArray.splice(0, half_length);
      var rightSide = facilitiesArray.splice(-half_length);
      console.log(leftSide);
      console.log(rightSide);
    }

    if (facilities.length != 0) {
      return (
        <View
          style={{
            flexDirection: "row",
            flex: 1,
            marginTop: moderateScale(10),
          }}
        >
          <View style={{ flex: 0.5 }}>
            {this.renderFacilitiesComponent(leftSide)}
          </View>
          <View style={{ flex: 0.5 }}>
            {this.renderFacilitiesComponent(rightSide)}
          </View>
        </View>
      );
    } else {
      return (
        <View
          style={{
            flexDirection: "row",
            flex: 1,
            marginTop: moderateScale(10),
          }}
        >
          <Text style={styles.featureText}>
            The author did not specify any facilities!
          </Text>
        </View>
      );
    }
  };

  dialCall = (number) => {
    let phoneNumber = "";
    if (Platform.OS === "android") {
      phoneNumber = `tel:${number}`;
    } else {
      phoneNumber = `telprompt:${number}`;
    }
    Linking.openURL(phoneNumber);
  };

  render() {
    if (this.state.isLoading) {
      return (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator
            color={theme.primary_color}
            size="large"
          ></ActivityIndicator>
        </View>
      );
    } else {
      if (this.state.userDataSource["user"]["photo"] == null) {
        photo =
          "http://192.168.160.60:3000/static/media/default-user.9d1403c3.png";
      } else {
        photo = this.state.houseDataSource["locador"]["user"]["photo"];
      }

      return (
        <View style={{ flex: 1 }}>
          <OfflineNotice />
          <View style={{ flex: 0.4 }}>
            <View
              style={{
                flex: 1,
              }}
            >
              <ImageBackground
                imageStyle={{ opacity: 0.9 }}
                source={{
                  uri:
                    "http://192.168.160.60:3000/static/media/home.200c1988.jpg",
                }}
                style={{
                  width: width,
                  height: "100%",
                }}
              >
                <View
                  style={{
                    flex: 1,
                    justifyContent: "space-between",
                    backgroundColor: "rgba(0,0,0,0.5)",
                  }}
                >
                  <View
                    style={{
                      flex: 0.7,
                      justifyContent: "flex-end",
                      alignItems: "center",
                      marginBottom: moderateScale(10),
                    }}
                  >
                    <Image
                      source={{ uri: photo }}
                      style={{
                        width: moderateScale(100),
                        height: moderateScale(100),
                        borderRadius: moderateScale(50),
                        backgroundColor: "white",
                        marginHorizontal: 5,
                      }}
                    ></Image>
                  </View>
                  <View
                    style={{
                      flex: 0.3,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Text style={styles.nameTitle}>
                      {this.state.userDataSource["user"]["firstName"]}{" "}
                      {this.state.userDataSource["user"]["lastName"]}
                    </Text>
                  </View>
                </View>
              </ImageBackground>
            </View>
          </View>
          <View style={{ flex: 0.6,backgroundColor:"white" }}>
            <View style={{ flex: 0.3,marginLeft: moderateScale(10), }}>
              <View
                style={{
                  flex: 0.5,
                  flexDirection: "row",
                  alignItems: "center",
                  
                }}
              >
                <Text style={styles.facilitiesTitle}>Email: </Text>
                <Text style={styles.featureText}>{this.state.userDataSource["user"]["email"]} </Text>

              </View>
              <View
                style={{
                  flex: 0.5,
                  flexDirection: "row",
                  alignItems: "center",
                  
                }}
              >
                <Text style={styles.facilitiesTitle}>Phone number: </Text>
                <Text style={styles.featureText}>{this.state.userDataSource["user"]["phoneNumber"]} </Text>

              </View>
            </View>
            <View style={{ flex: 0.7,justifyContent:"center",alignItems:"center" }}>
            <TouchableOpacity
              style={styles.filter}
              onPress={() => console.log("Favorites")}
            > 
            <AntDesign
              style={styles.featureIcon}
              name="heart"
              size={moderateScale(30)}
              color="#FF6E6C"
            />
              <Text style={styles.filterText}>Wishlist</Text>
            </TouchableOpacity>
            </View>
          </View>
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  featureIcon: {},
  nameTitle: {
    fontSize: moderateScale(20),
    color: "white",
    fontWeight: "600",
  },
  facilitiesTitle: {
    fontSize: moderateScale(20),
    color: "#3D5775",
    fontWeight: "600",
    marginLeft: moderateScale(7),
  },

  descriptionText: {
    fontSize: moderateScale(15),
    color: "#8696A9",
    fontWeight: "400",
    marginLeft: moderateScale(7),
    textAlign: "justify",
  },
  featureText: {
    fontSize: moderateScale(18),
    color: "#8696A9",
    fontWeight: "400",
    marginLeft: moderateScale(7),
  },
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
  priceText: {
    fontSize: moderateScale(25),
    color: "white",
    fontWeight: "500",
  },
  subPriceText: {
    fontSize: moderateScale(25),
    color: "white",
    fontWeight: "100",
  },
  ratingText: {
    fontSize: moderateScale(20),
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
    elevation: 4, // TODO change elevation
    width: moderateScale(150),
    height: moderateScale(48),
   flexDirection:"row",
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  filterText: {
    color: "#F3F1FF",
    marginLeft:10,
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
