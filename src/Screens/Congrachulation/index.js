import React, { Component,useEffect } from 'react';
import { View, Text,Image,TouchableOpacity,BackHandler } from 'react-native';
import { StylesGloble } from '../../helper/Globlecss';
import imagePath from '../../constants/imagePath';
import messaging from "@react-native-firebase/messaging";
import Toast from 'react-native-simple-toast';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from 'react-i18next';
import './../../Language/i18'


const Congrachulation = ({ navigation,route }) => {
    const page = route.params.routetype
    const {t,i18n}=useTranslation();
    useEffect(() => {
        AsyncStorage.getItem('Applang', (err, cr) => {
            i18n.changeLanguage(cr)
        })
    }, []);

 const calltoastmessage = (data) => {
    Toast.showWithGravity(data, Toast.SHORT, Toast.BOTTOM);
};

useEffect(() => {
    const backAction = () => {
      navigation.goBack();
      return true;
    };
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction
    );
    return () => backHandler.remove();
  }, [navigation]);

    const submitfun = () =>{
        navigation.navigate('Information')
    }
    return (
        <>
            <View style={{...StylesGloble.container,...StylesGloble.ScreenHorigental}}>
                <View style={{...StylesGloble.widthheight100,marginTop:100,paddingHorizontal:15}}>
                    <Image  style={{ width: '100%', height: 340,margin:12}} source={imagePath.Congratulations} />
                </View>
                <View style={{marginTop:50,alignItems:"center"}}>
                    <Text style={{...StylesGloble.fontsmall,alignItems:"center",marginTop:15,fontWeight:'500'}}>{t('You have got what it is 100 entries')}</Text>
                    <Text style={{...StylesGloble.fontsmall,alignItems:"center",marginTop:5,fontWeight:'500'}}>{t('You have made a connection')}</Text>
                    <Text style={{...StylesGloble.fontsmall,alignItems:"center",marginTop:35,textAlign:"center",marginLeft:20,marginRight:20,fontWeight:'500'}}>{t('You will be get open chat notification after 12 hours')}</Text>
                   
                </View>
                {(page==1)?(  
                     <TouchableOpacity onPress={()=>{submitfun()}} style={{marginTop:50,...StylesGloble.centerclass}}>
                    <Text style={{fontSize:23,marginLeft:5,color:'#338AFF',textDecorationLine: 'underline'}}>{t('Continue')}</Text>
                </TouchableOpacity>): (  
                     <TouchableOpacity onPress={()=>{submitfun()}} style={{marginTop:50,...StylesGloble.centerclass}}>
                    <Text style={{fontSize:23,marginLeft:5,color:'#338AFF',textDecorationLine: 'underline'}}>{t('Continue')}</Text>
                </TouchableOpacity>)}
             
            </View>
        </>
    );
};
export default Congrachulation;