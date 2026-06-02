'use client'

import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { buildCustomFragranceOrderUrl } from '@/utils/whatsapp'
import { inquiryService } from '@/services/inquiries'

// ── Types ─────────────────────────────────────────────────────────────────────

interface Profile {
  gender: string
  personality: string
  purposes: string[]
  impression: string
  family: string
  intensityIdx: number
  climate: string
  topNotes: string[]
  heartNotes: string[]
  baseNotes: string[]
  fragranceName: string
  customerName: string
  customerPhone: string
  customerEmail: string
  additionalNotes: string
}

// ── Data ──────────────────────────────────────────────────────────────────────

const STEPS = ['IDENTITY', 'PERSONALITY', 'PURPOSE', 'IMPRESSION', 'FAMILY', 'STRENGTH', 'CLIMATE', 'NOTES', 'SIGNATURE']

const GENDERS = [
  { id: 'male',   label: 'Male',   arabic: 'رجال',   symbol: '◈', mood: 'Dark Woody · Powerful · Elegant',   desc: 'For the man who commands presence',     gradient: 'from-[#2A1208] via-[#1A0D06] to-[#0F0804]',    accent: '#C8973A' },
  { id: 'female', label: 'Female', arabic: 'نساء',   symbol: '✿', mood: 'Floral Luxury · Soft · Glamorous',  desc: 'For the woman who defines elegance',    gradient: 'from-[#3B1A2D] via-[#2A1020] to-[#1C0A15]',    accent: '#D4789A' },
  { id: 'unisex', label: 'Unisex', arabic: 'مشترك', symbol: '◇', mood: 'Modern Luxury · Minimal · Niche',   desc: 'For those who transcend categories',    gradient: 'from-[#1A2535] via-[#141C28] to-[#0E1318]',    accent: '#94A3B8' },
]

interface PersonalityItem {
  id: string; name: string; notes: string[]; mood: string; desc: string; accent: string; gradient: string
}

const PERSONALITIES: Record<string, PersonalityItem[]> = {
  male: [
    { id: 'royal',       name: 'Royal & Powerful',     notes: ['Oud', 'Amber', 'Saffron', 'Leather'],                mood: 'Authority · King Energy',        desc: 'You carry royalty in every step',      accent: '#C8973A', gradient: 'from-[#2A1A06] via-[#1E1205] to-[#140C04]'  },
    { id: 'gentleman',   name: 'Gentleman & Elegant',  notes: ['Tobacco', 'Vanilla', 'Sandalwood', 'Musk'],          mood: 'Classy · Mature · Expensive',    desc: 'Refined sophistication, always',       accent: '#B8945A', gradient: 'from-[#261A08] via-[#1C1308] to-[#120D06]'  },
    { id: 'bold',        name: 'Bold & Dangerous',     notes: ['Smoky Woods', 'Black Pepper', 'Leather', 'Dark Oud'],mood: 'Mysterious · Seductive',         desc: 'A force that cannot be ignored',       accent: '#DC4040', gradient: 'from-[#2D0A0A] via-[#200808] to-[#150506]'  },
    { id: 'calm',        name: 'Calm & Mature',        notes: ['Woody', 'Vetiver', 'Musk', 'Cedarwood'],             mood: 'Peaceful · Wise · Premium',      desc: 'Quiet confidence, rare refinement',    accent: '#7C9A7C', gradient: 'from-[#0F1C0F] via-[#0C1608] to-[#080E06]'  },
    { id: 'businessman', name: 'Luxury Businessman',   notes: ['Amber', 'Woody Musk', 'Leather', 'Tobacco'],         mood: 'CEO Energy · Confidence',        desc: 'Boardroom presence, signature power',  accent: '#A07848', gradient: 'from-[#261608] via-[#1C1006] to-[#120B04]'  },
    { id: 'sporty',      name: 'Gym & Sporty',         notes: ['Citrus', 'Aqua', 'Mint', 'Fresh Musk'],              mood: 'Energetic · Clean · Active',     desc: 'Freshness in motion',                  accent: '#4ABEDC', gradient: 'from-[#082028] via-[#061820] to-[#041018]'  },
    { id: 'romantic',    name: 'Romantic',             notes: ['Rose', 'Vanilla', 'White Musk'],                     mood: 'Warm · Emotional · Attractive',  desc: 'The fragrance of connection',          accent: '#C084A8', gradient: 'from-[#2A0E1A] via-[#1E0A14] to-[#14060E]'  },
    { id: 'mysterious',  name: 'Mysterious',           notes: ['Incense', 'Oud', 'Smoke', 'Amber'],                  mood: 'Dark Luxury · Enigmatic',        desc: 'Known by the trail you leave',         accent: '#7B68B0', gradient: 'from-[#160E2A] via-[#100A20] to-[#0A0614]'  },
  ],
  female: [
    { id: 'elegant',       name: 'Elegant & Classy',        notes: ['White Floral', 'Musk', 'Sandalwood'],      mood: 'Graceful · Timeless',           desc: 'Timeless femininity, never dated',    accent: '#D4B8A0', gradient: 'from-[#261008] via-[#1C0C06] to-[#120804]'  },
    { id: 'cute',          name: 'Cute & Sweet',            notes: ['Vanilla', 'Fruity Floral', 'Soft Musk'],   mood: 'Playful · Youthful',            desc: 'Sweet as a summer bloom',             accent: '#F0A0C0', gradient: 'from-[#2A0A18] via-[#200814] to-[#14050E]'  },
    { id: 'bold_f',        name: 'Bold & Independent',      notes: ['Leather', 'Woody Floral', 'Dark Rose'],    mood: 'Confident · Modern · Fearless', desc: 'She needs no validation',             accent: '#C04878', gradient: 'from-[#2A0818] via-[#1E0612] to-[#14040C]'  },
    { id: 'queen',         name: 'Luxury Queen',            notes: ['Rose Oud', 'Amber', 'Vanilla'],            mood: 'Royal Femininity · Lavish',     desc: 'Born to reign, dressed in scent',     accent: '#D4943A', gradient: 'from-[#281408] via-[#1E1006] to-[#140A04]'  },
    { id: 'romantic_f',    name: 'Soft & Romantic',         notes: ['Powdery Floral', 'Rose', 'White Musk'],    mood: 'Dreamy · Delicate',             desc: 'A love letter in scent form',         accent: '#E8A0C0', gradient: 'from-[#280C1C] via-[#1E0A16] to-[#14060E]'  },
    { id: 'glamorous',     name: 'Glamorous',               notes: ['Sweet Amber', 'Jasmine', 'Vanilla'],       mood: 'Attention-Grabbing · Vivid',    desc: 'Every room notices your arrival',     accent: '#C8A03A', gradient: 'from-[#281808] via-[#1E1206] to-[#140C04]'  },
    { id: 'minimalist',    name: 'Modern Minimalist',       notes: ['Clean Musk', 'Bergamot', 'White Tea'],     mood: 'Niche Luxury · Pure',           desc: 'Understated, unmistakable',           accent: '#B0C0D0', gradient: 'from-[#0C1820] via-[#0A1218] to-[#060C10]'  },
    { id: 'professional_f',name: 'Confident Professional',  notes: ['Woody Floral', 'Musk', 'Soft Leather'],   mood: 'Polished · Premium',            desc: 'Power in every meeting',              accent: '#A89070', gradient: 'from-[#201408] via-[#181006] to-[#100C04]'  },
  ],
  unisex: [
    { id: 'premium',     name: 'Premium Luxury',       notes: ['Amber', 'Musk', 'Oud'],                   mood: 'Niche Luxury · Rare',             desc: 'For those who know the difference',   accent: '#C8A36A', gradient: 'from-[#261608] via-[#1C1006] to-[#100A04]'  },
    { id: 'fresh_min',   name: 'Fresh Minimal',        notes: ['Citrus', 'Green Tea', 'White Musk'],      mood: 'Clean Premium · Crisp',           desc: 'Clarity is the ultimate luxury',      accent: '#88D8B0', gradient: 'from-[#081C14] via-[#06140E] to-[#040C08]'  },
    { id: 'arabic',      name: 'Arabic Royal',         notes: ['Oud', 'Incense', 'Leather'],              mood: 'Traditional Heritage',            desc: 'The ancient art of attar',            accent: '#D4943A', gradient: 'from-[#281408] via-[#1E1006] to-[#140A04]'  },
    { id: 'international',name: 'Modern International',notes: ['Aqua Woods', 'Musk', 'Bergamot'],        mood: 'Global Niche',                    desc: 'Speaks every fragrance language',     accent: '#70A8D8', gradient: 'from-[#0A1828] via-[#08121E] to-[#060C14]'  },
    { id: 'nature',      name: 'Nature Inspired',      notes: ['Green Leaves', 'Vetiver', 'Cedarwood'],   mood: 'Earthy · Organic · Wild',         desc: 'Raw beauty of the natural world',     accent: '#78B878', gradient: 'from-[#0C1C0C] via-[#0A1608] to-[#060E06]'  },
    { id: 'dark_smoky',  name: 'Dark & Smoky',         notes: ['Smoke', 'Leather', 'Dark Oud'],           mood: 'Intense · Mysterious',            desc: 'Where fire meets luxury',             accent: '#A08070', gradient: 'from-[#1C1008] via-[#140C06] to-[#0C0804]'  },
    { id: 'clean_pro',   name: 'Clean & Professional', notes: ['Musk', 'Citrus', 'White Woods'],          mood: 'Elegant · Sharp',                 desc: 'Precision in every molecule',         accent: '#C0D0E0', gradient: 'from-[#0C1620] via-[#0A1018] to-[#060A10]'  },
    { id: 'oud_lover',   name: 'Rich Oud Lover',       notes: ['Pure Oud', 'Amber', 'Saffron'],           mood: 'Premium Arabic Identity',         desc: 'The throne of all fragrances',        accent: '#D4882A', gradient: 'from-[#2A1606] via-[#1E1004] to-[#140A04]'  },
  ],
}

