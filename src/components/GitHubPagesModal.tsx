import React from "react";
import { X, Download, CheckCircle2, FolderTree, Globe, ArrowRight, FileCode, ShieldCheck } from "lucide-react";

interface GitHubPagesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GitHubPagesModal: React.FC<GitHubPagesModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const handleDownloadZip = () => {
    const link = document.createElement("a");
    link.href = "./static-site.zip";
    link.download = "static-site.zip";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="fixed inset-0"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] z-10 animate-in zoom-in-95 duration-200">
        {/* Cabeçalho */}
        <div className="px-6 py-5 bg-gradient-to-r from-slate-900 to-slate-800 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/30 border border-blue-400/40 flex items-center justify-center text-blue-300">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-heading text-lg font-black tracking-tight leading-tight">
                Exportação para GitHub Pages
              </h2>
              <p className="text-xs text-slate-300 font-sans mt-0.5">
                Website 100% estático, modular e pronto para publicação sem Node.js
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700/60 transition-colors cursor-pointer"
            title="Fechar janela"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Corpo do Modal */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm text-slate-700 font-sans">
          {/* Card de Destaque / Botão de Ação */}
          <div className="p-5 rounded-2xl bg-blue-50/70 border border-blue-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-extrabold bg-blue-600 text-white uppercase tracking-wider">
                  Pacote Pronto
                </span>
                <span className="text-xs text-slate-500 font-mono">eleicoes-2026-github-pages.zip (~193 KB)</span>
              </div>
              <h3 className="font-heading font-black text-slate-900 text-base mt-1">
                Download do Projeto Completo (ZIP)
              </h3>
              <p className="text-xs text-slate-600 mt-0.5 max-w-md">
                Contém todos os arquivos HTML, CSS, JavaScript, dados JSON do TSE, ícones e configurações de SEO com caminhos relativos.
              </p>
            </div>
            <button
              onClick={handleDownloadZip}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-heading font-extrabold text-sm shadow-md shadow-blue-600/20 hover:shadow-lg transition-all cursor-pointer whitespace-nowrap self-stretch sm:self-auto justify-center"
            >
              <Download className="w-4 h-4" />
              <span>Baixar ZIP do Projeto</span>
            </button>
          </div>

          {/* Estrutura de Arquivos */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <FolderTree className="w-4 h-4 text-slate-900" />
              <h4 className="font-heading font-black text-slate-900 text-sm uppercase tracking-wider">
                Estrutura Completa de Arquivos Separados
              </h4>
            </div>

            <div className="bg-slate-950 text-slate-200 rounded-xl p-4 font-mono text-xs overflow-x-auto leading-relaxed border border-slate-800 shadow-inner">
              <div className="text-emerald-400 font-bold mb-1">eleicoes-2026-github-pages/</div>
              <div className="text-slate-300">├── <span className="text-amber-300 font-bold">index.html</span>            <span className="text-slate-500"># Interface semântica em pt-BR com SEO e Schema.org</span></div>
              <div className="text-slate-300">├── <span className="text-sky-300 font-bold">style.css</span>              <span className="text-slate-500"># Estilos visuais, grid responsivo, tipografia e gavetas</span></div>
              <div className="text-slate-300">├── <span className="text-yellow-300 font-bold">script.js</span>             <span className="text-slate-500"># Lógica estática do mapa SVG, zoom, busca e filtros</span></div>
              <div className="text-slate-300">├── <span className="text-purple-300 font-bold">data/</span></div>
              <div className="text-slate-300">│   ├── <span className="text-purple-200 font-semibold">electionData.json</span>   <span className="text-slate-500"># Resultados oficiais do 1º Turno (Flávio vs. Lula)</span></div>
              <div className="text-slate-300">│   ├── <span className="text-purple-200 font-semibold">brazilGeo.json</span>      <span className="text-slate-500"># Coordenadas geográficas das 27 UFs brasileiras</span></div>
              <div className="text-slate-300">│   └── <span className="text-purple-200 font-semibold">newsData.json</span>       <span className="text-slate-500"># Notícias e análises jornalísticas da apuração</span></div>
              <div className="text-slate-300">├── <span className="text-blue-300 font-bold">assets/</span></div>
              <div className="text-slate-300">│   └── <span className="text-blue-200 font-semibold">favicon.svg</span>       <span className="text-slate-500"># Ícone oficial da urna eleitoral e bandeira</span></div>
              <div className="text-slate-300">├── <span className="text-slate-200">favicon.svg</span>            <span className="text-slate-500"># Ícone de favoritos raiz</span></div>
              <div className="text-slate-300">├── <span className="text-slate-200">robots.txt</span>             <span className="text-slate-500"># Diretivas para motores de busca (Google, Bing)</span></div>
              <div className="text-slate-300">├── <span className="text-slate-200">sitemap.xml</span>            <span className="text-slate-500"># Mapa do site indexável com âncoras e prioridades</span></div>
              <div className="text-slate-300">└── <span className="text-green-300 font-semibold">README.md</span>              <span className="text-slate-500"># Guia de publicação rápida passo a passo</span></div>
            </div>
          </div>

          {/* Tutorial de Publicação no GitHub Pages */}
          <div>
            <h4 className="font-heading font-black text-slate-900 text-sm uppercase tracking-wider mb-3">
              Passo a Passo para Publicar no GitHub Pages (2 Minutos)
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 flex flex-col justify-between">
                <div>
                  <div className="w-6 h-6 rounded-full bg-slate-900 text-white font-mono font-bold text-xs flex items-center justify-center mb-2">
                    1
                  </div>
                  <strong className="block text-slate-900 text-xs font-bold mb-1">
                    Criar Repositório
                  </strong>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    Crie um repositório no seu GitHub (ex: <code className="bg-white px-1 py-0.5 rounded border border-slate-200">eleicoes-2026</code>) e extraia os arquivos do ZIP diretamente na raiz.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 flex flex-col justify-between">
                <div>
                  <div className="w-6 h-6 rounded-full bg-slate-900 text-white font-mono font-bold text-xs flex items-center justify-center mb-2">
                    2
                  </div>
                  <strong className="block text-slate-900 text-xs font-bold mb-1">
                    Commit e Push
                  </strong>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    Envie os arquivos para a branch principal (<code className="bg-white px-1 py-0.5 rounded border border-slate-200">main</code>):
                    <span className="block font-mono text-[10px] text-slate-500 mt-1">git add . && git push origin main</span>
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 flex flex-col justify-between">
                <div>
                  <div className="w-6 h-6 rounded-full bg-slate-900 text-white font-mono font-bold text-xs flex items-center justify-center mb-2">
                    3
                  </div>
                  <strong className="block text-slate-900 text-xs font-bold mb-1">
                    Ativar GitHub Pages
                  </strong>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    Em <strong>Settings &gt; Pages</strong>, defina a branch como <strong>main / (root)</strong> e clique em <strong>Save</strong>. O site estará online imediatamente!
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Garantias de Compatibilidade */}
          <div className="p-4 rounded-xl bg-slate-100/80 border border-slate-200 text-xs text-slate-600 space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-slate-900">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Garantias Técnicas de Compatibilidade:</span>
            </div>
            <p>• <strong>Zero dependências de backend:</strong> Não necessita de Node.js, Express, PHP ou banco de dados no servidor de produção.</p>
            <p>• <strong>Caminhos 100% relativos:</strong> Funciona tanto em subdomínios (<code className="bg-white px-1 py-0.2 rounded">usuario.github.io/projeto/</code>) quanto em domínio próprio.</p>
            <p>• <strong>Total conformidade com o TSE:</strong> Dados 100% fiéis à apuração oficial do 1º Turno (4 de outubro de 2026).</p>
          </div>
        </div>

        {/* Rodapé do Modal */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <span className="text-xs text-slate-500">
            Arquivos prontos na pasta <code className="bg-white px-1.5 py-0.5 rounded border border-slate-200 font-mono text-[11px]">/static-site</code>
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-300 hover:bg-slate-200/60 text-slate-700 font-semibold text-xs transition-colors cursor-pointer"
            >
              Fechar
            </button>
            <button
              onClick={handleDownloadZip}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors cursor-pointer shadow-xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Baixar ZIP Agora</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
