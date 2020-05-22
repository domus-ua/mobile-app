import React, {Component} from 'react';
import {
  Button,
  TextInput,
  View,
} from 'react-native';
import OfflineNotice from "../components/OfflineNotice";
import NavigationService from "../components/NavigationService";

export default class NewMessageForm extends Component {
  constructor(params) {
    super(params);
    this.state = {inputText: ''};
  }

  handleChangeText(text) {
    this.setState({inputText: text});
  }

  handleSend() {
    const {inputText} = this.state;
    const {onSend} = this.props;

    if (onSend) {
      onSend(inputText);
    }

    this.setState({inputText: ''});
    NavigationService.navigate("App");

  }

  render() {
    const {inputText} = this.state;
    return (
      <View>
        <OfflineNotice />
        <TextInput
          value={inputText}
          testID="messageText"
          onChangeText={text => this.handleChangeText(text)}
        />
        <Button
          title="Send"
          testID="sendButton"
          onPress={() => this.handleSend()}
        />
      </View>
    );
  }
}
