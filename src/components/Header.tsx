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
          {/* Logo / Marca Oficial Sociedade Ativa */}
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <div
              className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center font-heading font-black text-xs sm:text-sm tracking-widest shadow-xs shrink-0 select-none border border-slate-800"
              aria-label="Sociedade Ativa Logo"
              title="Sociedade Ativa"
            >
              SA
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-heading text-sm sm:text-lg font-black tracking-tight text-slate-900 uppercase leading-none truncate">
                  Sociedade Ativa
                </span>
                <span className="hidden md:inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200 whitespace-nowrap">
                  Eleições 2026
                </span>
                <span className="hidden xl:inline-block px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200/60 whitespace-nowrap">
                  100% Apurado
                </span>
              </div>
              <div className="text-[10px] sm:text-xs text-slate-500 font-medium leading-tight truncate mt-0.5">
                <span className="hidden sm:inline">Política • Eleições • Brasil • Dados</span>
                <span className="sm:hidden text-slate-400">Política &amp; Dados</span>
              </div>
            </div>
          </div>

          {/* Navegação entre seções da página */}
          <nav className="hidden lg:flex items-center gap-5 text-xs font-bold uppercase tracking-wider text-slate-600">
            <a href="#dashboard-nacional" className="hover:text-slate-950 transition-colors py-1 whitespace-nowrap">
              Painel Nacional
            </a>
            <a href="#mapa-interativo" className="hover:text-slate-950 transition-colors py-1 whitespace-nowrap">
              Mapa
            </a>
            <a href="#tabela-estados" className="hover:text-slate-950 transition-colors py-1 whitespace-nowrap">
              Resultados
            </a>
            <a href="#noticias" className="hover:text-slate-950 transition-colors py-1 whitespace-nowrap">
              Notícias
            </a>
            <a href="#economia" className="text-blue-700 hover:text-blue-900 transition-colors py-1 whitespace-nowrap font-black">
              Economia
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
