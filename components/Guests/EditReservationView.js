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
      checkIn:'',
      checkOut:'',
      phone: props.item.phone,
      doorCode: props.item.door_code,
      showPicker: props.showDatePicker,
    };
  }

  formatTime = (timeStr) => {
    let newDate = new Date(timeStr);
    return Moment(newDate).format("DD/MM/YYYY");
  }

  render(){

    const item = this.props.item

    let start_time = this.formatTime(item.check_in);
    let end_time = this.formatTime(item.check_out);

    return (
      <View style={{marginVertical: 20}}>
            <Text style={{fontSize: 22, fontWeight: 'bold', marginLeft: 10}}> EDIT </Text>

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
                  <View tyle={{flex: 1}}>
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

                  <View tyle={{flex: 1}}>
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
                  <View style={{flex: 1}}>
                    <Text style={styles.textHeaderStyle}>CHECK IN</Text>
                    <TextInput
                      style={styles.textInputStyle}
                      placeholder= { "Check in time"} 
                      onChangeText={(text) => {
                          this.setState({checkIn: text, showPicker: true})
                      }}
                      value={start_time}
                    />
                  </View>
                  
                  <View style={{flex: 1}}>
                    <Text style={styles.textHeaderStyle}>CHECK OUT</Text>
                    <TextInput
                      style={styles.textInputStyle}
                      placeholder= { "Check out time"} 
                      onChangeText={(text) => {
                          this.setState({checkOut: text})
                      }}
                      value={end_time}
                    />
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
              <TouchableOpacity style={styles.saveButton} onPress={()=>this.props.onPress(true)}>
                <Text style={{color: 'white'}}>SAVE</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.cancelButton}>
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