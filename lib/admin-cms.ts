import { cities, concepts, migrations, people, states, timeline, treaties, wars } from "./data";

export type AdminSection =
  | "dashboard"
  | "states"
  | "map"
  | "wars"
  | "migrations"
  | "treaties"
  | "people"
  | "cities"
  | "concepts"
  | "images"
  | "timeline"
  | "trade"
  | "culture"
  | "settings";

export type CmsField = {
  name: string;
  label: string;
  type: "text" | "number" | "textarea" | "select" | "color" | "file" | "geojson" | "multiselect";
  required?: boolean;
  options?: string[];
  placeholder?: string;
};

export type CmsModule = {
  section: AdminSection;
  title: string;
  description: string;
  tableName: string;
  fields: CmsField[];
};

export const adminMetrics = [
  { label: "Devlet", value: states.length, table: "states", tableLabel: "devletler" },
  { label: "Savaş", value: wars.length, table: "wars", tableLabel: "savaşlar" },
  { label: "Göç", value: migrations.length, table: "migrations", tableLabel: "göçler" },
  { label: "Anlaşma", value: treaties.length, table: "treaties", tableLabel: "anlaşmalar" },
  { label: "Kişi", value: people.length, table: "people", tableLabel: "hükümdarlar/kişiler" },
  { label: "Şehir", value: cities.length, table: "cities", tableLabel: "şehirler" },
  { label: "Kavram", value: concepts.length, table: "concepts", tableLabel: "kavramlar" },
  { label: "Zaman olayı", value: timeline.length, table: "timeline", tableLabel: "tarih olayları" }
];

const stateOptions = states.map((state) => state.name);

