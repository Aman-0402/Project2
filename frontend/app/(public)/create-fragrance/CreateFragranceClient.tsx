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
  { id: 'male',   label: 'Male',   arabic: 'رجال',    symbol: '◈', mood: 'Dark Woody · Powerful · Elegant',    desc: 'For the man who commands presence',        gradient: 'from-amber-950 via-stone-900 to-zinc-950',   accent: '#C8973A' },
  { id: 'female', label: 'Female', arabic: 'نساء',    symbol: '✿', mood: 'Floral Luxury · Soft · Glamorous',   desc: 'For the woman who defines elegance',       gradient: 'from-rose-950 via-purple-950 to-pink-950',   accent: '#D4789A' },
  { id: 'unisex', label: 'Unisex', arabic: 'مشترك',  symbol: '◇', mood: 'Modern Luxury · Minimal · Niche',    desc: 'For those who transcend categories',       gradient: 'from-slate-900 via-neutral-900 to-zinc-950', accent: '#94A3B8' },
]

interface PersonalityItem {
  id: string; name: string; notes: string[]; mood: string; desc: string; accent: string; gradient: string
}

const PERSONALITIES: Record<string, PersonalityItem[]> = {
  male: [
    { id: 'royal',       name: 'Royal & Powerful',     notes: ['Oud', 'Amber', 'Saffron', 'Leather'],              mood: 'Authority · King Energy',        desc: 'You carry royalty in every step',        accent: '#C8973A', gradient: 'from-yellow-950 via-amber-950 to-stone-900'  },
    { id: 'gentleman',   name: 'Gentleman & Elegant',  notes: ['Tobacco', 'Vanilla', 'Sandalwood', 'Musk'],        mood: 'Classy · Mature · Expensive',    desc: 'Refined sophistication, always',         accent: '#B8945A', gradient: 'from-amber-950 via-stone-900 to-yellow-950'  },
    { id: 'bold',        name: 'Bold & Dangerous',     notes: ['Smoky Woods', 'Black Pepper', 'Leather', 'Dark Oud'], mood: 'Mysterious · Seductive',       desc: 'A force that cannot be ignored',         accent: '#DC4040', gradient: 'from-red-950 via-rose-950 to-stone-950'      },
    { id: 'calm',        name: 'Calm & Mature',        notes: ['Woody', 'Vetiver', 'Musk', 'Cedarwood'],           mood: 'Peaceful · Wise · Premium',      desc: 'Quiet confidence, rare refinement',      accent: '#7C9A7C', gradient: 'from-green-950 via-stone-900 to-zinc-950'     },
    { id: 'businessman', name: 'Luxury Businessman',   notes: ['Amber', 'Woody Musk', 'Leather', 'Tobacco'],       mood: 'CEO Energy · Confidence',        desc: 'Boardroom presence, signature power',    accent: '#A07848', gradient: 'from-amber-950 via-yellow-950 to-zinc-950'    },
    { id: 'sporty',      name: 'Gym & Sporty',         notes: ['Citrus', 'Aqua', 'Mint', 'Fresh Musk'],            mood: 'Energetic · Clean · Active',     desc: 'Freshness in motion',                    accent: '#4ABEDC', gradient: 'from-cyan-950 via-sky-950 to-blue-950'        },
    { id: 'romantic',    name: 'Romantic',             notes: ['Rose', 'Vanilla', 'White Musk'],                   mood: 'Warm · Emotional · Attractive',  desc: 'The fragrance of connection',            accent: '#C084A8', gradient: 'from-rose-950 via-purple-950 to-pink-950'     },
    { id: 'mysterious',  name: 'Mysterious',           notes: ['Incense', 'Oud', 'Smoke', 'Amber'],                mood: 'Dark Luxury · Enigmatic',        desc: 'Known by the trail you leave',           accent: '#7B68B0', gradient: 'from-purple-950 via-indigo-950 to-slate-950'  },
  ],
  female: [
    { id: 'elegant',       name: 'Elegant & Classy',       notes: ['White Floral', 'Musk', 'Sandalwood'],       mood: 'Graceful · Timeless',             desc: 'Timeless femininity, never dated',       accent: '#D4B8A0', gradient: 'from-rose-950 via-stone-900 to-amber-950'   },
    { id: 'cute',          name: 'Cute & Sweet',           notes: ['Vanilla', 'Fruity Floral', 'Soft Musk'],    mood: 'Playful · Youthful',              desc: 'Sweet as a summer bloom',                accent: '#F0A0C0', gradient: 'from-pink-950 via-rose-950 to-fuchsia-950'  },
    { id: 'bold_f',        name: 'Bold & Independent',     notes: ['Leather', 'Woody Floral', 'Dark Rose'],     mood: 'Confident · Modern · Fearless',   desc: 'She needs no validation',                accent: '#C04878', gradient: 'from-rose-950 via-purple-950 to-zinc-950'   },
    { id: 'queen',         name: 'Luxury Queen',           notes: ['Rose Oud', 'Amber', 'Vanilla'],             mood: 'Royal Femininity · Lavish',       desc: 'Born to reign, dressed in scent',        accent: '#D4943A', gradient: 'from-amber-950 via-yellow-950 to-rose-950'  },
    { id: 'romantic_f',    name: 'Soft & Romantic',        notes: ['Powdery Floral', 'Rose', 'White Musk'],     mood: 'Dreamy · Delicate',               desc: 'A love letter in scent form',            accent: '#E8A0C0', gradient: 'from-pink-950 via-rose-950 to-purple-950'   },
    { id: 'glamorous',     name: 'Glamorous',              notes: ['Sweet Amber', 'Jasmine', 'Vanilla'],        mood: 'Attention-Grabbing · Vivid',      desc: 'Every room notices your arrival',        accent: '#C8A03A', gradient: 'from-amber-950 via-yellow-950 to-orange-950' },
    { id: 'minimalist',    name: 'Modern Minimalist',      notes: ['Clean Musk', 'Bergamot', 'White Tea'],      mood: 'Niche Luxury · Pure',             desc: 'Understated, unmistakable',              accent: '#B0C0D0', gradient: 'from-slate-900 via-blue-950 to-zinc-950'    },
    { id: 'professional_f', name: 'Confident Professional', notes: ['Woody Floral', 'Musk', 'Soft Leather'],   mood: 'Polished · Premium',              desc: 'Power in every meeting',                 accent: '#A89070', gradient: 'from-stone-900 via-amber-950 to-zinc-950'   },
  ],
  unisex: [
    { id: 'premium',     name: 'Premium Luxury',          notes: ['Amber', 'Musk', 'Oud'],                       mood: 'Niche Luxury · Rare',             desc: 'For those who know the difference',      accent: '#C8A36A', gradient: 'from-amber-950 via-stone-900 to-yellow-950'  },
    { id: 'fresh_min',   name: 'Fresh Minimal',           notes: ['Citrus', 'Green Tea', 'White Musk'],          mood: 'Clean Premium · Crisp',           desc: 'Clarity is the ultimate luxury',         accent: '#88D8B0', gradient: 'from-emerald-950 via-teal-950 to-cyan-950'   },
    { id: 'arabic',      name: 'Arabic Royal',            notes: ['Oud', 'Incense', 'Leather'],                  mood: 'Traditional Heritage',            desc: 'The ancient art of attar',               accent: '#D4943A', gradient: 'from-amber-950 via-yellow-950 to-orange-950' },
    { id: 'international', name: 'Modern International', notes: ['Aqua Woods', 'Musk', 'Bergamot'],             mood: 'Global Niche',                    desc: 'Speaks every fragrance language',        accent: '#70A8D8', gradient: 'from-blue-950 via-slate-900 to-indigo-950'   },
    { id: 'nature',      name: 'Nature Inspired',         notes: ['Green Leaves', 'Vetiver', 'Cedarwood'],       mood: 'Earthy · Organic · Wild',         desc: 'Raw beauty of the natural world',        accent: '#78B878', gradient: 'from-green-950 via-emerald-950 to-teal-950'  },
    { id: 'dark_smoky',  name: 'Dark & Smoky',            notes: ['Smoke', 'Leather', 'Dark Oud'],               mood: 'Intense · Mysterious',            desc: 'Where fire meets luxury',                accent: '#A08070', gradient: 'from-stone-900 via-zinc-950 to-neutral-950'  },
    { id: 'clean_pro',   name: 'Clean & Professional',    notes: ['Musk', 'Citrus', 'White Woods'],              mood: 'Elegant · Sharp',                 desc: 'Precision in every molecule',            accent: '#C0D0E0', gradient: 'from-slate-900 via-blue-950 to-zinc-950'     },
    { id: 'oud_lover',   name: 'Rich Oud Lover',          notes: ['Pure Oud', 'Amber', 'Saffron'],               mood: 'Premium Arabic Identity',         desc: 'The throne of all fragrances',           accent: '#D4882A', gradient: 'from-amber-950 via-orange-950 to-yellow-950' },
  ],
}

