import React from "react";
import { ArrowUp, ShieldCheck } from "lucide-react";

interface FooterProps {
  onOpenMethodology: () => void;
  onOpenDataInspector: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenMethodology,
  onOpenDataInspector,
}) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="border-t border-slate-200 bg-slate-100/70 py-12 text-slate-600 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-8 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2.5 mb-2">
              <div className="w-7 h-7 rounded-lg bg-slate-900 text-white flex items-center justify-center font-heading font-black text-xs tracking-wider border border-slate-800">
                SA
              </div>
              <span className="font-heading text-base font-black text-slate-900 uppercase tracking-tight">
                Sociedade Ativa
              </span>
              <span className="text-slate-300 hidden sm:inline" aria-hidden="true">·</span>
              <span className="text-xs text-slate-600 font-semibold hidden sm:inline">
                Política, eleições, notícias e dados do Brasil.
              </span>
            </div>
            <p className="text-slate-500 max-w-2xl text-xs leading-relaxed">
              Portal independente de informação pública e jornalismo de dados sobre o Brasil. Visualização oficial e apartidária dos resultados da Eleição Presidencial de 2026 (1º Turno) por estado e Distrito Federal (Flávio Bolsonaro vs. Lula). Totalização em conformidade com as resoluções do Tribunal Superior Eleitoral (TSE) e o Artigo 77 da Constituição Federal.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs font-bold">
            <button
              onClick={onOpenMethodology}
              className="text-slate-700 hover:text-slate-950 transition-colors cursor-pointer"
            >
              Metodologia de Apuração
            </button>
            <span className="text-slate-300" aria-hidden="true">·</span>
            <button
              onClick={onOpenDataInspector}
              className="text-slate-700 hover:text-slate-950 transition-colors cursor-pointer"
            >
              Dados Oficiais (JSON)
            </button>
            <span className="text-slate-300" aria-hidden="true">·</span>
            <button
              onClick={scrollToTop}
              className="flex items-center gap-1 text-slate-700 hover:text-slate-950 transition-colors cursor-pointer"
            >
              <span>Voltar ao topo</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-500 font-medium">
          <div>
            <span>Fontes Oficiais: Tribunal Superior Eleitoral (TSE) · IBGE · Banco Central do Brasil (BCB)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
            <span>Dados públicos oficiais em conformidade com a legislação brasileira</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
