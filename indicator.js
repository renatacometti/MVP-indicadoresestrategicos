document.querySelectorAll('[data-collapsible] .section-heading').forEach(button => {
  button.addEventListener('click', () => {
    const section = button.closest('[data-collapsible]');
    const collapsed = section.classList.toggle('collapsed');
    button.setAttribute('aria-expanded', String(!collapsed));
  });
});
