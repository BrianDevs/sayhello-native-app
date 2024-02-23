import React, { useEffect, useState, useContext } from 'react';
import { View, Text, Image, StyleSheet, useWindowDimensions, Dimensions, Button, TouchableOpacity, Touchable,Linking,Share } from 'react-native';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer';
import navigationStrings from '../constants/navigationStrings';
import AuthStack from './AuthStack';
import { useSelector, useDispatch } from 'react-redux';
import LinearGradient from 'react-native-linear-gradient';
import { ScrollView } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ApiDataService from "../services/Apiservice.service";
import SwitchToggle from "react-native-switch-toggle";
import imagePath from './../constants/imagePath';
import { useTranslation } from 'react-i18next';
import './../Language/i18'

const Drawer = createDrawerNavigator();
function CustomDrawerContent(props) {
    const usaerstate = useSelector((state) => state.UserReducer.userData);
    const width = useWindowDimensions().width * 0.3;
    const gotologoutfun = () => {
        AsyncStorage.setItem('isLogin', '0');
        AsyncStorage.setItem('UserData', '');
        AsyncStorage.setItem('userID', '');
        props.navigation.navigate('LogStack');
    }
    const [userId, setuserId] = useState('');
    const [name, setname] = useState('');
    const [image, setimage] = useState('');
    const [togglebtn, settogglebtn] = useState(true);
    const[applan,setapplan] = useState('');
    const [fcmtoken, setfcmtoken] = useState('');
    const [notistatus, setnotistatus] = useState(1);
    const {t,i18n}=useTranslation();

    useEffect(() => {
        AsyncStorage.getItem('Applang', (err, cr) => {
            i18n.changeLanguage(cr)
            setapplan(cr)
        })
        
        AsyncStorage.getItem('fcmtoken', (err, credentials) => {
            setfcmtoken(credentials);
        })
    }, []);

    useEffect(() => {
        AsyncStorage.getItem('userID', (err, cre) => {
            let userID = JSON.parse(cre);
            setuserId(userID);
            userdata(userID)
        })
    }, [])

    const userdata = (userID) => {
        let url = `userProfile?id=${userID}&lang=${applan}`
        ApiDataService.Getapi(url).then(response => {
            setname(response.data.data.name);
            setimage(response.data.data.image);
            setnotistatus(response.data.data.notification);
            if(response.data.data.notification == 0){
                settogglebtn(false)
            }
            else{
                settogglebtn(true)
            }
        }).catch(e => {
        }).finally(() => {
            
        });
    }

    const connectionnotification = () => {
        let notistatus = 0;
        let dvice_token_add = '';
        if(togglebtn==false){
            notistatus = 1;
            dvice_token_add = fcmtoken;
        }
        let formdata = {
            "id":userId,
            "notification": notistatus,
            "device_token":dvice_token_add
        }
        let url = 'changeNotification'
        ApiDataService.Postapi(url, formdata).then(response => {
            if (response.status == true) {
                userdata(userId);
            }
        }).catch(e => {
        });
    }

    const handleShare = async () => {
        try {
          const result = await Share.share({
            message: 'Check out this amazing app! https://codemeg.com/ Awesome App',
            url: 'https://codemeg.com/',
            title: 'Awesome App',
          });
          if (result.action === Share.sharedAction) {
            if (result.activityType) {
            } else {
            }
          } else if (result.action === Share.dismissedAction) {
          }
        } catch (error) {
        }
      };

    return (
        <DrawerContentScrollView {...props} >
            <LinearGradient
                start={{ x: 0, y: 0 }} end={{ x: 0, y: 0 }}
                colors={['#FFFFFF', '#FFFFFF']}
                style={styles.container}>
                <ScrollView contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
                    <View style={{ ...styles.itemlistcont, marginBottom: -50, marginTop: 34 }}>
                        <View style={styles.menuContainer}>
                            <Image style={[styles.profileImg, { borderWidth: 0 }]} source={{ uri: image }} />
                        </View>
                    </View>
                    <View style={{ ...styles.itemlistcont, alignItems: "center", justifyContent: "center", marginBottom: 15 }}>
                        <Text style={{ fontSize: 20, fontWeight: "600", color: "#000000" }}>{name}</Text>
                    </View>
                    <View style={{ ...styles.itemlistcont }}>
                        <TouchableOpacity onPress={() => {
                            props.navigation.navigate('Persionalinfo', {
                                routetype: 2
                            })
                        }} style={styles.itemlisticon}>
                            <Text style={styles.texticon}>{t('Personal info')}</Text>
                            <Image style={{alignSelf:"center"}} source={imagePath.Left_arrow} />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.itemlistcont}>
                        <TouchableOpacity onPress={() => {
                            props.navigation.navigate('Lifestyle', {
                                routetype: 2
                            })
                        }} style={styles.itemlisticon}>
                            <Text style={styles.texticon}>{t('Lifestyle')}</Text>
                            <Image style={{alignSelf:"center"}} source={imagePath.Left_arrow} />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.itemlistcont}>
                        <TouchableOpacity onPress={() => {
                            props.navigation.navigate('Professionaldetails', {
                                routetype: 2
                            })
                        }} style={styles.itemlisticon}>
                            <Text style={styles.texticon}>{t('Professional details')}</Text>
                            <Image style={{alignSelf:"center"}} source={imagePath.Left_arrow} />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.itemlistcont}>
                        <TouchableOpacity onPress={() => {
                            props.navigation.navigate('Mysearch', {
                                routetype: 2
                            })
                        }} style={styles.itemlisticon}>
                            <Text style={styles.texticon}>{t('My search')}</Text>
                            <Image style={{alignSelf:"center"}} source={imagePath.Left_arrow} />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.itemlistcont}>
                        <TouchableOpacity onPress={() => {
                            props.navigation.navigate('Wenttolikes', {
                                routetype: 2
                            })
                        }} style={styles.itemlisticon}>
                            <Text style={styles.texticon}>{t('Want to likes')}</Text>
                            <Image style={{alignSelf:"center"}} source={imagePath.Left_arrow} />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.itemlistcont}>
                        <TouchableOpacity onPress={() => {
                            props.navigation.navigate('Wenttodislikes', {
                                routetype: 2
                            })
                        }} style={styles.itemlisticon}>
                            <Text style={styles.texticon}>{t('Want to dislikes')}</Text>
                            <Image style={{alignSelf:"center"}} source={imagePath.Left_arrow} />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.itemlistcont}>
                        <TouchableOpacity onPress={() => { props.navigation.navigate('Getpointhiostry') }} style={styles.itemlisticon}>
                            <Text style={styles.texticon}>{t('Get points history')}</Text>
                            <Image style={{alignSelf:"center"}} source={imagePath.Left_arrow} />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.itemlistcont}>
                        <TouchableOpacity onPress={() => {
                            props.navigation.navigate('ChooseLanguage', {
                                routetype: 2
                            })
                        }} style={styles.itemlisticon}>
                            <Text style={styles.texticon}>{t('Change Language')}</Text>
                            <Image style={{alignSelf:"center"}} source={imagePath.Left_arrow} />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.itemlistcont}>
                        <TouchableOpacity onPress={() => { props.navigation.navigate('Chatlist') }} style={styles.itemlisticon}>
                            <Text style={styles.texticon}>{t('Chat list')}</Text>
                            <Image style={{alignSelf:"center"}} source={imagePath.Left_arrow} />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.itemlistcont}>
                        <TouchableOpacity onPress={() => { props.navigation.navigate('Couplelist') }} style={styles.itemlisticon}>
                            <Text style={styles.texticon}>{t('Members connection')}</Text>
                            <Image style={{alignSelf:"center"}} source={imagePath.Left_arrow} />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.itemlistcont}>
                        <TouchableOpacity style={styles.itemlisticon} onPress={()=>handleShare()}>
                            <Text style={styles.texticon}>{t('Refer & Earn')}</Text>
                            <Image style={{alignSelf:"center"}} source={imagePath.Left_arrow} />
                        </TouchableOpacity>
                    </View>
                    <View style={{
                        flexDirection: "row", paddingHorizontal: 10,
                        paddingVertical: 15, justifyContent: "space-between"
                    }}>
                        <View style={{alignSelf:"center"}}>
                            <Text style={styles.texticon}>{t('Connection notification')}</Text>
                        </View>
                        <View>
                            <SwitchToggle
                                switchOn={togglebtn}
                                onPress={() =>connectionnotification()}
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
                    <View style={styles.itemlistcont}>
                        <TouchableOpacity style={styles.itemlisticon} onPress={() => Linking.openURL('mailto:example@example.com') }>
                            <Text style={styles.texticon}>{t('Contact Us')}</Text>
                            <Image style={{alignSelf:"center"}} source={imagePath.Left_arrow} />
                        </TouchableOpacity>
                    </View>

                    <View style={{ ...styles.itemlistcont, marginBottom: 20 }}>
                        <TouchableOpacity onPress={() => { gotologoutfun() }} style={{ ...styles.itemlisticon, borderBottomWidth: 0 }}>
                            <Text style={styles.texticon}>{t('Logout')}</Text>
                            <Image style={{alignSelf:"center"}} source={imagePath.Left_arrow} />
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </LinearGradient>
        </DrawerContentScrollView>
    );
}
import { Home, Map, Chatlist, Matchnotification, Getpointhiostry, Connectnotification, Information, Showprofile, Qrcode, Takeselfi, Congrachulation, Openchat, Chat, Persionalinfo, Lifestyle, Professionaldetails, Mysearch, Wenttolikes, Wenttodislikes, Getpointinfo, ChooseLanguage, Memberconnection, Addvideo, OutofRange, ScanQr, Promotinoalbanner ,Login,Couplelist,TempChat} from "../Screens";
import LogStack from './LogStack';

