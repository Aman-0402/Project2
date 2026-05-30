import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import CurrencyPrice from '@/components/ui/CurrencyPrice'
import { ROUTES } from '@/constants/config'
import type { ProductListItem } from '@/types'

interface ProductCardProps {
  product: ProductListItem
  index?: number
}

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
    >
      <Link href={ROUTES.product(product.slug)} className="group block">
        {/* Image */}
        <div className="relative aspect-[3/4] bg-beige overflow-hidden mb-4 rounded-xl">
          {product.images?.length >= 2 && product.image_layer_effect ? (
            <>
              {/* Background layer */}
              <Image
                src={product.images[1]}
                alt=""
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              />
              {/* Bottle layer — zooms on hover */}
              <Image
                src={product.images[0]}
                alt={product.name}
                fill
                className="object-contain transition-transform duration-700 group-hover:scale-110"
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              />
            </>
          ) : product.image ? (
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
              <div className="w-10 h-px bg-gold/40" />
              <span className="font-serif text-4xl text-brown/15">{product.name[0]}</span>
              <div className="w-10 h-px bg-gold/40" />
            </div>
          )}
          <div className="absolute inset-0 bg-brown/0 group-hover:bg-brown/15 transition-colors duration-500" />

          {/* Featured badge */}
          {product.is_featured && (
            <div className="absolute top-3 left-3 bg-gold/90 text-ivory px-2 py-0.5 text-[9px] font-sans uppercase tracking-luxury">
              Featured
            </div>
          )}
        </div>

        {/* Info */}
        <div className="pt-3">
          {product.category && (
            <p className="label-luxury text-[9px] mb-1 text-gold/70">{product.category.name}</p>
          )}
          <h3 className="font-serif text-lg text-brown leading-snug group-hover:text-gold transition-colors duration-300 mb-1.5">
            {product.name}
          </h3>
          {product.description && (
            <p className="font-sans text-xs text-brown/50 leading-relaxed mb-2 line-clamp-2">
              {product.description}
            </p>
          )}
          <div className="flex items-center justify-between mt-1">
            <CurrencyPrice price={product.price} className="font-sans text-sm text-brown/70 font-medium" />
            {product.volume && (
              <span className="font-sans text-[10px] text-brown/30">{product.volume}</span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
