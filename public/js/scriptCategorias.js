document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('form-cadastrar-categoria');
    const listaCategorias = document.getElementById('lista-categorias');

    // 1. CARREGAR CATEGORIAS (READ)
    async function carregarCategorias() {
        try {
            const res = await fetch('/categories');
            if (!res.ok) throw new Error('Erro ao buscar dados');
            
            const categorias = await res.json();
            listaCategorias.innerHTML = '';

            categorias.forEach(cat => {
                const li = document.createElement('li');
                li.innerHTML = `
                    <span><i class="fas fa-tag" style="color: var(--primary);"></i> ${cat.name}</span>
                    <div class="actions">
                        <button onclick="prepararEdicao(${cat.id}, '${cat.name}')" class="btn-edit" title="Editar">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button onclick="deletarCategoria(${cat.id})" class="btn-delete" title="Excluir">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                `;
                listaCategorias.appendChild(li);
            });
        } catch (error) {
            listaCategorias.innerHTML = '<li style="color: var(--danger);">Erro ao carregar categorias</li>';
        }
    }

    // 2. CADASTRAR OU ATUALIZAR (CREATE / UPDATE)
    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        const inputNome = document.getElementById('nome-categoria');
        const categoriaId = form.dataset.editingId; // Verifica se estamos editando
        const nome = inputNome.value.trim();

        if (!nome) return;

        const url = categoriaId ? `/categories/${categoriaId}` : '/categories';
        const method = categoriaId ? 'PUT' : 'POST';

        try {
            const res = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: nome })
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Erro na operação');

            // Reset do form
            inputNome.value = '';
            delete form.dataset.editingId;
            form.querySelector('button').textContent = 'Salvar Categoria';
            
            carregarCategorias();
        } catch (error) {
            alert(error.message);
        }
    });

    // Torna as funções globais para o onclick funcionar
    window.deletarCategoria = async (id) => {
        if (!confirm("Deseja realmente excluir esta categoria?")) return;

        try {
            const res = await fetch(`/categories/${id}`, { method: 'DELETE' });
            const data = await res.json();

            if (!res.ok) throw new Error(data.error);
            carregarCategorias();
        } catch (error) {
            alert(error.message); // Aqui o Prisma vai avisar se tiver produtos vinculados!
        }
    };

    window.prepararEdicao = (id, nome) => {
        const inputNome = document.getElementById('nome-categoria');
        inputNome.value = nome;
        form.dataset.editingId = id; // Guarda o ID no form
        form.querySelector('button').textContent = 'Atualizar Categoria';
        inputNome.focus();
    };

    carregarCategorias();
});