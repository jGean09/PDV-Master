document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('form-cadastrar-produto');
    const selectCategoria = document.getElementById('categoria');

    // 1. Carregar categorias usando caminho relativo
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
        } catch (error) {
            console.error('Erro ao carregar categorias:', error);
        }
    }

    // 2. Evento de salvar
    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        // Objeto ajustado para o padrão esperado pelo Prisma no Backend
        const produto = {
            name: document.getElementById('nome').value,
            price: parseFloat(document.getElementById('preco').value),
            cost: parseFloat(document.getElementById('custo').value), // Mapeado corretamente para 'cost'
            quantity: parseInt(document.getElementById('quantidade').value),
            categoryId: selectCategoria.value ? parseInt(selectCategoria.value) : null
        };

        // VALIDAÇÃO CORRIGIDA: Agora verifica 'cost' em vez de 'custo'
        if (!produto.name || isNaN(produto.price) || isNaN(produto.cost) || isNaN(produto.quantity)) {
            alert('⚠️ Preencha todos os campos numéricos corretamente.');
            return;
        }

        try {
            const res = await fetch('/products', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(produto)
            });

            const data = await res.json();

            if (res.ok) {
                alert('✅ Produto cadastrado com sucesso!');
                window.location.href = 'produtos.html';
            } else {
                alert('❌ Erro: ' + (data.error || 'Erro ao salvar'));
            }

        } catch (error) {
            console.error('Erro:', error);
            alert('🚫 Falha na comunicação com o servidor. Verifique se o servidor Node está rodando.');
        }
    });

    carregarCategorias();
});