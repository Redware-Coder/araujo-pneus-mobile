import { ChartBar, ChartBarIncreasing, ChartNoAxesColumn, ChartNoAxesCombined, Scroll } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { ChartConfig, ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from "../ui/chart";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { useEffect, useState } from "react";
import { Lojas } from "../buscadores";
import { useFiltro } from "../contexts/FiltroContext";

export default function ChartOverview() {

  const [lojaDados, setLojaDados] = useState<Lojas[]>([]) 
  const [loading, setLoading] = useState(false)
  const { filtros } = useFiltro()

  const [ip, setIp] = useState("");
  
    useEffect(() => {
      async function buscarIP() {
        try {
          const res = await fetch("https://api.ipify.org?format=json");
          const data = await res.json();
          setIp(data.ip);
        } catch (err) {
          console.error("Erro ao buscar IP externo", err);
        }
      }
  
      buscarIP();
    }, []);
  
    function getApiBaseUrl(ip: string) {
    if (ip.startsWith("177.54.239.199")) {
      return "http://10.1.1.135:4143/api/SqlApp";
    }
  
    return "http://177.54.239.199:4143/api/SqlApp";
    
  }

  useEffect(() => {
    if (!ip) return; // ⛔ espera o IP carregar
    setLoading(true)
    const baseUrl = getApiBaseUrl(ip);
    const timer = setTimeout(() => {
      async function Read() {
        try {
          const response = await fetch(`${baseUrl}/LojasxLojas`);
          const data = await response.json()
          setLojaDados(data);      
          console.log(data);
        } catch (error) {
          console.error("Erro ao Conectar com Banco de dados")
        }         
      }
     Promise.all([Read()]).finally(() => {
        setLoading(false)
      })
    }, 4000)
  
    return () => clearTimeout(timer)
  }, [filtros, ip])

 

  const dadosMesAtual = lojaDados

 const chartData = [
  { month: "Janeiro", desktop: 186, mobile: 80 },
  { month: "Fevereiro", desktop: 305, mobile: 200 },
  { month: "Março", desktop: 237, mobile: 120 },
  { month: "Abril", desktop: 73, mobile: 190 },
  { month: "Maio", desktop: 209, mobile: 130 },
  { month: "Junho", desktop: 214, mobile: 140 },
  { month: "Julho", desktop: 214, mobile: 140 },
  { month: "Agosto", desktop: 214, mobile: 140 },
  { month: "Setembro", desktop: 214, mobile: 140 },
  { month: "Outubro", desktop: 214, mobile: 140 },
  { month: "Novembro", desktop: 214, mobile: 140 },
  { month: "Dezembro", desktop: 214, mobile: 140 },
  ] 

  const chartConfig = {
  desktop: {
    label: "Mês Atual",
    color: "#33cc33",    
  },
  mobile: {
    label: "Mês Passado",
    color: "#0099ff",
  },
} satisfies ChartConfig

 return (
  
   <Card className="w-full md:w-1/2  max-h-117">
     <CardHeader className="pl-4 pr-4">
          <div className="flex items-center justify-center">
            <CardTitle className="text-2xl sm:text-2xl">
              Gráfico comparativo
            </CardTitle>
            <ChartNoAxesCombined className="ml-auto w-6 h-6" rotate={3} />
          </div>
          <CardDescription>
            Mês Atual x Mês Passado
            </CardDescription>          
        </CardHeader>
    
    <CardContent className="md:max-h-50">
      <div className="w-full overflow-auto">
      <ChartContainer config={chartConfig} className="max-h-75 w-225 md:w-full">
        <BarChart data={dadosMesAtual} 
                  barSize={30}
                  barGap={3}          // espaço entre barras do mesmo grupo
                  barCategoryGap={20}>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="loja"
            tickLine={false}
            tickMargin={5}
            axisLine={false}
            tickFormatter={(value) => value.slice(0, 8)}
          />
          <ChartTooltip content={<ChartTooltipContent  />} />  
          <Bar dataKey="MesAtual" name="Atual" fill="var(--color-desktop)" radius={3}/>
          <Bar dataKey="MesPassado" name="Passado" fill="var(--color-mobile)" radius={3}/>
        </BarChart>
      </ChartContainer>

      </div>
    </CardContent>

    
   </Card>
  );
}