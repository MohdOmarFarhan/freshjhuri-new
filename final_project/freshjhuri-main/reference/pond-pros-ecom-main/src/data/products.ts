import fishFeed from "@/assets/product-fish-feed-1.jpg";
import fishMedicine from "@/assets/product-medicine-1.jpg";
import rawMaterials from "@/assets/product-raw-materials.jpg";
import uCalD from "@/assets/product-u-cal-d.jpg";
import uDca from "@/assets/product-u-dca.jpg";
import uTox from "@/assets/product-u-tox.jpg";
import unisol from "@/assets/product-unisol.jpg";
import vmPrimix from "@/assets/product-vm-primix.jpg";

export interface Product {
  id: number;
  name: string;
  category: string;
  species: string;
  price: number;
  rating: number;
  reviews: number;
  image: string;
  gallery: string[];
  description: string;
  features: string[];
  composition: string[];
  usage: string;
  dosage: string;
  weight: string;
}

export const products: Product[] = [
  {
    id: 1, name: "AquaGrow Premium Pellets", category: "Fish Feed", species: "Pangas", price: 1250, rating: 4.8, reviews: 124, image: fishFeed,
    gallery: [fishFeed, rawMaterials, fishFeed],
    description: "AquaGrow Premium Pellets are scientifically formulated to accelerate growth in Pangas fish. Made from 100% quality-tested ingredients with optimal protein absorption and feed conversion ratio.",
    features: ["High protein content (32%)", "Optimal FCR of 1.5:1", "Floats for 6+ hours", "No artificial fillers", "Lab-tested for contaminants"],
    composition: ["Crude Protein: 32%", "Crude Fat: 6%", "Crude Fiber: 5%", "Moisture: 11%", "Ash: 12%", "Calcium: 1.5%", "Phosphorus: 1.2%"],
    usage: "Broadcast evenly across the pond surface 2-3 times daily. Adjust feeding rate based on fish body weight (3-5% of total biomass).",
    dosage: "Fingerling stage: 5% of body weight per day. Growing stage: 3-4%. Pre-harvest: 2-3%.",
    weight: "25 kg",
  },
  {
    id: 2, name: "BioShield Anti-Bacterial", category: "Medicine", species: "Tilapia", price: 890, rating: 4.9, reviews: 89, image: fishMedicine,
    gallery: [fishMedicine, fishMedicine, rawMaterials],
    description: "BioShield Anti-Bacterial is a broad-spectrum treatment designed to combat common bacterial infections in Tilapia. Fast-acting formula reduces mortality rates significantly.",
    features: ["Broad-spectrum antibacterial", "Safe for pond ecosystem", "Fast-acting formula", "Easy water-soluble application", "Veterinarian recommended"],
    composition: ["Oxytetracycline HCl: 20%", "Vitamin C: 5%", "Electrolyte complex: 10%", "Binding agents: 15%", "Excipients: q.s."],
    usage: "Dissolve in pond water or mix with feed. Apply during early morning or late evening. Continue for 5-7 consecutive days.",
    dosage: "Preventive: 1g per 10L every 2 weeks. Treatment: 2g per 10L daily for 5-7 days.",
    weight: "500 g",
  },
  {
    id: 3, name: "ProFeed Starter Mix", category: "Fish Feed", species: "Shrimp", price: 1450, rating: 4.7, reviews: 156, image: fishFeed,
    gallery: [fishFeed, rawMaterials, fishFeed],
    description: "ProFeed Starter Mix is specially crafted for shrimp hatcheries and nurseries. The micro-particle formula ensures even distribution and maximum nutrient uptake.",
    features: ["Micro-particle formula", "High DHA & EPA content", "Enhances survival rate", "Suitable for PL stages", "Imported premium ingredients"],
    composition: ["Crude Protein: 40%", "Crude Fat: 8%", "DHA: 1.5%", "EPA: 1.2%", "Astaxanthin: 100ppm", "Moisture: 10%", "Ash: 14%"],
    usage: "Disperse evenly in nursery tanks or ponds. Feed small amounts frequently (4-6 times daily).",
    dosage: "PL-1 to PL-5: 0.5g per 1000 PL. PL-5 to PL-15: 1g per 1000 PL. PL-15 to PL-30: 2g per 1000 PL.",
    weight: "10 kg",
  },
  {
    id: 4, name: "Fish Meal Grade A", category: "Raw Materials", species: "All", price: 2100, rating: 4.6, reviews: 67, image: rawMaterials,
    gallery: [rawMaterials, fishFeed, rawMaterials],
    description: "Premium Grade A Fish Meal sourced from deep-sea fish. Essential raw material for high-quality fish feeds with superior amino acid profiles.",
    features: ["65% crude protein", "Low ash content", "Deep-sea sourced", "Batch-tested for quality", "Consistent granulation"],
    composition: ["Crude Protein: 65%", "Crude Fat: 10%", "Ash: 14%", "Moisture: 8%", "Sand & Silica: <1%", "Salt: 3%", "Pepsin Digestibility: 92%"],
    usage: "Use as primary protein ingredient in fish feed formulations. Blend thoroughly before pelleting.",
    dosage: "Inclusion: 15-40% depending on species. Pangas: 15-20%. Shrimp: 25-35%. Tilapia: 20-30%.",
    weight: "50 kg",
  },
  {
    id: 5, name: "VM Primix", category: "Medicine", species: "All", price: 850, rating: 4.8, reviews: 203, image: vmPrimix,
    gallery: [vmPrimix, fishMedicine, vmPrimix],
    description: "VM Primix is a comprehensive Vitamin Mineral premix for aquaculture. Contains essential vitamins, minerals, and amino acids to boost immunity and accelerate growth.",
    features: ["Complete vitamin-mineral formula", "Essential amino acids included", "Boosts immunity", "Improves growth rate", "For all aquaculture species"],
    composition: ["Vitamin A: 2,700,000 IU", "Vitamin D3: 610,000 IU", "Vitamin E: 800 mg", "Zinc: 12,000 mg", "L-Lysine: 8,900 mg", "DL-Methionine: 13,000 mg"],
    usage: "Mix thoroughly with daily feed ration. Use continuously for optimal results. Safe for fish, shrimp, and prawns.",
    dosage: "Regular: 1kg per 50kg feed. Growth boost: 1kg per 30kg feed for 14 days.",
    weight: "1 kg",
  },
  {
    id: 6, name: "U-Tox Powder", category: "Medicine", species: "All", price: 980, rating: 4.9, reviews: 178, image: uTox,
    gallery: [uTox, rawMaterials, uTox],
    description: "U-Tox is a synergistic combination of Mycotoxin Neutralizer and Yeast Wall for broad-spectrum mycotoxin neutralization in feed safety.",
    features: ["Broad spectrum mycotoxin neutralizer", "Activated sodium bentonite 80%", "Yeast wall extract included", "Safe for all species", "Prevents feed contamination"],
    composition: ["Activated Sodium Bentonite: 80%", "Cryptoxanthin from sedimentary origin: 10%", "Yeast Wall Extract (MOS & β-glucan): 10%"],
    usage: "Mix thoroughly with feed before administration. Use regularly to prevent mycotoxin-related issues.",
    dosage: "Preventive: 1kg per ton of feed. Treatment: 2kg per ton of contaminated feed.",
    weight: "1 kg",
  },
  {
    id: 7, name: "Unisol Disinfectant", category: "Medicine", species: "All", price: 1350, rating: 4.7, reviews: 92, image: unisol,
    gallery: [unisol, fishMedicine, unisol],
    description: "Unisol is a Benzalkonium Chloride-based disinfectant for aquaculture water breeding, equipment disinfection, and bacterial disease prevention.",
    features: ["Benzalkonium Chloride 0.8%", "Broad-spectrum disinfectant", "Safe for aquaculture", "Free from chloramphenicol", "5 Liter economy pack"],
    composition: ["Benzalkonium Chloride: 0.8%", "Alkyl Dimethyl Ethylbenzyl Ammonium Chloride: 3.6%", "Excipients: q.s."],
    usage: "Dilute 300-500 times with water. Spray evenly across pond. Keep in cool dry place.",
    dosage: "Treatment: 3ml per decimal per 3ft depth. Prevention: Same dose every 15 days.",
    weight: "5 L",
  },
  {
    id: 8, name: "U-DCA Vita Mineral", category: "Medicine", species: "All", price: 650, rating: 4.5, reviews: 45, image: uDca,
    gallery: [uDca, fishMedicine, uDca],
    description: "U-DCA Vita Mineral Tabs provide essential vitamins and minerals in convenient tablet form for livestock and aquaculture health support.",
    features: ["Convenient tablet form", "Complete vitamin-mineral support", "Boosts immunity", "Improves bone health", "Easy administration"],
    composition: ["Multi-vitamin complex", "Chelated minerals", "Calcium supplement", "Phosphorus", "Trace elements"],
    usage: "Administer orally or crush and mix with feed. Use daily for best results.",
    dosage: "Large animals: 2-3 tabs daily. Small animals: 1 tab daily. Poultry: 1 tab per 10 birds.",
    weight: "500 g",
  },
  {
    id: 9, name: "U-Cal D Premix", category: "Medicine", species: "All", price: 780, rating: 4.6, reviews: 134, image: uCalD,
    gallery: [uCalD, rawMaterials, uCalD],
    description: "U-Cal D is a Calcium, Phosphorus, and Vitamin Premix for poultry, fish, and livestock. Promotes bone formation and improves egg shell quality.",
    features: ["Calcium-Phosphorus-Vitamin formula", "Improves egg shell quality", "Promotes bone formation", "For veterinary use", "500gm pack"],
    composition: ["Dicalcium Phosphate: 47 mg", "Elemental Phosphorus: 15 mg", "Vitamin D3: 6 IU", "Vitamin B12: 10 mcg", "Citric Acid: 0.22 gm"],
    usage: "Mix with drinking water or feed. Administer daily. Suitable for poultry, fish, cattle, and goats.",
    dosage: "Poultry: 1 gm per liter water. Cattle: 50 gm daily per 100 kg body weight.",
    weight: "500 g",
  },
  {
    id: 10, name: "Soybean Meal Premium", category: "Raw Materials", species: "All", price: 1800, rating: 4.5, reviews: 45, image: rawMaterials,
    gallery: [rawMaterials, fishFeed, rawMaterials],
    description: "Premium Soybean Meal with high protein digestibility, ideal for custom fish feed formulations. Non-GMO sourced with low anti-nutritional factors.",
    features: ["46% crude protein", "Non-GMO sourced", "Low anti-nutritional factors", "High digestibility", "Consistent moisture content"],
    composition: ["Crude Protein: 46%", "Crude Fat: 1.5%", "Crude Fiber: 3.5%", "Moisture: 12%", "Ash: 6%", "Urease Activity: <0.2 pH rise"],
    usage: "Use as secondary protein source in aquaculture feed formulations. Best combined with fish meal.",
    dosage: "Inclusion: 20-40%. Pangas: 25-35%. Tilapia: 30-40%. Shrimp: 15-25%.",
    weight: "50 kg",
  },
  {
    id: 11, name: "HarvestMax Finisher Feed", category: "Fish Feed", species: "Tilapia", price: 1350, rating: 4.7, reviews: 92, image: fishFeed,
    gallery: [fishFeed, rawMaterials, fishFeed],
    description: "HarvestMax Finisher Feed is designed for the final growth phase of Tilapia farming with balanced nutrient profile for optimal market weight.",
    features: ["Optimized for final growth phase", "Improves flesh quality", "Slow-sinking pellets", "28% protein content", "Cost-effective FCR"],
    composition: ["Crude Protein: 28%", "Crude Fat: 5%", "Crude Fiber: 6%", "Moisture: 11%", "Ash: 13%", "Calcium: 1.8%", "Phosphorus: 1.0%"],
    usage: "Feed 2 times daily during finisher stage (last 4-6 weeks before harvest). Reduce feeding 24 hours before harvest.",
    dosage: "2-3% of total fish biomass per day. Divide into 2 equal feedings.",
    weight: "25 kg",
  },
];