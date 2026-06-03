export const CONFIG = {
  apiUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api',
  // Primary — M. Roeesh — Buy Now buttons
  whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '+919724586101',
  // Secondary — M. Munavvar — Ask Details buttons
  whatsappNumber2: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER_2 || '+919016361538',
  brandName: process.env.NEXT_PUBLIC_BRAND_NAME || 'M.M ATTARWALA',
  brandTagline: 'The Art of Scent',
  instagram: process.env.NEXT_PUBLIC_INSTAGRAM_URL || 'https://www.instagram.com/mmattarwala/',
  facebook: process.env.NEXT_PUBLIC_FACEBOOK_URL || 'https://www.facebook.com/mmattarwala/',
  youtube: process.env.NEXT_PUBLIC_YOUTUBE_URL || 'https://www.youtube.com/@mmattarwala',
  email: 'mmattarwala2008@rediff.com',
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
  adminSettings: '/admin/settings',
  adminProfile: '/admin/profile',
  adminChangePassword: '/admin/change-password',
} as const

export const AUTH_TOKEN_KEY = 'luxe_access_token'
export const REFRESH_TOKEN_KEY = 'luxe_refresh_token'

// Secure cookie options — `secure` only on HTTPS (production)
export const COOKIE_OPTIONS_ACCESS = {
  expires: 1 / 24,
  sameSite: 'strict' as const,
  secure: process.env.NODE_ENV === 'production',
}

export const COOKIE_OPTIONS_REFRESH = {
  expires: 7,
  sameSite: 'strict' as const,
  secure: process.env.NODE_ENV === 'production',
}
