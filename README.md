🚀 PDV MASTER - Sistema de Gestão e Frente de Caixa
O PDV Master é um ecossistema completo para gestão de micro e pequenas empresas. Desenvolvido com uma arquitetura MVC (Model-View-Controller) no backend e uma interface moderna e responsiva no frontend, o sistema foca em agilidade no checkout e precisão no controle de estoque.

🛠️ Tecnologias Utilizadas
O projeto utiliza uma stack robusta para garantir performance e escalabilidade:

Frontend: HTML5, CSS3 (Arquitetura modular), JavaScript Vanilla (ES6+).

Backend: Node.js com Express.

Banco de Dados: SQLite/MySQL (Integração via Query Builder).

Icons: Font Awesome 6.0.

Fonts: Inter (Google Fonts).

📋 Funcionalidades de Alto Nível
1. Frente de Caixa (PDV)
Busca instantânea de produtos.

Interface baseada em Cards Visuais para identificação rápida.

Atalho de teclado (F8) para finalização de venda.

Associação de vendas a clientes cadastrados.

2. Gestão de Estoque
CRUD completo de produtos (Cadastrar, Listar, Editar e Deletar).

Controle de preço de custo vs. preço de venda (Cálculo de margem).

Alerta visual para itens com baixo estoque.

3. Gestão de Clientes
Carteira de clientes organizada por nome e localização.

Histórico para futuras implementações de programas de fidelidade.

4. Inteligência Financeira
Dashboard com cards de Faturamento Total, Custo e Lucro Líquido.

Histórico detalhado de transações.

📂 Estrutura do Projeto
A organização de pastas segue o padrão de sistemas de larga escala:

pdv-backend/
├── public/              # Todo o Frontend do sistema
│   ├── css/             # Estilos modais (base, vendas, tabelas, forms)
│   ├── js/              # Lógica de interação por página
│   └── *.html           # Estruturas das telas
├── routes/              # Definição das rotas da API
├── controllers/         # Regras de negócio do sistema
├── models/              # Comunicação com o banco de dados
└── server.js            # Ponto de entrada da aplicação

🚀 Como Executar o Projeto
Clone o repositório:

Bash
git clone https://github.com/jGean09/PDV-Master.git
Instale as dependências:

Bash
npm install
Inicie o servidor:

Bash
npm start
Acesse no navegador:
http://localhost:3000

🎯 Próximos Passos (Roadmap)
[ ] Implementação de Exclusão com Confirmação (CRUD Completo).

[ ] Máscaras de entrada para Telefone e CPF.

[ ] Gráficos de desempenho semanal no Financeiro.

[ ] Impressão de cupom não fiscal.

Desenvolvido por José Gean "Transformando código em soluções de negócio."