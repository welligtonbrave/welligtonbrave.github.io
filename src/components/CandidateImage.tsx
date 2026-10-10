import React, { useState } from "react";
import { User } from "lucide-react";

interface CandidateImageProps {
  src?: string;
  alt: string;
  candidateName: string;
  ballotNumber?: number;
  partyColor?: string;
  className?: string;
  aspectRatio?: "square" | "portrait" | "circle";
  size?: "sm" | "md" | "lg" | "xl";
  showAttributionBadge?: boolean;
  attribution?: string;
}

/**
 * Componente oficial de exibição de fotografia autêntica de candidatos do TSE.
 * Inclui:
 * - Lazy loading nativo
 * - Alt text descritivo e contextualizado
 * - Aspect ratio e enquadramento consistentes
 * - Fallback neutro resiliente com iniciais, número de urna e cores institucionais
 *   caso a imagem não carregue ou esteja indisponível.
 */
export const CandidateImage: React.FC<CandidateImageProps> = ({
  src,
  alt,
  candidateName,
  ballotNumber,
  partyColor = "#1D4ED8",
  className = "",
  aspectRatio = "portrait",
  size = "md",
  showAttributionBadge = false,
  attribution,
}) => {
  const [imageError, setImageError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Iniciais do candidato para o fallback neutro
  const initials = candidateName
    .split(" ")
    .filter((p) => p.length > 0 && !["de", "da", "do", "dos", "das", "e"].includes(p.toLowerCase()))
    .slice(0, 2)
    .map((p) => p[0].toUpperCase())
    .join("");

  const aspectClasses = {
    square: "aspect-square",
    portrait: "aspect-[4/5]",
    circle: "aspect-square rounded-full",
  }[aspectRatio];

  const sizeClasses = {
    sm: "w-10 h-10 text-xs",
    md: "w-20 h-24 text-sm",
    lg: "w-32 h-40 text-base",
    xl: "w-full h-full text-lg",
  }[size];

  // Se houver erro ou não houver src, renderiza o fallback neutro
  if (!src || imageError) {
    return (
      <div
        className={`relative flex flex-col items-center justify-center bg-slate-100 border border-slate-200 text-slate-700 overflow-hidden select-none transition-all ${aspectClasses} ${sizeClasses} ${className}`}
        style={{
          borderTopColor: partyColor,
          borderTopWidth: "3px",
        }}
        title={`Fotografia não disponível para ${candidateName} — Exibindo identificador oficial`}
        aria-label={`Identificador neutro de ${candidateName}`}
      >
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center text-white font-mono font-black text-xs shadow-2xs mb-1"
          style={{ backgroundColor: partyColor }}
        >
          {ballotNumber || <User className="w-4 h-4" />}
        </div>
        <span className="font-heading font-black text-xs tracking-wider text-slate-800">
          {initials || "CAND"}
        </span>
        <span className="text-[9px] text-slate-500 font-mono mt-0.5">
          {ballotNumber ? `nº ${ballotNumber}` : "TSE"}
        </span>
      </div>
    );
  }

  return (
    <div
      className={`relative overflow-hidden bg-slate-100 border border-slate-200/90 shadow-2xs group ${aspectClasses} ${className}`}
    >
      {/* Skeleton enquanto carrega */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-slate-200 animate-pulse flex items-center justify-center text-slate-400">
          <User className="w-6 h-6 opacity-40" />
        </div>
      )}

      <img
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        referrerPolicy="no-referrer"
        onLoad={() => setIsLoaded(true)}
        onError={() => setImageError(true)}
        className={`w-full h-full object-cover object-top transition-opacity duration-300 ${
          isLoaded ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* Faixa sutil na base para contraste editorial */}
      <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-slate-950/60 to-transparent pointer-events-none" />

      {/* Badge do número de urna fixado no canto */}
      {ballotNumber && (
        <div
          className="absolute top-2 left-2 px-1.5 py-0.5 rounded text-[10px] font-mono font-black text-white shadow-xs z-10"
          style={{ backgroundColor: partyColor }}
        >
          {ballotNumber}
        </div>
      )}

      {/* Indicador de atribuição de imagem oficial */}
      {showAttributionBadge && attribution && (
        <div
          className="absolute bottom-1 right-1.5 text-[9px] text-white/80 font-mono tracking-tight opacity-0 group-hover:opacity-100 transition-opacity bg-black/60 px-1 py-0.5 rounded pointer-events-none"
          title={attribution}
        >
          © TSE / Foto Oficial
        </div>
      )}
    </div>
  );
};
