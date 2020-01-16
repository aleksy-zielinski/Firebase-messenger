import React from 'react';
import { 
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
 } from 'react-native';
 import Moment from 'moment';

export default class EditReservationView extends React.PureComponent {

  constructor(props) {
    super(props);

    this.state = {
      email: props.item.email,
      fistName: props.item.first_name,
      lastName: props.item.last_name,
      phone: props.item.phone,
      doorCode: props.item.door_code,
    };
  }

  render(){

    const item = this.props.item

    // console.log('redener edit view', this.state.checkIn)
    let start_time = Moment(this.props.checkIn).format("MM/DD/YYYY");
    let end_time = Moment(this.props.checkOut).format("MM/DD/YYYY");

    return (
      <View style={{marginVertical: 20}}>
            <Text style={{fontSize: 22, fontWeight: 'bold', marginLeft: 10}}> Edit </Text>

            <View style={styles.container}>
              <Text style={styles.textHeaderStyle}>RESERVATION ID</Text>
                <TextInput
                  style={[styles.textInputStyle, {backgroundColor:'lightgray'}]}
                  placeholder= { "Enter email"} 
                  value={`${item.id}`}
                  editable={false}
                />

                <Text style={styles.textHeaderStyle}>PROPERTY ID</Text>
                <TextInput
                  style={styles.textInputStyle}
                  placeholder= { "Enter email"} 
                  onChangeText={(text) => {
                      this.setState({email: text})
                  }}
                  value={this.state.email}
                />

                <View style={{flexDirection: 'row'}}> 
                  <View style={{flex: 1}}>
                    <Text style={styles.textHeaderStyle}>FIRST NAME</Text>
                    <TextInput
                      style={styles.textInputStyle}
                      placeholder= { "Enter firstname"} 
                      onChangeText={(text) => {
                          this.setState({fistName: text})
                      }}
                      value={this.state.fistName}
                    />
                  </View>

                  <View style={{flex: 1}}>
                    <Text style={styles.textHeaderStyle}>LAST NAME</Text>
                    <TextInput
                      style={styles.textInputStyle}
                      placeholder= { "Enter lastname"} 
                      onChangeText={(text) => {
                          this.setState({lastName: text})
                      }}
                      value={this.state.lastName}
                    />
                  </View>

                </View>

                <View style={{flexDirection: 'row'}}> 
                  <View style={{flex: 1}} onPress={()=>this.props.onPressTimePicker(true)}>
                    <Text style={styles.textHeaderStyle}>CHECK IN</Text>
                    <TouchableOpacity 
                      style={styles.timePickerStyle}
                      onPress={()=>this.props.onPressTimePicker(true)}>
                      <Text>{start_time}</Text>
                    </TouchableOpacity>
                  </View>
                  
                  <View style={{flex: 1}}>
                    <Text style={styles.textHeaderStyle}>CHECK OUT</Text>
                    <TouchableOpacity 
                      style={styles.timePickerStyle}
                      onPress={()=>this.props.onPressTimePicker(false)}>
                        <Text>{end_time}</Text>
                    </TouchableOpacity>
                  </View>

                </View>

                <Text style={styles.textHeaderStyle}>EMAIL</Text>
                <TextInput
                  style={styles.textInputStyle}
                  placeholder= { "Enter email"} 
                  onChangeText={(text) => {
                      this.setState({email: text})
                  }}
                  value={this.state.email}
                />

                <View style={{flexDirection: 'row'}}> 
                  <View style={{flex: 1.5}}>
                    <Text style={styles.textHeaderStyle}>PHONE</Text>
                    <TextInput
                      style={styles.textInputStyle}
                      keyboardType = 'phone-pad'
                      placeholder= { "Phone number"} 
                      onChangeText={(text) => {
                          this.setState({phone: text})
                      }}
                      value={this.state.phone}
                    />
                  </View>
                  
                  <View style={{flex: 1}}>
                    <Text style={styles.textHeaderStyle}>DOOR CODE</Text>
                    <TextInput
                      style={styles.textInputStyle}
                      keyboardType = 'number-pad'
                      placeholder= { "Door code"} 
                      onChangeText={(text) => {
                          this.setState({doorCode: text})
                      }}
                      value={this.state.doorCode}
                    />
                  </View>

                </View>

            </View>

            <View style={{flexDirection: 'row', marginHorizontal: 10}}>
              <TouchableOpacity style={styles.saveButton} 
                // onPress={()=>this.props.onPress(true)}
                >
                <Text style={{color: 'white'}}>SAVE</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.cancelButton}
                onPress={()=>this.props.cancelPress()}
              >
                <Text style={{color: '#e66656'}}>CANCEL</Text>
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
    paddingBottom: 20,
  },
  textHeaderStyle: {
    color: 'gray',
    fontSize: 20, 
    fontWeight: '300', 
    marginLeft: 10, 
    marginTop: 20
  },
  textInputStyle:{
    borderRadius: 5, 
    height: 40, 
    marginHorizontal: 10, 
    marginTop: 5, 
    borderColor: 'lightgray', 
    borderWidth: 1, 
    paddingHorizontal: 10
  },
  timePickerStyle:{
    borderRadius: 5, 
    height: 40, 
    marginHorizontal: 10, 
    marginTop: 5, 
    borderColor: 'lightgray', 
    justifyContent: 'center',
    borderWidth: 1, 
    paddingHorizontal: 10
  },
  cancelButton: {
    backgroundColor: 'white', 
    borderColor: 'lightgray',
    borderRadius: 20, 
    height: 40, 
    width: 100, 
    justifyContent:'center', 
    alignItems: 'center',
    marginLeft: 10,
  },
  saveButton: {
    backgroundColor: '#e66656', 
    borderRadius: 20, 
    height: 40, 
    width: 100, 
    justifyContent:'center', 
    alignItems: 'center'
  }
})