const PURPOSE_CATEGORIES = [
  { id: 'daily',        label: 'Daily Use',          icon: '◎', options: ['Daily Life', 'Office', 'College', 'Casual Wear', 'Home', 'Gym', 'Field Work'] },
  { id: 'events',       label: 'Events & Social',    icon: '✦', options: ['Wedding', 'Reception', 'Party', 'Date Night', 'VIP Event', 'Night Life', 'Religious Event'] },
  { id: 'professional', label: 'Professional',       icon: '◈', options: ['Formal Meeting', 'Client Meeting', 'Luxury Business Event'] },
  { id: 'travel',       label: 'Travel & Lifestyle', icon: '◇', options: ['Travelling Abroad', 'Vacation', 'Business Travel', 'Airport Look', 'Long Drive', 'Luxury Hotel Stay'] },
]

const IMPRESSIONS = [
  { id: 'attractive',   label: 'Attractive',       desc: 'Warm seductive glow',     accent: '#E87060', gradient: 'from-[#2D0A08] via-[#220806] to-[#160504]' },
  { id: 'rich',         label: 'Rich & Luxurious', desc: 'Gold royal aura',          accent: '#D4943A', gradient: 'from-[#2A1808] via-[#1E1206] to-[#140C04]' },
  { id: 'fresh',        label: 'Fresh & Clean',    desc: 'Cool aqua freshness',      accent: '#60C8E8', gradient: 'from-[#081C28] via-[#06141E] to-[#040C14]' },
  { id: 'powerful',     label: 'Powerful',         desc: 'Dark amber intensity',     accent: '#A06828', gradient: 'from-[#281408] via-[#1E1006] to-[#140A04]' },
  { id: 'romantic',     label: 'Romantic',         desc: 'Soft rose atmosphere',     accent: '#D87090', gradient: 'from-[#2A0C18] via-[#200A14] to-[#14060E]' },
  { id: 'mysterious',   label: 'Mysterious',       desc: 'Smoky shadows',            accent: '#8870B0', gradient: 'from-[#160C2A] via-[#100820] to-[#0A0614]' },
  { id: 'professional', label: 'Professional',     desc: 'Clean silver minimalism',  accent: '#9AAABB', gradient: 'from-[#0C1420] via-[#0A1018] to-[#060A10]' },
  { id: 'calm',         label: 'Calm & Relaxing',  desc: 'Soft earthy tones',        accent: '#88A878', gradient: 'from-[#0C180C] via-[#0A1208] to-[#060C06]' },
  { id: 'sexy',         label: 'Sexy & Seductive', desc: 'Deep crimson aura',        accent: '#C03048', gradient: 'from-[#280808] via-[#1E0606] to-[#140404]' },
  { id: 'royal',        label: 'Royal',            desc: 'Black & gold richness',    accent: '#C8A036', gradient: 'from-[#241808] via-[#1A1206] to-[#120C04]' },
  { id: 'unique',       label: 'Unique & Rare',    desc: 'Niche artistic styling',   accent: '#A080C8', gradient: 'from-[#180C28] via-[#120820] to-[#0C0614]' },
  { id: 'confident',    label: 'Confident',        desc: 'Sharp modern luxury',      accent: '#4888D8', gradient: 'from-[#0A1028] via-[#080C20] to-[#040614]' },
]

const FAMILIES = [
  { id: 'oud',      name: 'Oud / Arabic',   arabic: 'عود',     symbol: '◆', mood: 'Ancient · Smoky · Regal',      desc: 'The king of all fragrances',   gradient: 'from-[#2A1608] via-[#1E1006] to-[#120A04]', accent: '#D4943A' },
  { id: 'woody',    name: 'Woody',          arabic: 'خشب',     symbol: '▲', mood: 'Earthy · Grounded · Warm',     desc: "Nature's deep embrace",         gradient: 'from-[#0E1C0A] via-[#0A1408] to-[#060C04]', accent: '#86EFAC' },
  { id: 'musk',     name: 'Musky',          arabic: 'مسك',     symbol: '◇', mood: 'Clean · Celestial · Bare',     desc: 'Your second skin',              gradient: 'from-[#0C1428] via-[#0A1020] to-[#060A14]', accent: '#93C5FD' },
  { id: 'floral',   name: 'Floral',         arabic: 'زهور',    symbol: '✿', mood: 'Romantic · Soft · Blooming',   desc: 'Garden of eternal summer',      gradient: 'from-[#220A1A] via-[#1A0814] to-[#10040C]', accent: '#C084FC' },
  { id: 'fresh',    name: 'Fresh Aqua',     arabic: 'نضارة',   symbol: '◎', mood: 'Airy · Ocean · Crisp',         desc: 'Wind and sea in one breath',    gradient: 'from-[#081A18] via-[#061412] to-[#040C0A]', accent: '#6EE7B7' },
  { id: 'citrus',   name: 'Citrus',         arabic: 'حمضي',    symbol: '◉', mood: 'Bright · Energetic · Zesty',   desc: 'Burst of liquid sunshine',      gradient: 'from-[#2A1C04] via-[#1E1402] to-[#140E02]', accent: '#FCD34D' },
  { id: 'vanilla',  name: 'Sweet Vanilla',  arabic: 'فانيليا', symbol: '✦', mood: 'Warm · Sweet · Comforting',    desc: 'Luxury in its softest form',    gradient: 'from-[#281A06] via-[#1E1404] to-[#140E04]', accent: '#FCA5A5' },
  { id: 'smoky',    name: 'Smoky',          arabic: 'دخاني',   symbol: '◈', mood: 'Mysterious · Dark · Alluring', desc: 'Midnight without borders',      gradient: 'from-[#1A1410] via-[#14100C] to-[#0C0A08]', accent: '#A8A0B8' },
  { id: 'spicy',    name: 'Spicy',          arabic: 'حار',     symbol: '◆', mood: 'Bold · Fiery · Magnetic',      desc: 'Heat that lingers',             gradient: 'from-[#2A0C06] via-[#200906] to-[#140604]', accent: '#F87171' },
  { id: 'powdery',  name: 'Powdery',        arabic: 'ناعم',    symbol: '✿', mood: 'Soft · Delicate · Pure',       desc: 'Velvet on your skin',           gradient: 'from-[#220C1C] via-[#1A0A16] to-[#10060E]', accent: '#F0ABFC' },
  { id: 'green',    name: 'Green Natural',  arabic: 'أخضر',    symbol: '▲', mood: 'Forest · Organic · Wild',      desc: 'The forest after rain',         gradient: 'from-[#0C1C0C] via-[#0A1408] to-[#060C06]', accent: '#86EFAC' },
  { id: 'leather',  name: 'Leather',        arabic: 'جلد',     symbol: '◈', mood: 'Raw · Bold · Masculine',       desc: 'Power in its rawest form',      gradient: 'from-[#261408] via-[#1C1006] to-[#120A04]', accent: '#C4955A' },
  { id: 'oriental', name: 'Oriental',       arabic: 'شرقي',    symbol: '✦', mood: 'Exotic · Spiced · Warm',       desc: 'East in every breath',          gradient: 'from-[#2A0E06] via-[#200A04] to-[#140804]', accent: '#FCA5A5' },
]

