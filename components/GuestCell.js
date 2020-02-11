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
    return Moment(newDate).format("MM/DD/YYYY");
  }

  render(){
    const item = this.props.item

    const propCode = item.unit_code || ""
    const userShort = item.first_name.substring(0,1) + item.last_name.substring(0,1);

    let start_time = this.formatTime(item.check_in);
    let end_time = this.formatTime(item.check_out);

    return (
      <View style={styles.container}> 
        <TouchableOpacity 
          style={{flex: 1}}
          onPress={this.props.onPress}>

          <View style={styles.topContainer}>
            
            <View style={{width: 48, height: 48, backgroundColor: '#4d6b85', borderRadius: 24, justifyContent: 'center', alignItems: 'center'}}>
              <Text style={{color: 'white', fontSize: 16}}>{userShort}</Text>
            </View>
            <View style={{marginLeft: 16, flex: 1}}>


              <View style={{flexDirection: 'row'}}>
                <View style={{flex:1}}>
                <Text style= {styles.nameText}>{`${item.first_name} ${item.last_name}`}</Text>
                  {item.rental_name &&
                    <Text style={styles.locationText}>{item.rental_name}</Text>
                  }
                  {item.check_in !== '0001-01-01T00:00:00Z' &&
                   <Text style={styles.durationText}>{start_time} - {end_time}</Text>
                  }
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

            <View style={{flexDirection:'row', marginTop: 0, height: 28 }}>
              <Image source={require('../assets/images/phone.png')} style={{width: 20, height: 20, resizeMode: 'contain', marginRight: 15, marginLeft: 82, marginTop: 2}}  />
              <Text style={[styles.codeText]}>{item.phone}</Text>
            </View>
            
            <View style={{flexDirection:'row', marginTop: 0, height: 28}}>
              <Image source={require('../assets/images/email.png')} style={{width: 20, height: 20, resizeMode: 'contain', marginRight: 15, marginLeft: 82, marginTop: 2}}  />
              <Text style={[styles.codeText]}>{item.email} </Text>
            </View>

            { 
              !!item.door_code ? (
                <View style={{flexDirection:'row', marginTop: 0, height: 28}}>
                  <Image source={require('../assets/images/door-code.png')} style={{width: 20, height: 20, resizeMode: 'contain', marginRight: 15, marginLeft: 82, marginTop: 2}}  />
                  <Text style={styles.codeText}>{item.door_code}</Text>
                </View>
              ) : null

            }

            { 
              !item.rental_id ? (
                <View style={{flexDirection:'row', marginTop: 0, height: 28}}>
                  <Image source={require('../assets/images/warning.png')} style={{width: 20, height: 20, resizeMode: 'contain', marginRight: 15, marginLeft: 82, marginTop: 0}}  />
                  <Text style={[styles.warningText]}>Property Guide Missing</Text>
                </View>
              ) : null
            }

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
    marginTop: 0, 
    paddingBottom: 20,
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
    fontSize: 17,
    lineHeight: 20
  },
  durationText: {
    color: 'dimgray',
    fontSize: 13,
    marginTop: 4
  },
  locationText: {
    color: 'dimgray',
    fontSize: 13
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
    textAlign: 'left',
    fontWeight: '300',
    fontSize: 15,
    lineHeight: 18,
    marginHorizontal: 20
  },
  codeText: {
    textAlign: 'left',
    fontWeight: '300',
    fontSize: 15,
    lineHeight: 18
  },
  warningText: {
    textAlign: 'left',
    fontWeight: '300',
    fontSize: 15,
    lineHeight: 18,
    color: 'salmon'
  }
})