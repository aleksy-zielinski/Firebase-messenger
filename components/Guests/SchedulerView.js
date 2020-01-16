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

    return (
      <View style={{marginTop: 20}}>
            <Text style={{fontSize: 22, fontWeight: 'bold', marginLeft: 10}}> Re/Send Messages</Text>

            <View style={styles.container}>
              <TouchableOpacity style={styles.rowStyle}>
                <Feather
                  style={{marginRight: 10}}
                  color =  {'black'}
                  name={'check'}
                  size={18}
                />
                <Text style={styles.textStyle}>Resend Guestbook by SMS</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.rowStyle}>
                <Feather
                  style={{marginRight: 10}}
                  color =  {'transparent'}
                  name={'check'}
                  size={18}
                />
                <Text style={styles.textStyle}>Resend Guestbook by Email</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.rowStyle}>
                <Feather
                  style={{marginRight: 10}}
                  color =  {'transparent'}
                  name={'check'}
                  size={18}
                />
                <Text style={styles.textStyle}>Send Rebook and Review</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.rowStyle}>
                <Feather
                  style={{marginRight: 10}}
                  color =  {'transparent'}
                  name={'check'}
                  size={18}
                />
                <Text style={styles.textStyle}>Send Post Departure Survey by SMS</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.rowStyle}>
                <Feather
                  style={{marginRight: 10}}
                  color =  {'transparent'}
                  name={'check'}
                  size={18}
                />
                <Text style={styles.textStyle}>Resend Five Star Review by SMS</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.rowStyle}>
                <Feather
                  style={{marginRight: 10}}
                  color =  {'transparent'}
                  name={'check'}
                  size={18}
                />
                <Text style={styles.textStyle}>Send Social Media Campain by SMS</Text>
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
  textStyle: {
    color: '#0074D9', 
    fontSize: 15, 
    fontWeight: '300',
  }
})