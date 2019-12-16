import React from 'react';
import { 
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity
 } from 'react-native';
 import {  Entypo } from '@expo/vector-icons';

export default class PostCell extends React.PureComponent {

  render(){
    const item = this.props.item

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
              <Text style= {styles.nameText}>{item.user_name}</Text>
              <Text style= {styles.creatTimeText}>{item.creat_time}</Text>
            </View>
            <View style={{flexDirection: 'row'}}>
              <View style={{flex:1}}>
                <Text style={styles.locationText}>{item.location}</Text>
                <Text style={styles.durationText}>{item.start_time} - {item.end_time}</Text>
              </View>
              <Entypo
                style = {styles.box}
                color =  'darkgray'
                name={'box'}
                size={25}
              />
              <Entypo
                style = {styles.box}
                color =  {item.is_read ? 'darkgray' : 'salmon'}
                name={'flag'}
                size={25}
              />

              
            </View>

          </View>

        </View>
        <Text style={[styles.contentText, {fontWeight: item.is_read ? '300': '500'}]}> {item.content} </Text>
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
  locationText: {
    color: 'dimgray',
    fontSize: 13,
  },
  durationText: {
    color: 'dimgray',
    fontSize: 13,
  },
  creatTimeText: {
    color: 'dimgray',
    fontSize: 13,
    marginLeft:'auto',
    marginRight: 0,
  },
  box: {
    marginLeft: 10,
    marginRight: 0,
  },
  contentText: {
    textAlign: 'justify',
    marginHorizontal: 20,
    marginBottom: 20
  }
})