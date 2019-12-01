import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import Icon from '@expo/vector-icons/build/FontAwesome';

const InformationDetail = props => {
  return (
    <View>
      <Text style={styles.information}>
        <Icon name={props.name} size={20} color={'#525252'} /> {props.address}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  information: {
    fontSize: 15,
    color: '#4B4B4B',
    paddingBottom: 10,
    lineHeight: 20
  }
});

export default InformationDetail;
