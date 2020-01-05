import React from 'react';
import { 
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
 } from 'react-native';
 import {  Entypo } from '@expo/vector-icons';
 import Moment from 'moment';

export default class PostCell extends React.PureComponent {

  formatTime = (timeStr) => {
    let newDate = new Date(timeStr);
    return Moment(newDate).format("DD/MM/YYYY");
  }

  render(){
    const item = this.props.item

    let start_time = this.formatTime(item.check_in);
    let end_time = this.formatTime(item.check_out);

    return (
      <View style={styles.container}> 
        <TouchableOpacity 
          style={{flex: 1}}
          onPress={this.props.onPress}>

          <View style={styles.topContainer}>
            <Image
              style={styles.avatar}
              source={{ uri: 'https://facebook.github.io/react-native/img/tiny_logo.png' }}
            />
            <View style={{marginLeft: 10, flex: 1}}>


              <View style={{flexDirection: 'row'}}>
                <View style={{flex:1}}>
                <Text style= {styles.nameText}>{`${item.first_name} ${item.last_name}`}</Text>
                  <Text style={styles.locationText}>{item.rental_name}</Text>
                  <Text style={styles.durationText}>{start_time} - {end_time}</Text>
                </View>

                <Entypo
                  style = {styles.box}
                  color =  'black'
                  name={'chevron-thin-right'}
                  size={20}
                />

                
              </View>

            </View>

          </View>
          <Text style={[styles.contentText]}> {`${item.email} /${item.phone}`} </Text>
          <View style={{flexDirection:'row', marginBottom: 20, marginTop: 4}}>
          <Text style={[styles.codeText, {color: 'dimgray', marginLeft: 20}]}> Door Code: </Text>
          <Text style={styles.codeText}> {item.door_code} </Text>
          </View>
        </TouchableOpacity>
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
    marginHorizontal: 10, 
    marginTop: 10, 
    marginBottom: 0,
  },
  topContainer: {
    flex: 1,
    flexDirection: 'row',
    margin: 20,
  },
  avatar: {
    width: 50, 
    height: 50,
    borderRadius: 25,
  },
  nameText: {
    fontSize: 20,
  },
  durationText: {
    color: 'dimgray',
    fontSize: 13,
  },
  locationText: {
    color: 'dimgray',
    fontSize: 15,
  },
  creatTimeText: {
    color: 'dimgray',
    fontSize: 15,
    marginLeft:'auto',
    marginRight: 0,
  },
  box: {
    marginTop: 20,
    marginLeft: 10,
    marginRight: 0,
  },
  contentText: {
    textAlign: 'justify',
    fontWeight: '300',
    fontSize: 15,
    marginHorizontal: 20
  },
  codeText: {
    textAlign: 'justify',
    fontWeight: '300',
    fontSize: 15,
  }
})