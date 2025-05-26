"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Loading } from "@/components/ui/loading";

interface NavigationLoadingContextType {
  isLoading: boolean;
  setLoading: (loading: boolean) => void;
}

const NavigationLoadingContext = createContext<
  NavigationLoadingContextType | undefined
>(undefined);

export function NavigationLoadingProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  // Track route changes
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const handleStart = () => {
      // Small delay to avoid flash for very fast navigations
      timeoutId = setTimeout(() => {
        setIsLoading(true);
      }, 100);
    };

    const handleComplete = () => {
      clearTimeout(timeoutId);
      setIsLoading(false);
    };

    // Listen for programmatic navigation
    const originalPush = router.push;
    const originalReplace = router.replace;

    router.push = (...args) => {
      handleStart();
      return originalPush.apply(router, args);
    };

    router.replace = (...args) => {
      handleStart();
      return originalReplace.apply(router, args);
    };

    // Clean up on pathname change (route completed)
    handleComplete();

    return () => {
      clearTimeout(timeoutId);
      // Restore original methods
      router.push = originalPush;
      router.replace = originalReplace;
    };
  }, [pathname, router]);

  // Handle link clicks
  useEffect(() => {
    const handleLinkClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const link = target.closest("a[href]") as HTMLAnchorElement;

      if (link && link.href) {
        const url = new URL(link.href);
        const currentUrl = new URL(window.location.href);

        // Only show loading for internal navigation
        if (
          url.origin === currentUrl.origin &&
          url.pathname !== currentUrl.pathname
        ) {
          setIsLoading(true);
        }
      }
    };

    document.addEventListener("click", handleLinkClick);
    return () => document.removeEventListener("click", handleLinkClick);
  }, []);

  const setLoading = (loading: boolean) => {
    setIsLoading(loading);
  };

  return (
    <NavigationLoadingContext.Provider value={{ isLoading, setLoading }}>
      {children}
      {isLoading && <Loading message='Loading...' />}
    </NavigationLoadingContext.Provider>
  );
}

export function useNavigationLoading() {
  const context = useContext(NavigationLoadingContext);
  if (context === undefined) {
    throw new Error(
      "useNavigationLoading must be used within a NavigationLoadingProvider"
    );
  }
  return context;
}
