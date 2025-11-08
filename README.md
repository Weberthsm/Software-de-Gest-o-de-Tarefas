User Stories – Software de Gestão de Tarefas
1. Login de Usuário

Como um usuário cadastrado
Eu quero fazer login no sistema
Para que eu possa acessar minhas tarefas e gerenciar meu progresso de forma segura

Regras de Negócio:

- O login só deve ser permitido para usuários previamente cadastrados.

- O sistema deve validar e-mail e senha antes de conceder acesso.

- A senha deve ser armazenada de forma criptografada no banco de dados.

2. Cadastro de Tarefas

Como um usuário autenticado
Eu quero cadastrar novas tarefas
Para que eu possa organizar e acompanhar minhas atividades pessoais e profissionais

Regras de Negócio:

- Cada tarefa deve conter um título obrigatório e opcionalmente uma descrição e data de conclusão prevista.

- Não deve ser possível cadastrar uma tarefa sem título.

- O sistema deve associar cada tarefa ao usuário que a criou.

- A data de conclusão, se informada, não pode ser anterior à data atual.

3. Editar Tarefas

Como um usuário autenticado
Eu quero editar as informações de uma tarefa existente
Para que eu possa corrigir, atualizar ou complementar os dados da tarefa

Regras de Negócio:

- Somente o usuário que criou a tarefa pode editá-la.

- O sistema deve manter o histórico de alterações (última data de modificação).

- O título da tarefa não pode ser deixado em branco após a edição.

- Não é permitido alterar o status para concluído durante a edição — isso deve ser feito apenas pela funcionalidade “Marcar como Concluída”.

4. Listar Tarefas

Como um usuário autenticado
Eu quero visualizar uma lista de todas as minhas tarefas
Para que eu possa acompanhar o que já foi feito e o que ainda precisa ser realizado

Regras de Negócio:

- O sistema deve exibir apenas as tarefas pertencentes ao usuário logado.

- As tarefas devem ser listadas em ordem cronológica (data de criação ou data de conclusão).

- Deve ser possível filtrar tarefas por status (pendente, concluída).

- Deve ser possível pesquisar tarefas pelo título.


5. Marcar Tarefa como Concluída

Como um usuário autenticado
Eu quero marcar uma tarefa como concluída
Para que eu possa indicar que finalizei determinada atividade e acompanhar meu progresso

Regras de Negócio:

- Apenas o criador da tarefa pode alterá-la para o status “Concluída”.

- Ao marcar como concluída, o sistema deve registrar automaticamente a data e hora da conclusão.

- Não é possível marcar novamente uma tarefa já concluída.

- O sistema deve permitir visualizar claramente o status “Concluída” nas listagens.