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
     <View
        style={{
          backgroundColor: '#ffffff',
          borderWidth: 1,
          borderColor: '#cccccc',
          padding: 16,
          marginTop: 8,
          marginRight: 8,
          marginLeft: 8,
          borderRadius: 3,
          display: 'flex'
        }}
      >        
        <View
          style={{
            display: 'flex',
            flexDirection: 'row'
          }}
        >
          <Image 
            source={ { uri: 'https://i.pravatar.cc/150?img=59' } }
            style={{
              width: 48,
              height: 48,
              borderRadius: 24,
              marginRight: 16,
              overflow: 'hidden'
            }}
          />
          <View
            style={{
              marginTop: 8,
              flex: 1,
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between'
            }}
          >
            <Text
              style={{
                flex: 1,
                fontSize: 18,
                lineHeight: 24,
                fontWeight: '400'
              }}
            >
              Joel Weber
            </Text>
            <Entypo                  
              color =  'black'
              name={'chevron-thin-right'}
              size={20}
            />
          </View>
        </View>
        <View>
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between'
            }}
          >
            <View
              style={{
                flex: 1,
                display: 'flex',
                marginLeft: 64
              }}
            >
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: '300',
                  lineHeight: 16,
                  opacity: 0.6
                }}
              >101 Main Street Guide</Text>
              <Text
              style={{
                fontSize: 14,
                fontWeight: '300',
                lineHeight: 16,
                opacity: 0.6
              }}
              >12/1/2019 - 12/10/2019</Text>
            </View>
          </View>       
        </View>
        <Text
          style={{
            marginTop: 16,
            fontSize: 16,
            color: '#2d2d2d',
            lineHeight: 24,
            fontWeight: '300'
          }}
        >
        david.fincher@gmail.com / 617-216-9862
        </Text>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row'
          }}
        >
          <Text
            style={{
              fontSize: 14,
              opacity: 0.6,
              fontWeight: '300',
              lineHeight: 24
            }}
          >Door Code: </Text>
          <Text
            style={{
              fontSize: 14,
              lineHeight: 24 
            }}
          >1244</Text>
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
    marginHorizontal: 10, 
    marginTop: 0, 
    marginBottom: 10,
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