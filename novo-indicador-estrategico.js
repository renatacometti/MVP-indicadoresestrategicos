const form = document.querySelector('#strategicFilterForm');
const axis = document.querySelector('#strategicAxis');
const area = document.querySelector('#strategicArea');
const areaButton = document.querySelector('#strategicAreaButton');
const areaPanel = document.querySelector('#strategicAreaOptions');
const areaCheckboxes = [...areaPanel.querySelectorAll('input[type="checkbox"]')];
const challenge = document.querySelector('#strategicChallenge');
const challengeButton = document.querySelector('#strategicChallengeButton');
const challengePanel = document.querySelector('#strategicChallengeOptions');
const challengeCheckboxes = [...challengePanel.querySelectorAll('input[type="checkbox"]')];
const indicator = document.querySelector('#strategicIndicator');
const indicatorButton = document.querySelector('#strategicIndicatorButton');
const indicatorPanel = document.querySelector('#strategicIndicatorOptions');
const indicatorCheckboxes = [...indicatorPanel.querySelectorAll('.indicator-option input[type="checkbox"]')];
const selectAllIndicators = document.querySelector('#selectAllIndicators');
const indicatorSearch = document.querySelector('#strategicIndicatorSearch');
const result = document.querySelector('#strategicResult');
const resultTitle = document.querySelector('#strategicResultTitle');
const properties = document.querySelector('#strategicProperties');
const propertiesToggle = document.querySelector('#toggleStrategicProperties');
const selectedIndicators = document.querySelector('#selectedIndicators');
const selectedIndicatorCards = document.querySelector('#selectedIndicatorCards');
const saveStrategicIndicators = document.querySelector('#saveStrategicIndicators');
const undoStrategicIndicators = document.querySelector('#undoStrategicIndicators');

const indicatorCatalog = {
  'Taxa de roubos a pessoa em via pública por 100 mil habitantes': {
    source: 'SESP', unit: 'Taxa por 100 mil habitantes', base: '2026 (161.25)',
    goals: [['2023', '161.25'], ['2024', '154.48'], ['2025', '147.99'], ['2026', '141.78']]
  },
  'Número de matrículas em educação profissional técnica de nível médio na rede pública estadual e privada com bolsa': {
    source: 'SEDU', unit: 'Alunos matriculados', base: '2026 (7500)',
    goals: [['2024', '—'], ['2025', '7300'], ['2026', '7500']]
  },
  'Percentual de reincidência': {
    source: 'SEJUS', unit: 'Percentual', base: '2026 (30%)',
    goals: [['2024', '34%'], ['2025', '32%'], ['2026', '30%']]
  },
  'Taxa de roubos em estabelecimento comercial por 100 mil habitantes': {
    source: 'SESP', unit: 'Taxa por 100 mil habitantes', base: '2026 (45.2)',
    goals: [['2024', '52.8'], ['2025', '49.0'], ['2026', '45.2']]
  },
  'Percentual de adolescentes/jovens que estão matriculados nas instituições de ensino': {
    source: 'SEDU', unit: 'Percentual', base: '2026 (98%)',
    goals: [['2024', '94%'], ['2025', '96%'], ['2026', '98%']]
  }
};

propertiesToggle.addEventListener('click', () => {
  const collapsed = properties.classList.toggle('collapsed');
  propertiesToggle.setAttribute('aria-expanded', String(!collapsed));
});

function closePanel(panel, button) {
  panel.hidden = true;
  button.setAttribute('aria-expanded', 'false');
}

function updateIndicatorSelection() {
  const selected = indicatorCheckboxes.filter(checkbox => checkbox.checked);
  document.querySelector('#strategicIndicatorValue').textContent = selected.length === 0
    ? 'Selecionar...'
    : selected.length === 1 ? selected[0].value : `${selected.length} indicadores selecionados`;
  selectAllIndicators.checked = selected.length === indicatorCheckboxes.length;
  selectAllIndicators.indeterminate = selected.length > 0 && selected.length < indicatorCheckboxes.length;
  renderSelectedIndicators();
  result.hidden = true;
}

