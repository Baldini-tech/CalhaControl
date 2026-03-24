const clientes   = JSON.parse(localStorage.getItem("Clientes"))   || [];
const orcamentos = JSON.parse(localStorage.getItem("orcamentos")) || [];
const servicos   = JSON.parse(localStorage.getItem("Servicos"))   || [];

document.getElementById("totalClientes").innerText   = clientes.length;
document.getElementById("totalOrcamentos").innerText = orcamentos.length;
document.getElementById("totalServicos").innerText   = servicos.length;

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