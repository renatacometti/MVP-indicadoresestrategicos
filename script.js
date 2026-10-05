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

document.querySelectorAll('[data-accordion] > .indicator-group-heading').forEach(button => {
  button.addEventListener('click', () => {
    const group = button.closest('[data-accordion]');
    const collapsed = group.classList.toggle('collapsed');
    button.setAttribute('aria-expanded', String(!collapsed));
  });
});

const searchBox = document.querySelector('#searchBox');
const searchInput = document.querySelector('#indicatorSearch');
document.querySelector('#searchToggle').addEventListener('click', () => {
  searchBox.classList.toggle('open');
  if (searchBox.classList.contains('open')) searchInput.focus();
});

function filterCards() {
  const term = searchInput.value.trim().toLowerCase();
  const status = document.querySelector('#statusFilter').value;
  let visible = 0;
  document.querySelectorAll('.indicator-card').forEach(card => {
    const matchesText = card.textContent.toLowerCase().includes(term);
    const matchesStatus = status === 'all' || card.dataset.status === status;
    card.hidden = !(matchesText && matchesStatus);
    if (!card.hidden) visible++;
  });
  document.querySelectorAll('.indicator-group').forEach(group => {
    const groupCards = [...group.querySelectorAll('.indicator-card')];
    const groupVisible = groupCards.filter(card => !card.hidden).length;
    const empty = group.querySelector('.empty-state');
    empty.classList.toggle('show', groupCards.length > 0 && groupVisible === 0);
  });
}
searchInput.addEventListener('input', filterCards);
document.querySelector('#statusFilter').addEventListener('change', filterCards);

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
document.querySelector('#addTop').addEventListener('click', () => { window.location.href = 'novo-indicador.html'; });
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
  const total = odsGroup.querySelectorAll('.indicator-card').length;
  odsGroup.querySelector('.indicator-group-heading small').textContent = total;
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
  odsGroup.querySelector('.indicator-group-heading small').textContent = odsGroup.querySelectorAll('.indicator-card').length;
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
const strategicTotal = strategicGroup.querySelectorAll('.indicator-card').length;
strategicGroup.querySelector('.indicator-group-heading small').textContent = strategicTotal;
if (strategicTotal) {
  strategicGroup.classList.remove('collapsed');
  strategicGroup.querySelector('.indicator-group-heading').setAttribute('aria-expanded', 'true');
}
if (strategicParams.has('strategic')) {
  try { history.replaceState(null, '', window.location.pathname); } catch (error) { /* file preview */ }
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
  const count = targetGroup.querySelectorAll('.indicator-card').length;
  targetGroup.querySelector('.indicator-group-heading small').textContent = count;
  targetGroup.querySelector('.empty-state').classList.remove('show');
  targetGroup.classList.remove('collapsed');
  targetGroup.querySelector('.indicator-group-heading').setAttribute('aria-expanded', 'true');
  document.querySelector('#indicatorForm').reset();
  dialog.close();
  filterCards();
});

document.querySelector('.star').addEventListener('click', event => {
  const on = event.currentTarget.classList.toggle('favorited');
  event.currentTarget.textContent = on ? '★' : '☆';
  event.currentTarget.style.color = on ? '#e89a16' : '#919ba0';
});

