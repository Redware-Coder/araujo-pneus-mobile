import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Sidebar } from "@/components/sidebar"
import { FiltroProvider } from "@/components/contexts/FiltroContext";
import { useFiltro } from "@/components/contexts/FiltroContext";


const inter = Inter({ subsets: ["latin"]})
// const { setFiltros } = useFiltro()

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Araújo Pneus - Mobile",
  description: "Sistema integrado ao sistema local, trazendo informações de forma agrupada e rápida.",
   icons: {
    icon: "/icon.png",
    apple: "/apple-icon.png",
  },
};
export default function RootLayout({
  
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (    
    <html lang="en">
      <body className={cn("min-h-screen bg-background font-sans antialiased", inter.className)}>
         <FiltroProvider>          
         <Sidebar />
            {children}
        </FiltroProvider>
      </body>
    </html>
  );
}
