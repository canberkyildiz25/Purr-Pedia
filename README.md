# 🐱 PurrPedia — Kedi Ansiklopedisi

> Dünya genelindeki kedi ırklarını keşfet. Özellikler, kişilikler, bakım rehberi ve daha fazlası.

**PurrPedia**, [TheCatAPI](https://thecatapi.com) verilerini kullanan, Türkçe/İngilizce tam dil desteğine sahip, modern bir kedi ansiklopedisi web uygulamasıdır.

---

## ✨ Özellikler

### 🔍 Irklar Kataloğu
- 70+ kedi ırkı, görsel kartlarla listelenir
- **Infinite scroll** — sayfa sonuna gelince otomatik yükler
- **Autocomplete arama** — isim, köken ve mizaca göre filtreler
- **Filtre pilleri** — Alerjisiz · Kucak Kedisi · İç Mekan · Nadir
- **Sıralama** — A→Z, Z→A, Köken, Zeka, Sevgi düzeyine göre
- **URL senkronizasyonu** — filtreler URL'ye yansır, link paylaşılabilir

### 📋 Irk Detay Sayfası
- Birden fazla fotoğraf galerisi
- Dairesel hızlı istatistik grafikleri (6 metrik)
- Kişilik & Bakım stat barları
- Mizaç etiketleri (Türkçe çeviri)
- **Kime Uygun?** — Aileler, Yeni sahipler, Apartman, Diğer evciller
- Ağırlık (kg + lbs), yaşam süresi, köken
- **Benzer ırklar** — aynı köken ülkesinden öneriler
- Detay sayfasından direkt **karşılaştırmaya ekleme**

### ⚖️ Irk Karşılaştırma
- Aynı anda 3 ırka kadar seçim
- Floating bar ile karşılaştırma sayfasına hızlı erişim
- Tablo formatında tüm istatistiklerin yan yana görünümü

### 🎯 Kedi Irkı Testi
- 4 soruluk kısa test (enerji, alerjisi, yaşam alanı, çocuk)
- Cevaplara göre puanlama sistemi
- En uygun 6 ırkı sonuç olarak gösterir

### ❤️ Favoriler
- Favori ırkları kalp ikonuyla kaydet (localStorage'da saklanır)
- İsim / Sevgi / Enerji düzeyine göre sıralama
- Ortalama enerji, ortalama sevgi ve en sık köken istatistikleri
- Toplu temizleme butonu

### 📚 Bakım Rehberi
- Sahiplenmeye hazırlık kontrol listesi
- 6 bölüm: Ev hazırlama · Malzemeler · Beslenme · Sağlık · Bakım · Oyun
- Kediler için tehlikeli yiyecekler ve maddeler
- Altın kurallar ve ipuçları
- Tam TR/EN dil desteği

### 🌐 Dil Desteği
- IP tespiti ile otomatik dil seçimi (Türkiye → Türkçe)
- Navbar'daki butonla anlık geçiş
- Irk açıklamaları Türkçeye çevrilir (Lingva + MyMemory API, önbellekleme ile)

### 📱 PWA
- `manifest.json` ile ana ekrana eklenebilir
- Service Worker ile kedi fotoğrafları offline önbelleğe alınır

---

## 🛠 Teknoloji Yığını

| Katman | Teknoloji |
|--------|-----------|
| UI | React 18 + TypeScript |
| Stil | Tailwind CSS 3 + Comfortaa font |
| State | Redux Toolkit + React Redux |
| Router | React Router v6 |
| HTTP | Axios |
| Build | Vite 6 |
| Veri | [TheCatAPI](https://thecatapi.com) |
| Çeviri | Lingva Translate + MyMemory API |

---

## 🚀 Kurulum

```bash
# Bağımlılıkları yükle
npm install

# Geliştirme sunucusunu başlat
npm run dev

# Üretim build'i oluştur
npm run build

# Build önizlemesi
npm run preview
```

---

## 🔑 Ortam Değişkenleri

Kök dizine `.env` dosyası oluştur:

```env
VITE_CAT_API_KEY=your_api_key_here
```

> API anahtarı isteğe bağlıdır — uygulamanın tüm özellikleri anahtar olmadan da çalışır. Ücretsiz anahtar için: [thecatapi.com](https://thecatapi.com)

---

## 📁 Klasör Yapısı

```
src/
├── api/
│   ├── catApi.ts          # TheCatAPI entegrasyonu
│   └── translateApi.ts    # Çeviri API'ları + önbellekleme
├── components/
│   ├── BreedCard.tsx      # Izgara kartı (favori + karşılaştırma butonları)
│   ├── ComparisonBar.tsx  # Floating karşılaştırma çubuğu
│   ├── FilterBar.tsx      # Filtre pilleri + sıralama seçici
│   ├── HeroSlideshow.tsx  # Ana sayfa arka plan slayt gösterisi
│   ├── LazyImage.tsx      # Intersection Observer ile lazy loading
│   ├── Navbar.tsx         # Navigasyon + dil değiştirici
│   ├── SearchBar.tsx      # Autocomplete arama
│   ├── SkeletonCard.tsx   # Yükleme iskelet animasyonu
│   └── StatBar.tsx        # İstatistik çubuğu
├── hooks/
│   └── useInfiniteScroll.ts  # Intersection Observer infinite scroll
├── i18n/
│   ├── countryNames.ts    # Ülke adı çevirileri
│   ├── temperamentMap.ts  # Mizaç ifadesi çevirileri
│   ├── translations.ts    # TR/EN metin dizileri
│   └── useT.ts            # Çeviri hook'u
├── pages/
│   ├── BreedDetailPage.tsx  # Irk detay sayfası
│   ├── CarePage.tsx         # Bakım rehberi
│   ├── ComparisonPage.tsx   # Irk karşılaştırma
│   ├── FavoritesPage.tsx    # Favoriler
│   ├── HomePage.tsx         # Ana sayfa (katalog)
│   └── QuizPage.tsx         # Kedi ırkı testi
├── store/
│   ├── breedsSlice.ts       # Irk verisi + yükleme durumu
│   ├── comparisonSlice.ts   # Karşılaştırma seçimi (maks. 3)
│   ├── favoritesSlice.ts    # Favoriler (localStorage)
│   ├── filtersSlice.ts      # Arama · filtre · sıralama durumu
│   ├── languageSlice.ts     # Dil tespiti + değiştirme
│   └── hooks.ts             # Typed dispatch/selector hook'ları
└── types/
    └── cat.ts               # Breed, CatImage TypeScript arayüzleri
```

---

## 📸 Ekran Görüntüleri

| Ana Sayfa | Irk Detayı | Karşılaştırma |
|-----------|------------|---------------|
| Infinite scroll katalog | Fotoğraf galerisi + istatistikler | Yan yana stat tablosu |

| Test | Favoriler | Bakım Rehberi |
|------|-----------|---------------|
| 4 soruluk eşleştirme | Sıralama + istatistik | 6 bölüm kılavuz |

---

## 📄 Lisans

MIT — Dilediğiniz gibi kullanabilir, değiştirebilir ve dağıtabilirsiniz.

---

<div align="center">
  Veriler <a href="https://thecatapi.com">TheCatAPI</a> tarafından sağlanmaktadır 🐾
</div>
