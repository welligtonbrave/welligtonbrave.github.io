export type PortalRoute =
  | "home"
  | "politica"
  | "eleicoes"
  | "economia"
  | "estados"
  | "dados-publicos"
  | "noticias"
  | "sobre";

export interface RouteConfig {
  route: PortalRoute;
  path: string;
  label: string;
  title: string;
  description: string;
  categoryTag?: string;
  accentColor: string; // Tailwind color token
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
}

export const ROUTE_CONFIGS: Record<PortalRoute, RouteConfig> = {
  home: {
    route: "home",
    path: "/",
    label: "Início",
    title: "Sociedade Ativa — Política, Eleições, Notícias e Dados do Brasil",
    description:
      "Portal independente de informações públicas, política, eleições, notícias e jornalismo de dados no Brasil. Acompanhe apuração oficial, mapas interativos e indicadores econômicos.",
    accentColor: "blue",
    badgeBg: "bg-slate-100",
    badgeText: "text-slate-800",
    badgeBorder: "border-slate-200",
  },
  politica: {
    route: "politica",
    path: "/politica/",
    label: "Política",
    title: "Política — Sociedade Ativa | Poderes, Congresso e Atos Oficiais",
    description:
      "Cobertura institucional e jornalismo de dados sobre os Três Poderes, decisões do Executivo, tramitação no Congresso Nacional e jurisprudência do STF.",
    categoryTag: "Política",
    accentColor: "red",
    badgeBg: "bg-red-50",
    badgeText: "text-red-800",
    badgeBorder: "border-red-200",
  },
  eleicoes: {
    route: "eleicoes",
    path: "/eleicoes/",
    label: "Eleições",
    title: "Eleições 2026 — Sociedade Ativa | Apuração Oficial e 2º Turno",
    description:
      "Apuração oficial e totalização do 1º Turno das Eleições Presidenciais 2026 pelo TSE. Mapas eleitorais por estado, comparativo de candidatos e regras do 2º turno.",
    categoryTag: "Eleições",
    accentColor: "blue",
    badgeBg: "bg-blue-50",
    badgeText: "text-blue-800",
    badgeBorder: "border-blue-200",
  },
  economia: {
    route: "economia",
    path: "/economia/",
    label: "Economia",
    title: "Economia — Sociedade Ativa | Indicadores Oficiais IBGE e Banco Central",
    description:
      "Indicadores macroeconômicos do Brasil com fontes oficiais do IBGE e Banco Central (BCB): inflação (IPCA), taxa Selic, câmbio PTAX, PIB e desemprego PNAD Contínua.",
    categoryTag: "Economia",
    accentColor: "emerald",
    badgeBg: "bg-emerald-50",
    badgeText: "text-emerald-800",
    badgeBorder: "border-emerald-200",
  },
  estados: {
    route: "estados",
    path: "/estados/",
    label: "Estados",
    title: "Estados do Brasil — Sociedade Ativa | Mapa Eleitoral e Dados por UF",
    description:
      "Radiografia eleitoral e dados públicos dos 26 estados e Distrito Federal. Mapa interativo, comparecimento eleitoral, abstenções e placar por unidade da federação.",
    categoryTag: "Estados",
    accentColor: "amber",
    badgeBg: "bg-amber-50",
    badgeText: "text-amber-800",
    badgeBorder: "border-amber-200",
  },
  "dados-publicos": {
    route: "dados-publicos",
    path: "/dados-publicos/",
    label: "Dados Públicos",
    title: "Dados Públicos — Sociedade Ativa | Estatísticas, Gráficos e Transparência",
    description:
      "Transparência governamental, microdados eleitorais do TSE, séries históricas do IBGE e auditoria pública de dados abertos brasileiros.",
    categoryTag: "Dados Públicos",
    accentColor: "purple",
    badgeBg: "bg-purple-50",
    badgeText: "text-purple-800",
    badgeBorder: "border-purple-200",
  },
  noticias: {
    route: "noticias",
    path: "/noticias/",
    label: "Notícias",
    title: "Notícias — Sociedade Ativa | Cobertura Editorial e Fontes Oficiais",
    description:
      "Últimas notícias e apurações sobre o Brasil com apuração direta de agências públicas de comunicação (Agência Brasil, Agência Câmara, Agência Senado, TSE e STF).",
    categoryTag: "Notícias",
    accentColor: "slate",
    badgeBg: "bg-slate-100",
    badgeText: "text-slate-800",
    badgeBorder: "border-slate-200",
  },
  sobre: {
    route: "sobre",
    path: "/sobre/",
    label: "Sobre & Metodologia",
    title: "Sobre & Metodologia — Sociedade Ativa | Transparência e Fontes Oficiais",
    description:
      "Conheça a missão do Sociedade Ativa, metodologia de totalização eleitoral (Art. 77 da CF/88), fontes de dados abertos do Estado brasileiro e governança editorial.",
    accentColor: "slate",
    badgeBg: "bg-slate-100",
    badgeText: "text-slate-800",
    badgeBorder: "border-slate-200",
  },
};

/**
 * Converte o pathname atual do browser em uma rota válida do portal
 */
export function getRouteFromPath(pathname: string): PortalRoute {
  // Trata parâmetros de fallback como ?p=/politica/ caso venha de 404.html
  if (typeof window !== "undefined" && window.location.search) {
    const params = new URLSearchParams(window.location.search);
    const p = params.get("p");
    if (p) {
      const cleanParam = p.replace(/^\/+|\/+$/g, "").toLowerCase();
      for (const [key, config] of Object.entries(ROUTE_CONFIGS)) {
        const cleanConfig = config.path.replace(/^\/+|\/+$/g, "").toLowerCase();
        if (cleanConfig && cleanParam.startsWith(cleanConfig)) {
          return key as PortalRoute;
        }
      }
    }
  }

  const clean = pathname.replace(/^\/+|\/+$/g, "").toLowerCase();
  if (!clean || clean === "index.html") return "home";

  if (clean.startsWith("politica")) return "politica";
  if (clean.startsWith("eleicoes")) return "eleicoes";
  if (clean.startsWith("economia")) return "economia";
  if (clean.startsWith("estados")) return "estados";
  if (clean.startsWith("dados-publicos")) return "dados-publicos";
  if (clean.startsWith("noticias")) return "noticias";
  if (clean.startsWith("sobre")) return "sobre";

  return "home";
}

/**
 * Navegação suave no cliente com atualização de histórico e título da página
 */
export function navigateTo(route: PortalRoute, hash?: string) {
  const config = ROUTE_CONFIGS[route];
  if (!config) return;

  const targetPath = config.path + (hash ? `#${hash}` : "");

  if (typeof window !== "undefined") {
    if (window.location.pathname !== config.path) {
      window.history.pushState({ route }, "", targetPath);
    } else if (hash) {
      window.location.hash = hash;
    }
    // Dispara evento popstate para ouvintes reagirem
    window.dispatchEvent(new PopStateEvent("popstate"));

    // Atualiza título do documento dinamicamente no cliente
    document.title = config.title;

    // Rola para o topo caso não haja hash específico
    if (!hash) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      const el = document.getElementById(hash);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }
  }
}
