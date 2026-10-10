import React from "react";
import { ElectionDataSet } from "../data/electionData";
import { NewsItem } from "../types/news";
import { NationalBanner } from "../components/NationalBanner";
import { CandidateResultsView } from "../components/CandidateResultsView";
import { RegionalCharts } from "../components/RegionalCharts";
import { EDITORIAL_IMAGES } from "../assets/editorialImages";
import { NewsCard } from "../components/NewsCard";
import { PortalLink } from "../components/PortalLink";
import { AdBanner } from "../components/AdBanner";
import { Vote, ShieldCheck, CheckCircle2, ArrowRight, BookOpen } from "lucide-react";

interface EleicoesPageProps {
  dataset: ElectionDataSet;
  articles: NewsItem[];
  selectedCandidateFilter: string | null;
  onSelectCandidateFilter: (id: string | null) => void;
  onOpenMethodology: () => void;
  onOpenArticleDetails: (article: NewsItem) => void;
}

export const EleicoesPage: React.FC<EleicoesPageProps> = ({
  dataset,
  articles,
  selectedCandidateFilter,
  onSelectCandidateFilter,
  onOpenMethodology,
  onOpenArticleDetails,
}) => {
  const electionArticles = articles.filter((a) =>
    ["Eleições", "Justiça"].includes(a.category) ||
    a.tags?.some((t) => ["TSE", "Eleições 2026", "Segundo Turno"].includes(t))
  );

  return (
    <div className="py-8 sm:py-12 bg-[#F8FAFC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Cabeçalho do Caderno de Eleições */}
        <div className="mb-8 pb-6 border-b border-slate-200">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-700 mb-2">
            <Vote className="w-4 h-4" />
            <span>Caderno Especial · Eleições Presidenciais 2026</span>
          </div>
          <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-slate-950 text-balance">
            Totalização Oficial do 1º Turno &amp; Disputa do 2º Turno
          </h1>
          <p className="text-sm sm:text-base text-slate-600 mt-2 max-w-3xl leading-relaxed">
            Resultados consolidados em 100% das urnas eletrônicas pelo Tribunal Superior Eleitoral (TSE). Análise da votação nominal dos candidatos a presidente, abstenções e parâmetros legais do 2º turno previstos no Artigo 77 da Constituição Federal.
          </p>

          <div className="flex flex-wrap items-center gap-2 mt-4 text-xs font-semibold">
            <span className="text-slate-500">Veja também:</span>
            <PortalLink
              route="estados"
              className="px-2.5 py-1 rounded-md bg-amber-50 text-amber-800 hover:bg-amber-100 transition-colors"
            >
              Mapa por Estado &rarr;
            </PortalLink>
            <PortalLink
              route="politica"
              className="px-2.5 py-1 rounded-md bg-red-50 text-red-800 hover:bg-red-100 transition-colors"
            >
              Bancadas do Congresso &rarr;
            </PortalLink>
            <button
              onClick={onOpenMethodology}
              className="px-2.5 py-1 rounded-md bg-slate-200 text-slate-800 hover:bg-slate-300 transition-colors cursor-pointer"
            >
              Metodologia de Votos Válidos &rarr;
            </button>
          </div>
        </div>

        {/* 1. Painel Nacional Oficial (100% Totalizado) */}
        <div className="mb-10">
          <NationalBanner
            dataset={dataset}
            onOpenMethodology={onOpenMethodology}
            selectedCandidateFilter={selectedCandidateFilter}
            onSelectCandidateFilter={onSelectCandidateFilter}
          />
        </div>

        {/* 2. Quadro Individual de Candidatos à Presidência (Fotografias Oficiais e Busca/Filtros) */}
        <div className="mb-12">
          <CandidateResultsView
            dataset={dataset}
            onSelectCandidate={onSelectCandidateFilter}
            selectedCandidateId={selectedCandidateFilter}
          />
        </div>

        {/* 3. Banner Editorial com Fotografia e Regras do 2º Turno */}
        <div className="mb-12 bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 p-6 sm:p-8 items-center">
            <div className="lg:col-span-6">
              <div className="relative rounded-2xl overflow-hidden aspect-16/9 bg-slate-100 border border-slate-200/80">
                <img
                  src={EDITORIAL_IMAGES.urna.src}
                  alt={EDITORIAL_IMAGES.urna.alt}
                  className="w-full h-full object-cover"
                  loading="eager"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-4 right-4 text-white text-xs font-medium">
                  {EDITORIAL_IMAGES.urna.caption}
                </div>
              </div>
            </div>

            <div className="lg:col-span-6 flex flex-col justify-center">
              <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-blue-700 mb-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Auditoria e Transparência do Sufrágio</span>
              </div>

              <h2 className="font-heading text-xl sm:text-2xl font-black text-slate-900 leading-tight mb-3">
                Como funciona a convocação do 2º Turno no Brasil?
              </h2>

              <div className="space-y-3 text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
                <p>
                  Conforme o <strong className="text-slate-900">&sect; 2º do Artigo 77 da Carta Magna</strong>, se nenhum candidato alcançar mais da metade dos votos válidos nominais no primeiro turno (excluídos brancos e nulos), convoca-se uma nova votação entre os dois concorrentes mais votados.
                </p>
                <p>
                  No pleito de 2026, com 119,3 milhões de votos válidos nominais (119.297.583 votos apurados), <strong className="text-slate-900">Flávio Bolsonaro (47,03%)</strong> e <strong className="text-slate-900">Luiz Inácio Lula da Silva (45,16%)</strong> avançaram para o segundo turno no último domingo de outubro.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={onOpenMethodology}
                  className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors cursor-pointer inline-flex items-center gap-1.5"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Ver critérios constitucionais completos</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Gráficos Comparativos Regionais */}
        <div className="mb-12">
          <RegionalCharts dataset={dataset} />
        </div>

        {/* 4. Notícias e Resoluções sobre o Processo Eleitoral */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-heading text-2xl font-black text-slate-900">
              Notícias da Cobertura Eleitoral e Atos do TSE
            </h2>
            <span className="text-xs font-semibold text-slate-500">
              {electionArticles.length} matérias cadastradas
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {electionArticles.map((art) => (
              <NewsCard
                key={art.id}
                article={art}
                onOpenDetails={onOpenArticleDetails}
              />
            ))}
          </div>
        </div>

        <AdBanner format="in-feed" />
      </div>
    </div>
  );
};
