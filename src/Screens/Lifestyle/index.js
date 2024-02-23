//import liraries
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity,BackHandler } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { StylesGloble } from '../../helper/Globlecss';
import ButtonField from '../../helper/ButtonField';
import imagePath from '../../constants/imagePath';
import { Coustompickerwithoutok } from '../../helper/Coustompickerwithoutok';
import LoadingPage from '../../helper/LoadingPage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ApiDataService from '../../services/Apiservice.service';
import { useTranslation } from 'react-i18next';
import './../../Language/i18'


const Snoyesdata = [
    { id: 1, name: 'Yes' },
    { id: 2, name: 'No' },
]

const Lifestyle = ({ navigation, route }) => {
    const[applan,setapplan] = useState('')
    
    const {t,i18n}=useTranslation();
    useEffect(() => {
        AsyncStorage.getItem('Applang', (err, cr) => {
            i18n.changeLanguage(cr)
            setapplan(cr)
        })
    }, []);
    const pagetype = route.params.routetype;
    const routenum = route?.params?.routetype

    const [Loading, setLoading] = useState(false);
    const [IsLogin, setIslogin] = useState('');

    const [pickerdata, setpickerdata] = useState([]);
    const [pickeropen, setpickeropen] = useState(false);
    const [pickertype, setpickertype] = useState(false);

    const [getzodiacAll, setgetzodiacAll] = useState([]);
    const [zodiac, setzodiac] = useState(false);
    const [zid, setzid] = useState('')

    const [petsdataAll, setpetsdataAll] = useState([]);
    const [pets, setpets] = useState(false);
    const [petid, setpetid] = useState('')


    const [getsmokingall, setgetsmokingall] = useState(Snoyesdata);
    const [smokin, setsmokin] = useState('');
    const [smid, setsmid] = useState('')

    const [getHobbiesAll, setgetHobbiesAll] = useState([]);
    const [hobby, sethobby] = useState('');
    const [Hoid, setHoid] = useState('')

    const [getalchoholeAll, setgetalchoholeAll] = useState(Snoyesdata);
    const [alchohol, setalchohol] = useState('');
    const [Alid, setAlid] = useState('')

    const [userId, setuserId] = useState('');

    const obj = { "Yes": 1, "No": 2 }
    const returnYrsNo = (id) => {
        for (let i in obj) {
            if (obj[i] == id) {
                return i;
            }
        }
        return id
    }
    
    const object ={"Aries":1, "Taurus":2, "Gemini":3, "Cancer":4, "Leo":5, "Virgo":6, "Libra":7, "Scorpio":8, "Sagittarius":9, "Capricorn":10, "Aquarius":11, "Pisces":12,}
    const zodia = (id)=>{
        for (let i in object) {
            if (object[i] == id) {
                return i;
            }
        }
        return id

    }
    const objpet ={"Charlie":1, "Max":2, "Buddy":3, "Milo":4, "Archie":5, "Ollie":6, "Oscar":7, "Teddy":8, "Leo":9, "Alfie":10, "Bella":11, "Luna":12, "Coco":13, "Ruby":14,"Molly":15,"Frankie":16,"Daisy":17,"Rosie":18,"Lucy":19,"Lola":20,}
    const pet = (id)=>{
        for (let i in objpet) {
            if (objpet[i] == id) {
                return i;
            }
        }
        return id

    }
    const objhby ={"Learning":1, "Writing":2, "Dance":3, "Cooking":4, "Photography":5, "Video Game":6, "Gardening":7, "Handicraft":8, "Drawing":9, "Singing":10, "Acting":11, "Computer programming":12, "Chess":13, "Football":14,"Running":15,"Hiking":16,"Video editing":17,"Basketball":18,"Table tennis":19,"Darts":20,"Gymnastics":21,"Web design":22,"Video editing":23,}
    const hobbydata = (id)=>{
        for (let i in objhby) {
            if (objhby[i] == id) {
                return i;
            }
        }
        return id

    }


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
    useEffect(() => {
        getzodiaclist();
        getpetslist();
        getHobbieslist();
    }, [])
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
                    setzid(response.data.data.zodiac);
                    setzodiac(zodia(response.data.data.zodiac))
                    setpetid(response.data.data.pets);
                    setpets(pet(response.data.data.pets))
                    setAlid(response.data.data.alcohol);
                    setalchohol(returnYrsNo(response.data.data.alcohol))
                    setsmid(response.data.data.smoking);
                    setsmokin(returnYrsNo(response.data.data.smoking));
                    setHoid(response.data.data.hobbies);
                    sethobby(hobbydata(response.data.data.hobbies))
                }).catch(e => {
                }).finally(() => {
                    setLoading(false);
                });

            } else {

            }
        } catch (error) { }
    }



    const submitfun = () => {
        addlifestyleinfo()
    }

    const openpickerfun = async (data, type) => {
        setpickertype(type)
        setpickerdata(data);
        setpickeropen(true);
    }

    const pickeractionfun = async (type, value) => {
        if (type == 'v') {
            if (pickertype == '1') {
                setzodiac(value.name);
                setzid(value.id)
            }
            if (pickertype == '2') {
                setpets(value.name);
                setpetid(value.id)
            }
            if (pickertype == '3') {
                setsmokin(value.name);
                setsmid(value.id)
            }
            if (pickertype == '4') {
                setalchohol(value.name);
                setAlid(value.id)
            }
            if (pickertype == '5') {
                sethobby(value.name);
                setHoid(value.id)
            }
            setpickeropen(false);
        }
        else {
            setpickeropen(false);
        }
    }


    const getzodiaclist = () => {
        let url = `getZodiac?lang=${applan}`
        ApiDataService.Getapi(url).then(response => {
            setLoading(false);
            if (response.data.status == true) {
                setgetzodiacAll(response.data.data);
            }
        }).catch(e => {
        })
            .finally(() => {
                setLoading(false);
            });
    }

    const getpetslist = () => {
        let url = `getPets?lang=${applan}`
        ApiDataService.Getapi(url).then(response => {
            setLoading(false);
            if (response.data.status == true) {
                setpetsdataAll(response.data.data);
            }
        }).catch(e => {
        })
            .finally(() => {
                setLoading(false);
            });
    }

    const getHobbieslist = () => {
        let url = `getHobbies?lang=${applan}`
        ApiDataService.Getapi(url).then(response => {
            setLoading(false);
            if (response.data.status == true) {
                setgetHobbiesAll(response.data.data);
            }
        }).catch(e => {
        })
            .finally(() => {
                setLoading(false);
            });
    }

    const addlifestyleinfo = () => {
        setLoading(true);
        let formdata = {
            "id": userId,
            "zodiac": zid,
            "pets": petid,
            "smoking": smid,
            "alcohol": Alid,
            "hobbies": Hoid,
            "page": "5",
            "lang":applan
        }
        let url = 'updateUserPersonalInformation'
        ApiDataService.Postapi(url, formdata).then(response => {
            setLoading(false);
            if (response.status == true) {
                {
                    (routenum == 2) ? navigation.navigate('Home') :
                        navigation.navigate('Professionaldetails', {
                            routetype: 1
                        })
                }
            }
        }).catch(e => {
        });
    }


    return (
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
                        <Image style={{width: 21.43, height: 18,marginTop:5}} source={imagePath.backPage} />
                    </TouchableOpacity>
                }
                <Text style={{ fontSize: 18, fontWeight: "700", color: "#000000", ...StylesGloble.startposition, }}>{t('Lifestyle')}</Text>
            </View>
            <View style={{ ...StylesGloble.Inputouter, marginTop: 25 }}>
                <TouchableOpacity style={styles.dropdownstyle} onPress={() => { openpickerfun(getzodiacAll, '1') }} >
                    <Image style={{ width: 24, height: 24, marginLeft: 13,alignSelf:"center" }} source={imagePath.Zodiac} />
                    {
                        (zodiac == '') ? (
                            <Text style={{ fontSize: 17, width: "75%", marginLeft: 15,alignSelf:"center" }}>{t('Zodiac')}</Text>
                        ) : (
                            <Text style={{fontSize: 17, width: "75%", marginLeft: 15 ,alignSelf:"center" }}>
                                {t(zodiac)}
                            </Text>
                        )
                    }
                    <View style={{ position: "absolute", top: 19, right: 15 }}>
                        <Image style={{ width: 12, height: 12,tintColor:"#338AFF" }} source={imagePath.dropaerrow} />
                    </View>
                </TouchableOpacity>
            </View>

            <View style={{}}>
                <TouchableOpacity style={styles.dropdownstyle} onPress={() => { openpickerfun(petsdataAll, '2') }} >
                    <Image style={{ width: 24, height: 24, marginLeft: 13,alignSelf:"center" }} source={imagePath.pets} />
                    {
                        (pets == '') ? (
                            <Text style={{ fontSize: 17, width: "75%", marginLeft: 15,alignSelf:"center" }}>{t('Pets')}</Text>
                        ) : (
                            <Text style={{fontSize: 17, width: "75%", marginLeft: 15,alignSelf:"center"  }}>
                                {t(pets)}
                            </Text>
                        )
                    }
                    <View style={{ position: "absolute", top: 19, right: 15 }}>
                        <Image style={{ width: 12, height: 12,tintColor:"#338AFF" }} source={imagePath.dropaerrow} />
                    </View>
                </TouchableOpacity>
            </View>
            <View style={{}}>
                <TouchableOpacity style={styles.dropdownstyle} onPress={() => { openpickerfun(getsmokingall, '3') }} >
                    <Image style={{ width: 24, height: 24, marginLeft: 13,alignSelf:"center" }} source={imagePath.smoking} />
                    {
                        (smokin == '') ? (
                            <Text style={{ fontSize: 17, width: "75%", marginLeft: 15,alignSelf:"center" }}>{t('Smoking')}</Text>
                        ) : (
                            <Text style={{fontSize: 17, width: "75%", marginLeft: 15,alignSelf:"center"  }}>
                                {t(smokin)}
                            </Text>
                        )
                    }
                    <View style={{ position: "absolute", top: 19, right: 15 }}>
                        <Image style={{ width: 12, height: 12,tintColor:"#338AFF" }} source={imagePath.dropaerrow} />
                    </View>
                </TouchableOpacity>
            </View>

            <View style={{}}>
                <TouchableOpacity style={styles.dropdownstyle} onPress={() => { openpickerfun(getalchoholeAll, '4') }} >
                    <Image style={{ width: 24, height: 24, marginLeft: 13,alignSelf:"center" }} source={imagePath.alcohol} />
                    {
                        (alchohol == '') ? (
                            <Text style={{ fontSize: 17, width: "75%", marginLeft: 15,alignSelf:"center" }}>{t('Alcohol')}</Text>
                        ) : (
                            <Text style={{fontSize: 17, width: "75%", marginLeft: 15,alignSelf:"center" }}>
                                {t(alchohol)}
                            </Text>
                        )
                    }
                    <View style={{ position: "absolute", top: 19, right: 15 }}>
                        <Image style={{ width: 12, height: 12,tintColor:"#338AFF" }} source={imagePath.dropaerrow} />
                    </View>
                </TouchableOpacity>
            </View>

            <View style={{}}>
                <TouchableOpacity style={styles.dropdownstyle} onPress={() => { openpickerfun(getHobbiesAll, '5') }} >
                    <Image style={{ width: 24, height: 24, marginLeft: 13 ,alignSelf:"center"}} source={imagePath.hobbies} />
                    {
                        (hobby == '') ? (
                            <Text style={{ fontSize: 17, width: "75%", marginLeft: 15,alignSelf:"center"}}>{t('Hobbies')}</Text>
                        ) : (
                            <Text style={{fontSize: 17, width: "75%", marginLeft: 15 ,alignSelf:"center"}}>
                               {t(hobby)}
                            </Text>
                        )
                    }
                    <View style={{ position: "absolute", top: 19, right: 15 }}>
                        <Image style={{ width: 12, height: 12 ,tintColor:"#338AFF"}} source={imagePath.dropaerrow} />
                    </View>
                </TouchableOpacity>
            </View>
            {(routenum == 2) ?
                <View style={{ marginTop: 55 }}>
                    <ButtonField label={t('Update')} submitfun={submitfun} />
                </View> : <View style={{ marginTop: 55 }}>
                    <ButtonField label={t('Save')} submitfun={submitfun} />
                </View>}

            {pickeropen && (
                <Coustompickerwithoutok data={pickerdata} pickeractionfun={pickeractionfun} />
            )}

        </View>
    );
};
export default Lifestyle;
const styles = StyleSheet.create({
    dropdownstyle: {
        flexDirection: "row",
        width: wp('90%'),
        paddingVertical: 15,
        borderRadius: 10,
        paddingLeft: 5,
        backgroundColor: "#F6F6F6",
        marginTop: 15
    }

});