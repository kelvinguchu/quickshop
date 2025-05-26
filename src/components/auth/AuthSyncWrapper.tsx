'use client'

import { useAuthSync } from '@/hooks/useAuthSync'

export function AuthSyncWrapper({ children }: { children: React.ReactNode }) {
  useAuthSync()
  return <>{children}</>
} 