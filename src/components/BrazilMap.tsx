import React, { useState, useRef, useEffect, useMemo } from "react";
import {
  BRAZIL_STATES_GEO,
  BrazilStateGeo,
  MAP_VIEWBOX,
} from "../data/brazilGeo";
import {
  ElectionDataSet,
  Candidate,
  StateElectionResult,
  formatVotesBR,
  formatPercentBR,
} from "../data/electionData";
import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Maximize2,
  Minimize2,
  Search,
  Layers,
  ChevronRight,
  Award,
} from "lucide-react";

interface BrazilMapProps {
  dataset: ElectionDataSet;
  selectedStateUf: string | null;
  onSelectState: (uf: string) => void;
  candidateFilter: string | null;
  onSelectCandidateFilter: (id: string | null) => void;
}

interface TooltipState {
  visible: boolean;
  x: number;
  y: number;
  uf: string;
}

// Predefinições regionais da câmera
const REGION_PRESETS: Record<
  string,
  { label: string; zoom: number; panX: number; panY: number }
> = {
  all: { label: "Brasil Inteiro", zoom: 1, panX: 0, panY: 0 },
  Norte: { label: "Região Norte", zoom: 1.8, panX: 130, panY: 130 },
  Nordeste: { label: "Região Nordeste", zoom: 2.1, panX: -260, panY: 140 },
  "Centro-Oeste": { label: "Centro-Oeste", zoom: 2.0, panX: -20, panY: -40 },
  Sudeste: { label: "Região Sudeste", zoom: 2.3, panX: -190, panY: -220 },
  Sul: { label: "Região Sul", zoom: 2.4, panX: -90, panY: -420 },
};

// Estados pequenos com linhas conectoras no litoral/DF
const CALLOUT_CONFIGS: Record<
  string,
  { lineTo: [number, number]; labelPos: [number, number] }
> = {
  DF: { lineTo: [530, 438], labelPos: [535, 438] },
  RN: { lineTo: [735, 235], labelPos: [740, 235] },
  PB: { lineTo: [735, 265], labelPos: [740, 265] },
  PE: { lineTo: [725, 292], labelPos: [730, 292] },
  AL: { lineTo: [735, 320], labelPos: [740, 320] },
  SE: { lineTo: [725, 345], labelPos: [730, 345] },
  ES: { lineTo: [665, 510], labelPos: [670, 510] },
  RJ: { lineTo: [640, 575], labelPos: [645, 575] },
};

