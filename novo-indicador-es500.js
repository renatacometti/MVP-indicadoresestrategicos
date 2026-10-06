const es500Catalog = {
  1: [
    ['Alcançar o top 5 estados em complexidade econômica', 'Índice de Complexidade Econômica Regional (ECI-R)'],
    ['Reduzir a taxa de pobreza para menos de 10%', 'Taxa de pobreza — Espírito Santo'],
    ['Posicionar o Espírito Santo entre os 5 estados mais inovadores', 'Índice FIEC de Inovação dos Estados'],
    ['Alcançar o top 5 em rendimento mensal domiciliar', 'Rendimento mensal domiciliar — 2025'],
    ['Alcançar o top 5 em produtividade do trabalho', 'Produtividade do trabalho (em R$)']
  ],
  2: [
    ['Todos os municípios capixabas com mais de 80% das crianças alfabetizadas ao final do 2º ano do ensino fundamental', 'Percentual de municípios com mais de 80% das crianças alfabetizadas ao final do 2º ano do ensino fundamental na rede pública'],
    ['Matrículas em tempo integral em 55% das escolas, de forma a atender pelo menos 40% dos estudantes da educação básica', 'Percentual de matrículas e escolas da rede pública em tempo integral na educação básica'],
    ['Alcançar ao menos 80% de aprendizagem adequada no 5º ano do ensino fundamental, 60% no 9º ano e 50% na 3ª série do ensino médio, em língua portuguesa e matemática', 'Percentual de alunos com aprendizagem adequada em língua portuguesa e matemática por etapa de ensino'],
    ['70% da população adulta (25 anos ou mais) com ensino médio completo ou mais', 'Percentual da população de 25 anos ou mais com ensino médio completo'],
    ['Reduzir para 12% o número de jovens de 15 a 29 anos fora da escola e sem ocupação (nem-nem)', 'Taxa de nem-nem — percentual de jovens de 15 a 29 anos que não estudam e não estão ocupados'],
    ['50% das matrículas no ensino médio na modalidade EPT e 25% das matrículas de EJA na forma EPT', 'Percentual de matrículas no ensino médio e EJA na modalidade EPT (rede pública)'],
    ['25% da população acima de 25 anos com ensino superior completo', 'Percentual da população de 25 anos ou mais com ensino superior completo']
  ],
  3: [
    ['Índice de Desenvolvimento Humano (IDH) maior que 0,8', 'Índice de Desenvolvimento Humano'],
    ['Redução de 30% no déficit habitacional (famílias)', 'Indicador de déficit habitacional'],
    ['Redução para 17% na taxa de internações por condições sensíveis à atenção básica (ICSAB)', 'Proporção de internações clínicas por condições sensíveis à atenção básica (ICSAB)'],
    ['82 anos de expectativa de vida', 'Expectativa de vida ao nascer'],
    ['Estar entre os 5 estados considerados mais seguros do país', 'Taxa de homicídio doloso por 100 mil habitantes'],
    ['0% de domicílios com insegurança alimentar grave e moderada', 'Percentual de domicílios em situação de insegurança alimentar moderada ou grave'],
    ['100% de atendimento da população total com rede de abastecimento de água e esgotamento sanitário', 'Percentual da população atendida com rede coletora de esgoto e rede geral de abastecimento de água']
  ],
  4: [
    ['Emissões líquidas máximas de 22,5 Mt CO₂ no ano', 'Emissões líquidas de gases de efeito estufa (GEE) — CO₂ equivalente (Mt CO₂e/ano)'],
    ['Ampliar em mais de 150.000 hectares a cobertura vegetal', 'Área acumulada de ganho de cobertura vegetal'],
    ['Alcançar o top 5 no percentual de resíduos sólidos urbanos recuperados', 'Percentual de resíduos sólidos urbanos recuperados — 2024'],
    ['Reduzir em 40% os setores classificados com risco alto ou muito alto de desastres naturais', 'Número de setores territoriais com risco alto ou muito alto de desastres naturais — 2025'],
    ['Reduzir para 6,9% a população em áreas de risco geo-hidrológico', 'Percentual da população residente em áreas de risco geo-hidrológico — 2025'],
    ['Alcançar o top 4 estados no Ranking ESG de Sustentabilidade do Ranking de Competitividade dos Estados', 'Posição do Espírito Santo no Ranking ESG de Sustentabilidade — CLP (2026)'],
    ['100% dos municípios cobertos por planos municipais de adaptação e redução de riscos às mudanças climáticas', 'Percentual de municípios com plano de adaptação e redução de riscos às mudanças climáticas — 2024']
  ],
  5: [
    ['Manter a liderança como o estado mais transparente na governança pública do Brasil', 'Índice de Transparência e Governança Pública (ITGP) — 2025'],
    ['Estar entre os 5 estados líderes em oferta de serviços públicos digitais', 'Índice de Oferta de Serviços Públicos Digitais (IOSPD)'],
    ['Estar entre os 5 estados mais competitivos do Brasil, conforme avaliação do Índice de Competitividade dos Estados', 'Ranking de Competitividade dos Estados — CLP'],
    ['Manter classificação A+ para as finanças estaduais', 'Capacidade de Pagamento (CAPAG)'],
    ['Ficar entre os 3 estados líderes na promoção do desenvolvimento municipal', 'Índice de Governança Municipal (IGM) — 2026']
  ]
};

