'use client'

import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { buildCustomFragranceOrderUrl } from '@/utils/whatsapp'
import { inquiryService } from '@/services/inquiries'

// ── Types ─────────────────────────────────────────────────────────────────────

interface Profile {
  family: string
  topNotes: string[]
  middleNotes: string[]
  baseNotes: string[]
  intensityIdx: number
  fragranceName: string
  customerName: string
  customerPhone: string
  customerEmail: string
  additionalNotes: string
}

const EMPTY: Profile = {
  family: '', topNotes: [], middleNotes: [], baseNotes: [],
  intensityIdx: 2, fragranceName: '',
  customerName: '', customerPhone: '', customerEmail: '', additionalNotes: '',
}

// ── Data ──────────────────────────────────────────────────────────────────────

const FAMILIES = [
  { id: 'oud',      name: 'Oud',      arabic: 'عود',   desc: 'Deep, smoky, ancient resins',   bg: 'from-amber-950 via-stone-900 to-yellow-950',   accent: '#D4943A' },
  { id: 'floral',   name: 'Floral',   arabic: 'زهور',  desc: 'Blooming petals, romantic',      bg: 'from-purple-950 via-rose-950 to-pink-950',     accent: '#C084FC' },
  { id: 'musk',     name: 'Musk',     arabic: 'مسك',   desc: 'Clean, celestial, skin-close',   bg: 'from-slate-900 via-blue-950 to-indigo-950',    accent: '#93C5FD' },
  { id: 'fresh',    name: 'Fresh',    arabic: 'نضارة', desc: 'Bright, airy, invigorating',     bg: 'from-emerald-950 via-teal-950 to-cyan-950',    accent: '#6EE7B7' },
  { id: 'oriental', name: 'Oriental', arabic: 'شرقي',  desc: 'Exotic spices, warm amber',      bg: 'from-red-950 via-orange-950 to-amber-950',     accent: '#FCA5A5' },
  { id: 'woody',    name: 'Woody',    arabic: 'خشب',   desc: 'Earthy warmth, forest depth',    bg: 'from-green-950 via-stone-900 to-lime-950',     accent: '#86EFAC' },
]

const FAMILY_NOTES: Record<string, { top: string[]; middle: string[]; base: string[] }> = {
  oud: {
    top:    ['Saffron', 'Black Pepper', 'Cardamom', 'Bergamot', 'Incense', 'Elemi'],
    middle: ['Oud', 'Rose', 'Leather', 'Patchouli', 'Myrrh', 'Labdanum'],
    base:   ['Amber', 'Musk', 'Sandalwood', 'Vetiver', 'Benzoin', 'Civet'],
  },
  floral: {
    top:    ['Bergamot', 'Lemon', 'Pink Pepper', 'Aldehydes', 'Grapefruit', 'Neroli'],
    middle: ['Rose', 'Jasmine', 'Lily', 'Iris', 'Peony', 'Ylang-Ylang'],
    base:   ['Musk', 'Sandalwood', 'Vanilla', 'Ambrette', 'Cedarwood', 'White Amber'],
  },
  musk: {
    top:    ['Aldehydes', 'Bergamot', 'Green Violet', 'Lavender', 'Grapefruit', 'Neroli'],
    middle: ['White Musk', 'Iris', 'Cyclamen', 'Lily of Valley', 'Peach', 'Magnolia'],
    base:   ['Skin Musk', 'Ambrette', 'White Cedarwood', 'Tonka Bean', 'Cashmeran', 'Musks'],
  },
  fresh: {
    top:    ['Lemon', 'Bergamot', 'Grapefruit', 'Mandarin', 'Lime', 'Petitgrain'],
    middle: ['Aqua', 'Cucumber', 'Mint', 'Violet', 'Marine Notes', 'Sea Salt'],
    base:   ['Driftwood', 'Ambergris', 'Cedarwood', 'Oakmoss', 'Vetiver', 'White Musk'],
  },
  oriental: {
    top:    ['Cinnamon', 'Cardamom', 'Nutmeg', 'Clove', 'Pink Pepper', 'Ginger'],
    middle: ['Amber', 'Benzoin', 'Rose', 'Jasmine', 'Frankincense', 'Beeswax'],
    base:   ['Vanilla', 'Patchouli', 'Oud', 'Sandalwood', 'Labdanum', 'Castoreum'],
  },
  woody: {
    top:    ['Grapefruit', 'Bergamot', 'Black Pepper', 'Juniper', 'Sagebrush', 'Fir'],
    middle: ['Cedarwood', 'Pine', 'Cypress', 'Guaiac Wood', 'Birch', 'Vetiver'],
    base:   ['Oakmoss', 'Sandalwood', 'Patchouli', 'Amber', 'Musk', 'Tobacco'],
  },
}

