const clientes   = JSON.parse(localStorage.getItem("Clientes"))   || [];
const orcamentos = JSON.parse(localStorage.getItem("orcamentos")) || [];
const servicos   = JSON.parse(localStorage.getItem("Servicos"))   || [];

document.getElementById("totalClientes").innerText   = clientes.length;
document.getElementById("totalOrcamentos").innerText = orcamentos.length;
document.getElementById("totalServicos").innerText   = servicos.length;

// Calcular saldos financeiros
function calcularSaldos() {
    let saldoPendente = 0;
    let saldoPositivo = 0;
    
    orcamentos.forEach(orc => {
        const valor = parseFloat(orc.totalGeral.replace('R$', '').replace(',', '.')) || 0;
        
        if (orc.status === 'aprovado') {
            saldoPendente += valor;
        } else if (orc.status === 'finalizado') {
            saldoPositivo += valor;
        }
    });
    
    document.getElementById("saldoPendente").innerText = formatarMoeda(saldoPendente);
    document.getElementById("saldoPositivo").innerText = formatarMoeda(saldoPositivo);
}

function formatarMoeda(valor) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(valor);
}

calcularSaldos();

const tabela = document.getElementById("listaServicos");
servicos.slice(-5).reverse().forEach(s => {
    tabela.innerHTML += `
        <tr>
            <td>${s.cliente}</td>
            <td>${s.descricao}</td>
            <td><span class="status ${s.status}">${s.status.charAt(0).toUpperCase() + s.status.slice(1)}</span></td>
        </tr>
    `;
});