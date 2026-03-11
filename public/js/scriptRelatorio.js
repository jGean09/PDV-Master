async function fetchVendas() {
  const tbody = document.querySelector("#tabela-relatorio tbody");
  
  try {
    // 1. Uso de caminho relativo (Profissional)
    const res = await fetch("/sales");
    if (!res.ok) throw new Error("Erro na resposta do servidor");
    
    const vendas = await res.json();
    tbody.innerHTML = "";

    if (vendas.length === 0) {
      tbody.innerHTML = `<tr><td colspan="5" style="text-align:center">Nenhuma venda registrada até o momento.</td></tr>`;
      return;
    }

    vendas.forEach(venda => {
      const tr = document.createElement("tr");

      // Tratamento de segurança para produtos
      const produtosText = venda.items && venda.items.length > 0 
        ? venda.items.map(item => `${item.product_name} (${item.quantity}x)`).join(", ")
        : "Sem produtos";

      // Formatação de data robusta
      const dataFormatada = venda.created_at 
        ? new Date(venda.created_at).toLocaleString('pt-BR') 
        : "Data inválida";

      tr.innerHTML = `
        <td>#${venda.id}</td>
        <td>${venda.customer ? venda.customer.name : 'Consumidor Final'}</td>
        <td>${dataFormatada}</td>
        <td>${produtosText}</td>
        <td><strong>R$ ${Number(venda.total).toFixed(2)}</strong></td>
      `;

      tbody.appendChild(tr);
    });

  } catch (err) {
    console.error("❌ Falha no Relatório:", err);
    tbody.innerHTML = `<tr><td colspan="5" style="color:red; text-align:center">Erro ao carregar vendas: ${err.message}</td></tr>`;
  }
}

fetchVendas();