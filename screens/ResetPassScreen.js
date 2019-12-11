import React from 'react';
import { TouchableOpacity, StyleSheet, View, Text, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import { FontAwesome } from '@expo/vector-icons';

export default class ResetPassScreen extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: ''
    };
  }

  _handleTextChange = text => {
    // this.setState({zip: event.nativeEvent.text});
    this.setState({ 'email': text })
  }

  _resetAction = () => {
    Keyboard.dismiss();
    alert('check mail');
  }

  render() {
    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      {/* <KeyboardAvoidingView style={styles.container} behavior="padding" enabled> */}
        <View style={styles.container}>
          <Text style={styles.loginText}>Reset Password</Text>
          <View style={styles.fillBox}>
            <TextInput
              dense = {true}
              mode = 'outlined'
              style={styles.textInput1}
              label='Email'
              value={this.state.email}
              onChangeText={text => this._handleTextChange(text) }
              
            />
            <View style={styles.buttonContainer}>
              <Button 
                mode="contained" 
                color = '#e66656'
                labelStyle = {{color: 'white', fontSize: 16}}
                style = {styles.buttonLogin}
                onPress={() => this._resetAction()}>
                RESET
              </Button>
              <TouchableOpacity
                  style={styles.loginButtonContainer}
                  onPress={() => this.props.navigation.goBack()}
                  underlayColor='#fff'>
                  <Text style={styles.loginButtonText}>Login</Text>
                </TouchableOpacity>
            </View>
          </View>
        </View>
      {/* </KeyboardAvoidingView> */}
      </TouchableWithoutFeedback>
    );
  }
}


const styles = StyleSheet.create({
  buttonLogin:{
    flex: 1,
  },
  buttonContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    marginLeft: 20,
    marginRight: 20,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingTop: 15,
    backgroundColor: '#3a5161',
  },
  fillBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 7,
    margin: 20
  },
  loginButtonContainer:{
    flex: 2,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  loginButtonText:{
    color: 'dimgray',
  },
  loginText:{
    color: 'white',
    fontSize: 30,
    textAlign: 'center',
  },
  textInput1: {
    marginLeft: 20,
    marginRight: 20,
    marginTop: 20,
    marginBottom: 20,
    borderColor: 'black'
  },
});
