export const CONFIG = {
  apiUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api',
  whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '+9852104967',
  brandName: process.env.NEXT_PUBLIC_BRAND_NAME || 'LUXE PARFUM',
  brandTagline: 'The Art of Scent',
} as const

export const ROUTES = {
  home: '/',
  collections: '/collections',
  about: '/about',
  contact: '/contact',
  createFragrance: '/create-fragrance',
  product: (slug: string) => `/products/${slug}`,
  adminLogin: '/admin/login',
  adminDashboard: '/admin',
  adminProducts: '/admin/products',
  adminProductNew: '/admin/products/new',
  adminProductEdit: (id: number) => `/admin/products/${id}/edit`,
  adminCategories: '/admin/categories',
  adminInquiries: '/admin/inquiries',
} as const

export const AUTH_TOKEN_KEY = 'luxe_access_token'
export const REFRESH_TOKEN_KEY = 'luxe_refresh_token'
