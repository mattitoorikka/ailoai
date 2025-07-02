import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import en from "../locales/en.json";
import fi from "../locales/fi.json";

i18n
  .use(initReactI18next) // Tämä liittää i18n:n Reactin kanssa
  .init({
    resources: {
      en: { translation: en },
      fi: { translation: fi },
    },
    lng: "en", // Oletuskieli
    fallbackLng: "en", // Palautuskieli, jos käännöksiä ei löydy
    interpolation: {
      escapeValue: false, // React tekee XSS-suojauksen
    },
  });

export default i18n;
