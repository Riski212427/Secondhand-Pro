import { UsedPhone, PhoneGrade, Completeness } from '../types';

import iphone15ProImg from '../assets/images/phone_iphone_15_pro_1792222089704.jpg';
import samsungS24UltraImg from '../assets/images/phone_samsung_s24_ultra_1792222090278.jpg';
import googlePixel8ProImg from '../assets/images/phone_google_pixel_8_pro_1792222090255.jpg';
import iphone13MidnightImg from '../assets/images/phone_iphone_13_midnight_1792222091821.jpg';

export const ADDITIONAL_SEED_PHONES: UsedPhone[] = [
  {
    id: 'ph-seed-01',
    brand: 'Apple',
    model: 'iPhone 15 Pro Max Natural Titanium',
    storage: '256GB',
    color: 'Natural Titanium',
    priceCash: 18900000,
    grade: 'Grade A+',
    gradeDescription: 'Like New 99% — Bodi titanium sempurna, kamera 5x telephoto jernih, skor 3uTools 100 hijau.',
    batteryHealth: 98,
    completeness: 'Fullset Original Box',
    warrantyDays: 90,
    imei: '359812049182390',
    imageUrl: iphone15ProImg,
    conditionNotes: ['Fisik 99% mulus terawat', 'BH 98% original', 'Ex garansi resmi iBox', 'Lengkap kabel C-to-C ori'],
    inStock: true,
    minDpPercent: 20,
  },
  {
    id: 'ph-seed-02',
    brand: 'Apple',
    model: 'iPhone 14 Pro Deep Purple',
    storage: '128GB',
    color: 'Deep Purple',
    priceCash: 12800000,
    grade: 'Grade A',
    gradeDescription: 'Mulus 95% — Baret sangat halus di port lightning wajar pemakaian, Dynamic Island & 120Hz normal.',
    batteryHealth: 88,
    completeness: 'Box OEM + Fast Charger',
    warrantyDays: 60,
    imei: '354910293847182',
    imageUrl: iphone13MidnightImg,
    conditionNotes: ['Face ID aktif cepat', 'Layar Super Retina XDR jernih', 'BH 88% awet seharian', 'Warna favorit Deep Purple'],
    inStock: true,
    minDpPercent: 15,
  },
  {
    id: 'ph-seed-03',
    brand: 'Apple',
    model: 'iPhone 12 Pro Pacific Blue',
    storage: '256GB',
    color: 'Pacific Blue',
    priceCash: 7850000,
    grade: 'Grade B',
    gradeDescription: 'Good 89% — Ada dent kecil di sudut bezel bawah, fungsi kamera & layar 100% normal tanpa kendala.',
    batteryHealth: 82,
    completeness: 'Unit Only (Batangan)',
    warrantyDays: 30,
    imei: '358192039481920',
    imageUrl: iphone13MidnightImg,
    conditionNotes: ['Harga hemat budget terjangkau', 'Kamera triple LiDAR sensor', 'Layar mulus no baret', 'Bonus fast charger 20W'],
    inStock: true,
    minDpPercent: 20,
  },
  {
    id: 'ph-seed-04',
    brand: 'Samsung',
    model: 'Galaxy S23 Ultra 5G Phantom Black',
    storage: '256GB',
    color: 'Phantom Black',
    priceCash: 13900000,
    grade: 'Grade A+',
    gradeDescription: 'Like New 98% — Kamera 200MP jernih, Snapdragon 8 Gen 2 for Galaxy kencang, S-Pen mulus.',
    batteryHealth: 95,
    completeness: 'Fullset Original Box',
    warrantyDays: 90,
    imei: '359182736451920',
    imageUrl: samsungS24UltraImg,
    conditionNotes: ['Garansi Resmi SEIN aktif', 'S-Pen responsif', 'Fisik 98% mulus bebas lecet', 'Baterai 5000mAh prima'],
    inStock: true,
    minDpPercent: 15,
  },
  {
    id: 'ph-seed-05',
    brand: 'Samsung',
    model: 'Galaxy Z Fold 5 5G Phantom Black',
    storage: '512GB',
    color: 'Phantom Black',
    priceCash: 15800000,
    grade: 'Grade A',
    gradeDescription: 'Mulus 96% — Engsel lipatan zero-gap mulus, layar lipat utama Dynamic AMOLED bersih tanpa lipatan berlebih.',
    batteryHealth: 93,
    completeness: 'Fullset Original Box',
    warrantyDays: 60,
    imei: '352918273645019',
    imageUrl: samsungS24UltraImg,
    conditionNotes: ['Layar ganda fleksibel multitasking', 'Engsel flex hinge kokoh', 'Fisik 96% terawat casing', 'Dukungan S-Pen Fold Edition'],
    inStock: true,
    minDpPercent: 20,
  },
  {
    id: 'ph-seed-06',
    brand: 'Google',
    model: 'Pixel 7 Pro Obsidian Black',
    storage: '128GB',
    color: 'Obsidian Black',
    priceCash: 7450000,
    grade: 'Grade B',
    gradeDescription: 'Good 88% — Ada baret halus pemakaian pada aluminium camera bar, layar dan sensor kamera 100% prima.',
    batteryHealth: 84,
    completeness: 'Unit Only (Batangan)',
    warrantyDays: 30,
    imei: '358291039481928',
    imageUrl: googlePixel8ProImg,
    conditionNotes: ['Kamera astrophotography jernih', 'Layar curved 120Hz mulus', 'IMEI resmi aman all operator', 'Unit batangan + charger 30W'],
    inStock: true,
    minDpPercent: 15,
  },
  {
    id: 'ph-seed-07',
    brand: 'Xiaomi',
    model: 'Xiaomi 13T Pro Dimensity 9200+',
    storage: '256GB',
    color: 'Meadow Green',
    priceCash: 5950000,
    grade: 'Grade A',
    gradeDescription: 'Mulus 95% — Kamera Leica Summicron 50MP, layar AMOLED 144Hz super smooth, baterai awet.',
    batteryHealth: 91,
    completeness: 'Box OEM + Fast Charger',
    warrantyDays: 60,
    imei: '861928374650192',
    imageUrl: googlePixel8ProImg,
    conditionNotes: ['HyperCharge 120W kilat', 'Lensa Leica authentic look', 'Fisik 95% sangat rapi', 'Performa gaming kencang'],
    inStock: true,
    minDpPercent: 15,
  }
];

