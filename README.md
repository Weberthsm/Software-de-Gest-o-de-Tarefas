# Software de Gestão de Tarefas

API REST construída com Express para gerenciamento de usuários e tarefas. A solução implementa autenticação JWT, documentação Swagger e um banco de dados em memória para facilitar experimentação e validação das regras de negócio descritas nas user stories abaixo.

## Como executar

1. Instale as dependências:

```bash
npm install
```

2. Inicie o servidor em modo desenvolvimento:

```bash
npm run dev
```

3. A API ficará disponível em `http://localhost:3000`.

## Estrutura da API

- `POST /api/v1/auth/register`: cadastro de novos usuários.
- `POST /api/v1/auth/login`: autenticação e emissão de token JWT.
- `POST /api/v1/tasks`: criação de tarefas (requer token JWT).
- `PUT /api/v1/tasks/:id`: edição de tarefas já cadastradas.
- `GET /api/v1/tasks`: listagem com filtros de status e busca por título.
- `PATCH /api/v1/tasks/:id/status`: alternância do status entre "Pendente" e "Concluída".
- `GET /api-docs`: renderização da documentação Swagger gerada a partir de `resources/swagger.json`.

### Stack e camadas

- **Express** para roteamento HTTP.
- **Controllers** recebem as requisições e coordenam respostas.
- **Services** concentram regras de negócio e validações.
- **Models** fazem o acesso ao banco em memória.
- **Middleware** com JWT protege rotas autenticadas e trata erros.
- **Swagger** documenta os endpoints e modelos de requisição/resposta.

## User stories

1. Cadastro de Usuário

Como um novo usuário
Eu quero me cadastrar no sistema
Para que eu possa criar uma conta e acessar as funcionalidades de gestão de tarefas

Regras de Negócio:

O e-mail do usuário deve ser único e validado antes da criação da conta.

A senha deve ter no mínimo 8 caracteres e conter letras e números.

O sistema deve exigir a confirmação da senha antes do cadastro ser concluído.

O cadastro só será efetivado após o preenchimento de todos os campos obrigatórios (nome, e-mail, senha).

O sistema deve armazenar a senha de forma criptografada.

Após o cadastro, o usuário deve ser automaticamente redirecionado para a tela de login.


2. Login de Usuário

Como um usuário cadastrado
Eu quero fazer login no sistema
Para que eu possa acessar minhas tarefas e gerenciar meu progresso de forma segura

Regras de Negócio:

- O login só deve ser permitido para usuários previamente cadastrados.

- O sistema deve validar e-mail e senha antes de conceder acesso.

- A senha deve ser armazenada de forma criptografada no banco de dados.

3. Cadastro de Tarefas

Como um usuário autenticado
Eu quero cadastrar novas tarefas
Para que eu possa organizar e acompanhar minhas atividades pessoais e profissionais

Regras de Negócio:

- Cada tarefa deve conter um título obrigatório e opcionalmente uma descrição e data de conclusão prevista.

- Não deve ser possível cadastrar uma tarefa sem título.

- A data de conclusão prevista, se informada, não pode ser anterior à data atual.

- O sistema deve associar cada tarefa ao usuário que a criou.

4. Editar Tarefas

Como um usuário autenticado
Eu quero editar as informações de uma tarefa existente
Para que eu possa corrigir, atualizar ou complementar os dados da tarefa

Regras de Negócio:

- Somente o usuário que criou a tarefa pode editá-la.

- O sistema deve manter o histórico de alterações (última data de modificação).

- O título da tarefa não pode ser deixado em branco após a edição.

- Não é permitido alterar o status para concluído durante a edição — isso deve ser feito apenas pela funcionalidade “Marcar como Concluída”.

5. Listar Tarefas

Como um usuário autenticado
Eu quero visualizar uma lista de todas as minhas tarefas
Para que eu possa acompanhar o que já foi feito e o que ainda precisa ser realizado

Regras de Negócio:

- O sistema deve exibir apenas as tarefas pertencentes ao usuário logado.

- As tarefas devem ser listadas em ordem cronológica (data de criação ou data de conclusão).

- Deve ser possível filtrar tarefas por status (pendente, concluída).

- Deve ser possível pesquisar tarefas pelo título.


6. Marcar Tarefa como Concluída

Como um usuário autenticado
Eu quero marcar uma tarefa como concluída
Para que eu possa indicar que finalizei determinada atividade e acompanhar meu progresso

Regras de Negócio:

- Apenas o criador da tarefa pode alterá-la para o status “Concluída”.

- Ao marcar como concluída, o sistema deve registrar automaticamente a data e hora da conclusão.

- O usuário pode alterar novamente o status da tarefa entre “Pendente” e “Concluída”, caso precise reabrir ou ajustar algo.

- O sistema deve permitir visualizar claramente o status “Concluída” nas listagens.