const INTENSITIES = [
  { label: 'Whisper',  desc: 'Barely there — intimate.',      sillage: 'Stays skin-close. Whispers only to those nearest.' },
  { label: 'Soft',     desc: 'Gentle and subtle.',            sillage: 'Soft trail in enclosed spaces.' },
  { label: 'Balanced', desc: 'Present without overwhelming.', sillage: 'Moderate projection, natural all-day wear.' },
  { label: 'Bold',     desc: 'Confident and present.',        sillage: 'Strong projection — announces your arrival.' },
  { label: 'Intense',  desc: 'Powerful and commanding.',      sillage: 'Long-lasting trail. Fills every room you enter.' },
]

const STEPS = ['FAMILY', 'NOTES', 'INTENSITY', 'NAME', 'ENQUIRE']

// ── Dark Bottle SVG ───────────────────────────────────────────────────────────

function DarkBottle({ fillPercent, accent }: { fillPercent: number; accent: string }) {
  const BY = 58, BH = 128
  const lH = Math.max(0, (fillPercent / 100) * BH)
  const lY = BY + BH - lH

  return (
    <svg viewBox="0 0 120 212" className="w-full h-full drop-shadow-2xl" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <clipPath id="dk-clip">
          <rect x="18" y={BY} width="84" height={BH} rx="10" />
        </clipPath>
        <linearGradient id="dk-liq" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={accent} stopOpacity="0.6" />
          <stop offset="55%" stopColor={accent} stopOpacity="0.9" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0.15" />
        </linearGradient>
        <linearGradient id="dk-body" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#1a0e05" />
          <stop offset="50%" stopColor="#2a1a0a" />
          <stop offset="100%" stopColor="#1a0e05" />
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
      <rect x="51" y="27" width="5" height="22" fill={accent} opacity="0.05" />
      <path d="M49 49 Q33 54 18 58 L102 58 Q87 54 71 49 Z" fill={accent} opacity="0.08" />
      <rect x="18" y={BY} width="84" height={BH} rx="10" fill="url(#dk-body)" />
      <motion.rect
        x="18" width="84"
        clipPath="url(#dk-clip)"
        fill="url(#dk-liq)"
        initial={{ y: BY + BH, height: 0 }}
        animate={{ y: lY, height: lH }}
        transition={{ duration: 1.2, ease: [0.34, 1.56, 0.64, 1] }}
      />
      <rect x="18" y={BY} width="84" height={BH} rx="10" fill="url(#dk-shine)" />
      <rect x="26" y={BY + 8} width="6" height={BH - 22} rx="3" fill="white" opacity="0.05" />
      <rect x="18" y={BY} width="84" height={BH} rx="10" stroke={accent} strokeWidth="1" strokeOpacity="0.35" fill="none" />
      <motion.text
        x="60" y={BY + BH * 0.45}
        textAnchor="middle"
        fontFamily="Georgia, serif"
        fontSize="22"
        fontStyle="italic"
        fill={accent}
        animate={{ opacity: fillPercent > 45 ? 0 : 0.15 }}
        transition={{ duration: 0.7 }}
      >
        L
      </motion.text>
      <ellipse cx="60" cy={BY + BH + 6} rx="36" ry="4" fill={accent} opacity="0.07" />
    </svg>
  )
}

