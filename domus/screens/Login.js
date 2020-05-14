import React from 'react';
import { StyleSheet, Text, View,TouchableOpacity,TextInput,AsyncStorage } from 'react-native';
import { moderateScale } from 'react-native-size-matters';
import { Ionicons } from '@expo/vector-icons';
import {Notifications } from 'expo'
import * as Permissions from 'expo-permissions'
import NavigationService from '../components/NavigationService'
const API_URL = 'mednat.ieeta.pt:8442';

export default class Login extends React.Component{

  constructor() {
    super();
    this.state={
      isLoading:true,
      userName:null,
      userPassword: null,
      inputcolor1:"gray",
      inputcolor2:"gray",
      userToken:null,
      baseURL:"http://192.168.160.220:8080/",
      name:null,
      companyName:null,
      userCode:null,
      API_URL:"mednat.ieeta.pt:8442",


     
      
    }
  }

  _storeData = async () => {
    try {
        console.log(this.state.userCode+" "+this.state.name+" "+this.state.companyName)
        await AsyncStorage.setItem('cod', this.state.userCode.toString());
        await AsyncStorage.setItem('name', this.state.name);
        await AsyncStorage.setItem('username', this.state.userName);
        await AsyncStorage.setItem('pwd', this.state.userPassword);
        await AsyncStorage.setItem('nameCompany', this.state.companyName);
        await AsyncStorage.setItem('token', this.state.userToken);
        const nameCompany= await AsyncStorage.getItem('nameCompany');
        console.log("Teste ",nameCompany)
        await AsyncStorage.setItem('SignedIn', 'App');
        NavigationService.navigate('Home');

       
        
    } catch (error) {
        console.log(error)
    }
};

  verifyCredentials(email, password) {
    // EMAIL VERIFICATIONS
    let invalidEmail = 0;
    let invalidPassword=0;
    const words = email.split("@");
    
    if(words.length > 1) {
        const words2 = words[1].split(".");
        //console.log("WORDS2" + words2.length)
        if(words2.length <= 1)
            invalidEmail = 1;
    } else {
        invalidEmail = 1;
    }
    if(email == "" || invalidEmail == 1) {
        alert("error mail");
        return false;
    } else {
        if(password = "" || password.length < 3){
            alert("error pass");
            return false;
        }
        else {
            console.log('password valida');
            return true;
        }
        // PASSWORD VERIFICATIONS
    }
}

