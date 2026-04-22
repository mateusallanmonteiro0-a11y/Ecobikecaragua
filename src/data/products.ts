import produto1 from "@/assets/produto-1.webp";
import produto2 from "@/assets/produto-2.jpg";
import produto3 from "@/assets/produto-3.png";
import produto4 from "@/assets/produto-4.png";
import produto5 from "@/assets/produto-5.jpg";
import produto6 from "@/assets/produto-6.webp";
import produto7 from "@/assets/produto-7.jpg";
import produto8 from "@/assets/produto-8.png";

export type Product = {
  id: string;
  name: string;
  tagline: string;
  category: "Urbana" | "Off-road" | "Cruiser" | "Compacta";
  price: number;
  oldPrice?: number;
  image: string;
  badge?: string;
  specs: {
    range: string;     // autonomia
    speed: string;     // velocidade
    battery: string;   // bateria
    motor: string;
    weight: string;
    charge: string;
  };
  description: string;
  highlights: string[];
};

export const products: Product[] = [
  {
    id: "urban-pro",
    name: "Volt Urban Pro",
    tagline: "Scooter elétrica premium para a cidade",
    category: "Urbana",
    price: 10990,
    oldPrice: 14990,
    image: produto1,
    badge: "Mais vendida",
    specs: { range: "120 km", speed: "75 km/h", battery: "72V 40Ah", motor: "3000W", weight: "92 kg", charge: "4h" },
    description: "Design futurista, motor brushless de 3000W e autonomia de até 120 km. Pensada para quem se move pela cidade com estilo e zero emissão.",
    highlights: ["Painel LCD touch", "Conectividade 4G + App", "Freios a disco hidráulicos", "Garantia 2 anos motor"],
  },
  {
    id: "fat-tire",
    name: "Volt Fat X",
    tagline: "E-bike fat tire para qualquer terreno",
    category: "Off-road",
    price: 6490,
    image: produto4,
    specs: { range: "80 km", speed: "45 km/h", battery: "48V 17Ah", motor: "750W", weight: "28 kg", charge: "5h" },
    description: "Pneus fat de 4\" com tração impecável em areia, asfalto ou trilha. Quadro de alumínio aeroespacial e bateria removível Samsung.",
    highlights: ["Pneus fat 26x4\"", "Bateria Samsung removível", "Suspensão dianteira 80mm", "5 níveis de assistência"],
  },
  {
    id: "city-cruiser",
    name: "Volt City One",
    tagline: "Lifestyle elétrico minimalista",
    category: "Urbana",
    price: 6390,
    image: produto2,
    badge: "Novo",
    specs: { range: "90 km", speed: "50 km/h", battery: "60V 25Ah", motor: "1500W", weight: "75 kg", charge: "3.5h" },
    description: "Linhas limpas, farol em anel LED e motor silencioso. Para quem entende que mobilidade urbana também é arquitetura.",
    highlights: ["LED ring headlight", "Cadeado biométrico", "App iOS / Android", "Pintura premium"],
  },
  {
    id: "trail-x",
    name: "Volt Trail RX",
    tagline: "Moto elétrica off-road de alta performance",
    category: "Off-road",
    price: 18990,
    oldPrice: 21990,
    image: produto5,
    badge: "Edição limitada",
    specs: { range: "150 km", speed: "110 km/h", battery: "96V 50Ah", motor: "8000W", weight: "75 kg", charge: "2.5h" },
    description: "Motor de 8kW, suspensão completa e quadro reforçado. Construída para domar trilhas — sem ruído, sem combustível.",
    highlights: ["Motor 8000W brushless", "Suspensão regulável", "3 modos de pilotagem", "Estrutura cromoly"],
  },
  {
    id: "foldable",
    name: "Volt Mini Fold",
    tagline: "E-bike compacta para o dia a dia",
    category: "Compacta",
    price: 3590,
    image: produto8,
    specs: { range: "50 km", speed: "32 km/h", battery: "36V 10Ah", motor: "350W", weight: "22 kg", charge: "3h" },
    description: "Compacta, leve e cheia de personalidade. Selim confortável e bateria removível para carregar onde quiser.",
    highlights: ["Selim ergonômico", "Bateria removível", "Display LED integrado", "Câmbio Shimano 7v"],
  },
  {
    id: "retro-cafe",
    name: "Volt Café Racer",
    tagline: "Estética chopper, alma elétrica",
    category: "Cruiser",
    price: 8090,
    image: produto3,
    specs: { range: "130 km", speed: "85 km/h", battery: "72V 35Ah", motor: "5000W", weight: "110 kg", charge: "4h" },
    description: "Pneus largos, banco duplo e torque instantâneo. O charme do estilo chopper com tecnologia de 2026.",
    highlights: ["Banco duplo confort", "Pneus largos chopper", "Torque 180 Nm", "Edição numerada"],
  },
  {
    id: "trek-mtb",
    name: "Volt Trek MTB",
    tagline: "Mountain bike elétrica com display LCD",
    category: "Off-road",
    price: 5390,
    image: produto6,
    badge: "Novo",
    specs: { range: "70 km", speed: "32 km/h", battery: "36V 12Ah", motor: "500W", weight: "24 kg", charge: "4h" },
    description: "Mountain bike elétrica com aro 26\", display LCD multifuncional e bomba de ar inclusa. Pronta para trilhas e cidade.",
    highlights: ["Display LCD multifuncional", "Aro 26\" reforçado", "Câmbio Shimano 21v", "Bomba inclusa"],
  },
  {
    id: "smart-red",
    name: "Volt Smart Red",
    tagline: "Bike elétrica com cestinha para o dia a dia",
    category: "Urbana",
    price: 3290,
    image: produto7,
    specs: { range: "60 km", speed: "35 km/h", battery: "48V 12Ah", motor: "500W", weight: "55 kg", charge: "5h" },
    description: "Prática, vermelha e cheia de estilo. Cestinha frontal, banco duplo e plataforma para os pés. Perfeita para entregas e passeios urbanos.",
    highlights: ["Cestinha frontal", "Banco duplo", "Plataforma para pés", "Farol e seta integrados"],
  },
];

export const getProduct = (id: string) => products.find((p) => p.id === id);
