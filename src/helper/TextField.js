import React, { useEffect, useRef, useState } from 'react'
import { Text,TextInput,StyleSheet,View,Animated,Easing, TouchableWithoutFeedback} from 'react-native'
import LinearGradient from 'react-native-linear-gradient';


const TextField= (props) => {
    const { label,errorText, value,style,type, onBlur,Placeholder, onFocus,...restOfProps} = props
    const [isFocused, setIsFocused] = useState(false)
    const inputRef = useRef(null)
    const focusAnim = useRef(new Animated.Value(0)).current
    let securetext = false;
    let keypadtype='default';
    let multilineobj = true;
    useEffect(() => {
        Animated.timing(focusAnim, {
            toValue: isFocused || !!value ? 1 : 0,
            duration: 150,
            easing: Easing.bezier(0.4, 0, 0.2, 1),
            useNativeDriver: true,
        }).start()
    }, [focusAnim, isFocused, value])

    let color =  '#B9C4CA'
    if (errorText) {
        color = '#B00020'
    }

    if (type=='email') {
        securetext = false;
        keypadtype='email-address';
        // multilineobj = false;
    }
    else if (type=='phone') {
        securetext = false;
        keypadtype='phone-pad';
        // multilineobj = false;
    }
    else if (type=='number') {
        securetext = false;
        keypadtype='numeric';
        // multilineobj = false;
    }
    else if (type=='password') {
        securetext = true;
        keypadtype='default';
        // multilineobj = false;
    }
    else{
        securetext = false;
        keypadtype='default';
        // multilineobj = true;
    }
    
    return (
        <View >
            <Text style={styles.newlable}>{label}</Text>
            <TextInput
                style={[styles.input]}
                ref={inputRef}
                numberOfLines={1}
                // multiline={multilineobj}
                keyboardType={keypadtype}
                placeholder={Placeholder}
                placeholderTextColor="#817878"
                type={type}
                {...restOfProps}
                secureTextEntry={securetext}
                value={value}
                onBlur={(event) => {
                    setIsFocused(false)
                    onBlur?.(event)
                }}
                onFocus={(event) => {
                    setIsFocused(true)
                    onFocus?.(event)
                }}
            />
           
            {!!errorText && <Text style={styles.error}>{errorText}</Text>}
        </View>
    )}

const styles = StyleSheet.create({
    input: {
        padding:10,
        backgroundColor:"#EEEEEE",
        borderRadius: 4,
        fontFamily:'Poppins-Regular',
        fontSize: 16,
        color:"#000000",
        marginTop:10,
    },
    labelContainer: {
        position: 'absolute',
      
        top:-10,
        left:-15

    },
    borderview:{
        borderColor:"#CC0076",
        borderWidth:1,
    },
    label: {
        fontFamily:'Poppins-Regular',
        backgroundColor:"rgba(17, 17, 17, 0)",
        fontSize: 16,
        marginTop:-7,
        color:"#ffffff"
    },
    error: {
        marginTop: 4,
        marginLeft: 12,
        fontSize: 12,
        color: '#B00020',
        fontFamily:'Poppins-Regular',
    },
    newlable:{
        fontSize: 14,
        fontWeight:"700",
        color:"#000000",
        marginBottom:5
    }
})

export default TextField