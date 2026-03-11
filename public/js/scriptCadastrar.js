document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('form-cadastrar-produto');
    const selectCategoria = document.getElementById('categoria');

    // 1. Carregar categorias usando caminho relativo (Mais profissional)
    async function carregarCategorias() {
        try {
            const res = await fetch('/categories'); 
            const categorias = await res.json();

            // Limpa o select antes de preencher
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

        // Pegamos os valores e tratamos possíveis campos ausentes no HTML
        const produto = {
            name: document.getElementById('nome').value,
            price: parseFloat(document.getElementById('preco').value),
            custo: parseFloat(document.getElementById('custo').value),
            quantity: parseInt(document.getElementById('quantidade').value),
            // Se o campo fornecedor não existir no HTML, enviamos null sem quebrar o código
            fornecedor: document.getElementById('fornecedor') ? document.getElementById('fornecedor').value : null,
            category_id: selectCategoria.value ? parseInt(selectCategoria.value) : null
        };

        // Validação de dados
        if (!produto.name || isNaN(produto.price) || isNaN(produto.custo) || isNaN(produto.quantity)) {
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
            alert('🚫 Falha na comunicação com o servidor. Verifique se o terminal do VS Code está rodando.');
        }
    });

    carregarCategorias();
});