function DrawerStack() {
    return (
        <Drawer.Navigator screenOptions={{ headerShown: false }} drawerContent={(props) => <CustomDrawerContent {...props} />}>
            <Drawer.Screen name={navigationStrings.Promotinoalbanner} component={Promotinoalbanner} />
            <Drawer.Screen name={navigationStrings.Home} component={Home} />
            <Drawer.Screen name={navigationStrings.Login} component={Login} />
            <Drawer.Screen name={navigationStrings.Addvideo} component={Addvideo} />
            <Drawer.Screen name={navigationStrings.TempChat} component={TempChat} />
            <Drawer.Screen name={navigationStrings.Memberconnection} component={Memberconnection} />
            <Drawer.Screen name={navigationStrings.Chat} component={Chat} />
            <Drawer.Screen name={navigationStrings.Chatlist} component={Chatlist} />
            <Drawer.Screen name={navigationStrings.Openchat} component={Openchat} />
            <Drawer.Screen name={navigationStrings.Information} component={Information} />
            <Drawer.Screen name={navigationStrings.Couplelist} component={Couplelist} />
            <Drawer.Screen name={navigationStrings.Congrachulation} component={Congrachulation} />
            <Drawer.Screen name={navigationStrings.Takeselfi} component={Takeselfi} />
            <Drawer.Screen name={navigationStrings.Qrcode} component={Qrcode} />
            <Drawer.Screen name={navigationStrings.Showprofile} component={Showprofile} />
            <Drawer.Screen name={navigationStrings.Getpointhiostry} component={Getpointhiostry} />
            <Drawer.Screen name={navigationStrings.Matchnotification} component={Matchnotification} />
            <Drawer.Screen name={navigationStrings.Map} component={Map} />
            <Drawer.Screen name={navigationStrings.Connectnotification} component={Connectnotification} />
            <Drawer.Screen name={navigationStrings.Persionalinfo} component={Persionalinfo} />
            <Drawer.Screen name={navigationStrings.ScanQr} component={ScanQr} />
            <Drawer.Screen name={navigationStrings.Lifestyle} component={Lifestyle} />
            <Drawer.Screen name={navigationStrings.Professionaldetails} component={Professionaldetails} />
            <Drawer.Screen name={navigationStrings.OutofRange} component={OutofRange} />
            <Drawer.Screen name={navigationStrings.Mysearch} component={Mysearch} />
            <Drawer.Screen name={navigationStrings.Wenttolikes} component={Wenttolikes} />
            <Drawer.Screen name={navigationStrings.Getpointinfo} component={Getpointinfo} />
            <Drawer.Screen name={navigationStrings.Wenttodislikes} component={Wenttodislikes} />
            <Drawer.Screen name={navigationStrings.ChooseLanguage} component={ChooseLanguage} />
            <Drawer.Screen name="Auth" component={AuthStack} />
            <Drawer.Screen name="LogStack" component={LogStack} />

        </Drawer.Navigator>
    );
}

