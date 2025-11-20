const uniqueSuffix = () => `${Date.now()}${Math.floor(Math.random() * 1000)}`;
const strongPassword = 'SenhaForte123';

const buildUserPayload = (overrides = {}) => {
  const base = {
    name: 'Usuario Teste',
    email: `usuario_${uniqueSuffix()}@example.com`,
    password: strongPassword,
    passwordConfirmation: strongPassword
  };
  return { ...base, ...overrides };
};

// Casos campos obrigatórios ausentes
const missingFieldCases = [
  { description: 'sem nome', mutate: (p) => { delete p.name; }, expectedMessage: 'Todos os campos obrigatórios devem ser preenchidos.' },
  { description: 'sem e-mail', mutate: (p) => { delete p.email; }, expectedMessage: 'Todos os campos obrigatórios devem ser preenchidos.' },
  { description: 'sem senha', mutate: (p) => { delete p.password; }, expectedMessage: 'Todos os campos obrigatórios devem ser preenchidos.' },
  { description: 'sem confirmação senha', mutate: (p) => { delete p.passwordConfirmation; }, expectedMessage: 'Todos os campos obrigatórios devem ser preenchidos.' }
];

// Política de senha
const passwordPolicyCases = [
  { description: 'senha < 8 caracteres', override: { password: 'Abc12', passwordConfirmation: 'Abc12' }, expectedMessage: 'A senha deve possuir no mínimo 8 caracteres contendo letras e números.' },
  { description: 'senha sem números', override: { password: 'SomenteLetra', passwordConfirmation: 'SomenteLetra' }, expectedMessage: 'A senha deve possuir no mínimo 8 caracteres contendo letras e números.' },
  { description: 'senha sem letras', override: { password: '123456789', passwordConfirmation: '123456789' }, expectedMessage: 'A senha deve possuir no mínimo 8 caracteres contendo letras e números.' }
];

// Confirmação divergente
const mismatchedPasswordCase = {
  description: 'confirmação divergente',
  override: { passwordConfirmation: 'SenhaDiferente321' },
  expectedMessage: 'As senhas informadas não conferem.'
};

// Formato de e-mail inválido
const invalidEmailCases = [
  { description: 'email sem @', override: { email: 'email-invalido' }, expectedMessage: 'E-mail inválido.' },
  { description: 'email dominio com pontos consecutivos', override: { email: 'teste@dominio..com' }, expectedMessage: 'E-mail inválido.' }
];

module.exports = {
  buildUserPayload,
  missingFieldCases,
  passwordPolicyCases,
  mismatchedPasswordCase,
  invalidEmailCases,
  strongPassword
};
