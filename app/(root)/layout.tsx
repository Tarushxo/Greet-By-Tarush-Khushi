import StreamVideoProvider from '@/providers/StreamClientProvider'
import { Metadata } from 'next';
import React, {ReactNode } from 'react'

export const metadata: Metadata = {
  title: "Greet By Tarush",
  description: "Free time me kuch karlu",
  icons: {
    icon: "/icons/logo.svg"
  }
};

const RouteLayout = ({children} : {children :ReactNode}) => {
  return (
    <main>
        <StreamVideoProvider>
        {children}
        </StreamVideoProvider>
    </main>
  )
}

export default RouteLayout