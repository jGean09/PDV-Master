document.addEventListener('DOMContentLoaded', () => {
    carregarProdutos();
});

// 1. CARREGAR PRODUTOS DO BANCO
async function carregarProdutos() {
    const tbody = document.getElementById('lista-produtos-tbody');

    try {
        const response = await fetch('/products?includeInactive=true', { cache: 'no-store' });
        if (!response.ok) throw new Error('Erro ao carregar produtos');

        const produtos = await response.json();
        tbody.innerHTML = '';

        if (produtos.length === 0) {
            tbody.innerHTML = '<tr><td colspan="7" style="text-align:center">Nenhum produto cadastrado.</td></tr>';
            return;
        }

        produtos.forEach(p => {
            const tr = document.createElement('tr');

            if (!p.active) {
                tr.style.opacity = "0.6";
                tr.style.backgroundColor = "#f8fafc";
            }

            const nomeCategoria = p.category ? p.category.name : 'Sem categoria';
            const precoVenda = p.price != null ? `R$ ${p.price.toFixed(2)}` : 'N/A';
            const precoCusto = p.cost != null ? `R$ ${p.cost.toFixed(2)}` : 'N/A';

            // ALERTA DE ESTOQUE BAIXO
            const estoqueBaixo = p.quantity < 5;
            const styleEstoque = estoqueBaixo ? 'color: #ef4444; font-weight: bold;' : '';

            tr.innerHTML = `
                <td style="font-weight:600;">
                    ${p.name} ${!p.active ? '<br><small style="color:red;">(INATIVO)</small>' : ''}
                </td>

                <td>${precoVenda}</td>

                <td>${precoCusto}</td>

                <td style="${styleEstoque}">
                    ${p.quantity}
                    ${estoqueBaixo ? '<i class="fas fa-exclamation-triangle" title="Estoque Baixo!" style="margin-left:6px;"></i>' : ''}
                </td>

                <td>${p.fornecedor || '---'}</td>

                <td><span class="badge">${nomeCategoria}</span></td>

                <td style="text-align: center; display: flex; gap: 8px; justify-content: center; align-items: center;">
                    
                    <button onclick="prepararEdicao(${p.id})"
                        style="padding: 6px 10px; background:#f59e0b; border:none; border-radius:4px; color:white; cursor:pointer;"
                        title="Editar">
                        <i class="fas fa-edit"></i>
                    </button>
                    
                    ${p.active ? `
                        <button onclick="deletarProduto(${p.id}, '${p.name}')"
                            style="padding: 6px 10px; background:#ef4444; border:none; border-radius:4px; color:white; cursor:pointer;"
                            title="Desativar">
                            <i class="fas fa-trash-alt"></i>
                        </button>
                    ` : `
                        <button onclick="reativarProduto(${p.id})"
                            style="padding: 6px 10px; background:#10b981; border:none; border-radius:4px; color:white; cursor:pointer;"
                            title="Reativar Produto">
                            <i class="fas fa-undo"></i>
                        </button>
                    `}
                </td>
            `;

            tbody.appendChild(tr);
        });

    } catch (error) {
        console.error("❌ Erro:", error);
        tbody.innerHTML = `<tr><td colspan="7" style="color:red; text-align:center">Erro ao conectar com o servidor.</td></tr>`;
    }
}


// 2. DESATIVAR PRODUTO (SOFT DELETE)
async function deletarProduto(id, nome) {
    const confirmacao = confirm(`Deseja desativar o produto: "${nome.toUpperCase()}"?\nEle não aparecerá mais no caixa.`);

    if (!confirmacao) return;

    try {
        const response = await fetch(`/products/${id}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            alert("✅ Produto desativado com sucesso!");
            carregarProdutos();
        } else {
            const resultado = await response.json();
            alert("❌ Erro: " + (resultado.error || "Não foi possível excluir."));
        }

    } catch (err) {
        console.error("Erro na requisição:", err);
        alert("❌ Falha crítica ao conectar com o servidor.");
    }
}


// 3. REATIVAR PRODUTO
async function reativarProduto(id) {

    if (!confirm("Deseja reativar este produto?")) return;

    try {
        const response = await fetch(`/products/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ active: true })
        });

        if (response.ok) {
            alert("✅ Produto reativado!");
            carregarProdutos();
        } else {
            const erro = await response.json();
            alert("Erro ao reativar: " + erro.error);
        }

    } catch (err) {
        alert("🚫 Falha na comunicação com o servidor.");
    }
}


// 4. EDITAR PRODUTO
function prepararEdicao(id) {
    window.location.href = `cadastrar_produtos.html?edit=${id}`;
}