const INTENSITIES = [
  { label: 'Skin Close',  sublabel: 'Intimate & Subtle',   desc: 'Whispers only to those nearest. A private, personal signature.',  sillage: '0 – 30 cm', gradient: 'from-[#180E06] to-[#100A04]', glow: 'rgba(200,163,106,0.15)' },
  { label: 'Moderate',    sublabel: 'Versatile Luxury',    desc: 'Natural everyday presence. Balanced, never overwhelming.',        sillage: '30 – 100 cm', gradient: 'from-[#1E1408] to-[#140E06]', glow: 'rgba(200,163,106,0.25)' },
  { label: 'Strong',      sublabel: 'Premium Projection',  desc: 'Announces your arrival. Confident and unforgettable.',            sillage: '1 – 3 m', gradient: 'from-[#261808] to-[#1C1208]', glow: 'rgba(200,163,106,0.35)' },
  { label: 'Beast Mode',  sublabel: 'Ultra Long-Lasting',  desc: 'Massive presence. Fills every room. 12+ hours longevity.',        sillage: '3+ m', gradient: 'from-[#2E1E08] to-[#221608]', glow: 'rgba(200,163,106,0.50)' },
]

const CLIMATES = [
  { id: 'summer', label: 'Summer',       arabic: 'صيف',        desc: 'Fresh citrus & aqua notes thrive in heat',    mood: 'Hot · Bright · Energetic',    accent: '#FCD34D', gradient: 'from-[#2A1C04] via-[#1E1402] to-[#140E02]' },
  { id: 'winter', label: 'Winter',       arabic: 'شتاء',       desc: 'Rich warm oriental woods shine in cold air',  mood: 'Cold · Deep · Warming',       accent: '#93C5FD', gradient: 'from-[#0C1228] via-[#0A0E1E] to-[#060814]' },
  { id: 'rainy',  label: 'Rainy Season', arabic: 'مطر',        desc: 'Green earthy freshness blooms after rain',    mood: 'Petrichor · Fresh · Calming', accent: '#6EE7B7', gradient: 'from-[#081A10] via-[#06140C] to-[#040C08]' },
  { id: 'all',    label: 'All Season',   arabic: 'كل المواسم', desc: 'Balanced formula for any weather, any day',   mood: 'Universal · Timeless',        accent: '#C8A36A', gradient: 'from-[#1E1408] via-[#18100A] to-[#100C08]' },
]

const NOTES_PYRAMID = {
  top:   ['Bergamot', 'Lemon', 'Orange', 'Mint', 'Grapefruit', 'Mandarin', 'Lime', 'Neroli', 'Pink Pepper', 'Aldehydes', 'Green Violet', 'Petitgrain'],
  heart: ['Rose', 'Jasmine', 'Lavender', 'Saffron', 'Iris', 'Ylang-Ylang', 'Peony', 'Lily', 'Oud', 'Amber', 'Cardamom', 'Cinnamon', 'Patchouli', 'Leather', 'Tobacco'],
  base:  ['Musk', 'Sandalwood', 'Vetiver', 'Cedarwood', 'Vanilla', 'Benzoin', 'Tonka Bean', 'Oakmoss', 'Ambergris', 'Dark Oud', 'Labdanum', 'Civet'],
}

const NAME_SUGGESTIONS = [
  'Midnight Oud', 'Velvet Crown', 'Royal Veil', 'Desert Noir',
  'Amber Dynasty', 'Eternal Musk', 'Golden Smoke', 'Silk & Shadow',
  'Ancient Ember', 'Lunar Rose', 'Cedar Throne', 'Dark Royale',
]

const EMPTY: Profile = {
  gender: '', personality: '', purposes: [], impression: '',
  family: '', intensityIdx: 1, climate: '',
  topNotes: [], heartNotes: [], baseNotes: [],
  fragranceName: '', customerName: '', customerPhone: '',
  customerEmail: '', additionalNotes: '',
}

// ── Slide variants ─────────────────────────────────────────────────────────────

