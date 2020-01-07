import React, { Component } from 'react';
import {
    Text,    
} from 'react-native';

export default class ChatCell extends Component {
  render () {
    let { children } = this.props;
    return (            
      <Text
        style = {{
            fontSize: 14,
            fontWeight: '300',
            textTransform: 'uppercase',
            color: '#000000',
            opacity: 0.5,
            lineHeight: 24,
            marginBottom: 4,
        }}
        >{ children }</Text>        
    )
  }
}