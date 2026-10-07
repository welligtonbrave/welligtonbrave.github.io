/**
 * VotoBrasil 2026 — Script Oficial para GitHub Pages
 * Execução 100% estática no navegador (Zero dependências, Zero Node.js)
 */

(async function () {
  let electionData = null;
  let brazilGeo = null;
  let newsData = null;

  // Estado da visualização do mapa
  let zoom = 1;
  let pan = { x: 0, y: 0 };
  let isDragging = false;
  let dragStart = { x: 0, y: 0 };
  let candidateFilter = null;
  let selectedStateUf = null;

  // Conectores costeiros para estados pequenos
  const CALLOUTS = {
    DF: { lineTo: [530, 438], labelPos: [535, 438] },
    RN: { lineTo: [735, 235], labelPos: [740, 235] },
    PB: { lineTo: [735, 265], labelPos: [740, 265] },
    PE: { lineTo: [725, 292], labelPos: [730, 292] },
    AL: { lineTo: [735, 320], labelPos: [740, 320] },
    SE: { lineTo: [725, 345], labelPos: [730, 345] },
    ES: { lineTo: [665, 510], labelPos: [670, 510] },
    RJ: { lineTo: [640, 575], labelPos: [645, 575] },
  };

  const REGION_PRESETS = {
    all: { zoom: 1, panX: 0, panY: 0 },
    Norte: { zoom: 1.8, panX: 130, panY: 130 },
    Nordeste: { zoom: 2.1, panX: -260, panY: 140 },
    "Centro-Oeste": { zoom: 2.0, panX: -20, panY: -40 },
    Sudeste: { zoom: 2.3, panX: -190, panY: -220 },
    Sul: { zoom: 2.4, panX: -90, panY: -420 },
  };

  // Carregamento resiliente dos dados locais
  try {
    const fetchJson = async (url) => {
      try {
        const res = await fetch(url);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return await res.json();
      } catch (e) {
        console.warn(`Aviso: falha ao carregar ${url}`, e);
        return null;
      }
    };

    const [resElection, resGeo, resNews] = await Promise.all([
      fetchJson('./data/electionData.json'),
      fetchJson('./data/brazilGeo.json'),
      fetchJson('./data/newsData.json'),
    ]);

    electionData = resElection;
    brazilGeo = resGeo;
    newsData = resNews;
  } catch (err) {
    console.warn("Falha no carregamento dos dados externos:", err);
  }

  // Se os dados essenciais foram carregados, inicializa
  if (electionData && brazilGeo) {
    initApp();
  } else {
    console.error("Erro crítico: Dados do mapa ou apuração não puderam ser carregados.");
    const container = document.querySelector('main') || document.body;
    const errBox = document.createElement('div');
    errBox.className = 'error-fallback-box';
    errBox.innerHTML = `
      <div style="max-width:600px;margin:40px auto;padding:24px;background:#fff;border-radius:16px;box-shadow:0 4px 20px rgba(0,0,0,0.08);text-align:center;font-family:sans-serif;border:1px solid #e2e8f0;">
        <h2 style="color:#0f172a;font-size:20px;font-weight:800;margin-bottom:8px;">Aguardando Carregamento dos Dados Eleitorais</h2>
        <p style="color:#475569;font-size:14px;line-height:1.6;margin-bottom:16px;">Os dados locais do mapa e da apuração estão sendo preparados. Se você estiver abrindo o arquivo diretamente via protocolo file://, use um servidor HTTP local ou o GitHub Pages oficial.</p>
        <button onclick="window.location.reload()" style="background:#0f172a;color:#fff;border:none;padding:10px 20px;border-radius:10px;font-weight:700;cursor:pointer;">Recarregar Página</button>
      </div>
    `;
    container.prepend(errBox);
  }

  function formatVotesBR(num) {
    return new Intl.NumberFormat('pt-BR').format(num);
  }

  function formatPercentBR(num) {
    return new Intl.NumberFormat('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(num) + '%';
  }

  function initApp() {
    renderMap();
    setupMapControls();
    renderTable();
    if (newsData) renderNews();
  }

  // Renderização do Mapa SVG
  function renderMap() {
    const svgG = document.getElementById('states-svg-group');
    const labelsG = document.getElementById('labels-svg-group');
    if (!svgG || !labelsG) return;

    svgG.innerHTML = '';
    labelsG.innerHTML = '';

    brazilGeo.forEach((geo) => {
      const stateRes = electionData.states[geo.uf];
      const winnerId = stateRes ? stateRes.winnerId : 'flavio';
      const color = winnerId === 'flavio' ? '#1D4ED8' : '#DC2626';

      // Path do Estado
      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute('d', geo.path);
      path.setAttribute('fill', color);
      path.setAttribute('class', 'state-path');
      path.setAttribute('id', `state-${geo.uf}`);
      path.dataset.uf = geo.uf;

      path.addEventListener('mouseenter', (e) => showTooltip(e, geo));
      path.addEventListener('mousemove', (e) => moveTooltip(e));
      path.addEventListener('mouseleave', hideTooltip);
      path.addEventListener('click', () => openStateDrawer(geo.uf));

      svgG.appendChild(path);

      // Conector para estados pequenos ou Sigla Central
      const callout = CALLOUTS[geo.uf];
      if (callout) {
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', geo.centroid[0]);
        line.setAttribute('y1', geo.centroid[1]);
        line.setAttribute('x2', callout.lineTo[0]);
        line.setAttribute('y2', callout.lineTo[1]);
        line.setAttribute('stroke', '#475569');
        line.setAttribute('stroke-width', '0.9');
        line.setAttribute('stroke-dasharray', '2 2');
        labelsG.appendChild(line);

        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('cx', geo.centroid[0]);
        circle.setAttribute('cy', geo.centroid[1]);
        circle.setAttribute('r', '2.5');
        circle.setAttribute('fill', '#0f172a');
        labelsG.appendChild(circle);

        const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        rect.setAttribute('x', callout.labelPos[0] - 2);
        rect.setAttribute('y', callout.labelPos[1] - 8);
        rect.setAttribute('width', '21');
        rect.setAttribute('height', '15');
        rect.setAttribute('rx', '3.5');
        rect.setAttribute('fill', '#ffffff');
        rect.setAttribute('stroke', '#64748b');
        rect.setAttribute('stroke-width', '0.9');
        labelsG.appendChild(rect);

        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('x', callout.labelPos[0] + 8.5);
        text.setAttribute('y', callout.labelPos[1] + 2.5);
        text.setAttribute('text-anchor', 'middle');
        text.setAttribute('font-size', '9.5');
        text.setAttribute('font-weight', 'bold');
        text.setAttribute('font-family', 'var(--font-mono)');
        text.setAttribute('fill', '#0f172a');
        text.textContent = geo.uf;
        labelsG.appendChild(text);
      } else {
        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('x', geo.centroid[0]);
        text.setAttribute('y', geo.centroid[1]);
        text.setAttribute('text-anchor', 'middle');
        text.setAttribute('dominant-baseline', 'central');
        text.setAttribute('font-size', ['AM', 'PA', 'MT'].includes(geo.uf) ? '12.5' : '10.5');
        text.setAttribute('font-weight', 'bold');
        text.setAttribute('font-family', 'var(--font-mono)');
        text.setAttribute('fill', '#ffffff');
        text.setAttribute('style', 'filter: drop-shadow(0 1px 2px rgba(0,0,0,0.85)); pointer-events: none;');
        text.textContent = geo.uf;
        labelsG.appendChild(text);
      }
    });
  }

  // Controles do Mapa (Zoom, Pan, Busca, Tela Cheia)
  function setupMapControls() {
    const container = document.getElementById('svg-container');
    const svg = document.getElementById('brazil-svg');
    const tooltipEl = document.getElementById('map-tooltip');

    if (!container || !svg) return;

    function updateTransform() {
      svg.style.transform = `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`;
    }

    document.getElementById('btn-zoom-in')?.addEventListener('click', () => {
      zoom = Math.min(3.8, Number((zoom * 1.25).toFixed(2)));
      updateTransform();
    });

    document.getElementById('btn-zoom-out')?.addEventListener('click', () => {
      zoom = Math.max(0.85, Number((zoom / 1.25).toFixed(2)));
      if (zoom <= 1) pan = { x: 0, y: 0 };
      updateTransform();
    });

    document.getElementById('btn-reset-map')?.addEventListener('click', () => {
      zoom = 1;
      pan = { x: 0, y: 0 };
      updateTransform();
    });

    document.getElementById('btn-fullscreen')?.addEventListener('click', () => {
      const mapWrapper = document.getElementById('map-wrapper');
      if (!mapWrapper) return;
      if (!document.fullscreenElement) {
        mapWrapper.requestFullscreen().catch(() => {});
      } else {
        document.exitFullscreen().catch(() => {});
      }
    });

    // Arraste do Mouse
    container.addEventListener('mousedown', (e) => {
      if (e.button !== 0) return;
      isDragging = true;
      dragStart = { x: e.clientX - pan.x, y: e.clientY - pan.y };
    });

    window.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      pan = { x: e.clientX - dragStart.x, y: e.clientY - dragStart.y };
      updateTransform();
    });

    window.addEventListener('mouseup', () => {
      isDragging = false;
    });

    // Busca de Estados com Autocomplete
    const searchInput = document.getElementById('state-search-input');
    const searchResults = document.getElementById('search-results-box');

    if (searchInput && searchResults) {
      searchInput.addEventListener('input', (e) => {
        const q = e.target.value.toLowerCase().trim();
        if (!q) {
          searchResults.style.display = 'none';
          return;
        }

        const matches = brazilGeo.filter(
          (g) => g.name.toLowerCase().includes(q) || g.uf.toLowerCase().includes(q)
        ).slice(0, 5);

        if (matches.length === 0) {
          searchResults.style.display = 'none';
          return;
        }

        searchResults.innerHTML = matches.map((m) => `
          <div class="search-item" data-uf="${m.uf}" style="padding: 0.5rem 0.75rem; cursor: pointer; border-bottom: 1px solid #f1f5f9; display: flex; justify-content: space-between; align-items: center; font-size: 0.75rem;">
            <div>
              <strong>${m.name}</strong> <span style="color: #64748b;">(${m.uf})</span>
            </div>
            <span style="font-size: 0.6875rem; color: #3b82f6;">Ver apuração →</span>
          </div>
        `).join('');
        searchResults.style.display = 'block';

        searchResults.querySelectorAll('.search-item').forEach((item) => {
          item.addEventListener('click', () => {
            const uf = item.dataset.uf;
            openStateDrawer(uf);
            searchInput.value = '';
            searchResults.style.display = 'none';
          });
        });
      });

      document.addEventListener('click', (e) => {
        if (!searchInput.contains(e.target) && !searchResults.contains(e.target)) {
          searchResults.style.display = 'none';
        }
      });
    }

    // Filtros de Candidato na Legenda
    document.querySelectorAll('.legend-chip-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const candId = btn.dataset.candidate;
        if (candidateFilter === candId) {
          candidateFilter = null;
        } else {
          candidateFilter = candId;
        }

        brazilGeo.forEach((geo) => {
          const path = document.getElementById(`state-${geo.uf}`);
          if (!path) return;
          const st = electionData.states[geo.uf];
          if (!candidateFilter) {
            path.style.opacity = '1';
          } else {
            path.style.opacity = st.winnerId === candidateFilter ? '1' : '0.22';
          }
        });
      });
    });
  }

  // Tooltip
  function showTooltip(e, geo) {
    const tooltipEl = document.getElementById('map-tooltip');
    if (!tooltipEl || !electionData) return;

    const st = electionData.states[geo.uf];
    if (!st) return;

    const winnerName = st.winnerId === 'flavio' ? 'Flávio Bolsonaro' : 'Lula';
    const winnerColor = st.winnerId === 'flavio' ? '#1D4ED8' : '#DC2626';

    const fData = st.candidates.find((c) => c.candidateId === 'flavio');
    const lData = st.candidates.find((c) => c.candidateId === 'lula');
    const oData = st.candidates.find((c) => c.candidateId === 'outros');

    tooltipEl.innerHTML = `
      <div style="border-bottom: 1px solid #334155; padding-bottom: 0.5rem; margin-bottom: 0.5rem; display: flex; justify-content: space-between; align-items: center;">
        <div>
          <strong style="font-size: 0.875rem;">${st.name} (${st.uf})</strong>
          <div style="font-size: 0.625rem; color: #94a3b8;">Região ${st.region} · Capital: ${st.capital}</div>
        </div>
        <span style="background-color: ${winnerColor}; color: #fff; font-size: 0.625rem; font-weight: 800; padding: 0.125rem 0.375rem; border-radius: 0.25rem;">
          1º ${winnerName}
        </span>
      </div>

      <div style="margin-bottom: 0.5rem; display: flex; flex-direction: column; gap: 0.25rem;">
        <div style="display: flex; justify-content: space-between;">
          <span style="color: #60a5fa; font-weight: 700;">Flávio Bolsonaro (PL):</span>
          <strong class="font-mono">${formatPercentBR(fData.percentage)} (${formatVotesBR(fData.votes)})</strong>
        </div>
        <div style="display: flex; justify-content: space-between;">
          <span style="color: #f87171; font-weight: 700;">Lula (PT):</span>
          <strong class="font-mono">${formatPercentBR(lData.percentage)} (${formatVotesBR(lData.votes)})</strong>
        </div>
        <div style="display: flex; justify-content: space-between; color: #94a3b8;">
          <span>Outros Candidatos:</span>
          <span class="font-mono">${formatPercentBR(oData.percentage)} (${formatVotesBR(oData.votes)})</span>
        </div>
      </div>

      <div style="border-top: 1px solid #334155; padding-top: 0.375rem; font-size: 0.625rem; color: #cbd5e1; display: grid; grid-template-columns: 1fr 1fr; gap: 0.25rem;">
        <div>Válidos: <strong>${formatVotesBR(st.validVotes)}</strong></div>
        <div>Brancos: <strong>${formatVotesBR(st.blankVotes)}</strong></div>
        <div>Nulos: <strong>${formatVotesBR(st.nullVotes)}</strong></div>
        <div>Comparecimento: <strong>${formatPercentBR(st.turnoutPercentage)}</strong></div>
      </div>
      <div style="margin-top: 0.5rem; font-size: 0.625rem; color: #38bdf8; text-align: right;">Clique para apuração completa →</div>
    `;

    tooltipEl.style.display = 'block';
    moveTooltip(e);
  }

  function moveTooltip(e) {
    const tooltipEl = document.getElementById('map-tooltip');
    const wrapper = document.getElementById('map-wrapper');
    if (!tooltipEl || !wrapper) return;

    const rect = wrapper.getBoundingClientRect();
    const x = e.clientX - rect.left + 15;
    const y = e.clientY - rect.top + 15;

    tooltipEl.style.left = `${Math.min(x, wrapper.clientWidth - 300)}px`;
    tooltipEl.style.top = `${Math.min(y, wrapper.clientHeight - 260)}px`;
  }

  function hideTooltip() {
    const tooltipEl = document.getElementById('map-tooltip');
    if (tooltipEl) tooltipEl.style.display = 'none';
  }

  // Drawer Lateral de Detalhes do Estado
  function openStateDrawer(uf) {
    const st = electionData.states[uf];
    const drawer = document.getElementById('state-drawer');
    const backdrop = document.getElementById('drawer-backdrop');
    if (!st || !drawer) return;

    selectedStateUf = uf;

    const fData = st.candidates.find((c) => c.candidateId === 'flavio');
    const lData = st.candidates.find((c) => c.candidateId === 'lula');
    const oData = st.candidates.find((c) => c.candidateId === 'outros');

    const winnerName = st.winnerId === 'flavio' ? 'Flávio Bolsonaro' : 'Lula';
    const winnerColor = st.winnerId === 'flavio' ? '#1D4ED8' : '#DC2626';

    document.getElementById('drawer-state-name').textContent = `${st.name} (${st.uf})`;
    document.getElementById('drawer-state-region').textContent = `Região ${st.region} · Capital: ${st.capital}`;
    document.getElementById('drawer-winner-badge').textContent = `Vencedor no Estado: ${winnerName}`;
    document.getElementById('drawer-winner-badge').style.backgroundColor = winnerColor;

    document.getElementById('drawer-flavio-votes').textContent = `${formatVotesBR(fData.votes)} votos (${formatPercentBR(fData.percentage)})`;
    document.getElementById('drawer-flavio-bar').style.width = `${fData.percentage}%`;

    document.getElementById('drawer-lula-votes').textContent = `${formatVotesBR(lData.votes)} votos (${formatPercentBR(lData.percentage)})`;
    document.getElementById('drawer-lula-bar').style.width = `${lData.percentage}%`;

    document.getElementById('drawer-outros-votes').textContent = `${formatVotesBR(oData.votes)} votos (${formatPercentBR(oData.percentage)})`;
    document.getElementById('drawer-outros-bar').style.width = `${oData.percentage}%`;

    document.getElementById('drawer-valid-votes').textContent = formatVotesBR(st.validVotes);
    document.getElementById('drawer-blank-votes').textContent = `${formatVotesBR(st.blankVotes)} (${formatPercentBR(st.blankVotesPercentage)})`;
    document.getElementById('drawer-null-votes').textContent = `${formatVotesBR(st.nullVotes)} (${formatPercentBR(st.nullVotesPercentage)})`;
    document.getElementById('drawer-turnout').textContent = `${formatVotesBR(st.turnout)} (${formatPercentBR(st.turnoutPercentage)})`;
    document.getElementById('drawer-abstention').textContent = `${formatVotesBR(st.abstention)} (${formatPercentBR(st.abstentionPercentage)})`;
    document.getElementById('drawer-electorate').textContent = formatVotesBR(st.electorate);

    drawer.classList.add('is-open');
    if (backdrop) backdrop.style.display = 'block';
  }

  function closeDrawer() {
    const drawer = document.getElementById('state-drawer');
    const backdrop = document.getElementById('drawer-backdrop');
    if (drawer) drawer.classList.remove('is-open');
    if (backdrop) backdrop.style.display = 'none';
  }

  document.getElementById('drawer-close-btn')?.addEventListener('click', closeDrawer);
  document.getElementById('drawer-backdrop')?.addEventListener('click', closeDrawer);

  // Tabela Comparativa de Estados
  function renderTable() {
    const tbody = document.getElementById('table-results-tbody');
    if (!tbody || !electionData) return;

    const list = Object.values(electionData.states).sort((a, b) => b.validVotes - a.validVotes);

    tbody.innerHTML = list.map((st) => {
      const winnerName = st.winnerId === 'flavio' ? 'Flávio Bolsonaro' : 'Lula';
      const winnerColor = st.winnerId === 'flavio' ? '#1D4ED8' : '#DC2626';
      const fData = st.candidates.find((c) => c.candidateId === 'flavio');
      const lData = st.candidates.find((c) => c.candidateId === 'lula');

      return `
        <tr style="cursor: pointer;" onclick="window.VotoBrasil.openDrawer('${st.uf}')">
          <td style="font-weight: 800; color: #0f172a;">${st.name} <span class="font-mono" style="color: #64748b; font-size: 0.6875rem;">(${st.uf})</span></td>
          <td style="color: #64748b;">${st.region}</td>
          <td>
            <span style="display: inline-flex; align-items: center; gap: 0.25rem; font-weight: 700; color: #0f172a;">
              <span style="width: 0.5rem; height: 0.5rem; border-radius: 9999px; background-color: ${winnerColor};"></span>
              ${winnerName}
            </span>
          </td>
          <td class="font-mono" style="font-weight: 800; color: #1d4ed8; text-align: right;">${formatPercentBR(fData.percentage)}</td>
          <td class="font-mono" style="font-weight: 800; color: #dc2626; text-align: right;">${formatPercentBR(lData.percentage)}</td>
          <td class="font-mono" style="color: #475569; text-align: right;">+${formatPercentBR(st.marginPercentage)}</td>
          <td class="font-mono" style="color: #475569; text-align: right;">${formatVotesBR(st.validVotes)}</td>
          <td class="font-mono" style="color: #475569; text-align: right;">${formatPercentBR(st.turnoutPercentage)}</td>
          <td style="text-align: center; color: #3b82f6;">Ver →</td>
        </tr>
      `;
    }).join('');
  }

  // Notícias
  function renderNews() {
    const grid = document.getElementById('news-articles-grid');
    if (!grid || !newsData) return;

    grid.innerHTML = newsData.map((art) => `
      <article class="news-card" onclick="window.VotoBrasil.openArticle('${art.id}')">
        <div>
          <span class="news-category">${art.category}</span>
          <h3 class="news-title">${art.headline}</h3>
          <p class="news-lead">${art.lead}</p>
        </div>
        <div class="news-footer">
          <span>${art.publishedAt.split(' às ')[0]}</span>
          <span style="color: #1d4ed8; font-weight: 700;">Ler reportagem →</span>
        </div>
      </article>
    `).join('');
  }

  function openArticle(id) {
    const art = newsData.find((a) => a.id === id);
    const modal = document.getElementById('news-modal');
    if (!art || !modal) return;

    document.getElementById('modal-art-category').textContent = art.category;
    document.getElementById('modal-art-time').textContent = art.readTime;
    document.getElementById('modal-art-title').textContent = art.headline;
    document.getElementById('modal-art-lead').textContent = art.lead;
    document.getElementById('modal-art-author').textContent = art.author;
    document.getElementById('modal-art-date').textContent = art.publishedAt;
    document.getElementById('modal-art-body').innerHTML = art.content.map((p) => `<p style="margin-bottom: 0.875rem;">${p}</p>`).join('');

    modal.style.display = 'flex';
  }

  document.getElementById('news-modal-close')?.addEventListener('click', () => {
    const modal = document.getElementById('news-modal');
    if (modal) modal.style.display = 'none';
  });

  // Download do ZIP estático para GitHub Pages
  document.querySelectorAll('.btn-zip').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const href = btn.getAttribute('href');
      if (!href || href === '#') {
        e.preventDefault();
        window.location.href = './static-site.zip';
      }
    });
  });

  // Exportar funções globais para chamadas nos eventos inline
  window.VotoBrasil = {
    openDrawer: openStateDrawer,
    closeDrawer: closeDrawer,
    openArticle: openArticle,
  };
})();
