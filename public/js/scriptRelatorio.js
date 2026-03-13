async function fetchVendas() {
    const tbody = document.querySelector("#tabela-relatorio tbody");
    const faturamentoCard = document.getElementById("faturamento-total");
    
    try {
        const res = await fetch("/sales");
        if (!res.ok) throw new Error("Erro na resposta do servidor");
        
        const vendas = await res.json();
        tbody.innerHTML = "";
        let faturamentoAcumulado = 0;

        if (vendas.length === 0) {
            tbody.innerHTML = `<tr><td colspan="5" style="text-align:center">Nenhuma venda registrada.</td></tr>`;
            faturamentoCard.textContent = "R$ 0,00";
            return;
        }

        vendas.forEach(venda => {
            const tr = document.createElement("tr");
            faturamentoAcumulado += venda.total;

            // 1. Ajuste dos Produtos (Acessando via relação do Prisma)
            const produtosText = venda.items && venda.items.length > 0 
                ? venda.items.map(item => `${item.product.name} (${item.quantity}x)`).join(", ")
                : "Sem produtos";

            // 2. Ajuste da Data (Prisma usa createdAt)
            const dataFormatada = venda.createdAt 
                ? new Date(venda.createdAt).toLocaleString('pt-BR') 
                : "Data inválida";

            // 3. Ajuste do Cliente (Prisma usa venda.client)
            const nomeCliente = venda.client ? venda.client.name : 'Consumidor Final';

            tr.innerHTML = `
                <td>#${venda.id}</td>
                <td>${nomeCliente}</td>
                <td>${dataFormatada}</td>
                <td>${produtosText}</td>
                <td><strong>R$ ${Number(venda.total).toFixed(2)}</strong></td>
            `;

            tbody.appendChild(tr);
        });

        // Atualiza o card de faturamento no topo
        faturamentoCard.textContent = `R$ ${faturamentoAcumulado.toFixed(2)}`;

    } catch (err) {
        console.error("❌ Falha no Relatório:", err);
        tbody.innerHTML = `<tr><td colspan="5" style="color:red; text-align:center">Erro ao carregar: ${err.message}</td></tr>`;
    }
}

fetchVendas();