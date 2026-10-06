const sidebar = document.querySelector('#sidebar');
document.querySelector('#collapseSidebar').addEventListener('click', () => sidebar.classList.add('collapsed'));
document.querySelector('#openSidebar').addEventListener('click', () => sidebar.classList.remove('collapsed'));

document.querySelectorAll('[data-expand]').forEach(button => {
  button.addEventListener('click', () => {
    const group = document.querySelector(`#${button.dataset.expand}`);
    group.classList.toggle('open');
    button.querySelector('b').textContent = group.classList.contains('open') ? '⌄' : '›';
  });
});

document.querySelectorAll('.tabs button').forEach(tab => tab.addEventListener('click', () => {
  document.querySelector('.tabs button.active')?.classList.remove('active');
  tab.classList.add('active');
}));

const tabs = document.querySelector('#tabs');
document.querySelector('.tabs-arrow.left').addEventListener('click', () => tabs.scrollBy({left:-260, behavior:'smooth'}));
document.querySelector('.tabs-arrow.right').addEventListener('click', () => tabs.scrollBy({left:260, behavior:'smooth'}));

const cards = document.querySelector('#cards');
document.querySelectorAll('.view-switch').forEach(button => button.addEventListener('click', () => {
  document.querySelector('.view-switch.active')?.classList.remove('active');
  button.classList.add('active');
  document.querySelectorAll('.cards').forEach(groupCards => groupCards.classList.toggle('list', button.dataset.view === 'list'));
}));

const indicatorCategoryTabs = [...document.querySelectorAll('[data-indicator-tab]')];

function activateIndicatorTab(group, focus = false) {
  indicatorCategoryTabs.forEach(button => {
    const active = button.dataset.indicatorTab === group;
    button.setAttribute('aria-selected', String(active));
    button.tabIndex = active ? 0 : -1;
    document.querySelector(`.indicator-group[data-group="${button.dataset.indicatorTab}"]`).hidden = !active;
    if (active && focus) button.focus();
  });
}

indicatorCategoryTabs.forEach((button, index) => {
  button.addEventListener('click', () => activateIndicatorTab(button.dataset.indicatorTab));
  button.addEventListener('keydown', event => {
    let nextIndex = index;
    if (event.key === 'ArrowRight') nextIndex = (index + 1) % indicatorCategoryTabs.length;
    else if (event.key === 'ArrowLeft') nextIndex = (index - 1 + indicatorCategoryTabs.length) % indicatorCategoryTabs.length;
    else if (event.key === 'Home') nextIndex = 0;
    else if (event.key === 'End') nextIndex = indicatorCategoryTabs.length - 1;
    else return;
    event.preventDefault();
    activateIndicatorTab(indicatorCategoryTabs[nextIndex].dataset.indicatorTab, true);
  });
});

const indicatorTabParams = new URLSearchParams(window.location.search);
const requestedIndicatorTab = indicatorTabParams.has('strategic') ? 'strategic' : indicatorTabParams.get('tab');
activateIndicatorTab(indicatorCategoryTabs.some(button => button.dataset.indicatorTab === requestedIndicatorTab) ? requestedIndicatorTab : 'project');

function filterGroupCards(group) {
  const searchInput = group.querySelector('.group-indicator-search');
  const term = searchInput.value.trim().toLocaleLowerCase('pt-BR');
  const status = group.querySelector('.group-status-filter').value;
  const groupCards = [...group.querySelectorAll('.indicator-card')];
  groupCards.forEach(card => {
    const matchesText = card.textContent.toLowerCase().includes(term);
    const matchesStatus = status === 'all' || card.dataset.status === status;
    card.hidden = !(matchesText && matchesStatus);
  });
  const groupVisible = groupCards.filter(card => !card.hidden).length;
  group.querySelector('.empty-state').classList.toggle('show', groupVisible === 0);
}

document.querySelectorAll('.indicator-group').forEach(group => {
  const searchBox = group.querySelector('.group-search-box');
  const searchInput = group.querySelector('.group-indicator-search');
  group.querySelector('.group-search-toggle').addEventListener('click', () => {
    searchBox.classList.toggle('open');
    if (searchBox.classList.contains('open')) searchInput.focus();
  });
  searchInput.addEventListener('input', () => filterGroupCards(group));
  group.querySelector('.group-status-filter').addEventListener('change', () => filterGroupCards(group));
});

