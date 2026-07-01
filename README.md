# İLGE v2 - Türk Tarihi İnteraktif Ansiklopedisi

İLGE; Türk tarihi odaklı interaktif tarih atlası, ansiklopedi, zaman simülasyonu, GIS harita sistemi ve savaş/göç animasyon platformudur. Sistem local sunucuda, cloud bağımlılığı olmadan çalışacak şekilde tasarlanmıştır.

## Gerekli Programlar

- Node.js 22+
- pnpm 9+
- Docker Desktop veya Docker Engine
- PostgreSQL istemcisi isteğe bağlıdır; Docker Compose PostGIS veritabanını otomatik başlatır.

## Kurulum

```bash
pnpm install
cp .env.example .env.local
pnpm dev
```

Uygulama varsayılan olarak `http://localhost:3000` adresinde çalışır.

## Docker Kurulumu

```bash
docker compose up --build
```

Servisler:

- `nextjs`: Next.js uygulaması
- `postgres`: PostgreSQL + PostGIS
- `minio`: Yerel dosya depolama
- `redis`: Cache
- `nginx`: Yerel reverse proxy

Nginx üzerinden erişim: `http://localhost:8080`

## Veritabanı Kurulumu

PostGIS şeması `database/schema.sql` dosyasındadır. Docker Compose ilk PostgreSQL açılışında bu dosyayı otomatik çalıştırır.

Ana tablolar:

- `devletler`
- `hukumdarlar`
- `savaslar`
- `gocler`
- `anlasmalar`
- `sehirler`
- `kavramlar`
- `tarih_olaylari`
- `ticaret_yollari`
- `gorseller`

Harita alanları PostGIS geometry tipleriyle tutulur. Admin panelde çizilen GeoJSON kayıt sırasında PostGIS geometrisine çevrilir.

## Çalıştırma Komutları

```bash
pnpm dev
pnpm typecheck
pnpm build
pnpm docker:up
pnpm docker:down
```

## Yönetim Paneli

Admin paneli: `http://localhost:3000/admin`

Varsayılan giriş:

- Kullanıcı: `admin`
- Şifre: `admin123`

Canlı kullanımda `.env.local` içindeki `ADMIN_PASSWORD` ve `ADMIN_JWT_SECRET` mutlaka değiştirilmelidir.
HTTPS arkasında yayın yapıyorsanız `ADMIN_COOKIE_SECURE=true` ayarlanmalıdır.

## Yapılacaklar Listesi

Tamamlanan özellikler:

- [x] Next.js + TypeScript + TailwindCSS proje yapısı
- [x] Türkçe kullanıcı arayüzü ve yönetim paneli
- [x] Yerel PostgreSQL/PostGIS veri modeli
- [x] Docker Compose: Next.js, PostGIS, MinIO, Redis, Nginx
- [x] JWT tabanlı admin oturumu
- [x] Mapbox GL Draw admin harita editörü
- [x] Leaflet public harita yedek motoru
- [x] Devlet, savaş, göç, anlaşma, kişi, şehir, kavram ve kültür sayfaları
- [x] Harita katman sistemi
- [x] Zaman slider ve senaryo modu
- [x] Savaş ve göç replay animasyonları
- [x] Devlet soy ağı ve karşılaştırma modu
- [x] Akıllı arama altyapısı
- [x] AI modülleri için genişletilebilir veri hazırlığı tablosu

Bekleyen özellikler:

- [ ] Canlı PostgreSQL listeleme ve satır seçerek düzenleme/silme
- [ ] MinIO dosya yükleme API'si
- [ ] Mapbox public harita motorunun token olduğunda ana görünüm olarak etkinleştirilmesi
- [ ] PostGIS seed verilerinin üretim kalitesinde genişletilmesi
- [ ] Savaş animasyonlarında gerçek rota üstü ikon hareketi
- [ ] Gelişmiş tam metin arama ve yıl bazlı sıralama
- [ ] Raspberry Pi 5 üzerinde bellek ve cold-start profil testi
