import i18n from "../../app/i18n/i18n";

  
  
   export const SetLanguage = (lang: string) => {
    if (lang) {
      i18n.changeLanguage(lang);

    }
  }