const dialog = document.querySelector('#indicatorDialog');
function openDialog(group = 'project') {
  document.querySelector('#indicatorGroup').value = group;
  dialog.showModal();
  setTimeout(() => document.querySelector('#indicatorName').focus(), 30);
}
document.querySelectorAll('.group-add').forEach(button => button.addEventListener('click', () => {
  if (button.dataset.group === 'ods') {
    document.querySelector('#odsDialog').showModal();
    setTimeout(() => document.querySelector('#odsSearch').focus(), 30);
  } else {
    openDialog(button.dataset.group);
  }
}));
document.querySelectorAll('[data-close-dialog]').forEach(button => button.addEventListener('click', () => dialog.close()));

const odsDialog = document.querySelector('#odsDialog');
const odsSearch = document.querySelector('#odsSearch');
const odsCheckboxes = [...document.querySelectorAll('#odsOptions input[type="checkbox"]')];
const odsAddButton = document.querySelector('#addSelectedOds');

function closeOdsDialog() {
  odsDialog.close();
  odsSearch.value = '';
  odsCheckboxes.forEach(checkbox => { checkbox.checked = false; checkbox.closest('label').hidden = false; });
  updateOdsSelection();
}

function updateOdsSelection() {
  const selected = odsCheckboxes.filter(checkbox => checkbox.checked).length;
  document.querySelector('#odsSelectedCount').textContent = selected;
  odsAddButton.disabled = selected === 0;
}

document.querySelector('#closeOdsDialog').addEventListener('click', closeOdsDialog);
document.querySelector('#cancelOds').addEventListener('click', closeOdsDialog);
odsCheckboxes.forEach(checkbox => checkbox.addEventListener('change', updateOdsSelection));
odsSearch.addEventListener('input', () => {
  const term = odsSearch.value.trim().toLocaleLowerCase('pt-BR');
  odsCheckboxes.forEach(checkbox => {
    checkbox.closest('label').hidden = !checkbox.value.toLocaleLowerCase('pt-BR').includes(term);
  });
});

odsAddButton.addEventListener('click', () => {
  const odsGroup = document.querySelector('.indicator-group[data-group="ods"]');
  const odsCards = odsGroup.querySelector('.cards');
  odsCheckboxes.filter(checkbox => checkbox.checked).forEach(checkbox => {
    const article = document.createElement('article');
    article.className = 'indicator-card ods-card';
    article.dataset.status = 'active';
    article.innerHTML = '<button class="more" aria-label="Mais opções">⋮</button><div class="gear-symbol" aria-hidden="true">⚙</div><h2></h2><small></small>';
    article.querySelector('h2').textContent = checkbox.value;
    article.querySelector('small').textContent = checkbox.dataset.code;
    odsCards.insertBefore(article, odsGroup.querySelector('.group-add'));
    checkbox.closest('label').remove();
  });
  closeOdsDialog();
});

try {
  const savedOds = JSON.parse(localStorage.getItem('selectedOds') || '[]');
  const odsGroup = document.querySelector('.indicator-group[data-group="ods"]');
  const odsCards = odsGroup.querySelector('.cards');
  const existingCodes = new Set([...odsGroup.querySelectorAll('.indicator-card small')].map(item => item.textContent.trim()));
  savedOds.forEach(item => {
    if (existingCodes.has(item.code)) return;
    const article = document.createElement('article');
    article.className = 'indicator-card ods-card';
    article.dataset.status = 'active';
    article.innerHTML = '<button class="more" aria-label="Mais opções">⋮</button><div class="gear-symbol" aria-hidden="true">⚙</div><h2></h2><small></small>';
    article.querySelector('h2').textContent = item.name;
    article.querySelector('small').textContent = item.code;
    odsCards.insertBefore(article, odsGroup.querySelector('.ods-add'));
  });
} catch (error) {
  localStorage.removeItem('selectedOds');
}

