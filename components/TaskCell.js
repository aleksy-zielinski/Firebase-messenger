import React from 'react';
import { 
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity
 } from 'react-native';
 import {  Entypo } from '@expo/vector-icons';
 import Moment from 'moment';

export default class PostCell extends React.PureComponent {

  render(){
    const item = this.props.item

    const displayName = (item.guest_first_name + " " + item.guest_last_name).trim() || 
                        item.guest_name || 
                        item.guest_phone || 
                        "";
    const matches = displayName.match(/\b(\w)/g);
    const acronym = (matches || []).join(''); 
    const userShort = acronym.substring(0,2)
    

    let last_msg_on = Moment(item.last_msg_on).format('MM/DD/YYYY hh:mm a')
    let check_in = Moment(item.check_in).format("MM/DD/YYYY");
    let check_out = Moment(item.check_out).format("MM/DD/YYYY");

    return (
      <View style={styles.container}> 
         <TouchableOpacity 
          style={{flex: 1}}
          onPress={this.props.onPress}>
        <View style={styles.topContainer}>
          <View style={{width: 48, height: 48, backgroundColor: '#4d6b85', borderRadius: 24, justifyContent: 'center', alignItems: 'center'}}>
              <Text style={{color: 'white', fontSize: 16}}>{userShort}</Text>
          </View>
          <View style={{marginLeft: 10, flex: 1}}>

            <View style={{flexDirection: 'row'}}>
              <Text style= {styles.nameText} numberOfLines={1}>{displayName}</Text>
            </View>
            <View style={{flexDirection: 'row'}}>
              <Text style= {styles.creatTimeText}>{last_msg_on}</Text>
            </View>
            <View style={{flexDirection: 'row'}}>
              <View style={{flex:1}}>
                <Text style={styles.locationText}>{item.location}</Text>
                {item.check_in !== '0001-01-01T00:00:00Z' &&
                  <Text style={styles.durationText}>{check_in} - {check_out}</Text>
                }
              </View>
              <Entypo
                style = {styles.box}
                color =  {item.meta_values.includes('archived') ? 'salmon' : 'darkgray'}
                name={'box'}
                size={25}
              />
              <Entypo
                style = {styles.box}
                color =  {item.meta_values.includes('priority') ? 'salmon' : 'darkgray'}
                name={'flag'}
                size={25}
              />
            </View>

          </View>

        </View>
        <Text style={[styles.contentText, {fontWeight: item.meta_values.includes('unread') ? '500': '300'}]}>{item.last_msg}</Text>
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
    marginTop: 0, 
    marginBottom: 10,
  },
  topContainer: {
    flex: 1,
    flexDirection: 'row',
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 10
  },
  avatar: {
    width: 50, 
    height: 50,
    borderRadius: 25,
  },
  nameText: {
    flex:1,
    fontSize: 18,
  },
  locationText: {
    color: 'dimgray',
    fontSize: 13,
  },
  durationText: {
    color: 'dimgray',
    fontSize: 13,
    marginTop: 4
  },
  creatTimeText: {
    color: 'dimgray',
    fontSize: 13,
    marginTop: 5,
  },
  box: {
    marginLeft: 10,
    marginRight: 0,
  },
  contentText: {
    textAlign: 'left',
    marginHorizontal: 20,
    marginBottom: 20
  }
})