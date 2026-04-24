"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useFiltro } from "@/components/contexts/FiltroContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const API_BASE_URL = "/api/SqlApp";

export default function Splash() {
  const { setFiltros, filtros } = useFiltro();
  const router = useRouter();

  const [id, setId] = useState("");
  const [cnpj, setCnpj] = useState("");

  const [loading, setLoading] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);
  const [empresaValida, setEmpresaValida] = useState<boolean | null>(null);
  const [licencaVencida, setLicencaVencida] = useState(false);
  const [mensagemErro, setMensagemErro] = useState("");

  const isSplash = filtros.pagina === "Intro";

  // Página atual
  useEffect(() => {
    setFiltros((prev) => ({
      ...prev,
      pagina: "Intro",
    }));
  }, []);

  // valida empresa salva automaticamente
  async function validarEmpresaSalva() {
    const empresaId = localStorage.getItem("empresaId");
    const empresaCnpj = localStorage.getItem("empresaCnpj");

    if (!empresaId || !empresaCnpj) {
      setEmpresaValida(false);
      return;
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/ConfirmarEmpresa?id=${empresaId}&cnpj=${empresaCnpj}`
      );

      if (!response.ok) {
        setEmpresaValida(false);
        return;
      }

      const dados = await response.json();
      const empresa = dados[0];

      const dataValidade = new Date(empresa.validade);
      const agora = new Date();

      if (dataValidade < agora) {
        setLicencaVencida(true);
        setMensagemErro("Sua licença expirou");
        setEmpresaValida(false);
        return;
      }

      setEmpresaValida(true);

      setFiltros((prev) => ({
        ...prev,
        dev: "start",
      }));

      localStorage.setItem("empresa", JSON.stringify(empresa));

    } catch (error) {
      setEmpresaValida(false);
    }
  }

  useEffect(() => {
    validarEmpresaSalva();
  }, []);

  // redireciona
  useEffect(() => {
    if (empresaValida) {
      const fadeTimer = setTimeout(() => setFadeOut(true), 3000);
      const redirectTimer = setTimeout(() => router.push("/main"), 4000);

      return () => {
        clearTimeout(fadeTimer);
        clearTimeout(redirectTimer);
      };
    }
  }, [empresaValida]);

  async function validarEmpresa() {
    if (!id || !cnpj) return;

    setLoading(true);
    setMensagemErro("");

    try {
      const cnpjNumeros = cnpj.replace(/\D/g, "");
      const idNumeros = id.replace(/\D/g, "");

      const response = await fetch(
        `${API_BASE_URL}/ConfirmarEmpresa?id=${idNumeros}&cnpj=${cnpjNumeros}`
      );

      if (!response.ok) {
        setMensagemErro("Erro ao validar empresa");
        return;
      }

      const dados = await response.json();
      const empresa = dados[0];

      const dataValidade = new Date(empresa.validade);
      if (dataValidade < new Date()) {
        setLicencaVencida(true);
        setMensagemErro("Licença expirada");
        return;
      }

      const confirmar = window.confirm(
        `Empresa: ${empresa.razao}\nCNPJ: ${empresa.cnpj}\nContinuar?`
      );

      if (!confirmar) return;

      localStorage.setItem("empresaId", id);
      localStorage.setItem("empresaCnpj", cnpjNumeros);
      localStorage.setItem("empresa", JSON.stringify(empresa));

      router.push("/main");

    } catch (error) {
      setMensagemErro("Erro ao conectar com servidor");
    } finally {
      setLoading(false);
    }
  }

  function formatCNPJ(value: string) {
    let v = value.replace(/\D/g, "");
    v = v.replace(/^(\d{2})(\d)/, "$1.$2");
    v = v.replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3");
    v = v.replace(/\.(\d{3})(\d)/, ".$1/$2");
    v = v.replace(/(\d{4})(\d)/, "$1-$2");
    return v.slice(0, 18);
  }

  if (empresaValida === null) {
    return (
      <main className="bg-black h-dvh flex items-center justify-center text-white">
        Carregando...
      </main>
    );
  }

  return (
    <main className="bg-black h-dvh flex items-center justify-center overflow-hidden">
      <div
        className="flex flex-col items-center text-white transition-opacity"
        style={{ opacity: fadeOut ? 0 : 1 }}
      >
        <div className="w-40 h-16 bg-[url('/REDWAREMOB.png')] bg-contain bg-center bg-no-repeat mb-6" />

        {empresaValida === false && (
          <div className="w-60 flex flex-col gap-3">
            <Input
              placeholder="Código Dev"
              value={id}
              onChange={(e) => setId(e.target.value.replace(/\D/g, ""))}
            />
            <Input
              placeholder="CNPJ"
              value={cnpj}
              onChange={(e) => setCnpj(formatCNPJ(e.target.value))}
            />
            <Button onClick={validarEmpresa} className="bg-red-700">
              {loading ? "Validando..." : "Continuar"}
            </Button>

            {mensagemErro && (
              <p className="text-red-500 text-sm text-center">
                {mensagemErro}
              </p>
            )}
          </div>
        )}

        {empresaValida && (
          <div className="mt-10 text-gray-300 text-sm">
            Iniciando sistema...
          </div>
        )}

        <p className="fixed bottom-2 text-xs text-gray-400">
          ©2026 Redware Informática
        </p>
      </div>
    </main>
  );
}