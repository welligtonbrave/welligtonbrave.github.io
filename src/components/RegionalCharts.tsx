import React from "react";
import { ElectionDataSet, formatPercentBR, formatVotesBR } from "../data/electionData";
import { BarChart3, TrendingUp, Compass, Award } from "lucide-react";

interface RegionalChartsProps {
  dataset: ElectionDataSet;
}

export const RegionalCharts: React.FC<RegionalChartsProps> = ({ dataset }) => {
  // Agregação regional dos dados
  const regions = ["Norte", "Nordeste", "Centro-Oeste", "Sudeste", "Sul"] as const;

  const regionalData = regions.map((regionName) => {
    const statesInRegion = Object.values(dataset.states).filter(
      (s) => s.region === regionName
    );

    let totalValid = 0;
    let flavioVotes = 0;
    let lulaVotes = 0;
    let outrosVotes = 0;

    statesInRegion.forEach((s) => {
      totalValid += s.validVotes;
      const f = s.candidates.find((c) => c.candidateId === "flavio")?.votes || 0;
      const l = s.candidates.find((c) => c.candidateId === "lula")?.votes || 0;
      const o = s.candidates.find((c) => c.candidateId === "outros")?.votes || 0;
      flavioVotes += f;
      lulaVotes += l;
      outrosVotes += o;
    });

    const fPct = totalValid > 0 ? (flavioVotes / totalValid) * 100 : 0;
    const lPct = totalValid > 0 ? (lulaVotes / totalValid) * 100 : 0;
    const oPct = totalValid > 0 ? (outrosVotes / totalValid) * 100 : 0;

    return {
      region: regionName,
      totalValid,
      flavioVotes,
      lulaVotes,
      outrosVotes,
      fPct: Number(fPct.toFixed(2)),
      lPct: Number(lPct.toFixed(2)),
      oPct: Number(oPct.toFixed(2)),
      winner: flavioVotes >= lulaVotes ? "Flávio Bolsonaro" : "Lula",
      winnerColor: flavioVotes >= lulaVotes ? "#1D4ED8" : "#DC2626",
    };
  });

  // Estados mais acirrados (menor margem percentual)
  const closestStates = Object.values(dataset.states)
    .sort((a, b) => a.marginPercentage - b.marginPercentage)
    .slice(0, 5);

  return (
    <section className="py-10 bg-slate-50/60 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
            <Compass className="w-3.5 h-3.5 text-slate-400" />
            <span>Análise Geográfica de Votos</span>
          </div>
          <h2 className="font-heading text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Desempenho Regional & Estados Decisivos
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Comparativo da votação entre Flávio Bolsonaro (PL) e Lula (PT) nas 5 macrorregiões do país e as disputas mais acirradas.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Card 1: Comparativo por Macrorregião (ocupa 2 colunas) */}
          <div className="lg:col-span-2 bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs">
            <h3 className="font-heading font-extrabold text-base sm:text-lg text-slate-900 mb-4 flex items-center justify-between">
              <span>Distribuição por Região do Brasil</span>
              <span className="text-xs font-normal text-slate-400 font-sans">
                % sobre os votos válidos regionais
              </span>
            </h3>

            <div className="space-y-4">
              {regionalData.map((reg) => (
                <div key={reg.region} className="p-3.5 bg-slate-50/70 rounded-xl border border-slate-100">
                  <div className="flex items-center justify-between text-xs sm:text-sm mb-1.5 font-bold">
                    <div className="flex items-center gap-2">
                      <span className="text-slate-900">{reg.region}</span>
                      <span
                        className="text-[10px] font-black px-2 py-0.5 rounded text-white"
                        style={{ backgroundColor: reg.winnerColor }}
                      >
                        1º {reg.winner}
                      </span>
                    </div>
                    <span className="text-slate-500 font-mono text-xs font-medium">
                      {formatVotesBR(reg.totalValid)} válidos
                    </span>
                  </div>

                  {/* Barra Dupla / Proporcional */}
                  <div className="h-5 rounded-lg overflow-hidden flex bg-slate-200 shadow-inner text-[10px] font-mono text-white font-bold leading-5 text-center">
                    <div
                      style={{ width: `${reg.fPct}%` }}
                      className="bg-blue-700 transition-all duration-300"
                      title={`Flávio Bolsonaro: ${formatPercentBR(reg.fPct)} (${formatVotesBR(reg.flavioVotes)})`}
                    >
                      {reg.fPct > 15 ? `${formatPercentBR(reg.fPct)}` : ""}
                    </div>
                    <div
                      style={{ width: `${reg.lPct}%` }}
                      className="bg-red-600 transition-all duration-300"
                      title={`Lula: ${formatPercentBR(reg.lPct)} (${formatVotesBR(reg.lulaVotes)})`}
                    >
                      {reg.lPct > 15 ? `${formatPercentBR(reg.lPct)}` : ""}
                    </div>
                    <div
                      style={{ width: `${reg.oPct}%` }}
                      className="bg-slate-500 transition-all duration-300"
                      title={`Outros: ${formatPercentBR(reg.oPct)} (${formatVotesBR(reg.outrosVotes)})`}
                    >
                      {reg.oPct > 10 ? `${formatPercentBR(reg.oPct)}` : ""}
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-500 mt-1.5 font-mono">
                    <span className="text-blue-900 font-semibold">
                      Flávio: {formatPercentBR(reg.fPct)}
                    </span>
                    <span className="text-red-900 font-semibold">
                      Lula: {formatPercentBR(reg.lPct)}
                    </span>
                    <span className="text-slate-600">
                      Outros: {formatPercentBR(reg.oPct)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Card 2: Estados Mais Acirrados (Margem mais estreita) */}
          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
            <div>
              <h3 className="font-heading font-extrabold text-base sm:text-lg text-slate-900 mb-1 flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-amber-600" />
                <span>Estados Mais Acirrados</span>
              </h3>
              <p className="text-xs text-slate-500 mb-4 leading-relaxed">
                Unidades da Federação onde a diferença entre o 1º e o 2º colocado foi mais apertada no 1º turno.
              </p>

              <div className="space-y-3">
                {closestStates.map((st, idx) => {
                  const winner = st.winnerId === "flavio" ? "Flávio Bolsonaro" : "Lula";
                  const color = st.winnerId === "flavio" ? "#1D4ED8" : "#DC2626";

                  const fData = st.candidates.find((c) => c.candidateId === "flavio");
                  const lData = st.candidates.find((c) => c.candidateId === "lula");

                  return (
                    <div
                      key={st.uf}
                      className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="text-xs font-mono font-bold text-slate-400">
                          #{idx + 1}
                        </span>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-slate-900 text-xs">
                              {st.name}
                            </span>
                            <span className="font-mono text-[10px] text-slate-500 bg-slate-200 px-1 py-0.2 rounded">
                              {st.uf}
                            </span>
                          </div>
                          <span className="text-[11px] text-slate-500 font-mono">
                            F: {formatPercentBR(fData?.percentage || 0)} × L: {formatPercentBR(lData?.percentage || 0)}
                          </span>
                        </div>
                      </div>

                      <div className="text-right">
                        <span
                          className="text-[11px] font-black px-2 py-0.5 rounded text-white block mb-0.5 font-mono"
                          style={{ backgroundColor: color }}
                        >
                          +{formatPercentBR(st.marginPercentage)}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {formatVotesBR(st.marginVotes)} votos
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-500">
              <span>Colégios eleitorais altamente disputados para a campanha de 2º turno.</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
