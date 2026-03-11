document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('form-cadastrar-categoria');
    const listaCategorias = document.getElementById('lista-categorias');

    // 1. CARREGAR CATEGORIAS
    async function carregarCategorias() {
        try {
            // Caminho relativo: padrão profissional
            const res = await fetch('/categories');
            if (!res.ok) throw new Error('Erro ao buscar dados');
            
            const categorias = await res.json();
            listaCategorias.innerHTML = '';

            if (categorias.length === 0) {
                listaCategorias.innerHTML = '<li style="color: var(--text-muted); padding: 10px;">Nenhuma categoria encontrada.</li>';
                return;
            }

            categorias.forEach(cat => {
                const li = document.createElement('li');
                // Adicionando ícone de tag para cada item da lista
                li.innerHTML = `
                    <span><i class="fas fa-tag" style="color: var(--primary); margin-right: 10px;"></i> ${cat.name}</span>
                    <small style="color: var(--text-muted)">ID: ${cat.id}</small>
                `;
                listaCategorias.appendChild(li);
            });
        } catch (error) {
            console.error('❌ Erro:', error);
            listaCategorias.innerHTML = '<li style="color: var(--danger);">Erro ao carregar categorias</li>';
        }
    }

    // 2. CADASTRAR NOVA CATEGORIA
    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        const inputNome = document.getElementById('nome-categoria');
        const nome = inputNome.value.trim();

        if (!nome) return alert('Por favor, digite o nome da categoria.');

        try {
            const res = await fetch('/categories', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: nome })
            });

            const data = await res.json();

            if (!res.ok) {
                // Se o backend disser que já existe (409) ou outro erro
                throw new Error(data.error || 'Erro ao processar cadastro');
            }

            // Sucesso: limpa o campo e recarrega a lista
            inputNome.value = '';
            carregarCategorias();
            
            // Feedback visual sutil (Opcional)
            console.log('✅ Categoria cadastrada:', data.id);

        } catch (error) {
            console.error('❌ Erro no cadastro:', error.message);
            alert('Erro: ' + error.message);
        }
    });

    // Inicialização
    carregarCategorias();
});