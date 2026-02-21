import { ProdutosSet } from "@/components/buscadores";

export default function Produto({descricacao, compra, venda, saldo} : ProdutosSet) {
 return (
    <div className="border-l-4 border-yellow-400 border-b p-2 bg">
        <div className="w-full h-auto text-[14px] text-gray-600 pl">
            <p>Descrição:</p>
        </div>
        <div><p>{descricacao}</p>
        </div>
        <div className="w-full h-auto mt-1 text-gray-600 text-[14px] flex flex-row items-center justify-between">
            <p>Preço de Compra:</p>
            <p>Preço de Venda:</p>
            <p>Saldo:</p>
        </div>
        <div className="w-full h-auto mt-1 flex flex-row items-center justify-between">
            <p className="w-30 text-right">{compra}</p>
            <p className="w-30 text-right">{venda}</p>
            <p className="w-14 text-right">{saldo}</p>
        </div>
   </div>
  );
}