(function (window, document) {
  'use strict';

  const CHAVE = 'dashboardInfraCloudConfiguracoes';
  const BASE_DISPONIBILIDADE = { mes: 'Ago', incidentes: 1, impacto: 104, disponibilidade: 99.76 };

  function lerDados() {
    try { return JSON.parse(window.localStorage.getItem(CHAVE)) || {}; }
    catch (erro) { return {}; }
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

  document.addEventListener('DOMContentLoaded', function () {
    if (new URLSearchParams(window.location.search).get('imprimir') === '1') {
      window.setTimeout(function () { window.print(); }, 700);
    }

    const formularios = document.querySelectorAll('[data-form-configuracao]');
    configurarDisponibilidade();
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
