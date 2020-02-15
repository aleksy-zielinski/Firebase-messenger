import React from 'react';
import { 
  View,
  Text,
  StyleSheet,
  TouchableOpacity
 } from 'react-native';
 import {  Feather } from '@expo/vector-icons';

export default class SchedulerView extends React.PureComponent {


  render(){

    const { options, messagesIds} = this.props

    const lines = options.map( (obj, index) =>
      <TouchableOpacity 
        style={styles.rowStyle}
        key={`index${index}`}
        onPress={()=>this.props.onPress(obj.id)}
        >
        <Feather
          style={{marginRight: 10, marginTop: 3}}
          color =  {messagesIds.includes(`${obj.id}`) ? 'black' : 'transparent'}
          name={'check'}
          size={18}
        />
        <Text style={styles.textStyle}>{obj.name}</Text>
      </TouchableOpacity>  
    )

    return (
      <View style={{marginTop: 20}}>
          <Text style={styles.pageTitle}>Share with Guests</Text>
          <Text style={styles.introText}>Send or resend a message to a guest by clicking on an option below.</Text>

          <View style={styles.container}>
              {lines}
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
    borderRadius: 3,
    margin: 10,
    paddingTop: 15,
    paddingBottom: 20,
  },
  rowStyle:{
    flexDirection:'row', 
    marginTop: 5, 
    marginHorizontal: 10,
  },
  pageTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    marginLeft: 12
  },
  introText: {
    color: 'dimgray',
    fontSize: 13,
    lineHeight: 15,
    fontWeight: '300',
    marginTop: 3,
    marginBottom: 3,
    marginLeft: 13,
    marginRight: 13    
  },
  textStyle: {
    color: '#455A69', 
    fontSize: 15, 
    lineHeight: 19,
    fontWeight: '300',
  }
})