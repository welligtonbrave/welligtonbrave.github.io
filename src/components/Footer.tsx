import React from "react";
import { ArrowUp, ShieldCheck } from "lucide-react";

interface FooterProps {
  onOpenMethodology: () => void;
  onOpenDataInspector: () => void;
  onOpenGitHubPages?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenMethodology,
  onOpenDataInspector,
  onOpenGitHubPages,
}) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="border-t border-slate-200 bg-slate-100/70 py-12 text-slate-600 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-8 border-b border-slate-200">
          <div>
            <span className="font-heading text-base font-extrabold text-slate-900 block mb-1">
              Eleições 2026 — 1º Turno (4 de outubro de 2026)
            </span>
            <p className="text-slate-500 max-w-xl text-xs leading-relaxed">
              Plataforma interativa oficial de visualização dos resultados da eleição para Presidente da República por estado e Distrito Federal (Flávio Bolsonaro vs. Lula). Totalização em conformidade com as diretrizes do Tribunal Superior Eleitoral (TSE) e o Artigo 77 da Constituição Federal.
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
            {onOpenGitHubPages && (
              <>
                <span className="text-slate-300" aria-hidden="true">·</span>
                <button
                  onClick={onOpenGitHubPages}
                  className="text-blue-600 hover:text-blue-800 transition-colors cursor-pointer font-black"
                >
                  Baixar Projeto ZIP (GitHub Pages)
                </button>
              </>
            )}
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
            <span>Fonte: Tribunal Superior Eleitoral (TSE) · 1º turno — 4 de outubro de 2026</span>
          </div>
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
            <span>Cálculo constitucional estrito sobre votos válidos nominais</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