function renderSelectedIndicators() {
  const selected = indicatorCheckboxes.filter(checkbox => checkbox.checked);
  selectedIndicators.hidden = selected.length === 0;
  selectedIndicatorCards.replaceChildren();

  selected.forEach(checkbox => {
    const details = indicatorCatalog[checkbox.value];
    const card = document.createElement('article');
    card.className = 'selected-indicator-card';
    card.innerHTML = `
      <div class="selected-card-header"><h3></h3><button type="button" aria-label="Remover indicador">×</button></div>
      <div class="selected-card-meta">
        <p><b>Fonte:</b> <span class="source"></span></p>
        <p><b>Unidade de medida:</b> <span class="unit"></span></p>
        <p><b>Base de referência:</b> <span class="base"></span></p>
      </div>
      <strong class="selected-card-label">Meta:</strong>
      <div class="indicator-meta-grid"></div>
      <strong class="selected-card-label">Meta do projeto:</strong>
      <div class="project-goals-grid"></div>`;
    card.querySelector('h3').textContent = checkbox.value;
    card.querySelector('.source').textContent = details.source;
    card.querySelector('.unit').textContent = details.unit;
    card.querySelector('.base').textContent = details.base;
    details.goals.forEach(([year, value]) => {
      const goal = document.createElement('div');
      goal.className = 'indicator-meta';
      goal.innerHTML = '<span></span><b></b>';
      goal.querySelector('span').textContent = year;
      goal.querySelector('b').textContent = value;
      card.querySelector('.indicator-meta-grid').append(goal);
    });
    ['2026', '2027', '2028', '2029'].forEach(year => {
      const goal = document.createElement('label');
      goal.className = 'project-goal';
      goal.innerHTML = '<span></span><input type="text" inputmode="decimal" placeholder="Digite a meta">';
      goal.querySelector('span').textContent = year;
      goal.querySelector('input').setAttribute('aria-label', `Meta do projeto ${year} para ${checkbox.value}`);
      card.querySelector('.project-goals-grid').append(goal);
    });
    card.querySelector('.selected-card-header button').addEventListener('click', () => {
      checkbox.checked = false;
      updateIndicatorSelection();
    });
    selectedIndicatorCards.append(card);
  });
}

function setIndicatorEnabled(enabled) {
  indicator.classList.toggle('disabled', !enabled);
  indicatorButton.disabled = !enabled;
  indicatorCheckboxes.forEach(checkbox => { checkbox.checked = false; });
  selectAllIndicators.checked = false;
  indicatorSearch.value = '';
  indicatorCheckboxes.forEach(checkbox => { checkbox.closest('label').hidden = false; });
  updateIndicatorSelection();
  closePanel(indicatorPanel, indicatorButton);
}

function updateChallengeSelection() {
  const selected = challengeCheckboxes.filter(checkbox => checkbox.checked);
  document.querySelector('#strategicChallengeValue').textContent = selected.length === 0
    ? 'Selecionar...'
    : selected.length === 1 ? selected[0].value : `${selected.length} desafios selecionados`;
  setIndicatorEnabled(selected.length > 0);
  result.hidden = true;
}

function setChallengeEnabled(enabled) {
  challenge.classList.toggle('disabled', !enabled);
  challengeButton.disabled = !enabled;
  challengeCheckboxes.forEach(checkbox => { checkbox.checked = false; });
  updateChallengeSelection();
  closePanel(challengePanel, challengeButton);
}

function updateAreaSelection() {
  const selected = areaCheckboxes.filter(checkbox => checkbox.checked);
  document.querySelector('#strategicAreaValue').textContent = selected.length === 0
    ? 'Selecionar...'
    : selected.length === 1 ? selected[0].value : `${selected.length} áreas selecionadas`;
  setChallengeEnabled(selected.length > 0);
  result.hidden = true;
}

function setAreaEnabled(enabled) {
  area.classList.toggle('disabled', !enabled);
  areaButton.disabled = !enabled;
  areaCheckboxes.forEach(checkbox => { checkbox.checked = false; });
  updateAreaSelection();
  closePanel(areaPanel, areaButton);
}

areaButton.addEventListener('click', () => {
  if (areaButton.disabled) return;
  closePanel(challengePanel, challengeButton);
  closePanel(indicatorPanel, indicatorButton);
  const willOpen = areaPanel.hidden;
  areaPanel.hidden = !willOpen;
  areaButton.setAttribute('aria-expanded', String(willOpen));
});
challengeButton.addEventListener('click', () => {
  if (challengeButton.disabled) return;
  closePanel(areaPanel, areaButton);
  closePanel(indicatorPanel, indicatorButton);
  const willOpen = challengePanel.hidden;
  challengePanel.hidden = !willOpen;
  challengeButton.setAttribute('aria-expanded', String(willOpen));
});
indicatorButton.addEventListener('click', () => {
  if (indicatorButton.disabled) return;
  closePanel(areaPanel, areaButton);
  closePanel(challengePanel, challengeButton);
  const willOpen = indicatorPanel.hidden;
  indicatorPanel.hidden = !willOpen;
  indicatorButton.setAttribute('aria-expanded', String(willOpen));
  if (willOpen) setTimeout(() => indicatorSearch.focus(), 20);
});

