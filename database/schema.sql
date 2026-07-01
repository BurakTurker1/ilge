create extension if not exists postgis;
create extension if not exists pgcrypto;

create table if not exists devletler (
  id uuid primary key default gen_random_uuid(),
  isim text not null,
  kurulus_yili integer not null,
  yikilis_yili integer,
  aciklama text,
  baskent text,
  bayrak text,
  din text,
  kultur text,
  yonetim text,
  ordu text,
  ekonomi text,
  harita_alani geometry(MultiPolygon, 4326),
  renk text default '#caa24b',
  olusturulma_zamani timestamptz default now(),
  guncellenme_zamani timestamptz default now()
);

create table if not exists hukumdarlar (
  id uuid primary key default gen_random_uuid(),
  isim text not null,
  dogum integer,
  olum integer,
  devlet_id uuid references devletler(id) on delete set null,
  biyografi text,
  olusturulma_zamani timestamptz default now(),
  guncellenme_zamani timestamptz default now()
);

create table if not exists savaslar (
  id uuid primary key default gen_random_uuid(),
  isim text not null,
  tarih integer not null,
  aciklama text,
  kazanan text,
  kaybeden text,
  konum geometry(Point, 4326),
  rota geometry(LineString, 4326),
  olusturulma_zamani timestamptz default now(),
  guncellenme_zamani timestamptz default now()
);

create table if not exists gocler (
  id uuid primary key default gen_random_uuid(),
  isim text not null,
  baslangic text,
  hedef text,
  tarih integer,
  bitis_tarihi integer,
  rota geometry(LineString, 4326),
  aciklama text,
  olusturulma_zamani timestamptz default now(),
  guncellenme_zamani timestamptz default now()
);

create table if not exists anlasmalar (
  id uuid primary key default gen_random_uuid(),
  isim text not null,
  tarih integer,
  taraflar text[],
  sonuc text,
  konum geometry(Point, 4326),
  aciklama text,
  olusturulma_zamani timestamptz default now(),
  guncellenme_zamani timestamptz default now()
);

create table if not exists sehirler (
  id uuid primary key default gen_random_uuid(),
  isim text not null,
  eski_isimler text[],
  konum geometry(Point, 4326),
  aciklama text,
  olusturulma_zamani timestamptz default now(),
  guncellenme_zamani timestamptz default now()
);

create table if not exists kavramlar (
  id uuid primary key default gen_random_uuid(),
  baslik text not null,
  kategori text not null,
  aciklama text,
  olusturulma_zamani timestamptz default now(),
  guncellenme_zamani timestamptz default now()
);

create table if not exists tarih_olaylari (
  id uuid primary key default gen_random_uuid(),
  yil integer not null,
  baslik text not null,
  aciklama text,
  tip text not null,
  iliskili_kayitlar text[],
  olusturulma_zamani timestamptz default now(),
  guncellenme_zamani timestamptz default now()
);

create table if not exists ticaret_yollari (
  id uuid primary key default gen_random_uuid(),
  isim text not null,
  rota geometry(LineString, 4326),
  aciklama text,
  olusturulma_zamani timestamptz default now(),
  guncellenme_zamani timestamptz default now()
);

create table if not exists gorseller (
  id uuid primary key default gen_random_uuid(),
  dosya text not null,
  kategori text,
  bagli_tablo text,
  bagli_id uuid,
  alternatif_metin text,
  olusturulma_zamani timestamptz default now()
);

create table if not exists devlet_iliskileri (
  id uuid primary key default gen_random_uuid(),
  ata_devlet_id uuid references devletler(id) on delete cascade,
  ardil_devlet_id uuid references devletler(id) on delete cascade,
  iliski_turu text default 'ardil',
  aciklama text
);

create table if not exists kultur_ogeleri (
  id uuid primary key default gen_random_uuid(),
  baslik text not null,
  kategori text not null check (kategori in ('sanat', 'mimari', 'muzik', 'yemek', 'silah', 'kiyafet')),
  aciklama text,
  devlet_id uuid references devletler(id) on delete set null,
  olusturulma_zamani timestamptz default now(),
  guncellenme_zamani timestamptz default now()
);

create table if not exists ai_hazirlik_notlari (
  id uuid primary key default gen_random_uuid(),
  bagli_tablo text not null,
  bagli_id uuid,
  soru text,
  cevap_kaynagi text,
  aciklama text,
  olusturulma_zamani timestamptz default now()
);

create index if not exists devletler_yil_idx on devletler (kurulus_yili, yikilis_yili);
create index if not exists savaslar_tarih_idx on savaslar (tarih);
create index if not exists gocler_tarih_idx on gocler (tarih, bitis_tarihi);
create index if not exists anlasmalar_tarih_idx on anlasmalar (tarih);
create index if not exists tarih_olaylari_yil_idx on tarih_olaylari (yil);
create index if not exists devletler_harita_gix on devletler using gist (harita_alani);
create index if not exists savaslar_konum_gix on savaslar using gist (konum);
create index if not exists gocler_rota_gix on gocler using gist (rota);
create index if not exists anlasmalar_konum_gix on anlasmalar using gist (konum);
create index if not exists sehirler_konum_gix on sehirler using gist (konum);
create index if not exists ticaret_yollari_rota_gix on ticaret_yollari using gist (rota);

create or replace function guncellenme_zamani_ata()
returns trigger
language plpgsql
as $$
begin
  new.guncellenme_zamani = now();
  return new;
end;
$$;

drop trigger if exists devletler_guncellenme on devletler;
create trigger devletler_guncellenme before update on devletler for each row execute function guncellenme_zamani_ata();

drop trigger if exists savaslar_guncellenme on savaslar;
create trigger savaslar_guncellenme before update on savaslar for each row execute function guncellenme_zamani_ata();

drop trigger if exists gocler_guncellenme on gocler;
create trigger gocler_guncellenme before update on gocler for each row execute function guncellenme_zamani_ata();

drop trigger if exists anlasmalar_guncellenme on anlasmalar;
create trigger anlasmalar_guncellenme before update on anlasmalar for each row execute function guncellenme_zamani_ata();

drop trigger if exists sehirler_guncellenme on sehirler;
create trigger sehirler_guncellenme before update on sehirler for each row execute function guncellenme_zamani_ata();

drop trigger if exists kavramlar_guncellenme on kavramlar;
create trigger kavramlar_guncellenme before update on kavramlar for each row execute function guncellenme_zamani_ata();

drop trigger if exists tarih_olaylari_guncellenme on tarih_olaylari;
create trigger tarih_olaylari_guncellenme before update on tarih_olaylari for each row execute function guncellenme_zamani_ata();

drop trigger if exists ticaret_yollari_guncellenme on ticaret_yollari;
create trigger ticaret_yollari_guncellenme before update on ticaret_yollari for each row execute function guncellenme_zamani_ata();

