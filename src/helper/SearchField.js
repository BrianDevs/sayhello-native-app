import React from 'react'
import { Text,TextInput,StyleSheet,View,Image,} from 'react-native'
import imagePath from './../constants/imagePath';

const SearchField= ({placeholder,value,Changevalue}) => {
    return (
        <View  style={styles.outer}>
            <Image  style={styles.image} source={imagePath.searchicon} />
            <TextInput
                style={styles.input}
                onChangeText={Changevalue}
                placeholderTextColor="#BBBBBB"
                value={value}
                placeholder={placeholder}
            />
        </View>
    )}

const styles = StyleSheet.create({
    outer:{
        width:"100%",
        position:"relative",
        backgroundColor:"#EEEEEE",
        flexDirection:"row",
        borderRadius: 12,
        fontFamily:'Poppins-Regular',
        paddingLeft:20,
    },
    input: {
        padding:10,
        fontSize: 16,
        color:"black"
    },
    borderview:{
        borderColor:"#EEEEEE",
        borderWidth:1,
    },
    image:{
        alignSelf:"center",
        width:20,height:20
    }
})
export default SearchField