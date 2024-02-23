//import liraries
import React, { Component, useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, ImageBackground, ScrollView,BackHandler } from 'react-native';
import { StylesGloble } from '../../helper/Globlecss';
import ButtonField from '../../helper/ButtonField';
import imagePath from '../../constants/imagePath';
import LinearGradient from 'react-native-linear-gradient';
import ApiDataService from "./../../services/Apiservice.service";
import LoadingPage from '../../helper/LoadingPage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';
import { useTranslation } from 'react-i18next';
import './../../Language/i18'


const Getpointhiostry = ({ navigation, route }) => {
    const[applan,setapplan] = useState('')
   
    const {t,i18n}=useTranslation();
    useEffect(() => {
        AsyncStorage.getItem('Applang', (err, cr) => {
            i18n.changeLanguage(cr)
            setapplan(cr)
        })
    }, []);

    const [Loading, setLoading] = useState(false);
    const [point, setpoint] = useState('');
    const [ponitshistroy,setponitshistroy] = useState([])

    useEffect(() => {
        const backAction = () => {
            navigation.navigate('Home')

          return true;
        };
        const backHandler = BackHandler.addEventListener(
          'hardwareBackPress',
          backAction
        );
        return () => backHandler.remove();
      }, [navigation]);
    useEffect(() => {
        AsyncStorage.getItem('userID', (err, cre) => {
            let userID = JSON.parse(cre);
            console.log('cree',cre);
            uselogin(userID)
            getpointshistory(userID)
        })
    }, [])
    const uselogin = async (userID) => {
        let url = `userProfile?id=${userID}&lang=${applan}`
        ApiDataService.Getapi(url).then(response => {
            setLoading(false);
            setpoint(response.data.data.points)
        }).catch(e => {
        }).finally(() => {
            setLoading(false);
        });
    }

    const getpointshistory = async (userID) => {
        let url = `GetPoiuntWithUserId?user_id=${userID}&lang=${applan}`
        ApiDataService.Getapi(url).then(response => {
            console.log('resssssssssssssssssssss',response.data.data);
            setLoading(false);
            setponitshistroy(response.data.data)
        }).catch(e => {
            console.log('rrrr',e);
        }).finally(() => {
            setLoading(false);
        });
    }

    return (
        <>
            <View style={{ ...StylesGloble.container, ...StylesGloble.ScreenHorigental }}>
                <View style={{ ...StylesGloble.oneline, width: "100%", marginTop: 20, flexDirection: "row"}}>
                    <TouchableOpacity onPress={() => navigation.navigate('Home')} style={{ }}>
                        <Image style={{width: 21.43, height: 18,marginTop:15}} source={imagePath.backPage} />
                    </TouchableOpacity>
                    <Text style={{ fontSize: 18, fontWeight: "700", color: "#000000", ...StylesGloble.startposition, marginLeft: 10, marginTop: 10 }}>{t('Get points history')}</Text>
                </View>
                <View style={{ marginTop: 15, }}>
                    <LinearGradient colors={['#338AFF', '#00EDB4']} start={{ x: 0.09, y: 0.4 }} end={{ x: 1.5, y: 1.0 }} style={{ width: 320, height: 180, borderRadius: 8 }}>
                        <ImageBackground style={{ width: 320, height: 180, }} source={imagePath.pointhistory} >
                            <View style={{ justifyContent: 'center', flex: 1, alignItems: "center" }}>
                                <Text style={{ color: "white", fontSize: 35, fontWeight: '700' }}>
                                    {point}
                                </Text>
                                <Text style={{ color: "white", fontSize: 12, fontWeight: '500', }}>
                                    {t('OVERALL POINTS')}
                                </Text>
                            </View>
                        </ImageBackground>
                    </LinearGradient>
                </View>
                <View style={{ marginTop: 20 }}>
                    <Text style={{ ...StylesGloble.fontmedium, fontSize: 20 }}>{t('History')}</Text>
                </View>
                <ScrollView showsVerticalScrollIndicator={false}>
                    {
                        ponitshistroy.map((item, index) => {
                            return <View key={index} style={{ ...StylesGloble.oneline, marginBottom: 15, justifyContent: "space-between", width: "100%", borderBottomWidth: 1, paddingBottom: 20, paddingTop: 10, borderBottomColor: "#F3F2F2" }}>
                                <View style={{ width: '80%', }}>
                                    <Text style={{ ...StylesGloble.fontsmall, fontWeight: "500" }}>{item.title}</Text>
                                    <Text style={{ fontSize: 12, fontWeight: "400", lineHeight: 20 }}>{item.created_at}</Text>
                                </View>
                                <View style={{ width: '20%', }}>
                                    <Text style={{ ...StylesGloble.fontsmall, fontWeight: "500", color: "#338AFF", textAlign: "center" }}>+{item.point}</Text>
                                </View>
                            </View>
                        })
                    }
                </ScrollView>
            </View>
        </>
    );
};
export default Getpointhiostry;