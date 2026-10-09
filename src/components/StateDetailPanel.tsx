import React from "react";
import {
  ElectionDataSet,
  StateElectionResult,
  Candidate,
  formatVotesBR,
  formatPercentBR,
} from "../data/electionData";
import {
  X,
  ChevronLeft,
  ChevronRight,
  Users,
  Award,
  BarChart2,
  CheckCircle2,
} from "lucide-react";

interface StateDetailPanelProps {
  dataset: ElectionDataSet;
  uf: string | null;
  onClose: () => void;
  onSelectState: (uf: string) => void;
}

export const StateDetailPanel: React.FC<StateDetailPanelProps> = ({
  dataset,
  uf,
  onClose,
  onSelectState,
}) => {
  if (!uf) return null;

  const stateData: StateElectionResult | undefined = dataset.states[uf];
  if (!stateData) return null;

  const candidatesMap = Object.fromEntries(
    dataset.candidates.map((c) => [c.id, c])
  );

  const sortedCandidates = [...stateData.candidates].sort((a, b) => b.votes - a.votes);
  const winner: Candidate | undefined = candidatesMap[stateData.winnerId] || candidatesMap[sortedCandidates[0]?.candidateId];
  const runnerUpResult = sortedCandidates[1];
  const runnerUp: Candidate | undefined = runnerUpResult
    ? candidatesMap[runnerUpResult.candidateId]
    : undefined;

  // Lista ordenada alfabeticamente para navegação anterior/próximo
  const allUfs = Object.keys(dataset.states).sort();
  const currentIndex = allUfs.indexOf(uf);
  const prevUf = currentIndex > 0 ? allUfs[currentIndex - 1] : allUfs[allUfs.length - 1];
  const nextUf = currentIndex < allUfs.length - 1 ? allUfs[currentIndex + 1] : allUfs[0];

  return (
    <>
      {/* Backdrop para fechar ao tocar fora no mobile */}
      <div
        onClick={onClose}
        className="fixed inset-0 z-40 bg-slate-950/40 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
        aria-hidden="true"
      />

      <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[480px] lg:w-[520px] bg-white shadow-2xl border-l border-slate-200 flex flex-col transform transition-transform duration-300 ease-in-out">
        {/* Cabeçalho do Painel Lateral */}
        <div className="p-5 sm:p-6 border-b border-slate-200 bg-slate-50/80">
          <div className="flex items-center justify-between gap-3 mb-3">
            <div className="flex items-center gap-2">
              <span className="font-mono font-black text-base text-white bg-slate-950 px-2.5 py-0.5 rounded-lg shadow-xs">
                {stateData.uf}
              </span>
              <span className="text-xs uppercase tracking-wider text-slate-500 font-bold">
                Região {stateData.region} · Capital: {stateData.capital}
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => onSelectState(prevUf)}
                className="min-h-[40px] min-w-[40px] flex items-center justify-center rounded-xl hover:bg-slate-200 active:bg-slate-300 text-slate-700 transition-colors cursor-pointer"
                title={`Estado anterior (${prevUf})`}
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => onSelectState(nextUf)}
                className="min-h-[40px] min-w-[40px] flex items-center justify-center rounded-xl hover:bg-slate-200 active:bg-slate-300 text-slate-700 transition-colors cursor-pointer"
                title={`Próximo estado (${nextUf})`}
              >
                <ChevronRight className="w-4 h-4" />
              </button>
              <div className="h-5 w-px bg-slate-300 mx-0.5" />
              <button
                onClick={onClose}
                className="min-h-[40px] min-w-[40px] flex items-center justify-center rounded-xl hover:bg-slate-200 active:bg-slate-300 text-slate-700 transition-colors cursor-pointer"
                title="Fechar painel"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

        <h2 className="font-heading text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          {stateData.name}
        </h2>
        <div className="flex items-center gap-2 text-xs text-slate-600 mt-1 font-medium">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>
            100,00% apuradas ({formatVotesBR(stateData.sectionsCounted)} seções eleitorais)
          </span>
        </div>
      </div>

      {/* Conteúdo com rolagem suave */}
      <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
        {/* Destaque do Candidato Vencedor no Estado */}
        {winner && (
          <div
            className="p-5 rounded-2xl border relative overflow-hidden shadow-xs"
            style={{
              borderColor: `${winner.color}40`,
              backgroundColor: `${winner.color}08`,
            }}
          >
            <div
              className="absolute top-0 left-0 bottom-0 w-2"
              style={{ backgroundColor: winner.color }}
            />
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                  Vencedor no Estado
                </span>
                <div className="flex items-center gap-2">
                  <span
                    className="w-7 h-7 rounded-lg text-white text-xs font-black flex items-center justify-center shrink-0 shadow-xs"
                    style={{ backgroundColor: winner.color }}
                  >
                    {winner.ballotNumber}
                  </span>
                  <h3 className="font-heading text-xl font-black text-slate-900">
                    {winner.popularName}
                  </h3>
                  <span className="text-xs font-bold text-slate-500">
                    ({winner.party})
                  </span>
                </div>
              </div>

              <div className="text-right">
                <span className="font-mono text-2xl font-black text-slate-950 block">
                  {formatPercentBR(stateData.candidates[0]?.percentage || 0)}
                </span>
                <span className="text-xs text-slate-500 font-mono font-medium">
                  {formatVotesBR(stateData.candidates[0]?.votes || 0)} votos
                </span>
              </div>
            </div>

            {runnerUp && (
              <div className="mt-3.5 pt-3 border-t border-slate-200/80 text-xs text-slate-700 flex items-center justify-between">
                <span>
                  Vantagem sobre {runnerUp.popularName} ({runnerUp.party}):
                </span>
                <span className="font-mono font-extrabold text-slate-900">
                  +{formatPercentBR(stateData.marginPercentage)} ({formatVotesBR(stateData.marginVotes)} votos)
                </span>
              </div>
            )}
          </div>
        )}

        {/* Quadro Completo de Votos por Candidato */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <BarChart2 className="w-4 h-4 text-slate-500" />
              Resultado da Votação no Estado
            </h4>
            <span className="text-[11px] text-slate-500 font-mono font-medium">
              Votos Válidos Nominais
            </span>
          </div>

          <div className="space-y-3">
            {stateData.candidates.map((cr, idx) => {
              const cand = candidatesMap[cr.candidateId];
              if (!cand) return null;
              const isWinner = idx === 0;

              return (
                <div
                  key={cr.candidateId}
                  className={`p-3.5 rounded-xl border transition-all ${
                    isWinner
                      ? "border-slate-300 bg-slate-50/70 shadow-2xs"
                      : "border-slate-100 bg-white hover:bg-slate-50/40"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-slate-400 w-4">
                        #{idx + 1}
                      </span>
                      <span
                        className="w-5 h-5 rounded text-white text-[10px] font-bold flex items-center justify-center shrink-0 shadow-2xs"
                        style={{ backgroundColor: cand.color }}
                      >
                        {cand.ballotNumber}
                      </span>
                      <div>
                        <span className="font-bold text-slate-900 text-xs block leading-tight">
                          {cand.name}
                        </span>
                        <span className="text-[11px] text-slate-500">
                          {cand.party} · {cand.coalition}
                        </span>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="font-mono font-extrabold text-sm text-slate-900 block">
                        {formatPercentBR(cr.percentage)}
                      </span>
                      <span className="text-[11px] text-slate-500 font-mono">
                        {formatVotesBR(cr.votes)} votos
                      </span>
                    </div>
                  </div>

                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-300"
                      style={{
                        width: `${cr.percentage}%`,
                        backgroundColor: cand.color,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Estatísticas e Participação Eleitoral */}
        <div className="pt-4 border-t border-slate-200">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3 flex items-center gap-1.5">
            <Users className="w-4 h-4 text-slate-500" />
            Estatísticas Eleitorais (TSE)
          </h4>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[11px] text-slate-500 block font-medium">Eleitorado Apto</span>
              <span className="font-mono font-bold text-sm text-slate-900 block mt-0.5">
                {formatVotesBR(stateData.electorate)}
              </span>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[11px] text-slate-500 block font-medium">Comparecimento</span>
              <div className="flex items-baseline justify-between mt-0.5">
                <span className="font-mono font-bold text-sm text-slate-900">
                  {formatPercentBR(stateData.turnoutPercentage)}
                </span>
                <span className="text-[10px] text-slate-500 font-mono">
                  {formatVotesBR(stateData.turnout)}
                </span>
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[11px] text-slate-500 block font-medium">Abstenção</span>
              <div className="flex items-baseline justify-between mt-0.5">
                <span className="font-mono font-bold text-sm text-slate-900">
                  {formatPercentBR(stateData.abstentionPercentage)}
                </span>
                <span className="text-[10px] text-slate-500 font-mono">
                  {formatVotesBR(stateData.abstention)}
                </span>
              </div>
            </div>

            <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-200">
              <span className="text-[11px] text-emerald-900 block font-bold">Votos Válidos</span>
              <div className="flex items-baseline justify-between mt-0.5">
                <span className="font-mono font-bold text-sm text-emerald-950">
                  {formatPercentBR(stateData.validVotesPercentage)}
                </span>
                <span className="text-[10px] text-emerald-700 font-mono">
                  {formatVotesBR(stateData.validVotes)}
                </span>
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[11px] text-slate-500 block font-medium">Votos em Branco</span>
              <div className="flex items-baseline justify-between mt-0.5">
                <span className="font-mono font-bold text-sm text-slate-900">
                  {formatPercentBR(stateData.blankVotesPercentage)}
                </span>
                <span className="text-[10px] text-slate-500 font-mono">
                  {formatVotesBR(stateData.blankVotes)}
                </span>
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[11px] text-slate-500 block font-medium">Votos Nulos</span>
              <div className="flex items-baseline justify-between mt-0.5">
                <span className="font-mono font-bold text-sm text-slate-900">
                  {formatPercentBR(stateData.nullVotesPercentage)}
                </span>
                <span className="text-[10px] text-slate-500 font-mono">
                  {formatVotesBR(stateData.nullVotes)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Nota Constitucional Oficial */}
        <div className="p-3.5 bg-slate-100 rounded-xl text-[11px] text-slate-600 leading-relaxed border border-slate-200/80">
          <p>
            <strong>Norma Oficial do TSE:</strong> Conforme o Artigo 77, § 2º da Constituição Federal de 1988, os votos brancos e nulos são formalmente excluídos da base de cálculo para a apuração dos percentuais válidos.
          </p>
        </div>
      </div>
    </div>
    </>
  );
};
