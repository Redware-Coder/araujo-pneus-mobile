"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useFiltro } from '@/components/contexts/FiltroContext';
import Image from "next/image";



export default function Splash() {

  const { filtros, setFiltros } = useFiltro();

    useEffect(() => {
      setFiltros((prev) => ({
        ...prev,
        pagina: "Intro",
      }));
    }, []);

  const [fadeOut, setFadeOut] = useState(false);
  const [dots, setDots] = useState("");
  const router = useRouter();


  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? "" : prev + "."));
    }, 500);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fadeTimer = setTimeout(() => setFadeOut(true), 4000);
    const redirectTimer = setTimeout(() => router.push("/main"), 5000);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(redirectTimer);
    };
  }, [router]);

  return (
  <main className="bg-black h-screen">
    <div
      className="w-full h-screen flex flex-col justify-center items-center"
      style={{
        color: "white",
        opacity: fadeOut ? 0 : 1,
        transition: "opacity 0.9s ease",
        // Removido o backgroundColor cinza
      }}
    >
      <p className="text-gray-500">Desenvolvido Por:</p>
      {/* Imagem acima do texto */}     
    <div className="w-44 mb-30 h-16 bg-[url('/REDWAREMOB.png')]
    bg-contain bg-center bg-no-repeat"></div>     
          
          {/* Skeleton Loading */}          
      <div className="mt-8 flex flex-col gap-3 items-center w-52 ">    
      Carregando
        <div className="h-3 w-2/3 rounded bg-gray-800 overflow-hidden relative">      
          <div className="absolute inset-0 bg-linear-to-r from-transparent via-gray-600 to-transparent animate-shimmer"></div>
        </div>
      </div>     

        
    </div>
  </main>

);

}