areaCheckboxes.forEach(checkbox => checkbox.addEventListener('change', updateAreaSelection));
challengeCheckboxes.forEach(checkbox => checkbox.addEventListener('change', updateChallengeSelection));
indicatorCheckboxes.forEach(checkbox => checkbox.addEventListener('change', updateIndicatorSelection));
selectAllIndicators.addEventListener('change', () => {
  indicatorCheckboxes.filter(checkbox => !checkbox.closest('label').hidden).forEach(checkbox => {
    checkbox.checked = selectAllIndicators.checked;
  });
  updateIndicatorSelection();
});
indicatorSearch.addEventListener('input', () => {
  const term = indicatorSearch.value.trim().toLocaleLowerCase('pt-BR');
  indicatorCheckboxes.forEach(checkbox => {
    checkbox.closest('label').hidden = !checkbox.value.toLocaleLowerCase('pt-BR').includes(term);
  });
});
document.addEventListener('click', event => {
  if (!area.contains(event.target)) closePanel(areaPanel, areaButton);
  if (!challenge.contains(event.target)) closePanel(challengePanel, challengeButton);
  if (!indicator.contains(event.target)) closePanel(indicatorPanel, indicatorButton);
});

axis.addEventListener('change', () => {
  setAreaEnabled(Boolean(axis.value));
  result.hidden = true;
});

form.addEventListener('reset', () => {
  setTimeout(() => {
    setAreaEnabled(false);
    setChallengeEnabled(false);
    setIndicatorEnabled(false);
    result.hidden = true;
  });
});

form.addEventListener('submit', event => {
  event.preventDefault();
  resultTitle.textContent = 'Filtro aplicado';
  const labels = [];
  if (axis.value) labels.push(axis.options[axis.selectedIndex].text);
  const selectedAreas = areaCheckboxes.filter(checkbox => checkbox.checked).map(checkbox => checkbox.value);
  if (selectedAreas.length) labels.push(selectedAreas.join(', '));
  const selectedChallenges = challengeCheckboxes.filter(checkbox => checkbox.checked).map(checkbox => checkbox.value);
  if (selectedChallenges.length) labels.push(selectedChallenges.join(', '));
  const selectedIndicators = indicatorCheckboxes.filter(checkbox => checkbox.checked).map(checkbox => checkbox.value);
  if (selectedIndicators.length) labels.push(selectedIndicators.join(', '));
  document.querySelector('#strategicResultText').textContent = labels.length ? labels.join(' • ') : 'Selecione pelo menos um eixo para continuar.';
  result.hidden = false;
});

saveStrategicIndicators.addEventListener('click', () => {
  const selected = indicatorCheckboxes.filter(checkbox => checkbox.checked);
  if (!selected.length) return;
  const savedIndicators = selected.map(checkbox => {
    const details = indicatorCatalog[checkbox.value];
    const projectGoals = [...selectedIndicatorCards.querySelectorAll('.selected-indicator-card')]
      .find(card => card.querySelector('h3').textContent === checkbox.value)
      ?.querySelectorAll('.project-goal input');
    return {
      name: checkbox.value,
      code: `EST${String(Object.keys(indicatorCatalog).indexOf(checkbox.value) + 1).padStart(4, '0')}`,
      source: details.source,
      unit: details.unit,
      base: details.base,
      goals: details.goals,
      projectGoals: projectGoals ? [...projectGoals].map(input => input.value.trim()) : []
    };
  });

  try {
    const current = JSON.parse(localStorage.getItem('selectedStrategicIndicators') || '[]');
    const byCode = new Map(current.map(item => [item.code, item]));
    savedIndicators.forEach(item => byCode.set(item.code, item));
    localStorage.setItem('selectedStrategicIndicators', JSON.stringify([...byCode.values()]));
  } catch (error) { /* o envio pela URL mantém o fluxo disponível em file:// */ }

  const payload = encodeURIComponent(JSON.stringify(savedIndicators));
  window.location.href = `index.html?strategic=${payload}`;
});

undoStrategicIndicators.addEventListener('click', () => {
  form.reset();
  document.querySelector('#strategicAxis').focus();
});
