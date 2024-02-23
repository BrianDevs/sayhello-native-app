//import liraries
import React, { useState, useEffect } from 'react';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { View, Text, ScrollView, Image, TouchableOpacity, FlatList, BackHandler } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ButtonField from './../../helper/ButtonField';
import { StylesGloble } from './../../helper/Globlecss';
import imagePath from './../../constants/imagePath';
import SearchField from './../../helper/SearchField';
import Toast from 'react-native-simple-toast';
import { useTranslation } from 'react-i18next';
import './../../Language/i18';


const langlist = [{
    id: "1",
    name: "English",
    countryId: "en",
    image: imagePath.English,
}, {
    id: "2",
    name: "中国",
    countryId: "ch",
    image: imagePath.China,
}, {
    id: "3",
    name: "española",
    countryId: "es",
    image: imagePath.Spanish,
},
{
    id: "4",
    name: "la France",
    countryId: "fr",
    image: imagePath.France,
},
{
    id: "5",
    name: "Deutschland",
    countryId: "de",
    image: imagePath.Germany,
},
{
    id: "6",
    name: "italiana",
    countryId: "it",
    image: imagePath.Italian,
},
{
    id: "7",
    name: "Português",
    countryId: "pt",
    image: imagePath.Portuguese,
},
{
    id: "8",
    name: "Rossiya",
    countryId: "ru",
    image: imagePath.Russia,
}
]

const ChooseLanguage = ({ navigation, route }) => {
    const {t,i18n}=useTranslation();
    const[applan,setapplan] = useState('')

    useEffect(() => {
        AsyncStorage.getItem('Applang', (err, cr) => {
            i18n.changeLanguage(cr)
            setapplan(cr)
        })
        
    }, []);
    const page_type = route?.params?.routetype
    const [search, setsearch] = useState('');
    const [CounrtyId, setCounrtyId] = useState('');
    const [IsLogin, setIslogin] = useState('');
    const [nlang, setnlang] = useState({})
    const [filteredData, setFilteredData] = useState(langlist);

    const calltoastmessage = (data) => {
        Toast.showWithGravity(data, Toast.SHORT, Toast.BOTTOM,);
    };
    useEffect(() => {
        const backAction = () => {
            { (page_type == 2) && navigation.navigate('Home') }

            return true;
        };
        const backHandler = BackHandler.addEventListener(
            'hardwareBackPress',
            backAction
        );
        return () => backHandler.remove();
    }, [navigation]);
    useEffect(() => {
        uselogin()
    }, [])

    const searchFilterFunction = (text) => {
        if (text) {
            const newData = langlist.filter((item) => {
                const itemData = item.name.toUpperCase();
                const textData = text.toUpperCase();
                return itemData.indexOf(textData) > -1;
            });
            setFilteredData(newData);
            setsearch(text);
        } else {
            setFilteredData(langlist);
            setsearch(text);
        }
    };

    const ItemView = ({ item, index }) => {
        return (
            <TouchableOpacity key={index} onPress={() => { ChooseLanguagefun(item) }} style={{
                ...StylesGloble.oneline, padding: 12, borderBottomWidth: 0.5, borderBottomColor: '#EEEEEE',
            }}>
                <View style={{ flex: 0.5, alignSelf: "center" }}>
                    <Image style={{ width: 40, height: 40 }} source={item.image} />
                </View>
                <View style={{ flex: 2.5, alignSelf: 'center' }}>
                    <Text style={{ fontSize: 15, fontWeight: "600", color: "#000000", marginLeft: 15, marginTop: 0 }}>{item.name}</Text>
                </View>
                <View style={{ flex: 1, justifyContent: "center" }}>
                    {CounrtyId == item.countryId ? <Image source={require('../../assets/images/Vector.png')} style={{ width: 13, height: 9, alignSelf: "center", }} /> : null}
                </View>
            </TouchableOpacity>
        );
    };

    const ItemSeparatorView = () => {
        return (
            <View
                style={{
                    height: 0.5,
                    width: '100%',
                    backgroundColor: '#C8C8C8',
                }}
            />
        );
    };

    const uselogin = async () => {
        try {
            const user = await AsyncStorage.getItem('isLogin');
            const lang = await AsyncStorage.getItem('Countrydata')
            const countryId = await AsyncStorage.getItem('countryId');
            console.log('Retrieved countryId:', countryId);
            if (user == '1') {
                setIslogin(user)
            } else {
            }
        } catch (error) { }
    }

    const submitfun = () => {
        if (CounrtyId != '') {

            AsyncStorage.setItem('Applang', CounrtyId);

            (page_type == 2) ? navigation.navigate('Home') :
                navigation.navigate('Login');
        }
        else {
            calltoastmessage(t("Please select any language"));
        }
    }

    const ChooseLanguagefun = (type) => {
        setCounrtyId(type.countryId);
        AsyncStorage.setItem('Applang', '' + type);
        AsyncStorage.setItem('countryId', type.countryId.toString());
        AsyncStorage.setItem('Countrydata', JSON.stringify(type));
    }

    return (
        <View style={{ ...StylesGloble.container, ...StylesGloble.ScreenHorigental }}>
            <View style={{ ...StylesGloble.oneline, width: "100%", marginTop: 20 }}>
                <Text style={{ fontSize: 18, fontWeight: "700", color: "#000000", ...StylesGloble.startposition }}>{t('Select the language')}</Text>
            </View>
            <View style={{ width: "100%", marginTop: 20 }}>
                <SearchField placeholder={t("Search language")} value={search} Changevalue={searchFilterFunction} />
            </View>
            <View style={{ marginTop: 0 }}>
                <FlatList
                    showsVerticalScrollIndicator={false}
                    data={filteredData}
                    keyExtractor={(item) => item.id}
                    ItemSeparatorComponent={ItemSeparatorView}
                    renderItem={ItemView}
                />
            </View>
            <View style={{ marginTop: 0 }}>
                <ButtonField label={(page_type == 2) ? 'Update' : t('Keep going')} submitfun={submitfun} />
            </View>
        </View>
    );
};
export default ChooseLanguage;