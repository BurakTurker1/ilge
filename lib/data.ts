import { City, Concept, CultureItem, Migration, Person, StateEntity, TimelineEvent, TradeRoute, Treaty, War } from "./types";

export const states: StateEntity[] = [
  {
    id: "gokturk",
    name: "Gokturk Kaganligi",
    founded: 552,
    dissolved: 744,
    founder: "Bumin Kagan",
    capital: "Otuken",
    color: "#3aa6a1",
    region: "Orta Asya",
    religion: "Gok Tanri inanci",
    economy: "Hayvancilik, ticaret yollari ve maden isciligi",
    army: "Hafif suvari, onlu teskilat, hareketli okculuk",
    culture: "Orhun yazitlari, tore ve kurultay gelenegi",
    summary: "Turk adini devlet adi olarak kullanan ilk buyuk siyasi yapilardan biridir.",
    rulers: ["Bumin Kagan", "Istemi Yabgu", "Bilge Kagan", "Kapgan Kagan"],
    center: { lat: 47.5, lng: 103.3 },
    coordinates: [
      { lat: 43.6, lng: 73.5 },
      { lat: 51.2, lng: 84.7 },
      { lat: 52.3, lng: 107.7 },
      { lat: 45.5, lng: 121.4 },
      { lat: 39.6, lng: 100.5 }
    ],
    events: ["552 kurulus", "Orhun yazitlari", "Ipek Yolu hakimiyeti"]
  },
  {
    id: "uygur",
    name: "Uygur Kaganligi",
    founded: 744,
    dissolved: 840,
    founder: "Kutlug Bilge Kul Kagan",
    capital: "Ordu-Balik",
    color: "#748b54",
    region: "Mogolistan ve Tarim havzasi",
    religion: "Maniheizm, Budizm",
    economy: "Ticaret, tarim, zanaat ve kent ekonomisi",
    army: "Suvari birlikleri ve kale merkezli savunma",
    culture: "Yerlesik hayat, yazili kultur ve matbaa gelenegi",
    summary: "Turk tarihindeki yerlesik yasam, yazili kultur ve kentlesme acisindan onemli bir donemdir.",
    rulers: ["Kutlug Bilge Kul", "Moyen Cur", "Bogu Kagan"],
    center: { lat: 47.4, lng: 102.8 },
    coordinates: [
      { lat: 42.1, lng: 82.4 },
      { lat: 49.6, lng: 88.2 },
      { lat: 50.4, lng: 111.1 },
      { lat: 43.2, lng: 112.9 },
      { lat: 39.5, lng: 95.7 }
    ],
    events: ["744 kurulus", "Ordu-Balik", "Maniheizm etkisi"]
  },
  {
    id: "karahanli",
    name: "Karahanli Devleti",
    founded: 840,
    dissolved: 1212,
    founder: "Bilge Kul Kadir Han",
    capital: "Balasagun",
    color: "#caa24b",
    region: "Maveraunnehir ve Dogu Turkistan",
    religion: "Islam",
    economy: "Ipek Yolu ticareti, tarim ve sehir ekonomisi",
    army: "Suvari birlikleri, yerel garnizonlar",
    culture: "Kutadgu Bilig ve Divanu Lugati't-Turk cagi",
    summary: "Islamiyet'i benimseyen ilk buyuk Turk devletlerinden biri olarak kultur tarihinde derin iz birakti.",
    rulers: ["Satuk Bugra Han", "Yusuf Kadir Han", "Tamgac Bugra Han"],
    center: { lat: 42.9, lng: 74.6 },
    coordinates: [
      { lat: 39.2, lng: 68.4 },
      { lat: 44.8, lng: 71.9 },
      { lat: 43.7, lng: 81.5 },
      { lat: 37.9, lng: 79.9 },
      { lat: 37.1, lng: 70.5 }
    ],
    events: ["Satuk Bugra Han", "Kutadgu Bilig", "Kasar ve Balasagun"]
  },
  {
    id: "gazneli",
    name: "Gazneliler",
    founded: 963,
    dissolved: 1186,
    founder: "Alp Tegin",
    capital: "Gazne",
    color: "#7c5cff",
    region: "Horasan, Afganistan ve Kuzey Hindistan",
    religion: "Islam",
    economy: "Ticaret, ganimet ekonomisi, zanaat",
    army: "Gulam birlikleri, suvari ve fil destekli ordular",
    culture: "Farsca edebiyat, saray kulturu ve ilim merkezleri",
    summary: "Horasan ve Hindistan hattinda Turk-Islam siyasetine yon veren guclu bir devletti.",
    rulers: ["Sebuk Tegin", "Gazneli Mahmud", "Mesud"],
    center: { lat: 33.5, lng: 68.4 },
    coordinates: [
      { lat: 30.9, lng: 61.3 },
      { lat: 36.1, lng: 61.7 },
      { lat: 37.0, lng: 70.2 },
      { lat: 31.6, lng: 75.1 },
      { lat: 28.7, lng: 68.7 }
    ],
    events: ["Hindistan seferleri", "Dandanakan sonrasi zayiflama"]
  },
  {
    id: "buyuk-selcuklu",
    name: "Buyuk Selcuklu",
    founded: 1037,
    dissolved: 1194,
    founder: "Tugrul Bey",
    capital: "Isfahan",
    color: "#9f4234",
    region: "Iran, Irak, Horasan ve Anadolu kapilari",
    religion: "Islam",
    economy: "Ticaret yollari, ikta sistemi, sehir ekonomisi",
    army: "Suvari ordusu, gulam birlikleri, ikta askerleri",
    culture: "Nizamiye medreseleri, Turk-Islam sentezi",
    summary: "Anadolu'nun kapilarini Turk dunyasina acan ve Islam dunyasinda siyasi denge kuran imparatorluk.",
    rulers: ["Tugrul Bey", "Alparslan", "Meliksah", "Sencer"],
    center: { lat: 35.7, lng: 51.4 },
    coordinates: [
      { lat: 28.9, lng: 38.8 },
      { lat: 39.7, lng: 40.7 },
      { lat: 40.2, lng: 57.8 },
      { lat: 36.2, lng: 69.4 },
      { lat: 29.5, lng: 61.9 },
      { lat: 25.1, lng: 51.3 }
    ],
    events: ["1040 Dandanakan", "1071 Malazgirt", "Nizamiye medreseleri"]
  },
  {
    id: "osmanli",
    name: "Osmanli Devleti",
    founded: 1299,
    dissolved: 1922,
    founder: "Osman Gazi",
    capital: "Sogut, Bursa, Edirne, Istanbul",
    color: "#b92332",
    region: "Anadolu, Balkanlar, Ortadogu, Kuzey Afrika",
    religion: "Islam",
    economy: "Timar, ticaret, loncalar, liman kentleri",
    army: "Timarli sipahi, yeniçeri, topcu ocagi, donanma",
    culture: "Klasik mimari, divan edebiyati, vakif sistemi",
    summary: "Uc beyliginden cihan devleti haline gelen, uc kitada etkili uzun omurlu Turk devleti.",
    rulers: ["Osman Gazi", "Orhan Gazi", "Fatih Sultan Mehmed", "Kanuni Sultan Suleyman"],
    center: { lat: 41.0, lng: 28.9 },
    coordinates: [
      { lat: 36.2, lng: 16.2 },
      { lat: 47.2, lng: 19.1 },
      { lat: 46.1, lng: 29.9 },
      { lat: 41.0, lng: 44.3 },
      { lat: 31.2, lng: 36.8 },
      { lat: 26.0, lng: 31.2 },
      { lat: 32.6, lng: 14.1 }
    ],
    events: ["1453 Istanbul'un Fethi", "1517 Misir", "1699 Karlofca", "1922 saltanatin kaldirilmasi"]
  },
  {
    id: "turkiye",
    name: "Turkiye Cumhuriyeti",
    founded: 1923,
    founder: "Mustafa Kemal Ataturk",
    capital: "Ankara",
    color: "#e23d3d",
    region: "Anadolu ve Trakya",
    religion: "Laik cumhuriyet",
    economy: "Karma ekonomi, sanayi, hizmetler ve teknoloji",
    army: "Modern ulusal ordu",
    culture: "Cumhuriyet devrimleri, modernlesme, cok katmanli kultur",
    summary: "Milli Mucadele sonrasinda kurulan modern Turk devleti.",
    rulers: ["Mustafa Kemal Ataturk", "Ismet Inonu"],
    center: { lat: 39.9, lng: 32.8 },
    coordinates: [
      { lat: 36.0, lng: 26.0 },
      { lat: 42.0, lng: 26.0 },
      { lat: 42.2, lng: 41.5 },
      { lat: 37.1, lng: 44.7 },
      { lat: 35.8, lng: 36.0 }
    ],
    events: ["1923 Cumhuriyet", "1924 anayasal donusum", "modernlesme reformlari"]
  }
];

