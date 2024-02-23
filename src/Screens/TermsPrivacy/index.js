import React, { useEffect, useState, useContext } from 'react';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { View, Text, Image, TouchableOpacity, ImageBackground, Alert, Modal, StyleSheet, Pressable } from 'react-native';
import { StylesGloble } from './../../helper/Globlecss';
import imagePath from './../../constants/imagePath';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from 'react-i18next';
import './../../Language/i18'

const TermsPrivacy = ({ navigation, route, onPress }) => {
    const route_number = route?.params?.routetype;
    const {t,i18n}=useTranslation();
    useEffect(() => {
        AsyncStorage.getItem('Applang', (err, cr) => {
            i18n.changeLanguage(cr)
        })
    }, []);
    return (
        <View style={{ ...StylesGloble.container, ...StylesGloble.ScreenHorigental }}>
            <View style={{ ...StylesGloble.oneline, width: "100%", marginTop: 20, marginBottom: 20 }}>
                <TouchableOpacity onPress={() => navigation.navigate('Login')} style={{ ...StylesGloble.homeheaderlocation, left: 3, zIndex: 999, top: 0, marginTop: 6 }}>
                    <Image style={{ width: 15, height: 15, }} source={imagePath.backPage} />
                </TouchableOpacity>
                <Text style={{ fontSize: 18, fontWeight: "700", color: "#000000", ...StylesGloble.startposition, marginLeft: 40, marginTop: 0 }}> {(route_number == 1) ? t('Privacy') : t('Terms')}</Text>
            </View>

            <View>
                <Text style={{fontSize:15,color:"#666666"}}>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Id diam maecenas ultricies mi eget mauris pharetra. Massa massa ultricies mi quis hendrerit dolor. Faucibus ornare suspendisse sed nisi lacus sed viverra. Vitae turpis massa sed elementum. Semper risus in hendrerit gravida rutrum quisque.
                </Text>
            </View>
            <View style={{marginTop:20}}>
                <Text style={{fontSize:15,color:"#666666"}}>
                    Facilisi etiam dignissim diam quis enim lobortis. At augue eget arcu dictum varius duis at consectetur. Morbi quis commodo odio aenean sed. Sed vulputate odio ut enim blandit volutpat maecenas volutpat blandit. Orci dapibus ultrices in iaculis nunc. Purus gravida quis blandit turpis cursus in. Sit amet facilisis magna etiam tempor orci eu lobortis elementum.
                </Text>
            </View>
            <View style={{marginTop:20}}>
                <Text style={{fontSize:15,color:"#666666"}}>
                    Vitae nunc sed velit dignissim sodales. Integer vitae justo eget magna fermentum iaculis eu non diam. Lorem mollis aliquam ut porttitor leo a diam sollicitudin. Dictumst quisque sagittis purus sit amet volutpat consequat mauris. Accumsan lacus vel facilisis volutpat. Vitae nunc sed velit dignissim sodales ut eu sem.
                </Text>
            </View>
            <View style={{marginTop:20}}>
                <Text style={{fontSize:15,color:"#666666"}}>
                    Viverra justo nec ultrices dui sapien eget mi. Vitae ultricies leo integer malesuada nunc vel risus. Dignissim convallis aenean et tortor at. Massa enim nec dui nunc mattis enim ut tellus. Pellentesque massa placerat duis ultricies lacus sed turpis. Dui id ornare arcu odio ut sem nulla pharetra.
                </Text>
            </View>


        </View>
    );
};
export default TermsPrivacy;
const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 22,
    },
    modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2,
    },
    buttonOpen: {
        backgroundColor: '#F194FF',
    },
    buttonClose: {
        backgroundColor: '#2196F3',
    },
    textStyle: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    modalText: {
        marginBottom: 15,
        textAlign: 'center',
    },
});