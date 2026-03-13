let chartDiario;
let chartPizza;

async function fetchVendas() {
    try {
        const res = await fetch("/sales");
        const vendas = await res.json();
        
        let faturamentoTotal = 0;
        let custoTotal = 0;
        const vendasPorDia = {};
        const vendasPorCategoria = {};

        const tbody = document.querySelector("#tabela-relatorio tbody");
        tbody.innerHTML = "";

        vendas.forEach(venda => {
            faturamentoTotal += venda.total;
            
            // Agrupar faturamento por dia para o gráfico
            const dataISO = new Date(venda.createdAt).toLocaleDateString('pt-BR');
            vendasPorDia[dataISO] = (vendasPorDia[dataISO] || 0) + venda.total;

            let custoDaVenda = 0;
            venda.items.forEach(item => {
                // Soma custo (CMV)
                const custoItem = (item.product.cost || 0) * item.quantity;
                custoDaVenda += custoItem;

                // Agrupar por categoria para o gráfico de pizza
                const catNome = item.product.category ? item.product.category.name : "Geral";
                vendasPorCategoria[catNome] = (vendasPorCategoria[catNome] || 0) + (item.price * item.quantity);
            });
            custoTotal += custoDaVenda;

            // Tabela
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td><span class="id-badge">#${venda.id}</span></td>
                <td><strong>${venda.client ? venda.client.name : 'Consumidor Final'}</strong></td>
                <td>${new Date(venda.createdAt).toLocaleString('pt-BR')}</td>
                <td class="text-muted">${venda.items.map(i => i.product.name).join(", ")}</td>
                <td><span class="price-tag">R$ ${venda.total.toFixed(2)}</span></td>
            `;
            tbody.appendChild(tr);
        });

        // Cálculos de Negócio
        const lucroLiquido = faturamentoTotal - custoTotal;
        const margem = faturamentoTotal > 0 ? (lucroLiquido / faturamentoTotal) * 100 : 0;

        // Atualizar Cards
        document.getElementById("faturamento-bruto").textContent = `R$ ${faturamentoTotal.toFixed(2)}`;
        document.getElementById("custo-total").textContent = `R$ ${custoTotal.toFixed(2)}`;
        document.getElementById("lucro-liquido").textContent = `R$ ${lucroLiquido.toFixed(2)}`;
        document.getElementById("margem-lucro").textContent = `Margem de Lucro: ${margem.toFixed(1)}%`;

        // Chamar renderização dos gráficos
        renderizarGraficos(vendasPorDia, vendasPorCategoria);

    } catch (err) {
        console.error("Erro no Relatório:", err);
    }
}

function renderizarGraficos(dadosDiarios, dadosCategorias) {
    // 1. GRÁFICO DIÁRIO
    const ctxLinha = document.getElementById('chartVendasDiarias').getContext('2d');
    if(chartDiario) chartDiario.destroy();
    chartDiario = new Chart(ctxLinha, {
        type: 'line',
        data: {
            labels: Object.keys(dadosDiarios).reverse(),
            datasets: [{
                label: 'Vendas (R$)',
                data: Object.values(dadosDiarios).reverse(),
                borderColor: '#2563eb',
                backgroundColor: 'rgba(37, 99, 235, 0.1)',
                fill: true,
                tension: 0.4
            }]
        },
        options: { responsive: true, plugins: { legend: { display: false } } }
    });

    // 2. GRÁFICO CATEGORIAS
    const ctxPizza = document.getElementById('chartCategorias').getContext('2d');
    if(chartPizza) chartPizza.destroy();
    chartPizza = new Chart(ctxPizza, {
        type: 'doughnut',
        data: {
            labels: Object.keys(dadosCategorias),
            datasets: [{
                data: Object.values(dadosCategorias),
                backgroundColor: ['#2563eb', '#10b981', '#ef4444', '#f59e0b', '#6366f1']
            }]
        },
        options: { 
            responsive: true,
            plugins: { legend: { position: 'bottom' } } 
        }
    });
}

fetchVendas();