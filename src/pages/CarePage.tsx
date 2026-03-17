import { useAppSelector } from '../store/hooks'
import { Link } from 'react-router-dom'

interface Section {
  icon: string
  title: string
  color: string
  items: { icon: string; title: string; desc: string }[]
}

interface PageContent {
  hero_title: string
  hero_subtitle: string
  hero_desc: string
  checklist_title: string
  checklist_items: { ok: boolean; text: string }[]
  sections: Section[]
  dangers_title: string
  dangers: { icon: string; name: string }[]
  tips_title: string
  tips: { icon: string; text: string }[]
  cta_title: string
  cta_desc: string
  cta_btn: string
}

const CONTENT: Record<'tr' | 'en', PageContent> = {
  tr: {
    hero_title: 'Kedi Bakım Rehberi',
    hero_subtitle: 'Kedi sahibi olmak büyük bir sorumluluktur — ama o minik pençelerin değeri paha biçilemez.',
    hero_desc: 'İlk kez kedi sahiplenecekler için hazırladığımız bu rehber; beslenme, sağlık, tüy bakımı ve daha fazlasını kapsamaktadır.',
    checklist_title: 'Sahiplenmeye Hazır mısın?',
    checklist_items: [
      { ok: true, text: 'Kedi için yeterli zaman ayırabilecek misin?' },
      { ok: true, text: 'Veteriner masraflarını karşılayabilir misin?' },
      { ok: true, text: 'Evde alerjisi olan biri var mı? (Hipoalerjenik ırkları incele)' },
      { ok: true, text: 'Kiracı isen ev sahibinin onayını aldın mı?' },
      { ok: true, text: 'Tatilde veya dışarıdayken bakıcı ayarlayabilecek misin?' },
      { ok: true, text: 'Evindeki diğer evcillerle uyum sağlayabilir mi?' },
    ],
    sections: [
      {
        icon: '🏡',
        title: 'Evi Hazırlama',
        color: 'bg-yellow-50 border-yellow-200',
        items: [
          {
            icon: '🚪',
            title: 'Güvenli Alan Oluştur',
            desc: 'Kediyi eve getirmeden önce balkon ve pencere kapamalarını kontrol et. Açık kablolar ve küçük yutulabilir nesneleri uzaklaştır.',
          },
          {
            icon: '🪴',
            title: 'Zehirli Bitkileri Kaldır',
            desc: 'Zamioculcas, Lily, Pothos, Aloe Vera gibi bitkiler kediler için zehirlidir. Bunları ulaşılamaz yere al veya evden çıkar.',
          },
          {
            icon: '📦',
            title: 'Adaptasyon Odası',
            desc: 'İlk birkaç gün için küçük, sakin bir oda ayır. Kedi ortamı tanıdıkça kendi isteğiyle keşfetsin — zorlamadan.',
          },
          {
            icon: '🛁',
            title: 'Kum Kabı Konumu',
            desc: 'Kum kabını sessiz, gizli bir köşeye koy — hiçbir zaman mama kabının yanına. En az bir tane fazlası olsun (kedi sayısı + 1 kural).',
          },
        ],
      },
      {
        icon: '🛒',
        title: 'Temel Malzemeler',
        color: 'bg-orange-50 border-orange-200',
        items: [
          {
            icon: '🥣',
            title: 'Mama & Su Kabı',
            desc: 'Paslanmaz çelik veya seramik tercih et — plastik kablar bakteri barındırabilir. Su kabını mamadan uzak tut.',
          },
          {
            icon: '🪣',
            title: 'Kapalı Kum Kabı',
            desc: 'Kapalı modeller kokuyu daha iyi hapseder. Günde en az bir kez temizle; haftada bir tam dezenfeksiyon yap.',
          },
          {
            icon: '🪵',
            title: 'Tırmalama Tahtası',
            desc: 'Kediler tırmalama ihtiyacıyla doğar — engelleyemezsin, yönlendirebilirsin. Hem yatay hem dikey seçenekler sun.',
          },
          {
            icon: '🧸',
            title: 'Oyuncaklar',
            desc: 'Tüy uçlu değnek, lazer pointer, tünel ve interaktif bulmaca oyuncakları ideal. Her oyuncağın birer saat "gözden uzak" kalması ilgiyi canlı tutar.',
          },
          {
            icon: '🛏️',
            title: 'Yatak & Yuva',
            desc: 'Yüksek ve kapalı yerler kedilerin favorisi — duvara monte raf veya çok katlı kedi ağacı mükemmel bir tercih.',
          },
          {
            icon: '🎒',
            title: 'Taşıma Çantası',
            desc: 'İlk günden itibaren taşıma çantasını yaşam alanına bırak; içine atıştırmalık ve battaniye koy. Veteriner anksiyetesini önemli ölçüde azaltır.',
          },
        ],
      },
      {
        icon: '🍽️',
        title: 'Beslenme',
        color: 'bg-green-50 border-green-200',
        items: [
          {
            icon: '🐾',
            title: 'Yaşa Göre Mama',
            desc: 'Yavru (0–1 yaş), yetişkin (1–7 yaş) ve yaşlı (7+ yaş) için ayrı formüller var. Doğru formülü kullanmak uzun vadede büyük fark yaratır.',
          },
          {
            icon: '💧',
            title: 'Sürekli Taze Su',
            desc: 'Kediler az su içer — bu idrar yolu sorunlarına yol açabilir. Çeşme tipi su kabları tüketimi %70\'e kadar artırabilir.',
          },
          {
            icon: '🥫',
            title: 'Islak Mama Avantajları',
            desc: 'Islak mama %70–80 su içerir, böbreği destekler. İdeal kombinasyon: sabah ıslak, akşam kuru. Her gün aynı saatte ver.',
          },
          {
            icon: '⚖️',
            title: 'Porsiyon Kontrolü',
            desc: 'Kedi obezitesi eklem sorunlarına, diyabete ve karaciğer hastalığına yol açar. Mama kutusundaki porsiyon rehberini referans al; kedini asla aç bırakma ama "serbest besleme" de yapma.',
          },
        ],
      },
      {
        icon: '🩺',
        title: 'Sağlık & Veteriner',
        color: 'bg-blue-50 border-blue-200',
        items: [
          {
            icon: '💉',
            title: 'Temel Aşılar',
            desc: '8. haftadan itibaren: FPV, FHV-1, FCV üçlü aşısı. 12. haftada tekrar + kuduz. Yıllık hatırlatma dozları ihmal edilmemeli.',
          },
          {
            icon: '✂️',
            title: 'Kısırlaştırma',
            desc: '4–6 ay arasında kısırlaştırma önerilir. İstenmeyen doğumları önler, rahim kanseri ve agresif davranış riskini düşürür. Ömrü uzatır.',
          },
          {
            icon: '📡',
            title: 'Mikroçip',
            desc: 'Türkiye\'de zorunlu. Kaybolma durumunda tek güvenilir tanımlama yöntemi. Aşıyla aynı seansta yaptırılabilir.',
          },
          {
            icon: '🦟',
            title: 'Parazit Önlemi',
            desc: 'Aylık pire/kene damlası veya tasması uygula. Üç ayda bir iç parazit ilacı (dışarıya çıkan kedilerde aylık). Veterinere danışmadan ilaç kullanma.',
          },
          {
            icon: '🔍',
            title: 'Yıllık Kontrol',
            desc: 'Yılda bir genel muayene, diş kontrolü ve kan tahlili. 7 yaş üstü kedilerde 6 ayda bir muayene önerilir.',
          },
        ],
      },
      {
        icon: '✨',
        title: 'Tüy & Genel Bakım',
        color: 'bg-purple-50 border-purple-200',
        items: [
          {
            icon: '🪮',
            title: 'Tarama',
            desc: 'Kısa tüylüler haftada 1–2 kez, uzun tüylüler (Persian, Maine Coon) günlük taranmalı. Tüy yutma ve boğulma riskini azaltır.',
          },
          {
            icon: '🛁',
            title: 'Banyo',
            desc: 'Kediler genellikle kendi kendini temizler — gereksiz banyo stres yaratır. Sadece uzun tüylü veya hastalık durumlarında banyo gereklidir; kedi şampuanı kullan.',
          },
          {
            icon: '🦷',
            title: 'Diş Temizliği',
            desc: 'Diş eti hastalığı 3 yaş üstü kedilerin %70\'ini etkiler. Parmak fırçası veya kedi diş fırçasıyla haftada 2–3 kez fırçalamak idealdir.',
          },
          {
            icon: '👂',
            title: 'Kulak Kontrolü',
            desc: 'Haftada bir kulakları kontrol et. Koyu veya kötü kokulu akıntı varsa veterinere git — enfeksiyon veya uyuz olabilir.',
          },
          {
            icon: '💅',
            title: 'Tırnak Bakımı',
            desc: 'Her 2–3 haftada bir tırnak uçları kesilmeli. Yalnızca görünen beyaz kısmı kes — pembe damarı asla kesme. İlk kez veterinere göster.',
          },
        ],
      },
      {
        icon: '🎯',
        title: 'Oyun & Zihinsel Uyarım',
        color: 'bg-pink-50 border-pink-200',
        items: [
          {
            icon: '⏱️',
            title: 'Günlük Oyun Süresi',
            desc: 'Günde en az 2 × 15 dakika interaktif oyun. Özellikle akşam saatleri (kediler alacakaranlıkta avlanır). Yorulana kadar oyna, aniden bırakma — "yakalama" ile bitir.',
          },
          {
            icon: '🧩',
            title: 'Bulmaca Besleyici',
            desc: 'Mamasını normal kabı yerine bulmaca besleyicide ver. Hem zihni uyarır hem yeme hızını yavaşlatır — sindirime iyi gelir.',
          },
          {
            icon: '🪟',
            title: 'Pencere Erişimi',
            desc: 'Pencere önüne bir platform veya kedi yatağı koy. Dışarısını izlemek kediler için büyük bir uyarıcıdır — "kedi televizyonu" olarak da bilinir.',
          },
          {
            icon: '🏔️',
            title: 'Dikey Alan',
            desc: 'Kediler yukarıdan bakmayı sever — bu onlara güven verir. Kedi ağacı, duvara monte raflar veya yüksek dolap üstleri onların doğal alanıdır.',
          },
        ],
      },
    ],
    dangers_title: '⚠️ Kediler İçin Tehlikeli Olanlar',
    dangers: [
      { icon: '🌸', name: 'Lily (Zambak)' },
      { icon: '🍫', name: 'Çikolata' },
      { icon: '🧅', name: 'Soğan & Sarımsak' },
      { icon: '🍇', name: 'Üzüm & Kuru Üzüm' },
      { icon: '☕', name: 'Kafein' },
      { icon: '🥛', name: 'İnek Sütü' },
      { icon: '🍖', name: 'Çiğ Kemik' },
      { icon: '💊', name: 'İnsan İlaçları' },
      { icon: '🧴', name: 'Temizlik Ürünleri' },
      { icon: '🌿', name: 'Aloe Vera' },
      { icon: '🕯️', name: 'Uçucu Yağlar' },
      { icon: '🍬', name: 'Ksilitol (tatlandırıcı)' },
    ],
    tips_title: '💡 Altın Kurallar',
    tips: [
      { icon: '🤝', text: 'Sabır — her kedi farklı hızda adapte olur. İlk hafta seni görmezden gelebilir, bu normaldir.' },
      { icon: '🔇', text: 'Asla bağırarak veya fiziksel müdahaleyle ceza verme. Korkuya dayalı eğitim kalıcı hasar bırakır.' },
      { icon: '🍗', text: 'Pozitif pekiştirme: istediğin davranışı anında ödüllendir. Küçük mama parçaları en iyi motivasyon aracıdır.' },
      { icon: '📅', text: 'Rutin hayat kurtarır — aynı saatte beslenme, oyun ve uyku kedinin stresini dramatik şekilde azaltır.' },
      { icon: '🐱', text: 'İkinci bir kedi düşünüyorsan: sosyalizasyon en kolay 8–16 haftalık dönemde yapılır.' },
      { icon: '📸', text: 'Değişiklikleri fark et — yemek yememek, aşırı uyumak veya davranış değişikliği veterinere gitme sinyalidir.' },
    ],
    cta_title: 'Hangi Irk Sana Uygun?',
    cta_desc: '4 soruluk testimizle sana en uygun kedi ırkını bulalım.',
    cta_btn: 'Testi Başlat',
  },

  en: {
    hero_title: 'Cat Care Guide',
    hero_subtitle: 'Owning a cat is a big responsibility — but those tiny paws are priceless.',
    hero_desc: 'This guide covers everything first-time cat owners need to know: nutrition, health, grooming, and more.',
    checklist_title: 'Are You Ready to Adopt?',
    checklist_items: [
      { ok: true, text: 'Can you dedicate enough time to a cat every day?' },
      { ok: true, text: 'Can you cover veterinary expenses?' },
      { ok: true, text: 'Does anyone in your household have allergies? (Check hypoallergenic breeds)' },
      { ok: true, text: 'If you\'re renting, do you have your landlord\'s permission?' },
      { ok: true, text: 'Can you arrange a sitter when you travel?' },
      { ok: true, text: 'Will it get along with other pets you have?' },
    ],
    sections: [
      {
        icon: '🏡',
        title: 'Preparing Your Home',
        color: 'bg-yellow-50 border-yellow-200',
        items: [
          {
            icon: '🚪',
            title: 'Cat-Proof Your Space',
            desc: 'Before bringing your cat home, check balcony and window safety. Remove exposed cables and small objects that could be swallowed.',
          },
          {
            icon: '🪴',
            title: 'Remove Toxic Plants',
            desc: 'Lilies, Pothos, Aloe Vera, and many common houseplants are toxic to cats. Move them out of reach or remove them entirely.',
          },
          {
            icon: '📦',
            title: 'Adaptation Room',
            desc: 'Set aside a small, quiet room for the first few days. Let the cat explore on its own terms — never force interaction.',
          },
          {
            icon: '🛁',
            title: 'Litter Box Placement',
            desc: 'Place the litter box in a quiet, private spot — never next to food bowls. Follow the rule: one box per cat, plus one extra.',
          },
        ],
      },
      {
        icon: '🛒',
        title: 'Essential Supplies',
        color: 'bg-orange-50 border-orange-200',
        items: [
          {
            icon: '🥣',
            title: 'Food & Water Bowls',
            desc: 'Choose stainless steel or ceramic — plastic can harbor bacteria. Keep the water bowl away from the food bowl.',
          },
          {
            icon: '🪣',
            title: 'Covered Litter Box',
            desc: 'Covered boxes contain odors better. Scoop at least once daily; do a full disinfection weekly.',
          },
          {
            icon: '🪵',
            title: 'Scratching Post',
            desc: 'Scratching is instinctual — you can\'t stop it, only redirect it. Offer both horizontal and vertical options.',
          },
          {
            icon: '🧸',
            title: 'Toys',
            desc: 'Feather wands, laser pointers, tunnels, and puzzle feeders are ideal. Rotating toys keeps interest high.',
          },
          {
            icon: '🛏️',
            title: 'Bed & Perch',
            desc: 'Cats love high, enclosed spaces. A wall-mounted shelf or multi-level cat tree is a perfect choice.',
          },
          {
            icon: '🎒',
            title: 'Carrier',
            desc: 'Leave the carrier out from day one with a treat and blanket inside. This dramatically reduces vet anxiety.',
          },
        ],
      },
      {
        icon: '🍽️',
        title: 'Nutrition',
        color: 'bg-green-50 border-green-200',
        items: [
          {
            icon: '🐾',
            title: 'Age-Appropriate Food',
            desc: 'Use kitten (0–1yr), adult (1–7yr), or senior (7+yr) formulas. Using the right formula makes a significant long-term difference.',
          },
          {
            icon: '💧',
            title: 'Fresh Water Always',
            desc: 'Cats are poor drinkers — this can lead to urinary issues. Fountain-style bowls can increase water intake by up to 70%.',
          },
          {
            icon: '🥫',
            title: 'Wet Food Benefits',
            desc: 'Wet food is 70–80% water, supporting kidney health. Ideal combo: wet food in the morning, dry at night.',
          },
          {
            icon: '⚖️',
            title: 'Portion Control',
            desc: 'Cat obesity leads to joint problems, diabetes, and liver disease. Use the food label as a guide. Never "free feed."',
          },
        ],
      },
      {
        icon: '🩺',
        title: 'Health & Vet Care',
        color: 'bg-blue-50 border-blue-200',
        items: [
          {
            icon: '💉',
            title: 'Core Vaccines',
            desc: 'Starting at 8 weeks: FPV, FHV-1, FCV combo. Booster at 12 weeks + rabies. Annual boosters are essential.',
          },
          {
            icon: '✂️',
            title: 'Spaying/Neutering',
            desc: 'Recommended between 4–6 months. Prevents unwanted litters, reduces cancer risk, and extends lifespan.',
          },
          {
            icon: '📡',
            title: 'Microchip',
            desc: 'The only reliable identification if your cat gets lost. Can be done in the same vet visit as vaccination.',
          },
          {
            icon: '🦟',
            title: 'Parasite Prevention',
            desc: 'Monthly flea/tick treatment. Deworming every 3 months (monthly for outdoor cats). Never use human medications.',
          },
          {
            icon: '🔍',
            title: 'Annual Checkup',
            desc: 'Yearly exam, dental check, and bloodwork. For cats over 7, every 6 months is recommended.',
          },
        ],
      },
      {
        icon: '✨',
        title: 'Grooming',
        color: 'bg-purple-50 border-purple-200',
        items: [
          {
            icon: '🪮',
            title: 'Brushing',
            desc: 'Short-haired cats: 1–2 times a week. Long-haired breeds (Persian, Maine Coon): daily. Reduces hairballs and shedding.',
          },
          {
            icon: '🛁',
            title: 'Bathing',
            desc: 'Cats are self-cleaning — unnecessary bathing causes stress. Only bathe if long-haired or medically necessary; use cat shampoo only.',
          },
          {
            icon: '🦷',
            title: 'Dental Care',
            desc: 'Gum disease affects 70% of cats over age 3. Brush with a finger brush 2–3 times a week to prevent buildup.',
          },
          {
            icon: '👂',
            title: 'Ear Checks',
            desc: 'Check ears weekly. Dark or foul-smelling discharge warrants a vet visit — could be infection or mites.',
          },
          {
            icon: '💅',
            title: 'Nail Trimming',
            desc: 'Trim every 2–3 weeks. Only clip the white tip — never cut the pink quick. Ask your vet to demonstrate first.',
          },
        ],
      },
      {
        icon: '🎯',
        title: 'Play & Enrichment',
        color: 'bg-pink-50 border-pink-200',
        items: [
          {
            icon: '⏱️',
            title: 'Daily Playtime',
            desc: 'At least 2 × 15 minutes of interactive play per day — especially in the evening. Always end with a "catch" so the cat feels satisfied.',
          },
          {
            icon: '🧩',
            title: 'Puzzle Feeders',
            desc: 'Serve meals in a puzzle feeder instead of a bowl. Stimulates the mind and slows eating — good for digestion.',
          },
          {
            icon: '🪟',
            title: 'Window Access',
            desc: 'Place a platform or cat bed by the window. Watching the outside world is a major source of stimulation — "cat TV."',
          },
          {
            icon: '🏔️',
            title: 'Vertical Space',
            desc: 'Cats feel safer when they can observe from above. Cat trees, wall shelves, or high cabinet tops are their natural territory.',
          },
        ],
      },
    ],
    dangers_title: '⚠️ Dangerous for Cats',
    dangers: [
      { icon: '🌸', name: 'Lilies' },
      { icon: '🍫', name: 'Chocolate' },
      { icon: '🧅', name: 'Onion & Garlic' },
      { icon: '🍇', name: 'Grapes & Raisins' },
      { icon: '☕', name: 'Caffeine' },
      { icon: '🥛', name: 'Cow\'s Milk' },
      { icon: '🍖', name: 'Raw Bones' },
      { icon: '💊', name: 'Human Medications' },
      { icon: '🧴', name: 'Cleaning Products' },
      { icon: '🌿', name: 'Aloe Vera' },
      { icon: '🕯️', name: 'Essential Oils' },
      { icon: '🍬', name: 'Xylitol (sweetener)' },
    ],
    tips_title: '💡 Golden Rules',
    tips: [
      { icon: '🤝', text: 'Be patient — every cat adapts at its own pace. Ignoring you the first week is completely normal.' },
      { icon: '🔇', text: 'Never punish with yelling or physical force. Fear-based training causes lasting psychological damage.' },
      { icon: '🍗', text: 'Use positive reinforcement: reward desired behavior immediately. Small food treats are the best motivator.' },
      { icon: '📅', text: 'Routine is everything — consistent feeding, play, and sleep times dramatically reduce your cat\'s stress.' },
      { icon: '🐱', text: 'If considering a second cat: socialization is easiest between 8–16 weeks of age.' },
      { icon: '📸', text: 'Notice changes — not eating, excessive sleeping, or behavior changes are signals to visit the vet.' },
    ],
    cta_title: 'Which Breed Suits You?',
    cta_desc: 'Take our 4-question quiz to find your perfect cat match.',
    cta_btn: 'Take the Quiz',
  },
}