function createStrategicCard(item) {
  const article = document.createElement('article');
  article.className = 'indicator-card ods-card strategic-card';
  article.dataset.status = 'active';
  article.innerHTML = '<button class="more" aria-label="Mais opções">⋮</button><div class="gear-symbol" aria-hidden="true">⚙</div><h2></h2><small></small>';
  article.querySelector('h2').textContent = item.name;
  article.querySelector('small').textContent = item.code;
  return article;
}

const strategicGroup = document.querySelector('.indicator-group[data-group="strategic"]');
const strategicCards = strategicGroup.querySelector('.cards');
const strategicParams = new URLSearchParams(window.location.search);
let savedStrategic = [];
let incomingStrategic = [];
try { savedStrategic = JSON.parse(localStorage.getItem('selectedStrategicIndicators') || '[]'); } catch (error) { savedStrategic = []; }
try { incomingStrategic = JSON.parse(strategicParams.get('strategic') || '[]'); } catch (error) { incomingStrategic = []; }
if (!Array.isArray(savedStrategic)) savedStrategic = [];
if (!Array.isArray(incomingStrategic)) incomingStrategic = [];
const strategicByCode = new Map(savedStrategic.map(item => [item.code, item]));
incomingStrategic.forEach(item => strategicByCode.set(item.code, item));
savedStrategic = [...strategicByCode.values()];
try { localStorage.setItem('selectedStrategicIndicators', JSON.stringify(savedStrategic)); } catch (error) { /* file preview */ }
savedStrategic.forEach(item => {
  strategicCards.insertBefore(createStrategicCard(item), strategicGroup.querySelector('.strategic-add'));
});
if (strategicParams.has('strategic')) {
  try { history.replaceState(null, '', window.location.pathname); } catch (error) { /* file preview */ }
}

const es500Group = document.querySelector('.indicator-group[data-group="es500"]');
const es500Cards = es500Group.querySelector('.cards');
try {
  const savedEs500 = JSON.parse(localStorage.getItem('selectedEs500Indicators') || '[]');
  if (Array.isArray(savedEs500)) {
    savedEs500.forEach(item => {
      const article = document.createElement('article');
      article.className = 'indicator-card ods-card es500-card';
      article.dataset.status = 'active';
      article.title = item.meta;
      article.innerHTML = '<button class="more" aria-label="Mais opções">⋮</button><div class="gear-symbol" aria-hidden="true">⚙</div><h2></h2><small></small>';
      article.querySelector('h2').textContent = item.indicator;
      article.querySelector('small').textContent = item.mission;
      es500Cards.insertBefore(article, es500Group.querySelector('.es500-add'));
    });
  }
} catch (error) {
  localStorage.removeItem('selectedEs500Indicators');
}

document.querySelector('#saveIndicator').addEventListener('click', event => {
  event.preventDefault();
  const name = document.querySelector('#indicatorName');
  const code = document.querySelector('#indicatorCode');
  if (!name.value.trim()) { name.reportValidity(); return; }
  const article = document.createElement('article');
  article.className = 'indicator-card';
  article.dataset.status = 'active';
  article.innerHTML = `<button class="more" aria-label="Mais opções">⋮</button><div class="gauge" aria-hidden="true"><span></span></div><h2></h2><small></small>`;
  article.querySelector('h2').textContent = name.value.trim();
  article.querySelector('small').textContent = code.value.trim() || String(Date.now()).slice(-6);
  const targetGroup = document.querySelector(`.indicator-group[data-group="${document.querySelector('#indicatorGroup').value}"]`);
  const targetCards = targetGroup.querySelector('.cards');
  targetCards.insertBefore(article, targetGroup.querySelector('.group-add'));
  targetGroup.querySelector('.empty-state').classList.remove('show');
  activateIndicatorTab(targetGroup.dataset.group);
  document.querySelector('#indicatorForm').reset();
  dialog.close();
  filterGroupCards(targetGroup);
});

document.querySelector('.star').addEventListener('click', event => {
  const on = event.currentTarget.classList.toggle('favorited');
  event.currentTarget.textContent = on ? '★' : '☆';
  event.currentTarget.style.color = on ? '#e89a16' : '#919ba0';
});

document.querySelectorAll('.indicator-group').forEach(filterGroupCards);

