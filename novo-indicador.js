const form = document.querySelector('#newIndicatorForm');

function updateRequiredState(field) {
  const wrapper = field.closest('.new-field');
  const filled = field.value.trim().length > 0;
  wrapper.classList.toggle('valid', filled);
  wrapper.classList.toggle('invalid', !filled);
  return filled;
}

form.querySelectorAll('[required]').forEach(field => {
  field.addEventListener('input', () => updateRequiredState(field));
  field.addEventListener('blur', () => updateRequiredState(field));
});

form.addEventListener('submit', event => {
  event.preventDefault();
  const requiredFields = [...form.querySelectorAll('[required]')];
  const isValid = requiredFields.map(updateRequiredState).every(Boolean);
  if (!isValid) {
    requiredFields.find(field => !field.value.trim())?.focus();
    return;
  }
  window.location.href = 'index.html';
});
