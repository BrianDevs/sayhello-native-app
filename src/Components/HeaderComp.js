import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Text, TouchableOpacity,StyleSheet, View,Image } from 'react-native';
import imagePath from './../constants/imagePath';

const HeaderComp = (props) => {
    const navigation = useNavigation()
    return (
        <View style={{ flexDirection: "row", justifyContent: 'space-between', height: 60,padding:10,paddingTop:20,backgroundColor:"#FFFFFF"}} >
            <TouchableOpacity  onPress={()=> navigation.goBack(null)} style={{width:50,marginTop:3,marginLeft:10}}>
                <Image style={styles.backimg}  source={imagePath.backPage} />
            </TouchableOpacity> 
            <View style={styles.textview}>
                <Text style={styles.Textcass}>{props.text}</Text>
            </View>
        </View>
    );
};
const styles = StyleSheet.create({
    Textcass: {
        fontSize: 18,
        color:"#000000",
        alignItems:"flex-start",
        justifyContent:"flex-start"
    },
    textview:{
        width:"100%",
       
    },
    backimg:{
        width:24,
        height:21
    }
    
})

export default HeaderComp;
