let chartDiario;
let chartPizza;

// =========================
// CARREGAR CATEGORIAS
// =========================
async function carregarCategorias() {
    try {
        const res = await fetch("/categories");
        const categorias = await res.json();
        const select = document.getElementById("filtro-categoria");
        if (!select) return;
        select.innerHTML = '<option value="">Todas</option>';
        categorias.forEach(cat => {
            const opt = document.createElement("option");
            opt.value = cat.name.trim();
            opt.textContent = cat.name;
            select.appendChild(opt);
        });
    } catch (err) { console.error("Erro categorias:", err); }
}

// =========================
// LIMPAR FILTROS
// =========================
function limparFiltros() {
    document.getElementById("data-inicio").value = "";
    document.getElementById("data-fim").value = "";
    document.getElementById("filtro-categoria").value = "";
    fetchVendas();
}

// =========================
// BUSCAR VENDAS
// =========================
async function fetchVendas() {
    try {
        const res = await fetch("/sales");
        let vendas = await res.json();
        
        const dataInicio = document.getElementById("data-inicio").value;
        const dataFim = document.getElementById("data-fim").value;
        const catSelecionada = document.getElementById("filtro-categoria").value.toLowerCase().trim();

        // 1. FILTRAGEM
        vendas = vendas.filter(venda => {
            const dVenda = new Date(venda.createdAt);
            const dataVendaFormatada = `${dVenda.getFullYear()}-${String(dVenda.getMonth() + 1).padStart(2, '0')}-${String(dVenda.getDate()).padStart(2, '0')}`;
            
            const matchDataInicio = !dataInicio || dataVendaFormatada >= dataInicio;
            const matchDataFim = !dataFim || dataVendaFormatada <= dataFim;
            
            const matchCategoria = !catSelecionada || venda.items.some(item => {
                const nomeNoBanco = item.product?.category?.name?.toLowerCase().trim() || "";
                return nomeNoBanco === catSelecionada;
            });
            
            return matchDataInicio && matchDataFim && matchCategoria;
        });

        let faturamentoTotal = 0;
        let custoTotal = 0;
        const vendasPorDia = {};
        const vendasPorCategoria = {};
        const rankingProdutos = {};

        const tbody = document.querySelector("#tabela-relatorio tbody");
        tbody.innerHTML = "";

        if (vendas.length === 0) {
            tbody.innerHTML = `<tr><td colspan="5" style="text-align:center; padding:20px;">Nenhum dado encontrado para os filtros.</td></tr>`;
            resetarCards();
            renderizarRanking({});
            return;
        }

        vendas.forEach(venda => {
            faturamentoTotal += venda.total;
            const diaLabel = new Date(venda.createdAt).toLocaleDateString('pt-BR');
            vendasPorDia[diaLabel] = (vendasPorDia[diaLabel] || 0) + venda.total;

            venda.items.forEach(item => {
                // Filtramos o ranking também pela categoria selecionada
                const pCat = item.product?.category?.name?.toLowerCase().trim() || "";
                if (!catSelecionada || pCat === catSelecionada) {
                    rankingProdutos[item.product.name] = (rankingProdutos[item.product.name] || 0) + item.quantity;
                }

                custoTotal += (item.product.cost || 0) * item.quantity;
                const cName = item.product?.category?.name || "Sem Categoria";
                vendasPorCategoria[cName] = (vendasPorCategoria[cName] || 0) + (item.price * item.quantity);
            });

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

        atualizarCards(faturamentoTotal, custoTotal);
        renderizarRanking(rankingProdutos);
        renderizarGraficos(vendasPorDia, vendasPorCategoria);

    } catch (err) { console.error("Erro técnico:", err); }
}

function renderizarRanking(produtos) {
    const lista = document.getElementById("lista-top-produtos");
    if (!lista) return;
    lista.innerHTML = "";
    
    const top5 = Object.entries(produtos)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5);

    top5.forEach(([nome, qtd], index) => {
        const li = document.createElement("li");
        li.className = "ranking-item";
        li.innerHTML = `<div class="product-info"><span class="rank-number">${index + 1}</span><span>${nome}</span></div><span class="qty-badge">${qtd} vendidos</span>`;
        lista.appendChild(li);
    });
}

function atualizarCards(faturamento, custo) {
    const lucro = faturamento - custo;
    const margem = faturamento > 0 ? (lucro / faturamento) * 100 : 0;
    document.getElementById("faturamento-bruto").textContent = `R$ ${faturamento.toFixed(2)}`;
    document.getElementById("custo-total").textContent = `R$ ${custo.toFixed(2)}`;
    document.getElementById("lucro-liquido").textContent = `R$ ${lucro.toFixed(2)}`;
    document.getElementById("margem-lucro").textContent = `Margem: ${margem.toFixed(1)}%`;
}

function resetarCards() {
    document.getElementById("faturamento-bruto").textContent = "R$ 0,00";
    document.getElementById("custo-total").textContent = "R$ 0,00";
    document.getElementById("lucro-liquido").textContent = "R$ 0,00";
    document.getElementById("margem-lucro").textContent = "Margem: 0%";
    if (chartDiario) chartDiario.destroy();
    if (chartPizza) chartPizza.destroy();
}

function renderizarGraficos(dadosDiarios, dadosCategorias) {
    const ctxLinha = document.getElementById("chartVendasDiarias").getContext("2d");
    if (chartDiario) chartDiario.destroy();

    // ORDENAÇÃO DAS DATAS: Transforma em array, ordena cronologicamente e volta para objeto
    const labelsOrdenados = Object.keys(dadosDiarios).sort((a, b) => {
        const [diaA, mesA, anoA] = a.split('/');
        const [diaB, mesB, anoB] = b.split('/');
        return new Date(anoA, mesA - 1, diaA) - new Date(anoB, mesB - 1, diaB);
    });
    
    const valoresOrdenados = labelsOrdenados.map(label => dadosDiarios[label]);

    chartDiario = new Chart(ctxLinha, {
        type: "line",
        data: {
            labels: labelsOrdenados,
            datasets: [{
                label: 'Faturamento',
                data: valoresOrdenados,
                borderColor: "#2563eb",
                backgroundColor: "rgba(37,99,235,0.1)",
                fill: true,
                tension: 0.4
            }]
        },
        options: { responsive: true, plugins: { legend: { display: false } } }
    });

    const ctxPizza = document.getElementById("chartCategorias").getContext("2d");
    if (chartPizza) chartPizza.destroy();
    chartPizza = new Chart(ctxPizza, {
        type: "doughnut",
        data: {
            labels: Object.keys(dadosCategorias),
            datasets: [{
                data: Object.values(dadosCategorias),
                backgroundColor: ["#2563eb", "#10b981", "#ef4444", "#f59e0b", "#6366f1"]
            }]
        },
        options: { responsive: true, plugins: { legend: { position: "bottom" } } }
    });
}

carregarCategorias();
fetchVendas();