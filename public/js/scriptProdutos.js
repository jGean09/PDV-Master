document.addEventListener('DOMContentLoaded', () => {
    // Função para renderizar a tabela (atualize a sua)
function atualizarTabela(produtos) {
    const tbody = document.getElementById('lista-produtos-tbody');
    tbody.innerHTML = '';

    produtos.forEach(p => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td style="font-weight:600;">${p.name}</td>
            <td>R$ ${Number(p.price).toFixed(2)}</td>
            <td>R$ ${Number(p.cost || 0).toFixed(2)}</td>
            <td>${p.quantity}</td>
            <td><span class="badge">${p.category_name || 'Geral'}</span></td>
            <td style="text-align: center;">
                <button onclick="deletarProduto(${p.id}, '${p.name}')" class="btn-delete">
                    <i class="fas fa-trash-alt"></i>
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// FUNÇÃO BRUTAL DE EXCLUSÃO
async function deletarProduto(id, nome) {
    // Confirmação para evitar desastres
    const confirmacao = confirm(`TEM CERTEZA? \nVocê está prestes a excluir o produto: "${nome.toUpperCase()}". \nEsta ação não pode ser desfeita.`);

    if (!confirmacao) return;

    try {
        const response = await fetch(`/products/${id}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            alert("✅ Produto removido com sucesso!");
            // Recarrega a lista automaticamente
            fetchProducts(); 
        } else {
            const erro = await response.json();
            alert("❌ Erro ao deletar: " + (erro.error || "Tente novamente"));
        }
    } catch (err) {
        console.error("Erro na requisição:", err);
        alert("❌ Falha crítica ao conectar com o servidor.");
    }
}
    async function carregarProdutos() {
        try {
            const response = await fetch('http://localhost:3000/products', { cache: 'no-store' });
            if (!response.ok) throw new Error('Erro ao carregar produtos');
            const produtos = await response.json();

            const tbody = document.getElementById('lista-produtos-tbody');
            tbody.innerHTML = '';

            if (produtos.length === 0) {
                tbody.innerHTML = '<tr><td colspan="6">Nenhum produto cadastrado.</td></tr>';
                return;
            }

            produtos.forEach(produto => {
                const tr = document.createElement('tr');

                const precoVenda = produto.price != null ? `R$ ${produto.price.toFixed(2)}` : 'N/A';
                const precoCusto = produto.custo != null ? `R$ ${produto.custo.toFixed(2)}` : 'N/A';
                const fornecedor = produto.fornecedor || 'Não informado';
                const categoria = produto.category_name || 'Sem categoria';

                tr.innerHTML = `
                    <td>${produto.name}</td>
                    <td>${precoVenda}</td>
                    <td>${precoCusto}</td>
                    <td>${produto.quantity}</td>
                    <td>${fornecedor}</td>
                    <td>${categoria}</td>
                `;
                tbody.appendChild(tr);
            });

        } catch (error) {
            console.error(error);
            document.getElementById('lista-produtos-tbody').innerHTML = `<tr><td colspan="6">Não foi possível carregar os produtos.</td></tr>`;
        }
    }

    carregarProdutos();
});
