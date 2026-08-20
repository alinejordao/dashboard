/**
 * ============================================================
 * Dashboard COE — Engenharia de Infraestrutura e Cloud
 * Primeiro módulo: Vivo Virtualiza / evolução das migrações
 * ============================================================
 */

(() => {
  'use strict';

  const CORES = {
    atingido: '#5b21b6',
    atingidoClaro: '#8b5fd3',
    meta: '#2f80ed',
    texto: '#566a7f',
    textoSuave: '#9aa4b1',
    grade: '#ebeef2',
    branco: '#ffffff'
  };

  const DADOS_MIGRACOES = {
    periodos: ['2025', 'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago'],
    atingido: [1019, 1560, 1953, 2323, 2973, 3500, 3991, 4416, 4533],
    meta: [1019, 1514, 2009, 2504, 2999, 3492, 3989, 4484, 4979]
  };
  const MIGRACOES_BASE = {
    '2025-Base': { mes: 'Base', ano: 2025, atingido: 1019, meta: 1019, metaFinal: 6000, programa: 25 },
    '2026-Jan': { mes: 'Jan', ano: 2026, atingido: 1560, meta: 1514, metaFinal: 6000, programa: 25 },
    '2026-Fev': { mes: 'Fev', ano: 2026, atingido: 1953, meta: 2009, metaFinal: 6000, programa: 25 },
    '2026-Mar': { mes: 'Mar', ano: 2026, atingido: 2323, meta: 2504, metaFinal: 6000, programa: 25 },
    '2026-Abr': { mes: 'Abr', ano: 2026, atingido: 2973, meta: 2999, metaFinal: 6000, programa: 25 },
    '2026-Mai': { mes: 'Mai', ano: 2026, atingido: 3500, meta: 3492, metaFinal: 6000, programa: 25 },
    '2026-Jun': { mes: 'Jun', ano: 2026, atingido: 3991, meta: 3989, metaFinal: 6000, programa: 25 },
    '2026-Jul': { mes: 'Jul', ano: 2026, atingido: 4416, meta: 4484, metaFinal: 6000, programa: 25 },
    '2026-Ago': { mes: 'Ago', ano: 2026, atingido: 4533, meta: 4979, metaFinal: 6000, programa: 25 }
  };
  const ORDEM_MESES = ['Base', 'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
  const NOMES_MESES = { Jan: 'Janeiro', Fev: 'Fevereiro', Mar: 'Março', Abr: 'Abril', Mai: 'Maio', Jun: 'Junho', Jul: 'Julho', Ago: 'Agosto', Set: 'Setembro', Out: 'Outubro', Nov: 'Novembro', Dez: 'Dezembro' };
  let REGISTROS_MIGRACOES = [];
  let META_FINAL_MIGRACOES = 6000;
  let PROGRESSO_PROGRAMA = 25;
  const WORKSHOPS_BASE = {
    power_aix: { titulo: 'Workshop POWER/AIX', tema: 'Procedimentos Operacionais e Resposta a Incidentes', status: 'realizado', data: '2026-08-14', publico: '', descricao: 'Conteúdo direcionado à padronização dos procedimentos operacionais e à resposta a incidentes nos ambientes POWER/AIX.', visivel: true }
  };
  const ENTREGAS_RELEVANTES_BASE = {
    scom: { titulo: 'Monitoramento — SCOM', categoria: 'Monitoramento e observabilidade', produto: 'System Center Operations Manager', status: 'concluida', competencia: '2026-08', descricao: 'Plataforma Microsoft implantada para ampliar a visibilidade da infraestrutura e apoiar o acompanhamento de desempenho e disponibilidade dos serviços críticos.', beneficio: '', visivel: true }
  };
  const POCS_BASE = {
    pacemaker: { nome: 'Pacemaker', status: 'andamento', observacao: 'Teste de resiliência e performance.', previsao: 'Nov/2026', visivel: true },
    cybele: { nome: 'Cybele', status: 'pausa', observacao: 'Aguardando arquitetura e segurança para liberação do 1º entorno.', previsao: 'A definir', visivel: true },
    horizon: { nome: 'Horizon', status: 'pausa', observacao: 'Aguardando arquitetura e segurança para liberação do 1º entorno.', previsao: 'A definir', visivel: true },
    palo_alto: { nome: 'Palo Alto', status: 'encerrada', observacao: 'A ferramenta não atende aos requisitos do CITRIX para o ambiente Vivo.', previsao: 'Cancelada', visivel: true }
  };
  const AUTOMACOES_EVOLUCAO_BASE = {
    '2026-05': { competencia: '2026-05', publicadas: 14, proximaJanela: 'Novas automações previstas para agosto', atualizadoEm: '2026-08-14T12:00:00' },
    '2026-06': { competencia: '2026-06', publicadas: 17, proximaJanela: 'Novas automações previstas para agosto', atualizadoEm: '2026-08-14T12:00:00' }
  };

  function carregarDadosMigracoes() {
    let salvos = {}; let excluidos = [];
    try {
      const configuracoes = JSON.parse(window.localStorage.getItem('dashboardInfraCloudConfiguracoes')) || {};
      salvos = configuracoes.coeVirtualiza || {}; excluidos = Array.isArray(configuracoes.coeVirtualizaExcluidos) ? configuracoes.coeVirtualizaExcluidos : [];
      const legado = configuracoes.coe || {};
      if (!Object.keys(salvos).length && legado.migracoes_atingido !== undefined) salvos = { '2026-Ago': Object.assign({}, MIGRACOES_BASE['2026-Ago'], { atingido: Number(legado.migracoes_atingido), meta: Number(legado.migracoes_meta), metaFinal: Number(legado.migracoes_meta_final) || 6000 }) };
    } catch (erro) { console.warn('[Dashboard COE] Não foi possível carregar o Vivo Virtualiza.', erro); }
    const ignorados = new Set(excluidos);
    REGISTROS_MIGRACOES = Object.entries(Object.assign({}, MIGRACOES_BASE, salvos)).filter(([chave]) => !ignorados.has(chave)).map(([, item]) => item)
      .sort((a, b) => Number(a.ano) - Number(b.ano) || ORDEM_MESES.indexOf(a.mes) - ORDEM_MESES.indexOf(b.mes));
    DADOS_MIGRACOES.periodos = REGISTROS_MIGRACOES.map(item => item.mes === 'Base' ? String(item.ano) : item.mes);
    DADOS_MIGRACOES.atingido = REGISTROS_MIGRACOES.map(item => Number(item.atingido) || 0);
    DADOS_MIGRACOES.meta = REGISTROS_MIGRACOES.map(item => Number(item.meta) || 0);
    const ultimo = REGISTROS_MIGRACOES[REGISTROS_MIGRACOES.length - 1];
    META_FINAL_MIGRACOES = ultimo ? Number(ultimo.metaFinal) || 6000 : 6000;
    PROGRESSO_PROGRAMA = ultimo ? Math.max(0, Math.min(100, Number(ultimo.programa) || 0)) : 0;
  }

  function formatarPeriodoRegistro(item) { return item ? (item.mes === 'Base' ? String(item.ano) : `${item.mes}/${item.ano}`) : 'Sem dados'; }

  function atualizarResumoMigracoes() {
    const primeiro = REGISTROS_MIGRACOES[0]; const ultimo = REGISTROS_MIGRACOES[REGISTROS_MIGRACOES.length - 1];
    const atingido = ultimo ? Number(ultimo.atingido) || 0 : 0; const meta = ultimo ? Number(ultimo.meta) || 0 : 0;
    const aderencia = meta ? (atingido / meta) * 100 : 0; const diferenca = atingido - meta;
    const definir = (seletor, valor) => { const elemento = document.querySelector(seletor); if (elemento) elemento.textContent = valor; };
    definir('#coeMigracoesAtingido', formatarInteiro(atingido)); definir('#coeMigracoesMeta', formatarInteiro(meta));
    definir('#coeMigracoesMetaMes', ultimo ? (NOMES_MESES[ultimo.mes] || String(ultimo.ano)) : 'Sem período');
    definir('#coeMigracoesAderencia', `${aderencia.toFixed(1).replace('.', ',')}%`);
    definir('#coeMigracoesDiferenca', `${diferenca > 0 ? '+' : diferenca < 0 ? '−' : ''}${formatarInteiro(Math.abs(diferenca))}`);
    definir('#coeMigracoesDiferencaLegenda', diferenca > 0 ? 'VMs acima da meta' : diferenca < 0 ? 'VMs para a meta' : 'Meta atingida');
    const periodo = document.querySelector('#coeMigracoesPeriodo'); if (periodo) periodo.innerHTML = `<i class="bx bx-calendar"></i> ${formatarPeriodoRegistro(primeiro)} — ${formatarPeriodoRegistro(ultimo)}`;
    const resumo = document.querySelector('.coe-burnup-resumo'); if (resumo) resumo.setAttribute('aria-label', `Resumo das migrações em ${ultimo ? (NOMES_MESES[ultimo.mes] || ultimo.ano) : 'período não informado'}`);
    const anoMeta = ultimo ? ultimo.ano : new Date().getFullYear(); definir('#coeGaugeMetaTitulo', `Meta ${anoMeta}`);
    const gaugePrograma = document.querySelector('#coeGaugeProgramaItem'); if (gaugePrograma) gaugePrograma.setAttribute('aria-label', `Programa ${Math.round(PROGRESSO_PROGRAMA)} por cento concluído`);
    const percentualMeta = META_FINAL_MIGRACOES ? Math.max(0, Math.min(100, (atingido / META_FINAL_MIGRACOES) * 100)) : 0;
    const gaugeMeta = document.querySelector('#coeGaugeMetaItem'); if (gaugeMeta) gaugeMeta.setAttribute('aria-label', `Meta de ${anoMeta} atingida em ${Math.round(percentualMeta)} por cento`);
    return percentualMeta;
  }

  /**
   * Carteira de contratos.
   * Para atualizar o quadro, altere somente os objetos abaixo.
   * Status aceitos: vigente, renovacao, contratacao e pendente.
   */
  const CONTRATOS = [
    {
      nome: 'America',
      fornecedor: 'America Tecnologia',
      logo: '../assets/img/icons/brands/contratos/america.png',
      vencimento: 'A confirmar',
      status: 'pendente',
      statusTexto: 'A validar',
      observacao: 'Vencimento e situação de renovação em consolidação.'
    },
    {
      nome: 'Bull (Atos)',
      fornecedor: 'Atos',
      logo: '../assets/img/icons/brands/contratos/atos.png',
      vencimento: '30/04/2029',
      status: 'vigente',
      statusTexto: 'Vigente',
      observacao: 'Assinatura finalizada em 24/07.'
    },
    {
      nome: 'IBM',
      fornecedor: 'IBM',
      logo: '../assets/img/icons/brands/contratos/ibm.png',
      vencimento: 'A confirmar',
      status: 'pendente',
      statusTexto: 'A validar',
      observacao: 'Informações contratuais em levantamento.'
    },
    {
      nome: 'Microsoft SW',
      fornecedor: 'Microsoft',
      logo: '../assets/img/icons/brands/contratos/microsoft.png',
      vencimento: 'A confirmar',
      status: 'pendente',
      statusTexto: 'A validar',
      observacao: 'Escopo de software e vigência a confirmar.'
    },
    {
      nome: 'Microsoft UF',
      fornecedor: 'Microsoft',
      logo: '../assets/img/icons/brands/contratos/microsoft.png',
      vencimento: 'A confirmar',
      status: 'pendente',
      statusTexto: 'A validar',
      observacao: 'Dados da contratação UF em consolidação.'
    },
    {
      nome: 'Oracle SPARC',
      fornecedor: 'Oracle',
      logo: '../assets/img/icons/brands/contratos/oracle.png',
      vencimento: 'A confirmar',
      status: 'renovacao',
      statusTexto: 'Em renovação',
      observacao: 'Trabalho de renovação contratual iniciado.'
    },
    {
      nome: 'Veritas / InfoScale',
      fornecedor: 'Veritas',
      logo: '../assets/img/icons/brands/contratos/veritas-infoscale.png',
      vencimento: 'A confirmar',
      status: 'pendente',
      statusTexto: 'A validar',
      observacao: 'Vigência e escopo do licenciamento a confirmar.'
    },
    {
      nome: 'Linux com Oracle',
      fornecedor: 'Oracle Linux',
      logo: '../assets/img/icons/brands/contratos/oracle-linux.png',
      vencimento: 'A confirmar',
      status: 'pendente',
      statusTexto: 'A validar',
      observacao: 'Informações de suporte e renovação em levantamento.'
    },
    {
      nome: 'RackWare',
      fornecedor: 'RackWare',
      logo: '../assets/img/icons/brands/contratos/rackware.png',
      vencimento: 'A confirmar',
      status: 'contratacao',
      statusTexto: 'Em contratação',
      observacao: 'RFP publicada; contratação em andamento.'
    }
  ];

  const formatarInteiro = (valor) =>
    new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 0 }).format(valor);

  const escaparHtml = (valor) => String(valor == null ? '' : valor).replace(/[&<>'"]/g, (caractere) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[caractere]));

  function renderizarWorkshops() {
    const secao = document.querySelector('#coeWorkshopsSecao'); const lista = document.querySelector('#coeWorkshopsLista'); if (!secao || !lista) return;
    let salvos = {}; let excluidos = [];
    try { const configuracoes = JSON.parse(window.localStorage.getItem('dashboardInfraCloudConfiguracoes')) || {}; salvos = configuracoes.coeWorkshops || {}; excluidos = Array.isArray(configuracoes.coeWorkshopsExcluidos) ? configuracoes.coeWorkshopsExcluidos : []; }
    catch (erro) { console.warn('[Dashboard COE] Não foi possível carregar workshops e capacitações.', erro); }
    const ignorados = new Set(excluidos); const itens = Object.entries(Object.assign({}, WORKSHOPS_BASE, salvos)).filter(([chave, item]) => !ignorados.has(chave) && item.visivel !== false).map(([, item]) => item)
      .sort((a, b) => String(b.data || b.atualizadoEm || '').localeCompare(String(a.data || a.atualizadoEm || '')));
    secao.hidden = !itens.length; if (!itens.length) { lista.innerHTML = ''; return; }
    const modelos = {
      planejado: { texto: 'Capacitação planejada', icone: 'bx-calendar-plus' }, agendado: { texto: 'Capacitação agendada', icone: 'bx-calendar-event' },
      realizado: { texto: 'Workshop realizado', icone: 'bx-check-circle' }, cancelado: { texto: 'Capacitação cancelada', icone: 'bx-x-circle' }
    };
    lista.innerHTML = itens.map(function (item) {
      const modelo = modelos[item.status] || modelos.planejado; const data = item.data ? new Date(`${item.data}T12:00:00`).toLocaleDateString('pt-BR') : 'A definir';
      const rotuloData = item.status === 'realizado' ? 'Data de conclusão' : item.status === 'cancelado' ? 'Data de referência' : 'Data prevista';
      return `<article class="coe-workshop-destaque status-${escaparHtml(item.status)}"><span class="coe-workshop-status"><i class="bx ${modelo.icone}"></i> ${modelo.texto}</span><h3>${escaparHtml(item.titulo)}</h3><p class="coe-workshop-tema">${escaparHtml(item.tema)}</p><p class="coe-workshop-descricao">${escaparHtml(item.descricao)}</p>${item.publico ? `<p class="coe-workshop-publico"><i class="bx bx-group"></i> ${escaparHtml(item.publico)}</p>` : ''}<footer class="coe-workshop-data"><i class="bx bx-calendar-check"></i><div><span>${rotuloData}</span><strong>${data}</strong></div></footer></article>`;
    }).join('');
  }

  function renderizarEntregasRelevantes() {
    const secao = document.querySelector('#coeEntregasRelevantesSecao'); const lista = document.querySelector('#coeEntregasRelevantesLista'); if (!secao || !lista) return;
    let salvas = {}; let excluidas = [];
    try { const configuracoes = JSON.parse(window.localStorage.getItem('dashboardInfraCloudConfiguracoes')) || {}; salvas = configuracoes.coeEntregasRelevantes || {}; excluidas = Array.isArray(configuracoes.coeEntregasRelevantesExcluidas) ? configuracoes.coeEntregasRelevantesExcluidas : []; }
    catch (erro) { console.warn('[Dashboard COE] Não foi possível carregar as entregas relevantes.', erro); }
    const ignoradas = new Set(excluidas); const itens = Object.entries(Object.assign({}, ENTREGAS_RELEVANTES_BASE, salvas)).filter(([chave, item]) => !ignoradas.has(chave) && item.visivel !== false).map(([, item]) => item)
      .sort((a, b) => String(b.competencia || b.atualizadoEm || '').localeCompare(String(a.competencia || a.atualizadoEm || '')));
    secao.hidden = !itens.length; if (!itens.length) { lista.innerHTML = ''; return; }
    const modelos = {
      planejada: { texto: 'Entrega planejada', icone: 'bx-calendar-plus' }, andamento: { texto: 'Entrega em andamento', icone: 'bx-loader-circle' },
      concluida: { texto: 'Entrega concluída', icone: 'bx-check-circle' }, cancelada: { texto: 'Entrega cancelada', icone: 'bx-x-circle' }
    };
    const nomesMeses = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
    lista.innerHTML = itens.map(function (item) {
      const modelo = modelos[item.status] || modelos.planejada; const partes = String(item.competencia || '').split('-'); const competencia = partes.length === 2 ? `${nomesMeses[Number(partes[1]) - 1]}/${partes[0]}` : 'A definir';
      return `<article class="coe-workshop-destaque coe-entrega-relevante-item status-${escaparHtml(item.status)}"><span class="coe-workshop-status"><i class="bx ${modelo.icone}"></i> ${modelo.texto}</span><span class="coe-entrega-categoria">${escaparHtml(item.categoria)}</span><h3>${escaparHtml(item.titulo)}</h3><p class="coe-workshop-tema">${escaparHtml(item.produto)}</p><p class="coe-workshop-descricao">${escaparHtml(item.descricao)}</p>${item.beneficio ? `<p class="coe-entrega-beneficio"><i class="bx bx-trending-up"></i><span><small>Benefício gerado</small>${escaparHtml(item.beneficio)}</span></p>` : ''}<footer class="coe-workshop-data"><i class="bx bx-calendar-check"></i><div><span>Competência</span><strong>${competencia}</strong></div></footer></article>`;
    }).join('');
  }

  function renderizarPocs() {
    const corpo = document.querySelector('#coePocsTabelaCorpo'); if (!corpo) return; let salvas = {}; let excluidas = [];
    try { const configuracoes = JSON.parse(window.localStorage.getItem('dashboardInfraCloudConfiguracoes')) || {}; salvas = configuracoes.coePocs || {}; excluidas = Array.isArray(configuracoes.coePocsExcluidas) ? configuracoes.coePocsExcluidas : []; }
    catch (erro) { console.warn('[Dashboard COE] Não foi possível carregar as POCs.', erro); }
    const ignoradas = new Set(excluidas); const itens = Object.entries(Object.assign({}, POCS_BASE, salvas)).filter(([chave, item]) => !ignoradas.has(chave) && item.visivel !== false).map(([, item]) => item);
    if (!itens.length) { corpo.innerHTML = '<tr><td colspan="4" class="coe-pocs-vazio"><i class="bx bx-bulb"></i> Nenhuma POC publicada.</td></tr>'; return; }
    const rotulos = { planejada: 'Planejada', andamento: 'Em andamento', pausa: 'Em pausa', concluida: 'Concluída', encerrada: 'Encerrada' };
    corpo.innerHTML = itens.map(function (item) {
      const previsao = item.previsao || 'A definir'; const textoPrevisao = previsao.toLowerCase(); const classePrevisao = textoPrevisao.includes('cancel') ? ' previsao-cancelada' : textoPrevisao.includes('definir') || textoPrevisao.includes('preencher') ? '' : ' previsao-confirmada';
      return `<tr><td><strong>${escaparHtml(item.nome)}</strong></td><td><span class="coe-poc-status poc-${escaparHtml(item.status)}"><i></i>${rotulos[item.status] || escaparHtml(item.status)}</span></td><td>${escaparHtml(item.observacao)}</td><td><span class="coe-poc-previsao${classePrevisao}">${escaparHtml(previsao)}</span></td></tr>`;
    }).join('');
  }

  function renderizarAutomacoes() {
    let evolucaoSalva = {}; let evolucaoExcluida = []; let entregasSalvas = {}; let entregasExcluidas = [];
    try {
      const configuracoes = JSON.parse(window.localStorage.getItem('dashboardInfraCloudConfiguracoes')) || {};
      evolucaoSalva = configuracoes.coeAutomacoesEvolucao || {}; evolucaoExcluida = Array.isArray(configuracoes.coeAutomacoesEvolucaoExcluidas) ? configuracoes.coeAutomacoesEvolucaoExcluidas : [];
      entregasSalvas = configuracoes.coeAutomacoesEntregues || {}; entregasExcluidas = Array.isArray(configuracoes.coeAutomacoesEntreguesExcluidas) ? configuracoes.coeAutomacoesEntreguesExcluidas : [];
    } catch (erro) { console.warn('[Dashboard COE] Não foi possível carregar as automações.', erro); }
    const evolucaoIgnorada = new Set(evolucaoExcluida); const evolucao = Object.entries(Object.assign({}, AUTOMACOES_EVOLUCAO_BASE, evolucaoSalva)).filter(([chave]) => !evolucaoIgnorada.has(chave)).map(([, item]) => item).sort((a, b) => String(a.competencia).localeCompare(String(b.competencia)));
    const nomesMeses = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
    const nomeMes = (competencia) => { const partes = String(competencia || '').split('-'); return nomesMeses[Number(partes[1]) - 1] || 'Período'; };
    const recentes = evolucao.slice(-2); const kpis = document.querySelector('#coeAutomacoesKpis');
    if (kpis) kpis.innerHTML = recentes.map((item, indice) => `<div class="${indice === recentes.length - 1 ? 'kpi-destaque' : ''}"><span>${nomeMes(item.competencia)}</span><strong>${Number(item.publicadas).toLocaleString('pt-BR')}</strong><small>publicadas</small></div>`).join('');
    const atual = recentes[recentes.length - 1]; const anterior = recentes[recentes.length - 2]; const variacao = atual && anterior ? Number(atual.publicadas) - Number(anterior.publicadas) : 0;
    const variacaoElemento = document.querySelector('#coeAutomacoesVariacao'); if (variacaoElemento) variacaoElemento.innerHTML = `<i class="bx ${variacao >= 0 ? 'bx-trending-up' : 'bx-trending-down'}"></i> ${variacao > 0 ? '+' : ''}${variacao} publicações`;
    const periodo = document.querySelector('#coeAutomacoesVariacaoPeriodo'); if (periodo) periodo.textContent = atual && anterior ? `Evolução entre ${nomeMes(anterior.competencia).toLowerCase()} e ${nomeMes(atual.competencia).toLowerCase()}` : 'Aguardando duas competências';
    const proxima = document.querySelector('#coeAutomacoesProximaJanela'); if (proxima) proxima.textContent = atual && atual.proximaJanela ? atual.proximaJanela : 'A definir';
    const atualizado = document.querySelector('#coeAutomacoesAtualizacao'); if (atualizado && atual) { const data = atual.atualizadoEm ? new Date(atual.atualizadoEm).toLocaleDateString('pt-BR') : 'A definir'; atualizado.innerHTML = `<i class="bx bx-refresh"></i> Atualização semanal · ${data}`; }

    const entregasIgnoradas = new Set(entregasExcluidas); const entregas = Object.entries(entregasSalvas).filter(([chave, item]) => !entregasIgnoradas.has(chave) && item.visivel !== false).map(([, item]) => item).sort((a, b) => String(b.data || '').localeCompare(String(a.data || '')));
    const corpo = document.querySelector('#coeAutomacoesTabelaCorpo');
    if (corpo) corpo.innerHTML = entregas.length ? entregas.map(item => `<tr><td><strong>${escaparHtml(item.titulo)}</strong></td><td>${escaparHtml(item.ganho)}</td><td><span class="coe-automacao-campo campo-data">${item.data ? new Date(`${item.data}T12:00:00`).toLocaleDateString('pt-BR') : 'A definir'}</span></td></tr>`).join('') : '<tr><td colspan="3" class="coe-automacoes-vazio"><i class="bx bx-bot"></i> Nenhuma automação entregue publicada.</td></tr>';
    const ultima = entregas[0]; const titulo = document.querySelector('#coeUltimaAutomacaoTitulo'); const data = document.querySelector('#coeUltimaAutomacaoData'); const descricao = document.querySelector('#coeUltimaAutomacaoDescricao');
    if (titulo) titulo.textContent = ultima ? ultima.titulo : 'A preencher'; if (data) data.textContent = ultima && ultima.data ? new Date(`${ultima.data}T12:00:00`).toLocaleDateString('pt-BR') : 'A preencher';
    if (descricao) descricao.textContent = ultima ? ultima.descricao : 'Registre a automação concluída e o principal valor gerado para a operação.';
  }

  const obterIniciais = (texto) =>
    texto.split(/\s|\//).filter(Boolean).slice(0, 2).map((parte) => parte[0]).join('').toUpperCase();

  function criarCardContrato(contrato) {
    return `
      <article class="coe-contrato-item">
        <div class="coe-contrato-logo">
          <span>${obterIniciais(contrato.fornecedor)}</span>
          <img src="${contrato.logo}" alt="${contrato.fornecedor}"
            onload="this.parentElement.classList.add('logo-carregada')"
            onerror="this.remove()" />
        </div>
        <div class="coe-contrato-identidade">
          <strong>${contrato.nome}</strong>
          <span>${contrato.fornecedor}</span>
        </div>
        <div class="coe-contrato-vencimento">
          <i class="bx bx-calendar"></i>
          <div><small>Vencimento</small><strong>${contrato.vencimento}</strong></div>
        </div>
        <p class="coe-contrato-observacao">${contrato.observacao}</p>
        <span class="coe-status-contrato status-${contrato.status}">${contrato.statusTexto}</span>
      </article>`;
  }

  function criarDestaqueContrato(contrato) {
    return `
      <article class="coe-destaque-item">
        <div class="coe-destaque-logo">
          <img src="${contrato.logo}" alt="${contrato.fornecedor}" />
        </div>
        <div>
          <span>${contrato.status === 'renovacao' ? 'Renovação' : 'Contratação'}</span>
          <strong>${contrato.nome}</strong>
          <small>${contrato.observacao}</small>
        </div>
      </article>`;
  }

  function renderizarContratos() {
    const grade = document.querySelector('#coeContratosGrid');
    if (!grade) return;

    grade.innerHTML = CONTRATOS.map(criarCardContrato).join('');

    const contratosEmAndamento = CONTRATOS.filter(({ status }) =>
      status === 'renovacao' || status === 'contratacao');
    const destaques = document.querySelector('#coeContratosDestaques');
    const quantidadeDestaques = document.querySelector('#coeQtdDestaques');
    const progressoDestaques = document.querySelector('#coeDestaquesProgresso');

    if (destaques) destaques.innerHTML = contratosEmAndamento.map(criarDestaqueContrato).join('');
    if (quantidadeDestaques) quantidadeDestaques.textContent = contratosEmAndamento.length;
    if (progressoDestaques) progressoDestaques.style.width =
      `${(contratosEmAndamento.length / CONTRATOS.length) * 100}%`;

    const quantidade = document.querySelector('#coeQtdContratos');
    const andamento = document.querySelector('#coeQtdAndamento');
    const pendentes = document.querySelector('#coeQtdPendentes');

    if (quantidade) quantidade.textContent = CONTRATOS.length;
    if (andamento) andamento.textContent = contratosEmAndamento.length;
    if (pendentes) pendentes.textContent = CONTRATOS.filter(({ status }) => status === 'pendente').length;
  }

  function criarGraficoMigracoes() {
    const elemento = document.querySelector('#coeMigracoesChart');

    if (!elemento || typeof ApexCharts === 'undefined') return;
    if (!DADOS_MIGRACOES.periodos.length) { elemento.innerHTML = '<div class="coe-grafico-vazio"><i class="bx bx-line-chart"></i><strong>Sem dados de migração</strong><span>Inclua um período nas configurações do COE.</span></div>'; return; }

    const opcoes = {
      chart: {
        type: 'line',
        height: 390,
        fontFamily: 'Public Sans, sans-serif',
        foreColor: CORES.texto,
        toolbar: { show: false },
        zoom: { enabled: false },
        animations: {
          enabled: true,
          easing: 'easeinout',
          speed: 1050,
          animateGradually: { enabled: true, delay: 115 },
          dynamicAnimation: { enabled: true, speed: 420 }
        }
      },
      series: [
        { name: 'Atingido', data: DADOS_MIGRACOES.atingido },
        { name: 'Meta', data: DADOS_MIGRACOES.meta }
      ],
      colors: [CORES.atingido, CORES.meta],
      stroke: {
        width: [3.2, 2.2],
        curve: 'smooth',
        dashArray: [0, 7],
        lineCap: 'round'
      },
      markers: {
        size: [4.5, 4],
        strokeWidth: 2,
        strokeColors: CORES.branco,
        hover: { size: 7 },
        discrete: [
          {
            seriesIndex: 0,
            dataPointIndex: DADOS_MIGRACOES.atingido.length - 1,
            fillColor: CORES.atingido,
            strokeColor: CORES.branco,
            size: 7
          },
          {
            seriesIndex: 1,
            dataPointIndex: DADOS_MIGRACOES.meta.length - 1,
            fillColor: CORES.branco,
            strokeColor: CORES.meta,
            size: 7
          }
        ]
      },
      dataLabels: {
        enabled: true,
        enabledOnSeries: [0],
        formatter: (valor, contexto) =>
          contexto.dataPointIndex === DADOS_MIGRACOES.atingido.length - 1
            ? ''
            : formatarInteiro(valor),
        offsetY: -9,
        background: { enabled: false },
        style: {
          fontSize: '10px',
          fontWeight: 700,
          colors: [CORES.atingido]
        },
        dropShadow: { enabled: false }
      },
      annotations: {
        points: [
          {
            x: DADOS_MIGRACOES.periodos[DADOS_MIGRACOES.periodos.length - 1],
            y: DADOS_MIGRACOES.atingido[DADOS_MIGRACOES.atingido.length - 1],
            marker: { size: 0 },
            label: {
              text: formatarInteiro(DADOS_MIGRACOES.atingido[DADOS_MIGRACOES.atingido.length - 1]),
              offsetX: -2,
              offsetY: 24,
              borderColor: 'transparent',
              style: {
                color: CORES.atingido,
                background: 'transparent',
                fontSize: '10px',
                fontWeight: 700
              }
            }
          }
        ]
      },
      grid: {
        borderColor: CORES.grade,
        strokeDashArray: 4,
        padding: { top: 22, right: 18, bottom: 2, left: 8 }
      },
      xaxis: {
        categories: DADOS_MIGRACOES.periodos,
        axisBorder: { show: false },
        axisTicks: { show: false },
        labels: {
          style: { colors: CORES.textoSuave, fontSize: '11px', fontWeight: 500 }
        },
        tooltip: { enabled: false }
      },
      yaxis: {
        min: 0,
        max: Math.max(1000, Math.ceil(Math.max(...DADOS_MIGRACOES.atingido, ...DADOS_MIGRACOES.meta) * 1.08 / 1000) * 1000),
        tickAmount: 5,
        labels: {
          formatter: (valor) => formatarInteiro(valor),
          style: { colors: CORES.textoSuave, fontSize: '10px' }
        },
        title: {
          text: 'Máquinas virtuais',
          style: { color: CORES.textoSuave, fontSize: '10px', fontWeight: 500 }
        }
      },
      legend: {
        show: true,
        position: 'top',
        horizontalAlign: 'left',
        offsetY: 2,
        fontSize: '11px',
        fontWeight: 500,
        labels: { colors: CORES.texto },
        markers: { width: 9, height: 9, radius: 9 },
        itemMargin: { horizontal: 14, vertical: 4 }
      },
      tooltip: {
        shared: true,
        intersect: false,
        theme: 'light',
        y: {
          formatter: (valor) => `${formatarInteiro(valor)} VMs`
        }
      },
      fill: {
        type: 'solid',
        opacity: 1
      },
      states: {
        normal: { filter: { type: 'none' } },
        hover: { filter: { type: 'lighten', value: 0.04 } },
        active: { filter: { type: 'none' } }
      },
      responsive: [
        {
          breakpoint: 768,
          options: {
            chart: { height: 350 },
            dataLabels: { enabled: false },
            legend: { position: 'bottom' },
            grid: { padding: { right: 6, left: 0 } },
            yaxis: { title: { text: undefined } }
          }
        }
      ]
    };

    const grafico = new ApexCharts(elemento, opcoes);
    grafico.render();
  }

  /**
   * Cria um gauge radial compacto para os indicadores da jornada.
   * Cada gráfico recebe sua própria cor para facilitar a leitura executiva.
   */
  function criarGaugeJornada(seletor, valor, corInicial, corFinal) {
    const elemento = document.querySelector(seletor);

    if (!elemento || typeof ApexCharts === 'undefined') return;

    const opcoes = {
      chart: {
        type: 'radialBar',
        height: 164,
        fontFamily: 'Public Sans, sans-serif',
        sparkline: { enabled: true },
        animations: {
          enabled: true,
          easing: 'easeinout',
          speed: 1150,
          animateGradually: { enabled: true, delay: 160 },
          dynamicAnimation: { enabled: true, speed: 500 }
        }
      },
      series: [valor],
      colors: [corInicial],
      plotOptions: {
        radialBar: {
          startAngle: -132,
          endAngle: 132,
          hollow: {
            size: '61%',
            background: '#ffffff',
            dropShadow: {
              enabled: true,
              top: 3,
              left: 0,
              blur: 7,
              opacity: 0.08
            }
          },
          track: {
            background: '#e9e9f0',
            strokeWidth: '98%',
            margin: 2,
            dropShadow: { enabled: false }
          },
          dataLabels: {
            name: { show: false },
            value: {
              show: true,
              offsetY: 7,
              color: '#384551',
              fontSize: '25px',
              fontWeight: 700,
              formatter: (numero) => `${Math.round(numero)}%`
            }
          }
        }
      },
      fill: {
        type: 'gradient',
        gradient: {
          shade: 'light',
          type: 'horizontal',
          shadeIntensity: 0.18,
          gradientToColors: [corFinal],
          inverseColors: false,
          opacityFrom: 1,
          opacityTo: 1,
          stops: [0, 100]
        }
      },
      stroke: { lineCap: 'round' },
      tooltip: { enabled: false }
    };

    new ApexCharts(elemento, opcoes).render();
  }

  function inicializarDashboardCoe() {
    carregarDadosMigracoes();
    const percentualMeta = atualizarResumoMigracoes();
    criarGraficoMigracoes();
    criarGaugeJornada('#coeGaugePrograma', PROGRESSO_PROGRAMA, '#8b5fd3', '#6f42c1');
    criarGaugeJornada('#coeGaugeMeta', percentualMeta, '#58a6ff', '#2f80ed');
    renderizarContratos();
    renderizarWorkshops();
    renderizarEntregasRelevantes();
    renderizarPocs();
    renderizarAutomacoes();

    // Recalcula as dimensões após o menu e o layout concluírem suas transições.
    [250, 850].forEach((atraso) => {
      window.setTimeout(() => window.dispatchEvent(new Event('resize')), atraso);
    });
  }

  document.addEventListener('DOMContentLoaded', inicializarDashboardCoe);
})();
