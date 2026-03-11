document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('form-cadastrar-cliente');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const cliente = {
            name: document.getElementById('nome').value.trim(),
            phone: document.getElementById('telefone').value.trim(),
            address: document.getElementById('endereco').value.trim()
        };

        // Validação básica
        if (!cliente.name || !cliente.phone || !cliente.address) {
            alert('Por favor, preencha todos os campos!');
            return;
        }

        try {
            // Usando caminho relativo: mais limpo e profissional
            const res = await fetch('/clients', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(cliente)
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Erro ao cadastrar cliente');
            }

            // CORREÇÃO AQUI: O backend envia 'data.id', não 'data.customer.id'
            alert(`✅ Cliente cadastrado com sucesso! ID: ${data.id}`);
            
            form.reset();
            // Opcional: redirecionar para a lista
            // window.location.href = 'clientes.html';

        } catch (err) {
            console.error('❌ Erro no cadastro:', err);
            alert('Erro ao cadastrar cliente: ' + err.message);
        }
    });
});