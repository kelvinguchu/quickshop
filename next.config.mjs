import { withPayload } from '@payloadcms/next/withPayload'
import withPWA from 'next-pwa'

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Your Next.js config here
}

const withPWAConfig = withPWA({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
  importScripts: ['/worker.js'],
  fallbacks: {
    image: '/icons/icon-512x512.png',
    document: '/offline.html',
  },
})

export default withPWAConfig(withPayload(nextConfig, { devBundleServerPackages: false }))
