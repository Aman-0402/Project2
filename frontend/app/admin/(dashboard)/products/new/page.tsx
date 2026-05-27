'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import ProductForm from '@/components/admin/ProductForm'
import { productService } from '@/services/products'
import { ROUTES } from '@/constants/config'
import type { ProductFormData } from '@/types'

export default function NewProductPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  async function handleSubmit(data: ProductFormData) {
    setError('')
    setIsSubmitting(true)
    const res = await productService.adminCreate(data)
    setIsSubmitting(false)
    if (res.success) {
      router.push(ROUTES.adminProducts)
    } else {
      setError(res.message || 'Failed to create product.')
    }
  }

  return (
    <div className="max-w-5xl">
      <div className="flex items-center gap-3 mb-8">
        <Link href={ROUTES.adminProducts} className="text-brown/40 hover:text-gold transition-colors text-xs font-sans uppercase tracking-luxury">
          &larr; Products
        </Link>
        <span className="text-brown/20">/</span>
        <div>
          <p className="label-luxury">New</p>
          <h1 className="font-serif text-3xl text-brown">Add Product</h1>
        </div>
      </div>

      <ProductForm
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        submitLabel="Create Product"
        error={error}
      />
    </div>
  )
}
