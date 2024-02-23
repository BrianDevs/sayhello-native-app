//import liraries
import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import ButtonField from './../../helper/ButtonField';
import { StylesGloble } from './../../helper/Globlecss';
import imagePath from './../../constants/imagePath';
import OTPTextView from 'react-native-otp-textinput';
import ApiDataService from "./../../services/Apiservice.service";
import LoadingPage from './../../helper/LoadingPage';
import Toast from 'react-native-simple-toast';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from 'react-i18next';
import './../../Language/i18'


const Otp = ({ navigation, route }) => {
    let device_token = route.params.token
    let userId = route.params.id;
    let otp = route.params.otp;
    let phonenumber = route.params.phone;
    const [Loading, setLoading] = useState(false);
    const otpInput = useRef(null);
    const [matchotp, setMatchotp] = useState(route.params.otp);
    const [inputotp, setinputotp] = useState({
        value: null,
        message: '',
        isValid: true,
    });
    const [IsLogin, setIslogin] = useState('');
    const [applan, setapplan] = useState('')

    const { t, i18n } = useTranslation();
    useEffect(() => {
        AsyncStorage.getItem('Applang', (err, cr) => {
            i18n.changeLanguage(cr)
            setapplan(cr)
        })
    }, []);

    const validateotp = (_in) => {
        try {
            setinputotp(prev => ({ ...prev, value: _in }));
            if (!_in) {
                setinputotp(prev => ({ ...prev, isValid: true, message: t('Please enter otp') }));
            }
            else if (_in.length === 0) {
                setinputotp(prev => ({ ...prev, isValid: true, message: t('Please enter otp') }));
            }
            else if (_in.length === 6) {
                setinputotp(prev => ({ ...prev, isValid: false, message: '' }));
            }
            else {
                setinputotp(prev => ({ ...prev, isValid: false, message: '' }));
            }
        } catch (error) {
        }
    }

    const submitfun = async () => {

        if (inputotp.isValid == true) {
            calltoastmessage("Please enter valid otp");
        }
        else {
            setLoading(true);


            let formdata = {
                "id": userId,
                "otp": Number(inputotp.value),
                "device_type": '1',
                "device_token": device_token,
                "lang": applan
            }
            ApiDataService.Postapi('matchOtp', formdata).then(response => {
                setLoading(false);
                if (response.status == true) {
                    if (response.data.page == 0) {
                        navigation.navigate('Subscription', { pagetype: 1, id: userId })
                    }
                    else if (response.data.page == 1) {
                        navigation.navigate('Persionalinfo', {
                            routetype: 1
                        })

                    }
                    else if (response.data.page == 2) {
                        navigation.navigate('Uploaddocimg')

                    }
                    else if (response.data.page == 3)
                        navigation.navigate('Uploadfacelicence');
                    else if (response.data.page == 4) {
                        navigation.navigate('Lifestyle', {
                            routetype: 1
                        });

                    }
                    else if (response.data.page == 5) {
                        navigation.navigate('Professionaldetails', {
                            routetype: 1
                        });

                    }
                    else if (response.data.page == 6) {
                        navigation.navigate('Mysearch', {
                            routetype: 1
                        });
                    }
                    else if (response.data.page == 7) {
                        navigation.navigate('Wenttolikes', {
                            routetype: 1
                        });

                    }
                    else if (response.data.page == 8) {
                        navigation.navigate('Wenttodislikes', {
                            routetype: 1
                        });

                    }
                    else if (response.data.page == 9) {
                        navigation.navigate('Addinformation')

                    }
                    else if (response.data.page == 10) {
                        navigation.navigate('DrawerStack')
                        AsyncStorage.setItem('isLogin', '1')
                    }
                }
                else {
                    calltoastmessage(response.message);
                }
            }).catch(e => {
            });
        }
    }
    const resendotpfun = () => {
        setLoading(true);
        let formdata = {
            "phone": phonenumber,
            "lang": applan
        }
        ApiDataService.Postapi('login', formdata).then(response => {
            setLoading(false);
            if (response.status == true) {
                otpInput.current = null;
                setMatchotp(response.data.otp);
            }
            else {
                calltoastmessage(response.data.message);
            }
        }).catch(e => {
        });
    }
    const calltoastmessage = (data) => {
        Toast.showWithGravity(data, Toast.SHORT, Toast.BOTTOM);
    };
    return (
        <View style={{ ...StylesGloble.container, ...StylesGloble.ScreenHorigental, position: "relative" }}>
            {
                Loading &&
                <View style={{ position: "absolute", top: 0, left: 0, height: "100%", width: "115%", zIndex: 999999 }}>
                    <LoadingPage />
                </View>
            }
            <View style={{ ...StylesGloble.widthheight100 }}>
                <Image style={{ width: 138, height: 181 }} source={imagePath.screen_logo} />
            </View>
            <View style={{ marginTop: 15 }}>
                <Text style={{ ...StylesGloble.fontmedium }}>{t('Verification code')}</Text>
                <Text style={{ ...StylesGloble.fontsmallsimple, marginTop: 25 }}> {t('We have to sent the code verification to your mobile number Otp')}<Text style={{ color: 'black', fontWeight: '700' }}>{matchotp}</Text></Text>
            </View>
            <View style={{ marginTop: 20 }}>
                <OTPTextView
                    ref={(e) => (otpInput.current = e)}
                    containerStyle={styles.textInputContainer}
                    textInputStyle={styles.roundedTextInput}
                    handleTextChange={(text) => { otpInput.current = text; validateotp(text) }}
                    inputCount={5}
                    tintColor="#338AFF"
                    offTintColor="#dddddd"
                    keyboardType="numeric"
                />
            </View>
            <View style={{ marginTop: 15 }}>
                <ButtonField label={t('Submit')} submitfun={submitfun} />
            </View>
            <View style={{ ...StylesGloble.oneline, marginTop: 15, alignItems: "center", justifyContent: "center" }}>
                <Text style={{ ...StylesGloble.fontsmallsimple, marginLeft: 0 }}>{t('Didn’t receive OTP?')}</Text>
                <TouchableOpacity onPress={() => { resendotpfun() }}>
                    <Text style={{ ...StylesGloble.fontsmall, color: '#338AFF', fontWeight: '600' }}> {t('Resend')}</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
        padding: 5,
    },
    textInputContainer: {
        marginBottom: 20,

    },
    roundedTextInput: {
        borderRadius: 10,
        borderWidth: 2,
        borderBottomWidth: 2,
        borderColor: "#000000",
        color: "#000000",
    },
    buttonWrapper: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 20,
        width: '60%',
    },
});
export default Otp;