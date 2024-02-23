//import liraries
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView, TextInput, Button,BackHandler } from 'react-native';
import { StylesGloble } from '../../helper/Globlecss';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import ButtonField from '../../helper/ButtonField';
import TextField from './../../helper/TextField';
import SwitchToggle from "react-native-switch-toggle";
import ApiDataService from "./../../services/Apiservice.service";
import Toast from 'react-native-simple-toast';
import LoadingPage from '../../helper/LoadingPage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import imagePath from '../../constants/imagePath';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment, { duration } from 'moment';
import { useTranslation } from 'react-i18next';
import './../../Language/i18'

const Persionalinfo = ({ navigation, route }) => {
    const routenum = route?.params?.routetype
    const [togglebtn, settogglebtn] = useState(true);
    const [aboutus, setaboutus] = useState('');
    const [nickname, setnickname] = useState('');
    const [Interests, setInterests] = useState('');
    const [Loading, setLoading] = useState(false);
    const [userId, setuserId] = useState('');
    const [IsLogin, setIslogin] = useState('');
    const [interest, setinterest] = useState('');
    const [lname, setlname] = useState('');
    const [email, setemail] = useState('');
    const [dob, setdob] = useState('')
    const inputRef = useRef(null)
    const [date, setDate] = useState(new Date());
    const [datee, setDatee] = useState('');
    const [showPicker, setShowPicker] = useState(false);
    const[applan,setapplan] = useState('')
    
    const {t,i18n}=useTranslation();
    useEffect(() => {
        AsyncStorage.getItem('Applang', (err, cr) => {
            i18n.changeLanguage(cr)
            setapplan(cr)
        })
      
    }, []);

    useEffect(() => {
        const backAction = () => {
            {(routenum ==2) && navigation.navigate('Home')}

          return true;
        };
        const backHandler = BackHandler.addEventListener(
          'hardwareBackPress',
          backAction
        );
        return () => backHandler.remove();
      }, [navigation]);
    const handleDateChange = (event, selectedDate) => {
        setDate(selectedDate);
        setShowPicker(false);
        var data = moment(selectedDate).format("DD-MM-YYYY");
        setDatee(data);
    };
  

    useEffect(() => {
        AsyncStorage.getItem('userID', (err, cre) => {
            let userID = JSON.parse(cre);
            setuserId(userID);
            uselogin(userID)
        })
    }, [])
    const uselogin = async (userID) => {
        try {
            const user = await AsyncStorage.getItem('isLogin');
            if (user == '1') {
                setIslogin(user)
                let url = `userProfile?id=${userID}&lang=${applan}`
                ApiDataService.Getapi(url).then(response => {
                    setLoading(false);
                    setaboutus(response.data.data.about_me)
                    setnickname(response.data.data.name)
                    setInterests(response.data.data.interests)
                    setlname(response.data.data.lastName)
                    setemail(response.data.data.email)
                    setDatee(response.data.data.dob)
                }).catch(e => {
                }).finally(() => {
                    setLoading(false);
                });

            } else {

            }
        } catch (error) { }
    }

    const calltoastmessage = (data) => {
        Toast.showWithGravity(data, Toast.SHORT, Toast.BOTTOM);
    };

    const submitfun = () => {
        addPersonalinfo()
    }
    const submitfun2 = () => {
        if (nickname == '') {
            calltoastmessage(t('Please enter first name'));
        } else if (lname == '') {
            calltoastmessage(t('Please enter Last name'));
        } else if (email == '') {
            calltoastmessage(t('Please enter email'));

        } else if (datee == '') {
            calltoastmessage(t('Please enter date of birth'));

        } else if (aboutus == '') {
            calltoastmessage(t('Please enter about us field'));

        } else if (Interests == '') {
            calltoastmessage(t('Please enter  your interest'));

        } else {
            setLoading(true);
            let togglevalue = 0;
            if (togglebtn == true) {
                togglevalue = 1;
            }
            let formdata = {
                "id": userId,
                "about_me": aboutus,
                "interests": Interests,
                "name": nickname,
                "photo_option": togglevalue,
                "page": "2",
                "lastName": lname,
                "email": email,
                "dob": datee,
                "lang":applan
            }
            let url = 'updateUserPersonalInformation'

            ApiDataService.Postapi(url, formdata).then(response => {
                setLoading(false);
                if (response.status == true) {
                    navigation.navigate('Home')
                }
            }).catch(e => {
            });
        }
    }

    const addPersonalinfo = () => {
        if (nickname == '') {
            calltoastmessage(t('Please enter first name'));
        } else if (lname == '') {
            calltoastmessage(t('Please enter Last name'));
        } else if (email == '') {
            calltoastmessage(t('Please enter email'));

        } else if (datee == '') {
            calltoastmessage(t('Please enter date of birth'));

        } else if (aboutus == '') {
            calltoastmessage(t('Please enter about us field'));

        } else if (Interests == '') {
            calltoastmessage(t('Please enter  your interest'));

        } else {

            setLoading(true);
            let togglevalue = 1;
            if (togglebtn == false) {
                togglevalue = 0;
            }
            let formdata = {
                "id": userId,
                "about_me": aboutus,
                "interests": Interests,
                "name": nickname,
                "smart_photos": togglevalue,
                "page": "2",
                "lastName": lname,
                "email": email,
                "dob": datee,
                "lang":applan
            }
            let url = 'updateUserPersonalInformation'

            ApiDataService.Postapi(url, formdata).then(response => {
                setLoading(false);
                if (response.status == true) {
                    navigation.navigate('Uploaddocimg');
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
                <View style={{ ...StylesGloble.oneline, width: "100%", marginTop: 20, marginBottom: 20 }}>
                    <TouchableOpacity onPress={() => { (routenum == 2) ? navigation.navigate('Home') : navigation.navigate('Login') }} style={{ ...StylesGloble.homeheaderlocation, left: 3, zIndex: 999, top: 0, marginTop: 6 }}>
                        <Image style={{ width: 21.43, height: 18, }} source={imagePath.backPage} />
                    </TouchableOpacity>
                    <Text style={{ fontSize: 18, fontWeight: "700", color: "#000000", ...StylesGloble.startposition, marginLeft: 40, marginTop: 0 }}>{t('Personal info')}</Text>
                </View>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <Text style={{ fontSize: 15, fontWeight: "700", color: "#000000", marginTop: 5 }}>{t('Smart photos')}</Text>
                    <View style={{ ...StylesGloble.toggleswitch, marginTop: 5, marginRight: 0, paddingVertical: 10 }}>
                        <Text style={{ fontSize: 15, width: "70%", marginLeft: 5, alignSelf: "center" }}>{t('Smart photos')}</Text>
                        <View style={{ marginLeft: 25 }}>
                            <SwitchToggle
                                switchOn={togglebtn}
                                onPress={() => settogglebtn(!togglebtn)}
                                containerStyle={{
                                    width: 47,
                                    height: 25,
                                    borderRadius: 25,
                                    padding: 5,
                                }}
                                circleStyle={{
                                    width: 18,
                                    height: 18,
                                    borderRadius: 20,
                                }}
                                circleColorOff='#ffffff'
                                circleColorOn='#ffffff'
                                backgroundColorOn='#17A400'
                                backgroundColorOff='#6a6a6a'
                            />
                        </View>

                    </View>
                    <View style={{ marginTop: 15 }}>
                        <TextField
                            value={nickname}
                            label={t('First Name')}
                            Placeholder={t('Enter your first name')}
                            type='text'
                            errorText={''}
                            onChangeText={text => setnickname(text)} />
                    </View>
                    <View style={{ marginTop: 15 }}>
                        <TextField
                            value={lname}
                            label={t('Last Name')}
                            Placeholder={t('Enter your last name')}
                            type='text'
                            errorText={''}
                            onChangeText={text => setlname(text)}
                        />
                    </View>
                    <View style={{ marginTop: 15 }}>
                        <TextField
                            value={email}
                            label={t('Email')}
                            Placeholder={t('Enter your email id')}
                            type='text'
                            errorText={''}
                            onChangeText={text => setemail(text)}
                        />
                    </View>
                    <View style={{ marginTop: 15, }}>
                        <Text style={{
                            fontSize: 14,
                            fontWeight: "700",
                            color: "#000000",
                            marginBottom: 5
                        }}>{t('Date of Birth')}</Text>
                        <TouchableOpacity style={{

                            backgroundColor: "#EEEEEE",
                            borderRadius: 4,
                            fontFamily: 'Poppins-Regular',
                            fontSize: 16,
                            color: "#000000",
                            marginTop: 10,

                        }} onPress={() => setShowPicker(true)} >

                            {datee ? <Text style={{
                                padding: 15,
                                fontSize: 16,
                                color:"black"
                            }}>{datee.toLocaleString()}</Text> :<Text style={{
                                padding: 15,
                                fontSize: 16,
                            }}>{t('Enter your date of birth')}</Text>}
                            
                        </TouchableOpacity>
                        {showPicker && <View>
                            <DateTimePicker
                                date={date}
                                value={date}
                                mode="date"
                                onChange={handleDateChange}
                                maximumDate={new Date()}
                                format={"YYYY-MM-DD"}
                                displayFormat={"DD-MM-YYYY"}
                            />
                        </View>}
                    </View>
                    <View style={{ marginTop: 15 }}>
                        <View >
                            <Text style={{
                                fontSize: 14,
                                fontWeight: "700",
                                color: "#000000",
                                marginBottom: 5
                            }}>{t('About me')}</Text>
                            <TextInput
                                style={{
                                    padding: 10,
                                    backgroundColor: "#EEEEEE",
                                    borderRadius: 4,
                                    fontFamily: 'Poppins-Regular',
                                    fontSize: 16,
                                    color: "#000000",
                                    marginTop: 10,
                                }}
                                ref={inputRef}
                                placeholder={t('Text here...')}
                                placeholderTextColor="#817878"
                                type='text'
                                value={aboutus}
                                numberOfLines={3}
                                onChangeText={text => setaboutus(text)}
                            />
                        </View>
                    </View>
                    <View style={{ marginTop: 15 }}>
                        <TextField
                            value={Interests}
                            label={t('Interests')}
                            Placeholder={t('Add interests')}
                            type='text'
                            errorText={''}
                            onChangeText={text => setInterests(text)} />
                    </View>

                    {(routenum == 2) ? <View style={{ marginTop: 40 }}>
                        <ButtonField label={t('Update')} submitfun={submitfun2} />
                    </View> :
                        <View style={{ marginTop: 40, marginBottom: 10, paddingBottom: 5 }}>
                            <ButtonField label={t('Save')} submitfun={submitfun} />
                        </View>}
                </ScrollView>
            </View>
        </>
    );
};
export default Persionalinfo;