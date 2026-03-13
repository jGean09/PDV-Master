document.addEventListener('DOMContentLoaded', () => {
    const API_URL = ''; 
    let produtos = [];
    let carrinho = [];

    const gridProdutos = document.getElementById("grid-produtos");
    const campoBusca = document.getElementById("busca");
    const resumoContainer = document.getElementById("resumo-venda");
    const totalDiv = document.getElementById("total");
    const finalizarBtn = document.getElementById("finalizar");
    const selectCliente = document.getElementById("cliente-selecionado");

    async function init() {
        try {
            const [prodRes, cliRes] = await Promise.all([
                fetch('/products'),
                fetch('/clients')
            ]);
            produtos = await prodRes.json();
            const clientes = await cliRes.json();

            selectCliente.innerHTML = '<option value="">Consumidor Final</option>';
            clientes.forEach(c => {
                const opt = document.createElement("option");
                opt.value = c.id;
                opt.textContent = `${c.name} (${c.phone || 'Sem Tel'})`;
                selectCliente.appendChild(opt);
            });

            renderizarProdutos();
            campoBusca.focus(); 
        } catch (err) {
            console.error("Erro na inicialização:", err);
        }
    }

    function renderizarProdutos(filtro = "") {
        gridProdutos.innerHTML = "";
        const filtrados = produtos.filter(p => p.name.toLowerCase().includes(filtro.toLowerCase()));

        if (filtrados.length === 0) {
            gridProdutos.innerHTML = '<p style="padding: 20px; color: #64748b;">Nenhum produto encontrado.</p>';
            return;
        }

        filtrados.forEach(p => {
            const card = document.createElement("div");
            card.className = "product-card";
            const corEstoque = p.quantity <= 0 ? 'color: var(--danger);' : 'color: #64748b;';

            // CORREÇÃO: Adicionado o estilo inline e a classe correta no botão
            card.innerHTML = `
                <i class="fas fa-box fa-2x" style="color: var(--primary); margin-bottom: 10px;"></i>
                <h4>${p.name}</h4>
                <p class="price">R$ ${Number(p.price).toFixed(2)}</p>
                <p style="font-size: 0.8rem; ${corEstoque}">Estoque: ${p.quantity}</p>
                <button class="btn-add-cart" data-id="${p.id}" style="margin-top:10px; width:100%; padding:10px; cursor:pointer; background: var(--primary); color:white; border:none; border-radius:8px; font-weight:600;">
                    + Adicionar
                </button>
            `;
            
            card.querySelector('.btn-add-cart').addEventListener('click', () => adicionarAoCarrinho(p.id));
            gridProdutos.appendChild(card);
        });
    }

    function adicionarAoCarrinho(id) {
        const p = produtos.find(prod => prod.id === id);
        if (!p || p.quantity <= 0) return alert("Produto esgotado!");

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
        p.quantity -= 1;
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
            div.innerHTML = `<span>${item.name} (${item.quantity}x)</span><span>R$ ${subtotal.toFixed(2)}</span>`;
            resumoContainer.appendChild(div);
        });
        totalDiv.textContent = `R$ ${totalVenda.toFixed(2)}`;
    }

    function gerarCupom(venda) {
        const ticketWindow = window.open('', '_blank', 'width=400,height=600');
        let itensHtml = venda.items.map(item => `
            <tr style="border-bottom: 1px dotted #ccc;">
                <td>${item.product.name}</td>
                <td>${item.quantity}x</td>
                <td style="text-align:right">R$ ${(item.price * item.quantity).toFixed(2)}</td>
            </tr>
        `).join('');

        const conteudo = `
            <html>
            <head>
                <style>
                    body { font-family: 'Courier New', monospace; width: 80mm; padding: 10px; }
                    header { text-align: center; border-bottom: 1px dashed #000; margin-bottom: 10px; }
                    table { width: 100%; border-collapse: collapse; }
                    .total { border-top: 1px dashed #000; margin-top: 10px; text-align: right; font-weight: bold; }
                </style>
            </head>
            <body>
                <header>
                    <h3>PDV MASTER</h3>
                    <p>Data: ${new Date(venda.createdAt).toLocaleString()}</p>
                    <p>CUPOM Nº: ${venda.id}</p>
                </header>
                <table>
                    ${itensHtml}
                </table>
                <div class="total">
                    <p>TOTAL: R$ ${venda.total.toFixed(2)}</p>
                    <p>CLIENTE: ${venda.client ? venda.client.name : 'Consumidor Final'}</p>
                </div>
                <script>window.onload = () => { window.print(); window.close(); };</script>
            </body>
            </html>
        `;
        ticketWindow.document.write(conteudo);
        ticketWindow.document.close();
    }

    finalizarBtn.addEventListener('click', async () => {
        if (carrinho.length === 0) return alert("Carrinho vazio!");

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
                const vendaRealizada = await res.json();
                alert("✅ VENDA FINALIZADA!");

                if (confirm("Deseja imprimir o cupom?")) {
                    gerarCupom(vendaRealizada);
                }

                carrinho = [];
                renderizarCarrinho();
                init();
            } else {
                const err = await res.json();
                alert("Erro: " + err.error);
            }
        } catch (err) {
            alert("Falha ao processar venda.");
        }
    });

    campoBusca.addEventListener("input", (e) => renderizarProdutos(e.target.value));
    
    window.addEventListener('keydown', (e) => {
        if (e.key === 'F8') {
            e.preventDefault();
            finalizarBtn.click();
        }
    });

    init();
});