'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { inquiryService } from '@/services/inquiries'
import { formatDate } from '@/utils/formatters'
import { ConfirmModal } from '@/components/ui/Modal'
import type { FragranceInquiry } from '@/types'

const STATUS_LABELS: Record<FragranceInquiry['status'], string> = {
  new: 'New',
  contacted: 'Contacted',
  completed: 'Completed',
}

const STATUS_CLASSES: Record<FragranceInquiry['status'], string> = {
  new: 'bg-gold/15 text-gold-dark border border-gold/30',
  contacted: 'bg-beige border border-beige-dark text-brown',
  completed: 'bg-green-50 text-green-700 border border-green-200',
}

const FILTERS: Array<{ label: string; value: string }> = [
  { label: 'All', value: 'all' },
  { label: 'New', value: 'new' },
  { label: 'Contacted', value: 'contacted' },
  { label: 'Completed', value: 'completed' },
]

export default function AdminInquiriesPage() {
  const [inquiries, setInquiries] = useState<FragranceInquiry[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [deleteTarget, setDeleteTarget] = useState<FragranceInquiry | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [expanded, setExpanded] = useState<number | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await inquiryService.adminGetAll()
      if (res.success && res.data) setInquiries(res.data)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  async function handleStatusChange(id: number, status: string) {
    await inquiryService.adminUpdateStatus(id, status)
    setInquiries(prev => prev.map(i => i.id === id ? { ...i, status: status as FragranceInquiry['status'] } : i))
  }

  async function handleDelete() {
    if (!deleteTarget) return
    setIsDeleting(true)
    try {
      await inquiryService.adminDelete(deleteTarget.id)
      setInquiries(prev => prev.filter(i => i.id !== deleteTarget.id))
      setDeleteTarget(null)
    } finally {
      setIsDeleting(false)
    }
  }

  const filtered = filter === 'all' ? inquiries : inquiries.filter(i => i.status === filter)
  const counts = {
    all: inquiries.length,
    new: inquiries.filter(i => i.status === 'new').length,
    contacted: inquiries.filter(i => i.status === 'contacted').length,
    completed: inquiries.filter(i => i.status === 'completed').length,
  }

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="font-serif text-2xl text-brown mb-0.5">Fragrance Inquiries</h1>
          <p className="font-sans text-xs text-brown/40 uppercase tracking-luxury">
            {inquiries.length} total · {counts.new} new
          </p>
        </div>
        <button
          type="button"
          onClick={load}
          className="text-brown/40 hover:text-gold text-xs font-sans uppercase tracking-luxury transition-colors flex items-center gap-1.5"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
          </svg>
          Refresh
        </button>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {FILTERS.map(f => (
          <button
            type="button"
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`px-4 py-1.5 text-xs font-sans uppercase tracking-luxury border transition-colors duration-200 ${
              filter === f.value
                ? 'bg-brown text-ivory border-brown'
                : 'text-brown/50 border-beige-dark hover:border-gold hover:text-gold'
            }`}
          >
            {f.label}
            <span className={`ml-1.5 ${filter === f.value ? 'text-ivory/60' : 'text-brown/30'}`}>
              ({counts[f.value as keyof typeof counts]})
            </span>
          </button>
        ))}
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-7 h-7 border-2 border-gold border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20">
          <p className="font-serif text-xl text-brown/30 mb-2">No inquiries yet</p>
          <p className="font-sans text-xs text-brown/20 uppercase tracking-luxury">
            {filter !== 'all' ? `No ${filter} inquiries` : 'Custom fragrance requests will appear here'}
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          <AnimatePresence>
            {filtered.map((inquiry, i) => (
              <motion.div
                key={inquiry.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ delay: i * 0.04 }}
                className="bg-ivory border border-beige-dark overflow-hidden"
              >
                {/* Row header */}
                <div
                  className="flex flex-wrap items-center gap-3 p-4 cursor-pointer hover:bg-beige/30 transition-colors"
                  onClick={() => setExpanded(expanded === inquiry.id ? null : inquiry.id)}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-serif text-brown font-medium truncate">{inquiry.fragrance_name}</p>
                      <span className={`px-2 py-0.5 text-[10px] font-sans uppercase tracking-luxury rounded-sm ${STATUS_CLASSES[inquiry.status]}`}>
                        {STATUS_LABELS[inquiry.status]}
                      </span>
                    </div>
                    <p className="font-sans text-xs text-brown/50 mt-0.5">
                      {inquiry.customer_name} · {inquiry.customer_phone}
                      {inquiry.customer_city ? ` · ${inquiry.customer_city}` : ''}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <p className="font-sans text-[11px] text-brown/30">{formatDate(inquiry.created_at)}</p>
                    <svg
                      viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}
                      className={`w-4 h-4 text-brown/30 transition-transform ${expanded === inquiry.id ? 'rotate-180' : ''}`}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                    </svg>
                  </div>
                </div>

                {/* Expanded detail */}
                <AnimatePresence>
                  {expanded === inquiry.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden border-t border-beige-dark"
                    >
                      <div className="p-4 bg-beige/20">
                        {/* Fragrance profile grid */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                          {[
                            { label: 'For', value: inquiry.gender },
                            { label: 'Occasion', value: inquiry.occasion },
                            { label: 'Intensity', value: inquiry.intensity },
                            { label: 'Notes', value: inquiry.notes.join(', ') },
                          ].map(({ label, value }) => (
                            <div key={label} className="bg-ivory border border-beige-dark p-3">
                              <p className="label-luxury text-brown/40 text-[9px] mb-1">{label}</p>
                              <p className="font-sans text-xs text-brown">{value}</p>
                            </div>
                          ))}
                        </div>

                        {inquiry.additional_notes && (
                          <div className="bg-ivory border border-beige-dark p-3 mb-4">
                            <p className="label-luxury text-brown/40 text-[9px] mb-1">Additional Notes</p>
                            <p className="font-sans text-xs text-brown">{inquiry.additional_notes}</p>
                          </div>
                        )}

                        {/* Actions */}
                        <div className="flex flex-wrap items-center gap-2 pt-2">
                          <span className="label-luxury text-brown/30 text-[10px] mr-1">Status:</span>
                          {(['new', 'contacted', 'completed'] as const).map(s => (
                            <button
                              type="button"
                              key={s}
                              onClick={() => handleStatusChange(inquiry.id, s)}
                              className={`px-3 py-1 text-[10px] font-sans uppercase tracking-luxury border transition-colors duration-200 ${
                                inquiry.status === s
                                  ? STATUS_CLASSES[s]
                                  : 'text-brown/30 border-beige-dark hover:border-gold hover:text-gold'
                              }`}
                            >
                              {STATUS_LABELS[s]}
                            </button>
                          ))}

                          <a
                            href={`https://wa.me/${inquiry.customer_phone.replace(/\D/g, '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="ml-auto px-3 py-1 bg-[#25D366] text-white text-[10px] font-sans uppercase tracking-luxury hover:bg-[#1EBE5A] transition-colors flex items-center gap-1.5"
                          >
                            <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                            </svg>
                            WhatsApp
                          </a>

                          <button
                            type="button"
                            onClick={() => setDeleteTarget(inquiry)}
                            className="px-3 py-1 text-[10px] font-sans uppercase tracking-luxury border border-beige-dark text-red-400 hover:border-red-400 transition-colors"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      <ConfirmModal
        isOpen={!!deleteTarget}
        title="Delete Inquiry"
        message={`Delete "${deleteTarget?.fragrance_name}" by ${deleteTarget?.customer_name}? This cannot be undone.`}
        confirmLabel="Delete"
        onConfirm={handleDelete}
        onClose={() => setDeleteTarget(null)}
        isLoading={isDeleting}
      />
    </div>
  )
}
