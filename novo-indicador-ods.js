const odsProperties = document.querySelector('#odsProperties');
const odsPropertiesToggle = document.querySelector('#toggleOdsProperties');
const odsPageSelect = document.querySelector('#odsPageSelect');
const odsPageButton = document.querySelector('#odsPageButton');
const odsPageOptions = document.querySelector('#odsPageOptions');
const odsPageSearch = document.querySelector('#odsPageSearch');
const odsPageCheckboxes = [...odsPageOptions.querySelectorAll('input[type="checkbox"]')];
const saveOdsPage = document.querySelector('#saveOdsPage');

odsPropertiesToggle.addEventListener('click', () => {
  const collapsed = odsProperties.classList.toggle('collapsed');
  odsPropertiesToggle.setAttribute('aria-expanded', String(!collapsed));
});

function updateOdsPageSelection() {
  const selected = odsPageCheckboxes.filter(checkbox => checkbox.checked);
  document.querySelector('#odsPageCount').textContent = selected.length;
  document.querySelector('#odsPageValue').textContent = selected.length === 0
    ? 'Selecionar...'
    : selected.length === 1 ? selected[0].value : `${selected.length} objetivos selecionados`;
  saveOdsPage.disabled = selected.length === 0;
}

function closeOdsPageOptions() {
  odsPageOptions.hidden = true;
  odsPageButton.setAttribute('aria-expanded', 'false');
}

odsPageButton.addEventListener('click', () => {
  const willOpen = odsPageOptions.hidden;
  odsPageOptions.hidden = !willOpen;
  odsPageButton.setAttribute('aria-expanded', String(willOpen));
  if (willOpen) setTimeout(() => odsPageSearch.focus(), 20);
});

document.addEventListener('click', event => {
  if (!odsPageSelect.contains(event.target)) closeOdsPageOptions();
});

odsPageCheckboxes.forEach(checkbox => checkbox.addEventListener('change', updateOdsPageSelection));
odsPageSearch.addEventListener('input', () => {
  const term = odsPageSearch.value.trim().toLocaleLowerCase('pt-BR');
  odsPageCheckboxes.forEach(checkbox => {
    checkbox.closest('label').hidden = !checkbox.value.toLocaleLowerCase('pt-BR').includes(term);
  });
});

document.querySelector('#odsPageForm').addEventListener('reset', () => {
  setTimeout(() => {
    odsPageSearch.value = '';
    odsPageCheckboxes.forEach(checkbox => { checkbox.closest('label').hidden = false; });
    updateOdsPageSelection();
    closeOdsPageOptions();
  });
});

document.querySelector('#odsPageForm').addEventListener('submit', event => {
  event.preventDefault();
  const current = JSON.parse(localStorage.getItem('selectedOds') || '[]');
  const byCode = new Map(current.map(item => [item.code, item]));
  odsPageCheckboxes.filter(checkbox => checkbox.checked).forEach(checkbox => {
    byCode.set(checkbox.dataset.code, { name: checkbox.value, code: checkbox.dataset.code });
  });
  localStorage.setItem('selectedOds', JSON.stringify([...byCode.values()]));
  window.location.href = 'index.html?tab=ods';
});
