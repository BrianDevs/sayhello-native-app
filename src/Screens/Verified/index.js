//import liraries
import React, { Component,useEffect,useState } from 'react';
import { View, Text,Image,TouchableOpacity } from 'react-native';
import { StylesGloble } from '../../helper/Globlecss';
import imagePath from '../../constants/imagePath';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from 'react-i18next';
import './../../Language/i18'

const Verified = ({ navigation,route }) => {
   const pagetype = route.params.pagetype;
    const submitfun = () =>{
        navigation.navigate('Lifestyle', {
            routetype: 1
        });
    }
    const {t,i18n}=useTranslation();
    useEffect(() => {
        AsyncStorage.getItem('Applang', (err, cr) => {
            i18n.changeLanguage(cr)
        })
    }, []);
    return (
        <>
            <View style={{...StylesGloble.container,...StylesGloble.ScreenHorigental}}>
                <View style={{...StylesGloble.widthheight100,marginTop:50}}>
                    <Image  style={{ width: '80%', height: 250}} source={imagePath.Verifed} />
                </View>
                {
                    (pagetype==1)?(
                        <>
                        <View style={{...StylesGloble.centerclass}}>
                            <Text style={{...StylesGloble.fontmedium,marginTop:30,fontSize:25}}>{t('Id card verified')}</Text>
                            <Text style={{...StylesGloble.fontsmall,alignItems:"center",marginTop:15}}>Lorem ipsum dolor sit amet, consectetur adipiscing elit</Text>
                        </View>
                        <TouchableOpacity onPress={()=>{  navigation.navigate('Uploadfacelicence')}} style={{marginTop:25,...StylesGloble.centerclass}}>
                            <Text style={{fontSize:23,marginLeft:5,color:'#338AFF',textDecorationLine: 'underline'}}> {t('Continue')}</Text>
                        </TouchableOpacity>
                        </>
                    ):(
                        <>
                        <View style={{...StylesGloble.centerclass}}>
                            <Text style={{...StylesGloble.fontmedium,marginTop:30,fontSize:25}}> {t('Verified')}</Text>
                            <Text style={{...StylesGloble.fontsmall,alignItems:"center",marginTop:15}}>Lorem ipsum dolor sit amet, consectetur adipiscing elit</Text>
                        </View>
                        <TouchableOpacity onPress={()=>{ submitfun()}} style={{marginTop:25,...StylesGloble.centerclass}}>
                            <Text style={{fontSize:23,marginLeft:5,color:'#338AFF',textDecorationLine: 'underline'}}>{t('Continue')}</Text>
                        </TouchableOpacity>
                        </>
                    )
                } 
            </View>
        </>
    );
};
export default Verified;