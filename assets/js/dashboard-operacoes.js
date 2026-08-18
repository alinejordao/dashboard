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

  function inicializarDashboard() {
    if (possuiHistoricoDisponibilidade) atualizarResumoDisponibilidade();
    atualizarResumoMttr();
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