export const wars: War[] = [
  {
    id: "malazgirt",
    name: "Malazgirt Savasi",
    year: 1071,
    sides: ["Buyuk Selcuklu", "Bizans"],
    commanders: ["Alparslan", "Romanos Diogenes"],
    result: "Anadolu'nun Turklesme surecini hizlandiran Selcuklu zaferi.",
    location: { lat: 39.15, lng: 42.54 },
    route: [
      { lat: 35.7, lng: 51.4 },
      { lat: 37.5, lng: 47.1 },
      { lat: 39.15, lng: 42.54 }
    ],
    summary: "Selcuklu ve Bizans ordulari arasinda gerceklesen savas, Anadolu tarihi icin donum noktasi kabul edilir."
  },
  {
    id: "istanbul-fethi",
    name: "Istanbul'un Fethi",
    year: 1453,
    sides: ["Osmanli", "Bizans"],
    commanders: ["Fatih Sultan Mehmed", "XI. Konstantinos"],
    result: "Bizans sona erdi, Istanbul Osmanli baskenti oldu.",
    location: { lat: 41.01, lng: 28.98 },
    route: [
      { lat: 41.68, lng: 26.56 },
      { lat: 41.2, lng: 28.0 },
      { lat: 41.01, lng: 28.98 }
    ],
    summary: "Top teknolojisi, kusatma stratejisi ve deniz hamleleriyle cag acip kapatan fetihtir."
  },
  {
    id: "dandanakan",
    name: "Dandanakan Savasi",
    year: 1040,
    sides: ["Selcuklular", "Gazneliler"],
    commanders: ["Tugrul Bey", "Cagri Bey", "Gazneli Mesud"],
    result: "Selcuklular Horasan'da siyasi ustunluk kurdu.",
    location: { lat: 37.1, lng: 62.2 },
    route: [
      { lat: 33.5, lng: 68.4 },
      { lat: 36.7, lng: 64.9 },
      { lat: 37.1, lng: 62.2 }
    ],
    summary: "Buyuk Selcuklu Devleti'nin imparatorluk olma surecini baslatan belirleyici carpismadir."
  }
];

