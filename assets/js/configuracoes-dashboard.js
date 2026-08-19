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
    destino.innerHTML = historico.map(function (item) {
      return `<span class="config-historico-item"><strong>${item.mes}/${item.ano || 2026}</strong><small>${item.incidentes} incidentes · ${minutosParaTexto(item.impacto)} · ${Number(item.disponibilidade).toFixed(2).replace('.', ',')}%</small></span>`;
    }).join('');
  }

  function configurarDisponibilidade() {
    const botao = document.querySelector('#adicionarDisponibilidade');
    if (!botao) return;
    renderizarHistoricoDisponibilidade();
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
      historico.push({ mes, ano, incidentes: Math.round(incidentes), impacto, disponibilidade });
      dados.operacoesDisponibilidade = historico;
      window.localStorage.setItem(CHAVE, JSON.stringify(dados));
      feedback.textContent = `${mes}/${ano} adicionado. Os gráficos e cards serão atualizados no relatório de Operações.`;
      feedback.classList.remove('erro');
      feedback.classList.add('visivel');
      renderizarHistoricoDisponibilidade();
      document.querySelector('#dispIncidentes').value = '';
      document.querySelector('#dispImpacto').value = '';
      document.querySelector('#dispDisponibilidade').value = '';
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
    destino.innerHTML = historico.map(function (item) {
      return `<span class="config-historico-item"><strong>${formatarDataCurta(item.data)}</strong><small>${item.incidentes} incidentes · ${item.alertasPrd} alertas PRD · ${item.alertasQa} alertas QA</small></span>`;
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
      historico.push(registro);
      dados.operacoesEvolucaoSemanal = historico;
      window.localStorage.setItem(CHAVE, JSON.stringify(dados));
      feedback.textContent = `${formatarDataCurta(data)} adicionado à Evolução Semanal da Operação.`;
      feedback.classList.remove('erro');
      feedback.classList.add('visivel');
      renderizarHistoricoEvolucaoSemanal();
      Object.values(campos).forEach(function (seletor) { document.querySelector(seletor).value = ''; });
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
      return `<article class="config-agenda-item" data-agenda="${chave}"><div><strong>${item.nome}</strong><small>${quando}</small></div><span class="config-agenda-status ${item.status}">${rotulos[item.status] || item.status}</span></article>`;
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
    const iniciativas = Object.fromEntries(Object.entries(INICIATIVAS_BASE).map(function ([chave, base]) {
      return [chave, Object.assign({}, base, salvas[chave] || {})];
    }));
    Object.entries(salvas).forEach(function ([chave, item]) {
      if (!iniciativas[chave]) iniciativas[chave] = Object.assign({}, item);
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
    seletor.value = selecionada && seletor.querySelector(`option[value="${selecionada}"]`) ? selecionada : Object.keys(obterIniciativas())[0];
  }

  function renderizarResumoIniciativas() {
    const destino = document.querySelector('#resumoIniciativas');
    if (!destino) return;
    destino.innerHTML = Object.entries(obterIniciativas()).map(function ([chave, item]) {
      const progresso = item.progresso == null ? 'Progresso contínuo' : `${item.progresso}%`;
      return `<article class="config-agenda-item" data-iniciativa="${chave}"><div><strong>${escaparHtml(item.titulo)}</strong><small>${progresso}${item.termino ? ` · término ${formatarDataCurta(item.termino)}` : ''}</small></div><span class="config-iniciativa-status ${item.status}">${rotuloStatusIniciativa(item.status)}</span></article>`;
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
      dados.operacoesIniciativasHistorico = Array.isArray(dados.operacoesIniciativasHistorico) ? dados.operacoesIniciativasHistorico : [];
      dados.operacoesIniciativasHistorico.push(Object.assign({ iniciativa: chave }, registro));
      window.localStorage.setItem(CHAVE, JSON.stringify(dados));
      atualizarOpcoesIniciativas(chave); renderizarResumoIniciativas(); renderizarHistoricoIniciativas(); preencher();
      feedback.textContent = `Iniciativa “${registro.titulo}” salva.`; feedback.classList.remove('erro'); feedback.classList.add('visivel');
    });
  }

  function obterMudancasTarefas() {
    const dados = lerDados();
    return Object.assign({}, MUDANCAS_TAREFAS_BASE, dados.operacoesMudancasTarefas || {});
  }

  function renderizarResumoMudancasTarefas() {
    const destino = document.querySelector('#resumoMudancasTarefas');
    if (!destino) return;
    const registros = Object.values(obterMudancasTarefas()).sort((a, b) => Number(a.ano) - Number(b.ano));
    destino.innerHTML = registros.map(function (item) {
      const total = Number(item.mudancas) + Number(item.tarefas);
      return `<span class="config-historico-item"><strong>${item.ano}</strong><small>${Number(item.mudancas).toLocaleString('pt-BR')} mudanças · ${Number(item.tarefas).toLocaleString('pt-BR')} tarefas · ${total.toLocaleString('pt-BR')} total</small></span>`;
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
      dados.operacoesMudancasTarefasHistorico = Array.isArray(dados.operacoesMudancasTarefasHistorico) ? dados.operacoesMudancasTarefasHistorico : [];
      dados.operacoesMudancasTarefasHistorico.push(registro);
      window.localStorage.setItem(CHAVE, JSON.stringify(dados));
      renderizarResumoMudancasTarefas(); renderizarHistoricoMudancasTarefas();
      feedback.textContent = `Volumes de ${anoValor} atualizados.`; feedback.classList.remove('erro'); feedback.classList.add('visivel');
    });
  }

  function obterInformacoesRelevantes() {
    const dados = lerDados();
    return Object.assign({}, INFORMACOES_RELEVANTES_BASE, dados.operacoesInformacoesRelevantes || {});
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
      return `<span class="config-agenda-item"><strong>${escaparHtml(item.titulo)}</strong><small>${rotuloTipoRelevante(item.tipo)} · ${estado}</small></span>`;
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
      seletor.value = selecionar && (itens[selecionar] || selecionar === 'nova') ? selecionar : Object.keys(itens)[0];
    }
    function preencher() {
      if (seletor.value === 'nova') { tipo.value = 'incidente'; titulo.value = ''; referencia.value = ''; status.value = 'Em análise'; data.value = ''; descricao.value = ''; detalhe.value = ''; acao.value = ''; visivel.checked = true; atualizarCamposTipoRelevante(); return; }
      const item = obterInformacoesRelevantes()[seletor.value]; if (!item) return;
      tipo.value = item.tipo || 'incidente'; titulo.value = item.titulo || ''; referencia.value = item.referencia || ''; status.value = item.status || '';
      data.value = item.data || ''; descricao.value = item.descricao || ''; detalhe.value = item.detalhe || ''; acao.value = item.acao || ''; visivel.checked = item.visivel !== false;
      atualizarCamposTipoRelevante();
    }
    atualizarOpcoes('incidente_gedoc'); renderizarResumoInformacoesRelevantes(); renderizarHistoricoInformacoesRelevantes(); preencher();
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
