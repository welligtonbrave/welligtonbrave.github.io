import React from "react";

interface AdBannerProps {
  format?: "leaderboard" | "in-feed" | "rectangle";
  className?: string;
}

export const AdBanner: React.FC<AdBannerProps> = ({
  format = "leaderboard",
  className = "",
}) => {
  return (
    <aside
      aria-label="Espaço de Publicidade"
      className={`my-8 flex flex-col items-center justify-center ${className}`}
    >
      <div className="w-full max-w-5xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between text-[10px] text-slate-400 uppercase tracking-widest font-mono mb-1.5 px-1">
          <span>Publicidade</span>
          <span>Google AdSense</span>
        </div>

        {format === "leaderboard" && (
          <div className="w-full h-24 sm:h-28 bg-slate-50 border border-dashed border-slate-300 rounded-2xl flex items-center justify-center text-center p-4">
            <div className="text-slate-400 text-xs">
              <span className="font-semibold block text-slate-500">Espaço Publicitário Responsivo (Leaderboard 728x90 / 970x90)</span>
              <span className="text-[11px] block mt-0.5">Área reservada para tags oficiais do Google AdSense</span>
            </div>
          </div>
        )}

        {format === "in-feed" && (
          <div className="w-full h-32 sm:h-36 bg-slate-50 border border-dashed border-slate-300 rounded-2xl flex items-center justify-center text-center p-4">
            <div className="text-slate-400 text-xs">
              <span className="font-semibold block text-slate-500">Espaço Publicitário In-Feed</span>
              <span className="text-[11px] block mt-0.5">Unidade responsiva entre seções editoriais</span>
            </div>
          </div>
        )}

        {format === "rectangle" && (
          <div className="w-full max-w-sm mx-auto h-64 bg-slate-50 border border-dashed border-slate-300 rounded-2xl flex items-center justify-center text-center p-4">
            <div className="text-slate-400 text-xs">
              <span className="font-semibold block text-slate-500">Retângulo Médio (300x250)</span>
              <span className="text-[11px] block mt-0.5">Área reservada para anúncios nativos</span>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};
