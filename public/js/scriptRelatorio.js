let chartDiario;
let chartPizza;

async function fetchVendas() {
    try {
        const res = await fetch("/sales");
        let vendas = await res.json();

        // =========================
        // FILTRO POR DATA
        // =========================
        const dataInicio = document.getElementById("data-inicio").value;
        const dataFim = document.getElementById("data-fim").value;

        if (dataInicio || dataFim) {
            vendas = vendas.filter(venda => {
                const dataVenda = new Date(venda.createdAt).toISOString().split('T')[0];

                const dInicio = dataInicio || "1900-01-01";
                const dFim = dataFim || "2100-12-31";

                return dataVenda >= dInicio && dataVenda <= dFim;
            });
        }

        // =========================
        // VARIÁVEIS DE CÁLCULO
        // =========================
        let faturamentoTotal = 0;
        let custoTotal = 0;

        const vendasPorDia = {};
        const vendasPorCategoria = {};

        const tbody = document.querySelector("#tabela-relatorio tbody");
        tbody.innerHTML = "";

        // =========================
        // CASO NÃO TENHA RESULTADO
        // =========================
        if (vendas.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="5" style="text-align:center; padding:2rem;">
                        Nenhum dado encontrado para este período.
                    </td>
                </tr>
            `;
            resetarCards();
            return;
        }

        // =========================
        // PROCESSAR VENDAS
        // =========================
        vendas.forEach(venda => {

            faturamentoTotal += venda.total;

            // AGRUPAR POR DIA
            const dataISO = new Date(venda.createdAt).toLocaleDateString('pt-BR');
            vendasPorDia[dataISO] = (vendasPorDia[dataISO] || 0) + venda.total;

            let custoDaVenda = 0;

            venda.items.forEach(item => {

                // SOMA CUSTO (CMV)
                const custoItem = (item.product.cost || 0) * item.quantity;
                custoDaVenda += custoItem;

                // AGRUPAR POR CATEGORIA
                const catNome = item.product.category ? item.product.category.name : "Geral";

                vendasPorCategoria[catNome] =
                    (vendasPorCategoria[catNome] || 0) + (item.price * item.quantity);
            });

            custoTotal += custoDaVenda;

            // =========================
            // CRIAR LINHA DA TABELA
            // =========================
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

        // =========================
        // CÁLCULOS FINANCEIROS
        // =========================
        const lucroLiquido = faturamentoTotal - custoTotal;

        const margem =
            faturamentoTotal > 0
                ? (lucroLiquido / faturamentoTotal) * 100
                : 0;

        // =========================
        // ATUALIZAR CARDS
        // =========================
        document.getElementById("faturamento-bruto").textContent =
            `R$ ${faturamentoTotal.toFixed(2)}`;

        document.getElementById("custo-total").textContent =
            `R$ ${custoTotal.toFixed(2)}`;

        document.getElementById("lucro-liquido").textContent =
            `R$ ${lucroLiquido.toFixed(2)}`;

        document.getElementById("margem-lucro").textContent =
            `Margem de Lucro: ${margem.toFixed(1)}%`;

        // =========================
        // GRÁFICOS
        // =========================
        renderizarGraficos(vendasPorDia, vendasPorCategoria);

    } catch (err) {
        console.error("Erro no Relatório:", err);
    }
}


// =========================
// RESETAR CARDS
// =========================
function resetarCards() {

    document.getElementById("faturamento-bruto").textContent = "R$ 0,00";
    document.getElementById("custo-total").textContent = "R$ 0,00";
    document.getElementById("lucro-liquido").textContent = "R$ 0,00";
    document.getElementById("margem-lucro").textContent = "Margem: 0%";

    if (chartDiario) chartDiario.destroy();
    if (chartPizza) chartPizza.destroy();

}


// =========================
// RENDERIZAR GRÁFICOS
// =========================
function renderizarGraficos(dadosDiarios, dadosCategorias) {

    // GRÁFICO DE LINHA
    const ctxLinha =
        document.getElementById('chartVendasDiarias').getContext('2d');

    if (chartDiario) chartDiario.destroy();

    chartDiario = new Chart(ctxLinha, {
        type: 'line',

        data: {
            labels: Object.keys(dadosDiarios).reverse(),

            datasets: [
                {
                    label: 'Vendas (R$)',

                    data: Object.values(dadosDiarios).reverse(),

                    borderColor: '#2563eb',

                    backgroundColor: 'rgba(37, 99, 235, 0.1)',

                    fill: true,

                    tension: 0.4
                }
            ]
        },

        options: {
            responsive: true,

            plugins: {
                legend: { display: false }
            }
        }
    });


    // GRÁFICO DE PIZZA
    const ctxPizza =
        document.getElementById('chartCategorias').getContext('2d');

    if (chartPizza) chartPizza.destroy();

    chartPizza = new Chart(ctxPizza, {
        type: 'doughnut',

        data: {
            labels: Object.keys(dadosCategorias),

            datasets: [
                {
                    data: Object.values(dadosCategorias),

                    backgroundColor: [
                        '#2563eb',
                        '#10b981',
                        '#ef4444',
                        '#f59e0b',
                        '#6366f1'
                    ]
                }
            ]
        },

        options: {
            responsive: true,

            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}


// =========================
// INICIAR RELATÓRIO
// =========================
fetchVendas();