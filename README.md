# 🚀 PDV MASTER - Sistema de Gestão e Frente de Caixa

O **PDV Master** é um ecossistema completo para gestão de micro e pequenas empresas. O projeto agora conta com um backend robusto utilizando **Prisma ORM**, garantindo integridade de dados e relacionamentos complexos entre produtos, categorias, clientes e vendas.

---

## 🛠️ Tecnologias Utilizadas

* **Frontend:** HTML5, CSS3 (BEM & Modular), JavaScript ES6+ (Fetch API).
* **Backend:** Node.js com Express.
* **ORM:** Prisma (Tipagem forte e Migrations).
* **Banco de Dados:** SQLite (Desenvolvimento ágil).
* **Ferramentas:** Nodemon (Auto-reload), Font Awesome 6.0.

---

## 📋 Funcionalidades de Alto Nível

### 1. Frente de Caixa (PDV)
* Busca instantânea e interface baseada em **Cards Visuais**.
* Atalho de teclado (**F8**) para finalização de venda.
* Sistema de **Venda vinculada**: Associa vendas a clientes e abate o estoque automaticamente via transações Prisma.

### 2. Gestão de Estoque e Categorias
* CRUD completo com validação de relacionamentos (impede excluir categorias com produtos ativos).
* Controle de **Preço de Custo vs. Preço de Venda** para cálculo de lucro.

### 3. Inteligência Financeira
* Relatório consolidado de faturamento, custo e lucro líquido.

---

## 📂 Estrutura do Projeto (MVC)

```text
pdv-backend/
├── prisma/              # Schema do banco de dados e Migrations
├── public/              # Frontend (HTML, CSS, JS)
├── src/                 # Código fonte do Backend
│   ├── controllers/     # Regras de negócio (Prisma Logic)
│   ├── routes/          # Definição das rotas da API
│   └── database/        # Configurações de conexão
└── server.js            # Inicialização do Servidor Express
```
## 🚀 Como Executar
Clone o repositório:

Bash
```git clone https://github.com/jGean09/PDV-Master.git ```

Instale as dependências:

Bash 
```npm install ```

Sincronize o banco de dados:

Bash
```npx prisma migrate dev```


Inicie o sistema:

```Bash
npm run dev```
(ou nodemon server.js)

🎯 Roadmap de Evolução
[x] Migração para Prisma ORM (Arquitetura Profissional).

[x] Interface Responsiva e Sidebar Fixa.

[ ] Implementação de Exclusão/Edição com Confirmação em todas as telas.

[ ] Dashboards gráficos de desempenho mensal.

Desenvolvido por José Gean Transformando lógica em ferramentas de alto impacto.