const PURPOSE_CATEGORIES = [
  { id: 'daily',        label: 'Daily Use',          icon: '◎', options: ['Daily Life', 'Office', 'College', 'Casual Wear', 'Home', 'Gym', 'Field Work'] },
  { id: 'events',       label: 'Events & Social',    icon: '✦', options: ['Wedding', 'Reception', 'Party', 'Date Night', 'VIP Event', 'Night Life', 'Religious Event'] },
  { id: 'professional', label: 'Professional',       icon: '◈', options: ['Formal Meeting', 'Client Meeting', 'Luxury Business Event'] },
  { id: 'travel',       label: 'Travel & Lifestyle', icon: '◇', options: ['Travelling Abroad', 'Vacation', 'Business Travel', 'Airport Look', 'Long Drive', 'Luxury Hotel Stay'] },
]

const IMPRESSIONS = [
  { id: 'attractive',   label: 'Attractive',       desc: 'Warm seductive glow',        accent: '#E87060', gradient: 'from-rose-950 via-red-950 to-orange-950'    },
  { id: 'rich',         label: 'Rich & Luxurious', desc: 'Gold royal aura',             accent: '#D4943A', gradient: 'from-amber-950 via-yellow-950 to-stone-900'  },
  { id: 'fresh',        label: 'Fresh & Clean',    desc: 'Cool aqua freshness',         accent: '#60C8E8', gradient: 'from-cyan-950 via-sky-950 to-teal-950'       },
  { id: 'powerful',     label: 'Powerful',         desc: 'Dark amber intensity',        accent: '#A06828', gradient: 'from-amber-950 via-orange-950 to-stone-950'  },
  { id: 'romantic',     label: 'Romantic',         desc: 'Soft rose atmosphere',        accent: '#D87090', gradient: 'from-rose-950 via-pink-950 to-purple-950'    },
  { id: 'mysterious',   label: 'Mysterious',       desc: 'Smoky shadows',               accent: '#8870B0', gradient: 'from-purple-950 via-indigo-950 to-slate-950' },
  { id: 'professional', label: 'Professional',     desc: 'Clean silver minimalism',     accent: '#9AAABB', gradient: 'from-slate-900 via-blue-950 to-zinc-950'     },
  { id: 'calm',         label: 'Calm & Relaxing',  desc: 'Soft earthy tones',           accent: '#88A878', gradient: 'from-green-950 via-emerald-950 to-stone-900' },
  { id: 'sexy',         label: 'Sexy & Seductive', desc: 'Deep crimson aura',           accent: '#C03048', gradient: 'from-red-950 via-rose-950 to-pink-950'       },
  { id: 'royal',        label: 'Royal',            desc: 'Black & gold richness',       accent: '#C8A036', gradient: 'from-yellow-950 via-amber-950 to-zinc-950'   },
  { id: 'unique',       label: 'Unique & Rare',    desc: 'Niche artistic styling',      accent: '#A080C8', gradient: 'from-purple-950 via-fuchsia-950 to-indigo-950' },
  { id: 'confident',    label: 'Confident',        desc: 'Sharp modern luxury',         accent: '#4888D8', gradient: 'from-blue-950 via-indigo-950 to-slate-900'   },
]