export const BrazilMap: React.FC<BrazilMapProps> = ({
  dataset,
  selectedStateUf,
  onSelectState,
  candidateFilter,
  onSelectCandidateFilter,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  // Estados de navegação, zoom e tela cheia
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activeRegion, setActiveRegion] = useState("all");

  // Busca de estados
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Tooltip flutuante ao passar o mouse
  const [tooltip, setTooltip] = useState<TooltipState>({
    visible: false,
    x: 0,
    y: 0,
    uf: "",
  });

  const candidatesMap = useMemo(() => {
    return Object.fromEntries(dataset.candidates.map((c) => [c.id, c]));
  }, [dataset.candidates]);

  // Controle de Tela Cheia
  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFsChange);
    return () => document.removeEventListener("fullscreenchange", handleFsChange);
  }, []);

  // Controles de zoom
  const handleZoomIn = () => {
    setZoom((z) => Math.min(3.8, Number((z * 1.25).toFixed(2))));
  };

  const handleZoomOut = () => {
    setZoom((z) => {
      const next = Math.max(0.85, Number((z / 1.25).toFixed(2)));
      if (next <= 1) setPan({ x: 0, y: 0 });
      return next;
    });
  };

  const handleReset = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
    setActiveRegion("all");
  };

  const handleRegionSelect = (regionKey: string) => {
    setActiveRegion(regionKey);
    const preset = REGION_PRESETS[regionKey];
    if (preset) {
      setZoom(preset.zoom);
      setPan({ x: preset.panX, y: preset.panY });
    }
  };

  // Arraste do mouse
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setPan({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Hover sobre estados
  const handleStateMouseEnter = (
    e: React.MouseEvent,
    geo: BrazilStateGeo
  ) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    setTooltip({
      visible: true,
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      uf: geo.uf,
    });
  };

  const handleStateMouseMove = (e: React.MouseEvent) => {
    if (!tooltip.visible) return;
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    setTooltip((prev) => ({
      ...prev,
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    }));
  };

  const handleStateMouseLeave = () => {
    setTooltip((prev) => ({ ...prev, visible: false }));
  };

  // Seleção via busca
  const handleSelectSearchedState = (uf: string) => {
    onSelectState(uf);
    setSearchQuery("");
    setIsSearchOpen(false);

    const geo = BRAZIL_STATES_GEO.find((g) => g.uf === uf);
    if (geo) {
      const centerX = MAP_VIEWBOX.width / 2;
      const centerY = MAP_VIEWBOX.height / 2;
      const targetZoom = 2.0;
      setZoom(targetZoom);
      setPan({
        x: (centerX - geo.centroid[0]) * (targetZoom - 0.4),
        y: (centerY - geo.centroid[1]) * (targetZoom - 0.4),
      });
    }
  };

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase().trim();
    return BRAZIL_STATES_GEO.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.uf.toLowerCase().includes(q) ||
        s.capital.toLowerCase().includes(q)
    ).slice(0, 6);
  }, [searchQuery]);

  // Cor do estado pelo vencedor (Flávio = Azul, Lula = Vermelho)
  const getStateColor = (uf: string): string => {
    const res = dataset.states[uf];
    if (!res) return "#E2E8F0";

    const winner = candidatesMap[res.winnerId];
    if (!winner) return "#94A3B8";

    return winner.color;
  };

  // Opacidade no filtro por candidato
  const getStateOpacity = (uf: string): number => {
    if (!candidateFilter) return 1;
    const res = dataset.states[uf];
    if (!res) return 0.3;
    return res.winnerId === candidateFilter ? 1 : 0.22;
  };

  // Dados para o tooltip
  const tooltipData: StateElectionResult | null = tooltip.uf
    ? dataset.states[tooltip.uf] || null
    : null;
  const tooltipWinner: Candidate | null = tooltipData
    ? candidatesMap[tooltipData.winnerId] || null
    : null;

  const tooltipFlavio = tooltipData?.candidates.find((c) => c.candidateId === "flavio");
  const tooltipLula = tooltipData?.candidates.find((c) => c.candidateId === "lula");
  const tooltipOutros = tooltipData?.candidates.find((c) => c.candidateId === "outros");

  return (
    <div
      ref={containerRef}
      id="mapa-interativo"
      className={`relative w-full bg-slate-100 rounded-3xl border border-slate-200 overflow-hidden select-none transition-all ${
        isFullscreen ? "h-screen rounded-none z-50 fixed inset-0" : "h-[650px] sm:h-[720px] lg:h-[790px]"
      }`}
    >
      {/* Barra Superior do Mapa: Busca, Regiões e Botões de Ação */}
      <div className="absolute top-3.5 left-3.5 right-3.5 z-20 flex flex-wrap items-center justify-between gap-2.5 pointer-events-none">
        {/* Esquerda: Caixa de Busca e Seletor de Região */}
        <div className="flex items-center gap-2 pointer-events-auto">
          {/* Caixa de Busca com Autocomplete */}
          <div className="relative">
            <div className="flex items-center bg-white/95 backdrop-blur-md rounded-xl border border-slate-200 shadow-xs px-3 py-2 w-48 sm:w-64 focus-within:ring-2 focus-within:ring-slate-900/10 focus-within:border-slate-500 transition-all">
              <Search className="w-4 h-4 text-slate-400 shrink-0 mr-2" />
              <input
                type="text"
                placeholder="Buscar estado ou sigla..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setIsSearchOpen(true);
                }}
                onFocus={() => setIsSearchOpen(true)}
                className="w-full text-xs bg-transparent text-slate-900 placeholder:text-slate-400 focus:outline-none font-medium"
              />
            </div>

            {/* Menu Suspenso de Resultados de Busca */}
            {isSearchOpen && searchResults.length > 0 && (
              <div className="absolute top-full left-0 mt-1 w-64 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-30 overflow-hidden">
                {searchResults.map((st) => {
                  const stateRes = dataset.states[st.uf];
                  const winner = stateRes ? candidatesMap[stateRes.winnerId] : null;
                  return (
                    <button
                      key={st.uf}
                      onClick={() => handleSelectSearchedState(st.uf)}
                      className="w-full px-3 py-2 text-left hover:bg-slate-50 flex items-center justify-between text-xs cursor-pointer transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-bold font-mono text-slate-900 bg-slate-100 px-1.5 py-0.5 rounded text-[11px] border border-slate-200">
                          {st.uf}
                        </span>
                        <div>
                          <span className="font-bold text-slate-900 block">
                            {st.name}
                          </span>
                          <span className="text-[10px] text-slate-500">
                            {st.region}
                          </span>
                        </div>
                      </div>
                      {winner && (
                        <span
                          className="text-[10px] font-bold text-white px-2 py-0.5 rounded shadow-2xs"
                          style={{ backgroundColor: winner.color }}
                        >
                          {winner.popularName}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Abas de Regiões Brasileiras */}
          <div className="hidden lg:flex items-center bg-white/95 backdrop-blur-md rounded-xl p-1 border border-slate-200 shadow-xs text-xs">
            {Object.entries(REGION_PRESETS).map(([key, item]) => {
              const isActive = activeRegion === key;
              return (
                <button
                  key={key}
                  onClick={() => handleRegionSelect(key)}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer whitespace-nowrap text-xs ${
                    isActive
                      ? "bg-slate-900 text-white shadow-xs"
                      : "text-slate-600 hover:text-slate-950 hover:bg-slate-50"
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Direita: Botões de Zoom e Tela Cheia */}
        <div className="flex items-center gap-1.5 pointer-events-auto">
          <div className="flex items-center bg-white/95 backdrop-blur-md rounded-xl border border-slate-200 shadow-xs p-1 text-slate-700">
            <button
              onClick={handleZoomIn}
              className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer text-slate-700 hover:text-slate-950"
              title="Aproximar visualização (+)"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={handleZoomOut}
              className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer text-slate-700 hover:text-slate-950"
              title="Afastar visualização (-)"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <button
              onClick={handleReset}
              className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer text-slate-700 hover:text-slate-950"
              title="Redefinir visualização original"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={toggleFullscreen}
              className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer text-slate-700 hover:text-slate-950"
              title={isFullscreen ? "Sair da tela cheia" : "Modo tela cheia"}
            >
              {isFullscreen ? (
                <Minimize2 className="w-4 h-4" />
              ) : (
                <Maximize2 className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Tela de Desenho SVG Interativa */}
      <div
        className="w-full h-full cursor-grab active:cursor-grabbing overflow-hidden flex items-center justify-center relative"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <svg
          ref={svgRef}
          viewBox={`0 0 ${MAP_VIEWBOX.width} ${MAP_VIEWBOX.height}`}
          className="w-full h-full max-h-full transition-transform duration-75 ease-out"
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            transformOrigin: "center center",
          }}
        >
          {/* Grade suave de fundo */}
          <defs>
            <pattern
              id="grade-suave"
              width="40"
              height="40"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 40 0 L 0 0 0 40"
                fill="none"
                stroke="rgba(15, 23, 42, 0.03)"
                strokeWidth="1"
              />
            </pattern>
          </defs>
          <rect
            width={MAP_VIEWBOX.width}
            height={MAP_VIEWBOX.height}
            fill="url(#grade-suave)"
          />

          {/* Renderização das 27 Unidades da Federação */}
          <g id="camada-estados-brasil">
            {BRAZIL_STATES_GEO.map((geo) => {
              const isSelected = selectedStateUf === geo.uf;
              const fill = getStateColor(geo.uf);
              const opacity = getStateOpacity(geo.uf);

              return (
                <path
                  key={geo.uf}
                  d={geo.path}
                  fill={fill}
                  fillOpacity={opacity}
                  stroke="#FFFFFF"
                  strokeWidth={isSelected ? 2.6 : 1.1}
                  strokeLinejoin="round"
                  className={`brazil-state-path ${
                    isSelected ? "is-selected" : ""
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectState(geo.uf);
                  }}
                  onMouseEnter={(e) => handleStateMouseEnter(e, geo)}
                  onMouseMove={handleStateMouseMove}
                  onMouseLeave={handleStateMouseLeave}
                />
              );
            })}
          </g>

          {/* Rótulos de Siglas das UFs e Conectores Costeiros */}
          <g id="camada-rotulos-estados" className="pointer-events-none">
            {BRAZIL_STATES_GEO.map((geo) => {
              const callout = CALLOUT_CONFIGS[geo.uf];
              const isSelected = selectedStateUf === geo.uf;
              const opacity = getStateOpacity(geo.uf);

              if (callout) {
                return (
                  <g key={`conector-${geo.uf}`} opacity={opacity}>
                    <line
                      x1={geo.centroid[0]}
                      y1={geo.centroid[1]}
                      x2={callout.lineTo[0]}
                      y2={callout.lineTo[1]}
                      stroke="#334155"
                      strokeWidth="0.9"
                      strokeDasharray="2 2"
                    />
                    <circle
                      cx={geo.centroid[0]}
                      cy={geo.centroid[1]}
                      r="2.6"
                      fill="#0F172A"
                    />
                    <rect
                      x={callout.labelPos[0] - 2}
                      y={callout.labelPos[1] - 8}
                      width="21"
                      height="15"
                      rx="3.5"
                      fill={isSelected ? "#0F172A" : "#FFFFFF"}
                      stroke="#64748B"
                      strokeWidth="0.9"
                    />
                    <text
                      x={callout.labelPos[0] + 8.5}
                      y={callout.labelPos[1] + 2.5}
                      textAnchor="middle"
                      fontSize="9.5"
                      fontWeight="bold"
                      fontFamily="var(--font-mono)"
                      fill={isSelected ? "#FFFFFF" : "#0F172A"}
                    >
                      {geo.uf}
                    </text>
                  </g>
                );
              }

              return (
                <text
                  key={`sigla-${geo.uf}`}
                  x={geo.centroid[0]}
                  y={geo.centroid[1]}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize={
                    geo.uf === "AM" || geo.uf === "PA" || geo.uf === "MT"
                      ? "12.5"
                      : "10.5"
                  }
                  fontWeight="bold"
                  fontFamily="var(--font-mono)"
                  fill="#FFFFFF"
                  opacity={opacity}
                  style={{
                    filter: "drop-shadow(0px 1px 2px rgba(0,0,0,0.85))",
                  }}
                >
                  {geo.uf}
                </text>
              );
            })}
          </g>
        </svg>
      </div>

      {/* Tooltip Flutuante Completo em Português */}
      {tooltip.visible && tooltipData && tooltipWinner && (
        <div
          className="absolute z-30 pointer-events-none bg-slate-950/95 backdrop-blur-md text-white rounded-2xl p-4 shadow-2xl border border-slate-700/80 w-76 text-xs animate-in fade-in zoom-in-95 duration-100"
          style={{
            left: `${Math.min(tooltip.x + 16, (containerRef.current?.clientWidth || 300) - 315)}px`,
            top: `${Math.min(tooltip.y + 16, (containerRef.current?.clientHeight || 300) - 360)}px`,
          }}
        >
          {/* Cabeçalho do Tooltip */}
          <div className="flex items-center justify-between gap-2 border-b border-slate-800 pb-2.5 mb-2.5">
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-mono font-bold text-white bg-slate-800 px-1.5 py-0.5 rounded text-[10px] border border-slate-700">
                  {tooltipData.uf}
                </span>
                <span className="font-heading font-extrabold text-sm text-slate-100">
                  {tooltipData.name}
                </span>
              </div>
              <span className="text-[10px] text-slate-400">
                Região {tooltipData.region} · Capital: {tooltipData.capital}
              </span>
            </div>
            <span
              className="text-[10px] font-black px-2 py-0.5 rounded text-white shadow-2xs shrink-0"
              style={{ backgroundColor: tooltipWinner.color }}
            >
              Venceu: {tooltipWinner.popularName}
            </span>
          </div>

          {/* Votos de Flávio Bolsonaro, Lula e Outros */}
          <div className="space-y-2 mb-3">
            {/* Flávio Bolsonaro */}
            {tooltipFlavio && (
              <div>
                <div className="flex items-center justify-between text-[11px] mb-0.5">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-700 shrink-0" />
                    <span className="font-bold text-slate-100">
                      Flávio Bolsonaro (PL)
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="font-mono font-bold text-blue-400">
                      {formatPercentBR(tooltipFlavio.percentage)}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono ml-1">
                      ({formatVotesBR(tooltipFlavio.votes)})
                    </span>
                  </div>
                </div>
                <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-blue-600 transition-all"
                    style={{ width: `${tooltipFlavio.percentage}%` }}
                  />
                </div>
              </div>
            )}

            {/* Lula */}
            {tooltipLula && (
              <div>
                <div className="flex items-center justify-between text-[11px] mb-0.5">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-600 shrink-0" />
                    <span className="font-bold text-slate-100">
                      Lula (PT)
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="font-mono font-bold text-red-400">
                      {formatPercentBR(tooltipLula.percentage)}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono ml-1">
                      ({formatVotesBR(tooltipLula.votes)})
                    </span>
                  </div>
                </div>
                <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-red-600 transition-all"
                    style={{ width: `${tooltipLula.percentage}%` }}
                  />
                </div>
              </div>
            )}

            {/* Outros candidatos */}
            {tooltipOutros && (
              <div>
                <div className="flex items-center justify-between text-[11px] mb-0.5">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-slate-500 shrink-0" />
                    <span className="font-medium text-slate-300">
                      Outros Candidatos
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="font-mono font-bold text-slate-300">
                      {formatPercentBR(tooltipOutros.percentage)}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono ml-1">
                      ({formatVotesBR(tooltipOutros.votes)})
                    </span>
                  </div>
                </div>
                <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-slate-500 transition-all"
                    style={{ width: `${tooltipOutros.percentage}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Dados Eleitorais do Estado */}
          <div className="pt-2 border-t border-slate-800 space-y-1 text-[10px] font-mono">
            <div className="flex items-center justify-between text-slate-300">
              <span>Votos Válidos:</span>
              <strong className="text-slate-100 font-bold">
                {formatVotesBR(tooltipData.validVotes)}
              </strong>
            </div>

            <div className="flex items-center justify-between text-slate-400">
              <span>Votos em Branco:</span>
              <span>
                {formatVotesBR(tooltipData.blankVotes)} ({formatPercentBR(tooltipData.blankVotesPercentage)})
              </span>
            </div>

            <div className="flex items-center justify-between text-slate-400">
              <span>Votos Nulos:</span>
              <span>
                {formatVotesBR(tooltipData.nullVotes)} ({formatPercentBR(tooltipData.nullVotesPercentage)})
              </span>
            </div>

            <div className="flex items-center justify-between text-slate-300 pt-1 border-t border-slate-800/60">
              <span>Comparecimento:</span>
              <span className="text-emerald-400 font-bold">
                {formatVotesBR(tooltipData.turnout)} ({formatPercentBR(tooltipData.turnoutPercentage)})
              </span>
            </div>

            <div className="flex items-center justify-between text-slate-400">
              <span>Abstenção:</span>
              <span>
                {formatVotesBR(tooltipData.abstention)} ({formatPercentBR(tooltipData.abstentionPercentage)})
              </span>
            </div>
          </div>

          <div className="mt-2.5 pt-1.5 border-t border-slate-800 text-[10px] text-slate-400 flex items-center justify-between font-sans">
            <span>Clique para abrir o painel detalhado</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          </div>
        </div>
      )}

      {/* Legenda Dinâmica na Parte Inferior do Mapa */}
      <div className="absolute bottom-3.5 left-3.5 right-3.5 sm:right-auto z-20 bg-white/95 backdrop-blur-md p-3.5 rounded-2xl border border-slate-200 shadow-md">
        <div className="flex items-center justify-between gap-3 mb-2">
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-slate-500" />
            Vencedor no 1º Turno por Estado
          </span>
          {candidateFilter && (
            <button
              onClick={() => onSelectCandidateFilter(null)}
              className="text-[10px] text-blue-700 underline hover:text-blue-900 cursor-pointer font-bold"
            >
              Limpar filtro
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {dataset.candidates.map((cand) => {
            const statesWon = Object.values(dataset.states).filter(
              (s) => s.winnerId === cand.id
            ).length;
            const isFilterActive = candidateFilter === cand.id;

            return (
              <button
                key={cand.id}
                onClick={() =>
                  onSelectCandidateFilter(isFilterActive ? null : cand.id)
                }
                className={`flex items-center gap-2 text-xs px-2.5 py-1.5 rounded-xl transition-all cursor-pointer ${
                  isFilterActive
                    ? "bg-slate-900 text-white font-bold shadow-xs"
                    : "hover:bg-slate-100 text-slate-800 border border-slate-200/90 bg-white"
                }`}
                title={`Clique para destacar no mapa os estados vencidos por ${cand.popularName}`}
              >
                <span
                  className="w-3.5 h-3.5 rounded-sm shrink-0 border border-black/10"
                  style={{ backgroundColor: cand.color }}
                />
                <span className="font-bold">{cand.popularName}</span>
                <span
                  className={`text-[10px] font-mono ${
                    isFilterActive ? "text-slate-300" : "text-slate-500"
                  }`}
                >
                  ({statesWon} {statesWon === 1 ? "estado" : "estados"})
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
