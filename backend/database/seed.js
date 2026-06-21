import bcrypt from 'bcrypt';
import db from '../src/config/db.js';

// Product image lists
const iphoneImages = [
  'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1678685888221-cda773a3dcdb?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=800&h=600&fit=crop'
];

const samsungImages = [
  'https://images.unsplash.com/photo-1610945265164-0e34e5519bbf?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1512499617640-c74ae3a79d37?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1472220654929-eac7c684267f?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&h=600&fit=crop'
];

const huaweiImages = [
  'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1485808191679-5f86510681a2?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&h=600&fit=crop'
];

const oppoImages = [
  'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1586953208448-b95a7b21085ab?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=600&fit=crop'
];

const products = [
  // Apple
  {
    name: 'iPhone 17 Pro Max',
    brand: 'Apple',
    description: "Apple's most capable iPhone, built around a 6.9-inch ProMotion display, the A19 Pro chip, and a triple 48MP camera system with up to 8x optical-quality zoom. Aerospace-grade titanium frame and Ceramic Shield 2 front glass make it as durable as it is powerful.",
    price: 1199.00,
    stock: 18,
    is_featured: true,
    specifications: {
      Display: '6.9" Super Retina XDR, ProMotion 120Hz',
      Chip: 'A19 Pro',
      RAM: '12GB',
      Storage: '256GB',
      'Rear Camera': '48MP Main + 48MP Ultra Wide + 48MP Telephoto (8x optical-quality zoom)',
      'Front Camera': '18MP Center Stage',
      Battery: 'Up to 33h video',
      Charging: 'USB-C, MagSafe',
      Build: 'Titanium, Ceramic Shield 2',
      OS: 'iOS 26',
      Colors: 'Black Titanium, White Titanium, Blue Titanium, Natural Titanium, Desert Titanium'
    },
    images: iphoneImages
  },
  {
    name: 'iPhone 17 Pro',
    brand: 'Apple',
    description: 'The Pro experience in a more compact form. 6.3-inch ProMotion display, A19 Pro chip, and the same triple 48MP camera system as the Pro Max, with a lighter titanium build that\'s easier to handle one-handed.',
    price: 1099.00,
    stock: 22,
    is_featured: true,
    specifications: {
      Display: '6.3" Super Retina XDR, ProMotion 120Hz',
      Chip: 'A19 Pro',
      RAM: '12GB',
      Storage: '256GB',
      'Rear Camera': '48MP Main + 48MP Ultra Wide + 48MP Telephoto',
      'Front Camera': '18MP Center Stage',
      Battery: 'Up to 27h video',
      Charging: 'USB-C, MagSafe',
      Build: 'Titanium, Ceramic Shield 2',
      OS: 'iOS 26',
      Colors: 'Black Titanium, White Titanium, Blue Titanium, Natural Titanium, Deep Purple'
    },
    images: iphoneImages
  },
  {
    name: 'iPhone Air',
    brand: 'Apple',
    description: "Apple's thinnest iPhone ever at just 5.64mm, built on a titanium-aluminum frame. Pairs a 6.5-inch ProMotion display and A19 Pro chip with a single 48MP Fusion camera for a remarkably light, all-day carry.",
    price: 999.00,
    stock: 15,
    is_featured: false,
    specifications: {
      Display: '6.5" Super Retina XDR, ProMotion 120Hz',
      Chip: 'A19 Pro',
      RAM: '10GB',
      Storage: '256GB',
      'Rear Camera': '48MP Fusion (single lens)',
      'Front Camera': '18MP Center Stage',
      Battery: 'Up to 27h video',
      Weight: '165g',
      Build: 'Titanium-aluminum',
      OS: 'iOS 26',
      Colors: 'Starlight, Midnight, Blue, Purple, (Product)RED'
    },
    images: iphoneImages
  },
  {
    name: 'iPhone 17',
    brand: 'Apple',
    description: "Apple's standard flagship for 2026, now with ProMotion across the whole lineup. 6.3-inch display, A19 chip, dual 48MP rear cameras, and the second-generation Camera Control button.",
    price: 799.00,
    stock: 30,
    is_featured: true,
    specifications: {
      Display: '6.3" Super Retina XDR, ProMotion 120Hz',
      Chip: 'A19',
      RAM: '8GB',
      Storage: '256GB',
      'Rear Camera': '48MP Main + 48MP Ultra Wide',
      'Front Camera': '18MP Center Stage',
      Battery: 'Up to 30h video',
      Charging: 'USB-C, 50% in 20 min',
      Build: 'Aluminum, Ceramic Shield 2',
      OS: 'iOS 26',
      Colors: 'Pink, Yellow, Green, Blue, Black'
    },
    images: iphoneImages
  },
  {
    name: 'iPhone 17e',
    brand: 'Apple',
    description: 'The most affordable way into the iPhone 17 generation. A19 chip, a 48MP Fusion camera with 2x optical-quality telephoto, and Apple Intelligence support in a familiar, compact 6.1-inch design.',
    price: 599.00,
    stock: 25,
    is_featured: false,
    specifications: {
      Display: '6.1" Super Retina XDR, 60Hz',
      Chip: 'A19',
      RAM: '8GB',
      Storage: '128GB',
      'Rear Camera': '48MP Fusion w/ 2x optical-quality telephoto',
      'Front Camera': '12MP TrueDepth',
      Battery: 'Up to 26h video',
      Build: 'Aluminum',
      OS: 'iOS 26',
      Colors: 'Starlight, Midnight, Blue, Purple, (Product)RED'
    },
    images: iphoneImages
  },
  {
    name: 'iPhone 16 Pro Max',
    brand: 'Apple',
    description: "Last year's top-tier Pro flagship, still a top performer with the A18 Pro chip, 6.9-inch ProMotion display, and a versatile triple-camera system with 5x optical zoom.",
    price: 1049.00,
    stock: 14,
    is_featured: false,
    specifications: {
      Display: '6.9" Super Retina XDR, ProMotion 120Hz',
      Chip: 'A18 Pro',
      RAM: '8GB',
      Storage: '256GB',
      'Rear Camera': '48MP Main + 48MP Ultra Wide + 12MP Telephoto (5x optical)',
      'Front Camera': '12MP TrueDepth',
      Battery: 'Up to 33h video',
      Build: 'Titanium',
      OS: 'iOS 26',
      Colors: 'Black Titanium, White Titanium, Blue Titanium, Natural Titanium, Desert Titanium'
    },
    images: iphoneImages
  },
  {
    name: 'iPhone 16 Pro',
    brand: 'Apple',
    description: 'Compact Pro power from the 2024 generation: A18 Pro chip, 6.3-inch ProMotion display, and the same camera system as the Pro Max in a more pocketable size.',
    price: 949.00,
    stock: 16,
    is_featured: false,
    specifications: {
      Display: '6.3" Super Retina XDR, ProMotion 120Hz',
      Chip: 'A18 Pro',
      RAM: '8GB',
      Storage: '256GB',
      'Rear Camera': '48MP Main + 48MP Ultra Wide + 12MP Telephoto',
      'Front Camera': '12MP TrueDepth',
      Battery: 'Up to 27h video',
      Build: 'Titanium',
      OS: 'iOS 26',
      Colors: 'Black Titanium, White Titanium, Blue Titanium, Natural Titanium, Deep Purple'
    },
    images: iphoneImages
  },
  {
    name: 'iPhone 16+',
    brand: 'Apple',
    description: 'A larger 6.7-inch take on the standard iPhone 16, with the A18 chip, dual 48MP cameras, and Apple Intelligence support, ideal for anyone who wants a big screen without going Pro.',
    price: 829.00,
    stock: 20,
    is_featured: false,
    specifications: {
      Display: '6.7" Super Retina XDR, 60Hz',
      Chip: 'A18',
      RAM: '8GB',
      Storage: '128GB',
      'Rear Camera': '48MP Main + 12MP Ultra Wide',
      'Front Camera': '12MP TrueDepth',
      Battery: 'Up to 27h video',
      Build: 'Aluminum',
      OS: 'iOS 26',
      Colors: 'Starlight, Midnight, Blue, Purple, (Product)RED'
    },
    images: iphoneImages
  },
  {
    name: 'iPhone 16',
    brand: 'Apple',
    description: "Apple's 2024 standard flagship, still excellent value with the A18 chip, a 6.1-inch display, dual 48MP cameras, and a dedicated Camera Control button.",
    price: 699.00,
    stock: 28,
    is_featured: true,
    specifications: {
      Display: '6.1" Super Retina XDR, 60Hz',
      Chip: 'A18',
      RAM: '8GB',
      Storage: '128GB',
      'Rear Camera': '48MP Main + 12MP Ultra Wide',
      'Front Camera': '12MP TrueDepth',
      Battery: 'Up to 22h video',
      Build: 'Aluminum',
      OS: 'iOS 26',
      Colors: 'Pink, Yellow, Green, Blue, Black'
    },
    images: iphoneImages
  },
  {
    name: 'iPhone 16e',
    brand: 'Apple',
    description: 'An affordable entry point with the A18 chip and Apple Intelligence support, replacing the old SE line with a modern edge-to-edge display and a single 48MP camera.',
    price: 499.00,
    stock: 24,
    is_featured: false,
    specifications: {
      Display: '6.1" Super Retina XDR, 60Hz',
      Chip: 'A18',
      RAM: '8GB',
      Storage: '128GB',
      'Rear Camera': '48MP Fusion (single lens)',
      'Front Camera': '12MP TrueDepth',
      Battery: 'Up to 26h video',
      Build: 'Aluminum',
      OS: 'iOS 26',
      Colors: 'Starlight, Midnight, Blue, Purple, (Product)RED'
    },
    images: iphoneImages
  },
  {
    name: 'iPhone 15 Pro Max',
    brand: 'Apple',
    description: "A still-capable previous-generation Pro flagship with a titanium frame, A17 Pro chip, and a 5x telephoto camera — a strong value pick for anyone not chasing the absolute newest chip.",
    price: 899.00,
    stock: 10,
    is_featured: false,
    specifications: {
      Display: '6.7" Super Retina XDR, ProMotion 120Hz',
      Chip: 'A17 Pro',
      RAM: '8GB',
      Storage: '256GB',
      'Rear Camera': '48MP Main + 12MP Ultra Wide + 12MP Telephoto (5x optical)',
      'Front Camera': '12MP TrueDepth',
      Battery: 'Up to 29h video',
      Build: 'Titanium',
      OS: 'iOS 26',
      Colors: 'Black Titanium, White Titanium, Blue Titanium, Natural Titanium'
    },
    images: iphoneImages
  },
  {
    name: 'iPhone 15',
    brand: 'Apple',
    description: 'A dependable mid-cycle flagship with Dynamic Island, a 48MP main camera, and USB-C, offering most of the modern iPhone experience at an accessible price.',
    price: 599.00,
    stock: 17,
    is_featured: false,
    specifications: {
      Display: '6.1" Super Retina XDR, 60Hz',
      Chip: 'A16 Bionic',
      RAM: '6GB',
      Storage: '128GB',
      'Rear Camera': '48MP Main + 12MP Ultra Wide',
      'Front Camera': '12MP TrueDepth',
      Battery: 'Up to 20h video',
      Build: 'Aluminum',
      OS: 'iOS 26',
      Colors: 'Pink, Yellow, Green, Blue, Black'
    },
    images: iphoneImages
  },
  {
    name: 'iPhone SE (3rd generation)',
    brand: 'Apple',
    description: "Apple's most compact and affordable current iPhone, pairing the classic Home button design with the A15 Bionic chip for fast, reliable everyday performance.",
    price: 429.00,
    stock: 12,
    is_featured: false,
    specifications: {
      Display: '4.7" Retina HD, 60Hz',
      Chip: 'A15 Bionic',
      RAM: '4GB',
      Storage: '64GB',
      'Rear Camera': '12MP single lens',
      'Front Camera': '7MP',
      Battery: 'Up to 15h video',
      Build: 'Aluminum and glass',
      OS: 'iOS 26',
      Colors: 'Starlight, Midnight, (Product)RED, Blue, Purple'
    },
    images: iphoneImages
  },

  // Samsung
  {
    name: 'Samsung Galaxy S26 Ultra',
    brand: 'Samsung',
    description: "Samsung's 2026 flagship powerhouse with a 6.9-inch anti-reflective display, the Snapdragon 8 Elite Gen 5 for Galaxy chip, and a 200MP main camera with an industry-first Privacy Display mode.",
    price: 1299.99,
    stock: 16,
    is_featured: true,
    specifications: {
      Display: '6.9" Dynamic AMOLED 2X, 120Hz, anti-reflective',
      Chip: 'Snapdragon 8 Elite Gen 5 for Galaxy',
      RAM: '12GB',
      Storage: '256GB',
      'Rear Camera': '200MP Main (f/1.4) + 50MP Telephoto + 50MP Ultra Wide + 10MP Telephoto',
      'Front Camera': '12MP',
      Battery: '5000mAh',
      Charging: '60W wired, 25W wireless',
      Build: 'Armor Aluminum, Gorilla Glass Armor 3, IP68',
      OS: 'Android 16, One UI 8.5',
      Colors: 'Phantom Black, Titanium Gray, Navy Blue, Burgundy, Cosmic Violet'
    },
    images: samsungImages
  },
  {
    name: 'Samsung Galaxy S26+',
    brand: 'Samsung',
    description: 'A larger-screened take on the 2026 Galaxy flagship, with the same Snapdragon 8 Elite Gen 5 for Galaxy chip, Galaxy AI features, and a refined camera bar design.',
    price: 999.99,
    stock: 20,
    is_featured: true,
    specifications: {
      Display: '6.7" Dynamic AMOLED 2X, 120Hz',
      Chip: 'Snapdragon 8 Elite Gen 5 for Galaxy',
      RAM: '12GB',
      Storage: '256GB',
      'Rear Camera': '50MP Main + 12MP Ultra Wide + 10MP Telephoto',
      'Front Camera': '12MP',
      Battery: '4900mAh',
      Charging: '45W wired, Qi2 wireless',
      Build: 'Armor Aluminum, Gorilla Glass Victus 2, IP68',
      OS: 'Android 16, One UI 8.5',
      Colors: 'Phantom Black, Titanium Gray, Navy Blue, Cream, Lavender'
    },
    images: samsungImages
  },
  {
    name: 'Samsung Galaxy S26',
    brand: 'Samsung',
    description: "The entry point into Samsung's 2026 flagship lineup, with a larger 6.3-inch display, a bigger 4300mAh battery, and the new Snapdragon 8 Elite Gen 5 for Galaxy chip.",
    price: 799.99,
    stock: 26,
    is_featured: false,
    specifications: {
      Display: '6.3" Dynamic AMOLED 2X, 120Hz',
      Chip: 'Snapdragon 8 Elite Gen 5 for Galaxy',
      RAM: '12GB',
      Storage: '256GB',
      'Rear Camera': '50MP Main + 12MP Ultra Wide + 10MP Telephoto',
      'Front Camera': '12MP',
      Battery: '4300mAh',
      Charging: '45W wired, Qi2 wireless',
      Build: 'Armor Aluminum, Gorilla Glass Victus 2, IP68',
      OS: 'Android 16, One UI 8.5',
      Colors: 'Phantom Black, Titanium Gray, Navy Blue, Cream, Mint Green'
    },
    images: samsungImages
  },
  {
    name: 'Samsung Galaxy S25 Ultra',
    brand: 'Samsung',
    description: "Last year's Ultra flagship remains a top-tier choice, with a 6.9-inch display, Snapdragon 8 Elite for Galaxy chip, and a versatile 200MP quad-camera system with built-in S Pen support.",
    price: 1099.00,
    stock: 14,
    is_featured: false,
    specifications: {
      Display: '6.9" Dynamic AMOLED 2X, 120Hz',
      Chip: 'Snapdragon 8 Elite for Galaxy',
      RAM: '12GB',
      Storage: '256GB',
      'Rear Camera': '200MP Main + 50MP Telephoto + 50MP Ultra Wide + 10MP Telephoto',
      'Front Camera': '12MP',
      Battery: '5000mAh',
      Charging: '45W wired',
      Build: 'Titanium, Gorilla Glass Armor, IP68',
      OS: 'Android 15, One UI 7',
      Colors: 'Phantom Black, Titanium Gray, Navy Blue, Burgundy, Cosmic Violet'
    },
    images: samsungImages
  },
  {
    name: 'Samsung Galaxy S25+',
    brand: 'Samsung',
    description: 'A balanced large-screen flagship from 2025, offering near-Ultra performance with the Snapdragon 8 Elite for Galaxy chip in a lighter, S Pen-free body.',
    price: 899.00,
    stock: 18,
    is_featured: false,
    specifications: {
      Display: '6.7" Dynamic AMOLED 2X, 120Hz',
      Chip: 'Snapdragon 8 Elite for Galaxy',
      RAM: '12GB',
      Storage: '256GB',
      'Rear Camera': '50MP Main + 12MP Ultra Wide + 10MP Telephoto',
      'Front Camera': '12MP',
      Battery: '4900mAh',
      Charging: '45W wired',
      Build: 'Aluminum, Gorilla Glass Victus 2, IP68',
      OS: 'Android 15, One UI 7',
      Colors: 'Phantom Black, Titanium Gray, Navy Blue, Cream, Lavender'
    },
    images: samsungImages
  },
  {
    name: 'Samsung Galaxy S25',
    brand: 'Samsung',
    description: "Samsung's compact 2025 flagship, with the Snapdragon 8 Elite for Galaxy chip and Galaxy AI features packed into a comfortable 6.2-inch body.",
    price: 699.00,
    stock: 24,
    is_featured: true,
    specifications: {
      Display: '6.2" Dynamic AMOLED 2X, 120Hz',
      Chip: 'Snapdragon 8 Elite for Galaxy',
      RAM: '12GB',
      Storage: '128GB',
      'Rear Camera': '50MP Main + 12MP Ultra Wide + 10MP Telephoto',
      'Front Camera': '12MP',
      Battery: '4000mAh',
      Charging: '25W wired',
      Build: 'Aluminum, Gorilla Glass Victus 2, IP68',
      OS: 'Android 15, One UI 7',
      Colors: 'Phantom Black, Titanium Gray, Navy Blue, Cream, Mint Green'
    },
    images: samsungImages
  },
  {
    name: 'Samsung Galaxy Z Fold 7',
    brand: 'Samsung',
    description: "Samsung's thinnest foldable yet, opening to an 8-inch immersive display while remaining pocketable closed, powered by the Snapdragon 8 Elite for Galaxy and a versatile triple-camera system.",
    price: 1899.99,
    stock: 8,
    is_featured: false,
    specifications: {
      Display: '8.0" foldable Dynamic AMOLED 2X (main), 6.5" cover',
      Chip: 'Snapdragon 8 Elite for Galaxy',
      RAM: '16GB',
      Storage: '512GB',
      'Rear Camera': '200MP Main + 12MP Ultra Wide + 10MP Telephoto',
      'Front Camera': '10MP (cover) + 4MP (under-display)',
      Battery: '4400mAh',
      Build: 'Titanium hinge, Armor Aluminum, IP48',
      OS: 'Android 15, One UI 7',
      Colors: 'Phantom Black, Silver, Navy Blue, Burgundy, Forest Green'
    },
    images: samsungImages
  },
  {
    name: 'Samsung Galaxy Z Flip 7',
    brand: 'Samsung',
    description: 'A compact clamshell foldable with a large external cover screen for quick interactions, the Snapdragon 8 Elite for Galaxy chip, and Flex Mode for hands-free use.',
    price: 1099.99,
    stock: 11,
    is_featured: false,
    specifications: {
      Display: '6.9" foldable Dynamic AMOLED 2X (main), 4.1" cover',
      Chip: 'Snapdragon 8 Elite for Galaxy',
      RAM: '12GB',
      Storage: '256GB',
      'Rear Camera': '50MP Main + 12MP Ultra Wide',
      'Front Camera': '10MP',
      Battery: '4300mAh',
      Build: 'Armor Aluminum, IP48',
      OS: 'Android 15, One UI 7',
      Colors: 'Phantom Black, Silver, Navy Blue, Cream, Lavender'
    },
    images: samsungImages
  },
  {
    name: 'Samsung Galaxy A56',
    brand: 'Samsung',
    description: 'A well-rounded mid-range Galaxy with a large AMOLED display, a versatile triple-camera setup, and Samsung\'s promise of long-term software support at an accessible price.',
    price: 449.00,
    stock: 32,
    is_featured: false,
    specifications: {
      Display: '6.7" Super AMOLED, 120Hz',
      Chip: 'Exynos 1580',
      RAM: '8GB',
      Storage: '256GB',
      'Rear Camera': '50MP Main + 8MP Ultra Wide + 5MP Macro',
      'Front Camera': '12MP',
      Battery: '5000mAh',
      Charging: '45W wired',
      Build: 'Plastic/glass hybrid, IP67',
      OS: 'Android 15, One UI 7',
      Colors: 'Awesome Graphite, Awesome White, Awesome Violet, Awesome Blue, Awesome Mint'
    },
    images: samsungImages
  },
  {
    name: 'Samsung Galaxy A36',
    brand: 'Samsung',
    description: 'A dependable budget-friendly Galaxy with a smooth 120Hz AMOLED display and a capable main camera, ideal for everyday use without flagship pricing.',
    price: 349.00,
    stock: 35,
    is_featured: false,
    specifications: {
      Display: '6.7" Super AMOLED, 120Hz',
      Chip: 'Snapdragon 6 Gen 3',
      RAM: '8GB',
      Storage: '128GB',
      'Rear Camera': '50MP Main + 8MP Ultra Wide + 2MP Macro',
      'Front Camera': '13MP',
      Battery: '5000mAh',
      Charging: '25W wired',
      Build: 'Plastic/glass hybrid, IP67',
      OS: 'Android 15, One UI 7',
      Colors: 'Awesome Graphite, Awesome White, Awesome Violet, Awesome Blue, Awesome Mint'
    },
    images: samsungImages
  },
  {
    name: 'Samsung Galaxy A26',
    brand: 'Samsung',
    description: 'An entry-level Galaxy offering a large display and solid battery life for essential smartphone use, backed by Samsung\'s reliable software experience.',
    price: 279.00,
    stock: 30,
    is_featured: false,
    specifications: {
      Display: '6.6" Super AMOLED, 90Hz',
      Chip: 'MediaTek Dimensity 6300',
      RAM: '6GB',
      Storage: '128GB',
      'Rear Camera': '50MP Main + 5MP Ultra Wide + 2MP Macro',
      'Front Camera': '13MP',
      Battery: '5000mAh',
      Charging: '25W wired',
      Build: 'Plastic/glass hybrid, IP54',
      OS: 'Android 15, One UI 7',
      Colors: 'Awesome Graphite, Awesome White, Awesome Violet, Awesome Blue, Awesome Mint'
    },
    images: samsungImages
  },
  {
    name: 'Samsung Galaxy XCover 7',
    brand: 'Samsung',
    description: 'A rugged, mil-spec durable Galaxy built for physically demanding environments, with a replaceable battery and a Programmable Key for fast access to work apps.',
    price: 499.00,
    stock: 9,
    is_featured: false,
    specifications: {
      Display: '6.6" PLS LCD, 90Hz',
      Chip: 'Exynos 1380',
      RAM: '6GB',
      Storage: '128GB',
      'Rear Camera': '50MP Main + 8MP Ultra Wide',
      'Front Camera': '13MP',
      Battery: '4050mAh (removable)',
      Build: 'Reinforced polycarbonate, MIL-STD-810H, IP68',
      OS: 'Android 14, One UI 6.1',
      Colors: 'Black, Dark Gray, Navy, Green, Brown'
    },
    images: samsungImages
  },
  {
    name: 'Samsung Galaxy M36',
    brand: 'Samsung',
    description: 'A value-focused Galaxy with a massive battery and a smooth AMOLED display, designed for buyers who want all-day endurance above all else.',
    price: 249.00,
    stock: 28,
    is_featured: false,
    specifications: {
      Display: '6.7" Super AMOLED, 120Hz',
      Chip: 'MediaTek Dimensity 7300',
      RAM: '8GB',
      Storage: '128GB',
      'Rear Camera': '50MP Main + 8MP Ultra Wide + 2MP Macro',
      'Front Camera': '13MP',
      Battery: '6000mAh',
      Charging: '25W wired',
      Build: 'Plastic/glass hybrid, IP54',
      OS: 'Android 15, One UI 7',
      Colors: 'Black, Dark Gray, Blue, Green, Purple'
    },
    images: samsungImages
  },

  // Huawei
  {
    name: 'Huawei Pura 80 Ultra',
    brand: 'Huawei',
    description: "Huawei's imaging flagship, built around a 1-inch RYYB main sensor and a dual telephoto system, finished in Kunlun Glass 2nd Generation for class-leading drop resistance.",
    price: 1450.00,
    stock: 9,
    is_featured: true,
    specifications: {
      Display: '6.82" LTPO AMOLED, 120Hz',
      Chip: 'Kirin 9500',
      RAM: '16GB',
      Storage: '512GB',
      'Rear Camera': '50MP Main (1-inch RYYB) + Dual Telephoto + Ultra Wide',
      'Front Camera': '13MP',
      Battery: '5100mAh',
      Charging: '100W wired SuperCharge, 50W wireless',
      Build: 'Kunlun Glass 2nd Gen, IP68/IP69',
      OS: 'HarmonyOS 6',
      Colors: 'Black, White, Blue, Gold, Green'
    },
    images: huaweiImages
  },
  {
    name: 'Huawei Pura 80 Pro',
    brand: 'Huawei',
    description: 'A slightly more compact Pura 80 with the same Ultra Chroma XMAGE imaging philosophy, fast 66W SuperCharge wired charging, and Huawei\'s signature build quality.',
    price: 1199.00,
    stock: 13,
    is_featured: true,
    specifications: {
      Display: '6.78" LTPO AMOLED, 120Hz',
      Chip: 'Kirin 9500',
      RAM: '12GB',
      Storage: '256GB',
      'Rear Camera': '50MP Main + 48MP Telephoto + 40MP Ultra Wide',
      'Front Camera': '13MP',
      Battery: '5100mAh',
      Charging: '66W wired SuperCharge, 50W wireless',
      Build: 'Kunlun Glass 2nd Gen, IP68',
      OS: 'HarmonyOS 6',
      Colors: 'Black, White, Blue, Gold, Pink'
    },
    images: huaweiImages
  },
  {
    name: 'Huawei Pura 80',
    brand: 'Huawei',
    description: 'The standard Pura 80, bringing Full Focal HD Photography and Super Macro to a more accessible price point without sacrificing Huawei\'s signature camera tuning.',
    price: 999.00,
    stock: 19,
    is_featured: false,
    specifications: {
      Display: '6.67" AMOLED, 120Hz',
      Chip: 'Kirin 9400',
      RAM: '12GB',
      Storage: '256GB',
      'Rear Camera': '50MP Main + 12MP Ultra Wide + 8MP Telephoto',
      'Front Camera': '13MP',
      Battery: '5000mAh',
      Charging: '66W wired SuperCharge, 50W wireless',
      Build: 'Kunlun Glass 2nd Gen, IP68',
      OS: 'HarmonyOS 6',
      Colors: 'Black, White, Blue, Gold, Green'
    },
    images: huaweiImages
  },
  {
    name: 'Huawei Mate 70 Pro+',
    brand: 'Huawei',
    description: 'The top-of-line Mate flagship combining satellite connectivity, a large curved OLED display, and Huawei\'s most advanced camera array for power users and professionals.',
    price: 1399.00,
    stock: 8,
    is_featured: false,
    specifications: {
      Display: '6.82" LTPO AMOLED, 120Hz curved',
      Chip: 'Kirin 9500',
      RAM: '16GB',
      Storage: '512GB',
      'Rear Camera': '50MP Main + 40MP Ultra Wide + 48MP Periscope Telephoto',
      'Front Camera': '13MP + 3D depth',
      Battery: '5500mAh',
      Charging: '100W wired, 50W wireless',
      Build: 'Nano-Tech Crystal Glass, IP68/IP69',
      OS: 'HarmonyOS 6',
      Colors: 'Black, White, Blue, Gold, Green'
    },
    images: huaweiImages
  },
  {
    name: 'Huawei Mate 70 Pro',
    brand: 'Huawei',
    description: 'A flagship-grade Mate device with a refined glass-and-metal design, strong battery life, and a versatile triple-camera system built for everyday excellence.',
    price: 1199.00,
    stock: 10,
    is_featured: false,
    specifications: {
      Display: '6.78" LTPO AMOLED, 120Hz',
      Chip: 'Kirin 9500',
      RAM: '12GB',
      Storage: '256GB',
      'Rear Camera': '50MP Main + 40MP Ultra Wide + 48MP Telephoto',
      'Front Camera': '13MP',
      Battery: '5300mAh',
      Charging: '100W wired, 50W wireless',
      Build: 'Glass back, aluminum frame, IP68',
      OS: 'HarmonyOS 6',
      Colors: 'Black, White, Blue, Gold, Green'
    },
    images: huaweiImages
  },
  {
    name: 'Huawei Mate 70',
    brand: 'Huawei',
    description: 'The standard Mate 70 keeps the series\' signature design language and solid performance while trimming the price relative to the Pro models.',
    price: 999.00,
    stock: 15,
    is_featured: false,
    specifications: {
      Display: '6.67" AMOLED, 120Hz',
      Chip: 'Kirin 9400',
      RAM: '12GB',
      Storage: '256GB',
      'Rear Camera': '50MP Main + 12MP Ultra Wide + 12MP Telephoto',
      'Front Camera': '13MP',
      Battery: '5100mAh',
      Charging: '66W wired, 50W wireless',
      Build: 'Glass back, aluminum frame, IP68',
      OS: 'HarmonyOS 6',
      Colors: 'Black, White, Blue, Gold, Green'
    },
    images: huaweiImages
  },
  {
    name: 'Huawei Nova 16 Pro',
    brand: 'Huawei',
    description: 'A design-focused mid-ranger with a curved AMOLED display and advanced portrait capabilities, aimed at style-conscious users.',
    price: 649.00,
    stock: 21,
    is_featured: false,
    specifications: {
      Display: '6.7" curved OLED, 120Hz',
      Chip: 'Snapdragon 7s Gen 3',
      RAM: '12GB',
      Storage: '256GB',
      'Rear Camera': '50MP Main + 8MP Ultra Wide + 2MP Macro',
      'Front Camera': '60MP Ultra-Wide Portrait',
      Battery: '5800mAh',
      Charging: '100W wired SuperCharge',
      Build: 'Glass back, plastic frame',
      OS: 'HarmonyOS 6',
      Colors: 'Black, White, Blue, Pink, Purple'
    },
    images: huaweiImages
  },
  {
    name: 'Huawei Nova 16',
    brand: 'Huawei',
    description: 'A balanced everyday device offering fast charging, a vivid OLED screen, and a capable main camera for users who want flagship-adjacent features at a mid-range price.',
    price: 549.00,
    stock: 25,
    is_featured: false,
    specifications: {
      Display: '6.67" OLED, 120Hz',
      Chip: 'Snapdragon 6 Gen 2',
      RAM: '8GB',
      Storage: '256GB',
      'Rear Camera': '50MP Main + 8MP Ultra Wide',
      'Front Camera': '32MP',
      Battery: '5600mAh',
      Charging: '66W wired SuperCharge',
      Build: 'Glass back, plastic frame',
      OS: 'HarmonyOS 6',
      Colors: 'Black, White, Blue, Pink, Green'
    },
    images: huaweiImages
  },
  {
    name: 'Huawei Nova 15 Pro',
    brand: 'Huawei',
    description: 'The previous generation Nova Pro, still offering strong performance and great portrait capabilities at a reduced price.',
    price: 599.00,
    stock: 23,
    is_featured: false,
    specifications: {
      Display: '6.78" AMOLED, 120Hz',
      Chip: 'Snapdragon 7s Gen 2',
      RAM: '12GB',
      Storage: '512GB',
      'Rear Camera': '50MP Main (OIS) + 8MP Ultra Wide + 50MP Telephoto',
      'Front Camera': '32MP',
      Battery: '6000mAh',
      Charging: '80W wired SuperCharge',
      Build: 'Glass back, aluminum frame, IP68/IP69',
      OS: 'HarmonyOS 5',
      Colors: 'Black, White, Blue, Pink, Purple'
    },
    images: huaweiImages
  },
  {
    name: 'Huawei Enjoy 70',
    brand: 'Huawei',
    description: 'An entry-level Huawei built for reliability and battery longevity, offering a large display and dependable everyday performance at a budget-friendly price.',
    price: 229.00,
    stock: 30,
    is_featured: false,
    specifications: {
      Display: '6.72" LCD, 90Hz',
      Chip: 'Snapdragon 680',
      RAM: '6GB',
      Storage: '128GB',
      'Rear Camera': '50MP Main + 2MP depth',
      'Front Camera': '8MP',
      Battery: '6000mAh',
      Charging: '22.5W wired',
      Build: 'Plastic body',
      OS: 'HarmonyOS 4',
      Colors: 'Black, White, Blue, Green, Red'
    },
    images: huaweiImages
  },
  {
    name: 'Huawei Nova Y91',
    brand: 'Huawei',
    description: 'A budget device with one of the largest batteries in its class, designed for buyers who prioritize multi-day endurance and a big, easy-to-use display.',
    price: 249.00,
    stock: 27,
    is_featured: false,
    specifications: {
      Display: '6.72" LCD, 90Hz',
      Chip: 'Snapdragon 680',
      RAM: '8GB',
      Storage: '128GB',
      'Rear Camera': '50MP Main + 8MP Ultra Wide + 2MP Macro',
      'Front Camera': '8MP',
      Battery: '6000mAh',
      Charging: '40W wired SuperCharge',
      Build: 'Plastic body',
      OS: 'HarmonyOS 4',
      Colors: 'Black, White, Blue, Green, Purple'
    },
    images: huaweiImages
  },

  // Oppo
  {
    name: 'Oppo Find X9 Ultra',
    brand: 'Oppo',
    description: "Oppo's imaging-first flagship, co-developed with Hasselblad and built around dual 200MP sensors for both the main and 3x telephoto cameras, with a 10x periscope lens completing the quad-camera array.",
    price: 1499.00,
    stock: 7,
    is_featured: true,
    specifications: {
      Display: '6.82" LTPO AMOLED, 120Hz, 3600 nits peak',
      Chip: 'Snapdragon 8 Elite Gen 5',
      RAM: '12GB',
      Storage: '512GB',
      'Rear Camera': '200MP Main + 200MP 3x Telephoto + 50MP Ultra Wide + 50MP Periscope Telephoto (10x optical)',
      'Front Camera': '32MP',
      Battery: 'Silicon-carbon, 6100mAh',
      Charging: '100W wired SUPERVOOC, 50W wireless AIRVOOC',
      Build: 'Glass and metal, IP68/IP69',
      OS: 'ColorOS 16',
      Colors: 'Black, White, Blue, Gold, Green'
    },
    images: oppoImages
  },
  {
    name: 'Oppo Find X9 Pro',
    brand: 'Oppo',
    description: 'A pro-level flagship with a 200MP Hasselblad telephoto camera supporting up to 120x super zoom, a massive 7500mAh silicon-carbon battery, and a customizable Snap Key.',
    price: 1099.00,
    stock: 12,
    is_featured: true,
    specifications: {
      Display: '6.78" LTPO AMOLED, 120Hz ProXDR',
      Chip: 'MediaTek Dimensity 9500',
      RAM: '16GB',
      Storage: '512GB',
      'Rear Camera': '50MP Ultra-Level Main + 50MP Ultra Wide + 200MP Hasselblad Telephoto',
      'Front Camera': '32MP autofocus',
      Battery: 'Silicon-carbon, 7500mAh',
      Charging: '80W wired SUPERVOOC, 50W wireless AIRVOOC',
      Build: 'Gorilla Glass Victus 2, IP68',
      OS: 'ColorOS 16',
      Colors: 'Black, White, Blue, Gold, Purple'
    },
    images: oppoImages
  },
  {
    name: 'Oppo Find X9',
    brand: 'Oppo',
    description: "The standard Find X9 brings the series' signature long battery life and Hasselblad-tuned cameras into a more accessible flagship package, powered by the Dimensity 9500.",
    price: 899.00,
    stock: 19,
    is_featured: false,
    specifications: {
      Display: '6.59" AMOLED, 120Hz',
      Chip: 'MediaTek Dimensity 9500',
      RAM: '12GB',
      Storage: '256GB',
      'Rear Camera': '50MP Main + 50MP Ultra Wide + 50MP Periscope Telephoto',
      'Front Camera': '32MP fixed-focus',
      Battery: 'Silicon-carbon, 7025mAh',
      Charging: '80W wired SUPERVOOC',
      Build: 'Gorilla Glass 7i',
      OS: 'ColorOS 16',
      Colors: 'Black, White, Blue, Green, Purple'
    },
    images: oppoImages
  },
  {
    name: 'Oppo Find X9s',
    brand: 'Oppo',
    description: 'A refreshed mid-cycle Find X9 variant launched globally for the first time, bringing Ultra-tier camera technology to a more compact, single-configuration flagship.',
    price: 949.00,
    stock: 11,
    is_featured: false,
    specifications: {
      Display: '6.59" AMOLED, 120Hz',
      Chip: 'Snapdragon 8 Elite Gen 5',
      RAM: '12GB',
      Storage: '256GB',
      'Rear Camera': '50MP Main + 50MP Ultra Wide + 50MP Telephoto',
      'Front Camera': '32MP',
      Battery: 'Silicon-carbon, 6800mAh',
      Charging: '80W wired SUPERVOOC',
      Build: 'Gorilla Glass Victus 2, IP68',
      OS: 'ColorOS 16',
      Colors: 'Black, White, Blue, Gold, Green'
    },
    images: oppoImages
  },
  {
    name: 'Oppo Reno 15 Pro',
    brand: 'Oppo',
    description: 'A design-forward mid-range flagship with a curved AMOLED display, strong portrait photography, and OPPO\'s fast SUPERVOOC charging in a slim, lightweight body.',
    price: 699.00,
    stock: 21,
    is_featured: false,
    specifications: {
      Display: '6.7" curved AMOLED, 120Hz',
      Chip: 'MediaTek Dimensity 8400',
      RAM: '12GB',
      Storage: '256GB',
      'Rear Camera': '50MP Main + 50MP Telephoto + 8MP Ultra Wide',
      'Front Camera': '50MP',
      Battery: '5800mAh',
      Charging: '80W wired SUPERVOOC',
      Build: 'Glass back, aluminum frame, IP68',
      OS: 'ColorOS 16',
      Colors: 'Black, White, Blue, Pink, Purple'
    },
    images: oppoImages
  },
  {
    name: 'Oppo Reno 15',
    brand: 'Oppo',
    description: 'A well-rounded mid-ranger that balances camera quality, battery life, and display fluidity, suited to everyday users who don\'t need flagship-tier specs.',
    price: 549.00,
    stock: 25,
    is_featured: false,
    specifications: {
      Display: '6.7" AMOLED, 120Hz',
      Chip: 'MediaTek Dimensity 8350',
      RAM: '8GB',
      Storage: '256GB',
      'Rear Camera': '50MP Main + 8MP Ultra Wide + 2MP Macro',
      'Front Camera': '32MP',
      Battery: '5600mAh',
      Charging: '80W wired SUPERVOOC',
      Build: 'Glass back, plastic frame, IP65',
      OS: 'ColorOS 16',
      Colors: 'Black, White, Blue, Green, Purple'
    },
    images: oppoImages
  },
  {
    name: 'Oppo Reno 14 Pro',
    brand: 'Oppo',
    description: "The previous-gen Reno Pro remains a strong performer, with a high-resolution 50MP main camera, optical image stabilization, and a 32MP selfie camera for content creators.",
    price: 599.00,
    stock: 23,
    is_featured: false,
    specifications: {
      Display: '6.78" AMOLED, 120Hz',
      Chip: 'MediaTek Dimensity 8350',
      RAM: '12GB',
      Storage: '512GB',
      'Rear Camera': '50MP Main (OIS) + 8MP Ultra Wide + 50MP Telephoto',
      'Front Camera': '32MP',
      Battery: '6000mAh',
      Charging: '80W wired SUPERVOOC',
      Build: 'Glass back, aluminum frame, IP68/IP69',
      OS: 'ColorOS 16',
      Colors: 'Black, White, Blue, Pink, Purple'
    },
    images: oppoImages
  },
  {
    name: 'Oppo Reno 14',
    brand: 'Oppo',
    description: 'A capable everyday Reno device offering Pro Mode manual photography controls, a smooth AMOLED display, and impressive multi-day battery life for moderate users.',
    price: 459.00,
    stock: 28,
    is_featured: false,
    specifications: {
      Display: '6.59" AMOLED, 120Hz',
      Chip: 'MediaTek Dimensity 7300 Energy',
      RAM: '8GB',
      Storage: '256GB',
      'Rear Camera': '50MP Main + 8MP Ultra Wide',
      'Front Camera': '32MP',
      Battery: '5500mAh',
      Charging: '80W wired SUPERVOOC',
      Build: 'Glass back, plastic frame, IP65',
      OS: 'ColorOS 16',
      Colors: 'Black, White, Blue, Green, Pink'
    },
    images: oppoImages
  },
  {
    name: 'Oppo A6 Pro',
    brand: 'Oppo',
    description: 'A rugged, durability-focused mid-ranger with military-grade drop resistance and a sizeable battery, aimed at buyers who want peace of mind alongside solid everyday specs.',
    price: 329.00,
    stock: 33,
    is_featured: false,
    specifications: {
      Display: '6.67" AMOLED, 120Hz',
      Chip: 'MediaTek Dimensity 6300',
      RAM: '8GB',
      Storage: '256GB',
      'Rear Camera': '50MP Main + 2MP depth',
      'Front Camera': '16MP',
      Battery: '6000mAh',
      Charging: '45W wired SUPERVOOC',
      Build: 'Reinforced frame, MIL-STD-810H, IP65',
      OS: 'ColorOS 16',
      Colors: 'Black, Dark Gray, Blue, Green, Brown'
    },
    images: oppoImages
  },
  {
    name: 'Oppo A5 Pro',
    brand: 'Oppo',
    description: 'An affordable, durable everyday device with a large battery and a clean ColorOS experience, designed to deliver dependable performance without a high price tag.',
    price: 269.00,
    stock: 30,
    is_featured: false,
    specifications: {
      Display: '6.67" LCD, 120Hz',
      Chip: 'MediaTek Dimensity 6300',
      RAM: '8GB',
      Storage: '128GB',
      'Rear Camera': '50MP Main + 2MP depth',
      'Front Camera': '8MP',
      Battery: '5800mAh',
      Charging: '45W wired SUPERVOOC',
      Build: 'Plastic frame, IP65',
      OS: 'ColorOS 16',
      Colors: 'Black, Dark Gray, Blue, Green, Purple'
    },
    images: oppoImages
  },
  {
    name: 'Oppo Reno 14 FS',
    brand: 'Oppo',
    description: 'A budget-friendly Reno variant focused on slim design and dependable daily performance, with a vivid AMOLED panel and solid camera versatility for the price.',
    price: 399.00,
    stock: 24,
    is_featured: false,
    specifications: {
      Display: '6.57" AMOLED, 120Hz',
      Chip: 'MediaTek Dimensity 7300',
      RAM: '8GB',
      Storage: '256GB',
      'Rear Camera': '50MP Main + 2MP depth',
      'Front Camera': '32MP',
      Battery: '5200mAh',
      Charging: '45W wired SUPERVOOC',
      Build: 'Glass back, plastic frame, IP54',
      OS: 'ColorOS 16',
      Colors: 'Black, White, Blue, Green, Purple'
    },
    images: oppoImages
  },
  {
    name: 'Oppo A3x',
    brand: 'Oppo',
    description: "Oppo's entry-level offering for budget-conscious buyers, with a large display and basic dual-camera setup covering essential smartphone needs.",
    price: 179.00,
    stock: 35,
    is_featured: false,
    specifications: {
      Display: '6.56" LCD, 90Hz',
      Chip: 'MediaTek Helio G81',
      RAM: '4GB',
      Storage: '128GB',
      'Rear Camera': '8MP Main + AI lens',
      'Front Camera': '5MP',
      Battery: '5000mAh',
      Charging: '10W wired',
      Build: 'Plastic body',
      OS: 'ColorOS 16',
      Colors: 'Black, Dark Gray, Blue, Green, Red'
    },
    images: oppoImages
  }
];

