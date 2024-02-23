//import liraries
import React, { Component } from 'react';
import { View, Text,StatusBar } from 'react-native';

const Splash = ({ navigation,route }) => {
    return (
       
        <View >
             <StatusBar
        animated={true}
        backgroundColor="#1551FE"
        barStyle="light-content"
    />
            <Text style={{color: 'blue',fontWeight: 'bold',fontSize: 30,}}>Splash</Text>
        </View>
    );
};
export default Splash;