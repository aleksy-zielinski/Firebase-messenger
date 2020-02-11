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
    const matches = displayName.match(/\b(\w)/g) || [];
    const acronym = matches.length > 1 ? matches.join('') : ""; 
    const userShort = acronym.substring(0,2)
    const propCode = item.unit_code || ""

    let last_msg_on = Moment(item.last_msg_on).format('MM/DD/YYYY hh:mm a')
    let check_in = Moment(item.check_in).format("MM/DD/YYYY");
    let check_out = Moment(item.check_out).format("MM/DD/YYYY");

    return (
      <View style={styles.container}> 
         <TouchableOpacity 
          style={{flex: 1}}
          onPress={this.props.onPress}>
        <View style={{flexDirection: 'row'}}>
          <View style={styles.topContainer}>
            <View style={{width: 48, height: 48, backgroundColor: '#4d6b85', borderRadius: 24, justifyContent: 'center', alignItems: 'center'}}>
                { userShort === "" ? 
                  <Image source={require('../assets/images/guest-unknown-white.png')} style={{width: 42, height: 42, resizeMode: 'contain', marginTop: 0  , marginLeft: 0}} /> :
                  <Text style={{color: 'white', fontSize: 16}}>{userShort}</Text>
                }
            </View>
            <View style={{marginLeft: 10, flex: 1}}>

              <View style={{flexDirection: 'row'}}>
                <Text style= {styles.nameText} numberOfLines={1}>{displayName}</Text>
              </View>
              <View style={{flexDirection: 'row'}}>
                <Text style= {styles.codeText} numberOfLines={1}>{propCode}</Text>
              </View>
              <View style={{flexDirection: 'row'}}>
                <View style={{flex:1}}>
                  { item.check_in !== '0001-01-01T00:00:00Z' ? 
                    <Text style={styles.durationText}>{check_in} - {check_out}</Text> : 
                    <Text style={styles.durationText}></Text> 
                  }
                </View>
              </View>
            </View>
          </View>
          <View style={styles.iconContainer}>
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
        <Text numberOfLines={3} style={[styles.contentText, {fontWeight: item.meta_values.includes('unread') ? '500': '300'}]}>{item.last_msg}</Text>
        <View style={{flexDirection: 'row'}}>
            <Text style= {styles.createTimeText}>{last_msg_on}</Text>
        </View>
        
        </TouchableOpacity>
      </View>
    );
  }
 
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderBottomColor: 'lightgray',
    borderBottomWidth: 1,
    marginTop: 0
  },
  topContainer: {
    flex: 1,
    flexDirection: 'row',
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 10
  },
  iconContainer: {
    flex: 0.3,
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
    fontSize: 17,
    lineHeight: 20    
  },
  codeText: {
    flex:1,
    color: 'dimgray',
    fontSize: 13,
  },
  locationText: {
    color: 'dimgray',
    fontSize: 13
  },
  durationText: {
    color: 'dimgray',
    fontSize: 13,
    marginTop: 4
  },
  createTimeText: {
    color: 'dimgray',
    fontSize: 11,
    marginTop: 10,
    marginBottom: 20,
    marginHorizontal: 20,
  },
  box: {
    marginLeft: 10,
    marginRight: 0,
  },
  contentText: {
    textAlign: 'left',
    lineHeight: 19,
    marginHorizontal: 20,
    marginBottom: 0
  }
})