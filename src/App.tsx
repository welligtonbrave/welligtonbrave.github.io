import React, { useState } from "react";
import {
  DATASET_2026,
  ElectionDataSet,
} from "./data/electionData";
import { OFFICIAL_NEWS_ARTICLES } from "./data/newsData";
import { Header } from "./components/Header";
import { NationalBanner } from "./components/NationalBanner";
import { BrazilMap } from "./components/BrazilMap";
import { RegionalCharts } from "./components/RegionalCharts";
import { NewsSection } from "./components/NewsSection";
import { StateDetailPanel } from "./components/StateDetailPanel";
import { StateTable } from "./components/StateTable";
import { MethodologyModal } from "./components/MethodologyModal";
import { DataInspectorModal } from "./components/DataInspectorModal";
import { AdBanner } from "./components/AdBanner";
import { Footer } from "./components/Footer";

export default function App() {
  const [currentDataset, setCurrentDataset] = useState<ElectionDataSet>(DATASET_2026);
  const [selectedStateUf, setSelectedStateUf] = useState<string | null>(null);
  const [candidateFilter, setCandidateFilter] = useState<string | null>(null);
  const [isMethodologyOpen, setIsMethodologyOpen] = useState(false);
  const [isDataInspectorOpen, setIsDataInspectorOpen] = useState(false);

  // Atualização customizada via JSON do TSE
  const handleUpdateDataset = (customDataset: ElectionDataSet) => {
    setCurrentDataset(customDataset);
    setCandidateFilter(null);
  };

  // Restaurar dados padrão de 2026
  const handleResetToDefault = () => {
    setCurrentDataset(DATASET_2026);
    setCandidateFilter(null);
  };

  const activeFilteredCandidate = currentDataset.candidates.find(
    (c) => c.id === candidateFilter
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col font-sans selection:bg-slate-900 selection:text-white">
      {/* 1. Barra Superior Editorial e Navegação */}
      <Header
        dataset={currentDataset}
        onOpenMethodology={() => setIsMethodologyOpen(true)}
        onOpenDataInspector={() => setIsDataInspectorOpen(true)}
      />

      <main className="flex-1">
        {/* 2. Painel Nacional de Votação (KPIs, Ranking e Comparativo Flávio vs. Lula) */}
        <NationalBanner
          dataset={currentDataset}
          onOpenMethodology={() => setIsMethodologyOpen(true)}
          selectedCandidateFilter={candidateFilter}
          onSelectCandidateFilter={setCandidateFilter}
        />

        {/* 3. Espaço Publicitário Superior (Google AdSense Leaderboard 728x90) */}
        <AdBanner format="leaderboard" />

        {/* 4. Seção do Mapa Interativo do Brasil */}
        <section className="py-6 sm:py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-5">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1">
                  Distribuição Geográfica
                </span>
                <h2 className="font-heading text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
                  Mapa de Votação por Estado e Distrito Federal
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 mt-0.5 leading-relaxed">
                  Passe o mouse para conferir o placar por estado ou clique para abrir a apuração detalhada com o comparecimento eleitoral.
                </p>
              </div>

              {activeFilteredCandidate && (
                <div className="flex items-center gap-2 bg-slate-100 text-slate-800 px-3 py-1.5 rounded-xl border border-slate-200 text-xs self-start sm:self-auto shadow-2xs">
                  <span>Filtro de visualização:</span>
                  <strong className="font-extrabold text-slate-900">
                    {activeFilteredCandidate.popularName}
                  </strong>
                  <button
                    onClick={() => setCandidateFilter(null)}
                    className="ml-1 text-slate-500 hover:text-slate-900 font-black cursor-pointer text-sm"
                    title="Remover filtro"
                  >
                    ×
                  </button>
                </div>
              )}
            </div>

            {/* Componente do Mapa SVG com Controles */}
            <BrazilMap
              dataset={currentDataset}
              selectedStateUf={selectedStateUf}
              onSelectState={(uf) => setSelectedStateUf(uf)}
              candidateFilter={candidateFilter}
              onSelectCandidateFilter={setCandidateFilter}
            />
          </div>
        </section>

        {/* 5. Gráficos Comparativos Regionais e Estados Decisivos */}
        <RegionalCharts dataset={currentDataset} />

        {/* 6. Seção de Jornalismo: Últimas Notícias e Análises */}
        <NewsSection articles={OFFICIAL_NEWS_ARTICLES} />

        {/* 7. Espaço Publicitário In-Feed */}
        <AdBanner format="in-feed" />

        {/* 8. Tabela Geral de Resultados por Estado (26 Estados + DF) */}
        <StateTable
          dataset={currentDataset}
          selectedStateUf={selectedStateUf}
          onSelectState={(uf) => setSelectedStateUf(uf)}
        />
      </main>

      {/* 9. Painel Lateral com Detalhamento do Estado Selecionado */}
      <StateDetailPanel
        dataset={currentDataset}
        uf={selectedStateUf}
        onClose={() => setSelectedStateUf(null)}
        onSelectState={(uf) => setSelectedStateUf(uf)}
      />

      {/* 10. Modal de Metodologia Oficial e Transparência Eleitoral */}
      <MethodologyModal
        dataset={currentDataset}
        isOpen={isMethodologyOpen}
        onClose={() => setIsMethodologyOpen(false)}
      />

      {/* 11. Modal de Inspeção e Ingestão de Dados JSON do TSE */}
      <DataInspectorModal
        dataset={currentDataset}
        isOpen={isDataInspectorOpen}
        onClose={() => setIsDataInspectorOpen(false)}
        onUpdateDataset={handleUpdateDataset}
        onResetToDefault={handleResetToDefault}
      />

      {/* 12. Rodapé Editorial do Portal em Português */}
      <Footer
        onOpenMethodology={() => setIsMethodologyOpen(true)}
        onOpenDataInspector={() => setIsDataInspectorOpen(true)}
      />
    </div>
  );
}
