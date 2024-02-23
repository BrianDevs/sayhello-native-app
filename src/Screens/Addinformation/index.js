//import liraries
import React, { useState, useEffect } from 'react';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { View, Text, Modal, Image, TouchableOpacity, FlatList } from 'react-native';
import { StylesGloble } from '../../helper/Globlecss';
import ButtonField from '../../helper/ButtonField';
import imagePath from '../../constants/imagePath';
import TextareaFeiled from './../../helper/TextareaFeiled';
import ApiDataService from "./../../services/Apiservice.service";
import LoadingPage from '../../helper/LoadingPage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from 'react-i18next';
import './../../Language/i18';
import Toast from 'react-native-simple-toast';



const Addinformation = ({ navigation, route }) => {
    const[applan,setapplan] = useState('')
   
    const {t,i18n}=useTranslation();
    useEffect(() => {
        AsyncStorage.getItem('Applang', (err, cr) => {
            i18n.changeLanguage(cr)
            setapplan(cr)
        })
    }, []);
    
    const [pageval, setpageval] = useState(1);
    const [chooseitem, setchooseitem] = useState('');
    const [addpopup, setaddpopup] = useState(false);
    const [inputtext, setInputtext] = useState({
        value: null,
        message: '',
        isValid: false,
    });
    const [getquestion, setgetquestion] = useState([]);
    const [Loading, setLoading] = useState(false);
    const [ userId,setuserId ] = useState('');
    const [qdel,setqdel]= useState ('')
    useEffect(()=>{
        AsyncStorage.getItem('userID', (err, cre) => {
            let  userID =  JSON.parse(cre);
            setuserId(userID);
            setLoading(true);
            getquestionlist(1,userID);
        })
    },[])

const getpage=()=>{
    setLoading(true); 
    let formdata = {
        "id": userId,
        "page":"10",
        "lang":applan
    }
    let url = 'updateUserPersonalInformation'

    ApiDataService.Postapi(url, formdata).then(response => {
        setLoading(false);
            navigation.navigate('Login')
    }).catch(e => {
    });
}

    const getquestionlist = (nu,Id) => {
        let url = `getQuestions?limit=${nu}&user_id=${Id}&lang=${applan}`
        ApiDataService.Getapi(url).then(response => {
            setLoading(false);
            if (response.data.status == true) {
                setgetquestion(response.data.data);
            }
        }).catch(e => {
        }).finally(() => {
            setLoading(false);
        });
    }

    const validatetext = (_in) => {
        try {
            setInputtext(prev => ({ ...prev, value: _in }));
            if (!_in) {
                setInputtext(prev => ({ ...prev, isValid: true, message: t("Please enter text") }));
            }
            else if (_in.length === 0) {
                setInputtext(prev => ({ ...prev, isValid: true, message: t("Please enter text")}));
            }
            else {
                setInputtext(prev => ({ ...prev, isValid: false, message: '' }));
            }
        } catch (error) {
        }
    }

    const Addansinlistfun = () => {
        setLoading(true);
        let formdata = {
            "user_id":userId,
            "question_id":chooseitem.id,
            "answer":inputtext.value,
        "lang":applan

        }
        let url = `attemptQuestionByUser`
        ApiDataService.Postapi(url,formdata).then(response => {
            setaddpopup(false); 
            if(response.status==true)
            {
                getquestionlist(pageval,userId);
            }
            else{
                setLoading(false);
            }
        }).catch(e => {
            setLoading(false);
        });
    }

    const addanswerfun = (item) => {
        validatetext('');
        setchooseitem(item);
        setaddpopup(true);
    }
    const removeanswerfun = (id) => {
        setLoading(true);
        let url = `remove_answers?answer_id=${id}&Lang=${applan}`
        ApiDataService.Getapi(url).then(response => {
            setLoading(false);
            if (response.data.status == true) {
                getquestionlist(pageval,userId);
            }
            else{
                setLoading(false);
            }
        }).catch(e => {
            setLoading(false);
        }).finally(() => {
            setLoading(false);
        });
    }
    const calltoastmessage = (data) => {
        Toast.showWithGravity(data, Toast.SHORT, Toast.BOTTOM,);
    };

    const submitfun = () => {
        setpageval(pageval + 1);
        getquestionlist(pageval + 1);
        if (pageval == 2) {
            getpage()
            calltoastmessage('Your Information is Submitted');
            navigation.navigate('Login');
        }
    }

    return (
        <>
            <View style={{ ...StylesGloble.container, ...StylesGloble.ScreenHorigental }}>
                {
                    Loading &&
                    <View style={{ position: "absolute", top: 0, left: 0, height: "100%", width: "105%", zIndex: 999999 }}>
                        <LoadingPage />
                    </View>
                }
               
                <View style={{ ...StylesGloble.oneline, width: "100%", marginTop: 20 }}>
                    <Text style={{ fontSize: 18, fontWeight: "700", color: "#000000", ...StylesGloble.startposition }}>{t("Add some more Information")}</Text>
                </View>
                <Text style={{ fontSize: 15, color: "#000000", marginTop: 10 }}>{t("It will help you both to start the conversation.")}</Text>
                <View style={{ height: hp('77%'), paddingBottom: 5, paddingTop: 5 }}>
                    {
                        <FlatList
                            numColumns={1}
                            showsVerticalScrollIndicator={false}
                            data={getquestion}
                            renderItem={({ item }) => <Item item={item} addanswerfun={addanswerfun} removeanswerfun={removeanswerfun} />}
                            keyExtractor={(item, index) => index}
                        />
                    }
                </View>
                <View style={{ width: "100%", marginTop: 0, position: "absolute", bottom: 10, left: "5%" }}>
                    <ButtonField label={t('Next')} submitfun={submitfun} />
                </View>

            </View>
            <Modal animationType="slide" transparent={true} visible={addpopup}>
                <View style={{ height: '100%', marginTop: 'auto', position: "relative", backgroundColor: '#0e0e0e61' }}>
                    <View style={{width: wp('90%'), left: wp('5%'), height: hp('45%'), backgroundColor: '#ffffff', borderRadius: 6, padding: 20 ,marginTop:'50%'}}>
                        <TouchableOpacity onPress={() => { setaddpopup(false); }} style={{ position: 'absolute', top: hp('2%'), right: wp('3%'), zIndex: 999 }}>
                            <Image style={{ width: 15, height: 15 }} source={imagePath.Close} />
                        </TouchableOpacity>
                        <View style={{ ...StylesGloble.oneline, width: "100%", marginTop: 0 }}>
                            <Text style={{ fontSize: 16, fontWeight: "700", color: "#000000", ...StylesGloble.startposition }}>{chooseitem.id}. {chooseitem.question}</Text>
                        </View>
                        <View style={{ marginTop: 0, }}>
                            <TextareaFeiled
                                value={inputtext.value}
                                Placeholder={t('Text here...')}
                                type='text'
                                errorText={inputtext.message}
                                onChangeText={text => validatetext(text)}/>
                        </View>
                        <View style={{ width: "100%", marginTop: 40 }}>
                            <ButtonField label={t('Add')} submitfun={Addansinlistfun}/>
                        </View>
                    </View>
                </View>
            </Modal>
        </>
    );
};
const Item = ({ item, addanswerfun, removeanswerfun, }) => (
    <View>
        <Text style={{ fontSize: 16, fontWeight: "700", color: "#000000", ...StylesGloble.startposition }}>{item.id}. {item.question}</Text>
        {
            (item.answer != null) ? (
                <View style={{  marginTop:hp('1%'), 
                flexDirection:"row",
                 marginBottom:hp('1%'),width:"auto" }} >
                    <Text style={{ fontSize: 16, fontWeight: "700", color: "#ffffff" ,backgroundColor: '#338AFF', alignSelf: 'flex-start',width:'auto',padding: hp(1.5),borderRadius:4,
                     }} >{item.answer}</Text>
                    <TouchableOpacity onPress={() => { removeanswerfun(item.answer_id) }} style={{
                          top: -10,alignSelf: 'flex-start',left:-10}}>
                        <Image style={{ width: 22, height: 22 }} source={imagePath.addifocross} />
                    </TouchableOpacity>
                </View>
            ) : (
                <TouchableOpacity onPress={() => { addanswerfun(item) }} style={StylesGloble.actaddinfobtni} >
                    <Text style={{ fontSize: 16, fontWeight: "700", color: "#ffffff" }} >{'Add'}</Text>
                </TouchableOpacity>
            )
        }
    </View>
);
export default Addinformation;