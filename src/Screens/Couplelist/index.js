//import liraries
import React, { Component, useEffect, useState } from 'react';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, BackHandler } from 'react-native';
import { StylesGloble } from '../../helper/Globlecss';
import imagePath from '../../constants/imagePath';
import ApiDataService from "./../../services/Apiservice.service";
import LoadingPage from '../../helper/LoadingPage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from 'react-i18next';
import './../../Language/i18';

const Couplelist = ({ navigation, route }) => {
    const [applan, setapplan] = useState('')

    const { t, i18n } = useTranslation();

    useEffect(() => {
        AsyncStorage.getItem('Applang', (err, cr) => {
            i18n.changeLanguage(cr)
            setapplan(cr)
        })
    }, []);
    const [Loading, setLoading] = useState(false);
    const [chatlist, setchatlist] = useState([])
    const [userId, setuserId] = useState('')


    useEffect(() => {
        const backAction = () => {
            navigation.navigate('Home');
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
            setLoading(true);
            setuserId(userID)
            getCoupleslist(userID)
        })

    }, [])
    const getCoupleslist = (userID) => {

        let url = `getCouples?user_id=${userID}`
        console.log(url);
        console.log(url);
        ApiDataService.Getapi(url).then(response => {
            setLoading(false);
            console.log("============response.data=======", response.data)
            if (response.data.status == true) {
                setchatlist(response.data.data)
            }
        }).catch(e => {
            setLoading(false);
        })
    }
    const gotogotochatlist = (id) => {
        navigation.navigate('Memberconnection', { id: id})
        AsyncStorage.setItem('coupleid', '' + id);
        console.log('idididididid',id);

    }
    return (
        <>
            <View style={{ ...StylesGloble.container, ...StylesGloble.ScreenHorigental, position: "relative" }}>
                <View style={{ ...StylesGloble.oneline, width: "100%", marginTop: 10 }}>
                    <TouchableOpacity onPress={() => navigation.navigate('Home')} style={{ ...StylesGloble.homeheaderlocation, left: wp('3%'), zIndex: 999 }}>
                        <Image style={{ width: 20, height: 20, marginTop: 0 }} source={imagePath.backPage} />
                    </TouchableOpacity>
                    <Text style={{ fontSize: 18, fontWeight: "700", color: "#000000", ...StylesGloble.startposition, marginLeft: 45, marginTop: 10 }}>{t("Members connection")}</Text>
                </View>
                <View style={{ marginTop: 20, height: hp('100%') }}>
                    <ScrollView showsVerticalScrollIndicator={false}>
                        {
                            chatlist.map((item, index) => {
                                return <TouchableOpacity key={index} style={{ ...StylesGloble.oneline, marginBottom: 20, flexDirection: "row" ,}} onPress={()=>{ gotogotochatlist(item.id) }} >
                                    <View style={{ width: '20%', }}>
                                        <Image style={{ width: 61, height: 61, borderRadius: 50 }} source={{ uri: item.image }} />
                                    </View>
                                    <View style={{ width: '70%' }}>
                                        <Text style={{ fontSize: 15, fontWeight: "600", color: "#000000", marginLeft: 10, marginTop: 10 }}>{item.name}</Text>

                                    </View>
                                </TouchableOpacity>
                            })
                        }
                    </ScrollView>
                </View>
            </View>
        </>
    );
};
export default Couplelist;