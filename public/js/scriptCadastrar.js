document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('form-cadastrar-produto');
    const selectCategoria = document.getElementById('categoria');
    const btnSalvar = form.querySelector('button[type="submit"]');
    const tituloPagina = document.querySelector('h1');

    // Identifica se estamos editando (procura ?edit=ID na URL)
    const urlParams = new URLSearchParams(window.location.search);
    const produtoId = urlParams.get('edit');

    async function inicializar() {
        await carregarCategorias(); // Primeiro carrega as categorias
        
        if (produtoId) {
            prepararEdicao(produtoId);
        }
    }

    async function carregarCategorias() {
        try {
            const res = await fetch('/categories');
            const categorias = await res.json();
            selectCategoria.innerHTML = '<option value="">-- Selecione uma categoria --</option>';
            categorias.forEach(cat => {
                const option = document.createElement('option');
                option.value = cat.id;
                option.textContent = cat.name;
                selectCategoria.appendChild(option);
            });
        } catch (error) { console.error('Erro categorias:', error); }
    }

        async function prepararEdicao(id) {
        tituloPagina.innerHTML = '<i class="fas fa-edit"></i> Editar Produto';
        btnSalvar.innerHTML = '<i class="fas fa-save"></i> Atualizar Produto';

        try {
            // BUSCA DIRETA PELO ID (Cria essa rota se não tiver)
            const res = await fetch(`/products/${id}`); 
            const p = await res.json();

            if (res.ok) {
                document.getElementById('nome').value = p.name;
                document.getElementById('preco').value = p.price;
                document.getElementById('custo').value = p.cost;
                document.getElementById('quantidade').value = p.quantity;
                selectCategoria.value = p.categoryId;
            } else {
                alert("Produto não encontrado no banco.");
            }
        } catch (error) { 
            console.error(error);
            alert("Erro ao carregar dados."); 
        }
    }

    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const produto = {
            name: document.getElementById('nome').value,
            price: parseFloat(document.getElementById('preco').value),
            cost: parseFloat(document.getElementById('custo').value), // Verifique se o ID no HTML é 'custo'
            quantity: parseInt(document.getElementById('quantidade').value),
            categoryId: parseInt(selectCategoria.value)
        };

        // Decide se faz POST (novo) ou PUT (editar)
        const url = produtoId ? `/products/${produtoId}` : '/products';
        const method = produtoId ? 'PUT' : 'POST';

        try {
            const res = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(produto)
            });

            if (res.ok) {
                alert(produtoId ? '✅ Produto atualizado!' : '✅ Produto cadastrado!');
                window.location.href = 'produtos.html';
            } else {
                const err = await res.json();
                alert('❌ Erro: ' + err.error);
            }
        } catch (error) { alert('🚫 Falha de comunicação.'); }
    });

    inicializar();
});