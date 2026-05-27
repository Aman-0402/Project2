'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import ProductForm from '@/components/admin/ProductForm'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import { productService } from '@/services/products'
import { ROUTES } from '@/constants/config'
import type { Product, ProductFormData } from '@/types'

export default function EditProductPage() {
  const params = useParams<{ id: string }>()
  const router = useRouter()
  const [product, setProduct] = useState<Product | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!params.id) return
    productService.adminGetById(Number(params.id))
      .then((res) => {
        if (res.success && res.data) setProduct(res.data)
        else setError('Product not found.')
      })
      .finally(() => setIsLoading(false))
  }, [params.id])

  async function handleSubmit(data: ProductFormData) {
    if (!product) return
    setError('')
    setIsSubmitting(true)
    const res = await productService.adminUpdate(product.id, data)
    setIsSubmitting(false)
    if (res.success) {
      router.push(ROUTES.adminProducts)
    } else {
      setError(res.message || 'Failed to update product.')
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (!product) {
    return (
      <div className="text-center py-12">
        <p className="font-sans text-sm text-brown/50 mb-3">{error || 'Product not found.'}</p>
        <Link href={ROUTES.adminProducts} className="text-gold text-xs font-sans hover:text-gold-dark">
          &larr; Back to products
        </Link>
      </div>
    )
  }

  const initialData: Partial<ProductFormData> = {
    name: product.name,
    description: product.description ?? '',
    price: product.price,
    volume: product.volume ?? '',
    category: product.category?.id ?? null,
    fragrance_notes: product.fragrance_notes,
    image: product.image ?? '',
    is_featured: product.is_featured,
    is_active: product.is_active,
  }

  return (
    <div className="max-w-5xl">
      <div className="flex items-center gap-3 mb-8">
        <Link href={ROUTES.adminProducts} className="text-brown/40 hover:text-gold transition-colors text-xs font-sans uppercase tracking-luxury">
          &larr; Products
        </Link>
        <span className="text-brown/20">/</span>
        <div>
          <p className="label-luxury">Edit</p>
          <h1 className="font-serif text-3xl text-brown">{product.name}</h1>
        </div>
      </div>

      <ProductForm
        initialData={initialData}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        submitLabel="Update Product"
        error={error}
      />
    </div>
  )
}