const slide = {
  enter:  (d: number) => ({ x: d > 0 ? 56 : -56, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit:   (d: number) => ({ x: d > 0 ? -56 : 56, opacity: 0 }),
}

// ── Option Card ───────────────────────────────────────────────────────────────

function OptionCard({
  selected, onClick, gradient, accent, symbol, title, subtitle, desc, arabic, className = '',
}: {
  selected: boolean; onClick: () => void; gradient: string; accent: string
  symbol?: string; title: string; subtitle?: string; desc?: string; arabic?: string; className?: string
}) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={{ y: -6, scale: 1.025 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 180, damping: 18 }}
      style={{ '--cf-accent': accent } as React.CSSProperties}
      className={`cf-option-card${selected ? ' cf-option-card--selected' : ''} relative overflow-hidden text-left cursor-pointer ${className}`}
    >
      {/* Base gradient */}
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient}`} />

      {/* Top light edge — glass rim effect */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/18 to-transparent pointer-events-none" />

      {/* Left light edge */}
      <div className="absolute top-0 left-0 bottom-0 w-px bg-gradient-to-b from-white/12 via-transparent to-transparent pointer-events-none" />

      {/* Inner ambient glow when selected */}
      {selected && (
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_30%_20%,_rgba(255,255,255,0.07)_0%,_transparent_70%)] pointer-events-none" />
      )}

      {/* Shimmer sweep on hover */}
      <div className="cf-card-shimmer" aria-hidden="true" />

      {/* Arabic watermark */}
      {arabic && <div className="cf-arabic-wm" aria-hidden="true">{arabic}</div>}

      {/* Selected ring */}
      {selected && <div className="cf-selected-ring absolute inset-0 pointer-events-none" />}

      {/* Content */}
      <div className="relative z-10 flex flex-col h-full justify-between p-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="font-serif text-white text-sm leading-tight">{title}</span>
            {symbol && <span className="cf-family-symbol">{symbol}</span>}
          </div>
          {subtitle && <p className="cf-family-mood">{subtitle}</p>}
          {desc && <p className="text-white/70 text-[10px] font-sans leading-snug mt-1">{desc}</p>}
        </div>
        <AnimatePresence>
          {selected && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 400, damping: 20 }}
              className="cf-check-circle mt-2"
            >
              <svg viewBox="0 0 16 16" className="w-2.5 h-2.5" fill="none" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 8.5l3.5 3.5 6.5-7" />
              </svg>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.button>
  )
}

// ── Bottle SVG ────────────────────────────────────────────────────────────────

function LuxuryBottle({ fillPercent, accent }: { fillPercent: number; accent: string }) {
  const BY = 58, BH = 128
  const lH = Math.max(0, (fillPercent / 100) * BH)
  const lY = BY + BH - lH
  return (
    <motion.div
      className="w-full h-full"
      animate={{ y: [0, -6, 0] }}
      transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
    >
      <svg viewBox="0 0 120 212" className="w-full h-full drop-shadow-2xl" fill="none">
        <defs>
          <clipPath id="lx-clip"><rect x="18" y={BY} width="84" height={BH} rx="10" /></clipPath>
          <linearGradient id="lx-liq" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor={accent} stopOpacity="0.55" />
            <stop offset="55%" stopColor={accent} stopOpacity="0.85" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0.12" />
          </linearGradient>
          <linearGradient id="lx-body" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#120A04" />
            <stop offset="30%" stopColor="#1E1008" />
            <stop offset="60%" stopColor="#281608" />
            <stop offset="100%" stopColor="#160C05" />
          </linearGradient>
          <linearGradient id="lx-cap" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#1A1206" />
            <stop offset="45%" stopColor={accent} stopOpacity="0.8" />
            <stop offset="100%" stopColor="#1A1206" />
          </linearGradient>
          <linearGradient id="lx-shine-h" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.12" />
            <stop offset="35%" stopColor="#FFFFFF" stopOpacity="0.04" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="lx-shine-v" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.08" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
          </linearGradient>
          <radialGradient id="lx-shadow" cx="50%" cy="100%" r="50%">
            <stop offset="0%" stopColor={accent} stopOpacity="0.18" />
            <stop offset="100%" stopColor={accent} stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Ground shadow */}
        <ellipse cx="60" cy={BY + BH + 8} rx="38" ry="5" fill="url(#lx-shadow)" />

        {/* Cap stem */}
        <rect x="56" y="2" width="8" height="5" rx="2.5" fill={accent} opacity="0.65" />
        <rect x="57.5" y="2" width="5" height="10" rx="2" fill={accent} opacity="0.45" />

        {/* Cap base */}
        <rect x="36" y="7" width="48" height="22" rx="7" fill="url(#lx-cap)" />
        <rect x="39" y="10" width="42" height="16" rx="6" fill="url(#lx-body)" />
        {/* Cap highlight */}
        <rect x="40" y="11" width="12" height="5" rx="2" fill="white" opacity="0.08" />

        {/* Neck */}
        <rect x="47" y="29" width="26" height="20" rx="2" fill="url(#lx-body)" />
        <rect x="47" y="29" width="8" height="20" rx="2" fill="white" opacity="0.04" />

        {/* Shoulder */}
        <path d="M47 49 Q32 54 17 58 L103 58 Q88 54 73 49 Z" fill={accent} opacity="0.06" />

        {/* Body */}
        <rect x="17" y={BY} width="86" height={BH} rx="11" fill="url(#lx-body)" />

        {/* Liquid fill */}
        <motion.rect x="17" width="86" clipPath="url(#lx-clip)" fill="url(#lx-liq)"
          initial={{ y: BY + BH, height: 0 }}
          animate={{ y: lY, height: lH }}
          transition={{ duration: 1.4, ease: [0.34, 1.56, 0.64, 1] }}
        />

        {/* Body glass shine — left vertical */}
        <rect x="17" y={BY} width="86" height={BH} rx="11" fill="url(#lx-shine-h)" />
        <rect x="24" y={BY + 6} width="8" height={BH - 18} rx="4" fill="white" opacity="0.055" />
        {/* Right subtle reflection */}
        <rect x="88" y={BY + 12} width="4" height={BH - 28} rx="2" fill="white" opacity="0.025" />

        {/* Body top shine */}
        <rect x="17" y={BY} width="86" height="30" rx="11" fill="url(#lx-shine-v)" />

        {/* Body border */}
        <rect x="17" y={BY} width="86" height={BH} rx="11" stroke={accent} strokeWidth="0.8" strokeOpacity="0.30" fill="none" />

        {/* Label area */}
        <line x1="32" y1={BY + 16} x2="88" y2={BY + 16} stroke={accent} strokeWidth="0.4" strokeOpacity="0.30" />
        <text x="60" y={BY + 28} textAnchor="middle" fontFamily="Georgia, serif" fontSize="8.5" letterSpacing="4.5" fill={accent} fillOpacity="0.80">M.M</text>
        <text x="60" y={BY + 36} textAnchor="middle" fontFamily="Georgia, serif" fontSize="4.5" fill={accent} fillOpacity="0.30">◆</text>
        <text x="60" y={BY + 46} textAnchor="middle" fontFamily="Arial, sans-serif" fontSize="4.5" letterSpacing="2.5" fill={accent} fillOpacity="0.55">ATTARWALA</text>
        <line x1="32" y1={BY + 52} x2="88" y2={BY + 52} stroke={accent} strokeWidth="0.4" strokeOpacity="0.30" />

        {/* Moving highlight shimmer */}
        <motion.rect x="24" y={BY} width="6" height={BH} rx="3" fill="white" opacity="0"
          animate={{ opacity: [0, 0.06, 0], x: [24, 80, 24] }}
          transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
        />
      </svg>
    </motion.div>
  )
}

// ── Progress Bar ───────────────────────────────────────────────────────────────

function ProgressBar({ step }: { step: number }) {
  const pct = ((step - 1) / (STEPS.length - 1)) * 100
  return (
    <div className="cf-stepbar sticky top-[72px] md:top-[80px] z-30 bg-[#1C1208] border-b border-[#C8A36A]/22 px-4 py-4">
      <div className="max-w-6xl mx-auto">
        {/* Connecting line + animated progress */}
        <div className="relative mb-3.5">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full h-px bg-[#C8A36A]/10" />
          </div>
          <motion.div className="absolute left-0 top-0 h-px bg-gradient-to-r from-[#C8A36A]/50 to-[#C8A36A]/20"
            animate={{ width: `${pct}%` }} transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
          />
          {/* Glow dot on progress end */}
          <motion.div className="absolute top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-[#C8A36A]"
            animate={{ left: `${pct}%`, boxShadow: ['0 0 4px rgba(200,163,106,0.4)', '0 0 10px rgba(200,163,106,0.8)', '0 0 4px rgba(200,163,106,0.4)'] }}
            transition={{ left: { duration: 0.7, ease: [0.4,0,0.2,1] }, boxShadow: { duration: 1.5, repeat: Infinity } }}
          />
        </div>
        <div className="flex items-center justify-between">
          {STEPS.map((label, i) => {
            const done   = step > i + 1
            const active = step === i + 1
            return (
              <div key={label} className="flex flex-col items-center gap-1.5">
                <motion.div
                  animate={active ? {
                    boxShadow: ['0 0 0px rgba(200,163,106,0)', '0 0 14px rgba(200,163,106,0.65)', '0 0 0px rgba(200,163,106,0)'],
                  } : {}}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-[8px] font-sans transition-all duration-500 ${
                    done   ? 'bg-[#C8A36A] border-[#C8A36A] text-[#120900]'
                    : active ? 'bg-[#C8A36A]/12 border-[#C8A36A] text-[#C8A36A]'
                             : 'bg-transparent border-ivory/40 text-ivory/60'
                  }`}
                >
                  {done ? (
                    <svg viewBox="0 0 16 16" className="w-2.5 h-2.5" fill="none" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 8.5l3.5 3.5 6.5-7" />
                    </svg>
                  ) : i + 1}
                </motion.div>
                <span className={`hidden sm:block text-[7px] font-sans uppercase tracking-[0.14em] transition-colors duration-300 ${
                  active ? 'text-[#C8A36A] font-semibold' : done ? 'text-[#C8A36A]/55' : 'text-ivory/55'
                }`}>{label}</span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// ── Right Panel ───────────────────────────────────────────────────────────────