export const migrations: Migration[] = [
  {
    id: "orta-asya-anadolu",
    name: "Orta Asya'dan Anadolu'ya Turk Gocleri",
    startYear: 900,
    endYear: 1300,
    origin: "Orhun ve Maveraunnehir havzasi",
    destination: "Anadolu",
    route: [
      { lat: 47.5, lng: 103.3 },
      { lat: 41.3, lng: 69.2 },
      { lat: 35.7, lng: 51.4 },
      { lat: 39.15, lng: 42.54 },
      { lat: 39.9, lng: 32.8 }
    ],
    result: "Anadolu'da beylikler ve kalici Turk siyasi varligi ortaya cikti."
  },
  {
    id: "oguz-bati",
    name: "Oguzlarin Batiya Hareketi",
    startYear: 750,
    endYear: 1100,
    origin: "Seyhun havzasi",
    destination: "Horasan, Azerbaycan ve Anadolu",
    route: [
      { lat: 44.8, lng: 64.0 },
      { lat: 39.7, lng: 66.9 },
      { lat: 36.3, lng: 59.6 },
      { lat: 38.1, lng: 46.3 },
      { lat: 39.9, lng: 32.8 }
    ],
    result: "Oguz boylari Selcuklu ve Turkmen beylikleri uzerinden yeni siyasi yapilar kurdu."
  }
];

