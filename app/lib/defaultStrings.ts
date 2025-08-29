// lib/defaultStrings.ts

export const defaultStrings = {
  logoUrl: "/logo-solmio-vaaka-oranssi.png",
  heroTitle: "Solmio Ailo™",
  heroIntro:
    "Tervetuloa Ailoon – tekoälytyökaveri, joka tuo tehokkuutta ravintolasi arkeen. Ailo auttaa kampanjoissa, ruokalistan suunnittelussa ja yleisissä asioissa – nopeasti, helposti ja datalla pohjaten.",
  downloads: {
    basicInfoLabel: "Perustietolomake",
    basicInfoHref: "/downloads/ravintolan_perustieto.docx",
    calendarLabel: "Somekalenterin runko",
    calendarHref: "/downloads/somekalenteripohja.docx",
  },
  tagline:
    "Kehitämme Ailoa jatkuvasti – anna palautetta ja kokeile rohkeasti.",
  topics: [
    {
      title: "📣 Markkinointi ja viestintä asiakkaille",
      subtitle:
        "Tee ravintolastasi näkyvä! Ailo ideoi kampanjat, somepostaukset ja henkilöstötiedotteet – nopeasti ja brändisi näköisesti.",
      path: "/pages/markkinointi",
    },
    {
      title: "🥗 Valikoimasuunnittelu",
      subtitle:
        "Luo myyvä ruokalista teidän laitteilla ja resursseilla. Ailo huomioi katteen, kuorman ja sesongit.",
      path: "/pages/valikoima",
    },
    {
      title: "📝 HR",
      subtitle:
        "Avustan työvuorosuunnittelussa, tunnen TES:in ja lainsäädännön ja autan haastavissa henkilöstötilanteissa.",
      path: "/pages/hr",
    },
    {
      title: "📝 Tarjouspyynnöt",
      subtitle:
        "Laadi tarjouksia yrityksille, yksityistilaisuuksiin ja tapahtumiin – selkeästi ja myyvästi.",
      path: "/pages/tarjoukset",
    },
    {
      title: "🛠️ Tukipalvelut, ongelmanratkaisu ja sisäinen viestintä",
      subtitle:
        "Kassa jumissa, kylmiö lämmin tai tarvitset ohjeet tuuraajalle? Ailo auttaa arjen tilanteissa.",
      path: "/pages/yleinen",
    },
  ],

  // HR
  hr: {
    headerTitle: "Solmio Ailo™ – HR-avustaja",
    headerSubtitle:
      "Autan henkilöstöasioissa – työsopimuksista lomapyyntöihin ja työlainsäädäntöön. 👥",
    features: [
      { icon: "📄", title: "Työsopimukset ja TES", text: "Selitän sopimukset ja tsekkaan ehdot TES:n pohjalta." },
      { icon: "📅", title: "Lomat ja poissaolot", text: "Tulkinta, suunnittelu ja käytännöt." },
      { icon: "⚖️", title: "Lainsäädäntö", text: "Lakien ja säädösten hyödyntäminen arjessa." },
      { icon: "✍️", title: "Viestipohjat", text: "Mallit ilmoituksiin, perehdytyksiin ja muistutuksiin." },
      { icon: "💡", title: "Ailo räätälöitynä", text: "myynti@solmiokassa.fi" },
    ],
  },

  // Markkinointi
  marketing: {
    headerTitle: "Solmio Ailo™ – Markkinointi & viestintä",
    headerSubtitle:
      "Ideoin kampanjoita, somesisältöä ja myynninedistämistä. Teen myös sisäisiä tiedotteita ja näyttötekstejä. 📣",
    features: [
      { icon: "🎯", title: "Kampanjat ja tempaukset", text: "Hiljainen päivä, aurinkoinen viikko tai tulossa tapahtuma? Ehdotan tilanteeseen sopivia kampanjoita." },
      { icon: "📱", title: "Somepostaukset ja näkyvyys", text: "Tarvitsetko idean julkaisuun tai valmiin kuvatekstin? Autan luomaan sisältöä Instagramiin ja Facebookiin." },
      { icon: "📋", title: "Tiedotteet ja sisäinen viestintä", text: "Selkeät ja tehokkaat viestit henkilökunnalle hoituvat hetkessä." },
      { icon: "💡", title: "Markkinointi ja myynninedistäminen", text: "Vinkkejä myynnin edistämiseen sesongit ja paikalliset tapahtumat huomioiden." },
      { icon: "💡", title: "Ailo räätälöitynä", text: "Haluatko Ailon yrityksellesi? myynti@solmiokassa.fi" },
    ],
  },

  // Yleinen (tukipalvelut)
  general: {
    headerTitle: "Solmio Ailo™ – Tukipalvelut & sisäinen viestintä",
    headerSubtitle:
      "Ratkaisen arjen tilanteet: laitteiden häiriöt, ohjeet tuuraajalle, henkilöstöviestit ja muistilistat. 🧰",
    features: [
      { icon: "📋", title: "Viikkoinfot ja muistilistat", text: "Selkeät ohjeet tiimille yhdellä kertaa." },
      { icon: "🧊", title: "Laiterikot ja häiriöt", text: "Nopeat ohjeet: kylmiö, kassa, kuitti, maksupääte…" },
      { icon: "🏕️", title: "Tuuraajan ohjeet", text: "Pisteen avaus/sulku, yhteystiedot ja rutiinit." },
      { icon: "📢", title: "Näyttö- ja asiakasviestit", text: "Aukiolot, päivän ruoat, allergiat ja huomautukset." },
      { icon: "✅", title: "Toimintamallit", text: "Terveystarkastajan pyynnöt, ilmoitukset, dokumentit." },
    ],
  },

  // Valikoima (menu)
  menu: {
    headerTitle: "Solmio Ailo™ – Valikoimasuunnittelu",
    headerSubtitle:
      "Suunnittelen toimivan ruokalistan teidän laitteilla ja resursseilla. Katteet, kierto ja sesongit huomioiden. 🥗",
    features: [
      { icon: "📆", title: "Kiertävät listat", text: "1–4 viikon rungot keittiön kuormitus huomioiden." },
      { icon: "🥦", title: "Erityisruokavaliot", text: "Vegaanit, gluteenittomat ja muut vaihtoehdot helposti." },
      { icon: "💸", title: "Katteiden optimointi", text: "Hinta–raaka-aine–työ-suhde kuntoon." },
      { icon: "📋", title: "Raaka-aineohjattu", text: "Hyödynnä varastot: ehdotan listan nykyisistä aineista." },
      { icon: "⚙️", title: "Laitteisto & resurssit", text: "Suunnittelen sen mukaan mitä teillä on." },
    ],
  },

  // Tarjoukset (offers)
  offers: {
    headerTitle: "Solmio Ailo™ – Tarjouspyynnöt",
    headerSubtitle:
      "Laadin tarjouksia eri asiakasryhmille ja tilanteisiin. Selkeät liitteet, menut, hinnat ja ehdot. ✉️",
    features: [
      { icon: "📄", title: "Yritystilaisuudet", text: "Buffet, cocktail, aamiaistilaisuudet – valmiit paketit." },
      { icon: "🍽️", title: "Erikoisruokavaliot", text: "Halal, vegaani, allergiat – huomioitu tarjouksessa." },
      { icon: "💰", title: "Kannattavuus", text: "Katteet kuntoon ilman ylikuormitusta." },
      { icon: "✉️", title: "Saateviestit", text: "Selkeä ja myyvä saate sähköpostiin." },
      { icon: "🧾", title: "Liitteet", text: "Menut, laskentataulukot, toimitusehdot – yhtenäinen ilme." },
    ],
  },
};

export default defaultStrings;
