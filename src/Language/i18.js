import i18next from 'i18next';
import English from './English.json';
import Germany from './Germany.json';
import China from './China.json';
import France from './France.json';
import Italian from './Italian.json';
import Portuguese from './Portuguese.json';
import Spanish from './Spanish.json';
import Russia from './Russia.json';
import { initReactI18next } from "react-i18next";
import {I18nManager} from "react-native"

i18next.use(initReactI18next).init({
    compatibilityJSON: 'v3',
    lng: "en",
    resources: {
        en: English,
        de: Germany,
        ch: China,
        es: Spanish,
        fr: France,
        it: Italian,
        pt: Portuguese,
        ru: Russia
    },
    react: {
        useSuspense: false
    }
})
export default i18next;