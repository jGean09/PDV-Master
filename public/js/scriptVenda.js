document.addEventListener('DOMContentLoaded', () => {
    // Usamos caminhos relativos para evitar erros de porta no servidor
    const API_URL = ''; 

    let produtos = [];
    let carrinho = [];

    // Seletores dos elementos HTML
    const gridProdutos = document.getElementById("grid-produtos");
    const campoBusca = document.getElementById("busca");
    const resumoContainer = document.getElementById("resumo-venda");
    const totalDiv = document.getElementById("total");
    const finalizarBtn = document.getElementById("finalizar");
    const selectCliente = document.getElementById("cliente-selecionado");

    // ==========================================
    // INICIALIZAÇÃO: Busca produtos e clientes
    // ==========================================
    async function init() {
        try {
            const [prodRes, cliRes] = await Promise.all([
                fetch('/products'),
                fetch('/clients')
            ]);
            
            produtos = await prodRes.json();
            const clientes = await cliRes.json();

            // Preenche o select de clientes para associar à venda
            selectCliente.innerHTML = '<option value="">Consumidor Final</option>';
            clientes.forEach(c => {
                const opt = document.createElement("option");
                opt.value = c.id;
                opt.textContent = `${c.name} (${c.phone || 'Sem Tel'})`;
                selectCliente.appendChild(opt);
            });

            renderizarProdutos();
            
            // FOCO AUTOMÁTICO: Melhora o Workflow do caixa
            campoBusca.focus(); 

        } catch (err) {
            console.error("Erro na inicialização do sistema:", err);
        }
    }

    // ==========================================
    // RENDERIZAÇÃO: Gera os Cards de Produtos
    // ==========================================
    function renderizarProdutos(filtro = "") {
        gridProdutos.innerHTML = "";
        const filtrados = produtos.filter(p => p.name.toLowerCase().includes(filtro.toLowerCase()));

        if (filtrados.length === 0) {
            gridProdutos.innerHTML = '<p style="padding: 20px; color: #64748b;">Nenhum produto encontrado com este nome.</p>';
            return;
        }

        filtrados.forEach(p => {
            const card = document.createElement("div");
            card.className = "product-card";
            
            // Lógica de cor para estoque baixo
            const corEstoque = p.quantity <= 0 ? 'color: var(--danger);' : 'color: #64748b;';

            card.innerHTML = `
                <i class="fas fa-box fa-2x" style="color: var(--primary); margin-bottom: 10px;"></i>
                <h4>${p.name}</h4>
                <p class="price">R$ ${Number(p.price).toFixed(2)}</p>
                <p style="font-size: 0.8rem; ${corEstoque}">Estoque: ${p.quantity}</p>
                <button class="btn-add-cart" data-id="${p.id}" style="margin-top:10px; width:100%; padding:10px; cursor:pointer; background: var(--primary); color:white; border:none; border-radius:8px; font-weight:600;">
                    + Adicionar
                </button>
            `;
            
            // Evento para adicionar ao clicar no botão
            card.querySelector('.btn-add-cart').addEventListener('click', () => adicionarAoCarrinho(p.id));
            gridProdutos.appendChild(card);
        });
    }

    // ==========================================
    // CARRINHO: Gerencia a adição de itens
    // ==========================================
    function adicionarAoCarrinho(id) {
        const p = produtos.find(prod => prod.id === id);
        
        // Validação de estoque brutal
        if (!p || p.quantity <= 0) {
            alert("Atenção: Produto esgotado!");
            return;
        }

        const itemNoCarrinho = carrinho.find(item => item.product_id === id);
        
        if (itemNoCarrinho) {
            itemNoCarrinho.quantity += 1;
        } else {
            carrinho.push({
                product_id: p.id,
                name: p.name,
                price: p.price,
                quantity: 1
            });
        }

        p.quantity -= 1; // Baixa visual imediata no estoque da tela
        renderizarProdutos(campoBusca.value);
        renderizarCarrinho();
    }

    function renderizarCarrinho() {
        resumoContainer.innerHTML = "";
        let totalVenda = 0;

        carrinho.forEach((item) => {
            const div = document.createElement("div");
            div.className = "cart-item";
            const subtotal = item.price * item.quantity;
            totalVenda += subtotal;
            
            div.innerHTML = `
                <span style="font-weight:500;">${item.name} <small>(${item.quantity}x)</small></span>
                <span style="font-weight:600;">R$ ${subtotal.toFixed(2)}</span>
            `;
            resumoContainer.appendChild(div);
        });

        totalDiv.textContent = `R$ ${totalVenda.toFixed(2)}`;
    }

    // ==========================================
    // FECHAMENTO: Envia a venda para o servidor
    // ==========================================
    finalizarBtn.addEventListener('click', async () => {
        if (carrinho.length === 0) return alert("Adicione ao menos um produto no carrinho!");

        const payload = {
            customer: selectCliente.value ? { id: parseInt(selectCliente.value) } : null,
            items: carrinho,
            total: parseFloat(totalDiv.textContent.replace('R$ ', ''))
        };

        try {
            const res = await fetch('/sales', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                alert("✅ VENDA FINALIZADA COM SUCESSO!");
                carrinho = [];
                renderizarCarrinho();
                init(); // Recarrega o estoque oficial do DB
            } else {
                const err = await res.json();
                throw new Error(err.error);
            }
        } catch (err) {
            alert("Falha ao processar venda: " + err.message);
        }
    });

    // Evento de busca em tempo real
    campoBusca.addEventListener("input", (e) => renderizarProdutos(e.target.value));

    // Atalho de Teclado (F8) para fechar a conta rápido
    window.addEventListener('keydown', (e) => {
        if (e.key === 'F8') {
            e.preventDefault(); // Impede funções padrões do navegador
            finalizarBtn.click();
        }
    });

    init();
});