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

  formatTime = (timeStr) => {
    let newDate = new Date(timeStr);
    return Moment(newDate).format("DD/MM/YYYY");
  }

  render(){
    const item = this.props.item

    let last_msg_on = this.formatTime(item.last_msg_on);
    let check_in = this.formatTime(item.check_in);
    let check_out = this.formatTime(item.check_out);

    return (

      <TouchableOpacity
        onPress={this.props.onPress}
        style={{
          backgroundColor: '#ffffff',
          borderWidth: 1,
          borderColor: '#cccccc',
          padding: 16,
          marginRight: 8,
          marginLeft: 8,
          marginBottom: 8,
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
              David Fincher
            </Text>
            <Text
              style={{
                fontSize: 14,
                fontWeight: '300',
                lineHeight: 24,
                opacity: 0.6
              }}
            >
              12/2/2019 10:30 pm
            </Text>
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
              >Beach House</Text>
              <Text
              style={{
                fontSize: 14,
                fontWeight: '300',
                lineHeight: 16,
                opacity: 0.6
              }}
              >12/1/2019 - 12/10/2019</Text>
            </View>
            <View
              style={{
                display: 'flex',
                flexDirection: 'row'
              }}
            >
              <Entypo
                style = {{
                  marginRight: 8,
                }}
                color =  'darkgray'
                name={'box'}
                size={20}
              />
              <Entypo               
                color =  {item.primary ? 'darkgray' : 'salmon'}
                name={'flag'}
                size={20}
              />
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
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptas, facere modi! In expedita quos id doloribus ipsa suscipit quod?
        </Text>
      </TouchableOpacity>
   
   );
  }
 
}
