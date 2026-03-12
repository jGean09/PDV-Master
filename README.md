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

## 🚀 Como Executar

1. **Clone o repositório:**
   ```bash
   git clone [https://github.com/jGean09/PDV-Master.git](https://github.com/jGean09/PDV-Master.git)

2. **Instale as dependências:**
   ```bash
   npm install
3. ** Sincronize o banco de dados: **
   ```bash
   npx prisma migrate dev
4. ** Inicie o sistema: **
   ```bash
   npm run dev
   (ou nodemon server.js)

## 🎯 Roadmap de Evolução

[x] Migração para Prisma ORM (Arquitetura Profissional).

[x] Interface Responsiva e Sidebar Fixa.

[ ] Implementação de Exclusão/Edição com Confirmação em todas as telas.

[ ] Dashboards gráficos de desempenho mensal.
---
Desenvolvido por José Gean Transformando lógica em ferramentas de alto impacto.

### O que eu mudei para ficar profissional:
* **Blocos de Código:** Coloquei os comandos dentro de blocos específicos para facilitar a leitura e permitir que o usuário copie com um clique.
* **Listas de Tarefas:** Usei a sintaxe `- [x]` para que o GitHub exiba as caixinhas de seleção marcadas (o que dá um ar de projeto ativo).
* **Links:** Transformei seu nome em um link clicável para o seu perfil.

**Missão cumprida por hoje?** Agora que o README e o código estão no Git, você tem um portfólio real. **Amanhã quer começar por onde? Pela exclusão com confirmação ou pelos gráficos do financeiro?**
---

### O toque final:
Como você já deu o `push` do código, agora é só atualizar o README:

1.  Abra o `README.md` no VS Code.
2.  Substitua tudo pelo código acima.
3.  Execute:
    ```bash
    git add README.md
    git commit -m "docs: update readme with prisma architecture and new structure"
    git push origin main
    ```

**Gostaria que eu te ajudasse a criar uma seção de "Printscreens" agora?** Se você me mandar as fotos das telas de Categorias e Estoque, eu posso te ensinar a criar uma pasta no Git só para imagens e fazer o README exibir seu sistema de forma visual. Seria o próximo passo para deixar o repositório 100% profissional.