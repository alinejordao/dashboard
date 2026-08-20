(function (window, document) {
  'use strict';

  const CHAVE = 'dashboardInfraCloudConfiguracoes';
  const BASE_DISPONIBILIDADE = { mes: 'Ago', incidentes: 1, impacto: 104, disponibilidade: 99.76 };
  const FORNECEDORES_BASE = {
    atos: { nome: 'Bull (Atos)', status: 'confirmado', data: '2026-08-10', hora: '10:00', observacao: '' },
    america: { nome: 'América Tecnologia', status: 'confirmado', data: '2026-08-10', hora: '11:30', observacao: '' },
    microsoft: { nome: 'Microsoft', status: 'pendente', data: '', hora: '', observacao: '' },
    hp: { nome: 'HP', status: 'pendente', data: '', hora: '', observacao: '' },
    huawei: { nome: 'Huawei', status: 'pendente', data: '', hora: '', observacao: '' },
    dell: { nome: 'Dell', status: 'pendente', data: '', hora: '', observacao: '' }
  };
  const INICIATIVAS_BASE = {
    gaus: { titulo: 'Automação GAUS', descricao: 'Automação da manutenção de hardware', status: 'andamento', progresso: null, detalhe: 'Desenvolvimento ativo', termino: '', observacao: '', icone: 'bx-cog', cor: 'roxo' },
    chamado: { titulo: 'Abertura de chamado', descricao: 'Fluxo de abertura em desenvolvimento', status: 'andamento', progresso: 50, detalhe: '50% concluído', termino: '', observacao: '', icone: 'bx-clipboard', cor: 'azul' },
    ritm: { titulo: 'Definição dos processos de RITM', descricao: 'Office 365 e Acesso SO concluídos', status: 'andamento', progresso: 50, detalhe: '2 de 4 processos concluídos', termino: '', observacao: '', icone: 'bx-git-branch', cor: 'laranja' },
    catalogo: { titulo: 'Revisão do catálogo RITMs', descricao: 'Revisão e validação do catálogo operacional', status: 'concluida', progresso: 100, detalhe: 'Concluído', termino: '2026-08-31', observacao: '', icone: 'bx-file', cor: 'verde' }
  };
  const ICONES_INICIATIVAS = [
    'bx-bulb', 'bx-rocket', 'bx-cog', 'bx-code-alt', 'bx-cloud',
    'bx-shield-quarter', 'bx-network-chart', 'bx-data', 'bx-line-chart', 'bx-task'
  ];
  const MUDANCAS_TAREFAS_BASE = { 2026: { ano: 2026, mudancas: 1921, tarefas: 2837, observacao: '' } };
  const INFORMACOES_RELEVANTES_BASE = {
    incidente_gedoc: { tipo: 'incidente', titulo: 'Incidente GEDOC', referencia: 'INC4530241', status: 'Redirecionado', data: '', descricao: 'Impacto no Exchange causado pela rotina de backup executada fora da janela operacional.', detalhe: 'TLV_SI_INFRAESTRUTURA BACKUP', acao: 'Encaminhado ao time responsável · Causa em análise', visivel: true }
  };
  const VIRTUALIZA_BASE = {
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
  const WORKSHOPS_BASE = {
    power_aix: { titulo: 'Workshop POWER/AIX', tema: 'Procedimentos Operacionais e Resposta a Incidentes', status: 'realizado', data: '2026-08-14', publico: '', descricao: 'Conteúdo direcionado à padronização dos procedimentos operacionais e à resposta a incidentes nos ambientes POWER/AIX.', visivel: true }
  };
  const ENTREGAS_RELEVANTES_COE_BASE = {
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

  function lerDados() {
    try { return JSON.parse(window.localStorage.getItem(CHAVE)) || {}; }
    catch (erro) { return {}; }
  }

  function escaparHtml(valor) {
    return String(valor == null ? '' : valor).replace(/[&<>'"]/g, function (caractere) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[caractere];
    });
  }

  function salvarFormulario(formulario) {
    const dados = lerDados();
    dados[formulario.dataset.relatorio] = Object.fromEntries(new FormData(formulario).entries());
    window.localStorage.setItem(CHAVE, JSON.stringify(dados));
  }

  function preencherFormulario(formulario) {
    const dados = lerDados()[formulario.dataset.relatorio] || {};
    Object.entries(dados).forEach(([nome, valor]) => {
      const campo = formulario.elements.namedItem(nome);
      if (campo) campo.value = valor;
    });
  }

  function impactoParaMinutos(valor) {
    const texto = String(valor || '').trim().toLowerCase().replace(',', '.');
    if (!texto) return NaN;
    if (/^\d+(\.\d+)?$/.test(texto)) return Math.round(Number(texto) * 60);
    const horas = texto.match(/(\d+(?:\.\d+)?)\s*h/);
    const minutos = texto.match(/(\d+)\s*m/);
    if (!horas && !minutos) return NaN;
    return Math.round((horas ? Number(horas[1]) * 60 : 0) + (minutos ? Number(minutos[1]) : 0));
  }

  function minutosParaTexto(minutos) {
    const total = Math.max(0, Math.round(Number(minutos) || 0));
    return `${Math.floor(total / 60)}h ${total % 60}min`;
  }

  function obterRegistrosVirtualiza() {
    const dados = lerDados(); const excluidos = new Set(Array.isArray(dados.coeVirtualizaExcluidos) ? dados.coeVirtualizaExcluidos : []);
    const salvos = Object.assign({}, dados.coeVirtualiza || {}); const legado = dados.coe || {};
    if (!Object.keys(salvos).length && legado.migracoes_atingido !== undefined) salvos['2026-Ago'] = Object.assign({}, VIRTUALIZA_BASE['2026-Ago'], { atingido: Number(legado.migracoes_atingido), meta: Number(legado.migracoes_meta), metaFinal: Number(legado.migracoes_meta_final) || 6000 });
    return Object.entries(Object.assign({}, VIRTUALIZA_BASE, salvos))
      .filter(([chave]) => !excluidos.has(chave))
      .sort(([, a], [, b]) => Number(a.ano) - Number(b.ano) || ORDEM_MESES.indexOf(a.mes) - ORDEM_MESES.indexOf(b.mes));
  }

  function renderizarHistoricoVirtualiza() {
    const destino = document.querySelector('#historicoVirtualiza'); if (!destino) return;
    const registros = obterRegistrosVirtualiza();
    if (!registros.length) { destino.innerHTML = '<span class="config-historico-vazio">Nenhum período cadastrado.</span>'; return; }
    destino.innerHTML = registros.map(function ([chave, item]) {
      const periodo = item.mes === 'Base' ? String(item.ano) : `${item.mes}/${item.ano}`;
      const aderencia = Number(item.meta) ? (Number(item.atingido) / Number(item.meta)) * 100 : 0;
      return `<span class="config-historico-item config-registro-item"><span><strong>${periodo}</strong><small>${Number(item.atingido).toLocaleString('pt-BR')} atingido · ${Number(item.meta).toLocaleString('pt-BR')} meta · ${aderencia.toFixed(1).replace('.', ',')}%</small></span><span class="config-registro-acoes"><button type="button" data-acao="editar-virtualiza" data-chave="${chave}"><i class="bx bx-edit-alt"></i> Editar</button><button type="button" class="excluir" data-acao="excluir-virtualiza" data-chave="${chave}"><i class="bx bx-trash"></i> Excluir</button></span></span>`;
    }).join('');
  }

  function configurarVirtualiza() {
    const botao = document.querySelector('#salvarVirtualiza'); if (!botao) return;
    const mes = document.querySelector('#virtualizaMes'); const ano = document.querySelector('#virtualizaAno');
    const atingido = document.querySelector('#virtualizaAtingido'); const meta = document.querySelector('#virtualizaMeta');
    const metaFinal = document.querySelector('#virtualizaMetaFinal'); const programa = document.querySelector('#virtualizaPrograma');
    const feedback = document.querySelector('#feedbackVirtualiza'); const lista = document.querySelector('#historicoVirtualiza');
    renderizarHistoricoVirtualiza();
    const alternarPeriodos = document.querySelector('#alternarPeriodosVirtualiza');
    if (alternarPeriodos) alternarPeriodos.addEventListener('click', function () {
      const aberto = lista.classList.toggle('visivel'); lista.setAttribute('aria-hidden', String(!aberto)); alternarPeriodos.setAttribute('aria-expanded', String(aberto)); alternarPeriodos.classList.toggle('ativo', aberto);
      alternarPeriodos.querySelector('span').textContent = aberto ? 'Fechar gerenciamento' : 'Gerenciar períodos';
    });
    lista.addEventListener('click', function (evento) {
      const acao = evento.target.closest('[data-acao]'); if (!acao) return;
      const chave = acao.dataset.chave; const registro = Object.fromEntries(obterRegistrosVirtualiza())[chave]; if (!registro) return;
      if (acao.dataset.acao === 'editar-virtualiza') {
        mes.value = registro.mes; ano.value = registro.ano; atingido.value = registro.atingido; meta.value = registro.meta;
        metaFinal.value = registro.metaFinal || 6000; programa.value = registro.programa == null ? 25 : registro.programa;
        botao.dataset.chaveEdicao = chave; botao.innerHTML = '<i class="bx bx-save"></i> Salvar alterações'; mes.scrollIntoView({ behavior: 'smooth', block: 'center' }); return;
      }
      const periodo = registro.mes === 'Base' ? String(registro.ano) : `${registro.mes}/${registro.ano}`;
      if (!window.confirm(`Excluir o período ${periodo} da evolução das migrações?`)) return;
      const dados = lerDados(); dados.coeVirtualiza = dados.coeVirtualiza || {}; delete dados.coeVirtualiza[chave];
      dados.coeVirtualizaExcluidos = Array.isArray(dados.coeVirtualizaExcluidos) ? dados.coeVirtualizaExcluidos : [];
      if (!dados.coeVirtualizaExcluidos.includes(chave)) dados.coeVirtualizaExcluidos.push(chave);
      window.localStorage.setItem(CHAVE, JSON.stringify(dados)); delete botao.dataset.chaveEdicao; botao.innerHTML = '<i class="bx bx-plus"></i> Adicionar período'; renderizarHistoricoVirtualiza();
      feedback.textContent = `${periodo} excluído do dashboard.`; feedback.classList.remove('erro'); feedback.classList.add('visivel');
    });
    botao.addEventListener('click', function () {
      const anoValor = Number(ano.value); const atingidoValor = Number(atingido.value); const metaValor = Number(meta.value);
      const metaFinalValor = Number(metaFinal.value); const programaValor = Number(String(programa.value).replace(',', '.'));
      if (!mes.value || !Number.isInteger(anoValor) || anoValor < 2025 || anoValor > 2100 || atingido.value === '' || meta.value === '' || metaFinal.value === '' || programa.value === '' || atingidoValor < 0 || metaValor < 0 || metaFinalValor <= 0 || programaValor < 0 || programaValor > 100) {
        feedback.textContent = 'Preencha período, valores acumulados, meta final e progresso com dados válidos.'; feedback.classList.add('visivel', 'erro'); return;
      }
      const chaveNova = `${anoValor}-${mes.value}`; const chaveAnterior = botao.dataset.chaveEdicao;
      const dados = lerDados(); dados.coeVirtualiza = dados.coeVirtualiza || {};
      if (chaveAnterior && chaveAnterior !== chaveNova) { delete dados.coeVirtualiza[chaveAnterior]; dados.coeVirtualizaExcluidos = Array.isArray(dados.coeVirtualizaExcluidos) ? dados.coeVirtualizaExcluidos : []; if (!dados.coeVirtualizaExcluidos.includes(chaveAnterior)) dados.coeVirtualizaExcluidos.push(chaveAnterior); }
      dados.coeVirtualiza[chaveNova] = { mes: mes.value, ano: anoValor, atingido: Math.round(atingidoValor), meta: Math.round(metaValor), metaFinal: Math.round(metaFinalValor), programa: programaValor, atualizadoEm: new Date().toISOString() };
      dados.coeVirtualizaExcluidos = (Array.isArray(dados.coeVirtualizaExcluidos) ? dados.coeVirtualizaExcluidos : []).filter(item => item !== chaveNova);
      window.localStorage.setItem(CHAVE, JSON.stringify(dados)); delete botao.dataset.chaveEdicao; botao.innerHTML = '<i class="bx bx-plus"></i> Adicionar período'; renderizarHistoricoVirtualiza();
      feedback.textContent = `${mes.value === 'Base' ? anoValor : `${mes.value}/${anoValor}`} salvo. Os indicadores do COE serão recalculados.`; feedback.classList.remove('erro'); feedback.classList.add('visivel');
    });
  }

  function obterWorkshops() {
    const dados = lerDados(); const excluidos = new Set(Array.isArray(dados.coeWorkshopsExcluidos) ? dados.coeWorkshopsExcluidos : []);
    return Object.fromEntries(Object.entries(Object.assign({}, WORKSHOPS_BASE, dados.coeWorkshops || {})).filter(([chave]) => !excluidos.has(chave)));
  }

  function rotuloStatusWorkshop(status) {
    return { planejado: 'Planejado', agendado: 'Agendado', realizado: 'Realizado', cancelado: 'Cancelado' }[status] || status;
  }

  function renderizarResumoWorkshops() {
    const destino = document.querySelector('#resumoWorkshops'); if (!destino) return;
    const itens = Object.entries(obterWorkshops());
    if (!itens.length) { destino.innerHTML = '<span class="config-historico-vazio">Nenhum workshop ou capacitação cadastrado.</span>'; return; }
    destino.innerHTML = itens.map(function ([chave, item]) {
      const publicacao = item.visivel !== false ? 'Exibido' : 'Oculto';
      return `<article class="config-agenda-item config-registro-item"><span><strong>${escaparHtml(item.titulo)}</strong><small>${rotuloStatusWorkshop(item.status)}${item.data ? ` · ${formatarDataCurta(item.data)}` : ''} · ${publicacao}</small></span><span class="config-registro-acoes"><button type="button" data-acao="editar-workshop" data-chave="${chave}"><i class="bx bx-edit-alt"></i> Editar</button><button type="button" class="excluir" data-acao="excluir-workshop" data-chave="${chave}"><i class="bx bx-trash"></i> Excluir</button></span></article>`;
    }).join('');
  }

  function configurarWorkshops() {
    const botao = document.querySelector('#salvarWorkshop'); if (!botao) return;
    const seletor = document.querySelector('#workshopSelecionado'); const titulo = document.querySelector('#workshopTitulo');
    const tema = document.querySelector('#workshopTema'); const status = document.querySelector('#workshopStatus'); const data = document.querySelector('#workshopData');
    const publico = document.querySelector('#workshopPublico'); const descricao = document.querySelector('#workshopDescricao'); const visivel = document.querySelector('#workshopVisivel');
    const lista = document.querySelector('#resumoWorkshops'); const feedback = document.querySelector('#feedbackWorkshop');
    function atualizarOpcoes(selecionar) {
      const itens = obterWorkshops(); seletor.innerHTML = Object.entries(itens).map(([chave, item]) => `<option value="${chave}">${escaparHtml(item.titulo)}</option>`).join('') + '<option value="novo">+ Novo card</option>';
      seletor.value = selecionar && (itens[selecionar] || selecionar === 'novo') ? selecionar : (Object.keys(itens)[0] || 'novo');
    }
    function preencher() {
      if (seletor.value === 'novo') { titulo.value = ''; tema.value = ''; status.value = 'planejado'; data.value = ''; publico.value = ''; descricao.value = ''; visivel.checked = true; return; }
      const item = obterWorkshops()[seletor.value]; if (!item) return;
      titulo.value = item.titulo || ''; tema.value = item.tema || ''; status.value = item.status || 'planejado'; data.value = item.data || '';
      publico.value = item.publico || ''; descricao.value = item.descricao || ''; visivel.checked = item.visivel !== false;
    }
    atualizarOpcoes('power_aix'); renderizarResumoWorkshops(); preencher();
    seletor.addEventListener('change', preencher);
    const alternar = document.querySelector('#alternarWorkshops'); if (alternar) alternar.addEventListener('click', function () {
      const aberto = lista.classList.toggle('visivel'); lista.setAttribute('aria-hidden', String(!aberto)); alternar.setAttribute('aria-expanded', String(aberto)); alternar.classList.toggle('ativo', aberto);
      alternar.querySelector('span').textContent = aberto ? 'Fechar gerenciamento' : 'Gerenciar cards';
    });
    lista.addEventListener('click', function (evento) {
      const acao = evento.target.closest('[data-acao]'); if (!acao) return; const chave = acao.dataset.chave; const item = obterWorkshops()[chave]; if (!item) return;
      if (acao.dataset.acao === 'editar-workshop') { seletor.value = chave; preencher(); seletor.scrollIntoView({ behavior: 'smooth', block: 'center' }); return; }
      if (!window.confirm(`Excluir “${item.titulo}”?`)) return;
      const dados = lerDados(); dados.coeWorkshops = dados.coeWorkshops || {}; delete dados.coeWorkshops[chave]; dados.coeWorkshopsExcluidos = Array.isArray(dados.coeWorkshopsExcluidos) ? dados.coeWorkshopsExcluidos : [];
      if (!dados.coeWorkshopsExcluidos.includes(chave)) dados.coeWorkshopsExcluidos.push(chave); window.localStorage.setItem(CHAVE, JSON.stringify(dados));
      atualizarOpcoes(); preencher(); renderizarResumoWorkshops(); feedback.textContent = `“${item.titulo}” excluído.`; feedback.classList.remove('erro'); feedback.classList.add('visivel');
    });
    botao.addEventListener('click', function () {
      if (!titulo.value.trim() || !tema.value.trim() || !descricao.value.trim()) { feedback.textContent = 'Informe título, tema e descrição executiva.'; feedback.classList.add('visivel', 'erro'); return; }
      const dados = lerDados(); dados.coeWorkshops = dados.coeWorkshops || {}; const novo = seletor.value === 'novo'; const chave = novo ? `workshop_${Date.now()}` : seletor.value;
      dados.coeWorkshops[chave] = { titulo: titulo.value.trim(), tema: tema.value.trim(), status: status.value, data: data.value, publico: publico.value.trim(), descricao: descricao.value.trim(), visivel: visivel.checked, atualizadoEm: new Date().toISOString() };
      dados.coeWorkshopsExcluidos = (Array.isArray(dados.coeWorkshopsExcluidos) ? dados.coeWorkshopsExcluidos : []).filter(item => item !== chave); window.localStorage.setItem(CHAVE, JSON.stringify(dados));
      atualizarOpcoes(chave); preencher(); renderizarResumoWorkshops(); feedback.textContent = `“${titulo.value}” salvo e ${visivel.checked ? 'publicado' : 'mantido oculto'}.`; feedback.classList.remove('erro'); feedback.classList.add('visivel');
    });
  }

  function obterEntregasRelevantesCoe() {
    const dados = lerDados(); const excluidas = new Set(Array.isArray(dados.coeEntregasRelevantesExcluidas) ? dados.coeEntregasRelevantesExcluidas : []);
    return Object.fromEntries(Object.entries(Object.assign({}, ENTREGAS_RELEVANTES_COE_BASE, dados.coeEntregasRelevantes || {})).filter(([chave]) => !excluidas.has(chave)));
  }

  function rotuloStatusEntregaRelevante(status) {
    return { planejada: 'Planejada', andamento: 'Em andamento', concluida: 'Concluída', cancelada: 'Cancelada' }[status] || status;
  }

  function formatarCompetencia(valor) {
    const partes = String(valor || '').split('-');
    if (partes.length !== 2) return 'A definir';
    const nomes = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
    return `${nomes[Number(partes[1]) - 1] || partes[1]}/${partes[0]}`;
  }

  function renderizarResumoEntregasRelevantes() {
    const destino = document.querySelector('#resumoEntregasRelevantes'); if (!destino) return; const itens = Object.entries(obterEntregasRelevantesCoe());
    if (!itens.length) { destino.innerHTML = '<span class="config-historico-vazio">Nenhuma entrega relevante cadastrada.</span>'; return; }
    destino.innerHTML = itens.map(function ([chave, item]) {
      return `<article class="config-agenda-item config-registro-item"><span><strong>${escaparHtml(item.titulo)}</strong><small>${rotuloStatusEntregaRelevante(item.status)} · ${formatarCompetencia(item.competencia)} · ${item.visivel !== false ? 'Exibida' : 'Oculta'}</small></span><span class="config-registro-acoes"><button type="button" data-acao="editar-entrega-relevante" data-chave="${chave}"><i class="bx bx-edit-alt"></i> Editar</button><button type="button" class="excluir" data-acao="excluir-entrega-relevante" data-chave="${chave}"><i class="bx bx-trash"></i> Excluir</button></span></article>`;
    }).join('');
  }

  function configurarEntregasRelevantesCoe() {
    const botao = document.querySelector('#salvarEntregaRelevante'); if (!botao) return;
    const seletor = document.querySelector('#entregaRelevanteSelecionada'); const titulo = document.querySelector('#entregaRelevanteTitulo');
    const categoria = document.querySelector('#entregaRelevanteCategoria'); const produto = document.querySelector('#entregaRelevanteProduto');
    const status = document.querySelector('#entregaRelevanteStatus'); const competencia = document.querySelector('#entregaRelevanteData');
    const descricao = document.querySelector('#entregaRelevanteDescricao'); const beneficio = document.querySelector('#entregaRelevanteBeneficio');
    const visivel = document.querySelector('#entregaRelevanteVisivel'); const lista = document.querySelector('#resumoEntregasRelevantes'); const feedback = document.querySelector('#feedbackEntregaRelevante');
    function atualizarOpcoes(selecionar) {
      const itens = obterEntregasRelevantesCoe(); seletor.innerHTML = Object.entries(itens).map(([chave, item]) => `<option value="${chave}">${escaparHtml(item.titulo)}</option>`).join('') + '<option value="nova">+ Novo card</option>';
      seletor.value = selecionar && (itens[selecionar] || selecionar === 'nova') ? selecionar : (Object.keys(itens)[0] || 'nova');
    }
    function preencher() {
      if (seletor.value === 'nova') { titulo.value = ''; categoria.value = ''; produto.value = ''; status.value = 'planejada'; competencia.value = ''; descricao.value = ''; beneficio.value = ''; visivel.checked = true; return; }
      const item = obterEntregasRelevantesCoe()[seletor.value]; if (!item) return;
      titulo.value = item.titulo || ''; categoria.value = item.categoria || ''; produto.value = item.produto || ''; status.value = item.status || 'planejada'; competencia.value = item.competencia || '';
      descricao.value = item.descricao || ''; beneficio.value = item.beneficio || ''; visivel.checked = item.visivel !== false;
    }
    atualizarOpcoes('scom'); renderizarResumoEntregasRelevantes(); preencher(); seletor.addEventListener('change', preencher);
    const alternar = document.querySelector('#alternarEntregasRelevantes'); if (alternar) alternar.addEventListener('click', function () {
      const aberto = lista.classList.toggle('visivel'); lista.setAttribute('aria-hidden', String(!aberto)); alternar.setAttribute('aria-expanded', String(aberto)); alternar.classList.toggle('ativo', aberto);
      alternar.querySelector('span').textContent = aberto ? 'Fechar gerenciamento' : 'Gerenciar cards';
    });
    lista.addEventListener('click', function (evento) {
      const acao = evento.target.closest('[data-acao]'); if (!acao) return; const chave = acao.dataset.chave; const item = obterEntregasRelevantesCoe()[chave]; if (!item) return;
      if (acao.dataset.acao === 'editar-entrega-relevante') { seletor.value = chave; preencher(); seletor.scrollIntoView({ behavior: 'smooth', block: 'center' }); return; }
      if (!window.confirm(`Excluir a entrega “${item.titulo}”?`)) return;
      const dados = lerDados(); dados.coeEntregasRelevantes = dados.coeEntregasRelevantes || {}; delete dados.coeEntregasRelevantes[chave]; dados.coeEntregasRelevantesExcluidas = Array.isArray(dados.coeEntregasRelevantesExcluidas) ? dados.coeEntregasRelevantesExcluidas : [];
      if (!dados.coeEntregasRelevantesExcluidas.includes(chave)) dados.coeEntregasRelevantesExcluidas.push(chave); window.localStorage.setItem(CHAVE, JSON.stringify(dados)); atualizarOpcoes(); preencher(); renderizarResumoEntregasRelevantes();
      feedback.textContent = `“${item.titulo}” excluída.`; feedback.classList.remove('erro'); feedback.classList.add('visivel');
    });
    botao.addEventListener('click', function () {
      if (!titulo.value.trim() || !categoria.value.trim() || !produto.value.trim() || !descricao.value.trim()) { feedback.textContent = 'Informe título, área ou categoria, produto ou iniciativa e descrição.'; feedback.classList.add('visivel', 'erro'); return; }
      const dados = lerDados(); dados.coeEntregasRelevantes = dados.coeEntregasRelevantes || {}; const chave = seletor.value === 'nova' ? `entrega_${Date.now()}` : seletor.value;
      dados.coeEntregasRelevantes[chave] = { titulo: titulo.value.trim(), categoria: categoria.value.trim(), produto: produto.value.trim(), status: status.value, competencia: competencia.value, descricao: descricao.value.trim(), beneficio: beneficio.value.trim(), visivel: visivel.checked, atualizadoEm: new Date().toISOString() };
      dados.coeEntregasRelevantesExcluidas = (Array.isArray(dados.coeEntregasRelevantesExcluidas) ? dados.coeEntregasRelevantesExcluidas : []).filter(item => item !== chave); window.localStorage.setItem(CHAVE, JSON.stringify(dados));
      atualizarOpcoes(chave); preencher(); renderizarResumoEntregasRelevantes(); feedback.textContent = `“${titulo.value}” salva e ${visivel.checked ? 'publicada' : 'mantida oculta'}.`; feedback.classList.remove('erro'); feedback.classList.add('visivel');
    });
  }

  function obterPocs() {
    const dados = lerDados(); const excluidas = new Set(Array.isArray(dados.coePocsExcluidas) ? dados.coePocsExcluidas : []);
    return Object.fromEntries(Object.entries(Object.assign({}, POCS_BASE, dados.coePocs || {})).filter(([chave]) => !excluidas.has(chave)));
  }

  function rotuloStatusPoc(status) {
    return { planejada: 'Planejada', andamento: 'Em andamento', pausa: 'Em pausa', concluida: 'Concluída', encerrada: 'Encerrada' }[status] || status;
  }

  function renderizarResumoPocs() {
    const destino = document.querySelector('#resumoPocs'); if (!destino) return; const itens = Object.entries(obterPocs());
    if (!itens.length) { destino.innerHTML = '<span class="config-historico-vazio">Nenhuma POC cadastrada.</span>'; return; }
    destino.innerHTML = itens.map(function ([chave, item]) {
      return `<article class="config-agenda-item config-registro-item"><span><strong>${escaparHtml(item.nome)}</strong><small>${rotuloStatusPoc(item.status)} · ${escaparHtml(item.previsao || 'A definir')} · ${item.visivel !== false ? 'Exibida' : 'Oculta'}</small></span><span class="config-registro-acoes"><button type="button" data-acao="editar-poc" data-chave="${chave}"><i class="bx bx-edit-alt"></i> Editar</button><button type="button" class="excluir" data-acao="excluir-poc" data-chave="${chave}"><i class="bx bx-trash"></i> Excluir</button></span></article>`;
    }).join('');
  }

  function configurarPocs() {
    const botao = document.querySelector('#salvarPoc'); if (!botao) return;
    const seletor = document.querySelector('#pocSelecionada'); const nome = document.querySelector('#pocNome'); const status = document.querySelector('#pocStatus');
    const previsao = document.querySelector('#pocPrevisao'); const observacao = document.querySelector('#pocObservacao'); const visivel = document.querySelector('#pocVisivel');
    const lista = document.querySelector('#resumoPocs'); const feedback = document.querySelector('#feedbackPoc');
    function atualizarOpcoes(selecionar) {
      const itens = obterPocs(); seletor.innerHTML = Object.entries(itens).map(([chave, item]) => `<option value="${chave}">${escaparHtml(item.nome)}</option>`).join('') + '<option value="nova">+ Nova POC</option>';
      seletor.value = selecionar && (itens[selecionar] || selecionar === 'nova') ? selecionar : (Object.keys(itens)[0] || 'nova');
    }
    function preencher() {
      if (seletor.value === 'nova') { nome.value = ''; status.value = 'planejada'; previsao.value = 'A definir'; observacao.value = ''; visivel.checked = true; return; }
      const item = obterPocs()[seletor.value]; if (!item) return; nome.value = item.nome || ''; status.value = item.status || 'planejada'; previsao.value = item.previsao || 'A definir'; observacao.value = item.observacao || ''; visivel.checked = item.visivel !== false;
    }
    atualizarOpcoes('pacemaker'); renderizarResumoPocs(); preencher(); seletor.addEventListener('change', preencher);
    const alternar = document.querySelector('#alternarPocs'); if (alternar) alternar.addEventListener('click', function () {
      const aberto = lista.classList.toggle('visivel'); lista.setAttribute('aria-hidden', String(!aberto)); alternar.setAttribute('aria-expanded', String(aberto)); alternar.classList.toggle('ativo', aberto);
      alternar.querySelector('span').textContent = aberto ? 'Fechar gerenciamento' : 'Gerenciar POCs';
    });
    lista.addEventListener('click', function (evento) {
      const acao = evento.target.closest('[data-acao]'); if (!acao) return; const chave = acao.dataset.chave; const item = obterPocs()[chave]; if (!item) return;
      if (acao.dataset.acao === 'editar-poc') { seletor.value = chave; preencher(); seletor.scrollIntoView({ behavior: 'smooth', block: 'center' }); return; }
      if (!window.confirm(`Excluir a POC “${item.nome}”?`)) return;
      const dados = lerDados(); dados.coePocs = dados.coePocs || {}; delete dados.coePocs[chave]; dados.coePocsExcluidas = Array.isArray(dados.coePocsExcluidas) ? dados.coePocsExcluidas : [];
      if (!dados.coePocsExcluidas.includes(chave)) dados.coePocsExcluidas.push(chave); window.localStorage.setItem(CHAVE, JSON.stringify(dados)); atualizarOpcoes(); preencher(); renderizarResumoPocs();
      feedback.textContent = `POC “${item.nome}” excluída.`; feedback.classList.remove('erro'); feedback.classList.add('visivel');
    });
    botao.addEventListener('click', function () {
      if (!nome.value.trim() || !observacao.value.trim()) { feedback.textContent = 'Informe o nome e as observações da POC.'; feedback.classList.add('visivel', 'erro'); return; }
      const dados = lerDados(); dados.coePocs = dados.coePocs || {}; const chave = seletor.value === 'nova' ? `poc_${Date.now()}` : seletor.value;
      dados.coePocs[chave] = { nome: nome.value.trim(), status: status.value, previsao: previsao.value.trim() || 'A definir', observacao: observacao.value.trim(), visivel: visivel.checked, atualizadoEm: new Date().toISOString() };
      dados.coePocsExcluidas = (Array.isArray(dados.coePocsExcluidas) ? dados.coePocsExcluidas : []).filter(item => item !== chave); window.localStorage.setItem(CHAVE, JSON.stringify(dados));
      atualizarOpcoes(chave); preencher(); renderizarResumoPocs(); feedback.textContent = `POC “${nome.value}” salva e ${visivel.checked ? 'publicada' : 'mantida oculta'}.`; feedback.classList.remove('erro'); feedback.classList.add('visivel');
    });
  }

  function obterEvolucaoAutomacoes() {
    const dados = lerDados(); const excluidas = new Set(Array.isArray(dados.coeAutomacoesEvolucaoExcluidas) ? dados.coeAutomacoesEvolucaoExcluidas : []);
    return Object.entries(Object.assign({}, AUTOMACOES_EVOLUCAO_BASE, dados.coeAutomacoesEvolucao || {})).filter(([chave]) => !excluidas.has(chave)).sort(([, a], [, b]) => String(a.competencia).localeCompare(String(b.competencia)));
  }

  function renderizarResumoEvolucaoAutomacoes() {
    const destino = document.querySelector('#resumoEvolucaoAutomacoes'); if (!destino) return; const itens = obterEvolucaoAutomacoes();
    if (!itens.length) { destino.innerHTML = '<span class="config-historico-vazio">Nenhuma competência cadastrada.</span>'; return; }
    destino.innerHTML = itens.map(function ([chave, item]) {
      return `<span class="config-historico-item config-registro-item"><span><strong>${formatarCompetencia(item.competencia)}</strong><small>${Number(item.publicadas).toLocaleString('pt-BR')} automações publicadas</small></span><span class="config-registro-acoes"><button type="button" data-acao="editar-evolucao-automacoes" data-chave="${chave}"><i class="bx bx-edit-alt"></i> Editar</button><button type="button" class="excluir" data-acao="excluir-evolucao-automacoes" data-chave="${chave}"><i class="bx bx-trash"></i> Excluir</button></span></span>`;
    }).join('');
  }

  function configurarEvolucaoAutomacoes() {
    const botao = document.querySelector('#salvarEvolucaoAutomacoes'); if (!botao) return;
    const competencia = document.querySelector('#automacaoCompetencia'); const publicadas = document.querySelector('#automacaoPublicadas'); const proxima = document.querySelector('#automacaoProximaJanela');
    const lista = document.querySelector('#resumoEvolucaoAutomacoes'); const feedback = document.querySelector('#feedbackEvolucaoAutomacoes'); renderizarResumoEvolucaoAutomacoes();
    const alternar = document.querySelector('#alternarEvolucaoAutomacoes'); if (alternar) alternar.addEventListener('click', function () { const aberto = lista.classList.toggle('visivel'); lista.setAttribute('aria-hidden', String(!aberto)); alternar.setAttribute('aria-expanded', String(aberto)); alternar.classList.toggle('ativo', aberto); alternar.querySelector('span').textContent = aberto ? 'Fechar gerenciamento' : 'Gerenciar dados'; });
    lista.addEventListener('click', function (evento) {
      const acao = evento.target.closest('[data-acao]'); if (!acao) return; const chave = acao.dataset.chave; const item = Object.fromEntries(obterEvolucaoAutomacoes())[chave]; if (!item) return;
      if (acao.dataset.acao === 'editar-evolucao-automacoes') { competencia.value = item.competencia; publicadas.value = item.publicadas; proxima.value = item.proximaJanela || ''; botao.dataset.chaveEdicao = chave; botao.innerHTML = '<i class="bx bx-save"></i> Salvar alterações'; competencia.scrollIntoView({ behavior: 'smooth', block: 'center' }); return; }
      if (!window.confirm(`Excluir os dados de ${formatarCompetencia(item.competencia)}?`)) return;
      const dados = lerDados(); dados.coeAutomacoesEvolucao = dados.coeAutomacoesEvolucao || {}; delete dados.coeAutomacoesEvolucao[chave]; dados.coeAutomacoesEvolucaoExcluidas = Array.isArray(dados.coeAutomacoesEvolucaoExcluidas) ? dados.coeAutomacoesEvolucaoExcluidas : []; if (!dados.coeAutomacoesEvolucaoExcluidas.includes(chave)) dados.coeAutomacoesEvolucaoExcluidas.push(chave);
      window.localStorage.setItem(CHAVE, JSON.stringify(dados)); delete botao.dataset.chaveEdicao; botao.innerHTML = '<i class="bx bx-plus"></i> Salvar competência'; renderizarResumoEvolucaoAutomacoes(); feedback.textContent = `${formatarCompetencia(item.competencia)} excluída.`; feedback.classList.remove('erro'); feedback.classList.add('visivel');
    });
    botao.addEventListener('click', function () {
      const quantidade = Number(publicadas.value); if (!competencia.value || publicadas.value === '' || quantidade < 0 || !Number.isFinite(quantidade)) { feedback.textContent = 'Informe competência e quantidade publicada.'; feedback.classList.add('visivel', 'erro'); return; }
      const chaveNova = competencia.value; const chaveAnterior = botao.dataset.chaveEdicao; const dados = lerDados(); dados.coeAutomacoesEvolucao = dados.coeAutomacoesEvolucao || {};
      if (chaveAnterior && chaveAnterior !== chaveNova) { delete dados.coeAutomacoesEvolucao[chaveAnterior]; dados.coeAutomacoesEvolucaoExcluidas = Array.isArray(dados.coeAutomacoesEvolucaoExcluidas) ? dados.coeAutomacoesEvolucaoExcluidas : []; if (!dados.coeAutomacoesEvolucaoExcluidas.includes(chaveAnterior)) dados.coeAutomacoesEvolucaoExcluidas.push(chaveAnterior); }
      dados.coeAutomacoesEvolucao[chaveNova] = { competencia: chaveNova, publicadas: Math.round(quantidade), proximaJanela: proxima.value.trim(), atualizadoEm: new Date().toISOString() };
      dados.coeAutomacoesEvolucaoExcluidas = (Array.isArray(dados.coeAutomacoesEvolucaoExcluidas) ? dados.coeAutomacoesEvolucaoExcluidas : []).filter(item => item !== chaveNova); window.localStorage.setItem(CHAVE, JSON.stringify(dados));
      delete botao.dataset.chaveEdicao; botao.innerHTML = '<i class="bx bx-plus"></i> Salvar competência'; renderizarResumoEvolucaoAutomacoes(); feedback.textContent = `${formatarCompetencia(chaveNova)} salva.`; feedback.classList.remove('erro'); feedback.classList.add('visivel');
    });
  }

  function obterAutomacoesEntregues() {
    const dados = lerDados(); const excluidas = new Set(Array.isArray(dados.coeAutomacoesEntreguesExcluidas) ? dados.coeAutomacoesEntreguesExcluidas : []);
    return Object.fromEntries(Object.entries(dados.coeAutomacoesEntregues || {}).filter(([chave]) => !excluidas.has(chave)));
  }

  function renderizarResumoAutomacoesEntregues() {
    const destino = document.querySelector('#resumoAutomacoesEntregues'); if (!destino) return; const itens = Object.entries(obterAutomacoesEntregues());
    if (!itens.length) { destino.innerHTML = '<span class="config-historico-vazio">Nenhuma automação entregue cadastrada.</span>'; return; }
    destino.innerHTML = itens.map(function ([chave, item]) { return `<article class="config-agenda-item config-registro-item"><span><strong>${escaparHtml(item.titulo)}</strong><small>${item.data ? formatarDataCurta(item.data) : 'Sem data'} · ${item.visivel !== false ? 'Exibida' : 'Oculta'}</small></span><span class="config-registro-acoes"><button type="button" data-acao="editar-automacao-entrega" data-chave="${chave}"><i class="bx bx-edit-alt"></i> Editar</button><button type="button" class="excluir" data-acao="excluir-automacao-entrega" data-chave="${chave}"><i class="bx bx-trash"></i> Excluir</button></span></article>`; }).join('');
  }

  function configurarAutomacoesEntregues() {
    const botao = document.querySelector('#salvarAutomacaoEntrega'); if (!botao) return;
    const seletor = document.querySelector('#automacaoEntregaSelecionada'); const titulo = document.querySelector('#automacaoEntregaTitulo'); const data = document.querySelector('#automacaoEntregaData');
    const ganho = document.querySelector('#automacaoEntregaGanho'); const descricao = document.querySelector('#automacaoEntregaDescricao'); const visivel = document.querySelector('#automacaoEntregaVisivel');
    const lista = document.querySelector('#resumoAutomacoesEntregues'); const feedback = document.querySelector('#feedbackAutomacaoEntrega');
    function atualizarOpcoes(selecionar) { const itens = obterAutomacoesEntregues(); seletor.innerHTML = Object.entries(itens).map(([chave, item]) => `<option value="${chave}">${escaparHtml(item.titulo)}</option>`).join('') + '<option value="nova">+ Nova automação</option>'; seletor.value = selecionar && (itens[selecionar] || selecionar === 'nova') ? selecionar : (Object.keys(itens)[0] || 'nova'); }
    function preencher() { if (seletor.value === 'nova') { titulo.value = ''; data.value = ''; ganho.value = ''; descricao.value = ''; visivel.checked = true; return; } const item = obterAutomacoesEntregues()[seletor.value]; if (!item) return; titulo.value = item.titulo || ''; data.value = item.data || ''; ganho.value = item.ganho || ''; descricao.value = item.descricao || ''; visivel.checked = item.visivel !== false; }
    atualizarOpcoes(); renderizarResumoAutomacoesEntregues(); preencher(); seletor.addEventListener('change', preencher);
    const alternar = document.querySelector('#alternarAutomacoesEntregues'); if (alternar) alternar.addEventListener('click', function () { const aberto = lista.classList.toggle('visivel'); lista.setAttribute('aria-hidden', String(!aberto)); alternar.setAttribute('aria-expanded', String(aberto)); alternar.classList.toggle('ativo', aberto); alternar.querySelector('span').textContent = aberto ? 'Fechar gerenciamento' : 'Gerenciar entregas'; });
    lista.addEventListener('click', function (evento) { const acao = evento.target.closest('[data-acao]'); if (!acao) return; const chave = acao.dataset.chave; const item = obterAutomacoesEntregues()[chave]; if (!item) return; if (acao.dataset.acao === 'editar-automacao-entrega') { seletor.value = chave; preencher(); seletor.scrollIntoView({ behavior: 'smooth', block: 'center' }); return; } if (!window.confirm(`Excluir a automação “${item.titulo}”?`)) return; const dados = lerDados(); dados.coeAutomacoesEntregues = dados.coeAutomacoesEntregues || {}; delete dados.coeAutomacoesEntregues[chave]; dados.coeAutomacoesEntreguesExcluidas = Array.isArray(dados.coeAutomacoesEntreguesExcluidas) ? dados.coeAutomacoesEntreguesExcluidas : []; if (!dados.coeAutomacoesEntreguesExcluidas.includes(chave)) dados.coeAutomacoesEntreguesExcluidas.push(chave); window.localStorage.setItem(CHAVE, JSON.stringify(dados)); atualizarOpcoes(); preencher(); renderizarResumoAutomacoesEntregues(); feedback.textContent = `“${item.titulo}” excluída.`; feedback.classList.remove('erro'); feedback.classList.add('visivel'); });
    botao.addEventListener('click', function () { if (!titulo.value.trim() || !data.value || !ganho.value.trim() || !descricao.value.trim()) { feedback.textContent = 'Informe título, data, ganho obtido e descrição breve.'; feedback.classList.add('visivel', 'erro'); return; } const dados = lerDados(); dados.coeAutomacoesEntregues = dados.coeAutomacoesEntregues || {}; const chave = seletor.value === 'nova' ? `automacao_${Date.now()}` : seletor.value; dados.coeAutomacoesEntregues[chave] = { titulo: titulo.value.trim(), data: data.value, ganho: ganho.value.trim(), descricao: descricao.value.trim(), visivel: visivel.checked, atualizadoEm: new Date().toISOString() }; dados.coeAutomacoesEntreguesExcluidas = (Array.isArray(dados.coeAutomacoesEntreguesExcluidas) ? dados.coeAutomacoesEntreguesExcluidas : []).filter(item => item !== chave); window.localStorage.setItem(CHAVE, JSON.stringify(dados)); atualizarOpcoes(chave); preencher(); renderizarResumoAutomacoesEntregues(); feedback.textContent = `“${titulo.value}” salva e ${visivel.checked ? 'publicada' : 'mantida oculta'}.`; feedback.classList.remove('erro'); feedback.classList.add('visivel'); });
  }

  function obterHistoricoDisponibilidade() {
    const dados = lerDados();
    return Array.isArray(dados.operacoesDisponibilidade) ? dados.operacoesDisponibilidade : [];
  }

  function renderizarHistoricoDisponibilidade() {
    const destino = document.querySelector('#historicoDisponibilidade');
    if (!destino) return;
    const historico = obterHistoricoDisponibilidade();
    if (!historico.length) {
      destino.innerHTML = '<span class="config-historico-vazio">Próximo registro previsto: Setembro.</span>';
      return;
    }
    destino.innerHTML = historico.map(function (item, indice) {
      return `<span class="config-historico-item config-registro-item"><span><strong>${item.mes}/${item.ano || 2026}</strong><small>${item.incidentes} incidentes · ${minutosParaTexto(item.impacto)} · ${Number(item.disponibilidade).toFixed(2).replace('.', ',')}%</small></span><span class="config-registro-acoes"><button type="button" data-acao="editar-disponibilidade" data-indice="${indice}"><i class="bx bx-edit-alt"></i> Editar</button><button type="button" class="excluir" data-acao="excluir-disponibilidade" data-indice="${indice}"><i class="bx bx-trash"></i> Excluir</button></span></span>`;
    }).join('');
  }

  function configurarDisponibilidade() {
    const botao = document.querySelector('#adicionarDisponibilidade');
    if (!botao) return;
    renderizarHistoricoDisponibilidade();
    const lista = document.querySelector('#historicoDisponibilidade');
    lista.addEventListener('click', function (evento) {
      const acao = evento.target.closest('[data-acao]'); if (!acao) return;
      const indice = Number(acao.dataset.indice); const historico = obterHistoricoDisponibilidade(); const item = historico[indice]; if (!item) return;
      if (acao.dataset.acao === 'editar-disponibilidade') {
        document.querySelector('#dispMes').value = item.mes; document.querySelector('#dispAno').value = item.ano || 2026;
        document.querySelector('#dispIncidentes').value = item.incidentes; document.querySelector('#dispImpacto').value = minutosParaTexto(item.impacto);
        document.querySelector('#dispDisponibilidade').value = item.disponibilidade; botao.dataset.indiceEdicao = String(indice);
        botao.innerHTML = '<i class="bx bx-save"></i> Salvar alterações';
      } else if (window.confirm(`Excluir o registro ${item.mes}/${item.ano || 2026}?`)) {
        historico.splice(indice, 1); const dados = lerDados(); dados.operacoesDisponibilidade = historico; window.localStorage.setItem(CHAVE, JSON.stringify(dados));
        delete botao.dataset.indiceEdicao; botao.innerHTML = '<i class="bx bx-plus"></i> Adicionar mês'; renderizarHistoricoDisponibilidade();
      }
    });
    botao.addEventListener('click', function () {
      const mes = document.querySelector('#dispMes').value;
      const ano = Number(document.querySelector('#dispAno').value);
      const incidentesBruto = document.querySelector('#dispIncidentes').value;
      const disponibilidadeBruta = document.querySelector('#dispDisponibilidade').value;
      const incidentes = Number(incidentesBruto);
      const impacto = impactoParaMinutos(document.querySelector('#dispImpacto').value);
      const disponibilidade = Number(String(disponibilidadeBruta).replace(',', '.'));
      const feedback = document.querySelector('#feedbackDisponibilidade');
      if (!mes || !Number.isInteger(ano) || ano < 2026 || ano > 2100 || incidentesBruto === '' || disponibilidadeBruta === '' || !Number.isFinite(incidentes) || incidentes < 0 || !Number.isFinite(impacto) || impacto < 0 || !Number.isFinite(disponibilidade) || disponibilidade < 0 || disponibilidade > 100) {
        feedback.textContent = 'Preencha corretamente os cinco campos da disponibilidade.';
        feedback.classList.add('visivel', 'erro');
        return;
      }
      const dados = lerDados();
      const historico = Array.isArray(dados.operacoesDisponibilidade) ? dados.operacoesDisponibilidade : [];
      const registro = { mes, ano, incidentes: Math.round(incidentes), impacto, disponibilidade, atualizadoEm: new Date().toISOString() };
      const indiceEdicao = botao.dataset.indiceEdicao === undefined ? -1 : Number(botao.dataset.indiceEdicao);
      if (indiceEdicao >= 0 && historico[indiceEdicao]) historico[indiceEdicao] = registro; else historico.push(registro);
      dados.operacoesDisponibilidade = historico;
      window.localStorage.setItem(CHAVE, JSON.stringify(dados));
      feedback.textContent = `${mes}/${ano} ${indiceEdicao >= 0 ? 'atualizado' : 'adicionado'}. Os gráficos e cards serão atualizados no relatório de Operações.`;
      feedback.classList.remove('erro');
      feedback.classList.add('visivel');
      renderizarHistoricoDisponibilidade();
      document.querySelector('#dispIncidentes').value = '';
      document.querySelector('#dispImpacto').value = '';
      document.querySelector('#dispDisponibilidade').value = '';
      delete botao.dataset.indiceEdicao; botao.innerHTML = '<i class="bx bx-plus"></i> Adicionar mês';
    });
  }

  function formatarDataCurta(dataIso) {
    const partes = String(dataIso || '').split('-');
    return partes.length === 3 ? `${partes[2]}/${partes[1]}/${partes[0]}` : dataIso;
  }

  function obterHistoricoEvolucaoSemanal() {
    const dados = lerDados();
    return Array.isArray(dados.operacoesEvolucaoSemanal) ? dados.operacoesEvolucaoSemanal : [];
  }

  function renderizarHistoricoEvolucaoSemanal() {
    const destino = document.querySelector('#historicoEvolucaoSemanal');
    if (!destino) return;
    const historico = obterHistoricoEvolucaoSemanal();
    if (!historico.length) {
      destino.innerHTML = '<span class="config-historico-vazio">Nenhum registro diário adicional.</span>';
      return;
    }
    destino.innerHTML = historico.map(function (item, indice) {
      return `<span class="config-historico-item config-registro-item"><span><strong>${formatarDataCurta(item.data)}</strong><small>${item.incidentes} incidentes · ${item.alertasPrd} alertas PRD · ${item.alertasQa} alertas QA</small></span><span class="config-registro-acoes"><button type="button" data-acao="editar-evolucao" data-indice="${indice}"><i class="bx bx-edit-alt"></i> Editar</button><button type="button" class="excluir" data-acao="excluir-evolucao" data-indice="${indice}"><i class="bx bx-trash"></i> Excluir</button></span></span>`;
    }).join('');
  }

  function configurarEvolucaoSemanal() {
    const botao = document.querySelector('#adicionarEvolucaoSemanal');
    if (!botao) return;
    const campos = {
      incidentes: '#evolucaoIncidentes', ritms: '#evolucaoRitms', prbs: '#evolucaoPrbs',
      ptask: '#evolucaoPtask', alertasQa: '#evolucaoAlertasQa', alertasPrd: '#evolucaoAlertasPrd',
      incHw: '#evolucaoIncHw', america: '#evolucaoAmerica'
    };
    renderizarHistoricoEvolucaoSemanal();
    const lista = document.querySelector('#historicoEvolucaoSemanal');
    lista.addEventListener('click', function (evento) {
      const acao = evento.target.closest('[data-acao]'); if (!acao) return;
      const indice = Number(acao.dataset.indice); const historico = obterHistoricoEvolucaoSemanal(); const item = historico[indice]; if (!item) return;
      if (acao.dataset.acao === 'editar-evolucao') {
        document.querySelector('#evolucaoData').value = item.data;
        Object.entries(campos).forEach(function ([nome, seletor]) { document.querySelector(seletor).value = item[nome]; });
        botao.dataset.indiceEdicao = String(indice); botao.innerHTML = '<i class="bx bx-save"></i> Salvar alterações';
      } else if (window.confirm(`Excluir o registro de ${formatarDataCurta(item.data)}?`)) {
        historico.splice(indice, 1); const dados = lerDados(); dados.operacoesEvolucaoSemanal = historico; window.localStorage.setItem(CHAVE, JSON.stringify(dados));
        delete botao.dataset.indiceEdicao; botao.innerHTML = '<i class="bx bx-plus"></i> Adicionar registro'; renderizarHistoricoEvolucaoSemanal();
      }
    });
    botao.addEventListener('click', function () {
      const data = document.querySelector('#evolucaoData').value;
      const registro = { data };
      let valido = Boolean(data);
      Object.entries(campos).forEach(function ([nome, seletor]) {
        const elemento = document.querySelector(seletor);
        const valor = elemento.value;
        registro[nome] = Number(valor);
        if (valor === '' || !Number.isFinite(registro[nome]) || registro[nome] < 0) valido = false;
      });
      const feedback = document.querySelector('#feedbackEvolucaoSemanal');
      if (!valido) {
        feedback.textContent = 'Preencha a data e os oito indicadores com valores válidos.';
        feedback.classList.add('visivel', 'erro');
        return;
      }
      Object.keys(campos).forEach(function (nome) { registro[nome] = Math.round(registro[nome]); });
      const dados = lerDados();
      const historico = Array.isArray(dados.operacoesEvolucaoSemanal) ? dados.operacoesEvolucaoSemanal : [];
      registro.atualizadoEm = new Date().toISOString();
      const indiceEdicao = botao.dataset.indiceEdicao === undefined ? -1 : Number(botao.dataset.indiceEdicao);
      if (indiceEdicao >= 0 && historico[indiceEdicao]) historico[indiceEdicao] = registro; else historico.push(registro);
      dados.operacoesEvolucaoSemanal = historico;
      window.localStorage.setItem(CHAVE, JSON.stringify(dados));
      feedback.textContent = `${formatarDataCurta(data)} ${indiceEdicao >= 0 ? 'atualizado' : 'adicionado'} na Evolução Semanal da Operação.`;
      feedback.classList.remove('erro');
      feedback.classList.add('visivel');
      renderizarHistoricoEvolucaoSemanal();
      Object.values(campos).forEach(function (seletor) { document.querySelector(seletor).value = ''; });
      delete botao.dataset.indiceEdicao; botao.innerHTML = '<i class="bx bx-plus"></i> Adicionar registro';
    });
  }

  function obterAgendasFornecedores() {
    const dados = lerDados();
    const salvos = dados.operacoesFornecedores || {};
    return Object.fromEntries(Object.entries(FORNECEDORES_BASE).map(function ([chave, base]) {
      return [chave, Object.assign({}, base, salvos[chave] || {})];
    }));
  }

  function renderizarAgendasFornecedores() {
    const destino = document.querySelector('#resumoAgendaFornecedores');
    if (!destino) return;
    const agendas = obterAgendasFornecedores();
    destino.innerHTML = Object.entries(agendas).map(function ([chave, item]) {
      const quando = item.data
        ? `${formatarDataCurta(item.data)}${item.hora ? ` · ${item.hora}` : ''}`
        : 'Data pendente';
      const rotulos = { confirmado: 'Confirmada', pendente: 'Pendente', cancelado: 'Cancelada' };
      return `<article class="config-agenda-item" data-agenda="${chave}"><div><strong>${item.nome}</strong><small>${quando}</small></div><span class="config-agenda-status ${item.status}">${rotulos[item.status] || item.status}</span><span class="config-registro-acoes"><button type="button" data-acao="editar-agenda" data-chave="${chave}"><i class="bx bx-edit-alt"></i> Editar</button><button type="button" class="excluir" data-acao="limpar-agenda" data-chave="${chave}"><i class="bx bx-eraser"></i> Limpar</button></span></article>`;
    }).join('');
  }

  function renderizarHistoricoAgendaFornecedores() {
    const destino = document.querySelector('#historicoAgendaFornecedores');
    if (!destino) return;
    const dados = lerDados();
    const historico = Array.isArray(dados.operacoesFornecedoresHistorico)
      ? dados.operacoesFornecedoresHistorico.slice().reverse()
      : [];
    if (!historico.length) {
      destino.innerHTML = '<span class="config-historico-vazio">O histórico será criado a partir da próxima atualização.</span>';
      return;
    }
    const rotulos = { confirmado: 'Confirmada', pendente: 'Pendente', cancelado: 'Cancelada' };
    destino.innerHTML = historico.map(function (item) {
      const agenda = item.data ? `${formatarDataCurta(item.data)}${item.hora ? ` · ${item.hora}` : ''}` : 'Sem data definida';
      const atualizado = item.atualizadoEm ? new Date(item.atualizadoEm).toLocaleDateString('pt-BR') : '—';
      const nota = escaparHtml(item.observacao || 'Sem observação');
      return `<article class="config-agenda-historico-item"><strong>${item.nome}</strong><span>${agenda}</span><em title="${nota}">${nota}</em><small>${rotulos[item.status] || item.status} · ${atualizado}</small></article>`;
    }).join('');
  }

  function configurarAgendaFornecedores() {
    const botao = document.querySelector('#salvarAgendaFornecedor');
    const fornecedor = document.querySelector('#agendaFornecedor');
    if (!botao || !fornecedor) return;
    const status = document.querySelector('#agendaStatus');
    const data = document.querySelector('#agendaData');
    const hora = document.querySelector('#agendaHora');
    const observacao = document.querySelector('#agendaObservacao');
    const botaoHistorico = document.querySelector('#alternarHistoricoFornecedores');
    function preencherAgendaSelecionada() {
      const item = obterAgendasFornecedores()[fornecedor.value];
      status.value = item.status;
      data.value = item.data || '';
      hora.value = item.hora || '';
      observacao.value = item.observacao || '';
    }
    renderizarAgendasFornecedores();
    renderizarHistoricoAgendaFornecedores();
    document.querySelector('#resumoAgendaFornecedores').addEventListener('click', function (evento) {
      const acao = evento.target.closest('[data-acao]'); if (!acao) return;
      fornecedor.value = acao.dataset.chave; preencherAgendaSelecionada();
      if (acao.dataset.acao === 'editar-agenda') { fornecedor.scrollIntoView({ behavior: 'smooth', block: 'center' }); return; }
      const item = obterAgendasFornecedores()[fornecedor.value];
      if (!window.confirm(`Limpar a agenda atual de ${item.nome}?`)) return;
      const dados = lerDados(); dados.operacoesFornecedores = dados.operacoesFornecedores || {};
      const registro = { status: 'pendente', data: '', hora: '', observacao: '', atualizadoEm: new Date().toISOString() };
      dados.operacoesFornecedores[fornecedor.value] = registro; dados.operacoesFornecedoresHistorico = Array.isArray(dados.operacoesFornecedoresHistorico) ? dados.operacoesFornecedoresHistorico : [];
      dados.operacoesFornecedoresHistorico.push(Object.assign({ fornecedor: fornecedor.value, nome: item.nome, acao: 'limpeza' }, registro)); window.localStorage.setItem(CHAVE, JSON.stringify(dados));
      preencherAgendaSelecionada(); renderizarAgendasFornecedores(); renderizarHistoricoAgendaFornecedores();
    });
    if (botaoHistorico) {
      botaoHistorico.addEventListener('click', function () {
        const historico = document.querySelector('#historicoAgendaFornecedores');
        const visivel = historico.classList.toggle('visivel');
        historico.setAttribute('aria-hidden', String(!visivel));
        botaoHistorico.setAttribute('aria-expanded', String(visivel));
        botaoHistorico.classList.toggle('ativo', visivel);
        botaoHistorico.querySelector('span').textContent = visivel ? 'Ocultar histórico' : 'Consultar histórico';
      });
    }
    preencherAgendaSelecionada();
    fornecedor.addEventListener('change', preencherAgendaSelecionada);
    botao.addEventListener('click', function () {
      const feedback = document.querySelector('#feedbackAgendaFornecedor');
      if (status.value === 'confirmado' && (!data.value || !hora.value)) {
        feedback.textContent = 'Informe data e horário para confirmar a reunião.';
        feedback.classList.add('visivel', 'erro');
        return;
      }
      const dados = lerDados();
      dados.operacoesFornecedores = dados.operacoesFornecedores || {};
      const atualizadoEm = new Date().toISOString();
      const registro = {
        status: status.value,
        data: status.value === 'pendente' ? '' : data.value,
        hora: status.value === 'pendente' ? '' : hora.value,
        observacao: observacao.value.trim(),
        atualizadoEm
      };
      dados.operacoesFornecedores[fornecedor.value] = registro;
      dados.operacoesFornecedoresHistorico = Array.isArray(dados.operacoesFornecedoresHistorico)
        ? dados.operacoesFornecedoresHistorico
        : [];
      dados.operacoesFornecedoresHistorico.push(Object.assign({
        fornecedor: fornecedor.value,
        nome: FORNECEDORES_BASE[fornecedor.value].nome
      }, registro));
      window.localStorage.setItem(CHAVE, JSON.stringify(dados));
      feedback.textContent = `Agenda de ${FORNECEDORES_BASE[fornecedor.value].nome} atualizada.`;
      feedback.classList.remove('erro');
      feedback.classList.add('visivel');
      renderizarAgendasFornecedores();
      renderizarHistoricoAgendaFornecedores();
    });
  }

  function abrirSecaoSolicitada() {
    const parametros = new URLSearchParams(window.location.search);
    if (parametros.get('tab') !== 'operacoes') return;
    const aba = document.querySelector('[data-bs-target="#config-operacoes"]');
    if (aba) aba.click();
    if (window.location.hash) {
      window.setTimeout(function () {
        const destino = document.querySelector(window.location.hash);
        if (destino) destino.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 180);
    }
  }

  function obterIniciativas() {
    const dados = lerDados();
    const salvas = dados.operacoesIniciativas || {};
    const excluidas = new Set(Array.isArray(dados.operacoesIniciativasExcluidas) ? dados.operacoesIniciativasExcluidas : []);
    const iniciativas = Object.fromEntries(Object.entries(INICIATIVAS_BASE).map(function ([chave, base]) {
      return [chave, Object.assign({}, base, salvas[chave] || {})];
    }).filter(([chave]) => !excluidas.has(chave)));
    Object.entries(salvas).forEach(function ([chave, item]) {
      if (!iniciativas[chave] && !excluidas.has(chave)) iniciativas[chave] = Object.assign({}, item);
    });
    return iniciativas;
  }

  function rotuloStatusIniciativa(status) {
    return { planejada: 'Planejada', andamento: 'Em andamento', pausada: 'Pausada', concluida: 'Concluída', arquivada: 'Arquivada' }[status] || status;
  }

  function atualizarOpcoesIniciativas(selecionada) {
    const seletor = document.querySelector('#iniciativaSelecionada');
    if (!seletor) return;
    seletor.innerHTML = Object.entries(obterIniciativas()).map(function ([chave, item]) {
      return `<option value="${chave}">${escaparHtml(item.titulo)}</option>`;
    }).join('') + '<option value="nova">+ Nova iniciativa</option>';
    seletor.value = selecionada && seletor.querySelector(`option[value="${selecionada}"]`) ? selecionada : (Object.keys(obterIniciativas())[0] || 'nova');
  }

  function renderizarResumoIniciativas() {
    const destino = document.querySelector('#resumoIniciativas');
    if (!destino) return;
    destino.innerHTML = Object.entries(obterIniciativas()).map(function ([chave, item]) {
      const progresso = item.progresso == null ? 'Progresso contínuo' : `${item.progresso}%`;
      return `<article class="config-agenda-item" data-iniciativa="${chave}"><div><strong>${escaparHtml(item.titulo)}</strong><small>${progresso}${item.termino ? ` · término ${formatarDataCurta(item.termino)}` : ''}</small></div><span class="config-iniciativa-status ${item.status}">${rotuloStatusIniciativa(item.status)}</span><span class="config-registro-acoes"><button type="button" data-acao="editar-iniciativa" data-chave="${chave}"><i class="bx bx-edit-alt"></i> Editar</button><button type="button" class="excluir" data-acao="excluir-iniciativa" data-chave="${chave}"><i class="bx bx-trash"></i> Excluir</button></span></article>`;
    }).join('');
  }

  function renderizarHistoricoIniciativas() {
    const destino = document.querySelector('#historicoIniciativas');
    if (!destino) return;
    const dados = lerDados();
    const historico = Array.isArray(dados.operacoesIniciativasHistorico) ? dados.operacoesIniciativasHistorico.slice().reverse() : [];
    if (!historico.length) {
      destino.innerHTML = '<span class="config-historico-vazio">O histórico será criado a partir da próxima atualização.</span>';
      return;
    }
    destino.innerHTML = historico.map(function (item) {
      const progresso = item.progresso == null ? 'Contínuo' : `${item.progresso}%`;
      const termino = item.termino ? formatarDataCurta(item.termino) : 'Sem data';
      const nota = escaparHtml(item.observacao || item.detalhe || 'Sem observação');
      const atualizado = item.atualizadoEm ? new Date(item.atualizadoEm).toLocaleDateString('pt-BR') : '—';
      return `<article class="config-agenda-historico-item"><strong>${escaparHtml(item.titulo)}</strong><span>${rotuloStatusIniciativa(item.status)} · ${progresso}</span><em title="${nota}">${nota}</em><small>${termino} · ${atualizado}</small></article>`;
    }).join('');
  }

  function configurarIniciativas() {
    const seletor = document.querySelector('#iniciativaSelecionada');
    const botao = document.querySelector('#salvarIniciativa');
    if (!seletor || !botao) return;
    const titulo = document.querySelector('#iniciativaTitulo');
    const descricao = document.querySelector('#iniciativaDescricao');
    const status = document.querySelector('#iniciativaStatus');
    const progresso = document.querySelector('#iniciativaProgresso');
    const detalhe = document.querySelector('#iniciativaDetalhe');
    const termino = document.querySelector('#iniciativaTermino');
    const observacao = document.querySelector('#iniciativaObservacao');
    const botaoHistorico = document.querySelector('#alternarHistoricoIniciativas');
    function preencher() {
      if (seletor.value === 'nova') {
        titulo.value = ''; descricao.value = ''; status.value = 'planejada'; progresso.value = '';
        detalhe.value = ''; termino.value = ''; observacao.value = '';
        return;
      }
      const item = obterIniciativas()[seletor.value];
      titulo.value = item.titulo || ''; descricao.value = item.descricao || ''; status.value = item.status || 'planejada';
      progresso.value = item.progresso == null ? '' : item.progresso; detalhe.value = item.detalhe || '';
      termino.value = item.termino || ''; observacao.value = item.observacao || '';
    }
    atualizarOpcoesIniciativas('gaus');
    renderizarResumoIniciativas(); renderizarHistoricoIniciativas(); preencher();
    document.querySelector('#resumoIniciativas').addEventListener('click', function (evento) {
      const acao = evento.target.closest('[data-acao]'); if (!acao) return;
      const chave = acao.dataset.chave; const item = obterIniciativas()[chave]; if (!item) return;
      if (acao.dataset.acao === 'editar-iniciativa') { seletor.value = chave; preencher(); seletor.scrollIntoView({ behavior: 'smooth', block: 'center' }); return; }
      if (!window.confirm(`Excluir a iniciativa “${item.titulo}”?`)) return;
      const dados = lerDados(); dados.operacoesIniciativas = dados.operacoesIniciativas || {}; delete dados.operacoesIniciativas[chave];
      dados.operacoesIniciativasExcluidas = Array.isArray(dados.operacoesIniciativasExcluidas) ? dados.operacoesIniciativasExcluidas : [];
      if (!dados.operacoesIniciativasExcluidas.includes(chave)) dados.operacoesIniciativasExcluidas.push(chave);
      dados.operacoesIniciativasHistorico = Array.isArray(dados.operacoesIniciativasHistorico) ? dados.operacoesIniciativasHistorico : [];
      dados.operacoesIniciativasHistorico.push({ iniciativa: chave, titulo: item.titulo, status: 'arquivada', progresso: item.progresso, observacao: 'Registro excluído', atualizadoEm: new Date().toISOString() });
      window.localStorage.setItem(CHAVE, JSON.stringify(dados)); atualizarOpcoesIniciativas(); renderizarResumoIniciativas(); renderizarHistoricoIniciativas(); preencher();
    });
    seletor.addEventListener('change', preencher);
    status.addEventListener('change', function () { if (status.value === 'concluida') progresso.value = '100'; });
    if (botaoHistorico) botaoHistorico.addEventListener('click', function () {
      const historico = document.querySelector('#historicoIniciativas');
      const visivel = historico.classList.toggle('visivel');
      historico.setAttribute('aria-hidden', String(!visivel)); botaoHistorico.setAttribute('aria-expanded', String(visivel));
      botaoHistorico.classList.toggle('ativo', visivel);
      botaoHistorico.querySelector('span').textContent = visivel ? 'Ocultar histórico' : 'Consultar histórico';
    });
    botao.addEventListener('click', function () {
      const feedback = document.querySelector('#feedbackIniciativa');
      const progressoValor = progresso.value === '' ? null : Number(progresso.value);
      if (!titulo.value.trim() || !descricao.value.trim() || (progressoValor != null && (!Number.isFinite(progressoValor) || progressoValor < 0 || progressoValor > 100))) {
        feedback.textContent = 'Informe título, descrição e um progresso entre 0% e 100%.';
        feedback.classList.add('visivel', 'erro'); return;
      }
      const dados = lerDados(); dados.operacoesIniciativas = dados.operacoesIniciativas || {};
      const novaIniciativa = seletor.value === 'nova';
      const chave = novaIniciativa ? `iniciativa_${Date.now()}` : seletor.value;
      const anterior = obterIniciativas()[chave] || {};
      const iconeSorteado = ICONES_INICIATIVAS[Math.floor(Math.random() * ICONES_INICIATIVAS.length)];
      const registro = {
        titulo: titulo.value.trim(), descricao: descricao.value.trim(), status: status.value,
        progresso: status.value === 'concluida' ? 100 : progressoValor, detalhe: detalhe.value.trim(),
        termino: termino.value, observacao: observacao.value.trim(), atualizadoEm: new Date().toISOString(),
        icone: anterior.icone || (novaIniciativa ? iconeSorteado : 'bx-bulb'), cor: anterior.cor || 'azul'
      };
      dados.operacoesIniciativas[chave] = registro;
      dados.operacoesIniciativasExcluidas = (Array.isArray(dados.operacoesIniciativasExcluidas) ? dados.operacoesIniciativasExcluidas : []).filter(item => item !== chave);
      dados.operacoesIniciativasHistorico = Array.isArray(dados.operacoesIniciativasHistorico) ? dados.operacoesIniciativasHistorico : [];
      dados.operacoesIniciativasHistorico.push(Object.assign({ iniciativa: chave }, registro));
      window.localStorage.setItem(CHAVE, JSON.stringify(dados));
      atualizarOpcoesIniciativas(chave); renderizarResumoIniciativas(); renderizarHistoricoIniciativas(); preencher();
      feedback.textContent = `Iniciativa “${registro.titulo}” salva.`; feedback.classList.remove('erro'); feedback.classList.add('visivel');
    });
  }

  function obterMudancasTarefas() {
    const dados = lerDados();
    const excluidos = new Set((dados.operacoesMudancasTarefasExcluidas || []).map(String));
    return Object.fromEntries(Object.entries(Object.assign({}, MUDANCAS_TAREFAS_BASE, dados.operacoesMudancasTarefas || {})).filter(([chave]) => !excluidos.has(String(chave))));
  }

  function renderizarResumoMudancasTarefas() {
    const destino = document.querySelector('#resumoMudancasTarefas');
    if (!destino) return;
    const registros = Object.values(obterMudancasTarefas()).sort((a, b) => Number(a.ano) - Number(b.ano));
    destino.innerHTML = registros.map(function (item) {
      const total = Number(item.mudancas) + Number(item.tarefas);
      return `<span class="config-historico-item config-registro-item"><span><strong>${item.ano}</strong><small>${Number(item.mudancas).toLocaleString('pt-BR')} mudanças · ${Number(item.tarefas).toLocaleString('pt-BR')} tarefas · ${total.toLocaleString('pt-BR')} total</small></span><span class="config-registro-acoes"><button type="button" data-acao="editar-entregas" data-ano="${item.ano}"><i class="bx bx-edit-alt"></i> Editar</button><button type="button" class="excluir" data-acao="excluir-entregas" data-ano="${item.ano}"><i class="bx bx-trash"></i> Excluir</button></span></span>`;
    }).join('');
  }

  function renderizarHistoricoMudancasTarefas() {
    const destino = document.querySelector('#historicoMudancasTarefas');
    if (!destino) return;
    const dados = lerDados();
    const historico = Array.isArray(dados.operacoesMudancasTarefasHistorico) ? dados.operacoesMudancasTarefasHistorico.slice().reverse() : [];
    if (!historico.length) {
      destino.innerHTML = '<span class="config-historico-vazio">O histórico será criado a partir da próxima atualização.</span>';
      return;
    }
    destino.innerHTML = historico.map(function (item) {
      const total = Number(item.mudancas) + Number(item.tarefas);
      const nota = escaparHtml(item.observacao || 'Sem observação');
      const atualizado = item.atualizadoEm
        ? new Date(item.atualizadoEm).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })
        : 'data não registrada';
      return `<article class="config-agenda-historico-item"><strong>${item.ano}</strong><span>${Number(item.mudancas).toLocaleString('pt-BR')} CHGs · ${Number(item.tarefas).toLocaleString('pt-BR')} tarefas</span><em title="${nota}">${nota}</em><small>${total.toLocaleString('pt-BR')} total · Atualizado em ${atualizado}</small></article>`;
    }).join('');
  }

  function configurarMudancasTarefas() {
    const botao = document.querySelector('#salvarMudancasTarefas');
    if (!botao) return;
    const ano = document.querySelector('#entregasAno');
    const mudancas = document.querySelector('#entregasMudancas');
    const tarefas = document.querySelector('#entregasTarefas');
    const observacao = document.querySelector('#entregasObservacao');
    const botaoHistorico = document.querySelector('#alternarHistoricoMudancasTarefas');
    function preencherAno() {
      const item = obterMudancasTarefas()[ano.value];
      if (!item) return;
      mudancas.value = item.mudancas; tarefas.value = item.tarefas; observacao.value = item.observacao || '';
    }
    renderizarResumoMudancasTarefas(); renderizarHistoricoMudancasTarefas();
    document.querySelector('#resumoMudancasTarefas').addEventListener('click', function (evento) {
      const acao = evento.target.closest('[data-acao]'); if (!acao) return;
      const anoChave = String(acao.dataset.ano); const item = obterMudancasTarefas()[anoChave]; if (!item) return;
      if (acao.dataset.acao === 'editar-entregas') { ano.value = item.ano; preencherAno(); ano.scrollIntoView({ behavior: 'smooth', block: 'center' }); return; }
      if (!window.confirm(`Excluir os volumes de ${item.ano}?`)) return;
      const dados = lerDados(); dados.operacoesMudancasTarefas = dados.operacoesMudancasTarefas || {}; delete dados.operacoesMudancasTarefas[anoChave];
      dados.operacoesMudancasTarefasExcluidas = Array.isArray(dados.operacoesMudancasTarefasExcluidas) ? dados.operacoesMudancasTarefasExcluidas : [];
      if (!dados.operacoesMudancasTarefasExcluidas.map(String).includes(anoChave)) dados.operacoesMudancasTarefasExcluidas.push(anoChave);
      window.localStorage.setItem(CHAVE, JSON.stringify(dados)); renderizarResumoMudancasTarefas(); mudancas.value = ''; tarefas.value = ''; observacao.value = '';
    });
    ano.addEventListener('change', preencherAno);
    if (botaoHistorico) botaoHistorico.addEventListener('click', function () {
      const historico = document.querySelector('#historicoMudancasTarefas');
      const visivel = historico.classList.toggle('visivel');
      historico.setAttribute('aria-hidden', String(!visivel)); botaoHistorico.setAttribute('aria-expanded', String(visivel));
      botaoHistorico.classList.toggle('ativo', visivel);
      botaoHistorico.querySelector('span').textContent = visivel ? 'Ocultar histórico' : 'Consultar histórico';
    });
    botao.addEventListener('click', function () {
      const feedback = document.querySelector('#feedbackMudancasTarefas');
      const anoValor = Number(ano.value); const mudancasValor = Number(mudancas.value); const tarefasValor = Number(tarefas.value);
      if (!Number.isInteger(anoValor) || anoValor < 2026 || anoValor > 2100 || mudancas.value === '' || tarefas.value === '' || mudancasValor < 0 || tarefasValor < 0) {
        feedback.textContent = 'Informe ano, mudanças e tarefas com valores válidos.'; feedback.classList.add('visivel', 'erro'); return;
      }
      const dados = lerDados(); dados.operacoesMudancasTarefas = dados.operacoesMudancasTarefas || {};
      const registro = { ano: anoValor, mudancas: Math.round(mudancasValor), tarefas: Math.round(tarefasValor), observacao: observacao.value.trim(), atualizadoEm: new Date().toISOString() };
      dados.operacoesMudancasTarefas[String(anoValor)] = registro;
      dados.operacoesMudancasTarefasExcluidas = (Array.isArray(dados.operacoesMudancasTarefasExcluidas) ? dados.operacoesMudancasTarefasExcluidas : []).filter(item => String(item) !== String(anoValor));
      dados.operacoesMudancasTarefasHistorico = Array.isArray(dados.operacoesMudancasTarefasHistorico) ? dados.operacoesMudancasTarefasHistorico : [];
      dados.operacoesMudancasTarefasHistorico.push(registro);
      window.localStorage.setItem(CHAVE, JSON.stringify(dados));
      renderizarResumoMudancasTarefas(); renderizarHistoricoMudancasTarefas();
      feedback.textContent = `Volumes de ${anoValor} atualizados.`; feedback.classList.remove('erro'); feedback.classList.add('visivel');
    });
  }

  function obterInformacoesRelevantes() {
    const dados = lerDados();
    const excluidas = new Set(Array.isArray(dados.operacoesInformacoesRelevantesExcluidas) ? dados.operacoesInformacoesRelevantesExcluidas : []);
    return Object.fromEntries(Object.entries(Object.assign({}, INFORMACOES_RELEVANTES_BASE, dados.operacoesInformacoesRelevantes || {})).filter(([chave]) => !excluidas.has(chave)));
  }

  function rotuloTipoRelevante(tipo) {
    return { incidente: 'Incidente relevante', atualizacao: 'Atualização relevante', entrega: 'Entrega relevante' }[tipo] || 'Informação relevante';
  }

  function atualizarCamposTipoRelevante() {
    const tipo = document.querySelector('#relevanteTipo');
    if (!tipo) return;
    const titulo = document.querySelector('#relevanteTituloLabel');
    const referencia = document.querySelector('#relevanteReferenciaLabel');
    const detalhe = document.querySelector('#relevanteDetalheLabel');
    const modelos = {
      incidente: ['Título do incidente', 'Número do incidente', 'IC ou causa associada'],
      atualizacao: ['Título da atualização', 'Área, serviço ou projeto', 'Próximo passo'],
      entrega: ['Título da entrega', 'Produto ou iniciativa', 'Benefício gerado']
    };
    const textos = modelos[tipo.value] || modelos.incidente;
    titulo.childNodes[0].nodeValue = textos[0]; referencia.childNodes[0].nodeValue = textos[1]; detalhe.childNodes[0].nodeValue = textos[2];
  }

  function renderizarResumoInformacoesRelevantes() {
    const destino = document.querySelector('#resumoInformacoesRelevantes');
    if (!destino) return;
    const itens = Object.entries(obterInformacoesRelevantes());
    destino.innerHTML = itens.map(function ([chave, item]) {
      const estado = item.visivel !== false ? 'Exibido' : 'Oculto';
      return `<span class="config-agenda-item config-registro-item"><span><strong>${escaparHtml(item.titulo)}</strong><small>${rotuloTipoRelevante(item.tipo)} · ${estado}</small></span><span class="config-registro-acoes"><button type="button" data-acao="editar-relevante" data-chave="${chave}"><i class="bx bx-edit-alt"></i> Editar</button><button type="button" class="excluir" data-acao="excluir-relevante" data-chave="${chave}"><i class="bx bx-trash"></i> Excluir</button></span></span>`;
    }).join('');
  }

  function renderizarHistoricoInformacoesRelevantes() {
    const destino = document.querySelector('#historicoInformacoesRelevantes');
    if (!destino) return;
    const dados = lerDados();
    const historico = Array.isArray(dados.operacoesInformacoesRelevantesHistorico) ? dados.operacoesInformacoesRelevantesHistorico.slice().reverse() : [];
    if (!historico.length) { destino.innerHTML = '<span class="config-historico-vazio">O histórico será criado na próxima atualização.</span>'; return; }
    destino.innerHTML = historico.map(function (item) {
      const atualizado = item.atualizadoEm ? new Date(item.atualizadoEm).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' }) : 'data não registrada';
      return `<article class="config-agenda-historico-item"><strong>${escaparHtml(item.titulo)}</strong><span>${rotuloTipoRelevante(item.tipo)} · ${item.visivel !== false ? 'Exibido' : 'Oculto'}</span><em>${escaparHtml(item.status || 'Sem status')}</em><small>Atualizado em ${atualizado}</small></article>`;
    }).join('');
  }

  function configurarInformacoesRelevantes() {
    const botao = document.querySelector('#salvarInformacaoRelevante');
    if (!botao) return;
    const seletor = document.querySelector('#relevanteSelecionada'); const tipo = document.querySelector('#relevanteTipo');
    const titulo = document.querySelector('#relevanteTitulo'); const referencia = document.querySelector('#relevanteReferencia');
    const status = document.querySelector('#relevanteStatus'); const data = document.querySelector('#relevanteData');
    const descricao = document.querySelector('#relevanteDescricao'); const detalhe = document.querySelector('#relevanteDetalhe');
    const acao = document.querySelector('#relevanteAcao'); const visivel = document.querySelector('#relevanteVisivel');
    function atualizarOpcoes(selecionar) {
      const itens = obterInformacoesRelevantes();
      seletor.innerHTML = Object.entries(itens).map(([chave, item]) => `<option value="${escaparHtml(chave)}">${escaparHtml(item.titulo)}${item.referencia ? ` — ${escaparHtml(item.referencia)}` : ''}</option>`).join('') + '<option value="nova">+ Nova informação</option>';
      seletor.value = selecionar && (itens[selecionar] || selecionar === 'nova') ? selecionar : (Object.keys(itens)[0] || 'nova');
    }
    function preencher() {
      if (seletor.value === 'nova') { tipo.value = 'incidente'; titulo.value = ''; referencia.value = ''; status.value = 'Em análise'; data.value = ''; descricao.value = ''; detalhe.value = ''; acao.value = ''; visivel.checked = true; atualizarCamposTipoRelevante(); return; }
      const item = obterInformacoesRelevantes()[seletor.value]; if (!item) return;
      tipo.value = item.tipo || 'incidente'; titulo.value = item.titulo || ''; referencia.value = item.referencia || ''; status.value = item.status || '';
      data.value = item.data || ''; descricao.value = item.descricao || ''; detalhe.value = item.detalhe || ''; acao.value = item.acao || ''; visivel.checked = item.visivel !== false;
      atualizarCamposTipoRelevante();
    }
    atualizarOpcoes('incidente_gedoc'); renderizarResumoInformacoesRelevantes(); renderizarHistoricoInformacoesRelevantes(); preencher();
    document.querySelector('#resumoInformacoesRelevantes').addEventListener('click', function (evento) {
      const acao = evento.target.closest('[data-acao]'); if (!acao) return;
      const chave = acao.dataset.chave; const item = obterInformacoesRelevantes()[chave]; if (!item) return;
      if (acao.dataset.acao === 'editar-relevante') { seletor.value = chave; preencher(); seletor.scrollIntoView({ behavior: 'smooth', block: 'center' }); return; }
      if (!window.confirm(`Excluir a informação “${item.titulo}”?`)) return;
      const dados = lerDados(); dados.operacoesInformacoesRelevantes = dados.operacoesInformacoesRelevantes || {}; delete dados.operacoesInformacoesRelevantes[chave];
      dados.operacoesInformacoesRelevantesExcluidas = Array.isArray(dados.operacoesInformacoesRelevantesExcluidas) ? dados.operacoesInformacoesRelevantesExcluidas : [];
      if (!dados.operacoesInformacoesRelevantesExcluidas.includes(chave)) dados.operacoesInformacoesRelevantesExcluidas.push(chave);
      dados.operacoesInformacoesRelevantesHistorico = Array.isArray(dados.operacoesInformacoesRelevantesHistorico) ? dados.operacoesInformacoesRelevantesHistorico : [];
      dados.operacoesInformacoesRelevantesHistorico.push({ informacao: chave, titulo: item.titulo, tipo: item.tipo, status: 'Excluído', visivel: false, atualizadoEm: new Date().toISOString() });
      window.localStorage.setItem(CHAVE, JSON.stringify(dados)); atualizarOpcoes(); preencher(); renderizarResumoInformacoesRelevantes(); renderizarHistoricoInformacoesRelevantes();
    });
    seletor.addEventListener('change', preencher); tipo.addEventListener('change', atualizarCamposTipoRelevante);
    const botaoHistorico = document.querySelector('#alternarHistoricoRelevantes');
    if (botaoHistorico) botaoHistorico.addEventListener('click', function () {
      const historico = document.querySelector('#historicoInformacoesRelevantes'); const aberto = historico.classList.toggle('visivel');
      historico.setAttribute('aria-hidden', String(!aberto)); botaoHistorico.setAttribute('aria-expanded', String(aberto)); botaoHistorico.classList.toggle('ativo', aberto);
      botaoHistorico.querySelector('span').textContent = aberto ? 'Ocultar histórico' : 'Consultar histórico';
    });
    botao.addEventListener('click', function () {
      const feedback = document.querySelector('#feedbackInformacaoRelevante');
      if (!titulo.value.trim() || !descricao.value.trim()) { feedback.textContent = 'Informe ao menos o título e a descrição executiva.'; feedback.classList.add('visivel', 'erro'); return; }
      const dados = lerDados(); dados.operacoesInformacoesRelevantes = dados.operacoesInformacoesRelevantes || {};
      const chave = seletor.value === 'nova' ? `relevante_${Date.now()}` : seletor.value;
      const registro = { tipo: tipo.value, titulo: titulo.value.trim(), referencia: referencia.value.trim(), status: status.value.trim(), data: data.value, descricao: descricao.value.trim(), detalhe: detalhe.value.trim(), acao: acao.value.trim(), visivel: visivel.checked, atualizadoEm: new Date().toISOString() };
      dados.operacoesInformacoesRelevantes[chave] = registro; dados.operacoesInformacoesRelevantesHistorico = Array.isArray(dados.operacoesInformacoesRelevantesHistorico) ? dados.operacoesInformacoesRelevantesHistorico : [];
      dados.operacoesInformacoesRelevantesExcluidas = (Array.isArray(dados.operacoesInformacoesRelevantesExcluidas) ? dados.operacoesInformacoesRelevantesExcluidas : []).filter(item => item !== chave);
      dados.operacoesInformacoesRelevantesHistorico.push(Object.assign({ informacao: chave }, registro)); window.localStorage.setItem(CHAVE, JSON.stringify(dados));
      atualizarOpcoes(chave); preencher(); renderizarResumoInformacoesRelevantes(); renderizarHistoricoInformacoesRelevantes();
      feedback.textContent = `Informação “${registro.titulo}” salva e ${registro.visivel ? 'publicada' : 'ocultada'}.`; feedback.classList.remove('erro'); feedback.classList.add('visivel');
    });
  }

  function configurarNotaEditorial() {
    const botao = document.querySelector('#salvarNotaEditorial');
    if (!botao) return;
    const titulo = document.querySelector('#editorialTitulo'); const texto = document.querySelector('#editorialTexto');
    const assinatura = document.querySelector('#editorialAssinatura'); const visivel = document.querySelector('#editorialVisivel');
    const atual = lerDados().operacoesNotaEditorial || {};
    titulo.value = atual.titulo || ''; texto.value = atual.texto || ''; assinatura.value = atual.assinatura || ''; visivel.checked = atual.visivel === true;
    const excluir = document.querySelector('#excluirNotaEditorial');
    if (excluir) excluir.addEventListener('click', function () {
      if (!window.confirm('Excluir a nota editorial salva?')) return;
      const dados = lerDados(); delete dados.operacoesNotaEditorial; window.localStorage.setItem(CHAVE, JSON.stringify(dados));
      titulo.value = ''; texto.value = ''; assinatura.value = ''; visivel.checked = false;
      const feedback = document.querySelector('#feedbackNotaEditorial'); feedback.textContent = 'Nota editorial excluída.'; feedback.classList.remove('erro'); feedback.classList.add('visivel');
    });
    botao.addEventListener('click', function () {
      const feedback = document.querySelector('#feedbackNotaEditorial');
      if (visivel.checked && (!titulo.value.trim() || !texto.value.trim())) {
        feedback.textContent = 'Informe título e texto antes de publicar a nota.'; feedback.classList.add('visivel', 'erro'); return;
      }
      const dados = lerDados();
      dados.operacoesNotaEditorial = { titulo: titulo.value.trim(), texto: texto.value.trim(), assinatura: assinatura.value.trim(), visivel: visivel.checked, atualizadoEm: new Date().toISOString() };
      window.localStorage.setItem(CHAVE, JSON.stringify(dados));
      feedback.textContent = visivel.checked ? 'Nota editorial salva e publicada no boletim.' : 'Nota editorial salva e mantida oculta.';
      feedback.classList.remove('erro'); feedback.classList.add('visivel');
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    if (new URLSearchParams(window.location.search).get('imprimir') === '1') {
      window.setTimeout(function () { window.print(); }, 700);
    }

    const formularios = document.querySelectorAll('[data-form-configuracao]');
    configurarVirtualiza();
    configurarWorkshops();
    configurarEntregasRelevantesCoe();
    configurarPocs();
    configurarEvolucaoAutomacoes();
    configurarAutomacoesEntregues();
    configurarDisponibilidade();
    configurarEvolucaoSemanal();
    configurarAgendaFornecedores();
    configurarIniciativas();
    configurarMudancasTarefas();
    configurarInformacoesRelevantes();
    configurarNotaEditorial();
    abrirSecaoSolicitada();
    formularios.forEach(preencherFormulario);
    formularios.forEach(function (formulario) {
      formulario.addEventListener('submit', function (evento) {
        evento.preventDefault();
        salvarFormulario(formulario);
        const mensagem = formulario.querySelector('.config-feedback');
        if (mensagem) {
          mensagem.textContent = 'Rascunho salvo neste navegador.';
          mensagem.classList.add('visivel');
          window.setTimeout(function () { mensagem.classList.remove('visivel'); }, 2800);
        }
      });
    });
  });
})(window, document);