export default function CarePage() {
  const lang = useAppSelector((s) => s.language.lang)
  const c = CONTENT[lang]

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

      {/* Hero */}
      <div className="rounded-2xl bg-gradient-to-br from-purr-500 to-purr-700 text-white px-6 py-7 mb-8 flex items-center gap-5">
        <span className="text-4xl shrink-0">🐱</span>
        <div>
          <h1 className="font-display text-2xl font-extrabold mb-1">{c.hero_title}</h1>
          <p className="text-white/75 text-sm leading-relaxed">{c.hero_subtitle}</p>
        </div>
      </div>

      {/* Checklist */}
      <div className="bg-white rounded-2xl border border-orange-100 shadow-sm p-6 mb-10">
        <h2 className="font-display text-xl font-bold text-gray-900 mb-5">{c.checklist_title}</h2>
        <div className="grid sm:grid-cols-2 gap-3">
          {c.checklist_items.map((item, i) => (
            <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-green-50 border border-green-100">
              <span className="text-green-500 mt-0.5 shrink-0">✓</span>
              <span className="text-sm text-gray-700">{item.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Main sections */}
      {c.sections.map((section) => (
        <div key={section.title} className="mb-10">
          <h2 className="font-display text-2xl font-bold text-gray-900 mb-5 flex items-center gap-2">
            <span>{section.icon}</span> {section.title}
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {section.items.map((item) => (
              <div
                key={item.title}
                className={`rounded-2xl border p-5 ${section.color}`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl">{item.icon}</span>
                  <h3 className="font-display font-bold text-gray-900">{item.title}</h3>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Dangers */}
      <div className="bg-red-50 border border-red-200 rounded-2xl p-6 mb-10">
        <h2 className="font-display text-xl font-bold text-red-800 mb-4">{c.dangers_title}</h2>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
          {c.dangers.map(({ icon, name }) => (
            <div
              key={name}
              className="flex flex-col items-center gap-1.5 bg-white rounded-xl p-3 border border-red-100 text-center"
            >
              <span className="text-2xl">{icon}</span>
              <span className="text-xs font-medium text-red-700 leading-tight">{name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Tips */}
      <div className="bg-white rounded-2xl border border-orange-100 shadow-sm p-6 mb-10">
        <h2 className="font-display text-xl font-bold text-gray-900 mb-5">{c.tips_title}</h2>
        <div className="space-y-3">
          {c.tips.map((tip, i) => (
            <div key={i} className="flex items-start gap-3 p-4 rounded-xl bg-orange-50 border border-orange-100">
              <span className="text-xl shrink-0">{tip.icon}</span>
              <p className="text-sm text-gray-700 leading-relaxed">{tip.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="rounded-2xl bg-purr-100 border border-purr-200 p-8 text-center">
        <div className="text-4xl mb-3">🎯</div>
        <h2 className="font-display text-2xl font-bold text-purr-900 mb-2">{c.cta_title}</h2>
        <p className="text-purr-700 mb-5">{c.cta_desc}</p>
        <Link to="/quiz" className="btn-primary">{c.cta_btn}</Link>
      </div>

    </div>
  )
}
