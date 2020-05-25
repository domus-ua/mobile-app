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
import HouseItem from "../components/HouseItem";

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
      houseDataSource: [
        {
          id: 1,
          street: "Av. Lourenço Peixinho",
          city: "Aveiro",
          postalCode: "3800-006",
          noRooms: 2,
          noBathrooms: 1,
          noGarages: 0,
          habitableArea: 500,
          available: true,
          price: 230,
          name: "Quarto c/ 2 quartos em Aveiro",
          description: "Quarto c/ 2 quartos em Aveiro",
          propertyFeatures: "WI-FI",
          publishDay: "2020-05-18T12:39:04.733+0000",
          photos: [],
          locador: {
            id: 1,
            user: {
              id: 1,
              email: "locador@mail.com",
              firstName: "Carlos",
              lastName: "Santos",
              phoneNumber: "965380346",
              sex: "M",
              photo: null,
              dateJoined: "2020-05-18T12:38:54.840+0000",
              lastLogin: "2020-05-21T13:11:38.716+0000",
            },
            role: "locador",
            reviews: [],
            verified: false,
          },
          reviewsReceived: [],
          averageRating: 0,
        },
        {
          id: 2,
          street: "Av. Lourenço Peixinho",
          city: "Aveiro",
          postalCode: "3800-006",
          noRooms: 3,
          noBathrooms: 2,
          noGarages: 1,
          habitableArea: 500,
          available: true,
          price: 275,
          name: "Quarto c/ 3 quartos em Aveiro",
          description: "Quarto c/ 3 quartos em Aveiro",
          propertyFeatures: "WI-FI, TV",
          publishDay: "2020-05-18T12:39:15.411+0000",
          photos: [],
          locador: {
            id: 1,
            user: {
              id: 1,
              email: "locador@mail.com",
              firstName: "Carlos",
              lastName: "Santos",
              phoneNumber: "965380346",
              sex: "M",
              photo: null,
              dateJoined: "2020-05-18T12:38:54.840+0000",
              lastLogin: "2020-05-21T13:11:38.716+0000",
            },
            role: "locador",
            reviews: [],
            verified: false,
          },
          reviewsReceived: [],
          averageRating: 0,
        },
      ],
    };
  }

  async getInfo() {
    const { baseURL, userName, userPassword } = this.state;

    login_info = "Basic " + Base64.btoa(userName + ":" + userPassword);
    city_string = "";
    minPrice_string = "";
    maxPrice_string = "";
    bedroom_string = "";
    orderBy_string = "";
    if (this.state.displaySearchString != "") {
      city_string = "city=" + this.state.displaySearchString;
    }

    if (this.state.minPrice != "") {
      minPrice_string = "minPrice=" + this.state.minPrice;
    }

    if (this.state.maxPrice != "") {
      maxPrice_string = "maxPrice=" + this.state.maxPrice;
    }

    if (this.state.bedroomNo1) {
      bedroom_string = "nRooms=1";
    }

    if (this.state.bedroomNo2) {
      bedroom_string = "nRooms=2";
    }

    if (this.state.bedroomNo3) {
      bedroom_string = "nRooms=3";
    }

    if (this.state.bedroomNo4) {
      bedroom_string = "nRooms=4";
    }

    if (this.state.bedroomNo5) {
      bedroom_string = "nRooms=5";
    }

    if (this.state.higherRating) {
      orderBy_string = "desc=true&orderAttribute=rating";
    }

    if (this.state.lowerRating) {
      orderBy_string = "desc=false&orderAttribute=rating";
    }

    if (this.state.higherPrice) {
      orderBy_string = "desc=true&orderAttribute=price";
    }

    if (this.state.lowerPrice) {
      orderBy_string = "desc=false&orderAttribute=price";
    }

    console.log(
      baseURL +
        "api/houses?" +
        city_string +
        "&" +
        minPrice_string +
        "&" +
        maxPrice_string +
        "&" +
        bedroom_string +
        "&" +
        orderBy_string
    );
    // fetch data
    fetch(
      baseURL +
        "api/houses?" +
        city_string +
        "&" +
        minPrice_string +
        "&" +
        maxPrice_string +
        "&" +
        bedroom_string +
        "&" +
        orderBy_string,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then((response) => {
        if (!response.ok) throw new Error(response.status);
        else return response.json();
      })
      .then((data) => {
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
      }else{
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
    console.log(width);
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
          <Animated.View
            style={{
              flex: 1,
              marginTop: 30,
              opacity: Animated.add(0.1, Animated.multiply(this.fall, 0.9)),
            }}
          >
            <View style={{ flex: 0.2 }}>
              <View style={styles.searchSection}>
                <TextInput
                  style={styles.input}
                  placeholder="Find a Room in"
                  testID="citySearch"
                  onChangeText={(searchString) => {
                    this.setState({ searchString });
                  }}
                  underlineColorAndroid="transparent"
                />
                <TouchableOpacity
                  onPress={() => this.searchCity()}
                  testID="citySearchButton"
                >
                  <Ionicons
                    style={styles.searchIcon}
                    name="md-search"
                    size={moderateScale(25)}
                    color="black"
                  />
                </TouchableOpacity>
              </View>
              {this.renderCitytext()}
            </View>
            <View style={{ flex: 0.8, justifyContent: "center" }}>
              <ActivityIndicator size="large" color={theme.secondary} />
            </View>
          </Animated.View>
          <LinearGradient
            colors={["rgba(255,255,255,0)", "rgba(255,255,255,1)"]}
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              bottom: 0,
              height: 0.1 * height,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <TouchableOpacity
              style={styles.filter}
              onPress={() => this.bs.current.snapTo(1)}
            >
              <Text style={styles.filterText}>Filter</Text>
            </TouchableOpacity>
          </LinearGradient>
          <BottomSheet
            ref={this.bs}
            renderContent={this.renderInner}
            renderHeader={this.renderHeader}
            snapPoints={[0, 500]}
            initialSnap={0}
            callbackNode={this.fall}
            enabledInnerScrolling={false}
            enabledContentTapInteraction={false}
          />
        </View>
      );
    } else {
      return (
        <View style={{ flex: 1 }}>
          <OfflineNotice />
          <Animated.View
            style={{
              flex: 1,
              marginTop: 30,
              opacity: Animated.add(0.1, Animated.multiply(this.fall, 0.9)),
            }}
          >
            <View style={{ flex: 0.2, zIndex: 1 }}>
              <View style={styles.searchSection}>
                <TextInput
                  style={styles.input}
                  placeholder="Find a Room in"
                  testID="citySearch"
                  onChangeText={(searchString) => {
                    this.setState({ searchString });
                  }}
                  underlineColorAndroid="transparent"
                />
                <TouchableOpacity
                  onPress={() => this.searchCity()}
                  testID="citySearchButton"
                >
                  <Ionicons
                    style={styles.searchIcon}
                    name="md-search"
                    size={moderateScale(25)}
                    color="black"
                  />
                </TouchableOpacity>
              </View>
              {this.renderCitytext()}
            </View>
            <View style={{ flex: 0.8 }}>{this.renderList()}</View>
          </Animated.View>
          <LinearGradient
            colors={["rgba(255,255,255,0)", "rgba(255,255,255,1)"]}
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              bottom: 0,
              height: 0.1 * height,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <TouchableOpacity
              style={styles.filter}
              onPress={() => this.bs.current.snapTo(1)}
            >
              <Text style={styles.filterText}>Filter</Text>
            </TouchableOpacity>
          </LinearGradient>
          <BottomSheet
            ref={this.bs}
            renderContent={this.renderInner}
            renderHeader={this.renderHeader}
            snapPoints={[0, 500]}
            initialSnap={0}
            callbackNode={this.fall}
            enabledInnerScrolling={false}
            enabledContentTapInteraction={false}
          />
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