export const treaties: Treaty[] = [
  {
    id: "karlofca",
    name: "Karlofca Antlasmasi",
    year: 1699,
    parties: ["Osmanli", "Avusturya", "Venedik", "Lehistan"],
    result: "Osmanli Avrupa'da genis toprak kayiplari yasadi.",
    effects: ["Savunma diplomasisi agirlik kazandi", "Avrupa dengesi degisti", "Islahat arayislari hizlandi"]
  },
  {
    id: "amasya",
    name: "Amasya Antlasmasi",
    year: 1555,
    parties: ["Osmanli", "Safevi"],
    result: "Osmanli-Safevi sinirlari icin ilk buyuk diplomatik zemin olustu.",
    effects: ["Dogu siniri goreli istikrara kavustu", "Mezhep ve sinir siyaseti sekillendi"]
  },
  {
    id: "pasinler",
    name: "Pasinler Sonrasi Diplomatik Surec",
    year: 1048,
    parties: ["Selcuklular", "Bizans"],
    result: "Selcuklu akınlari Bizans tarafindan ciddi stratejik tehdit olarak goruldu.",
    effects: ["Anadolu hattinda askeri temas artti", "Malazgirt'e giden surec hizlandi"]
  }
];

export const people: Person[] = [
  {
    id: "mete-han",
    name: "Mete Han",
    years: "M.O. 234 - M.O. 174",
    period: "Asya Hun",
    role: "Hukumdar",
    achievements: ["Onlu askeri teskilat", "Bozkir siyasi birligi", "Cin uzerinde stratejik baski"],
    wars: [],
    summary: "Bozkir devlet geleneginin ve askeri organizasyonunun kurucu figurlarindan kabul edilir."
  },
  {
    id: "bilge-kagan",
    name: "Bilge Kagan",
    years: "683 - 734",
    period: "Gokturk",
    role: "Kagan",
    achievements: ["Ikinci Gokturk siyasi toparlanmasi", "Orhun yazitlari", "Tore vurgusu"],
    wars: [],
    summary: "Turk devlet akli ve yonetim dusuncesini yazitlar uzerinden gunumuze tasiyan hukumdardir."
  },
  {
    id: "alparslan",
    name: "Alparslan",
    years: "1029 - 1072",
    period: "Buyuk Selcuklu",
    role: "Sultan",
    achievements: ["Malazgirt zaferi", "Anadolu kapilarinin acilmasi", "Selcuklu hakimiyetinin genislemesi"],
    wars: ["Malazgirt Savasi"],
    summary: "Anadolu'nun Turk tarihi icindeki yerini belirleyen en kritik liderlerden biridir."
  },
  {
    id: "fatih",
    name: "Fatih Sultan Mehmed",
    years: "1432 - 1481",
    period: "Osmanli",
    role: "Padisah",
    achievements: ["Istanbul'un fethi", "Merkeziyetci imparatorluk duzeni", "Kanunnameler"],
    wars: ["Istanbul'un Fethi"],
    summary: "Osmanli'yi bolgesel guc olmaktan imparatorluk duzeyine tasiyan hukumdardir."
  }
];

