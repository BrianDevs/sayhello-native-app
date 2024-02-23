import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer , DefaultTheme} from '@react-navigation/native';
// import messaging from '@react-native-firebase/messaging';
import {PermissionsAndroid,StatusBar} from 'react-native';
import React, { useEffect, useState } from 'react';
import AuthStack from './AuthStack';
import DrawerStack from './DrawerStack';
import {ActivityIndicator,View} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch } from 'react-redux';
import { setUserData} from '../Redux/index';
import SplashScreen from 'react-native-splash-screen';
import ApiDataService from "../services/Apiservice.service";
import Geolocation from '@react-native-community/geolocation';
import PushController from '../Pushontroller/PushController';

function Routes() {

    const dispatch = useDispatch();
    const [IsLogin,setIslogin]=useState(false);
    const [authLoaded, setAuthLoaded] = React.useState(false);

    useEffect(()=>{
        uselogin();
        // <PushController/>
        setTimeout(()=>{
            SplashScreen.hide();
        },500)
       
    },[IsLogin])

    const interval = setInterval(() => {
        Geolocation.getCurrentPosition(
            (position) => {
                updateLatLngfun(position.coords.latitude,position.coords.longitude);
            },
            (error) => {
            },
        );
    }, 500000);
    const updateLatLngfun = async(lat,lang) => {
        const user = await AsyncStorage.getItem('isLogin');
        
        if (user=='1') {
            AsyncStorage.getItem('userID', (err, cre) => {
                let  userID =  JSON.parse(cre);
                let formdata = {
                    "id": userID,
                    "lat": lat,
                    "lng": lang,
                }
                let url = 'updateLatLng'
                ApiDataService.Postapi(url, formdata).then(response => {
                    
                }).catch(e => {
                });
            })
        }
        else{
            clearInterval(interval);
        }
    }
    const uselogin = async ()=>{
        try {
            const user = await AsyncStorage.getItem('isLogin');
            if (user=='1') {
               
                setAuthLoaded(true);
                setIslogin(true);
                interval();
                
            } else {
                clearInterval(interval);
                setAuthLoaded(true);
                setIslogin(false);
            }
          } catch (error) {}
    }

    return (
       
        <>
                <StatusBar
                    animated={true}
                    backgroundColor="#1551FE"
                    barStyle="light-content"
                />
            {authLoaded ==true ? (
                <NavigationContainer theme={DefaultTheme}>
                    {IsLogin==false ?    <AuthStack/>:<DrawerStack />}
                </NavigationContainer>
            ) : (
                <View style={{width:"100%",height:"100%",backgroundColor:"#fffffff"}}>
                    <ActivityIndicator />
                </View>
                
            )}
        </>
    )
}

export default Routes;