export default DrawerStack;
const styles = StyleSheet.create({
    container: {
        flex: 1,
        height: Dimensions.get('window').height,
        width: '100%',
        marginBottom: 10,paddingBottom:20
    },
    contentContainer: {
        paddingBottom: 0,
        paddingTop: 10
    },
    menuContainer: {
        paddingTop: 20,
        height: "15%",
        backgroundColor: "transparent",
        justifyContent: 'center',
        alignItems: 'center',
    },
    profileImgContainer: {
        width: 120,
        height: 120,
        borderRadius: 120 / 2,
        overflow: "hidden",
    },
    profileImg: {
        width: 98,
        height: 98,
        borderRadius: 118 / 2,
        overflow: "hidden",
        borderWidth: 2,
        borderColor: "#CC0076"
    },
    itemlistcont: {
        width: "100%",

    },
    itemlisticon: {
        flexDirection: "row",
        width: "100%",
        alignItems: "flex-start",
        // justifyContent: "space-",
        paddingHorizontal: 10,
        paddingVertical: 15,
        borderBottomWidth:1,
        borderBottomColor:'#F6F6F6',
        justifyContent:'space-between'

    },
    iconimg: {
        width: 20,
        height: 20,
    },
    texticon: {
        fontSize: 15,
        // fontWeight: "600",
        color: "#000000",
        paddingLeft: 20
    }
})