  makeRegisterRequest(){
    //unsecure way to send a post
  console.log("Fetching:" + this.state.API_URL+'/clients')
  fetch("http://mednat.ieeta.pt:8442/clients", {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ //change these params later
          email:this.state.email,
          first_name:this.state.first_name,
          last_name:this.state.last_name,
          password:this.state.password, //this shouldnt go out as clear text
          height :this.state.height,
          weight_goal:this.state.weight_goal,
          birthday:this.state.birthday,
          phone_number:this.state.phone_number,
          photo_base64:this.state.photo_base64,
      }),
    }).then((response) => response.text()) 
    .then((responseText) => {
        console.log(responseText);  
    }) 
    .catch((error) => {
        console.warn(error);
    }); ;
  }

  async login() {

    const { userName, userPassword,baseURL } = this.state;

    // Verificar credenciais
    console.log("ADEUS")

    if (this.verifyCredentials(userName, userPassword)) {
        console.log("OLA")
        login_info = "Basic " + Base64.btoa(userName + ":" + userPassword);

        // fetch data
        fetch("http://mednat.ieeta.pt:8442/clients", {
            method: 'POST',
            headers: {
              "Content-Type": "application/json",
              "Authorization": login_info
            },
        })
        .then(response => {
          if (!response.ok) throw new Error(response.status);
          else return response.json();
        })
        .then(data => {
          
          this.setState({
            userCode:data["id"],
            name:data["person"]["fname"]+" "+data["person"]["lname"],
            companyName:data["person"]["company"]["name"]
          }, () => {
            this.insertToken();
            this._storeData()
          }
        )
          // Redirect to page ( pra ja para a area pessoal só para testar)

          
        })
        .catch(error => {
          console.log("error: " + error);
        });
  
           

    }else{
      console.log("Invalid credentials")
    }

  }

  async insertToken() {

    const { userCode, userToken,baseURL,userName,userPassword } = this.state;

      var details = {
        'token': userToken,
        'user' : {"id":userCode}
      }

     

      login_info = "Basic " + Base64.btoa(userName + ":" + userPassword);

      // fetch data
      fetch(baseURL + "api/v1/expo_tokens", {
          method: 'POST',
          headers: {
            "Content-Type": "application/json",
            "Authorization": login_info
          },
          body: JSON.stringify(details)
      })
      .then(response => {
        if (!response.ok) throw new Error(response.status);
        else return response.json();
      })
      .then(data => {
        console.log(data)
        /*this.setState({
          userCode:data["id"],
          name:data["person"]["fname"]+" "+data["person"]["lname"],
          companyName:data["person"]["company"]["name"]
        })
        
        this.insertToken();
        this._storeData();


        // Redirect to page ( pra ja para a area pessoal só para testar)
        this.props.navigation.navigate('Home');*/

        
      })
      .catch(error => {
        console.log("error: " + error);
      });
  
           

    

  }

  componentWillMount() {

    this.register();
 
     
   }

  register = async () => {
    const {status} =await Permissions.askAsync(Permissions.NOTIFICATIONS)
  
    if(status!=='granted'){
        console.log('Permission not granted!');
        

        //this.removeNotificacao(token)
        
    }
    else{
      try{
        const token= await Notifications.getExpoPushTokenAsync();
        console.log('granted',token);
        this.setState({
          userToken:token
        })
      }catch(e){
        console.log(e)
        
      }

    }
  
  }

  onBlur2() {
    this.setState({
      inputcolor2: 'gray'
    })
  }
  onFocus2() {
    this.setState({
        inputcolor2: "#1fafbd"
    })
  }
  onBlur1() {
    this.setState({
      inputcolor1: 'gray'
    })
  }
  onFocus1() {
    this.setState({
        inputcolor1: "#1fafbd"
    })
  }
  render(){
    return (
      <View style={styles.container}>
  
        <View style={{height:moderateScale(400),width:moderateScale(300)}}>
          <View style={{paddingBottom:40}}>
            <Text style={{color:'white',fontSize:28,textAlign:"center"}}>
              ACCOUNT LOGIN
            </Text>
  
          </View>
          <View style={{backgroundColor:'white',flex:1,borderRadius:10}}>
            
            
            <View style={{flex:0.5,justifyContent:'center',alignItems:'center'}}>
              <View style={{
                    flexDirection: 'row', marginBottom: 15,marginTop: 15,
                    borderBottomWidth: 1,borderColor:this.state.inputcolor1  ,justifyContent:'center',alignItems:'center'}}>
                    <Ionicons name={"md-people"} size={moderateScale(30)} color={this.state.inputcolor1} style={{ paddingHorizontal: 15 }} />
    
                    <TextInput
                        placeholder="User name"
                        onFocus={ () => this.onFocus1() }
                        onBlur={ () => this.onBlur1() }
                        style={{
                            flex:1,
                            height: moderateScale(40),
                            color: '#000',
                            fontSize:moderateScale(20)
                        }}
                        returnKeyType="go"
                        ref={(input) => this.passwordInput = input}
                        onChangeText={userName => this.setState({ userName })}
                    />
                    
                </View>
            </View>
            <View style={{flex:0.5,justifyContent:'center',alignItems:'center'}}>
              <View style={{
                  flexDirection: 'row', marginBottom: 15,
                  borderBottomWidth: 1,borderColor:this.state.inputcolor2        
                  ,justifyContent:'center',alignItems:'center'}}>
                  <Ionicons name={"md-lock"} size={moderateScale(30)} color={this.state.inputcolor2} style={{ paddingHorizontal: 15 }} />
  
                  <TextInput
                      placeholder="Password"
                      onFocus={ () => this.onFocus2() }
                      onBlur={ () => this.onBlur2() }
                      style={{
                        flex:1,
                        height: moderateScale(40),
                        color: '#000',
                        fontSize:moderateScale(20)
                    }}
                      returnKeyType="go"
                      secureTextEntry={true}
                      ref={(input) => this.passwordInput = input}
                      onChangeText={userPassword => this.setState({ userPassword })}
                  />
                  
              </View>
  
            </View>
            <View style={{flex:0.6,justifyContent:'center',alignItems:'center'}}>
  
                
                <TouchableOpacity style={styles.loginGoogleButton}

                onPress={()=> this.makeRegisterRequest()}
                    
                
                >
                      <Text style={styles.loginButtonText}>
                          LOGIN
                      </Text>
                  </TouchableOpacity>
              
            </View>
  
  
          </View>
  
        </View>
      
      </View>
    );

  }
  
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#009cd9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginGoogleButton: {
    shadowColor: 'rgba(0,0,0, .4)', // IOS
    backgroundColor:'#00b0c9',
    shadowOffset: { height: 1, width: 1 }, // IOS
    shadowOpacity: 1, // IOS
    shadowRadius: 1, //IOS
    elevation: 2, // Android
    width:moderateScale(150),
    height:moderateScale(40),
    margin: 10,
    borderRadius:20,
    justifyContent:'center',
    alignItems:'center'
},
loginButtonText: {
  textAlign:'center',
  color:"#FFF",
  fontWeight: '700',
  width:"100%",
  fontSize:moderateScale(15)
},
});

const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
const Base64 = {
  btoa: (input:string = '')  => {
    let str = input;
    let output = '';

    for (let block = 0, charCode, i = 0, map = chars;
    str.charAt(i | 0) || (map = '=', i % 1);
    output += map.charAt(63 & block >> 8 - i % 1 * 8)) {

      charCode = str.charCodeAt(i += 3/4);

      if (charCode > 0xFF) {
        throw new Error("'btoa' failed: The string to be encoded contains characters outside of the Latin1 range.");
      }
      
      block = block << 8 | charCode;
    }
    
    return output;
  },

  atob: (input:string = '') => {
    let str = input.replace(/=+$/, '');
    let output = '';

    if (str.length % 4 == 1) {
      throw new Error("'atob' failed: The string to be decoded is not correctly encoded.");
    }
    for (let bc = 0, bs = 0, buffer, i = 0;
      buffer = str.charAt(i++);

      ~buffer && (bs = bc % 4 ? bs * 64 + buffer : buffer,
        bc++ % 4) ? output += String.fromCharCode(255 & bs >> (-2 * bc & 6)) : 0
    ) {
      buffer = chars.indexOf(buffer);
    }

    return output;
  }
};