const seedDatabase = async () => {
  try {
    console.log('Seeding database...');

    const hashedPassword = await bcrypt.hash('password123', 10);

    // Insert admin and customers using our db.run
    await db.run('INSERT OR IGNORE INTO users (name, email, password, phone, role) VALUES (?, ?, ?, ?, ?)',
      ['Admin User', 'admin@technow.com', hashedPassword, '1234567890', 'admin']);

    await db.run('INSERT OR IGNORE INTO users (name, email, password, phone, role) VALUES (?, ?, ?, ?, ?)',
      ['John Doe', 'john@example.com', hashedPassword, '9876543210', 'customer']);

    await db.run('INSERT OR IGNORE INTO users (name, email, password, phone, role) VALUES (?, ?, ?, ?, ?)',
      ['Jane Smith', 'jane@example.com', hashedPassword, '5551234567', 'customer']);

    // Insert products
    for (const product of products) {
      await db.run('INSERT OR IGNORE INTO products (name, brand, description, price, stock, specifications, is_featured, images) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [
          product.name,
          product.brand,
          product.description,
          product.price,
          product.stock,
          JSON.stringify(product.specifications),
          product.is_featured ? 1 : 0,
          JSON.stringify(product.images)
        ]);
    }

    // Get the first product's ID and admin's ID
    const firstProduct = await db.query('SELECT id FROM products LIMIT 1');
    const admin = await db.query('SELECT id FROM users WHERE role = ? LIMIT 1', ['admin']);

    if (firstProduct.length > 0 && admin.length > 0) {
      // Insert a sample review
      await db.run('INSERT OR IGNORE INTO reviews (product_id, user_id, rating, comment) VALUES (?, ?, ?, ?)',
        [firstProduct[0].id, admin[0].id, 5, 'Excellent phone, highly recommend!']);

      await db.run('INSERT OR IGNORE INTO reviews (product_id, user_id, rating, comment) VALUES (?, ?, ?, ?)',
        [firstProduct[0].id, admin[0].id, 4, 'Great performance and build quality.']);
    }

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
