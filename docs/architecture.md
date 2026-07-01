# İLGE v2 Mimari Notları

## Katmanlar

- `app/`: Next.js App Router sayfaları ve API route'ları
- `components/maps`: Harita motoru ve katman yardımcıları
- `components/timeline`: Zaman motoru ve senaryo akışı
- `components/animations`: Savaş ve göç replay yüzeyleri
- `components/cards`: Ansiklopedi kartları ve soy ağacı görünümü
- `components/forms`: Karşılaştırma ve yönetim form yüzeyleri
- `database`: PostgreSQL + PostGIS şeması
- `docker`: Dockerfile ve Nginx konfigürasyonu

## Veri İlkesi

Admin panelde harita verisi manuel JSON girişi yerine çizim akışıyla üretilir. Mapbox GL Draw çıktısı GeoJSON olarak alınır, API tarafında PostGIS geometry kolonlarına dönüştürülür.

## Yerel Çalışma

Uygulama Supabase Cloud veya benzeri cloud servisine bağlı değildir. PostgreSQL/PostGIS, MinIO, Redis ve Nginx Docker Compose ile aynı makinede çalışır.

## AI Hazırlığı

`ai_hazirlik_notlari` tablosu, ileride tarih asistanı, soru-cevap ve açıklama sistemi için kaynak bağlantılı açıklama kayıtları saklamak üzere ayrılmıştır.

