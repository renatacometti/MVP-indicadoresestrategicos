const odsProperties = document.querySelector('#odsProperties');
const odsPropertiesToggle = document.querySelector('#toggleOdsProperties');
const odsPageSearch = document.querySelector('#odsPageSearch');
const odsPageCheckboxes = [...document.querySelectorAll('#odsPageOptions input[type="checkbox"]')];
const saveOdsPage = document.querySelector('#saveOdsPage');

odsPropertiesToggle.addEventListener('click', () => {
  const collapsed = odsProperties.classList.toggle('collapsed');
  odsPropertiesToggle.setAttribute('aria-expanded', String(!collapsed));
});

function updateOdsPageSelection() {
  const selected = odsPageCheckboxes.filter(checkbox => checkbox.checked).length;
  document.querySelector('#odsPageCount').textContent = selected;
  saveOdsPage.disabled = selected === 0;
}

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
  window.location.href = 'index.html';
});
