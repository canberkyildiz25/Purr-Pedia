const map: Record<string, string> = {
  // A
  Active: 'Aktif',
  Adaptable: 'Uyumlu',
  'Adaptable, Intelligent, Gentle': 'Uyumlu, Zeki, Nazik',
  Affectionate: 'Sevecen',
  Agile: 'Çevik',
  Alert: 'Uyanık',
  Amusing: 'Eğlenceli',
  Athletic: 'Atletik',
  // B
  Bold: 'Cesur',
  Bright: 'Parlak',
  // C
  Calm: 'Sakin',
  Cheerful: 'Neşeli',
  Clever: 'Zeki',
  Curious: 'Meraklı',
  // D
  Demanding: 'Talepkâr',
  Devoted: 'Sadık',
  Dignified: 'Vakur',
  Docile: 'Uysal',
  // E
  'Easy Going': 'Rahat',
  Energetic: 'Enerjik',
  'Even Tempered': 'Dengeli',
  // F
  Faithful: 'Vefalı',
  Fearless: 'Korkusuz',
  Friendly: 'Arkadaş Canlısı',
  // G
  Gentle: 'Nazik',
  Gregarious: 'Sosyal',
  // H
  Hardy: 'Dayanıklı',
  // I
  Independent: 'Bağımsız',
  Inquisitive: 'Sorgulayıcı',
  Intelligent: 'Zeki',
  Interactive: 'Etkileşimli',
  Inventive: 'Yaratıcı',
  // K
  Kind: 'Kibar',
  // L
  Lively: 'Canlı',
  Loving: 'Sevgi Dolu',
  Loyal: 'Sadık',
  // M
  Mellow: 'Yumuşak',
  Mild: 'Sakin',
  Mischievous: 'Yaramaz',
  // N
  Naughty: 'Afacan',
  // O
  Obedient: 'İtaatkâr',
  // P
  Patient: 'Sabırlı',
  Peaceful: 'Huzurlu',
  Playful: 'Oyuncu',
  Pleasant: 'Hoş',
  // Q
  Quiet: 'Sessiz',
  // R
  Responsive: 'Tepkili',
  // S
  Sassy: 'Cıvıl',
  'Self-assured': 'Kendinden Emin',
  Sensible: 'Duyarlı',
  Sensitive: 'Hassas',
  Shy: 'Çekingen',
  Silly: 'Sevimli Aptal',
  Smart: 'Akıllı',
  Social: 'Sosyal',
  Sociable: 'Sosyal',
  Sweet: 'Tatlı',
  // T
  Tender: 'Şefkatli',
  Territorial: 'Bölgeci',
  Trainable: 'Eğitilebilir',
  Trusting: 'Güvenen',
  // V
  Versatile: 'Çok Yönlü',
  Vigilant: 'Uyanık',
  Vivacious: 'Canlı',
  // W
  Warm: 'Sıcak',
}

export function translateTemperament(raw: string, lang: string): string {
  if (lang !== 'tr') return raw
  return raw
    .split(',')
    .map((t) => map[t.trim()] ?? t.trim())
    .join(', ')
}
