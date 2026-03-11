async function carregarClientes() {
    const tbody = document.getElementById('lista-clientes-tbody');
    try {
        const response = await fetch('/clients'); // SEM LOCALHOST:3000
        const clientes = await response.json();
        
        tbody.innerHTML = '';
        clientes.forEach(cliente => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td style="font-weight: 600; color: var(--primary);">${cliente.name}</td>
                <td>${cliente.phone || '---'}</td>
                <td>${cliente.address || '---'}</td>
            `;
            tbody.appendChild(tr);
        });
    } catch (err) {
        console.error('Erro ao carregar clientes:', err);
    }
}
carregarClientes();