// Helper Generator untuk membuat variasi produk secara dinamis
export function generateRandomUsedPhone(index: number): UsedPhone {
  const brands: ('Apple' | 'Samsung' | 'Google' | 'Xiaomi')[] = ['Apple', 'Samsung', 'Google', 'Xiaomi'];
  const brand = brands[index % brands.length];

  const grades: PhoneGrade[] = ['Grade A+', 'Grade A', 'Grade B'];
  const grade = grades[Math.floor(Math.random() * grades.length)];

  const completenessOptions: Completeness[] = [
    'Fullset Original Box',
    'Box OEM + Fast Charger',
    'Unit Only (Batangan)',
  ];
  const completeness = completenessOptions[Math.floor(Math.random() * completenessOptions.length)];

  // Battery health disesuaikan dengan grade
  let batteryHealth = 90;
  let gradeDescription = '';
  let warrantyDays = 60;

  if (grade === 'Grade A+') {
    batteryHealth = Math.floor(Math.random() * 6) + 95; // 95 - 100%
    gradeDescription = 'Like New 99% — Bodi mulus sempurna tanpa baret, semua part original teruji.';
    warrantyDays = 90;
  } else if (grade === 'Grade A') {
    batteryHealth = Math.floor(Math.random() * 8) + 87; // 87 - 94%
    gradeDescription = 'Mulus 95% — Baret sangat halus pemakaian wajar, layar dan mesin 100% sehat.';
    warrantyDays = 60;
  } else {
    batteryHealth = Math.floor(Math.random() * 7) + 80; // 80 - 86%
    gradeDescription = 'Good 88%–90% — Ada lecet pemakaian pada bezel, fungsi hardware 100% normal bergaransi.';
    warrantyDays = 30;
  }

  const storages = ['128GB', '256GB', '512GB'];
  const storage = storages[Math.floor(Math.random() * storages.length)];

  let model = '';
  let priceCash = 8500000;
  let imageUrl = iphone15ProImg;
  let color = 'Titanium Gray';

  if (brand === 'Apple') {
    const models = ['iPhone 15 Pro', 'iPhone 14 Plus', 'iPhone 13 Pro', 'iPhone 12 Pro Max'];
    model = `${models[index % models.length]} Pre-Owned`;
    priceCash = 8000000 + Math.floor(Math.random() * 9) * 1000000;
    imageUrl = index % 2 === 0 ? iphone15ProImg : iphone13MidnightImg;
    color = ['Natural Titanium', 'Midnight Black', 'Deep Purple', 'Sierra Blue'][index % 4];
  } else if (brand === 'Samsung') {
    const models = ['Galaxy S24 5G', 'Galaxy S23 FE', 'Galaxy S22 Ultra', 'Galaxy Z Flip 4'];
    model = `${models[index % models.length]} Pre-Owned`;
    priceCash = 6500000 + Math.floor(Math.random() * 8) * 1000000;
    imageUrl = samsungS24UltraImg;
    color = ['Titanium Violet', 'Cream', 'Phantom Black', 'Graphite'][index % 4];
  } else if (brand === 'Google') {
    const models = ['Pixel 8', 'Pixel 7 Pro', 'Pixel 7a', 'Pixel 6 Pro'];
    model = `${models[index % models.length]} Pure Android`;
    priceCash = 5500000 + Math.floor(Math.random() * 6) * 1000000;
    imageUrl = googlePixel8ProImg;
    color = ['Porcelain', 'Bay Blue', 'Hazel', 'Snow White'][index % 4];
  } else {
    const models = ['Xiaomi 14', 'Xiaomi 13T', 'Xiaomi 12 Pro', 'POCO F5 Pro'];
    model = `${models[index % models.length]} Flagship Second`;
    priceCash = 4500000 + Math.floor(Math.random() * 6) * 1000000;
    imageUrl = googlePixel8ProImg;
    color = ['Black', 'Alpine Blue', 'Silver', 'Cosmic Orange'][index % 4];
  }

  const randomImei = `35${Math.floor(1000000000000 + Math.random() * 9000000000000)}`;

  return {
    id: `ph-gen-${Date.now()}-${index}`,
    brand,
    model,
    storage,
    color,
    priceCash,
    grade,
    gradeDescription,
    batteryHealth,
    completeness,
    warrantyDays,
    imei: randomImei,
    imageUrl,
    conditionNotes: [
      `Fisik terverifikasi ${grade}`,
      `Kesehatan Baterai ${batteryHealth}%`,
      `Kelengkapan: ${completeness}`,
      `Garansi Toko ${warrantyDays} Hari`,
    ],
    inStock: true,
    minDpPercent: 15,
  };
}
