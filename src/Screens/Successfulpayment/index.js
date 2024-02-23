//import liraries
import React, { Component, useState,useEffect } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { StylesGloble } from '../../helper/Globlecss';
import imagePath from '../../constants/imagePath';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from 'react-i18next';
import './../../Language/i18'

const Successfulpayment = ({ navigation, route }) => {

    const {t,i18n}=useTranslation();
    useEffect(() => {
        AsyncStorage.getItem('Applang', (err, cr) => {
            i18n.changeLanguage(cr)
        })
    }, []);

    const submitfun = () => {
        navigation.navigate('Getpointinfo');
    }

    return (
        <>
            <View style={{ ...StylesGloble.container, ...StylesGloble.ScreenHorigental }}>
                <View style={{ ...StylesGloble.widthheight100, alignSelf: "center", marginTop: '40%' }}>
                    <Image style={{ width: 220, height: 220 }} source={imagePath.sucesspayment} />
                </View>
                <View style={{ ...StylesGloble.centerclass }}>
                    <Text style={{ ...StylesGloble.fontmedium, marginTop: 15, fontSize: 25 }}>{t('Successful payment')}</Text>
                    <Text style={{ ...StylesGloble.fontsmall, alignItems: "center", marginTop: 15, textAlign: "center" }}>Lorem ipsum dolor sit amet, consectetur adipiscing elit</Text>
                </View>
                <TouchableOpacity onPress={() => { submitfun() }} style={{ marginTop: 25, ...StylesGloble.centerclass }}>
                    <Text style={{ fontSize: 22, color: '#338AFF', textDecorationLine: 'underline' }}>{t('Continue')}</Text>
                </TouchableOpacity>
            </View>
        </>
    );
};

export default Successfulpayment;