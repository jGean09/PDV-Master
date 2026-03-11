# 🚀 PDV MASTER - Sistema de Gestão e Frente de Caixa

O **PDV Master** é um ecossistema completo para gestão de micro e pequenas empresas. Desenvolvido com uma arquitetura **MVC (Model-View-Controller)** no backend e uma interface **moderna e responsiva** no frontend.

---

## 🛠️ Tecnologias Utilizadas

* **Frontend:** HTML5, CSS3 (Arquitetura modular), JavaScript ES6+.
* **Backend:** Node.js com Express.
* **Banco de Dados:** SQLite/MySQL.
* **Icons:** Font Awesome 6.0.
* **Fonts:** Inter (Google Fonts).

---

## 📋 Funcionalidades de Alto Nível

### 1. Frente de Caixa (PDV)
* Busca instantânea de produtos e interface baseada em **Cards Visuais**.
* Atalho de teclado (**F8**) para finalização rápida.
* Associação de vendas a clientes cadastrados.

### 2. Gestão de Estoque e Clientes
* CRUD completo de produtos e clientes.
* Controle de preços e margens de lucro.
* Alerta visual para estoque baixo.

---

## 📂 Estrutura do Projeto

```text
pdv-backend/
├── public/              # Todo o Frontend
│   ├── css/             # Estilos modais
│   ├── js/              # Lógica de interação
│   └── *.html           # Telas do sistema
├── routes/              # Definição de Rotas
└── server.js            # Ponto de entrada

## 🎯 Roadmap de Evolução

[x] Interface Responsiva e Sidebar Fixa.

[ ] Implementação de Exclusão com Confirmação.

[ ] Gráficos de desempenho financeiro.

Desenvolvido por José Gean

### 3. Como aplicar
1. Abra o arquivo no VS Code.
2. Apague tudo o que está lá.
3. Cole esse código de cima.
4. Salve (`Ctrl + S`).
5. No terminal, envie a atualização:
   ```bash
   git add README.md
   git commit -m "docs: corrigindo formatação do readme"
   git push origin main