// ── Step Progress Bar ─────────────────────────────────────────────────────────

function StepBar({ step }: { step: number }) {
  return (
    <div className="cf-stepbar sticky top-0 z-20 bg-[#1C1208]/90 backdrop-blur-xl border-b border-[#C8A36A]/20 px-4 py-3">
      <div className="max-w-5xl mx-auto flex items-center justify-between">
        {STEPS.map((label, i) => {
          const done = step > i + 1
          const active = step === i + 1
          return (
            <div key={label} className="flex-1 flex flex-col items-center gap-1">
              <div className={`w-7 h-7 rounded-full border flex items-center justify-center text-[10px] font-sans transition-all duration-300 ${
                done    ? 'bg-[#B08D57] border-[#B08D57] text-[#120900]'
                : active ? 'bg-transparent border-[#B08D57] text-[#B08D57]'
                         : 'bg-transparent border-white/[0.12] text-white/20'
              }`}>
                {done ? (
                  <svg viewBox="0 0 16 16" className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8.5l3.5 3.5 6.5-7" />
                  </svg>
                ) : (
                  i + 1
                )}
              </div>
              <span className={`text-[8px] font-sans uppercase tracking-[0.14em] transition-colors ${
                done || active ? 'text-[#B08D57]' : 'text-white/[0.15]'
              }`}>{label}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ── Note Pill ─────────────────────────────────────────────────────────────────

function NotePill({ note, selected, onClick, disabled }: {
  note: string; selected: boolean; onClick: () => void; disabled: boolean
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled && !selected}
      className={`px-3 py-1.5 rounded-full text-[11px] font-sans uppercase tracking-[0.1em] border transition-all duration-200 disabled:opacity-25 ${
        selected
          ? 'bg-[#B08D57] border-[#B08D57] text-[#120900]'
          : 'border-white/[0.15] text-white/50 hover:border-[#B08D57]/60 hover:text-[#B08D57]'
      }`}
    >
      {note}
    </button>
  )
}

// ── Slide Variants ────────────────────────────────────────────────────────────

const slide = {
  enter: (d: number) => ({ x: d > 0 ? 40 : -40, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit:  (d: number) => ({ x: d > 0 ? -40 : 40, opacity: 0 }),
}

// ── Main ──────────────────────────────────────────────────────────────────────

export default function CreateFragranceClient() {
  const topRef = useRef<HTMLDivElement>(null)
  const [step, setStep] = useState(1)
  const [dir, setDir] = useState(1)
  const [profile, setProfile] = useState<Profile>(EMPTY)
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')
  const [submitted, setSubmitted] = useState(false)

  const selectedFamily = FAMILIES.find(f => f.id === profile.family)
  const familyNotes = profile.family ? FAMILY_NOTES[profile.family] : null
  const currentIntensity = INTENSITIES[profile.intensityIdx]
  const fillPct = profile.family
    ? Math.min(100, Math.max(5, ((step - 1) / 4) * 95 + 5))
    : 0

  function go(next: number) {
    setDir(next > step ? 1 : -1)
    setStep(next)
    setTimeout(() => topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 30)
  }

  function canAdvance() {
    if (step === 1) return !!profile.family
    if (step === 2) return profile.topNotes.length > 0 || profile.middleNotes.length > 0 || profile.baseNotes.length > 0
    if (step === 3) return true
    if (step === 4) return true
    if (step === 5) return !!profile.customerName && !!profile.customerPhone
    return false
  }

  function toggleLayerNote(layer: 'topNotes' | 'middleNotes' | 'baseNotes', note: string) {
    setProfile(p => {
      const arr = p[layer]
      if (arr.includes(note)) return { ...p, [layer]: arr.filter(n => n !== note) }
      if (arr.length >= 2) return p
      return { ...p, [layer]: [...arr, note] }
    })
  }

  async function handleSubmit() {
    setSaveStatus('saving')
    const noteLines: string[] = [
      profile.topNotes.length    ? `Top: ${profile.topNotes.join(', ')}`    : '',
      profile.middleNotes.length ? `Middle: ${profile.middleNotes.join(', ')}` : '',
      profile.baseNotes.length   ? `Base: ${profile.baseNotes.join(', ')}`  : '',
    ].filter(Boolean)

    const extraLines: string[] = [
      profile.customerEmail   ? `Email: ${profile.customerEmail}` : '',
      profile.additionalNotes ? profile.additionalNotes           : '',
    ].filter(Boolean)

    try {
      await inquiryService.create({
        gender:           profile.family,
        occasion:         'Custom Design',
        notes:            noteLines,
        intensity:        INTENSITIES[profile.intensityIdx].label,
        fragrance_name:   profile.fragranceName || 'To be named',
        customer_name:    profile.customerName,
        customer_phone:   profile.customerPhone,
        customer_city:    '',
        additional_notes: extraLines.join('\n'),
      })
      setSaveStatus('saved')
    } catch {
      setSaveStatus('error')
    }
    setSubmitted(true)
  }

  const waUrl = buildCustomFragranceOrderUrl({
    family:          profile.family,
    topNotes:        profile.topNotes,
    middleNotes:     profile.middleNotes,
    baseNotes:       profile.baseNotes,
    intensityLabel:  INTENSITIES[profile.intensityIdx].label,
    fragranceName:   profile.fragranceName,
    customerName:    profile.customerName,
    customerPhone:   profile.customerPhone,
    customerEmail:   profile.customerEmail,
    additionalNotes: profile.additionalNotes,
  })

  function reset() {
    setStep(1); setDir(1); setProfile(EMPTY)
    setSaveStatus('idle'); setSubmitted(false)
  }

  // ── Submitted screen ──────────────────────────────────────────────────────
  if (submitted) {
    return (
      <div className="cf-page-bg min-h-screen flex flex-col items-center justify-center px-6 py-24 text-center">
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', stiffness: 200 }}>
          <div className="w-16 h-16 rounded-full border border-[#B08D57]/40 flex items-center justify-center mx-auto mb-6">
            <svg viewBox="0 0 24 24" className="w-8 h-8 text-[#B08D57]" fill="none" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          </div>
          <p className="text-[#B08D57] text-[10px] font-sans uppercase tracking-[0.2em] mb-3">Enquiry Received</p>
          <h2 className="font-serif text-4xl text-white/90 mb-4">
            {profile.fragranceName || 'Your Signature Scent'}
          </h2>
          <p className="text-white/30 font-sans text-sm mb-10 max-w-sm mx-auto leading-relaxed">
            We will craft your bespoke fragrance and reach out via WhatsApp.
          </p>
          {saveStatus === 'error' && (
            <p className="text-red-400/70 text-[11px] font-sans mb-4 uppercase tracking-[0.1em]">Note: enquiry not saved — please send via WhatsApp below.</p>
          )}
          <div className="flex flex-col items-center gap-3">
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#25D366] text-white px-8 py-3.5 text-xs font-sans uppercase tracking-[0.15em] hover:bg-[#1EBE5A] transition-colors"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Send via WhatsApp
            </a>
            <button
              type="button"
              onClick={reset}
              className="text-white/20 text-xs font-sans uppercase tracking-[0.15em] hover:text-white/40 transition-colors mt-2"
            >
              Create Another
            </button>
          </div>
        </motion.div>
      </div>
    )
  }

  // ── Main builder ──────────────────────────────────────────────────────────
  return (
    <div className="cf-page-bg min-h-screen" ref={topRef}>
      <StepBar step={step} />

      <div className="max-w-5xl mx-auto px-4 py-8 flex flex-col lg:flex-row gap-6 lg:gap-10 items-start">

        {/* ── Left: Step content ────────────────────────────────────── */}
        <div className="flex-1 min-w-0">
          <AnimatePresence mode="wait" custom={dir}>
            <motion.div
              key={step}
              custom={dir}
              variants={slide}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.27, ease: [0.4, 0, 0.2, 1] }}
            >

              {/* ── Step 1: Family ── */}
              {step === 1 && (
                <div>
                  <p className="text-[#B08D57]/50 text-[10px] font-sans uppercase tracking-[0.2em] mb-2">Step 1</p>
                  <h2 className="font-serif text-3xl text-white/90 mb-1">Choose Your Family</h2>
                  <p className="text-white/25 font-sans text-xs mb-8">The soul of your fragrance.</p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {FAMILIES.map(f => (
                      <button
                        type="button"
                        key={f.id}
                        onClick={() => setProfile(p => ({ ...p, family: f.id, topNotes: [], middleNotes: [], baseNotes: [] }))}
                        className={`relative overflow-hidden rounded-lg text-left p-4 h-32 transition-all duration-300 border backdrop-blur-sm ${
                          profile.family === f.id
                            ? 'border-[#C8A36A]/70 shadow-[0_0_32px_rgba(200,163,106,0.20)]'
                            : 'border-white/[0.18] hover:border-[#C8A36A]/45 hover:shadow-[0_0_20px_rgba(200,163,106,0.12)]'
                        }`}
                      >
                        <div className={`absolute inset-0 bg-gradient-to-br ${f.bg} transition-opacity duration-300 ${profile.family === f.id ? 'opacity-100' : 'opacity-80'}`} />
                        <div
                          className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden cf-arabic-bg"
                          style={{ fontFamily: 'Arial, sans-serif', fontSize: '64px', color: f.accent, opacity: 0.10, direction: 'rtl' }}
                          aria-hidden="true"
                        >
                          {f.arabic}
                        </div>
                        <div className="relative z-10 flex flex-col h-full justify-between">
                          <div>
                            <p className="font-serif text-white/90 text-base leading-tight">{f.name}</p>
                            <p className="text-white/30 text-[10px] font-sans mt-0.5 leading-tight">{f.desc}</p>
                          </div>
                          {profile.family === f.id && (
                            <div className="w-4 h-4 rounded-full border border-[#B08D57] flex items-center justify-center self-start">
                              <div className="w-2 h-2 rounded-full bg-[#B08D57]" />
                            </div>
                          )}
                        </div>
                        {profile.family === f.id && (
                          <div className="absolute inset-0 rounded ring-1 ring-[#B08D57]/50 ring-inset pointer-events-none" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* ── Step 2: Notes ── */}
              {step === 2 && familyNotes && (
                <div>
                  <p className="text-[#B08D57]/50 text-[10px] font-sans uppercase tracking-[0.2em] mb-2">Step 2</p>
                  <h2 className="font-serif text-3xl text-white/90 mb-1">Choose Your Notes</h2>
                  <p className="text-white/25 font-sans text-xs mb-8">Up to 2 per layer. Tap to select.</p>
                  {([
                    { layer: 'topNotes'    as const, label: 'Top Notes',    sub: 'First impression · 15–30 min',  notes: familyNotes.top,    selected: profile.topNotes },
                    { layer: 'middleNotes' as const, label: 'Middle Notes', sub: 'Heart · 30 min – 4 hrs',       notes: familyNotes.middle, selected: profile.middleNotes },
                    { layer: 'baseNotes'   as const, label: 'Base Notes',   sub: 'Soul · lingers for hours',     notes: familyNotes.base,   selected: profile.baseNotes },
                  ]).map(({ layer, label, sub, notes, selected }) => (
                    <div key={layer} className="mb-7">
                      <div className="flex items-baseline gap-3 mb-3">
                        <p className="text-white/60 text-xs font-sans uppercase tracking-[0.15em]">{label}</p>
                        <p className="text-white/20 text-[10px] font-sans">{sub}</p>
                        {selected.length > 0 && (
                          <span className="ml-auto text-[#B08D57]/60 text-[9px] font-sans">{selected.length}/2</span>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {notes.map(n => (
                          <NotePill
                            key={n}
                            note={n}
                            selected={selected.includes(n)}
                            onClick={() => toggleLayerNote(layer, n)}
                            disabled={selected.length >= 2}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* ── Step 3: Intensity ── */}
              {step === 3 && (
                <div>
                  <p className="text-[#B08D57]/50 text-[10px] font-sans uppercase tracking-[0.2em] mb-2">Step 3</p>
                  <h2 className="font-serif text-3xl text-white/90 mb-1">Set the Intensity</h2>
                  <p className="text-white/25 font-sans text-xs mb-10">How loudly should your fragrance speak?</p>

                  <div className="relative mb-8">
                    <div className="flex justify-between mb-4">
                      {INTENSITIES.map((int, i) => (
                        <button
                          type="button"
                          key={int.label}
                          onClick={() => setProfile(p => ({ ...p, intensityIdx: i }))}
                          className="flex flex-col items-center gap-2 group"
                        >
                          <div className={`w-3 h-3 rounded-full border-2 transition-all duration-200 ${
                            profile.intensityIdx === i
                              ? 'bg-[#B08D57] border-[#B08D57] scale-125'
                              : 'bg-transparent border-white/20 group-hover:border-white/40'
                          }`} />
                          <span className={`text-[9px] font-sans uppercase tracking-[0.1em] transition-colors ${
                            profile.intensityIdx === i ? 'text-[#B08D57]' : 'text-white/25'
                          }`}>{int.label}</span>
                        </button>
                      ))}
                    </div>
                    <div className="relative h-px bg-white/10 mx-1.5">
                      <motion.div
                        className="absolute left-0 top-0 h-px bg-[#B08D57]"
                        animate={{ width: `${(profile.intensityIdx / 4) * 100}%` }}
                        transition={{ duration: 0.3 }}
                      />
                    </div>
                  </div>

                  <AnimatePresence mode="wait">
                    <motion.div
                      key={profile.intensityIdx}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      className="border border-[#C8A36A]/30 bg-[#C8A36A]/[0.06] backdrop-blur-sm p-5 rounded-lg"
                    >
                      <p className="font-serif text-xl text-white/80 mb-1">{currentIntensity.label}</p>
                      <p className="text-white/40 font-sans text-xs mb-3">{currentIntensity.desc}</p>
                      <div className="flex items-start gap-2">
                        <p className="text-[#B08D57]/50 text-[9px] font-sans uppercase tracking-[0.15em] mt-0.5 flex-shrink-0">Sillage</p>
                        <p className="text-white/30 text-[11px] font-sans">{currentIntensity.sillage}</p>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>
              )}

              {/* ── Step 4: Name ── */}
              {step === 4 && (
                <div>
                  <p className="text-[#B08D57]/50 text-[10px] font-sans uppercase tracking-[0.2em] mb-2">Step 4</p>
                  <h2 className="font-serif text-3xl text-white/90 mb-1">Name Your Fragrance</h2>
                  <p className="text-white/25 font-sans text-xs mb-10">Give your creation a name, or let us do it.</p>

                  <div className="flex items-center gap-3 mb-6">
                    <span className="text-[#B08D57]/25 text-xs">◆</span>
                    <div className="flex-1 h-px bg-white/[0.08]" />
                    <span className="text-[#B08D57]/25 text-xs">◆</span>
                  </div>

                  <input
                    type="text"
                    placeholder="e.g. Midnight Oud, Desert Rose, Moonlit Cedar..."
                    value={profile.fragranceName}
                    onChange={e => setProfile(p => ({ ...p, fragranceName: e.target.value }))}
                    className="w-full bg-transparent border-b border-white/[0.15] px-0 py-4 text-xl font-serif text-white/80 placeholder-white/[0.12] focus:outline-none focus:border-[#B08D57]/50 transition-colors text-center"
                  />

                  <div className="flex items-center gap-3 mt-6 mb-12">
                    <div className="flex-1 h-px bg-white/[0.08]" />
                    <span className="text-[#B08D57]/25 text-xs">◆</span>
                    <div className="flex-1 h-px bg-white/[0.08]" />
                  </div>

                  <button
                    type="button"
                    onClick={() => { setProfile(p => ({ ...p, fragranceName: '' })); go(5) }}
                    className="w-full py-3 border border-white/[0.08] text-white/20 text-[10px] font-sans uppercase tracking-[0.2em] hover:border-white/20 hover:text-white/35 transition-colors"
                  >
                    Skip — We&apos;ll Name It Together
                  </button>
                </div>
              )}

              {/* ── Step 5: Enquiry ── */}
              {step === 5 && (
                <div>
                  <p className="text-[#B08D57]/50 text-[10px] font-sans uppercase tracking-[0.2em] mb-2">Step 5</p>
                  <h2 className="font-serif text-3xl text-white/90 mb-1">Your Enquiry</h2>
                  <p className="text-white/25 font-sans text-xs mb-8">Let us contact you to craft your scent.</p>

                  <div className="grid grid-cols-2 gap-2 mb-8">
                    {[
                      { label: 'Family',       value: selectedFamily?.name || '—' },
                      { label: 'Intensity',     value: INTENSITIES[profile.intensityIdx].label },
                      { label: 'Name',          value: profile.fragranceName || 'To be named' },
                      { label: 'Top Notes',     value: profile.topNotes.join(', ')    || '—' },
                      { label: 'Middle Notes',  value: profile.middleNotes.join(', ') || '—' },
                      { label: 'Base Notes',    value: profile.baseNotes.join(', ')   || '—' },
                    ].map(({ label, value }) => (
                      <div key={label} className="border border-[#C8A36A]/20 bg-[#C8A36A]/[0.05] p-3">
                        <p className="text-white/25 text-[9px] font-sans uppercase tracking-[0.15em] mb-0.5">{label}</p>
                        <p className="text-white/60 text-xs font-sans">{value}</p>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-col gap-4">
                    {[
                      { key: 'customerName',  label: 'Full Name *',           placeholder: 'Your name',        type: 'text' },
                      { key: 'customerPhone', label: 'WhatsApp / Phone *',     placeholder: '+977 98...',       type: 'tel' },
                      { key: 'customerEmail', label: 'Email (optional)',        placeholder: 'your@email.com',  type: 'email' },
                    ].map(({ key, label, placeholder, type }) => (
                      <div key={key}>
                        <label className="block text-white/25 text-[9px] font-sans uppercase tracking-[0.15em] mb-1.5">{label}</label>
                        <input
                          type={type}
                          placeholder={placeholder}
                          value={profile[key as keyof Profile] as string}
                          onChange={e => setProfile(p => ({ ...p, [key]: e.target.value }))}
                          className="w-full bg-[#C8A36A]/[0.04] border border-[#C8A36A]/20 px-4 py-3 text-sm text-white/75 placeholder-white/20 font-sans focus:outline-none focus:border-[#C8A36A]/55 transition-colors"
                        />
                      </div>
                    ))}
                    <div>
                      <label className="block text-white/25 text-[9px] font-sans uppercase tracking-[0.15em] mb-1.5">Additional Notes</label>
                      <textarea
                        rows={3}
                        placeholder="Specific preferences, inspirations, or questions..."
                        value={profile.additionalNotes}
                        onChange={e => setProfile(p => ({ ...p, additionalNotes: e.target.value }))}
                        className="w-full bg-[#C8A36A]/[0.04] border border-[#C8A36A]/20 px-4 py-3 text-sm text-white/75 placeholder-white/20 font-sans resize-none focus:outline-none focus:border-[#C8A36A]/55 transition-colors"
                      />
                    </div>
                  </div>
                </div>
              )}

            </motion.div>
          </AnimatePresence>

          {/* ── Navigation ──────────────────────────────────────────── */}
          <div className="flex items-center justify-between mt-10 pt-6 border-t border-white/[0.08]">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => go(step - 1)}
                className="text-white/25 text-[11px] font-sans uppercase tracking-[0.15em] hover:text-white/50 transition-colors"
              >
                ← Back
              </button>
            ) : <span />}

            {step < 5 ? (
              <button
                type="button"
                onClick={() => go(step + 1)}
                disabled={!canAdvance()}
                className="inline-flex items-center gap-2 bg-[#B08D57] text-[#120900] px-8 py-3 text-xs font-sans uppercase tracking-[0.15em] hover:bg-[#C9A06A] transition-colors disabled:opacity-20 disabled:cursor-not-allowed"
              >
                Continue →
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={!canAdvance() || saveStatus === 'saving'}
                className="inline-flex items-center gap-2 bg-[#B08D57] text-[#120900] px-8 py-3 text-xs font-sans uppercase tracking-[0.15em] hover:bg-[#C9A06A] transition-colors disabled:opacity-20 disabled:cursor-not-allowed"
              >
                {saveStatus === 'saving' ? 'Sending...' : 'Send Enquiry →'}
              </button>
            )}
          </div>
        </div>

        {/* ── Right: Preview panel ──────────────────────────────────── */}
        <div className="w-full lg:w-60 xl:w-64 flex-shrink-0 lg:sticky lg:top-24">
          <div className="cf-preview-panel border border-[#C8A36A]/25 bg-[#C8A36A]/[0.04] backdrop-blur-sm p-5 flex flex-col items-center gap-5">

            {/* Bottle */}
            <div className="w-28 h-40">
              <DarkBottle fillPercent={fillPct} accent={selectedFamily?.accent || '#B08D57'} />
            </div>

            {/* Family name + Arabic */}
            {selectedFamily ? (
              <div className="text-center">
                <p className="font-serif text-white/80 text-lg leading-tight">{selectedFamily.name}</p>
                <p
                  className="text-white/20 text-2xl mt-0.5"
                  style={{ fontFamily: 'Arial, sans-serif', direction: 'rtl' }}
                  aria-hidden="true"
                >
                  {selectedFamily.arabic}
                </p>
              </div>
            ) : (
              <p className="text-white/15 text-[10px] font-sans uppercase tracking-[0.15em] text-center">Choose a family</p>
            )}

            {/* Intensity signal bars */}
            <div className="w-full">
              <p className="text-white/20 text-[9px] font-sans uppercase tracking-[0.15em] mb-2 text-center">Intensity</p>
              <div className="flex items-end justify-center gap-1.5">
                {INTENSITIES.map((_, i) => (
                  <motion.div
                    key={i}
                    className="w-4 rounded-sm"
                    style={{ backgroundColor: selectedFamily?.accent || '#B08D57' }}
                    animate={{
                      height: `${8 + i * 6}px`,
                      opacity: i <= profile.intensityIdx ? 0.8 : 0.10,
                    }}
                    transition={{ duration: 0.3 }}
                  />
                ))}
              </div>
              <p className="text-white/30 text-[10px] font-sans uppercase tracking-[0.1em] mt-2 text-center">
                {currentIntensity.label}
              </p>
            </div>

            {/* Note pills */}
            {(profile.topNotes.length > 0 || profile.middleNotes.length > 0 || profile.baseNotes.length > 0) && (
              <div className="w-full border-t border-white/[0.08] pt-4">
                <p className="text-white/20 text-[9px] font-sans uppercase tracking-[0.15em] mb-2 text-center">Notes</p>
                <div className="flex flex-wrap gap-1.5 justify-center">
                  {[...profile.topNotes, ...profile.middleNotes, ...profile.baseNotes].map(n => (
                    <span
                      key={n}
                      className="px-2 py-0.5 rounded-full border border-white/[0.10] text-white/40 text-[9px] font-sans"
                    >
                      {n}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Fragrance name */}
            {profile.fragranceName && (
              <div className="w-full border-t border-white/[0.08] pt-4 text-center">
                <p className="font-serif text-white/50 text-sm italic">{profile.fragranceName}</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  )
}
