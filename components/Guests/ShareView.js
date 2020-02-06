import React from 'react';
import { 
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
 } from 'react-native';
 import {  MaterialIcons } from '@expo/vector-icons';

export class SelectView extends React.PureComponent {

  render(){
    
    const {title, isSelected, index} = this.props

    return(
      <TouchableOpacity style={styles.rowStyle} onPress={()=>this.props.onPress(index)}>
        <MaterialIcons
          style={{marginRight: 10}}
          color =  {'black'}
          name={ isSelected? 'radio-button-checked' : 'radio-button-unchecked'}
          size={18}
        />
        <Text style={styles.textStyle}>{title}</Text>
      </TouchableOpacity>
    )
  }

}

export default class ShareView extends React.PureComponent {

  constructor(props) {
    super(props);

    this.state = {
      text: ''
    };
  }


  componentDidMount(){

    const {selectIndexTop, options, item} = this.props
    const currentItem = options[selectIndexTop]
    const isEmail = currentItem.email
    const value = isEmail ? item.email : item.phone
    this.setState({text: value})

  }

  didChangeOption(index){
    const {options, item} = this.props
    const currentItem = options[index]
    const isEmail = currentItem.email
    const value = isEmail ? item.email : item.phone
    this.setState({text: value})
  }


  render(){

    const {selectIndexTop, options, item} = this.props

    // const options = [
    //   'Resend Guestbook by SMS',
    //   'Resend Guestbook by Email',
    //   'Send Rebook and Review',
    //   'Send Post Departure Survey by SMS',
    //   'Resend Five Star Review by SMS',
    //   'Send Social Media Campain by SMS'
    // ]

    const lines = options.map( (item, index) =>
        <SelectView 
          title={item.name}
          index={index}
          isSelected={index === selectIndexTop} 
          key={`index${index}`}
          onPress={(index)=> {
            this.props.onPress(index);
            this.didChangeOption(index)
          }}
        />  
    )

    const currentItem = options[selectIndexTop]
    const isEmail = currentItem.email

    return (
      <View style={{marginVertical: 20}}>

          <Text style={{fontSize: 20, fontWeight: 'bold', marginLeft: 10}}> Share</Text>

            <View style={styles.container}>
              {lines}

              <View style={{height: 1, marginLeft: 10, marginTop: 20, backgroundColor: 'lightgray'}}/>
              <Text style={{fontSize: 14, fontWeight: '300', marginLeft: 10, marginTop: 10}}> {isEmail ? 'EMAIL' : 'PHONE'}</Text>
              <TextInput 
                // editable={false}
                style={styles.textInputStyle}
                placeholder= {isEmail ? "Enter email": "Enter phone number" }
                value={this.state.text}
                onChangeText={(text) => {
                  this.setState({text: text})
              }}
              />
            </View>
          
          <View style={{flexDirection: 'row', marginHorizontal: 10}}>
            <TouchableOpacity style={styles.sendButton}>
              <Text style={{color: 'white'}}>SEND</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelButton}
              onPress={()=>this.props.cancelPress()}
            >
              <Text style={{color: '#519f4f'}}>CANCEL</Text>
            </TouchableOpacity>
          </View>
          

      </View>
    );
  }
 
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderColor: 'lightgray',
    borderWidth: 1,
    borderRadius: 5,
    margin: 10,
    paddingTop: 15,
    paddingBottom: 20,
  },
  rowStyle:{
    flexDirection:'row', 
    marginTop: 5, 
    marginHorizontal: 10,
  },
  textInputStyle:{
    borderRadius: 5, 
    height: 40, 
    marginHorizontal: 10, 
    marginTop: 5, 
    borderColor: 'lightgray', 
    borderWidth: 1, 
    paddingHorizontal: 10,
    // backgroundColor:'lightgray'
  },
  textStyle: {
    color: 'black', 
    fontSize: 15, 
    fontWeight: '300',
  },
  cancelButton: {
    backgroundColor: 'white', 
    borderColor: 'lightgray',
    borderRadius: 20, 
    height: 40, 
    width: 100, 
    justifyContent:'center', 
    alignItems: 'center',
    marginLeft: 10,
  },
  sendButton: {
    backgroundColor: '#519f4f', 
    borderRadius: 20, 
    height: 40, 
    width: 100, 
    justifyContent:'center', 
    alignItems: 'center'
  }
})