function RightPanel({ profile, step }: { profile: Profile; step: number }) {
  const selGender      = GENDERS.find(g => g.id === profile.gender)
  const personalities  = profile.gender ? PERSONALITIES[profile.gender] ?? [] : []
  const selPersonality = personalities.find(p => p.id === profile.personality)
  const selFamily      = FAMILIES.find(f => f.id === profile.family)
  const selImpression  = IMPRESSIONS.find(i => i.id === profile.impression)
  const selClimate     = CLIMATES.find(c => c.id === profile.climate)
  const selIntensity   = INTENSITIES[profile.intensityIdx]

  const accent  = selFamily?.accent ?? selImpression?.accent ?? selPersonality?.accent ?? selGender?.accent ?? '#C8A36A'
  const fill    = step >= 5 && profile.family
    ? Math.min(100, Math.max(15, ((step - 1) / 8) * 88 + 12))
    : Math.max(0, (step / 9) * 18)
  const allNotes = [...profile.topNotes, ...profile.heartNotes, ...profile.baseNotes]
  const displayNotes = (allNotes.length > 0 ? allNotes : selPersonality?.notes ?? []).slice(0, 4)

  const notePositions = [
    { top: 'top-8',    side: 'left-3',  align: 'items-start text-left',  icon: '◆', layer: 'Top'    },
    { top: 'top-8',    side: 'right-3', align: 'items-end text-right',   icon: '○', layer: 'Heart'  },
    { top: 'bottom-8', side: 'left-3',  align: 'items-start text-left',  icon: '≋', layer: 'Base'   },
    { top: 'bottom-8', side: 'right-3', align: 'items-end text-right',   icon: '▲', layer: 'Base'   },
  ]

  return (
    <div className="w-full lg:w-72 xl:w-80 flex-shrink-0 lg:sticky lg:top-[180px] space-y-3">

      {/* ── Bottle showcase ─────────────────────────────────────────── */}
      <div className="cf-preview-panel-glass cf-preview-panel border overflow-hidden">
        <div className="cf-showcase-canvas relative flex items-center justify-center">

          {/* Ambient glow behind bottle */}
          <motion.div
            className="absolute w-40 h-40 rounded-full pointer-events-none"
            style={{ background: `radial-gradient(ellipse, ${accent}22 0%, transparent 70%)`, filter: 'blur(32px)' }}
            animate={{ opacity: [0.6, 1, 0.6], scale: [0.9, 1.1, 0.9] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          />

          {/* Corner brackets */}
          <div className="absolute top-4 left-4 w-6 h-6 border-t border-l border-[#C8A36A]/25 pointer-events-none" />
          <div className="absolute top-4 right-4 w-6 h-6 border-t border-r border-[#C8A36A]/25 pointer-events-none" />
          <div className="absolute bottom-4 left-4 w-6 h-6 border-b border-l border-[#C8A36A]/25 pointer-events-none" />
          <div className="absolute bottom-4 right-4 w-6 h-6 border-b border-r border-[#C8A36A]/25 pointer-events-none" />

          {/* Circular rings */}
          <div className="absolute w-52 h-52 rounded-full border border-[#C8A36A]/07 pointer-events-none" />
          <div className="absolute w-36 h-36 rounded-full border border-[#C8A36A]/05 pointer-events-none" />

          {/* Note labels */}
          {displayNotes.map((note, i) => {
            const pos = notePositions[i]
            return (
              <motion.div key={note}
                initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.12, type: 'spring', stiffness: 300 }}
                className={`absolute ${pos.top} ${pos.side} flex flex-col ${pos.align} gap-1 pointer-events-none`}
              >
                <div className="w-5 h-5 border border-[#C8A36A]/45 flex items-center justify-center">
                  <span className="text-[#C8A36A]/80 text-[7px]">{pos.icon}</span>
                </div>
                <p className="text-[#C8A36A] text-[7px] font-sans uppercase tracking-[0.18em] leading-none">{note}</p>
                <p className="text-white/55 text-[6px] font-sans">{pos.layer}</p>
              </motion.div>
            )
          })}

          {/* Bottle */}
          <div className="relative w-32 h-52 z-10">
            <LuxuryBottle fillPercent={fill} accent={accent} />
          </div>
        </div>

        {/* Bottom label */}
        <div className="px-5 pb-5 pt-3 text-center border-t border-[#C8A36A]/08">
          <AnimatePresence mode="wait">
            {profile.fragranceName ? (
              <motion.div key="named" initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}>
                <p className="font-serif text-white/90 text-base italic mb-0.5">{profile.fragranceName}</p>
                <p className="text-[#C8A36A]/70 text-[8px] font-sans uppercase tracking-[0.28em]">M.M ATTARWALA</p>
              </motion.div>
            ) : selGender ? (
              <motion.div key="gender" initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}>
                <p className="text-white/72 text-[9px] font-sans uppercase tracking-[0.22em] mb-0.5">{selGender.label} · {selGender.mood.split('·')[0].trim()}</p>
                <p className="text-[#C8A36A]/60 text-[7px] font-sans uppercase tracking-[0.28em]">M.M ATTARWALA</p>
              </motion.div>
            ) : (
              <motion.p key="default" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="text-white/55 text-[9px] font-sans uppercase tracking-[0.2em]">
                Your Signature Fragrance
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* DNA card */}
      {step >= 2 && (selPersonality ?? selFamily ?? selImpression ?? allNotes.length > 0) && (
        <motion.div
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
          className="cf-preview-panel-glass cf-preview-panel border p-5 space-y-3.5">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-4 h-px bg-[#C8A36A]/40" />
            <p className="text-[#C8A36A]/90 text-[8px] font-sans uppercase tracking-[0.25em]">Fragrance DNA</p>
          </div>
          {selPersonality && (
            <div>
              <p className="text-white/55 text-[8px] font-sans uppercase tracking-[0.18em] mb-1">Personality</p>
              <p className="font-serif text-white/95 text-sm leading-tight">{selPersonality.name}</p>
              <p className="text-white/65 text-[9px] font-sans mt-0.5">{selPersonality.mood}</p>
            </div>
          )}
          {selImpression && step >= 4 && (
            <div>
              <div className="w-full h-px bg-[#C8A36A]/20 mb-3" />
              <p className="text-white/55 text-[8px] font-sans uppercase tracking-[0.18em] mb-1">Impression</p>
              <p className="text-white/85 text-xs font-sans">{selImpression.label}</p>
            </div>
          )}
          {selFamily && step >= 5 && (
            <div>
              <div className="w-full h-px bg-[#C8A36A]/20 mb-3" />
              <p className="text-white/55 text-[8px] font-sans uppercase tracking-[0.18em] mb-1">Family</p>
              <p className="text-white/85 text-xs font-sans">{selFamily.name}</p>
            </div>
          )}
          {selClimate && step >= 7 && (
            <div>
              <div className="w-full h-px bg-[#C8A36A]/20 mb-3" />
              <p className="text-white/55 text-[8px] font-sans uppercase tracking-[0.18em] mb-1">Climate</p>
              <p className="text-white/85 text-xs font-sans">{selClimate.label}</p>
            </div>
          )}
          {allNotes.length > 0 && step >= 8 && (
            <div>
              <div className="w-full h-px bg-[#C8A36A]/20 mb-3" />
              <p className="text-white/55 text-[8px] font-sans uppercase tracking-[0.18em] mb-2">Notes</p>
              <div className="flex flex-wrap gap-1">
                {allNotes.map(n => (
                  <span key={n} className="px-1.5 py-0.5 border border-[#C8A36A]/35 text-white/75 text-[8px] font-sans">{n}</span>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      )}

      {/* Projection panel */}
      <div className="cf-preview-panel-glass cf-preview-panel border p-5">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-4 h-px bg-[#C8A36A]/40" />
          <p className="text-[#C8A36A]/90 text-[8px] font-sans uppercase tracking-[0.25em]">Projection</p>
        </div>
        <div className="flex items-end justify-center gap-2.5 mb-3">
          {INTENSITIES.map((intens, i) => (
            <div key={i} className="flex flex-col items-center gap-1.5">
              <motion.div className="w-5 rounded-sm relative overflow-hidden"
                animate={{
                  height: `${12 + i * 9}px`,
                  opacity: i <= profile.intensityIdx ? 1 : 0.12,
                }}
                transition={{ duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
                style={{ backgroundColor: i <= profile.intensityIdx ? accent : '#C8A36A' }}
              >
                {i <= profile.intensityIdx && (
                  <motion.div className="absolute inset-0 bg-white/20"
                    animate={{ opacity: [0, 0.3, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
                  />
                )}
              </motion.div>
            </div>
          ))}
        </div>
        <p className="text-white/80 text-[9px] font-sans uppercase tracking-[0.15em] text-center">{selIntensity.label}</p>
        <p className="text-white/55 text-[8px] font-sans text-center mt-0.5">{selIntensity.sillage}</p>
      </div>

    </div>
  )
}

// ── Note Pill ─────────────────────────────────────────────────────────────────

function NotePill({ note, selected, onClick, disabled, recommended }: {
  note: string; selected: boolean; onClick: () => void; disabled: boolean; recommended?: boolean
}) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      disabled={disabled && !selected}
      whileHover={!disabled || selected ? { y: -2, scale: 1.04 } : {}}
      whileTap={{ scale: 0.96 }}
      transition={{ type: 'spring', stiffness: 400, damping: 20 }}
      className={`px-3 py-1.5 text-[11px] font-sans uppercase tracking-[0.1em] border transition-all duration-300 disabled:opacity-20 ${
        selected
          ? 'bg-[#B08D57] border-[#B08D57] text-[#120900] shadow-[0_2px_12px_rgba(176,141,87,0.45)]'
          : recommended
          ? 'border-gold/50 text-gold/75 bg-gold/5 hover:border-gold/80 hover:text-gold hover:bg-gold/10'
          : 'border-brown/20 text-brown/55 hover:border-gold/45 hover:text-gold/80 hover:bg-gold/5'
      }`}
    >
      {note}{recommended && !selected && <span className="ml-1 text-[8px] opacity-50">✦</span>}
    </motion.button>
  )
}

// ── Step Heading ──────────────────────────────────────────────────────────────

function StepHeading({ step: stepNum, line1, line2, desc }: { step: number; line1: string; line2: string; desc: string }) {
  return (
    <div className="mb-10">
      <motion.p
        className="text-[#8B6B3D] text-[10px] font-sans uppercase tracking-[0.28em] mb-3"
        initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        Step {stepNum} of {STEPS.length}
      </motion.p>
      <motion.h2
        className="cf-step-h1 font-display font-bold text-brown leading-[1.0] mb-1"
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.05 }}>
        {line1}
      </motion.h2>
      <motion.h2
        className="cf-step-h2 font-serif italic text-gradient-gold leading-[1.05] mb-5"
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.12 }}>
        {line2}
      </motion.h2>
      <motion.p
        className="font-sans text-[#4A3020] text-sm leading-relaxed max-w-sm"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.2 }}>
        {desc}
      </motion.p>
    </div>
  )
}

// ── Main ──────────────────────────────────────────────────────────────────────

export default function CreateFragranceClient() {
  const topRef = useRef<HTMLDivElement>(null)
  const [step, setStep]             = useState(1)
  const [dir, setDir]               = useState(1)
  const [profile, setProfile]       = useState<Profile>(EMPTY)
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')
  const [submitted, setSubmitted]   = useState(false)

  const personalities    = profile.gender ? PERSONALITIES[profile.gender] ?? [] : []
  const selPersonality   = personalities.find(p => p.id === profile.personality)
  const selFamily        = FAMILIES.find(f => f.id === profile.family)
  const selClimate       = CLIMATES.find(c => c.id === profile.climate)
  const recommendedNotes = selPersonality?.notes ?? []

  function go(next: number) {
    setDir(next > step ? 1 : -1)
    setStep(next)
    setTimeout(() => topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 20)
  }

  function canAdvance() {
    if (step === 1) return !!profile.gender
    if (step === 2) return !!profile.personality
    if (step === 3) return profile.purposes.length > 0
    if (step === 4) return !!profile.impression
    if (step === 5) return !!profile.family
    if (step === 6) return true
    if (step === 7) return !!profile.climate
    if (step === 8) return (profile.topNotes.length + profile.heartNotes.length + profile.baseNotes.length) > 0
    if (step === 9) return !!profile.customerName && !!profile.customerPhone
    return false
  }

  function togglePurpose(opt: string) {
    setProfile(p => ({
      ...p,
      purposes: p.purposes.includes(opt) ? p.purposes.filter(x => x !== opt) : [...p.purposes, opt],
    }))
  }

  function toggleNote(layer: 'topNotes' | 'heartNotes' | 'baseNotes', note: string) {
    setProfile(p => {
      const arr = p[layer]
      if (arr.includes(note)) return { ...p, [layer]: arr.filter(n => n !== note) }
      if (arr.length >= 3) return p
      return { ...p, [layer]: [...arr, note] }
    })
  }

  async function handleSubmit() {
    setSaveStatus('saving')
    const noteLines = [
      profile.topNotes.length   ? `Top: ${profile.topNotes.join(', ')}`     : '',
      profile.heartNotes.length ? `Heart: ${profile.heartNotes.join(', ')}` : '',
      profile.baseNotes.length  ? `Base: ${profile.baseNotes.join(', ')}`   : '',
    ].filter(Boolean)
    const extraContext = [
      profile.personality  ? `Personality: ${selPersonality?.name ?? profile.personality}` : '',
      profile.purposes.length ? `Purpose: ${profile.purposes.join(', ')}` : '',
      profile.impression   ? `Impression: ${profile.impression}` : '',
      selClimate           ? `Climate: ${selClimate.label}` : '',
      profile.additionalNotes,
    ].filter(Boolean)
    try {
      await inquiryService.create({
        gender: profile.gender, occasion: profile.purposes.slice(0, 2).join(', ') || 'Custom Design',
        notes: noteLines, intensity: INTENSITIES[profile.intensityIdx].label,
        fragrance_name: profile.fragranceName || 'To be named',
        customer_name: profile.customerName, customer_phone: profile.customerPhone,
        customer_city: '', additional_notes: extraContext.join('\n'),
      })
      setSaveStatus('saved')
    } catch { setSaveStatus('error') }
    setSubmitted(true)
  }

  const waUrl = buildCustomFragranceOrderUrl({
    family: profile.family, topNotes: profile.topNotes, middleNotes: profile.heartNotes,
    baseNotes: profile.baseNotes, intensityLabel: INTENSITIES[profile.intensityIdx].label,
    fragranceName: profile.fragranceName, customerName: profile.customerName,
    customerPhone: profile.customerPhone, customerEmail: profile.customerEmail,
    additionalNotes: [
      selPersonality ? `Personality: ${selPersonality.name}` : '',
      profile.purposes.length ? `Purpose: ${profile.purposes.join(', ')}` : '',
      profile.impression ? `Impression: ${profile.impression}` : '',
      selClimate ? `Climate: ${selClimate.label}` : '',
      profile.additionalNotes,
    ].filter(Boolean).join('\n'),
  })

  function reset() { setStep(1); setDir(1); setProfile(EMPTY); setSaveStatus('idle'); setSubmitted(false) }

  // ── Submitted ─────────────────────────────────────────────────────────────

  if (submitted) {
    const allNotes = [...profile.topNotes, ...profile.heartNotes, ...profile.baseNotes]
    return (
      <div className="cf-page-bg min-h-screen pt-[72px] md:pt-[80px] flex flex-col items-center justify-center px-6 py-24 text-center">
        <motion.div initial={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 180 }}>
          <motion.div
            className="w-16 h-16 rounded-full border border-[#C8A36A]/40 flex items-center justify-center mx-auto mb-6"
            animate={{ boxShadow: ['0 0 0px rgba(200,163,106,0)', '0 0 30px rgba(200,163,106,0.35)', '0 0 0px rgba(200,163,106,0)'] }}
            transition={{ duration: 2, repeat: Infinity }}>
            <svg viewBox="0 0 24 24" className="w-8 h-8 text-[#C8A36A]" fill="none" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          </motion.div>
          <p className="text-[#C8A36A]/60 text-[10px] font-sans uppercase tracking-[0.28em] mb-3">Your Signature Fragrance</p>
          <h2 className="font-serif text-4xl text-white/88 mb-2">{profile.fragranceName || 'Your Custom Scent'}</h2>
          {selPersonality && <p className="text-white/35 font-sans text-sm mb-6">{selPersonality.name} · {INTENSITIES[profile.intensityIdx].label}</p>}
          {allNotes.length > 0 && (
            <div className="flex flex-wrap justify-center gap-1.5 mb-8 max-w-sm mx-auto">
              {allNotes.map(n => (
                <span key={n} className="px-2 py-0.5 border border-[#C8A36A]/22 text-white/42 text-[10px] font-sans">{n}</span>
              ))}
            </div>
          )}
          <p className="text-white/28 font-sans text-sm mb-10 max-w-sm mx-auto leading-relaxed">
            We will craft your bespoke fragrance and reach out via WhatsApp within 24 hours.
          </p>
          {saveStatus === 'error' && (
            <p className="text-red-400/55 text-[11px] font-sans mb-4 uppercase tracking-[0.1em]">Enquiry not saved — please send via WhatsApp.</p>
          )}
          <div className="flex flex-col items-center gap-3">
            <a href={waUrl} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#25D366] text-white px-8 py-3.5 text-xs font-sans uppercase tracking-[0.15em] hover:bg-[#1EBE5A] transition-colors">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Send via WhatsApp
            </a>
            <button type="button" onClick={reset} className="text-white/18 text-xs font-sans uppercase tracking-[0.15em] hover:text-white/40 transition-colors mt-2">
              Create Another
            </button>
          </div>
        </motion.div>
      </div>
    )
  }

  // ── Main builder ──────────────────────────────────────────────────────────

  return (
    <div className="cf-page-bg min-h-screen pt-[72px] md:pt-[80px]" ref={topRef}>
      <ProgressBar step={step} />

      <div className="cf-form-area">
        <div className="max-w-6xl mx-auto px-4 py-10 flex flex-col lg:flex-row gap-8 lg:gap-14 items-start">

          {/* ── Left: step content ──────────────────────────────────────── */}
          <div className="flex-1 min-w-0">
            <AnimatePresence mode="wait" custom={dir}>
              <motion.div key={step} custom={dir} variants={slide}
                initial="enter" animate="center" exit="exit"
                transition={{ duration: 0.32, ease: [0.4, 0, 0.2, 1] }}
              >

                {/* STEP 1 — IDENTITY */}
                {step === 1 && (
                  <div>
                    <StepHeading step={1} line1="Who Will Wear" line2="This Fragrance?" desc="Your identity shapes everything — notes, character, and intensity." />
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {GENDERS.map(g => (
                        <OptionCard key={g.id} selected={profile.gender === g.id}
                          onClick={() => setProfile(p => ({ ...p, gender: g.id, personality: '' }))}
                          gradient={g.gradient} accent={g.accent} symbol={g.symbol}
                          arabic={g.arabic} title={g.label} subtitle={g.mood} desc={g.desc}
                          className="h-44"
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* STEP 2 — PERSONALITY */}
                {step === 2 && (
                  <div>
                    <StepHeading step={2} line1="Which Personality" line2="Reflects You?" desc="This defines your fragrance direction, notes, and character." />
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {personalities.map(p => (
                        <OptionCard key={p.id} selected={profile.personality === p.id}
                          onClick={() => setProfile(prev => ({ ...prev, personality: p.id }))}
                          gradient={p.gradient} accent={p.accent}
                          title={p.name} subtitle={p.mood} desc={p.desc}
                          className="h-36"
                        />
                      ))}
                    </div>
                    {selPersonality && (
                      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                        className="mt-5 border border-gold/18 bg-gold/[0.04] p-4">
                        <p className="text-gold/55 text-[9px] font-sans uppercase tracking-[0.18em] mb-2">Recommended Notes</p>
                        <div className="flex flex-wrap gap-2">
                          {selPersonality.notes.map(n => (
                            <span key={n} className="px-2.5 py-1 border border-gold/28 text-gold/72 text-[10px] font-sans">{n}</span>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </div>
                )}

                {/* STEP 3 — PURPOSE */}
                {step === 3 && (
                  <div>
                    <StepHeading step={3} line1="Where Will You" line2="Wear This?" desc="Select all occasions that apply — choose as many as you like." />
                    <div className="space-y-7">
                      {PURPOSE_CATEGORIES.map(cat => (
                        <div key={cat.id}>
                          <div className="flex items-center gap-2 mb-3">
                            <span className="text-gold/55 text-xs">{cat.icon}</span>
                            <p className="text-[#4A3020] text-[10px] font-sans uppercase tracking-[0.2em]">{cat.label}</p>
                            <div className="flex-1 h-px bg-brown/08" />
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {cat.options.map(opt => {
                              const sel = profile.purposes.includes(opt)
                              return (
                                <motion.button key={opt} type="button" onClick={() => togglePurpose(opt)}
                                  whileHover={{ y: -2 }} whileTap={{ scale: 0.96 }}
                                  transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                                  className={`px-3.5 py-2 text-[11px] font-sans uppercase tracking-[0.12em] border transition-all duration-300 ${
                                    sel
                                      ? 'bg-[#B08D57] border-[#B08D57] text-[#120900] shadow-[0_2px_12px_rgba(176,141,87,0.40)]'
                                      : 'border-brown/18 text-brown/55 hover:border-gold/40 hover:text-gold/80 hover:bg-gold/5'
                                  }`}
                                >{opt}</motion.button>
                              )
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                    {profile.purposes.length > 0 && (
                      <p className="mt-6 text-gold/55 text-[10px] font-sans">
                        {profile.purposes.length} occasion{profile.purposes.length > 1 ? 's' : ''} selected
                      </p>
                    )}
                  </div>
                )}

                {/* STEP 4 — IMPRESSION */}
                {step === 4 && (
                  <div>
                    <StepHeading step={4} line1="How Should People" line2="Remember You?" desc="Choose the emotion your fragrance will leave behind." />
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {IMPRESSIONS.map(imp => (
                        <OptionCard key={imp.id} selected={profile.impression === imp.id}
                          onClick={() => setProfile(p => ({ ...p, impression: imp.id }))}
                          gradient={imp.gradient} accent={imp.accent}
                          title={imp.label} desc={imp.desc}
                          className="h-24"
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* STEP 5 — FAMILY */}
                {step === 5 && (
                  <div>
                    <StepHeading step={5} line1="Which Fragrance Style" line2="Attracts You?" desc="The soul of your scent." />
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {FAMILIES.map(f => (
                        <OptionCard key={f.id} selected={profile.family === f.id}
                          onClick={() => setProfile(p => ({ ...p, family: f.id }))}
                          gradient={f.gradient} accent={f.accent} symbol={f.symbol}
                          arabic={f.arabic} title={f.name} subtitle={f.mood} desc={f.desc}
                          className="h-36"
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* STEP 6 — STRENGTH */}
                {step === 6 && (
                  <div>
                    <StepHeading step={6} line1="How Powerful" line2="Should It Feel?" desc="Choose the projection and longevity of your signature." />
                    <div className="space-y-3">
                      {INTENSITIES.map((int, i) => {
                        const sel = profile.intensityIdx === i
                        return (
                          <motion.button key={int.label} type="button"
                            onClick={() => setProfile(p => ({ ...p, intensityIdx: i }))}
                            whileHover={{ x: 5, scale: 1.008 }}
                            whileTap={{ scale: 0.99 }}
                            transition={{ type: 'spring', stiffness: 250, damping: 20 }}
                            className={`w-full text-left relative overflow-hidden border transition-all duration-500 ${
                              sel
                                ? 'border-[#C8A36A]/55 shadow-[0_4px_24px_rgba(200,163,106,0.18)]'
                                : 'border-brown/12 hover:border-gold/30'
                            }`}
                          >
                            {/* Card bg */}
                            <div className={`absolute inset-0 bg-gradient-to-br ${int.gradient} transition-opacity duration-500 ${sel ? 'opacity-100' : 'opacity-40'}`} />
                            {/* Top rim */}
                            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/12 to-transparent" />
                            {/* Glow */}
                            {sel && (
                              <div className={`cf-intensity-glow-${i} absolute inset-0 pointer-events-none`} />
                            )}
                            <div className="relative z-10 p-5 flex items-start justify-between gap-4">
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-1.5">
                                  <div className="flex items-end gap-1">
                                    {Array.from({ length: 4 }).map((_, j) => (
                                      <motion.div key={j} className="w-1.5 rounded-sm bg-[#C8A36A]"
                                        animate={{ height: `${8 + j * 5}px`, opacity: sel ? (j <= i ? 0.90 : 0.15) : 0.25 }}
                                        transition={{ duration: 0.4 }}
                                      />
                                    ))}
                                  </div>
                                  <p className={`font-serif text-xl leading-tight transition-colors ${sel ? 'text-white/92' : 'text-white/45'}`}>{int.label}</p>
                                </div>
                                <p className={`text-[10px] font-sans uppercase tracking-[0.16em] mb-1.5 transition-colors ${sel ? 'text-[#C8A36A]/72' : 'text-white/22'}`}>{int.sublabel}</p>
                                <p className={`text-xs font-sans leading-relaxed transition-colors ${sel ? 'text-white/55' : 'text-white/22'}`}>{int.desc}</p>
                              </div>
                              <span className={`text-[10px] font-sans uppercase tracking-[0.12em] whitespace-nowrap transition-colors ${sel ? 'text-[#C8A36A]/55' : 'text-white/18'}`}>
                                {int.sillage}
                              </span>
                            </div>
                          </motion.button>
                        )
                      })}
                    </div>
                  </div>
                )}

                {/* STEP 7 — CLIMATE */}
                {step === 7 && (
                  <div>
                    <StepHeading step={7} line1="Which Weather Will" line2="You Wear It In?" desc="Climate shapes how your fragrance performs and projects." />
                    <div className="grid grid-cols-2 gap-4">
                      {CLIMATES.map(c => (
                        <OptionCard key={c.id} selected={profile.climate === c.id}
                          onClick={() => setProfile(p => ({ ...p, climate: c.id }))}
                          gradient={c.gradient} accent={c.accent}
                          arabic={c.arabic} title={c.label} subtitle={c.mood} desc={c.desc}
                          className="h-40"
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* STEP 8 — NOTES */}
                {step === 8 && (
                  <div>
                    <StepHeading step={8} line1="Build the Soul" line2="of Your Fragrance" desc="Up to 3 notes per layer. Starred notes are recommended for your personality." />
                    {([
                      { key: 'topNotes'   as const, label: 'Top Notes',   sub: 'First impression · 15–30 min',    notes: NOTES_PYRAMID.top,   selected: profile.topNotes,   barClass: 'cf-note-bar-top'   },
                      { key: 'heartNotes' as const, label: 'Heart Notes', sub: 'Core character · 30 min – 4 hrs', notes: NOTES_PYRAMID.heart, selected: profile.heartNotes, barClass: 'cf-note-bar-heart' },
                      { key: 'baseNotes'  as const, label: 'Base Notes',  sub: 'Lasting identity · hours',        notes: NOTES_PYRAMID.base,  selected: profile.baseNotes,  barClass: 'cf-note-bar-base'  },
                    ]).map(({ key, label, sub, notes, selected, barClass }) => (
                      <div key={key} className="mb-8 pb-8 border-b border-brown/08 last:border-0 last:mb-0 last:pb-0">
                        <div className="flex items-baseline gap-3 mb-4">
                          <div className={`${barClass} w-1.5 h-5 rounded-full`} />
                          <p className="text-brown/75 text-xs font-sans uppercase tracking-[0.18em]">{label}</p>
                          <p className="text-brown/60 text-[10px] font-sans">{sub}</p>
                          {selected.length > 0 && <span className="ml-auto text-gold/65 text-[9px] font-sans">{selected.length}/3</span>}
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {notes.map(n => (
                            <NotePill key={n} note={n}
                              selected={selected.includes(n)}
                              onClick={() => toggleNote(key, n)}
                              disabled={selected.length >= 3}
                              recommended={recommendedNotes.includes(n)}
                            />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* STEP 9 — SIGNATURE */}
                {step === 9 && (
                  <div>
                    <StepHeading step={9} line1="Name Your" line2="Fragrance" desc="Give your creation an identity, or let us name it together." />

                    <div className="flex items-center gap-3 mb-7">
                      <span className="text-gold/25 text-xs">◆</span>
                      <div className="flex-1 h-px bg-brown/10" />
                      <span className="text-gold/25 text-xs">◆</span>
                    </div>

                    <input type="text" placeholder="e.g. Midnight Oud, Velvet Crown, Desert Noir..."
                      value={profile.fragranceName}
                      onChange={e => setProfile(p => ({ ...p, fragranceName: e.target.value }))}
                      className="w-full bg-transparent border-b border-brown/18 px-0 py-4 text-2xl font-serif text-brown placeholder-brown/25 focus:outline-none focus:border-gold/55 transition-colors text-center"
                    />

                    <div className="flex flex-wrap justify-center gap-2 mt-5 mb-8">
                      {NAME_SUGGESTIONS.map(s => (
                        <motion.button key={s} type="button"
                          onClick={() => setProfile(p => ({ ...p, fragranceName: s }))}
                          whileHover={{ y: -2 }} whileTap={{ scale: 0.96 }}
                          transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                          className={`px-3 py-1.5 text-[10px] font-sans uppercase tracking-[0.12em] border transition-all duration-300 ${
                            profile.fragranceName === s
                              ? 'border-gold/55 text-gold/85 bg-gold/10'
                              : 'border-brown/14 text-brown/45 hover:border-gold/38 hover:text-gold/68'
                          }`}
                        >{s}</motion.button>
                      ))}
                    </div>

                    <div className="flex items-center gap-3 mb-7">
                      <div className="flex-1 h-px bg-brown/10" />
                      <span className="text-gold/25 text-xs">◆</span>
                      <div className="flex-1 h-px bg-brown/10" />
                    </div>

                    <p className="text-[#4A3020] text-[10px] font-sans uppercase tracking-[0.2em] mb-5">Your Details</p>
                    <div className="space-y-4">
                      {[
                        { key: 'customerName',  label: 'Full Name *',        placeholder: 'Your name',      type: 'text'  },
                        { key: 'customerPhone', label: 'WhatsApp / Phone *', placeholder: '+91 98...',      type: 'tel'   },
                        { key: 'customerEmail', label: 'Email (optional)',    placeholder: 'your@email.com', type: 'email' },
                      ].map(({ key, label, placeholder, type }) => (
                        <div key={key}>
                          <label className="block text-brown/52 text-[9px] font-sans uppercase tracking-[0.18em] mb-1.5">{label}</label>
                          <input type={type} placeholder={placeholder}
                            value={profile[key as keyof Profile] as string}
                            onChange={e => setProfile(p => ({ ...p, [key]: e.target.value }))}
                            className="w-full bg-white/65 border border-brown/14 px-4 py-3 text-sm text-brown placeholder-brown/28 font-sans focus:outline-none focus:border-gold/48 transition-colors"
                          />
                        </div>
                      ))}
                      <div>
                        <label className="block text-brown/52 text-[9px] font-sans uppercase tracking-[0.18em] mb-1.5">Additional Notes</label>
                        <textarea rows={3} placeholder="Any specific preferences, inspirations, or questions..."
                          value={profile.additionalNotes}
                          onChange={e => setProfile(p => ({ ...p, additionalNotes: e.target.value }))}
                          className="w-full bg-white/65 border border-brown/14 px-4 py-3 text-sm text-brown placeholder-brown/28 font-sans resize-none focus:outline-none focus:border-gold/48 transition-colors"
                        />
                      </div>
                    </div>
                  </div>
                )}

              </motion.div>
            </AnimatePresence>

            {/* Navigation */}
            <div className="flex items-center justify-between mt-12 pt-6 border-t border-brown/10">
              {step > 1 ? (
                <motion.button type="button" onClick={() => go(step - 1)}
                  whileHover={{ x: -2 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 22 }}
                  className="group relative flex items-center gap-3 px-5 py-2.5 border border-brown/18 text-[#5A3927] text-[10px] font-sans uppercase tracking-[0.20em] hover:border-gold/45 hover:text-brown transition-all duration-400 overflow-hidden">
                  {/* Hover fill */}
                  <span className="absolute inset-0 bg-gold/[0.06] opacity-0 group-hover:opacity-100 transition-opacity duration-400" />
                  {/* Animated arrow */}
                  <motion.svg viewBox="0 0 16 16" className="relative z-10 w-3 h-3 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={1.8}
                    animate={{ x: 0 }}
                    whileHover={{ x: -3 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 20 }}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 8H3M7 4l-4 4 4 4" />
                  </motion.svg>
                  <span className="relative z-10">Back</span>
                </motion.button>
              ) : <span />}

              {step < 9 ? (
                <button type="button" onClick={() => go(step + 1)} disabled={!canAdvance()}
                  className="cf-btn-primary inline-flex items-center gap-2.5 px-10 py-3.5 text-xs font-sans uppercase tracking-[0.18em] font-semibold disabled:opacity-30 disabled:cursor-not-allowed">
                  Continue
                  <svg viewBox="0 0 16 16" className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8h10M9 4l4 4-4 4" />
                  </svg>
                </button>
              ) : (
                <button type="button" onClick={handleSubmit}
                  disabled={!canAdvance() || saveStatus === 'saving'}
                  className="cf-btn-primary inline-flex items-center gap-2.5 px-10 py-3.5 text-xs font-sans uppercase tracking-[0.18em] font-semibold disabled:opacity-30 disabled:cursor-not-allowed">
                  {saveStatus === 'saving' ? 'Sending...' : 'Send Enquiry →'}
                </button>
              )}
            </div>
          </div>

          {/* ── Right: preview ───────────────────────────────────────────── */}
          <RightPanel profile={profile} step={step} />

        </div>
      </div>
    </div>
  )
}