export const cities: City[] = [
  {
    id: "istanbul",
    name: "Istanbul",
    oldNames: ["Byzantion", "Konstantinopolis", "Dersaadet"],
    states: ["Bizans", "Osmanli", "Turkiye Cumhuriyeti"],
    events: ["1453 fethi", "Osmanli baskenti", "Cumhuriyet donemi metropolu"],
    location: { lat: 41.01, lng: 28.98 },
    summary: "Doguyu ve batiyi birlestiren, Turk ve dunya tarihinde merkezi rolu olan sehir."
  },
  {
    id: "konya",
    name: "Konya",
    oldNames: ["Iconium"],
    states: ["Anadolu Selcuklu", "Karamanogullari", "Osmanli"],
    events: ["Anadolu Selcuklu baskenti", "Mevlana ve tasavvuf gelenegi"],
    location: { lat: 37.87, lng: 32.48 },
    summary: "Anadolu Selcuklu siyasi ve kulturel merkezlerinden biridir."
  },
  {
    id: "semerkant",
    name: "Semerkant",
    oldNames: ["Marakanda"],
    states: ["Karahanli", "Timurlu", "Cagatay"],
    events: ["Ipek Yolu merkezi", "Timurlu bilim ve sanat hayati"],
    location: { lat: 39.65, lng: 66.96 },
    summary: "Maveraunnehir'in bilim, ticaret ve mimari merkezlerinden biridir."
  },
  {
    id: "buhara",
    name: "Buhara",
    oldNames: ["Buxoro"],
    states: ["Karahanli", "Samani", "Timurlu"],
    events: ["Medrese gelenegi", "Ipek Yolu ticareti"],
    location: { lat: 39.77, lng: 64.43 },
    summary: "Turk-Islam kultur havzasinin en kalici ilim merkezlerinden biridir."
  }
];

export const concepts: Concept[] = [
  {
    id: "kut",
    name: "Kut",
    category: "devlet",
    summary: "Hukumdarlik yetkisinin ilahi mesruiyetle aciklanmasi.",
    details: "Kut anlayisi, hukumdarin devleti yonetme hakkini Gok Tanri'dan aldigi fikriyle siyasi otoriteyi temellendirir."
  },
  {
    id: "tore",
    name: "Tore",
    category: "toplum",
    summary: "Bozkir toplumunda hukuk, gelenek ve duzen kurallari.",
    details: "Tore, devlet idaresinden aile duzenine kadar ortak yasam kurallarini belirleyen dinamik bir normlar butunudur."
  },
  {
    id: "kurultay",
    name: "Kurultay",
    category: "devlet",
    summary: "Siyasi kararlarin gorusuldugu meclis gelenegi.",
    details: "Hukumdar secimi, savas, baris ve buyuk stratejik kararlar kurultayda tartisilirdi."
  },
  {
    id: "alp",
    name: "Alp",
    category: "askerlik",
    summary: "Cesaret, savas becerisi ve toplum icin sorumluluk tasiyan ideal savasci tipi.",
    details: "Alplik, sadece askeri gucu degil, sadakat, comertlik ve duzen koruma anlayisini da kapsar."
  }
];

export const tradeRoutes: TradeRoute[] = [
  {
    id: "ipek-yolu-orta-asya",
    name: "İpek Yolu Orta Asya Hattı",
    summary: "Balasagun, Semerkant, Buhara ve Horasan üzerinden Anadolu kapılarına uzanan ana ticaret hattı.",
    route: [
      { lat: 43.2, lng: 76.9 },
      { lat: 42.9, lng: 74.6 },
      { lat: 39.65, lng: 66.96 },
      { lat: 39.77, lng: 64.43 },
      { lat: 36.3, lng: 59.6 },
      { lat: 38.1, lng: 46.3 },
      { lat: 39.9, lng: 32.8 }
    ]
  },
  {
    id: "karadeniz-anadolu",
    name: "Karadeniz-Anadolu Ticaret Hattı",
    summary: "Kırım, Trabzon, Erzurum ve İç Anadolu arasında askeri ve ticari geçişleri besleyen kuzey hat.",
    route: [
      { lat: 45.3, lng: 34.2 },
      { lat: 41.0, lng: 39.7 },
      { lat: 39.9, lng: 41.3 },
      { lat: 39.9, lng: 32.8 },
      { lat: 37.87, lng: 32.48 }
    ]
  }
];

