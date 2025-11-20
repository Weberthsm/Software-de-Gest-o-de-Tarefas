const dayMs = 24 * 60 * 60 * 1000;
const isoDate = (d) => d.toISOString().split('T')[0];
const futureDate = (days = 1) => isoDate(new Date(Date.now() + days * dayMs));
const pastDate = (days = 1) => isoDate(new Date(Date.now() - days * dayMs));

const buildTaskPayload = (overrides = {}) => {
  const base = {
    title: 'Finalizar documentacao',
    description: 'Preparar texto e revisar',
    dueDate: futureDate(2)
  };
  return { ...base, ...overrides };
};

const invalidTitleCases = [
  { description: 'sem título', payload: buildTaskPayload({ title: undefined }), expectedMessage: 'Título da tarefa é obrigatório.' },
  { description: 'título vazio', payload: buildTaskPayload({ title: '' }), expectedMessage: 'Título da tarefa é obrigatório.' },
  { description: 'título apenas espaços', payload: buildTaskPayload({ title: '    ' }), expectedMessage: 'Título da tarefa é obrigatório.' }
];

const invalidDueDateCases = [
  { description: 'data em formato inválido', payload: buildTaskPayload({ dueDate: '31/12/2030' }), expectedMessage: 'Data de conclusão prevista inválida.' },
  { description: 'data anterior à atual', payload: buildTaskPayload({ dueDate: pastDate(1) }), expectedMessage: 'Data de conclusão prevista não pode ser anterior à data atual.' }
];

module.exports = {
  buildTaskPayload,
  invalidTitleCases,
  invalidDueDateCases,
  futureDate,
  pastDate,
  validStatuses: ['Pendente', 'Concluída'],
  invalidStatus: 'Em Progresso'
};
