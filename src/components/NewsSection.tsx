import React, { useState, useMemo } from "react";
import { NewsArticle } from "../data/newsData";
import { AdBanner } from "./AdBanner";
import {
  Calendar,
  Clock,
  ArrowRight,
  X,
  Share2,
  BookOpen,
  Tag,
  Check,
} from "lucide-react";

interface NewsSectionProps {
  articles: NewsArticle[];
}

export const NewsSection: React.FC<NewsSectionProps> = ({ articles }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>("Todas");
  const [activeArticle, setActiveArticle] = useState<NewsArticle | null>(null);
  const [copied, setCopied] = useState(false);

  // Categorias extraídas dinamicamente
  const categories = useMemo(() => {
    const list = Array.from(new Set(articles.map((a) => a.category)));
    return ["Todas", ...list];
  }, [articles]);

  const filteredArticles = useMemo(() => {
    if (selectedCategory === "Todas") return articles;
    return articles.filter((a) => a.category === selectedCategory);
  }, [articles, selectedCategory]);

  const handleShare = () => {
    if (navigator.share && activeArticle) {
      navigator.share({
        title: activeArticle.headline,
        text: activeArticle.lead,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <section id="ultimas-noticias" className="py-14 bg-white border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Cabeçalho Editorial da Seção */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-800 mb-1.5">
              <span className="w-2 h-2 rounded-full bg-blue-700 animate-pulse" />
              <span>Cobertura Especial Eleitoral</span>
            </div>
            <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-slate-900">
              Últimas Notícias e Análises
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
              Reportagens e apurações sobre os resultados do 1º turno, os desdobramentos nos estados e as regras do TSE para a decisão presidencial.
            </p>
          </div>

          {/* Filtro de Categorias */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 text-xs">
            {categories.map((cat) => {
              const isActive = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer whitespace-nowrap text-xs ${
                    isActive
                      ? "bg-slate-900 text-white shadow-xs"
                      : "bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200"
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* Grade de Cartões de Notícias */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArticles.map((article, idx) => {
            const isFeatured = idx === 0 && selectedCategory === "Todas";

            return (
              <article
                key={article.id}
                onClick={() => setActiveArticle(article)}
                className={`bg-slate-50/70 border border-slate-200/90 rounded-2xl p-5 sm:p-6 flex flex-col justify-between hover:border-slate-400 hover:shadow-md transition-all duration-200 cursor-pointer group relative overflow-hidden ${
                  isFeatured ? "md:col-span-2 lg:col-span-2 bg-gradient-to-br from-blue-50/40 via-white to-slate-50" : ""
                }`}
              >
                <div>
                  {/* Categoria e Tempo de Leitura */}
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-3">
                    <span className="font-bold text-blue-800 bg-blue-100/70 px-2.5 py-0.5 rounded-md text-[11px]">
                      {article.category}
                    </span>
                    <span className="flex items-center gap-1 text-[11px] font-medium text-slate-400">
                      <Clock className="w-3.5 h-3.5" />
                      {article.readTime}
                    </span>
                  </div>

                  {/* Título da Notícia */}
                  <h3
                    className={`font-heading font-black text-slate-900 leading-snug group-hover:text-blue-900 transition-colors ${
                      isFeatured ? "text-xl sm:text-2xl mb-3" : "text-base sm:text-lg mb-2"
                    }`}
                  >
                    {article.headline}
                  </h3>

                  {/* Resumo da Notícia */}
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-3 mb-4">
                    {article.lead}
                  </p>
                </div>

                {/* Rodapé do Cartão */}
                <div className="pt-4 border-t border-slate-200/80 flex items-center justify-between text-xs text-slate-500">
                  <div className="flex items-center gap-1.5 font-medium text-[11px]">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>{article.publishedAt.split(" às ")[0]}</span>
                  </div>

                  <span className="flex items-center gap-1 font-bold text-blue-700 group-hover:translate-x-1 transition-transform text-xs">
                    Ler reportagem
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </article>
            );
          })}
        </div>

        {/* Modal de Leitura Completa da Notícia */}
        {activeArticle && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative my-8 animate-in fade-in zoom-in-95 duration-150">
              <button
                onClick={() => setActiveArticle(null)}
                className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-900 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
                title="Fechar notícia"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-800 bg-blue-50 px-2.5 py-0.5 rounded-md border border-blue-200/60">
                  {activeArticle.category}
                </span>
                <span className="text-slate-300">·</span>
                <span className="text-xs text-slate-500 font-medium">
                  {activeArticle.readTime}
                </span>
              </div>

              <h2 className="font-heading text-2xl sm:text-3xl font-black text-slate-900 mb-3 leading-tight">
                {activeArticle.headline}
              </h2>

              <p className="text-sm sm:text-base font-semibold text-slate-700 mb-5 leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
                {activeArticle.lead}
              </p>

              <div className="flex items-center justify-between text-xs text-slate-500 pb-4 mb-5 border-b border-slate-200">
                <div>
                  <span className="font-bold text-slate-800 block">{activeArticle.author}</span>
                  <span className="text-[11px] text-slate-400">{activeArticle.publishedAt}</span>
                </div>

                <button
                  onClick={handleShare}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 flex items-center gap-1.5 text-xs font-bold transition-colors cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5 text-slate-500" />}
                  <span>{copied ? "Link Copiado!" : "Compartilhar"}</span>
                </button>
              </div>

              {/* Corpo da Notícia */}
              <div className="space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed">
                {activeArticle.content.map((p, idx) => (
                  <p key={idx}>{p}</p>
                ))}
              </div>

              {/* Espaço Publicitário Interno do Artigo */}
              <div className="my-6 p-4 bg-slate-50 border border-dashed border-slate-300 rounded-2xl text-center">
                <span className="text-[10px] text-slate-400 font-mono uppercase tracking-wider block mb-1">
                  Publicidade · Google AdSense (Formato Artigo Nativo)
                </span>
                <span className="text-xs text-slate-500">
                  Espaço reservado para unidade de anúncios in-article
                </span>
              </div>

              {/* Tags */}
              <div className="pt-4 border-t border-slate-200 flex flex-wrap items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-slate-400 mr-1" />
                {activeArticle.tags.map((t) => (
                  <span
                    key={t}
                    className="text-[11px] font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md"
                  >
                    #{t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
