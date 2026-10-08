import React from "react";
import { NewsItem, NewsCategory } from "../types/news";
import { Calendar, ExternalLink, Bookmark, Sparkles } from "lucide-react";

interface NewsCardProps {
  article: NewsItem;
  isFeatured?: boolean;
  onOpenDetails: (article: NewsItem) => void;
}

const CATEGORY_STYLES: Record<NewsCategory, { bg: string; text: string; border: string }> = {
  Política: { bg: "bg-indigo-50", text: "text-indigo-800", border: "border-indigo-200/80" },
  Eleições: { bg: "bg-blue-50", text: "text-blue-800", border: "border-blue-200/80" },
  Governo: { bg: "bg-slate-100", text: "text-slate-800", border: "border-slate-300/80" },
  Congresso: { bg: "bg-amber-50", text: "text-amber-900", border: "border-amber-200/80" },
  Justiça: { bg: "bg-emerald-50", text: "text-emerald-800", border: "border-emerald-200/80" },
  Economia: { bg: "bg-cyan-50", text: "text-cyan-900", border: "border-cyan-200/80" },
  Brasil: { bg: "bg-teal-50", text: "text-teal-800", border: "border-teal-200/80" },
  Mundo: { bg: "bg-rose-50", text: "text-rose-800", border: "border-rose-200/80" },
};

export const NewsCard: React.FC<NewsCardProps> = ({
  article,
  isFeatured = false,
  onOpenDetails,
}) => {
  const catStyle = CATEGORY_STYLES[article.category] || CATEGORY_STYLES["Política"];
  const isSociedadeAtiva = article.source.includes("Sociedade Ativa");

  return (
    <article
      onClick={() => onOpenDetails(article)}
      className={`group bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 flex flex-col justify-between hover:border-slate-400 hover:shadow-md transition-all duration-200 cursor-pointer relative overflow-hidden ${
        isFeatured
          ? "md:col-span-2 lg:col-span-2 bg-gradient-to-br from-blue-50/30 via-white to-slate-50 border-blue-200"
          : ""
      }`}
    >
      <div>
        {/* Cabeçalho do Card: Categoria, Origem e Destaque */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md border ${catStyle.bg} ${catStyle.text} ${catStyle.border}`}
            >
              {article.category}
            </span>

            {isSociedadeAtiva ? (
              <span className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-900 text-white shadow-2xs">
                <Sparkles className="w-2.5 h-2.5" />
                Exclusivo
              </span>
            ) : null}
          </div>

          <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-medium">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>{article.publishedAt.split(" às ")[0]}</span>
          </div>
        </div>

        {/* Título Principal */}
        <h3
          className={`font-heading font-black text-slate-900 leading-snug group-hover:text-blue-900 transition-colors ${
            isFeatured ? "text-xl sm:text-2xl mb-3" : "text-base sm:text-lg mb-2"
          }`}
        >
          {article.title}
        </h3>

        {/* Resumo da Notícia */}
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-3 mb-4">
          {article.summary}
        </p>
      </div>

      {/* Rodapé e Atribuição Transparente de Fonte */}
      <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-500">
        <div className="flex items-center gap-1.5 text-[11px]">
          <span className="font-semibold text-slate-400">Fonte:</span>
          <span
            className={`font-bold ${
              isSociedadeAtiva ? "text-slate-900" : "text-slate-700"
            }`}
          >
            {article.source}
          </span>
          <span className="text-slate-300">·</span>
          <span className="text-slate-400">{article.publishedAt.includes(" às ") ? article.publishedAt.split(" às ")[1] : ""}</span>
        </div>

        {/* Ação Direta para a Notícia Original */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <a
            href={article.articleUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-800 font-bold text-[11px] border border-slate-200 hover:border-blue-200 transition-all cursor-pointer"
            title={`Abrir reportagem completa em ${article.source}`}
          >
            <span>Leia a notícia original</span>
            <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-blue-600" />
          </a>
        </div>
      </div>
    </article>
  );
};
