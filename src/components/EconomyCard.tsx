import React from "react";
import { EconomicIndicator } from "../types/economy";
import {
  TrendingUp,
  TrendingDown,
  Minus,
  ExternalLink,
  Calendar,
  Building2,
  Landmark,
  ChevronRight,
  Info,
} from "lucide-react";

interface EconomyCardProps {
  indicator: EconomicIndicator;
  onOpenDetails: (indicator: EconomicIndicator) => void;
}

export const EconomyCard: React.FC<EconomyCardProps> = ({
  indicator,
  onOpenDetails,
}) => {
  const isAvailable = indicator.value !== null;

  // Mini sparkline SVG calculation
  const renderSparkline = () => {
    if (!indicator.historicalData || indicator.historicalData.length < 2) {
      return null;
    }

    const values = indicator.historicalData.map((d) => d.value);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const range = max - min || 1;

    const width = 84;
    const height = 26;
    const padding = 3;

    const points = values.map((val, idx) => {
      const x = (idx / (values.length - 1)) * (width - padding * 2) + padding;
      const y =
        height -
        padding -
        ((val - min) / range) * (height - padding * 2);
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    });

    const isUp = values[values.length - 1] >= values[0];
    const strokeColor =
      indicator.category === "Inflação"
        ? isUp
          ? "#e11d48" // Subida de inflação (rose)
          : "#059669" // Queda de inflação (emerald)
        : indicator.category === "Mercado de Trabalho"
        ? isUp
          ? "#e11d48" // Subida de desemprego (rose)
          : "#059669" // Queda de desemprego (emerald)
        : isUp
        ? "#059669"
        : "#e11d48";

    return (
      <svg
        className="w-[84px] h-[26px] overflow-visible"
        viewBox={`0 0 ${width} ${height}`}
        aria-hidden="true"
      >
        <polyline
          fill="none"
          stroke={strokeColor}
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={points.join(" ")}
        />
        {/* Ponto final */}
        {points.length > 0 && (
          <circle
            cx={points[points.length - 1].split(",")[0]}
            cy={points[points.length - 1].split(",")[1]}
            r="2.5"
            fill={strokeColor}
          />
        )}
      </svg>
    );
  };

  const getVariationBadge = () => {
    if (indicator.variation === null || indicator.variation === undefined) {
      return null;
    }

    const isPositive = indicator.variation > 0;
    const isZero = indicator.variation === 0;

    let colorClass = "text-slate-600 bg-slate-100 border-slate-200";
    let Icon = Minus;

    if (isPositive) {
      Icon = TrendingUp;
      // Para inflação ou desemprego, alta é geralmente alerta (vermelho/rose); para PIB/comércio/indústria, alta é verde
      if (indicator.category === "Inflação" || indicator.id === "desemprego") {
        colorClass = "text-rose-700 bg-rose-50 border-rose-200/80";
      } else {
        colorClass = "text-emerald-700 bg-emerald-50 border-emerald-200/80";
      }
    } else if (!isZero) {
      Icon = TrendingDown;
      if (indicator.category === "Inflação" || indicator.id === "desemprego") {
        colorClass = "text-emerald-700 bg-emerald-50 border-emerald-200/80";
      } else {
        colorClass = "text-rose-700 bg-rose-50 border-rose-200/80";
      }
    }

    const sign = isPositive ? "+" : "";
    const formattedVar = `${sign}${indicator.variation.toFixed(2).replace(".", ",")}`;

    return (
      <span
        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold border ${colorClass}`}
        title={indicator.variationPeriod || "Variação em relação ao período anterior"}
      >
        <Icon className="w-3 h-3" />
        <span>{formattedVar}</span>
      </span>
    );
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 hover:border-slate-300 shadow-xs hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group">
      {/* Topo do card: Categoria, Fonte e Ação */}
      <div className="p-4 sm:p-5 pb-3">
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200/70">
            {indicator.category}
          </span>

          <span
            className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200/60"
            title={`Fonte Oficial: ${indicator.sourceAgency}`}
          >
            {indicator.source === "Banco Central do Brasil" ? (
              <Landmark className="w-3 h-3 text-blue-600 shrink-0" />
            ) : indicator.source === "B3" ? (
              <TrendingUp className="w-3 h-3 text-emerald-600 shrink-0" />
            ) : (
              <Building2 className="w-3 h-3 text-blue-600 shrink-0" />
            )}
            <span>
              {indicator.source === "Banco Central do Brasil"
                ? "BCB"
                : indicator.source === "B3"
                ? "B3"
                : "IBGE"}
            </span>
          </span>
        </div>

        {/* Status de Pregão e Defasagem Regulatória para cotações de mercado */}
        {indicator.marketStatus && (
          <div className="flex flex-wrap items-center gap-1.5 mb-2.5">
            <span
              className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md border ${
                indicator.marketStatus === "aberto"
                  ? "bg-emerald-50 text-emerald-700 border-emerald-200/80"
                  : "bg-slate-100 text-slate-700 border-slate-200"
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  indicator.marketStatus === "aberto" ? "bg-emerald-500 animate-pulse" : "bg-slate-400"
                }`}
                aria-hidden="true"
              />
              <span>{indicator.marketStatus === "aberto" ? "Pregão Aberto" : "Mercado Fechado"}</span>
            </span>

            {indicator.isDelayed && (
              <span
                className="text-[10px] text-amber-800 bg-amber-50 border border-amber-200/60 px-1.5 py-0.5 rounded font-medium"
                title="Cotações públicas da B3 possuem defasagem regulatória mínima de 15 minutos"
              >
                15m defasagem
              </span>
            )}
          </div>
        )}

        {/* Sigla e Nome Completo */}
        <div className="mb-3">
          <div className="flex items-baseline justify-between gap-2">
            <h3 className="font-heading text-lg sm:text-xl font-black text-slate-900 group-hover:text-blue-900 transition-colors tracking-tight">
              {indicator.shortName}
            </h3>
            {renderSparkline()}
          </div>
          <p className="text-xs text-slate-500 line-clamp-1 mt-0.5 font-medium" title={indicator.name}>
            {indicator.name}
          </p>
        </div>

        {/* Valor Principal em Destaque */}
        <div className="bg-slate-50/70 rounded-xl p-3 border border-slate-100 mb-3">
          <div className="flex items-baseline justify-between gap-2">
            <div className="w-full">
              <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                {indicator.marketStatus === "fechado" ? "Último Fechamento" : "Valor Atual"} ({indicator.unit})
              </span>
              {isAvailable ? (
                <div className="text-2xl sm:text-3xl font-black font-heading text-slate-900 tracking-tight mt-0.5">
                  {indicator.formattedValue}
                </div>
              ) : (
                <div className="mt-1">
                  <div className="text-sm font-bold text-slate-700">
                    Dados indisponíveis no momento.
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                    Não foi possível carregar a cotação em tempo real. Consulte a B3 diretamente.
                  </p>
                  {indicator.quotationUrl && (
                    <a
                      href={indicator.quotationUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-1.5 inline-flex items-center gap-1 text-xs font-bold text-blue-700 hover:text-blue-900 underline"
                    >
                      <span>Acessar Cotações na B3</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              )}
            </div>
            {isAvailable && getVariationBadge()}
          </div>

          {/* Período de Referência, Anterior e Timestamp */}
          <div className="mt-2 pt-2 border-t border-slate-200/60 flex flex-wrap items-center justify-between gap-x-2 gap-y-1 text-[11px] text-slate-500 font-medium">
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3 text-slate-400" />
              <span>Ref: {indicator.referencePeriod}</span>
            </span>
            {indicator.quoteTimestamp ? (
              <span className="text-slate-500 font-mono text-[10px]" title="Data e hora da cotação">
                {indicator.quoteTimestamp}
              </span>
            ) : indicator.formattedPreviousValue ? (
              <span className="text-slate-400">
                Anterior: {indicator.formattedPreviousValue}
              </span>
            ) : null}
          </div>
        </div>

        {/* Descrição curta */}
        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
          {indicator.description}
        </p>
      </div>

      {/* Rodapé do card com ações */}
      <div className="px-4 sm:px-5 py-3 bg-slate-50/90 border-t border-slate-100 flex items-center justify-between gap-2">
        <a
          href={indicator.quotationUrl || indicator.sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-500 hover:text-blue-700 transition-colors group/link"
          title={`Acessar portal oficial: ${indicator.sourceAgency}`}
        >
          <span>{indicator.source}</span>
          <ExternalLink className="w-3 h-3 text-slate-400 group-hover/link:text-blue-600" />
        </a>

        <button
          onClick={() => onOpenDetails(indicator)}
          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white hover:bg-slate-900 hover:text-white border border-slate-200 text-slate-800 text-xs font-bold transition-all shadow-2xs cursor-pointer active:scale-95"
          aria-label={`Ver histórico e metodologia de ${indicator.shortName}`}
        >
          <span>Detalhes</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
