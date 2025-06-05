# TODO APP (React + Express.js + SQLite)

Este projeto é uma aplicação de **CRUD de Tarefas** com autenticação de usuários. Foi desenvolvido em duas partes (dois sprints de 6 horas cada):

- **Frontend:** React  
- **Backend:** Node.js + Express.js  
- **Banco de Dados:** SQLite (via Sequelize)

---

## 📋 Sumário

1. [Visão Geral](#visão-geral)  
2. [Pré-requisitos](#pré-requisitos)  
3. [Instalação](#instalação)  
   1. [Clonar repositório](#clonar-repositório)  
   2. [Configurar e executar Backend](#configurar-e-executar-backend)  
   3. [Configurar e executar Frontend](#configurar-e-executar-frontend)  
4. [Rotas de API (Backend)](#rotas-de-api-backend)  
5. [Estrutura de Pastas](#estrutura-de-pastas)  
6. [Como Funciona](#como-funciona)  
7. [Tecnologias Utilizadas](#tecnologias-utilizadas)  
8. [Dicas de Uso e Testes](#dicas-de-uso-e-testes)  

---

## Visão Geral

Esta aplicação permite que usuários se cadastrem, façam login e gerenciem suas próprias tarefas (criar, visualizar, editar e excluir). Cada usuário só consegue visualizar e manipular as tarefas que foram criadas por ele.

---

## Pré-requisitos

Antes de prosseguir, certifique-se de ter instalado em sua máquina:

- [Node.js (v14 ou superior)](https://nodejs.org/)  
- [npm (incluído no Node.js)]  
- [Git](https://git-scm.com/)  

> Não é necessário instalar SQLite separadamente: o arquivo de banco (`database.sqlite`) será gerado automaticamente pelo Sequelize.

---

## Instalação

### 1. Clonar repositório

```bash
git clone https://github.com/SEU_USUARIO/todo-app.git
cd todo-app
```

### 2. Configurar e executar o Backend

1. Navegue até a pasta do backend:

   ```bash
   cd backend
   ```

2. Instale as dependências:

   ```bash
   npm install
   ```

3. Verifique se o arquivo `config/config.json` está configurado assim (para usar SQLite):

   ```jsonc
   {
     "development": {
       "dialect": "sqlite",
       "storage": "database.sqlite"
     },
     "test": {
       "dialect": "sqlite",
       "storage": "database.sqlite"
     },
     "production": {
       "dialect": "sqlite",
       "storage": "database.sqlite"
     }
   }
   ```

4. Execute as migrações para criar as tabelas `Users` e `Tasks`:

   ```bash
   npx sequelize-cli db:migrate
   ```

5. Inicie o servidor Express (modo desenvolvimento com nodemon):

   ```bash
   npm run dev
   ```

   * O servidor ficará disponível em: `http://localhost:3001`

   * Caso queira rodar em modo normal (sem nodemon), use:

     ```bash
     npm start
     ```

### 3. Configurar e executar o Frontend

1. Abra uma nova aba/terminal e navegue até a pasta do frontend:

   ```bash
   cd frontend
   ```

2. Instale as dependências:

   ```bash
   npm install
   ```

3. Inicie o servidor de desenvolvimento React:

   ```bash
   npm start
   ```

   * O React será executado em: `http://localhost:3000`
   * Caso o frontend seja aberto automaticamente em outra porta (por colisão), apenas ajuste a URL do backend em `src/services/api.js` para `http://localhost:3001`.

---

## Rotas de API (Backend)

> Todas as rotas retornam JSON. Para rotas protegidas, enviar header `Authorization: Bearer <TOKEN_JWT>`.

### Autenticação

* **POST `/register`**

  * Descrição: Cadastra um novo usuário.
  * Body:

    ```json
    {
      "name": "Nome do usuário",
      "email": "email@exemplo.com",
      "password": "senha123"
    }
    ```
  * Resposta (exemplo):

    ```json
    {
      "id": 1,
      "name": "Nome do usuário",
      "email": "email@exemplo.com"
    }
    ```

* **POST `/login`**

  * Descrição: Autentica usuário e retorna token JWT.
  * Body:

    ```json
    {
      "email": "email@exemplo.com",
      "password": "senha123"
    }
    ```
  * Resposta (exemplo):

    ```json
    {
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
    ```

### CRUD de Tarefas

> Todas as rotas de tarefas exigem o token JWT no header `Authorization`.

* **POST `/tasks`**

  * Descrição: Cria nova tarefa.
  * Body:

    ```json
    {
      "title": "Título da tarefa",
      "description": "Descrição opcional"
    }
    ```
  * Resposta (exemplo):

    ```json
    {
      "id": 1,
      "title": "Título da tarefa",
      "description": "Descrição opcional",
      "UserId": 1,
      "updatedAt": "2025-06-05T12:00:00.000Z",
      "createdAt": "2025-06-05T12:00:00.000Z"
    }
    ```

* **GET `/tasks`**

  * Descrição: Retorna lista de tarefas do usuário autenticado (order by createdAt DESC).
  * Resposta (exemplo):

    ```json
    [
      {
        "id": 1,
        "title": "Título da tarefa",
        "description": "Descrição opcional",
        "UserId": 1,
        "updatedAt": "2025-06-05T12:00:00.000Z",
        "createdAt": "2025-06-05T12:00:00.000Z"
      },
      { ... }
    ]
    ```

* **PUT `/tasks/:id`**

  * Descrição: Atualiza título e/ou descrição da tarefa especificada, se pertencer ao usuário.
  * Parâmetro: `id` → ID da tarefa.
  * Body:

    ```json
    {
      "title": "Novo título",
      "description": "Nova descrição"
    }
    ```
  * Resposta (exemplo):

    ```json
    {
      "id": 1,
      "title": "Novo título",
      "description": "Nova descrição",
      "UserId": 1,
      "updatedAt": "2025-06-05T12:05:00.000Z",
      "createdAt": "2025-06-05T12:00:00.000Z"
    }
    ```

* **DELETE `/tasks/:id`**

  * Descrição: Remove a tarefa especificada, se pertencer ao usuário.
  * Parâmetro: `id` → ID da tarefa.
  * Resposta (exemplo):

    ```json
    {
      "message": "Tarefa excluída com sucesso."
    }
    ```

---

## Estrutura de Pastas

```
todo-app/
├── backend/
│   ├── config/
│   │   └── config.json
│   ├── migrations/
│   ├── models/
│   │   ├── task.js
│   │   └── user.js
│   ├── seeders/        (opcional)
│   ├── database.sqlite  (criado após migração)
│   ├── index.js
│   ├── .sequelizerc
│   ├── package.json
│   └── ...
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── EditTask.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── TaskForm.jsx
│   │   │   ├── TaskList.jsx
│   │   │   ├── Auth.css
│   │   │   ├── TaskForm.css
│   │   │   └── TaskList.css
│   │   ├── services/
│   │   │   ├── api.js
│   │   │   └── auth.js
│   │   ├── routes/
│   │   │   └── PrivateRoute.jsx
│   │   ├── App.js
│   │   ├── index.js
│   │   └── ...
│   ├── package.json
│   └── ...
└── README.md
```

---

## Como Funciona

1. **Registro de Usuário**

   * O usuário acessa `http://localhost:3000/register`, preenche nome, e-mail e senha e clica em "Cadastrar".
   * Backend armazena usuário com senha criptografada (bcrypt) e retorna sucesso.

2. **Login**

   * O usuário acessa `http://localhost:3000/login`, informa e-mail e senha.
   * Backend valida credenciais, gera token JWT (válido por 24h) e retorna para o frontend.
   * Frontend salva token no `localStorage` e redireciona para `/tasks`.

3. **Gerenciamento de Tarefas**

   * Na página `/tasks`, o componente faz uma requisição GET `/tasks` com header `Authorization: Bearer <token>`.
   * Backend valida token e retorna lista de tarefas do usuário em ordem decrescente de criação.
   * Usuário pode clicar em "Nova Tarefa" para criar nova tarefa (POST `/tasks`).
   * Para editar, clica em uma tarefa na lista e é redirecionado para `/tasks/:id/edit` (rota protegida).
   * Em `/tasks/:id/edit`, pode alterar título/descrição ou excluir (DELETE `/tasks/:id`).

---

## Tecnologias Utilizadas

* **Frontend**

  * React (create-react-app)
  * Axios (para requisições HTTP)
  * React Router DOM (para rotas e navegação)

* **Backend**

  * Node.js
  * Express.js
  * Sequelize (ORM)
  * SQLite (banco de dados leve, embutido)
  * bcryptjs (hash de senha)
  * jsonwebtoken (JWT)
  * cors (para permitir requisições do frontend)

---

## Dicas de Uso e Testes

* **Verificar variáveis de ambiente**: caso queira alterar o `JWT_SECRET` ou porta, crie um arquivo `.env` em `backend/` e use algo como `dotenv` no código para carregar.
* **Rodar migrações**: sempre que editar modelos, gere nova migration ou use `sequelize.sync()` em ambiente de desenvolvimento.
* **Testar endpoints manualmente**: utilize ferramentas como Postman ou Insomnia para validar respostas da API.
* **Erros comuns**:

  * Se aparecer "Database sqlite no such table": verifique se migrações foram executadas corretamente (`npx sequelize-cli db:migrate`).
  * Se token JWT expirar, usuário deve fazer login novamente.
* **Responsividade**: os componentes React utilizam CSS responsivo; a aplicação funciona bem em desktop, tablet e celular.

---

## Funcionalidades Implementadas

✅ **Autenticação completa** (registro, login, logout)  
✅ **CRUD completo de tarefas** (criar, listar, editar, excluir)  
✅ **Proteção de rotas** (middleware JWT)  
✅ **Interface moderna e responsiva**  
✅ **Validação de dados** (frontend e backend)  
✅ **Tratamento de erros** (mensagens amigáveis)  
✅ **Interceptors HTTP** (token automático, logout em 401)  
✅ **Segurança** (senhas hasheadas, tokens JWT)  

---

**Pronto! Agora você tem uma aplicação TODO completa funcionando localmente conforme o escopo definido nos sprints.** 