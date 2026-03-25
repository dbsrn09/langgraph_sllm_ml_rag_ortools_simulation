import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import en from "./locales/en/translation.json";
import kr from "./locales/kr/translation.json";

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      kr: { translation: kr }
    },
    lng:  "kr",       
    fallbackLng: "en",
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