const FAMILIES = [
  { id: 'oud',      name: 'Oud / Arabic',   arabic: 'عود',     symbol: '◆', mood: 'Ancient · Smoky · Regal',   desc: 'The king of all fragrances',    gradient: 'from-amber-950 via-stone-900 to-yellow-950',    accent: '#D4943A' },
  { id: 'woody',    name: 'Woody',          arabic: 'خشب',     symbol: '▲', mood: 'Earthy · Grounded · Warm',  desc: "Nature's deep embrace",          gradient: 'from-green-950 via-stone-900 to-lime-950',      accent: '#86EFAC' },
  { id: 'musk',     name: 'Musky',          arabic: 'مسك',     symbol: '◇', mood: 'Clean · Celestial · Bare',  desc: 'Your second skin',               gradient: 'from-slate-900 via-blue-950 to-indigo-950',     accent: '#93C5FD' },
  { id: 'floral',   name: 'Floral',         arabic: 'زهور',    symbol: '✿', mood: 'Romantic · Soft · Blooming', desc: 'Garden of eternal summer',      gradient: 'from-purple-950 via-rose-950 to-pink-950',      accent: '#C084FC' },
  { id: 'fresh',    name: 'Fresh Aqua',     arabic: 'نضارة',   symbol: '◎', mood: 'Airy · Ocean · Crisp',      desc: 'Wind and sea in one breath',     gradient: 'from-emerald-950 via-teal-950 to-cyan-950',     accent: '#6EE7B7' },
  { id: 'citrus',   name: 'Citrus',         arabic: 'حمضي',    symbol: '◉', mood: 'Bright · Energetic · Zesty', desc: 'Burst of liquid sunshine',      gradient: 'from-yellow-950 via-orange-950 to-amber-950',   accent: '#FCD34D' },
  { id: 'vanilla',  name: 'Sweet Vanilla',  arabic: 'فانيليا', symbol: '✦', mood: 'Warm · Sweet · Comforting',  desc: 'Luxury in its softest form',    gradient: 'from-amber-950 via-yellow-950 to-orange-950',   accent: '#FCA5A5' },
  { id: 'smoky',    name: 'Smoky',          arabic: 'دخاني',   symbol: '◈', mood: 'Mysterious · Dark · Alluring', desc: 'Midnight without borders',    gradient: 'from-stone-900 via-zinc-950 to-neutral-950',    accent: '#A8A0B8' },
  { id: 'spicy',    name: 'Spicy',          arabic: 'حار',     symbol: '◆', mood: 'Bold · Fiery · Magnetic',   desc: 'Heat that lingers',              gradient: 'from-red-950 via-orange-950 to-amber-950',      accent: '#F87171' },
  { id: 'powdery',  name: 'Powdery',        arabic: 'ناعم',    symbol: '✿', mood: 'Soft · Delicate · Pure',    desc: 'Velvet on your skin',            gradient: 'from-pink-950 via-fuchsia-950 to-purple-950',   accent: '#F0ABFC' },
  { id: 'green',    name: 'Green Natural',  arabic: 'أخضر',    symbol: '▲', mood: 'Forest · Organic · Wild',   desc: 'The forest after rain',          gradient: 'from-green-950 via-emerald-950 to-teal-950',    accent: '#86EFAC' },
  { id: 'leather',  name: 'Leather',        arabic: 'جلد',     symbol: '◈', mood: 'Raw · Bold · Masculine',    desc: 'Power in its rawest form',       gradient: 'from-amber-950 via-stone-900 to-zinc-950',      accent: '#C4955A' },
  { id: 'oriental', name: 'Oriental',       arabic: 'شرقي',    symbol: '✦', mood: 'Exotic · Spiced · Warm',    desc: 'East in every breath',           gradient: 'from-red-950 via-orange-950 to-amber-950',      accent: '#FCA5A5' },
]

const INTENSITIES = [
  { label: 'Skin Close',  sublabel: 'Intimate & Subtle',     desc: 'Whispers only to those nearest. A private, personal signature.',   sillage: '0 – 30 cm radius'  },
  { label: 'Moderate',    sublabel: 'Versatile Luxury',       desc: 'Natural everyday presence. Balanced, never overwhelming.',         sillage: '30 – 100 cm radius' },
  { label: 'Strong',      sublabel: 'Premium Projection',     desc: 'Announces your arrival. Confident and unforgettable.',             sillage: '1 – 3 m radius'    },
  { label: 'Beast Mode',  sublabel: 'Ultra Long-Lasting',     desc: 'Massive presence. Fills every room. 12+ hours longevity.',         sillage: '3+ m radius'       },
]

