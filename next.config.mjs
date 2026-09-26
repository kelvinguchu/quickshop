import { withPayload } from '@payloadcms/next/withPayload'
import withPWAInit from '@ducanh2912/next-pwa'

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Product media is served directly from Vercel Blob
    remotePatterns: [{ protocol: 'https', hostname: '*.public.blob.vercel-storage.com' }],
  },
}

const withPWA = withPWAInit({
  dest: 'public',
  register: true,
  disable: process.env.NODE_ENV === 'development',
  fallbacks: {
    image: '/icons/icon-512x512.png',
    document: '/offline.html',
  },
  workboxOptions: {
    skipWaiting: true,
    importScripts: ['/worker.js'],
  },
})

export default withPWA(withPayload(nextConfig, { devBundleServerPackages: false }))
