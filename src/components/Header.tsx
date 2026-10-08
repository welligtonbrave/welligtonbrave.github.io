import React from "react";
import { Database, FileText } from "lucide-react";
import { ElectionDataSet } from "../data/electionData";

interface HeaderProps {
  dataset: ElectionDataSet;
  onOpenMethodology: () => void;
  onOpenDataInspector: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  dataset,
  onOpenMethodology,
  onOpenDataInspector,
}) => {
  return (
    <header className="border-b border-slate-200 bg-white/95 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo / Título Principal */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center font-heading font-black text-sm tracking-tight shadow-xs">
              TSE
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-heading text-base sm:text-xl font-extrabold tracking-tight text-slate-900 block leading-tight truncate max-w-[150px] xs:max-w-none">
                  {dataset.title}
                </span>
                <span className="hidden sm:inline-block px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200/60 whitespace-nowrap">
                  100% Apurado
                </span>
              </div>
              <span className="text-xs text-slate-500 font-sans hidden sm:block leading-tight">
                {dataset.subtitle}
              </span>
            </div>
          </div>

          {/* Navegação entre seções da página */}
          <nav className="hidden lg:flex items-center gap-6 text-xs font-bold uppercase tracking-wider text-slate-600">
            <a href="#dashboard-nacional" className="hover:text-slate-950 transition-colors py-1 whitespace-nowrap">
              Painel Nacional
            </a>
            <a href="#mapa-interativo" className="hover:text-slate-950 transition-colors py-1 whitespace-nowrap">
              Mapa por Estado
            </a>
            <a href="#tabela-estados" className="hover:text-slate-950 transition-colors py-1 whitespace-nowrap">
              Tabela de Resultados
            </a>
            <button
              onClick={onOpenMethodology}
              className="hover:text-slate-950 transition-colors py-1 flex items-center gap-1 cursor-pointer whitespace-nowrap"
            >
              <FileText className="w-3.5 h-3.5 text-slate-400" />
              <span>Metodologia</span>
            </button>
          </nav>

          {/* Ações Rápidas */}
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenMethodology}
              className="lg:hidden min-h-[40px] px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 transition-colors text-xs font-semibold cursor-pointer whitespace-nowrap active:bg-slate-200"
            >
              Metodologia
            </button>

            <button
              onClick={onOpenDataInspector}
              className="hidden sm:flex min-h-[40px] px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-800 hover:text-slate-950 transition-colors items-center gap-1.5 text-xs font-bold shadow-xs cursor-pointer whitespace-nowrap active:bg-slate-100"
              title="Inspecionar dados oficiais do TSE em formato JSON"
            >
              <Database className="w-4 h-4 text-slate-500" />
              <span>JSON (TSE)</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