export const cultureItems: CultureItem[] = [
  {
    id: "orhun-yazitlari",
    title: "Orhun Yazıtları",
    category: "sanat",
    period: "Göktürk",
    summary: "Türk adının, töre ve devlet aklının yazılı kültürde belirginleştiği temel miras."
  },
  {
    id: "selcuklu-kervansaraylari",
    title: "Selçuklu Kervansarayları",
    category: "mimari",
    period: "Anadolu Selçuklu",
    summary: "Ticaret yollarını güvence altına alan, mimari ve sosyal yardım işlevini birleştiren yapılar."
  },
  {
    id: "mehter",
    title: "Mehter Geleneği",
    category: "muzik",
    period: "Osmanlı",
    summary: "Savaş ritmi, tören düzeni ve imparatorluk temsilini birleştiren askeri müzik geleneği."
  },
  {
    id: "yay-ok",
    title: "Kompozit Yay",
    category: "silah",
    period: "Bozkır",
    summary: "Hareketli süvari taktiklerinin merkezinde yer alan yüksek etkili bozkır savaş teknolojisi."
  }
];

export const timeline: TimelineEvent[] = [
  { id: "t-552", year: 552, title: "Gokturk Kaganligi kuruldu", era: "orta-cag", type: "state", summary: "Turk adini devlet adi olarak kullanan buyuk kaganlik sahneye cikti.", relatedIds: ["gokturk"] },
  { id: "t-744", year: 744, title: "Uygur Kaganligi kuruldu", era: "orta-cag", type: "state", summary: "Yerlesik kultur ve yazili hayat guclendi.", relatedIds: ["uygur"] },
  { id: "t-1040", year: 1040, title: "Dandanakan Savasi", era: "orta-cag", type: "war", summary: "Selcuklular Horasan'da ustunluk kurdu.", relatedIds: ["dandanakan", "buyuk-selcuklu"] },
  { id: "t-1071", year: 1071, title: "Malazgirt Savasi", era: "orta-cag", type: "war", summary: "Anadolu'nun Turklesme surecinde donum noktasi.", relatedIds: ["malazgirt", "buyuk-selcuklu"] },
  { id: "t-1299", year: 1299, title: "Osmanli Beyligi ortaya cikti", era: "orta-cag", type: "state", summary: "Sogut merkezli uc beyligi kisa surede genisledi.", relatedIds: ["osmanli"] },
  { id: "t-1453", year: 1453, title: "Istanbul'un Fethi", era: "yeni-cag", type: "war", summary: "Bizans sona erdi, Istanbul Osmanli baskenti oldu.", relatedIds: ["istanbul-fethi", "istanbul"] },
  { id: "t-1699", year: 1699, title: "Karlofca Antlasmasi", era: "yeni-cag", type: "treaty", summary: "Osmanli Avrupa siyasetinde yeni bir doneme girdi.", relatedIds: ["karlofca"] },
  { id: "t-1923", year: 1923, title: "Turkiye Cumhuriyeti kuruldu", era: "modern", type: "state", summary: "Milli Mucadele sonrasinda modern cumhuriyet ilan edildi.", relatedIds: ["turkiye"] }
];

export const allSearchItems = [
  ...states.map((item) => ({ type: "Devlet", id: item.id, title: item.name, text: item.summary })),
  ...wars.map((item) => ({ type: "Savas", id: item.id, title: item.name, text: item.summary })),
  ...migrations.map((item) => ({ type: "Goc", id: item.id, title: item.name, text: `${item.origin} -> ${item.destination}` })),
  ...treaties.map((item) => ({ type: "Antlasma", id: item.id, title: item.name, text: item.result })),
  ...people.map((item) => ({ type: "Kisi", id: item.id, title: item.name, text: item.summary })),
  ...cities.map((item) => ({ type: "Sehir", id: item.id, title: item.name, text: item.summary })),
  ...concepts.map((item) => ({ type: "Kavram", id: item.id, title: item.name, text: item.summary })),
  ...tradeRoutes.map((item) => ({ type: "Ticaret yolu", id: item.id, title: item.name, text: item.summary })),
  ...cultureItems.map((item) => ({ type: "Kultur", id: item.id, title: item.title, text: item.summary }))
];
