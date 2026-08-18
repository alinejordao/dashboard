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
        max: 5500,
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
    criarGraficoMigracoes();
    criarGaugeJornada('#coeGaugePrograma', 25, '#8b5fd3', '#6f42c1');
    criarGaugeJornada('#coeGaugeMeta', 63, '#58a6ff', '#2f80ed');
    renderizarContratos();

    // Recalcula as dimensões após o menu e o layout concluírem suas transições.
    [250, 850].forEach((atraso) => {
      window.setTimeout(() => window.dispatchEvent(new Event('resize')), atraso);
    });
  }

  document.addEventListener('DOMContentLoaded', inicializarDashboardCoe);
})();
