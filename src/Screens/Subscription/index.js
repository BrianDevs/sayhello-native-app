//import liraries
import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, Linking, Modal, Pressable, StyleSheet, TextInput } from 'react-native';
import { StylesGloble } from './../../helper/Globlecss';
import imagePath from './../../constants/imagePath';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import ApiDataService from "./../../services/Apiservice.service";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CardForm, initStripe,StripeProvider, useConfirmPayment, createToken, useStripe } from '@stripe/stripe-react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useTranslation } from 'react-i18next';
import './../../Language/i18';
import LoadingPage from '../../helper/LoadingPage';

const datalist = [{
    title: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod"
}, {
    title: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod"
}, {
    title: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod"
}, {
    title: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod"
}, {
    title: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod"
}, {
    title: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod"
}
]

const Subscription = ({ navigation, route }) => {
    const [modalVisible, setModalVisible] = useState(false);
    const user_id = route.params.id
    const [Loading, setLoading] = useState(false);
    const [applan, setapplan] = useState('')
    const { t, i18n } = useTranslation();
    const { confirmPayment, createPaymentMethod } = useStripe();
    const [pid, setpid] = useState('')
    const [cardinfo, setcardinfo] = useState(null)

    useEffect(() => {
        async function initialize() {
            await initStripe({
                publishableKey: 'pk_test_51Mx1vCSB4pLjzWKkpz54QGtrbTn9AyVfJWExkJtR0ZggnmbUuPu7kvPjJst3ycukIuSTwjMZZCplSom3jV9cOF6e00Css0rDZp'
            });
        }
        initialize().catch(console.error);
    }, []);
    const fetchcarddetail = (cardDetails) => {
        if (cardDetails.complete) {
            console.log('carddetail------', cardDetails);
        }

        if (cardDetails.complete) {
            setcardinfo(cardDetails)
        }
        else {
            setcardinfo(null)

        }
    }

    useEffect(() => {
        AsyncStorage.getItem('Applang', (err, cr) => {
            i18n.changeLanguage(cr)
            setapplan(cr)
        })
    }, []);

    const handleSubmit = async () => {
        // try {
        //     const restoken = await createToken({ ...cardinfo, type: "Card" });
        //     console.log("-----token----------", restoken);

        //     const { paymentMethod, error } = await createPaymentMethod({
        //         paymentMethodType: 'Card',
        //         card: cardinfo,
        //     });

        //     if (error) {
        //         console.log('PaymentMethod creation error:', error);
        //         return;
        //     }

        //     const paymentMethodId = paymentMethod.id;
        //     getpitoken(paymentMethod.id)
        //     console.log('PaymentMethod ID:', paymentMethodId);
        //     setpid(paymentMethodId)
            setModalVisible(false);

              submitfun();
              navigation.navigate('Successfulpayment');
        // } catch (error) {
        //     console.log('PaymentMethod creation error:', error);
        // }
    };
    const getpitoken = async (paymentMethodId) => {
        setLoading(true);
        let formdata = {
            "paymentMethodId": paymentMethodId,
        }
        let url = `processPayment`
        ApiDataService.Postapi(url, formdata).then(response => {
            handleConfirmPayment(response.client_secret)
            setLoading(false);
        }).catch(error => {
        });
    }
    
    const handleConfirmPayment = async (clientSecret) => {
        try {
            
            const {paymentIntent, error} = await confirmPayment(clientSecret, {
                type: 'Card',
                paymentMethodType: 'Card',
                card: cardinfo,
                billingDetails:{
                    email: 'pp85885@gmail.com',
                },
            });
            if (error) {
              console.log('Payment confirmation error', error);
            } else if (paymentIntent) {
              console.log('Success from promise', paymentIntent);
            }
        } catch (error) {
            console.log('Payment Confirmation Error:', error.message);
        }
    };


    const submitfun = async () => {
        setLoading(true);
        let formdata = {
            "id": user_id,
            "page": "1",
            "lang": applan
        }
        let url = `updateUserPersonalInformation`
        ApiDataService.Postapi(url, formdata).then(response => {
            setLoading(false);
        }).catch(error => {
            Toast.show('Failed to open payment URL');
        });
    }

    return (
        <View style={{ ...StylesGloble.container, ...StylesGloble.ScreenHorigental, ...StylesGloble.centerclass }}>
            {
                Loading &&
                <View style={{ position: "absolute", top: 0, left: 0, height: "100%", width: "115%", zIndex: 999999 }}>
                    <LoadingPage />
                </View>
            }
            <TouchableOpacity style={{ ...StylesGloble.grrnbtn, marginTop: hp('8%'), borderRadius: 5, justifyContent: "center", height: hp('5%'), width: wp('45%'), }}>
                <Text style={{ ...StylesGloble.fontsmall, marginLeft: 0, color: '#FFFFFF', fontSize: 18, marginTop: 4, fontWeight: '700' }}>{t('BE A MEMBER')}</Text>
            </TouchableOpacity>
            <View style={{ ...StylesGloble.oneline, ...StylesGloble.widthheight100, marginTop: -50 }}>
                <Text style={{ ...StylesGloble.fontsmall, marginTop: 4 }}>$ </Text>
                <Text style={{ ...StylesGloble.fontlarge }}>24.99</Text>
            </View>
            <View style={{ marginTop: -50 }}>
                {
                    datalist.map((item, index) => {
                        return <View key={index} style={{ ...StylesGloble.oneline, marginBottom: 20,marginRight:15,marginLeft:10 }}>
                            <Image style={{ width: 18.5, height: 18, alignSelf: "center" }} source={imagePath.CheckCircle} />
                            <Text style={{ ...StylesGloble.fontsmall, marginLeft: 15 }}>{item.title}</Text>
                        </View>
                    })
                }
            </View>
            <View style={{ width: "100%", marginTop: 50 }}>
                <Pressable
                    onPress={() => setModalVisible(true)}>
                    <LinearGradient colors={['#338AFF', '#00EDB4']} start={{ x: 0.09, y: 0.5 }} end={{ x: 1.5, y: 2.0 }}
                        style={{ ...styles.cardViewStyle }}>
                        <Text style={{ ...styles.buttontext }}>{t('Buy Now')}</Text>
                    </LinearGradient>
                </Pressable>

            </View>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
            >
                <View style={styles.container}>
                    <Pressable style={styles.pressable_one} onPress={() => { setModalVisible(false) }}>
                        <View></View>
                    </Pressable>
                    <View style={styles.mainView}>
                        
                            <View style={styles.formContainer}>
                                <Text style={styles.label}>{t('Card Detail')}</Text>
                                <CardForm style={{ height: 330, width: '100%', }} cardStyle={styles.cardFieldStyle}
                                    onFormComplete={(cardDetails) =>
                                        fetchcarddetail(cardDetails)
                                    }
                                // onFocus={(cardDetails) => console.log('-------------', cardDetails)}

                                />
                                {/* <TextInput
                                    placeholder="Amount"
                                    value={amount}
                                    onChangeText={setAmount}
                                    keyboardType="numeric"
                                />
                                <TextInput
                                    placeholder="Card Number"
                                    value={cardNumber}
                                    onChangeText={setCardNumber}
                                    keyboardType="numeric"
                                />
                                <TextInput
                                    placeholder="Expiry Month"
                                    value={expiryMonth}
                                    onChangeText={setExpiryMonth}
                                // keyboardType="numeric"
                                />
                                <TextInput
                                    placeholder="Expiry Year"
                                    value={expiryYear}
                                    onChangeText={setExpiryYear}
                                    keyboardType="numeric"
                                />
                                <TextInput
                                    placeholder="CVC"
                                    value={cvc}
                                    onChangeText={setCvc}
                                    keyboardType="numeric"
                                /> */}

                                <View style={{ width: "100%", marginTop: -30 }}>
                                    <Pressable
                                        onPress={() => handleSubmit()}>
                                        <LinearGradient colors={['#338AFF', '#00EDB4']} start={{ x: 0.09, y: 0.5 }} end={{ x: 1.5, y: 2.0 }}
                                            style={{ ...styles.cardViewStyle }}>
                                            <Text style={{ ...styles.buttontext }}>{t('Pay')} $24.99</Text>
                                        </LinearGradient>
                                    </Pressable>
                                </View>
                            </View>
                       
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        height: '100%',
        marginTop: 'auto',
        position: "relative",
        backgroundColor: '#0e0e0e61',
        zIndex: 999999
    },
    mainView: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        borderTopRadius: 50,
        height: 470,
        backgroundColor: "#ffffff",
        borderTopRightRadius: 15,
        borderTopLeftRadius: 15
    },
    buttontext: {
        fontSize: 18,
        color: "#ffffff",
        textAlign: "center",
        fontWeight: "600",
        padding: 14,
        borderRadius: 8
    },
    formContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 20,
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10,
        color: "black"
    },
    cardFieldStyle: {
        backgroundColor: '#bdbdbd',
        textColor: 'black',
        borderRadius: 15,
        placeholderColor: "black",
        borderColor: "black",
        borderWidth: 1,
        cursorColor: 'black',
        textErrorColor: "red"
    },
    cardViewStyle: {
        borderRadius: 8,
        zIndex: 555,
        overflow: "hidden",
        marginBottom: 20
    },
    pressable_one: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        height: "100%"
    }
})
export default Subscription;