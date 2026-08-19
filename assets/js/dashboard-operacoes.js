/**
 * ============================================================
 * Dashboard Operações
 * Vivo - Engenharia de Infraestrutura
 * ------------------------------------------------------------
 * Gráficos do dashboard construídos com ApexCharts.
 *
 * Estrutura:
 *  - Configurações visuais
 *  - Dados mockados
 *  - Funções auxiliares
 *  - Disponibilidade (gráfico e gauge)
 *  - Placeholders para os próximos módulos
 *  - Inicialização
 *
 * Preparado para substituir os mocks por dados de API REST,
 * ServiceNow, Power BI ou arquivos JSON.
 * ============================================================
 */

(function (window, document) {
  'use strict';

  /* =========================================================
     CONFIGURAÇÃO
  ========================================================= */

  // Usa as cores do template quando window.config estiver disponível.
  const temaDoTemplate = window.config || {};
  const coresDoTemplate = temaDoTemplate.colors || {};

  const CONFIGURACAO = Object.freeze({
    cores: Object.freeze({
      card: coresDoTemplate.cardColor || '#ffffff',
      titulo: coresDoTemplate.headingColor || '#384551',
      texto: coresDoTemplate.bodyColor || '#646e78',
      textoSuave: coresDoTemplate.textMuted || '#a7acb2',
      borda: coresDoTemplate.borderColor || '#e4e6e8',
      grade: '#edf1f5',
      incidentes: '#e91e63',
      impacto: '#03a9f4',
      disponibilidade: '#7e57c2',
      trilhaGauge: '#ecebff',
      ritms: '#ec4899',
      prbs: '#2563eb',
      ptask: '#12a9b5',
      alertasQa: '#f97316',
      alertasPrd: '#5b21b6',
      incHw: '#312e81',
      america: '#28a745'
    }),
    fonte: temaDoTemplate.fontFamily || 'Public Sans, sans-serif',
    grafico: Object.freeze({
      altura: 315,
      alturaGauge: 112
    })
  });

  /* =========================================================
     DADOS MOCKADOS
     Mantidos iguais aos dados já utilizados no dashboard.
  ========================================================= */

  const DADOS = {
    disponibilidade: {
      meses: ['Fev', 'Mar', 'Abr', 'Jun', 'Jul', 'Ago'],
      anos: [2026, 2026, 2026, 2026, 2026, 2026],
      incidentes: [9, 4, 5, 3, 1, 1],
      impacto: [1915, 329, 891, 500, 86, 104],
      disponibilidade: [95.25, 99.26, 97.93, 98.84, 99.8, 99.76],
      gauge: 98.14
    },
    mttr: {
      meses: ['Fev', 'Mar', 'Abr', 'Jun', 'Jul', 'Ago'],
      anos: [2026, 2026, 2026, 2026, 2026, 2026],
      minutos: [212, 82, 178, 167, 86, 104],
      atualMinutos: 104,
      limiteEscalaMinutos: 360
    },
    evolucaoSemanal: {
      categorias: ['10/07', '13/07', '29/07', '30/07', '31/07', '01/08', '02/08', '03/08', '04/08', '05/08', '06/08', '07/08'],
      datas: ['2026-07-10', '2026-07-13', '2026-07-29', '2026-07-30', '2026-07-31', '2026-08-01', '2026-08-02', '2026-08-03', '2026-08-04', '2026-08-05', '2026-08-06', '2026-08-07'],
      series: [
        { name: 'Incidentes', data: [15, 18, 30, 31, 32, 31, 30, 29, 24, 18, 23, 26] },
        { name: 'RITMs', data: [5, 6, 6, 7, 8, 7, 5, 4, 5, 6, 6, 7] },
        { name: 'PRBs', data: [16, 16, 7, 7, 6, 6, 5, 5, 4, 3, 3, 1] },
        { name: 'PTASK', data: [21, 21, 12, 12, 9, 8, 7, 6, 4, 2, 0, 0] },
        { name: 'Alertas QA', data: [84, 84, 150, 140, 140, 141, 141, 142, 114, 85, 87, 92] },
        { name: 'Alertas PRD', data: [166, 166, 435, 197, 340, 274, 209, 143, 134, 124, 130, 155] },
        { name: 'Inc. HW', data: [23, 24, 20, 20, 20, 21, 23, 24, 24, 24, 24, 25] },
        { name: 'América', data: [47, 47, 45, 45, 45, 49, 52, 56, 56, 56, 56, 57] }
      ]
    },
    iniciativas: [],
    mudancas: [],
    alertas: [],
    problemas: []
  };

  // Guarda instâncias para impedir gráficos duplicados em reinicializações.
  const graficos = Object.create(null);
  let possuiHistoricoDisponibilidade = false;
  const FORNECEDORES_BASE = {
    atos: { nome: 'Bull (Atos)', status: 'confirmado', data: '2026-08-10', hora: '10:00' },
    america: { nome: 'América Tecnologia', status: 'confirmado', data: '2026-08-10', hora: '11:30' },
    microsoft: { nome: 'Microsoft', status: 'pendente', data: '', hora: '' },
    hp: { nome: 'HP', status: 'pendente', data: '', hora: '' },
    huawei: { nome: 'Huawei', status: 'pendente', data: '', hora: '' },
    dell: { nome: 'Dell', status: 'pendente', data: '', hora: '' }
  };
  const INICIATIVAS_BASE = {
    gaus: { titulo: 'Automação GAUS', descricao: 'Automação da manutenção de hardware', status: 'andamento', progresso: null, detalhe: 'Desenvolvimento ativo', termino: '', icone: 'bx-cog', cor: 'roxo' },
    chamado: { titulo: 'Abertura de chamado', descricao: 'Fluxo de abertura em desenvolvimento', status: 'andamento', progresso: 50, detalhe: '50% concluído', termino: '', icone: 'bx-clipboard', cor: 'azul' },
    ritm: { titulo: 'Definição dos processos de RITM', descricao: 'Office 365 e Acesso SO concluídos', status: 'andamento', progresso: 50, detalhe: '2 de 4 processos concluídos', termino: '', icone: 'bx-git-branch', cor: 'laranja' },
    catalogo: { titulo: 'Revisão do catálogo RITMs', descricao: 'Revisão e validação do catálogo operacional', status: 'concluida', progresso: 100, detalhe: 'Concluído', termino: '2026-08-31', icone: 'bx-file', cor: 'verde' }
  };

  function carregarHistoricoDisponibilidade() {
    try {
      const configuracoes = JSON.parse(window.localStorage.getItem('dashboardInfraCloudConfiguracoes')) || {};
      const historico = Array.isArray(configuracoes.operacoesDisponibilidade)
        ? configuracoes.operacoesDisponibilidade
        : [];
      historico.forEach(function (item) {
        const incidentes = Number(item.incidentes);
        const impacto = Number(item.impacto);
        const disponibilidade = Number(item.disponibilidade);
        if (!item.mes || !Number.isFinite(incidentes) || !Number.isFinite(impacto) || !Number.isFinite(disponibilidade)) return;
        DADOS.disponibilidade.meses.push(String(item.mes));
        DADOS.disponibilidade.anos.push(Number(item.ano) || 2026);
        DADOS.disponibilidade.incidentes.push(incidentes);
        DADOS.disponibilidade.impacto.push(impacto);
        DADOS.disponibilidade.disponibilidade.push(disponibilidade);
        DADOS.mttr.meses.push(String(item.mes));
        DADOS.mttr.anos.push(Number(item.ano) || 2026);
        DADOS.mttr.minutos.push(impacto);
      });
      if (historico.length) {
        possuiHistoricoDisponibilidade = true;
        DADOS.disponibilidade.gauge = DADOS.disponibilidade.disponibilidade[DADOS.disponibilidade.disponibilidade.length - 1];
        DADOS.mttr.atualMinutos = DADOS.mttr.minutos[DADOS.mttr.minutos.length - 1];
      }
    } catch (erro) {
      console.warn('[Dashboard Operações] Não foi possível carregar o histórico mensal.', erro);
    }
  }

  function carregarHistoricoEvolucaoSemanal() {
    try {
      const configuracoes = JSON.parse(window.localStorage.getItem('dashboardInfraCloudConfiguracoes')) || {};
      const historico = Array.isArray(configuracoes.operacoesEvolucaoSemanal)
        ? configuracoes.operacoesEvolucaoSemanal
        : [];
      const mapaSeries = {
        'Incidentes': 'incidentes', 'RITMs': 'ritms', 'PRBs': 'prbs', 'PTASK': 'ptask',
        'Alertas QA': 'alertasQa', 'Alertas PRD': 'alertasPrd', 'Inc. HW': 'incHw', 'América': 'america'
      };
      historico.forEach(function (item) {
        if (!/^\d{4}-\d{2}-\d{2}$/.test(String(item.data || ''))) return;
        DADOS.evolucaoSemanal.datas.push(item.data);
        DADOS.evolucaoSemanal.categorias.push(item.data.slice(8, 10) + '/' + item.data.slice(5, 7));
        DADOS.evolucaoSemanal.series.forEach(function (serie) {
          const valor = Number(item[mapaSeries[serie.name]]);
          serie.data.push(Number.isFinite(valor) ? valor : 0);
        });
      });
    } catch (erro) {
      console.warn('[Dashboard Operações] Não foi possível carregar a evolução semanal.', erro);
    }
  }

  function dataLocal(dataIso) {
    const partes = String(dataIso).split('-').map(Number);
    return new Date(partes[0], partes[1] - 1, partes[2]);
  }

  function atualizarDetalhesEvolucaoSemanal() {
    const dados = DADOS.evolucaoSemanal;
    const dias = ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB'];
    const meses = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
    const cores = ['#e91e63', '#ec4899', '#2563eb', '#12a9b5', '#f97316', '#5b21b6', '#312e81', '#28a745'];
    const cabecalho = obterElemento('#evolucaoTabelaCabecalho');
    const corpo = obterElemento('#evolucaoTabelaCorpo');
    const periodo = obterElemento('#evolucaoPeriodo');
    const primeiro = dataLocal(dados.datas[0]);
    const ultimo = dataLocal(dados.datas[dados.datas.length - 1]);
    if (cabecalho) {
      cabecalho.innerHTML = '<th>Indicador</th>' + dados.datas.map(function (data, indice) {
        return `<th>${dados.categorias[indice]}<small>${dias[dataLocal(data).getDay()]}</small></th>`;
      }).join('');
    }
    if (corpo) {
      corpo.innerHTML = dados.series.map(function (serie, indice) {
        return `<tr><th><i style="--cor:${cores[indice]}"></i>${serie.name}</th>${serie.data.map(valor => `<td>${valor}</td>`).join('')}</tr>`;
      }).join('');
    }
    if (periodo) {
      const inicioTexto = `${String(primeiro.getDate()).padStart(2, '0')} ${meses[primeiro.getMonth()]}`;
      const fimTexto = `${String(ultimo.getDate()).padStart(2, '0')} ${meses[ultimo.getMonth()]}`;
      const texto = primeiro.getFullYear() === ultimo.getFullYear()
        ? `${inicioTexto} — ${fimTexto} ${ultimo.getFullYear()}`
        : `${inicioTexto} ${primeiro.getFullYear()} — ${fimTexto} ${ultimo.getFullYear()}`;
      periodo.innerHTML = `<i class="bx bx-calendar"></i>${texto}`;
    }
    let pico = { valor: -Infinity, serie: '', indice: 0 };
    dados.series.forEach(function (serie) {
      serie.data.forEach(function (valor, indice) {
        if (valor > pico.valor) pico = { valor, serie: serie.name, indice };
      });
    });
    const picoValor = obterElemento('#evolucaoPicoValor');
    const picoDetalhe = obterElemento('#evolucaoPicoDetalhe');
    if (picoValor) picoValor.textContent = String(pico.valor);
    if (picoDetalhe) picoDetalhe.textContent = `${pico.serie} · ${dados.categorias[pico.indice]}`;
    function atualizarVariacao(nomeSerie, seletor) {
      const serie = dados.series.find(item => item.name === nomeSerie);
      const elemento = obterElemento(seletor);
      if (!serie || !elemento) return;
      const inicial = serie.data[0];
      const final = serie.data[serie.data.length - 1];
      const variacao = inicial === 0 ? 0 : ((final - inicial) / Math.abs(inicial)) * 100;
      elemento.textContent = `${variacao > 0 ? '+' : variacao < 0 ? '−' : ''}${Math.abs(variacao).toFixed(1).replace('.', ',')}%`;
      elemento.classList.toggle('tendencia-positiva', variacao <= 0);
      elemento.classList.toggle('tendencia-alerta', variacao > 0);
    }
    atualizarVariacao('Alertas PRD', '#evolucaoVariacaoPrd');
    atualizarVariacao('Incidentes', '#evolucaoVariacaoIncidentes');
    const ultimoRegistro = obterElemento('#evolucaoUltimoRegistro');
    if (ultimoRegistro) ultimoRegistro.textContent = dados.categorias[dados.categorias.length - 1];
  }

  function atualizarGestaoFornecedores() {
    let salvos = {};
    try {
      const configuracoes = JSON.parse(window.localStorage.getItem('dashboardInfraCloudConfiguracoes')) || {};
      salvos = configuracoes.operacoesFornecedores || {};
    } catch (erro) {
      console.warn('[Dashboard Operações] Não foi possível carregar a agenda de fornecedores.', erro);
    }
    const agendas = Object.entries(FORNECEDORES_BASE).map(function ([chave, base]) {
      return Object.assign({ chave }, base, salvos[chave] || {});
    });
    agendas.forEach(function (item) {
      const card = document.querySelector(`[data-fornecedor="${item.chave}"]`);
      if (!card) return;
      const agenda = card.querySelector('.fornecedor-agenda');
      const icone = agenda ? agenda.querySelector('i') : null;
      const titulo = agenda ? agenda.querySelector('strong') : null;
      const detalhe = agenda ? agenda.querySelector('span') : null;
      const status = card.querySelector('.fornecedor-status');
      const confirmado = item.status === 'confirmado' && item.data && item.hora;
      const cancelado = item.status === 'cancelado';
      card.classList.toggle('fornecedor-agendado', confirmado);
      if (agenda) agenda.classList.toggle('agenda-pendente', !confirmado);
      if (icone) icone.className = confirmado ? 'bx bx-calendar-check' : cancelado ? 'bx bx-calendar-x' : 'bx bx-time-five';
      if (titulo) titulo.textContent = confirmado ? item.data.split('-').reverse().join('/') : cancelado ? 'Cancelada' : 'A agendar';
      if (detalhe) detalhe.textContent = confirmado ? `às ${item.hora}` : cancelado && item.data ? item.data.split('-').reverse().join('/') : cancelado ? 'Reunião cancelada' : 'Data pendente';
      if (status) {
        status.textContent = confirmado ? 'Confirmado' : cancelado ? 'Cancelado' : 'Pendente';
        status.classList.remove('status-confirmado', 'status-pendente', 'status-cancelado');
        status.classList.toggle('status-confirmado', confirmado);
        status.classList.toggle('status-pendente', !confirmado && !cancelado);
        status.classList.toggle('status-cancelado', cancelado);
      }
      if (item.observacao) card.title = item.observacao;
    });
    const confirmadas = agendas.filter(item => item.status === 'confirmado' && item.data && item.hora);
    const canceladas = agendas.filter(item => item.status === 'cancelado');
    const total = agendas.length;
    const percentual = total ? (confirmadas.length / total) * 100 : 0;
    const resumoTitulo = obterElemento('#fornecedoresResumoTitulo');
    const resumoPercentual = obterElemento('#fornecedoresResumoPercentual');
    const progresso = obterElemento('#fornecedoresProgresso');
    const numeroConfirmadas = obterElemento('#fornecedoresConfirmadas');
    const numeroPendentes = obterElemento('#fornecedoresPendentes');
    const numeroCanceladas = obterElemento('#fornecedoresCanceladas');
    const numeroTotal = obterElemento('#fornecedoresTotal');
    if (resumoTitulo) resumoTitulo.textContent = `${confirmadas.length} de ${total} reuniões`;
    if (resumoPercentual) resumoPercentual.textContent = `${Math.round(percentual)}% da rodada mensal confirmada`;
    if (progresso) { progresso.style.width = `${percentual}%`; progresso.parentElement.setAttribute('aria-label', `${Math.round(percentual)}% das reuniões confirmadas`); }
    if (numeroConfirmadas) numeroConfirmadas.textContent = String(confirmadas.length);
    if (numeroPendentes) numeroPendentes.textContent = String(total - confirmadas.length - canceladas.length);
    if (numeroCanceladas) numeroCanceladas.textContent = String(canceladas.length);
    if (numeroTotal) numeroTotal.textContent = String(total);
    const hoje = new Date(); hoje.setHours(0, 0, 0, 0);
    const ordenadas = confirmadas.slice().sort((a, b) => `${a.data}T${a.hora}`.localeCompare(`${b.data}T${b.hora}`));
    const futuras = ordenadas.filter(item => dataLocal(item.data) >= hoje);
    const proximas = futuras.concat(ordenadas.filter(item => !futuras.includes(item))).slice(0, 2);
    const proximasElemento = obterElemento('#proximasReunioes');
    if (proximasElemento) {
      if (proximas.length) {
        const meses = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
        proximasElemento.innerHTML = '<span>Próximas reuniões</span><div class="proximas-reunioes-lista">' + proximas.map(function (item) {
          const data = dataLocal(item.data);
          return `<div class="proxima-reuniao-item"><strong>${item.nome}</strong><small><i class="bx bx-calendar"></i> ${String(data.getDate()).padStart(2, '0')} ${meses[data.getMonth()]} · ${item.hora}</small></div>`;
        }).join('') + '</div>';
      } else {
        proximasElemento.innerHTML = '<span>Próximas reuniões</span><div class="proximas-reunioes-lista"><div class="proxima-reuniao-item"><strong>A definir</strong><small>Nenhuma reunião confirmada</small></div></div>';
      }
    }
    const atualizacoes = agendas.map(item => item.atualizadoEm).filter(Boolean).sort();
    const atualizado = obterElemento('#fornecedoresAtualizacao');
    if (atualizado && atualizacoes.length) {
      const dataAtualizacao = new Date(atualizacoes[atualizacoes.length - 1]);
      atualizado.innerHTML = `<i class="bx bx-refresh"></i> Atualizado em ${dataAtualizacao.toLocaleDateString('pt-BR')}`;
    }
  }

  function atualizarIniciativas() {
    let salvas = {};
    try {
      const configuracoes = JSON.parse(window.localStorage.getItem('dashboardInfraCloudConfiguracoes')) || {};
      salvas = configuracoes.operacoesIniciativas || {};
    } catch (erro) {
      console.warn('[Dashboard Operações] Não foi possível carregar as iniciativas.', erro);
    }
    const mapa = Object.fromEntries(Object.entries(INICIATIVAS_BASE).map(function ([chave, base]) {
      return [chave, Object.assign({}, base, salvas[chave] || {})];
    }));
    Object.entries(salvas).forEach(function ([chave, item]) { if (!mapa[chave]) mapa[chave] = item; });
    const iniciativas = Object.values(mapa).filter(item => item.status !== 'arquivada');
    const grid = obterElemento('#iniciativasGrid');
    const rotulos = { planejada: 'Planejada', andamento: 'Em andamento', pausada: 'Pausada', concluida: 'Concluída' };
    if (grid) {
      grid.innerHTML = iniciativas.map(function (item) {
        const concluida = item.status === 'concluida';
        const progressoDefinido = item.progresso != null && item.progresso !== '';
        const progresso = concluida ? 100 : Math.max(0, Math.min(100, Number(item.progresso) || 0));
        let indicador = `<span class="iniciativa-status status-${item.status}">${rotulos[item.status] || item.status}</span>`;
        if (progressoDefinido || concluida) {
          indicador = `<div class="progresso-circular progresso-${item.cor || 'azul'}" style="--progresso:${progresso}%" aria-label="${progresso}% concluído">${concluida ? '<i class="bx bx-check"></i>' : `<span>${progresso}%</span>`}</div>`;
        }
        const barraClasse = concluida ? ' progresso-verde-barra' : item.cor === 'laranja' ? ' progresso-laranja-barra' : '';
        const barra = !progressoDefinido && item.status === 'andamento'
          ? '<div class="progresso-indeterminado" aria-label="Iniciativa em andamento"><span></span></div>'
          : `<div class="progresso-linear${barraClasse}"><span style="width:${progresso}%"></span></div>`;
        const termino = item.termino ? item.termino.split('-').reverse().join('/') : '';
        const meta = [item.detalhe, termino ? `${concluida ? 'Concluído' : 'Término'}: ${termino}` : ''].filter(Boolean).join(' · ');
        return `<article class="iniciativa-item${concluida ? ' iniciativa-concluida' : ''}"><div class="iniciativa-icone"><i class="bx ${item.icone || 'bx-bulb'}"></i></div><div class="iniciativa-conteudo"><div class="iniciativa-titulo-linha"><h3>${escaparHtml(item.titulo)}</h3>${indicador}</div><p>${escaparHtml(item.descricao)}</p>${barra}<small class="iniciativa-meta">${escaparHtml(meta)}</small></div></article>`;
      }).join('');
    }
    const total = obterElemento('#iniciativasTotal');
    const concluidas = obterElemento('#iniciativasConcluidas');
    if (total) total.textContent = String(iniciativas.length);
    if (concluidas) concluidas.textContent = String(iniciativas.filter(item => item.status === 'concluida').length);
  }

  function atualizarMudancasTarefas() {
    let registros = { 2026: { ano: 2026, mudancas: 1921, tarefas: 2837 } };
    try {
      const configuracoes = JSON.parse(window.localStorage.getItem('dashboardInfraCloudConfiguracoes')) || {};
      registros = Object.assign(registros, configuracoes.operacoesMudancasTarefas || {});
    } catch (erro) {
      console.warn('[Dashboard Operações] Não foi possível carregar mudanças e tarefas.', erro);
    }
    const item = Object.values(registros).sort((a, b) => Number(b.ano) - Number(a.ano))[0];
    const mudancas = Math.max(0, Number(item.mudancas) || 0);
    const tarefas = Math.max(0, Number(item.tarefas) || 0);
    const total = mudancas + tarefas;
    const percentualMudancas = total ? (mudancas / total) * 100 : 0;
    const percentualTarefas = total ? (tarefas / total) * 100 : 0;
    const mudancasElemento = obterElemento('#mudancasTotal');
    const tarefasElemento = obterElemento('#tarefasTotal');
    const mudancasAno = obterElemento('#mudancasAno');
    const tarefasAno = obterElemento('#tarefasAno');
    const totalElemento = obterElemento('#entregasVolumeTotal');
    const barraMudancas = obterElemento('#entregasComposicaoMudancas');
    const barraTarefas = obterElemento('#entregasComposicaoTarefas');
    if (mudancasElemento) mudancasElemento.textContent = mudancas.toLocaleString('pt-BR');
    if (tarefasElemento) tarefasElemento.textContent = tarefas.toLocaleString('pt-BR');
    if (mudancasAno) mudancasAno.textContent = `Realizadas em ${item.ano}`;
    if (tarefasAno) tarefasAno.textContent = `Concluídas em ${item.ano}`;
    if (totalElemento) totalElemento.textContent = total.toLocaleString('pt-BR');
    if (barraMudancas) { barraMudancas.style.width = `${percentualMudancas}%`; barraMudancas.title = `${percentualMudancas.toFixed(1).replace('.', ',')}% mudanças`; }
    if (barraTarefas) { barraTarefas.style.width = `${percentualTarefas}%`; barraTarefas.title = `${percentualTarefas.toFixed(1).replace('.', ',')}% tarefas`; }
  }

  function atualizarInformacoesRelevantes() {
    const base = {
      incidente_gedoc: { tipo: 'incidente', titulo: 'Incidente GEDOC', referencia: 'INC4530241', status: 'Redirecionado', data: '', descricao: 'Impacto no Exchange causado pela rotina de backup executada fora da janela operacional.', detalhe: 'TLV_SI_INFRAESTRUTURA BACKUP', acao: 'Encaminhado ao time responsável · Causa em análise', visivel: true }
    };
    let salvas = {};
    try { salvas = (JSON.parse(window.localStorage.getItem('dashboardInfraCloudConfiguracoes')) || {}).operacoesInformacoesRelevantes || {}; }
    catch (erro) { console.warn('[Dashboard Operações] Não foi possível carregar as informações relevantes.', erro); }
    const mapa = Object.assign({}, base, salvas);
    const itens = Object.values(mapa).filter(item => item.visivel !== false).sort(function (a, b) {
      return String(b.data || b.atualizadoEm || '').localeCompare(String(a.data || a.atualizadoEm || ''));
    });
    const lista = obterElemento('#informacoesRelevantesLista'); const contador = obterElemento('#relevantesContador');
    const modelos = {
      incidente: { rotulo: 'Incidente relevante', icone: 'bx-error', detalhe: 'IC ou causa associada', classe: 'relevante-incidente' },
      atualizacao: { rotulo: 'Atualização relevante', icone: 'bx-refresh', detalhe: 'Próximo passo', classe: 'relevante-atualizacao' },
      entrega: { rotulo: 'Entrega relevante', icone: 'bx-check-shield', detalhe: 'Benefício gerado', classe: 'relevante-entrega' }
    };
    if (contador) contador.innerHTML = `<i class="bx bx-bell"></i> ${itens.length} ${itens.length === 1 ? 'destaque' : 'destaques'}`;
    if (!lista) return;
    if (!itens.length) { lista.innerHTML = '<div class="informacoes-relevantes-vazio"><i class="bx bx-check-circle"></i><strong>Sem destaques publicados</strong><span>Os itens ocultos continuam disponíveis nas configurações.</span></div>'; return; }
    lista.innerHTML = itens.map(function (item) {
      const modelo = modelos[item.tipo] || modelos.atualizacao;
      const data = item.data ? new Date(`${item.data}T12:00:00`).toLocaleDateString('pt-BR') : '';
      const acoes = String(item.acao || '').split('·').map(texto => texto.trim()).filter(Boolean).map(texto => `<span><i class="bx bx-check-circle"></i> ${escaparHtml(texto)}</span>`).join('');
      return `<article class="incidente-relevante informacao-relevante-item ${modelo.classe}"><div class="incidente-alerta-icone"><i class="bx ${modelo.icone}"></i></div><div class="incidente-detalhes"><div class="incidente-titulo-linha"><div><span class="incidente-label">${modelo.rotulo}</span><h3>${escaparHtml(item.titulo)}${item.referencia ? ` <small>${escaparHtml(item.referencia)}</small>` : ''}</h3></div>${item.status ? `<span class="incidente-status">${escaparHtml(item.status)}</span>` : ''}</div><p>${escaparHtml(item.descricao)}</p>${item.detalhe ? `<div class="incidente-causa"><span>${modelo.detalhe}</span><strong>${escaparHtml(item.detalhe)}</strong></div>` : ''}<div class="incidente-acoes">${acoes}${data ? `<span><i class="bx bx-calendar"></i> ${data}</span>` : ''}</div></div></article>`;
    }).join('');
  }

  function atualizarNotaEditorial() {
    const card = obterElemento('#notaEditorial');
    if (!card) return;
    let nota = {};
    try { nota = (JSON.parse(window.localStorage.getItem('dashboardInfraCloudConfiguracoes')) || {}).operacoesNotaEditorial || {}; }
    catch (erro) { console.warn('[Dashboard Operações] Não foi possível carregar a nota editorial.', erro); }
    const publicar = nota.visivel === true && nota.titulo && nota.texto;
    card.hidden = !publicar;
    if (!publicar) return;
    const titulo = obterElemento('#notaEditorialTitulo'); const texto = obterElemento('#notaEditorialTexto'); const assinatura = obterElemento('#notaEditorialAssinatura');
    if (titulo) titulo.textContent = nota.titulo; if (texto) texto.textContent = nota.texto;
    if (assinatura) { assinatura.textContent = nota.assinatura ? `— ${nota.assinatura}` : ''; assinatura.hidden = !nota.assinatura; }
  }

  function atualizarResumoDisponibilidade() {
    const dados = DADOS.disponibilidade;
    const ultimo = dados.meses.length - 1;
    const anterior = Math.max(0, ultimo - 1);
    const itens = [
      { valor: '#resumoIncidentesValor', variacao: '#resumoIncidentesVariacao', atual: dados.incidentes[ultimo], previo: dados.incidentes[anterior], melhorQuandoSobe: false, formatar: valor => String(Math.round(valor)) },
      { valor: '#resumoImpactoValor', variacao: '#resumoImpactoVariacao', atual: dados.impacto[ultimo], previo: dados.impacto[anterior], melhorQuandoSobe: false, formatar: minutosParaTexto },
      { valor: '#resumoDisponibilidadeValor', variacao: '#resumoDisponibilidadeVariacao', atual: dados.disponibilidade[ultimo], previo: dados.disponibilidade[anterior], melhorQuandoSobe: true, formatar: valor => formatarPercentual(valor, 2) }
    ];
    itens.forEach(function (item) {
      const valor = obterElemento(item.valor);
      const variacao = obterElemento(item.variacao);
      if (valor) valor.textContent = item.formatar(item.atual);
      if (!variacao) return;
      const percentual = item.previo === 0 ? 0 : ((item.atual - item.previo) / Math.abs(item.previo)) * 100;
      const subiu = percentual > 0;
      const favoravel = percentual === 0 || (subiu === item.melhorQuandoSobe);
      variacao.classList.remove('text-success', 'text-danger');
      variacao.classList.add(favoravel ? 'text-success' : 'text-danger');
      const simbolo = percentual > 0 ? '▲' : percentual < 0 ? '▼' : '•';
      const sinal = percentual > 0 ? '+' : '';
      variacao.textContent = `${simbolo} ${sinal}${percentual.toFixed(1).replace('.', ',')}% em relação ao mês anterior`;
    });
  }

  function atualizarResumoMttr() {
    const dados = DADOS.mttr;
    const inicio = Math.max(0, dados.minutos.length - 6);
    const valores = dados.minutos.slice(inicio);
    const meses = dados.meses.slice(inicio);
    const anos = dados.anos.slice(inicio);
    const media = valores.reduce((total, valor) => total + valor, 0) / valores.length;
    const melhorValor = Math.min.apply(null, valores);
    const melhorIndice = valores.indexOf(melhorValor);
    const nomesMeses = { Jan: 'Janeiro', Fev: 'Fevereiro', Mar: 'Março', Abr: 'Abril', Mai: 'Maio', Jun: 'Junho', Jul: 'Julho', Ago: 'Agosto', Set: 'Setembro', Out: 'Outubro', Nov: 'Novembro', Dez: 'Dezembro' };
    const primeiro = valores[0];
    const ultimo = valores[valores.length - 1];
    const variacao = primeiro === 0 ? 0 : ((ultimo - primeiro) / primeiro) * 100;
    const periodo = obterElemento('#mttrPeriodo');
    const melhor = obterElemento('#mttrMelhorValor');
    const melhorMes = obterElemento('#mttrMelhorMes');
    const mediaElemento = obterElemento('#mttrMediaValor');
    const quantidade = obterElemento('#mttrMediaQuantidade');
    const destaque = obterElemento('#mttrVariacaoPeriodo');
    const gauge = obterElemento('#mttrGauge');
    if (periodo) {
      const mesmoAno = anos[0] === anos[anos.length - 1];
      const textoPeriodo = mesmoAno
        ? `${meses[0]} — ${meses[meses.length - 1]} ${anos[anos.length - 1]}`
        : `${meses[0]}/${anos[0]} — ${meses[meses.length - 1]}/${anos[anos.length - 1]}`;
      periodo.innerHTML = `<i class="bx bx-calendar"></i> ${textoPeriodo}`;
    }
    if (melhor) melhor.textContent = minutosParaTexto(melhorValor).replace(' ', '');
    if (melhorMes) melhorMes.textContent = `${nomesMeses[meses[melhorIndice]] || meses[melhorIndice]} / ${anos[melhorIndice]}`;
    if (mediaElemento) mediaElemento.textContent = minutosParaTexto(media).replace(' ', '');
    if (quantidade) quantidade.textContent = `${valores.length} registros`;
    if (gauge) gauge.setAttribute('aria-label', `MTTR atual de ${minutosParaTexto(ultimo)}`);
    if (destaque) {
      const favoravel = variacao <= 0;
      destaque.classList.toggle('mttr-destaque-alerta', !favoravel);
      destaque.innerHTML = `<i class="bx bx-trending-${favoravel ? 'down' : 'up'}"></i> ${variacao > 0 ? '+' : variacao < 0 ? '−' : ''}${Math.abs(variacao).toFixed(1).replace('.', ',')}% no período`;
    }
  }

  /* =========================================================
     FUNÇÕES AUXILIARES
  ========================================================= */

  function minutosParaTexto(valor) {
    const minutos = Math.max(0, Math.round(Number(valor) || 0));
    const horas = Math.floor(minutos / 60);
    const minutosRestantes = minutos % 60;

    return `${horas}h ${minutosRestantes}min`;
  }

  function formatarPercentual(valor, casasDecimais) {
    const numero = Number(valor) || 0;
    const casas = Number.isInteger(casasDecimais) ? casasDecimais : 2;

    return `${numero.toFixed(casas).replace('.', ',')}%`;
  }

  function escaparHtml(valor) {
    return String(valor == null ? '' : valor).replace(/[&<>'"]/g, function (caractere) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[caractere];
    });
  }

  function obterElemento(seletor) {
    return document.querySelector(seletor);
  }

  function apexChartsDisponivel() {
    if (typeof window.ApexCharts === 'function') return true;

    console.error(
      '[Dashboard Operações] ApexCharts não foi carregado. ' + 'Inclua a biblioteca antes de dashboard-operacoes.js.'
    );
    return false;
  }

  function destruirGrafico(nome) {
    const grafico = graficos[nome];

    if (grafico && typeof grafico.destroy === 'function') {
      grafico.destroy();
    }

    delete graficos[nome];
  }

  function renderizarGrafico(nome, elemento, opcoes) {
    if (!elemento || !apexChartsDisponivel()) return null;

    destruirGrafico(nome);
    graficos[nome] = new window.ApexCharts(elemento, opcoes);
    graficos[nome].render();

    return graficos[nome];
  }

  /* =========================================================
     DISPONIBILIDADE - GRÁFICO COMBINADO
  ========================================================= */

  function criarGraficoDisponibilidade() {
    const elemento = obterElemento('#disponibilidadeChart');
    if (!elemento) return null;

    const dados = DADOS.disponibilidade;
    const opcoes = {
      series: [
        {
          name: 'Incidentes',
          type: 'column',
          data: dados.incidentes
        },
        {
          name: 'Horas Impacto',
          type: 'column',
          data: dados.impacto
        },
        {
          name: 'Disponibilidade',
          type: 'line',
          data: dados.disponibilidade
        }
      ],
      chart: {
        height: CONFIGURACAO.grafico.altura,
        type: 'line',
        stacked: false,
        toolbar: {
          show: false
        }
      },
      colors: [CONFIGURACAO.cores.incidentes, CONFIGURACAO.cores.impacto, CONFIGURACAO.cores.disponibilidade],
      plotOptions: {
        bar: {
          borderRadius: 6,
          columnWidth: '48%'
        }
      },
      stroke: {
        width: [0, 0, 4],
        curve: 'smooth',
        lineCap: 'round'
      },
      markers: {
        size: 5,
        strokeWidth: 2,
        strokeColors: '#fff'
      },
      // Exibe rótulos somente na linha roxa. Assim o eixo percentual
      // pode continuar oculto sem perder a leitura dos valores.
      dataLabels: {
        enabled: true,
        enabledOnSeries: [2],
        offsetY: -12,
        formatter: function (valor) {
          return formatarPercentual(valor, 2);
        },
        style: {
          fontSize: '12px',
          fontFamily: CONFIGURACAO.fonte,
          fontWeight: 700,
          // Uma cor para cada série garante que a terceira série
          // receba o roxo mesmo em versões antigas do ApexCharts.
          colors: [CONFIGURACAO.cores.incidentes, CONFIGURACAO.cores.impacto, CONFIGURACAO.cores.disponibilidade]
        },
        background: {
          enabled: false
        }
      },
      grid: {
        borderColor: CONFIGURACAO.cores.grade,
        strokeDashArray: 4,
        padding: {
          top: 10,
          right: 0
        }
      },
      xaxis: {
        categories: dados.meses.map(function (mes, indice) {
          return [mes, String(dados.anos[indice])];
        })
      },
      yaxis: [
        {
          title: {
            text: 'Incidentes'
          }
        },
        {
          opposite: true,
          title: {
            text: 'Horas Impacto'
          },
          labels: {
            formatter: function (valor) {
              return minutosParaTexto(valor);
            }
          }
        },
        {
          opposite: true,
          min: 90,
          max: 100,
          show: false,
          title: {
            text: 'Disponibilidade (%)'
          },
          labels: {
            formatter: function (valor) {
              return formatarPercentual(valor, 1);
            }
          }
        }
      ],
      tooltip: {
        shared: true,
        intersect: false,
        y: [
          {
            formatter: function (valor) {
              return `${Math.round(valor)} incidente${Math.round(valor) === 1 ? '' : 's'}`;
            }
          },
          {
            formatter: function (valor) {
              return minutosParaTexto(valor);
            }
          },
          {
            formatter: function (valor) {
              return formatarPercentual(valor, 2);
            }
          }
        ]
      },
      legend: {
        position: 'top',
        horizontalAlign: 'left',
        fontFamily: CONFIGURACAO.fonte
      }
    };

    return renderizarGrafico('disponibilidade', elemento, opcoes);
  }

  /* =========================================================
     DISPONIBILIDADE - GAUGE
  ========================================================= */

  function criarGaugeDisponibilidade() {
    const elemento = obterElemento('#disponibilidadeGauge');
    if (!elemento) return null;

    const opcoes = {
      series: [DADOS.disponibilidade.gauge],
      chart: {
        type: 'radialBar',
        height: CONFIGURACAO.grafico.alturaGauge,
        fontFamily: CONFIGURACAO.fonte,
        sparkline: { enabled: true }
      },
      colors: [CONFIGURACAO.cores.disponibilidade],
      plotOptions: {
        radialBar: {
          startAngle: -135,
          endAngle: 135,
          hollow: { size: '72%' },
          track: {
            background: CONFIGURACAO.cores.trilhaGauge,
            strokeWidth: '100%',
            margin: 0
          },
          dataLabels: {
            name: {
              show: false
            },
            value: {
              show: true,
              offsetY: 4,
              color: CONFIGURACAO.cores.titulo,
              fontSize: '18px',
              fontWeight: 700,
              formatter: function (valor) {
                return formatarPercentual(valor, 2);
              }
            }
          }
        }
      },
      stroke: { lineCap: 'round' },
      labels: ['Disponibilidade']
    };

    return renderizarGrafico('gaugeDisponibilidade', elemento, opcoes);
  }

  /* =========================================================
     MTTR - GAUGE E EVOLUÇÃO MENSAL
  ========================================================= */

  function criarGaugeMttr() {
    const elemento = obterElemento('#mttrGauge');
    if (!elemento) return null;

    const dados = DADOS.mttr;
    const percentualEscala = (dados.atualMinutos / dados.limiteEscalaMinutos) * 100;
    const opcoes = {
      series: [percentualEscala],
      chart: {
        type: 'radialBar',
        height: 245,
        fontFamily: CONFIGURACAO.fonte,
        sparkline: { enabled: true }
      },
      colors: [CONFIGURACAO.cores.disponibilidade],
      plotOptions: {
        radialBar: {
          startAngle: -135,
          endAngle: 135,
          hollow: { size: '69%' },
          track: {
            background: '#e5e7eb',
            strokeWidth: '100%',
            margin: 0
          },
          dataLabels: {
            name: {
              show: true,
              offsetY: 31,
              color: CONFIGURACAO.cores.textoSuave,
              fontSize: '13px',
              fontWeight: 600
            },
            value: {
              show: true,
              offsetY: -12,
              color: CONFIGURACAO.cores.titulo,
              fontSize: '34px',
              fontWeight: 700,
              formatter: function () {
                return minutosParaTexto(dados.atualMinutos);
              }
            }
          }
        }
      },
      stroke: { lineCap: 'round' },
      labels: ['MTTR']
    };

    return renderizarGrafico('gaugeMttr', elemento, opcoes);
  }

  function criarGraficoMttrMensal() {
    const elemento = obterElemento('#mttrMensalChart');
    if (!elemento) return null;

    const dados = DADOS.mttr;
    const opcoes = {
      series: [{ name: 'MTTR', data: dados.minutos }],
      chart: {
        type: 'area',
        height: 310,
        fontFamily: CONFIGURACAO.fonte,
        foreColor: CONFIGURACAO.cores.texto,
        toolbar: { show: false },
        zoom: { enabled: false }
      },
      colors: [CONFIGURACAO.cores.disponibilidade],
      stroke: {
        curve: 'smooth',
        width: 4,
        lineCap: 'round'
      },
      fill: {
        type: 'gradient',
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.25,
          opacityTo: 0.02,
          stops: [0, 90, 100]
        }
      },
      markers: {
        size: 6,
        strokeWidth: 3,
        strokeColors: '#fff',
        hover: { size: 8 }
      },
      dataLabels: {
        enabled: true,
        offsetY: -12,
        formatter: function (valor) {
          return minutosParaTexto(valor);
        },
        style: {
          fontSize: '11px',
          fontFamily: CONFIGURACAO.fonte,
          fontWeight: 700,
          colors: [CONFIGURACAO.cores.disponibilidade]
        },
        background: { enabled: false }
      },
      grid: {
        borderColor: CONFIGURACAO.cores.grade,
        strokeDashArray: 4,
        padding: { top: 18, right: 10, left: 30 }
      },
      xaxis: {
        categories: dados.meses.map(function (mes, indice) {
          return [mes, String(dados.anos[indice])];
        }),
        axisBorder: { show: false },
        axisTicks: { show: false }
      },
      yaxis: {
        min: 0,
        max: 240,
        tickAmount: 4,
        labels: {
          formatter: function (valor) {
            return `${Math.round(valor / 60)}h`;
          }
        }
      },
      tooltip: {
        y: {
          formatter: function (valor) {
            return minutosParaTexto(valor);
          }
        }
      },
      legend: { show: false }
    };

    return renderizarGrafico('mttrMensal', elemento, opcoes);
  }

  /* =========================================================
     EVOLUÇÃO SEMANAL DA OPERAÇÃO
  ========================================================= */

  function criarGraficoEvolucaoSemanal() {
    const elemento = obterElemento('#evolucaoSemanalChart');
    if (!elemento) return null;

    const dados = DADOS.evolucaoSemanal;
    const opcoes = {
      series: dados.series,
      chart: {
        type: 'line',
        height: 385,
        fontFamily: CONFIGURACAO.fonte,
        foreColor: CONFIGURACAO.cores.texto,
        toolbar: { show: false },
        zoom: { enabled: false }
      },
      colors: [
        CONFIGURACAO.cores.incidentes,
        CONFIGURACAO.cores.ritms,
        CONFIGURACAO.cores.prbs,
        CONFIGURACAO.cores.ptask,
        CONFIGURACAO.cores.alertasQa,
        CONFIGURACAO.cores.alertasPrd,
        CONFIGURACAO.cores.incHw,
        CONFIGURACAO.cores.america
      ],
      stroke: {
        curve: 'smooth',
        width: 3,
        lineCap: 'round'
      },
      markers: {
        size: 4,
        strokeWidth: 2,
        strokeColors: '#fff',
        hover: { size: 7 }
      },
      dataLabels: { enabled: false },
      grid: {
        borderColor: CONFIGURACAO.cores.grade,
        strokeDashArray: 4,
        padding: { top: 6, right: 8, left: 6 }
      },
      xaxis: {
        categories: dados.categorias,
        axisBorder: { show: false },
        axisTicks: { show: false },
        labels: { rotate: 0, hideOverlappingLabels: true }
      },
      yaxis: {
        min: 0,
        forceNiceScale: true,
        labels: {
          formatter: function (valor) {
            return Math.round(valor).toString();
          }
        }
      },
      tooltip: {
        shared: true,
        intersect: false,
        y: {
          formatter: function (valor) {
            return Math.round(valor).toString();
          }
        }
      },
      legend: { show: false }
    };

    const grafico = renderizarGrafico('evolucaoSemanal', elemento, opcoes);
    if (!grafico) return null;

    // O gráfico nasce com os três indicadores executivos selecionados.
    ['RITMs', 'PRBs', 'PTASK', 'Inc. HW', 'América'].forEach(function (nome) {
      grafico.hideSeries(nome);
    });

    document.querySelectorAll('.filtro-indicador').forEach(function (botao) {
      botao.addEventListener('click', function () {
        const nome = botao.dataset.serie;
        const estaAtivo = botao.classList.toggle('ativo');

        if (estaAtivo) {
          grafico.showSeries(nome);
        } else {
          grafico.hideSeries(nome);
        }
      });
    });

    return grafico;
  }

  /* =========================================================
     PRÓXIMOS MÓDULOS
     Placeholders intencionais: recebem os dados futuros sem
     interferir no dashboard enquanto as seções não são criadas.
  ========================================================= */

  function criarGraficoIniciativas() {
    return null;
  }

  function criarGraficoMudancas() {
    return null;
  }

  function criarGraficoAlertas() {
    return null;
  }

  function criarGraficoProblemas() {
    return null;
  }

  function configurarTabelaEvolucao() {
    const botao = obterElemento('#alternarTabelaEvolucao');
    const tabela = obterElemento('#tabelaEvolucaoSemanal');
    if (!botao || !tabela || botao.dataset.configurado === 'true') return;

    botao.dataset.configurado = 'true';
    botao.addEventListener('click', function () {
      const estaVisivel = tabela.classList.toggle('visivel');
      botao.classList.toggle('ativo', estaVisivel);
      botao.setAttribute('aria-expanded', String(estaVisivel));
      tabela.setAttribute('aria-hidden', String(!estaVisivel));

      const texto = botao.querySelector('span');
      if (texto) texto.textContent = estaVisivel ? 'Ocultar dados' : 'Ver dados';
    });
  }

  /* =========================================================
     INICIALIZAÇÃO
  ========================================================= */

  carregarHistoricoDisponibilidade();
  carregarHistoricoEvolucaoSemanal();

  function inicializarDashboard() {
    if (possuiHistoricoDisponibilidade) atualizarResumoDisponibilidade();
    atualizarResumoMttr();
    atualizarDetalhesEvolucaoSemanal();
    atualizarGestaoFornecedores();
    atualizarIniciativas();
    atualizarMudancasTarefas();
    atualizarInformacoesRelevantes();
    atualizarNotaEditorial();
    criarGraficoDisponibilidade();
    criarGaugeDisponibilidade();
    criarGaugeMttr();
    criarGraficoMttrMensal();
    criarGraficoEvolucaoSemanal();
    criarGraficoIniciativas();
    criarGraficoMudancas();
    criarGraficoAlertas();
    criarGraficoProblemas();
    configurarTabelaEvolucao();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inicializarDashboard, { once: true });
  } else {
    inicializarDashboard();
  }

  // API pública pequena para atualização e depuração futura.
  window.DashboardOperacoes = Object.freeze({
    dados: DADOS,
    inicializar: inicializarDashboard,
    criarGraficoDisponibilidade: criarGraficoDisponibilidade,
    criarGaugeDisponibilidade: criarGaugeDisponibilidade,
    criarGaugeMttr: criarGaugeMttr,
    criarGraficoMttrMensal: criarGraficoMttrMensal,
    criarGraficoEvolucaoSemanal: criarGraficoEvolucaoSemanal,
    destruirGrafico: destruirGrafico
  });
})(window, document);
