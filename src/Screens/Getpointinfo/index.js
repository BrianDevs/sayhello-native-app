//import liraries
import React, { Component,useEffect,useState } from 'react';
import { View, Text,Image,} from 'react-native';
import { StylesGloble } from '../../helper/Globlecss';
import ButtonField  from '../../helper/ButtonField';
import imagePath from '../../constants/imagePath';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from 'react-i18next';
import './../../Language/i18'


const datalist = [{
        title:"Point for registering"
    },{
        title:"100 points for making a confirmed connection"
    },{
        title:"200 points for opening a mutual"
    },{
        title:"Contest set system wide determined by membership"
    },{
        title:"After contest points lost if no connection is made before the next connection"
    },{
        title:"100 points gained for every 5 shares that end up buying app"
    }
]



const Getpointinfo = ({ navigation,route }) => {
    
const {t,i18n}=useTranslation();
useEffect(() => {
    AsyncStorage.getItem('Applang', (err, cr) => {
        i18n.changeLanguage(cr)
    })
}, []);
    const submitfun = () =>{
        navigation.navigate('Persionalinfo', {
            routetype: 1
        })
    }
    return (
        <>
            <View style={{...StylesGloble.container,...StylesGloble.ScreenHorigental}}>
                <View style={{...StylesGloble.widthheight100,marginTop:20}}>
                    <Image  style={{ width: 208, height: 251}} source={imagePath.Getinfo} />
                </View>
                <View style={{marginTop:0}}>
                    <Text style={{...StylesGloble.fontmedium,marginTop:50,fontSize:20}}>{t('Get points info')}</Text>
                </View>
                <View  style={{marginTop:20}}>
                    {
                        datalist.map((item,index)=>{
                            return  <View key={index} style={{...StylesGloble.oneline,marginBottom:15,}}>
                                        <Image  style={{ width: 22, height: 22}} source={imagePath.star} />
                                        <Text style={{...StylesGloble.fontsmall,marginLeft:10,marginRight:15,width:'90%'}}>{item.title}</Text>
                                    </View>
                        })
                    }
                </View>
                <View style={{width:"100%",marginTop:5}}>
                    <ButtonField label={t('Continue')} submitfun={submitfun}/>
                </View> 
            </View>
        </>
    );
};
export default Getpointinfo;