export const cmsModules: CmsModule[] = [
  {
    section: "states",
    title: "Devletler",
    description: "Devlet kaydı, dönem bilgileri, bayrak ve harita çokgen sınırları.",
    tableName: "devletler",
    fields: [
      { name: "isim", label: "İsim", type: "text", required: true },
      { name: "kurulus_yili", label: "Kuruluş yılı", type: "number", required: true },
      { name: "yikilis_yili", label: "Yıkılış yılı", type: "number" },
      { name: "baskent", label: "Başkent", type: "text", required: true },
      { name: "aciklama", label: "Açıklama", type: "textarea", required: true },
      { name: "bayrak", label: "Bayrak dosyası", type: "file" },
      { name: "renk", label: "Harita rengi", type: "color" },
      { name: "din", label: "Din", type: "text" },
      { name: "kultur", label: "Kültür", type: "textarea" },
      { name: "yonetim", label: "Yönetim", type: "text" },
      { name: "ordu", label: "Ordu", type: "textarea" },
      { name: "ekonomi", label: "Ekonomi", type: "textarea" },
      { name: "harita_alani", label: "Harita sınırı", type: "geojson" }
    ]
  },
  {
    section: "wars",
    title: "Savaşlar",
    description: "Taraflar, kazanan/kaybeden, nokta konumu ve opsiyonel hareket rotası.",
    tableName: "savaslar",
    fields: [
      { name: "isim", label: "İsim", type: "text", required: true },
      { name: "tarih", label: "Tarih", type: "number", required: true },
      { name: "kazanan", label: "Kazanan", type: "select", options: stateOptions },
      { name: "kaybeden", label: "Kaybeden", type: "select", options: stateOptions },
      { name: "aciklama", label: "Açıklama", type: "textarea" },
      { name: "konum", label: "Savaş noktası", type: "geojson" },
      { name: "rota", label: "Ordu rotası", type: "geojson" }
    ]
  },
  {
    section: "migrations",
    title: "Göçler",
    description: "Başlangıç ve hedef bölgesi, tarih aralığı ve hareketli rota çizgisi.",
    tableName: "gocler",
    fields: [
      { name: "isim", label: "İsim", type: "text", required: true },
      { name: "baslangic", label: "Başlangıç bölgesi", type: "text" },
      { name: "hedef", label: "Hedef bölge", type: "text" },
      { name: "tarih", label: "Başlangıç yılı", type: "number" },
      { name: "bitis_tarihi", label: "Bitiş yılı", type: "number" },
      { name: "rota", label: "Göç rotası", type: "geojson" },
      { name: "aciklama", label: "Açıklama", type: "textarea" }
    ]
  },
  {
    section: "treaties",
    title: "Anlaşmalar",
    description: "Taraflar, sonuç, açıklama ve imza yeri noktası.",
    tableName: "anlasmalar",
    fields: [
      { name: "isim", label: "İsim", type: "text", required: true },
      { name: "tarih", label: "Tarih", type: "number" },
      { name: "taraflar", label: "Taraflar", type: "textarea", placeholder: "Osmanlı, Avusturya, Venedik" },
      { name: "sonuc", label: "Sonuç", type: "textarea" },
      { name: "aciklama", label: "Açıklama", type: "textarea" },
      { name: "konum", label: "İmza yeri", type: "geojson" }
    ]
  },
  {
    section: "people",
    title: "Hükümdarlar ve Kişiler",
    description: "Biyografi, doğum/ölüm bilgisi, bağlı devlet ve görsel yönetimi.",
    tableName: "hukumdarlar",
    fields: [
      { name: "isim", label: "İsim", type: "text", required: true },
      { name: "dogum", label: "Doğum", type: "number" },
      { name: "olum", label: "Ölüm", type: "number" },
      { name: "devlet_id", label: "Bağlı devlet kimliği", type: "text" },
      { name: "biyografi", label: "Biyografi", type: "textarea" }
    ]
  },
  {
    section: "cities",
    title: "Şehirler",
    description: "Koordinat, eski isimler, bağlı devletler ve şehir olayları.",
    tableName: "sehirler",
    fields: [
      { name: "isim", label: "İsim", type: "text", required: true },
      { name: "eski_isimler", label: "Eski isimler", type: "textarea", placeholder: "Byzantion, Konstantinopolis" },
      { name: "konum", label: "Koordinat", type: "geojson" },
      { name: "aciklama", label: "Açıklama", type: "textarea" }
    ]
  },
  {
    section: "concepts",
    title: "Kavramlar",
    description: "Ansiklopedi başlıkları ve kategorileri.",
    tableName: "kavramlar",
    fields: [
      { name: "baslik", label: "Başlık", type: "text", required: true },
      { name: "kategori", label: "Kategori", type: "select", options: ["devlet", "askerlik", "kültür", "toplum", "yönetim"] },
      { name: "aciklama", label: "Açıklama", type: "textarea", required: true }
    ]
  },
  {
    section: "timeline",
    title: "Tarih Olayları",
    description: "Yıl bazlı olaylar, ilişkili içerikler ve gösterim sırası.",
    tableName: "tarih_olaylari",
    fields: [
      { name: "baslik", label: "Başlık", type: "text", required: true },
      { name: "yil", label: "Yıl", type: "number", required: true },
      { name: "tip", label: "Tür", type: "select", options: ["devlet", "savaş", "göç", "anlaşma", "kültür"] },
      { name: "aciklama", label: "Açıklama", type: "textarea" },
      { name: "iliskili_kayitlar", label: "İlişkili kayıtlar", type: "textarea" }
    ]
  },
  {
    section: "trade",
    title: "Ticaret Yolları",
    description: "İpek Yolu ve diğer tarihsel güzergahların çizgisel rota kayıtları.",
    tableName: "ticaret_yollari",
    fields: [
      { name: "isim", label: "İsim", type: "text", required: true },
      { name: "rota", label: "Rota", type: "geojson" },
      { name: "aciklama", label: "Açıklama", type: "textarea" }
    ]
  },
  {
    section: "culture",
    title: "Kültür Öğeleri",
    description: "Sanat, mimari, müzik, yemek, silah ve kıyafet kayıtları.",
    tableName: "kultur_ogeleri",
    fields: [
      { name: "baslik", label: "Başlık", type: "text", required: true },
      { name: "kategori", label: "Kategori", type: "select", options: ["sanat", "mimari", "muzik", "yemek", "silah", "kiyafet"] },
      { name: "devlet_id", label: "Bağlı devlet kimliği", type: "text" },
      { name: "aciklama", label: "Açıklama", type: "textarea" }
    ]
  }
];

export const sampleRows = {
  devletler: states,
  savaslar: wars,
  gocler: migrations,
  anlasmalar: treaties,
  hukumdarlar: people,
  sehirler: cities,
  kavramlar: concepts,
  tarih_olaylari: timeline,
  ticaret_yollari: migrations,
  kultur_ogeleri: concepts
};