const CLIMATES = [
  { id: 'summer', label: 'Summer',      arabic: 'صيف',         desc: 'Fresh citrus & aqua notes thrive in heat',     mood: 'Hot · Bright · Energetic',    accent: '#FCD34D', gradient: 'from-yellow-950 via-orange-950 to-amber-950' },
  { id: 'winter', label: 'Winter',      arabic: 'شتاء',        desc: 'Rich warm oriental woods shine in cold air',   mood: 'Cold · Deep · Warming',       accent: '#93C5FD', gradient: 'from-blue-950 via-indigo-950 to-slate-900'   },
  { id: 'rainy',  label: 'Rainy Season', arabic: 'مطر',        desc: 'Green earthy freshness blooms after rain',     mood: 'Petrichor · Fresh · Calming', accent: '#6EE7B7', gradient: 'from-teal-950 via-emerald-950 to-green-950'  },
  { id: 'all',    label: 'All Season',  arabic: 'كل المواسم',  desc: 'Balanced formula for any weather, any day',    mood: 'Universal · Timeless',        accent: '#C8A36A', gradient: 'from-amber-950 via-stone-900 to-slate-900'   },
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
  enter:  (d: number) => ({ x: d > 0 ? 48 : -48, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit:   (d: number) => ({ x: d > 0 ? -48 : 48, opacity: 0 }),
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
      whileHover={{ y: -4, scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 300, damping: 22 }}
      style={{ '--cf-accent': accent } as React.CSSProperties}
      className={`cf-family-card${selected ? ' cf-family-card--selected' : ''} relative overflow-hidden rounded-lg text-left p-4 border cursor-pointer ${
        selected ? 'border-[#C8A36A]/65' : 'border-white/[0.15] hover:border-[#C8A36A]/35'
      } ${className}`}
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} transition-opacity duration-500 ${selected ? 'opacity-100' : 'opacity-75'}`} />
      <div className="cf-card-shimmer" aria-hidden="true" />
      {arabic && <div className="cf-arabic-wm" aria-hidden="true">{arabic}</div>}
      {selected && <div className="cf-selected-ring absolute inset-0 rounded-lg pointer-events-none" />}
      <div className="relative z-10 flex flex-col h-full justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-serif text-white/95 text-sm leading-tight">{title}</span>
            {symbol && <span className="cf-family-symbol">{symbol}</span>}
          </div>
          {subtitle && <p className="cf-family-mood">{subtitle}</p>}
          {desc && <p className="text-white/35 text-[10px] font-sans leading-snug mt-0.5">{desc}</p>}
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

function DarkBottle({ fillPercent, accent }: { fillPercent: number; accent: string }) {
  const BY = 58, BH = 128
  const lH = Math.max(0, (fillPercent / 100) * BH)
  const lY = BY + BH - lH
  return (
    <svg viewBox="0 0 120 212" className="w-full h-full drop-shadow-2xl" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <clipPath id="dk-clip"><rect x="18" y={BY} width="84" height={BH} rx="10" /></clipPath>
        <linearGradient id="dk-liq" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={accent} stopOpacity="0.6" />
          <stop offset="55%" stopColor={accent} stopOpacity="0.9" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0.15" />
        </linearGradient>
        <linearGradient id="dk-body" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#1a0e05" /><stop offset="50%" stopColor="#2a1a0a" /><stop offset="100%" stopColor="#1a0e05" />
        </linearGradient>
        <linearGradient id="dk-shine" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.07" />
          <stop offset="40%" stopColor="#FFFFFF" stopOpacity="0.02" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
        </linearGradient>
      </defs>
      <rect x="54" y="2" width="12" height="5" rx="3" fill={accent} opacity="0.7" />
      <rect x="58" y="2" width="4" height="10" rx="2" fill={accent} opacity="0.5" />
      <rect x="38" y="7" width="44" height="20" rx="6" fill="#2a1a0a" />
      <rect x="41" y="10" width="38" height="14" rx="5" fill="#3a2510" />
      <rect x="43" y="11" width="10" height="12" rx="2" fill={accent} opacity="0.1" />
      <rect x="49" y="27" width="22" height="22" rx="1" fill="#2a1a0a" />
      <path d="M49 49 Q33 54 18 58 L102 58 Q87 54 71 49 Z" fill={accent} opacity="0.08" />
      <rect x="18" y={BY} width="84" height={BH} rx="10" fill="url(#dk-body)" />
      <motion.rect x="18" width="84" clipPath="url(#dk-clip)" fill="url(#dk-liq)"
        initial={{ y: BY + BH, height: 0 }}
        animate={{ y: lY, height: lH }}
        transition={{ duration: 1.2, ease: [0.34, 1.56, 0.64, 1] }}
      />
      <rect x="18" y={BY} width="84" height={BH} rx="10" fill="url(#dk-shine)" />
      <rect x="26" y={BY + 8} width="6" height={BH - 22} rx="3" fill="white" opacity="0.05" />
      <rect x="18" y={BY} width="84" height={BH} rx="10" stroke={accent} strokeWidth="1" strokeOpacity="0.35" fill="none" />
      {/* Label */}
      <line x1="34" y1={BY + 14} x2="86" y2={BY + 14} stroke={accent} strokeWidth="0.5" strokeOpacity="0.35" />
      <text x="60" y={BY + 27} textAnchor="middle" fontFamily="Georgia, serif" fontSize="9" letterSpacing="4" fill={accent} fillOpacity="0.75">M.M</text>
      <text x="60" y={BY + 35} textAnchor="middle" fontFamily="Georgia, serif" fontSize="5" fill={accent} fillOpacity="0.35">◆</text>
      <text x="60" y={BY + 45} textAnchor="middle" fontFamily="Arial, sans-serif" fontSize="5" letterSpacing="2.5" fill={accent} fillOpacity="0.55">ATTARWALA</text>
      <line x1="34" y1={BY + 50} x2="86" y2={BY + 50} stroke={accent} strokeWidth="0.5" strokeOpacity="0.35" />
      <ellipse cx="60" cy={BY + BH + 6} rx="36" ry="4" fill={accent} opacity="0.07" />
    </svg>
  )
}

// ── Progress Bar ───────────────────────────────────────────────────────────────

function ProgressBar({ step }: { step: number }) {
  const pct = ((step - 1) / (STEPS.length - 1)) * 100
  return (
    <div className="cf-stepbar sticky top-[72px] md:top-[80px] z-20 bg-[#1C1208]/90 backdrop-blur-xl border-b border-[#C8A36A]/20 px-4 py-3">
      <div className="max-w-6xl mx-auto">
        <div className="relative h-px bg-white/[0.06] mb-3">
          <motion.div className="absolute left-0 top-0 h-full bg-[#C8A36A]"
            animate={{ width: `${pct}%` }} transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }} />
          <motion.div className="absolute left-0 top-0 h-3 -top-1 blur-sm bg-[#C8A36A]/40"
            animate={{ width: `${pct}%` }} transition={{ duration: 0.5 }} />
        </div>
        <div className="flex items-center justify-between">
          {STEPS.map((label, i) => {
            const done   = step > i + 1
            const active = step === i + 1
            return (
              <div key={label} className="flex flex-col items-center gap-1">
                <div className={`w-5 h-5 rounded-full border flex items-center justify-center text-[8px] transition-all duration-300 ${
                  done   ? 'bg-[#C8A36A] border-[#C8A36A] text-[#120900]'
                  : active ? 'bg-transparent border-[#C8A36A] text-[#C8A36A]'
                           : 'bg-transparent border-white/10 text-white/15'
                }`}>
                  {done ? (
                    <svg viewBox="0 0 16 16" className="w-2.5 h-2.5" fill="none" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 8.5l3.5 3.5 6.5-7" />
                    </svg>
                  ) : i + 1}
                </div>
                <span className={`hidden sm:block text-[7px] font-sans uppercase tracking-[0.12em] transition-colors ${
                  done || active ? 'text-[#C8A36A]' : 'text-white/10'
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

  const accent  = selFamily?.accent ?? selImpression?.accent ?? selPersonality?.accent ?? selGender?.accent ?? '#B08D57'
  const fill    = step >= 5 && profile.family
    ? Math.min(100, Math.max(15, ((step - 1) / 8) * 88 + 12))
    : Math.max(0, (step / 9) * 18)
  const allNotes = [...profile.topNotes, ...profile.heartNotes, ...profile.baseNotes]

  // Notes to show around bottle — prefer selected notes, fallback to personality recommendations
  const displayNotes = (allNotes.length > 0 ? allNotes : selPersonality?.notes ?? []).slice(0, 4)

  // Label helpers for note positions
  const notePositions = [
    { top: 'top-8',    side: 'left-3',  align: 'items-start text-left',  icon: '◆', layer: 'Top'    },
    { top: 'top-8',    side: 'right-3', align: 'items-end text-right',   icon: '○', layer: 'Heart'  },
    { top: 'bottom-8', side: 'left-3',  align: 'items-start text-left',  icon: '≋', layer: 'Base'   },
    { top: 'bottom-8', side: 'right-3', align: 'items-end text-right',   icon: '▲', layer: 'Base'   },
  ]

  return (
    <div className="w-full lg:w-72 xl:w-80 flex-shrink-0 lg:sticky lg:top-[180px] space-y-3">

      {/* ── Bottle showcase ─────────────────────────────────────────── */}
      <div className="cf-preview-panel border border-[#C8A36A]/22 bg-[#0E0804]/60 backdrop-blur-sm overflow-hidden">

        {/* Showcase canvas */}
        <div className="cf-showcase-canvas relative flex items-center justify-center">

          {/* Corner brackets */}
          <div className="absolute top-4 left-4 w-7 h-7 border-t border-l border-[#C8A36A]/30 pointer-events-none" />
          <div className="absolute top-4 right-4 w-7 h-7 border-t border-r border-[#C8A36A]/30 pointer-events-none" />
          <div className="absolute bottom-4 left-4 w-7 h-7 border-b border-l border-[#C8A36A]/30 pointer-events-none" />
          <div className="absolute bottom-4 right-4 w-7 h-7 border-b border-r border-[#C8A36A]/30 pointer-events-none" />

          {/* Circular decorative rings */}
          <div className="absolute w-52 h-52 rounded-full border border-[#C8A36A]/07 pointer-events-none" />
          <div className="absolute w-40 h-40 rounded-full border border-[#C8A36A]/05 pointer-events-none" />

          {/* Ambient glow */}
          <div className="cf-showcase-glow absolute w-36 h-36 rounded-full blur-3xl opacity-10 pointer-events-none transition-colors duration-700"
            style={{ '--cf-accent': accent } as React.CSSProperties} />

          {/* Scattered dots */}
          <div className="absolute top-10 left-10 w-[3px] h-[3px] rounded-full bg-[#C8A36A]/25 pointer-events-none" />
          <div className="absolute top-14 right-12 w-[2px] h-[2px] rounded-full bg-[#C8A36A]/18 pointer-events-none" />
          <div className="absolute bottom-12 left-14 w-[2px] h-[2px] rounded-full bg-[#C8A36A]/20 pointer-events-none" />
          <div className="absolute bottom-10 right-10 w-[3px] h-[3px] rounded-full bg-[#C8A36A]/15 pointer-events-none" />
          <div className="absolute top-1/2 left-5 w-[2px] h-[2px] rounded-full bg-[#C8A36A]/12 pointer-events-none" />
          <div className="absolute top-1/3 right-6 w-[2px] h-[2px] rounded-full bg-[#C8A36A]/12 pointer-events-none" />

          {/* Note labels (4 corners around bottle) */}
          {displayNotes.map((note, i) => {
            const pos = notePositions[i]
            return (
              <motion.div key={note}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ delay: i * 0.1 }}
                className={`absolute ${pos.top} ${pos.side} flex flex-col ${pos.align} gap-1 pointer-events-none`}
              >
                <div className="w-6 h-6 border border-[#C8A36A]/25 flex items-center justify-center">
                  <span className="text-[#C8A36A]/45 text-[8px]">{pos.icon}</span>
                </div>
                <p className="text-[#C8A36A]/65 text-[7.5px] font-sans uppercase tracking-[0.18em] leading-none">{note}</p>
                <p className="text-white/18 text-[6.5px] font-sans">{pos.layer}</p>
              </motion.div>
            )
          })}

          {/* Bottle */}
          <div className="relative w-32 h-52 z-10">
            <DarkBottle fillPercent={fill} accent={accent} />
          </div>
        </div>

        {/* Bottom label */}
        <div className="px-5 pb-5 pt-3 text-center border-t border-[#C8A36A]/08">
          {profile.fragranceName ? (
            <>
              <p className="font-serif text-white/70 text-base italic mb-1">{profile.fragranceName}</p>
              <p className="text-[#C8A36A]/30 text-[8px] font-sans uppercase tracking-[0.25em]">M.M ATTARWALA</p>
            </>
          ) : selGender ? (
            <>
              <p className="text-white/22 text-[9px] font-sans uppercase tracking-[0.22em] mb-0.5">{selGender.label} · {selGender.mood.split('·')[0].trim()}</p>
              <p className="text-[#C8A36A]/25 text-[7px] font-sans uppercase tracking-[0.25em]">M.M ATTARWALA</p>
            </>
          ) : (
            <p className="text-white/15 text-[9px] font-sans uppercase tracking-[0.2em]">Your Signature Fragrance</p>
          )}
        </div>
      </div>

      {/* DNA card */}
      {step >= 2 && (selPersonality ?? selFamily ?? selImpression ?? allNotes.length > 0) && (
        <div className="cf-preview-panel border border-[#C8A36A]/20 bg-[#C8A36A]/[0.03] backdrop-blur-sm p-4 space-y-3">
          <p className="text-[#C8A36A]/45 text-[8px] font-sans uppercase tracking-[0.22em]">Fragrance DNA</p>
          {selPersonality && (
            <div>
              <p className="text-white/25 text-[8px] font-sans uppercase tracking-[0.15em] mb-0.5">Personality</p>
              <p className="font-serif text-white/80 text-sm leading-tight">{selPersonality.name}</p>
              <p className="text-white/28 text-[9px] font-sans mt-0.5">{selPersonality.mood}</p>
            </div>
          )}
          {selImpression && step >= 4 && (
            <div>
              <p className="text-white/25 text-[8px] font-sans uppercase tracking-[0.15em] mb-0.5">Impression</p>
              <p className="text-white/65 text-xs font-sans">{selImpression.label}</p>
              <p className="text-white/22 text-[9px] font-sans">{selImpression.desc}</p>
            </div>
          )}
          {selFamily && step >= 5 && (
            <div>
              <p className="text-white/25 text-[8px] font-sans uppercase tracking-[0.15em] mb-0.5">Family</p>
              <p className="text-white/65 text-xs font-sans">{selFamily.name}</p>
            </div>
          )}
          {selClimate && step >= 7 && (
            <div>
              <p className="text-white/25 text-[8px] font-sans uppercase tracking-[0.15em] mb-0.5">Climate</p>
              <p className="text-white/65 text-xs font-sans">{selClimate.label}</p>
            </div>
          )}
          {allNotes.length > 0 && step >= 8 && (
            <div>
              <p className="text-white/25 text-[8px] font-sans uppercase tracking-[0.15em] mb-1.5">Notes</p>
              <div className="flex flex-wrap gap-1">
                {allNotes.map(n => (
                  <span key={n} className="px-1.5 py-0.5 rounded border border-[#C8A36A]/18 text-white/42 text-[8px] font-sans">{n}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Intensity bars */}
      <div className="cf-preview-panel border border-[#C8A36A]/18 bg-[#C8A36A]/[0.03] backdrop-blur-sm p-4">
        <p className="text-[#C8A36A]/45 text-[8px] font-sans uppercase tracking-[0.22em] mb-3 text-center">Projection</p>
        <div className="flex items-end justify-center gap-2 mb-2">
          {INTENSITIES.map((_, i) => (
            <motion.div key={i} className="w-5 rounded-sm" style={{ backgroundColor: accent }}
              animate={{ height: `${12 + i * 9}px`, opacity: i <= profile.intensityIdx ? 0.85 : 0.10 }}
              transition={{ duration: 0.4 }}
            />
          ))}
        </div>
        <p className="text-white/35 text-[9px] font-sans uppercase tracking-[0.12em] text-center">{selIntensity.label}</p>
        <p className="text-white/18 text-[8px] font-sans text-center mt-0.5">{selIntensity.sillage}</p>
      </div>

    </div>
  )
}

// ── Note Pill ─────────────────────────────────────────────────────────────────

function NotePill({ note, selected, onClick, disabled, recommended }: {
  note: string; selected: boolean; onClick: () => void; disabled: boolean; recommended?: boolean
}) {
  return (
    <button type="button" onClick={onClick} disabled={disabled && !selected}
      className={`px-3 py-1.5 rounded-full text-[11px] font-sans uppercase tracking-[0.1em] border transition-all duration-200 disabled:opacity-20 ${
        selected
          ? 'bg-[#B08D57] border-[#B08D57] text-[#120900]'
          : recommended
          ? 'border-[#C8A36A]/45 text-[#C8A36A]/70 hover:border-[#C8A36A]/80 hover:text-[#C8A36A]'
          : 'border-white/[0.13] text-white/42 hover:border-[#B08D57]/55 hover:text-[#B08D57]'
      }`}
    >
      {note}{recommended && !selected && <span className="ml-1 text-[8px] opacity-50">✦</span>}
    </button>
  )
}

// ── Main ──────────────────────────────────────────────────────────────────────

export default function CreateFragranceClient() {
  const topRef = useRef<HTMLDivElement>(null)
  const [step, setStep]           = useState(1)
  const [dir, setDir]             = useState(1)
  const [profile, setProfile]     = useState<Profile>(EMPTY)
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')
  const [submitted, setSubmitted] = useState(false)

  const personalities  = profile.gender ? PERSONALITIES[profile.gender] ?? [] : []
  const selPersonality = personalities.find(p => p.id === profile.personality)
  const selFamily      = FAMILIES.find(f => f.id === profile.family)
  const selClimate     = CLIMATES.find(c => c.id === profile.climate)
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
      purposes: p.purposes.includes(opt)
        ? p.purposes.filter(x => x !== opt)
        : [...p.purposes, opt],
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
      profile.topNotes.length   ? `Top: ${profile.topNotes.join(', ')}`   : '',
      profile.heartNotes.length ? `Heart: ${profile.heartNotes.join(', ')}` : '',
      profile.baseNotes.length  ? `Base: ${profile.baseNotes.join(', ')}`  : '',
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
        gender:           profile.gender,
        occasion:         profile.purposes.slice(0, 2).join(', ') || 'Custom Design',
        notes:            noteLines,
        intensity:        INTENSITIES[profile.intensityIdx].label,
        fragrance_name:   profile.fragranceName || 'To be named',
        customer_name:    profile.customerName,
        customer_phone:   profile.customerPhone,
        customer_city:    '',
        additional_notes: extraContext.join('\n'),
      })
      setSaveStatus('saved')
    } catch {
      setSaveStatus('error')
    }
    setSubmitted(true)
  }

  const waUrl = buildCustomFragranceOrderUrl({
    family:         profile.family,
    topNotes:       profile.topNotes,
    middleNotes:    profile.heartNotes,
    baseNotes:      profile.baseNotes,
    intensityLabel: INTENSITIES[profile.intensityIdx].label,
    fragranceName:  profile.fragranceName,
    customerName:   profile.customerName,
    customerPhone:  profile.customerPhone,
    customerEmail:  profile.customerEmail,
    additionalNotes: [
      selPersonality ? `Personality: ${selPersonality.name}` : '',
      profile.purposes.length ? `Purpose: ${profile.purposes.join(', ')}` : '',
      profile.impression ? `Impression: ${profile.impression}` : '',
      selClimate ? `Climate: ${selClimate.label}` : '',
      profile.additionalNotes,
    ].filter(Boolean).join('\n'),
  })

  function reset() {
    setStep(1); setDir(1); setProfile(EMPTY)
    setSaveStatus('idle'); setSubmitted(false)
  }

  // ── Submitted ─────────────────────────────────────────────────────────────

  if (submitted) {
    const allNotes = [...profile.topNotes, ...profile.heartNotes, ...profile.baseNotes]
    return (
      <div className="cf-page-bg min-h-screen pt-[72px] md:pt-[80px] flex flex-col items-center justify-center px-6 py-24 text-center">
        <motion.div initial={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', stiffness: 180 }}>
          <div className="w-16 h-16 rounded-full border border-[#B08D57]/40 flex items-center justify-center mx-auto mb-6">
            <svg viewBox="0 0 24 24" className="w-8 h-8 text-[#B08D57]" fill="none" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          </div>
          <p className="text-[#B08D57] text-[10px] font-sans uppercase tracking-[0.22em] mb-3">Your Signature Fragrance</p>
          <h2 className="font-serif text-4xl text-white/90 mb-2">{profile.fragranceName || 'Your Custom Scent'}</h2>
          {selPersonality && <p className="text-white/35 font-sans text-sm mb-6">{selPersonality.name} · {INTENSITIES[profile.intensityIdx].label}</p>}
          {allNotes.length > 0 && (
            <div className="flex flex-wrap justify-center gap-1.5 mb-8 max-w-sm mx-auto">
              {allNotes.map(n => (
                <span key={n} className="px-2 py-0.5 border border-[#C8A36A]/22 text-white/42 text-[10px] font-sans rounded-full">{n}</span>
              ))}
            </div>
          )}
          <p className="text-white/25 font-sans text-sm mb-10 max-w-sm mx-auto leading-relaxed">
            We will craft your bespoke fragrance and reach out via WhatsApp within 24 hours.
          </p>
          {saveStatus === 'error' && (
            <p className="text-red-400/60 text-[11px] font-sans mb-4 uppercase tracking-[0.1em]">Note: enquiry not saved — please send via WhatsApp.</p>
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

      <div className="max-w-6xl mx-auto px-4 py-8 flex flex-col lg:flex-row gap-8 lg:gap-12 items-start">

        {/* ── Left: step content ──────────────────────────────────────── */}
        <div className="flex-1 min-w-0">
          <AnimatePresence mode="wait" custom={dir}>
            <motion.div key={step} custom={dir} variants={slide}
              initial="enter" animate="center" exit="exit"
              transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
            >

              {/* STEP 1 — IDENTITY */}
              {step === 1 && (
                <div>
                  <p className="text-[#B08D57]/50 text-[10px] font-sans uppercase tracking-[0.2em] mb-2">Step 1</p>
                  <h2 className="font-serif text-3xl text-white/90 mb-1">Who Will Wear This Fragrance?</h2>
                  <p className="text-white/25 font-sans text-xs mb-8">Your identity shapes everything — notes, character, intensity.</p>
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
                  <p className="text-[#B08D57]/50 text-[10px] font-sans uppercase tracking-[0.2em] mb-2">Step 2</p>
                  <h2 className="font-serif text-3xl text-white/90 mb-1">Which Personality Reflects You?</h2>
                  <p className="text-white/25 font-sans text-xs mb-8">This defines your fragrance direction, notes, and character.</p>
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
                      className="mt-5 border border-[#C8A36A]/20 bg-[#C8A36A]/[0.04] p-4">
                      <p className="text-[#C8A36A]/50 text-[9px] font-sans uppercase tracking-[0.18em] mb-2">Recommended Notes</p>
                      <div className="flex flex-wrap gap-2">
                        {selPersonality.notes.map(n => (
                          <span key={n} className="px-2.5 py-1 border border-[#C8A36A]/30 text-[#C8A36A]/70 text-[10px] font-sans rounded-full">{n}</span>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </div>
              )}

              {/* STEP 3 — PURPOSE */}
              {step === 3 && (
                <div>
                  <p className="text-[#B08D57]/50 text-[10px] font-sans uppercase tracking-[0.2em] mb-2">Step 3</p>
                  <h2 className="font-serif text-3xl text-white/90 mb-1">Where Will You Wear This?</h2>
                  <p className="text-white/25 font-sans text-xs mb-8">Select all occasions that apply — choose as many as you like.</p>
                  <div className="space-y-6">
                    {PURPOSE_CATEGORIES.map(cat => (
                      <div key={cat.id}>
                        <div className="flex items-center gap-2 mb-3">
                          <span className="text-[#C8A36A]/50 text-xs">{cat.icon}</span>
                          <p className="text-white/40 text-[10px] font-sans uppercase tracking-[0.18em]">{cat.label}</p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {cat.options.map(opt => {
                            const sel = profile.purposes.includes(opt)
                            return (
                              <button key={opt} type="button" onClick={() => togglePurpose(opt)}
                                className={`px-3.5 py-2 text-[11px] font-sans uppercase tracking-[0.12em] border rounded transition-all duration-200 ${
                                  sel
                                    ? 'bg-[#B08D57] border-[#B08D57] text-[#120900]'
                                    : 'border-white/[0.12] text-white/40 hover:border-[#C8A36A]/40 hover:text-[#C8A36A]/70'
                                }`}
                              >{opt}</button>
                            )
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                  {profile.purposes.length > 0 && (
                    <p className="mt-5 text-[#C8A36A]/45 text-[10px] font-sans">
                      {profile.purposes.length} occasion{profile.purposes.length > 1 ? 's' : ''} selected
                    </p>
                  )}
                </div>
              )}

              {/* STEP 4 — IMPRESSION */}
              {step === 4 && (
                <div>
                  <p className="text-[#B08D57]/50 text-[10px] font-sans uppercase tracking-[0.2em] mb-2">Step 4</p>
                  <h2 className="font-serif text-3xl text-white/90 mb-1">How Should People Remember You?</h2>
                  <p className="text-white/25 font-sans text-xs mb-8">Choose the emotion your fragrance will leave behind.</p>
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
                  <p className="text-[#B08D57]/50 text-[10px] font-sans uppercase tracking-[0.2em] mb-2">Step 5</p>
                  <h2 className="font-serif text-3xl text-white/90 mb-1">Which Fragrance Style Attracts You?</h2>
                  <p className="text-white/25 font-sans text-xs mb-8">The soul of your scent.</p>
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
                  <p className="text-[#B08D57]/50 text-[10px] font-sans uppercase tracking-[0.2em] mb-2">Step 6</p>
                  <h2 className="font-serif text-3xl text-white/90 mb-1">How Powerful Should It Feel?</h2>
                  <p className="text-white/25 font-sans text-xs mb-8">Choose the projection and longevity of your signature.</p>
                  <div className="space-y-3">
                    {INTENSITIES.map((int, i) => {
                      const sel = profile.intensityIdx === i
                      return (
                        <motion.button key={int.label} type="button"
                          onClick={() => setProfile(p => ({ ...p, intensityIdx: i }))}
                          whileHover={{ x: 4 }} whileTap={{ scale: 0.98 }}
                          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                          className={`w-full text-left p-5 border transition-all duration-300 ${
                            sel
                              ? 'border-[#C8A36A]/60 bg-[#C8A36A]/[0.07]'
                              : 'border-white/[0.10] bg-white/[0.02] hover:border-[#C8A36A]/30'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-1">
                                <div className="flex items-end gap-1">
                                  {Array.from({ length: 4 }).map((_, j) => (
                                    <motion.div key={j} className="w-1.5 rounded-sm bg-[#C8A36A]"
                                      animate={{ height: `${8 + j * 5}px`, opacity: sel ? (j <= i ? 0.9 : 0.15) : 0.2 }}
                                      transition={{ duration: 0.3 }}
                                    />
                                  ))}
                                </div>
                                <p className={`font-serif text-lg leading-tight transition-colors ${sel ? 'text-white/90' : 'text-white/50'}`}>{int.label}</p>
                              </div>
                              <p className={`text-[10px] font-sans uppercase tracking-[0.15em] transition-colors ${sel ? 'text-[#C8A36A]/70' : 'text-white/20'}`}>{int.sublabel}</p>
                              <p className={`text-xs font-sans mt-2 leading-relaxed transition-colors ${sel ? 'text-white/50' : 'text-white/20'}`}>{int.desc}</p>
                            </div>
                            <div className={`text-[10px] font-sans uppercase tracking-[0.12em] whitespace-nowrap transition-colors ${sel ? 'text-[#C8A36A]/55' : 'text-white/15'}`}>
                              {int.sillage}
                            </div>
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
                  <p className="text-[#B08D57]/50 text-[10px] font-sans uppercase tracking-[0.2em] mb-2">Step 7</p>
                  <h2 className="font-serif text-3xl text-white/90 mb-1">Which Weather Will You Wear It In?</h2>
                  <p className="text-white/25 font-sans text-xs mb-8">Climate shapes how your fragrance performs and projects.</p>
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
                  <p className="text-[#B08D57]/50 text-[10px] font-sans uppercase tracking-[0.2em] mb-2">Step 8</p>
                  <h2 className="font-serif text-3xl text-white/90 mb-1">Build the Soul of Your Fragrance</h2>
                  <p className="text-white/25 font-sans text-xs mb-8">Up to 3 notes per layer. Starred notes are recommended for your personality.</p>
                  {([
                    { key: 'topNotes' as const,   label: 'Top Notes',   sub: 'First impression · 15–30 min',   notes: NOTES_PYRAMID.top,   selected: profile.topNotes },
                    { key: 'heartNotes' as const,  label: 'Heart Notes', sub: 'Core character · 30 min – 4 hrs', notes: NOTES_PYRAMID.heart, selected: profile.heartNotes },
                    { key: 'baseNotes' as const,   label: 'Base Notes',  sub: 'Lasting identity · hours',        notes: NOTES_PYRAMID.base,  selected: profile.baseNotes },
                  ]).map(({ key, label, sub, notes, selected }) => (
                    <div key={key} className="mb-7">
                      <div className="flex items-baseline gap-3 mb-3">
                        <p className="text-white/60 text-xs font-sans uppercase tracking-[0.15em]">{label}</p>
                        <p className="text-white/20 text-[10px] font-sans">{sub}</p>
                        {selected.length > 0 && <span className="ml-auto text-[#B08D57]/55 text-[9px] font-sans">{selected.length}/3</span>}
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
                  <p className="text-[#B08D57]/50 text-[10px] font-sans uppercase tracking-[0.2em] mb-2">Step 9</p>
                  <h2 className="font-serif text-3xl text-white/90 mb-1">Name Your Fragrance</h2>
                  <p className="text-white/25 font-sans text-xs mb-8">Give your creation an identity, or let us name it together.</p>

                  <div className="flex items-center gap-3 mb-6">
                    <span className="text-[#B08D57]/25 text-xs">◆</span>
                    <div className="flex-1 h-px bg-white/[0.06]" />
                    <span className="text-[#B08D57]/25 text-xs">◆</span>
                  </div>

                  <input type="text" placeholder="e.g. Midnight Oud, Velvet Crown, Desert Noir..."
                    value={profile.fragranceName}
                    onChange={e => setProfile(p => ({ ...p, fragranceName: e.target.value }))}
                    className="w-full bg-transparent border-b border-white/[0.15] px-0 py-4 text-2xl font-serif text-white/85 placeholder-white/[0.10] focus:outline-none focus:border-[#B08D57]/55 transition-colors text-center"
                  />

                  <div className="flex flex-wrap justify-center gap-2 mt-5 mb-8">
                    {NAME_SUGGESTIONS.map(s => (
                      <button key={s} type="button"
                        onClick={() => setProfile(p => ({ ...p, fragranceName: s }))}
                        className={`px-3 py-1.5 text-[10px] font-sans uppercase tracking-[0.12em] border transition-all duration-200 ${
                          profile.fragranceName === s
                            ? 'border-[#B08D57]/60 text-[#B08D57]/80 bg-[#B08D57]/10'
                            : 'border-white/[0.10] text-white/30 hover:border-[#C8A36A]/35 hover:text-[#C8A36A]/55'
                        }`}
                      >{s}</button>
                    ))}
                  </div>

                  <div className="flex items-center gap-3 mb-6">
                    <div className="flex-1 h-px bg-white/[0.06]" />
                    <span className="text-[#B08D57]/25 text-xs">◆</span>
                    <div className="flex-1 h-px bg-white/[0.06]" />
                  </div>

                  <p className="text-white/35 text-[10px] font-sans uppercase tracking-[0.18em] mb-5">Your Details</p>
                  <div className="space-y-4">
                    {[
                      { key: 'customerName',  label: 'Full Name *',          placeholder: 'Your name',       type: 'text'  },
                      { key: 'customerPhone', label: 'WhatsApp / Phone *',    placeholder: '+91 98...',       type: 'tel'   },
                      { key: 'customerEmail', label: 'Email (optional)',       placeholder: 'your@email.com', type: 'email' },
                    ].map(({ key, label, placeholder, type }) => (
                      <div key={key}>
                        <label className="block text-white/22 text-[9px] font-sans uppercase tracking-[0.16em] mb-1.5">{label}</label>
                        <input type={type} placeholder={placeholder}
                          value={profile[key as keyof Profile] as string}
                          onChange={e => setProfile(p => ({ ...p, [key]: e.target.value }))}
                          className="w-full bg-[#C8A36A]/[0.04] border border-[#C8A36A]/18 px-4 py-3 text-sm text-white/75 placeholder-white/18 font-sans focus:outline-none focus:border-[#C8A36A]/50 transition-colors"
                        />
                      </div>
                    ))}
                    <div>
                      <label className="block text-white/22 text-[9px] font-sans uppercase tracking-[0.16em] mb-1.5">Additional Notes</label>
                      <textarea rows={3} placeholder="Any specific preferences, inspirations, or questions..."
                        value={profile.additionalNotes}
                        onChange={e => setProfile(p => ({ ...p, additionalNotes: e.target.value }))}
                        className="w-full bg-[#C8A36A]/[0.04] border border-[#C8A36A]/18 px-4 py-3 text-sm text-white/75 placeholder-white/18 font-sans resize-none focus:outline-none focus:border-[#C8A36A]/50 transition-colors"
                      />
                    </div>
                  </div>
                </div>
              )}

            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-10 pt-6 border-t border-white/[0.06]">
            {step > 1 ? (
              <button type="button" onClick={() => go(step - 1)}
                className="text-white/22 text-[11px] font-sans uppercase tracking-[0.15em] hover:text-white/50 transition-colors">
                ← Back
              </button>
            ) : <span />}

            {step < 9 ? (
              <button type="button" onClick={() => go(step + 1)} disabled={!canAdvance()}
                className="inline-flex items-center gap-2 bg-[#B08D57] text-[#120900] px-8 py-3 text-xs font-sans uppercase tracking-[0.15em] hover:bg-[#C9A06A] transition-colors disabled:opacity-18 disabled:cursor-not-allowed">
                Continue →
              </button>
            ) : (
              <button type="button" onClick={handleSubmit}
                disabled={!canAdvance() || saveStatus === 'saving'}
                className="inline-flex items-center gap-2 bg-[#B08D57] text-[#120900] px-8 py-3 text-xs font-sans uppercase tracking-[0.15em] hover:bg-[#C9A06A] transition-colors disabled:opacity-18 disabled:cursor-not-allowed">
                {saveStatus === 'saving' ? 'Sending...' : 'Send Enquiry →'}
              </button>
            )}
          </div>
        </div>

        {/* ── Right: preview ───────────────────────────────────────────── */}
        <RightPanel profile={profile} step={step} />

      </div>
    </div>
  )
}