const es500Properties = document.querySelector('#es500Properties');
const missionSelect = document.querySelector('#es500Mission');
const goalSelect = document.querySelector('#es500Goal');
const summary = document.querySelector('#es500Summary');
const indicatorName = document.querySelector('#es500IndicatorName');
const goalText = document.querySelector('#es500GoalText');
const saveButton = document.querySelector('#saveEs500');

document.querySelector('#toggleEs500Properties').addEventListener('click', event => {
  const collapsed = es500Properties.classList.toggle('collapsed');
  event.currentTarget.setAttribute('aria-expanded', String(!collapsed));
});

function resetGoal() {
  goalSelect.replaceChildren(new Option(missionSelect.value ? 'Selecionar...' : 'Selecione primeiro uma missão...', ''));
  goalSelect.disabled = !missionSelect.value;
  summary.hidden = true;
  saveButton.disabled = true;
}

missionSelect.addEventListener('change', () => {
  resetGoal();
  if (!missionSelect.value) return;
  es500Catalog[missionSelect.value].forEach(([meta], index) => {
    goalSelect.add(new Option(meta, String(index)));
  });
});

goalSelect.addEventListener('change', () => {
  const hasGoal = goalSelect.value !== '';
  summary.hidden = !hasGoal;
  saveButton.disabled = !hasGoal;
  if (!hasGoal) return;
  const [meta, indicator] = es500Catalog[missionSelect.value][Number(goalSelect.value)];
  indicatorName.textContent = indicator;
  goalText.textContent = meta;
});

document.querySelector('#es500Form').addEventListener('reset', () => {
  setTimeout(resetGoal);
});

document.querySelector('#es500Form').addEventListener('submit', event => {
  event.preventDefault();
  if (!missionSelect.value || goalSelect.value === '') return;
  const mission = missionSelect.value;
  const goalIndex = Number(goalSelect.value);
  const [meta, indicator] = es500Catalog[mission][goalIndex];
  const code = `ES500-M${mission}-${String(goalIndex + 1).padStart(2, '0')}`;
  let saved = [];
  try { saved = JSON.parse(localStorage.getItem('selectedEs500Indicators') || '[]'); } catch (error) { saved = []; }
  if (!Array.isArray(saved)) saved = [];
  const byCode = new Map(saved.map(item => [item.code, item]));
  byCode.set(code, { code, mission: `Missão ${mission}`, meta, indicator });
  localStorage.setItem('selectedEs500Indicators', JSON.stringify([...byCode.values()]));
  window.location.href = 'index.html?tab=es500';
});
