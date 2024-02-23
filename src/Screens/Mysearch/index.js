//import liraries
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, BackHandler } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { StylesGloble } from '../../helper/Globlecss';
import ButtonField from '../../helper/ButtonField';
import imagePath from '../../constants/imagePath';
import TextField from './../../helper/TextField';
import RangeSlider from './../../helper/RangeSlider';
import { Coustompickerwithoutok } from '../../helper/Coustompickerwithoutok';
import ApiDataService from "./../../services/Apiservice.service";
import Toast from 'react-native-simple-toast';
import LoadingPage from '../../helper/LoadingPage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from 'react-i18next';
import './../../Language/i18'

const Snoyesdata = [
    { id: 1, name: 'Male' },
    { id: 2, name: 'Female' },
]

const Mysearch = ({ navigation, route }) => {
    const [applan, setapplan] = useState('')

    const { t, i18n } = useTranslation();
    useEffect(() => {
        AsyncStorage.getItem('Applang', (err, cr) => {
            i18n.changeLanguage(cr)
            setapplan(cr)
        })
    }, []);
    const pagetype = route.params.routetype;
    const routenum = route?.params?.routetype


    const [Iwantto, setIwantto] = useState(false);
    const [location, setlocation] = useState(false);
    const [IsLogin, setIslogin] = useState('');

    const [rangelow, setRangeLow] = useState(18);
    const [rangehigh, setRangeHigh] = useState(100);

    const [getinterest, setgetinterest] = useState(Snoyesdata);
    const [interest, setinterest] = useState('');
    const [interestid, setinterestid] = useState('')

    const [pickerdata, setpickerdata] = useState([]);
    const [pickeropen, setpickeropen] = useState(false);
    const [pickertype, setpickertype] = useState(false);
    const [Loading, setLoading] = useState(false);
    const [userId, setuserId] = useState('');
    const [showtime, setshowtime] = useState(false);

    

    useEffect(() => {
        const backAction = () => {
            { (routenum == 2) && navigation.navigate('Home') }

            return true;
        };
        const backHandler = BackHandler.addEventListener(
            'hardwareBackPress',
            backAction
        );
        return () => backHandler.remove();
    }, [navigation]);
    const obj = { "Male": 1, "Female": 2 }
    const returnYrsNo = (id) => {
        for (let i in obj) {
            if (obj[i] == id) {
                return i;
            }
        }
        return id
    }


    useEffect(() => {
        AsyncStorage.getItem('userID', (err, cre) => {
            let userID = JSON.parse(cre);
            setuserId(userID);
            uselogin(userID)
        })
    }, [])

    const calltoastmessage = (data) => {
        Toast.showWithGravity(data, Toast.SHORT, Toast.BOTTOM,);
    };

    const submitfun = () => {
        addMysearchinfo()
    }

    const openpickerfun = async (data, type) => {
        setpickertype(type)
        setpickerdata(data);
        setpickeropen(true);
    }

    const pickeractionfun = async (type, value) => {
        if (type == 'v') {
            if (pickertype == '1') {
                setinterest(value.name);
                setinterestid(value.id)
            }

            setpickeropen(false);
        }
        else {
            setpickeropen(false);
        }
    }

    const rangevaluefun = (low, high) => {
        console.log("222--",showtime)
       
            setRangeLow(low);
            setRangeHigh(high);
      
        
    }

    const uselogin = async (userID) => {
        try {
            const user = await AsyncStorage.getItem('isLogin');
            if (user == '1') {
                setIslogin(user)
                let url = `userProfile?id=${userID}&lang=${applan}`
                ApiDataService.Getapi(url).then(response => {
                   
                    setLoading(false);
                    setinterestid(response.data.data.interested_in);
                    setinterest(returnYrsNo(response.data.data.interested_in))
                    setRangeLow(Number(response.data.data.start_age));
                    setRangeHigh(Number(response.data.data.end_age));
                    setIwantto(response.data.data.i_want_to);
                    setlocation(response.data.data.located_in);
                    setshowtime(true);
                }).catch(e => {
                }).finally(() => {
                    setLoading(false);
                });

            } else {

            }
        } catch (error) { }
    }


    const addMysearchinfo = (item) => {
        if (interest == '') {
            calltoastmessage(t("Please enter your interest"));
        } else if (rangelow == '') {
            calltoastmessage(t("Please enter low age range"));
        } else if (rangehigh == 100) {
            calltoastmessage(t("Please enter high age range"));
        } else if (location == '') {
            calltoastmessage(t("Please enter loaction"));

        } else {
            setLoading(true);
            let formdata = {
                "id": userId,
                "interested_in": interestid,
                "start_age": rangelow,
                "end_age": rangehigh,
                "i_want_to": Iwantto,
                "located_in": location,
                "lang": applan
            }
            let url = 'updateUserPersonalInformation'

            ApiDataService.Postapi(url, formdata).then(response => {
                setLoading(false);
                if (response.status == true) {
                    {
                        (routenum == 2) ? navigation.navigate('Home') :
                        navigation.navigate('Wenttolikes', {
                            routetype: 1
                        })
                    };
                }
            }).catch(e => {
            });
        }
    }

    return (
        <>
            <View style={{ ...StylesGloble.container, ...StylesGloble.ScreenHorigental }}>
                {
                    Loading &&
                    <View style={{ position: "absolute", top: 0, left: 0, height: "100%", width: "115%", zIndex: 999999 }}>
                        <LoadingPage />
                    </View>
                }
                <View style={{ ...StylesGloble.oneline, width: "100%", marginTop: 20 }}>
                    {
                        (pagetype == 2) && <TouchableOpacity onPress={() => navigation.navigate('Home')} style={{ zIndex: 999, marginRight: 12 }}>
                            <Image style={{ width: 21.43, height: 18,marginTop:5 }} source={imagePath.backPage} />
                        </TouchableOpacity>
                    }
                    <Text style={{ fontSize: 18, fontWeight: "700", color: "#000000", ...StylesGloble.startposition }}>{t("My search")}</Text>
                </View>
                <Text style={{ fontSize: 15, fontWeight: "700", color: "#000000", marginTop: 50 }}>{t("I am interested in")}</Text>
                <View style={{}}>
                    <TouchableOpacity style={styles.dropdownstyle} onPress={() => { openpickerfun(getinterest, '1') }} >
                        {
                            (interest == '') ? (
                                <Text style={{ fontSize: 17, width: "75%", paddingLeft: 10 }}>{t("Select")}</Text>
                            ) : (
                                <Text style={{ fontSize: 17, width: "75%", paddingLeft: 10 }}>
                                    {t(interest)}
                                </Text>
                            )
                        }
                        <View style={{ position: "absolute", top: 18, right: 15 }}>
                            <Image style={{ width: 12, height: 12, tintColor: "#338AFF" }} source={imagePath.dropaerrow} />
                        </View>
                    </TouchableOpacity>
                </View>
                <Text style={{ fontSize: 15, fontWeight: "700", color: "#000000", marginTop: 20 }}>{t('Age range')}</Text>
                <View style={{ flexDirection: 'row' }}>
                    <RangeSlider from={rangelow} to={rangehigh} rangevaluefun={rangevaluefun} />
                </View>
                <View style={{ marginTop: 25 }}>
                    <TextField
                        value={location}
                        label={t('Located in')}
                        Placeholder={t('Type here..')}
                        type='text'
                        errorText={''}
                        onChangeText={text => setlocation(text)} />
                </View>
                <View style={{ marginTop: 25 }}>
                    <TextField
                        value={Iwantto}
                        label={t('I want to')}
                        Placeholder={t('I want to')}
                        type='text'
                        errorText={''}
                        onChangeText={text => setIwantto(text)} />
                </View>
                <View style={{ marginTop: 85 }}>
                    <ButtonField label={(routenum == 2) ? t('Update') : t('Save')} submitfun={submitfun} />
                </View>


                {pickeropen && (
                    <Coustompickerwithoutok data={pickerdata} pickeractionfun={pickeractionfun} />
                )}
            </View>
        </>
    );
};

export default Mysearch;
const styles = StyleSheet.create({
    dropdownstyle: {
        flexDirection: "row",
        width: wp('90%'),
        paddingVertical: 18,
        borderRadius: 4,
        paddingLeft: 5,
        backgroundColor: "#EEEEEE",
        marginTop: 25
    }

});