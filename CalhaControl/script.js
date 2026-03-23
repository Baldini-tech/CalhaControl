// ===== DADOS =====
let clientes = JSON.parse(localStorage.getItem("Clientes")) || [];
let orcamentos = JSON.parse(localStorage.getItem("Orcamentos")) || [];
let servicos = JSON.parse(localStorage.getItem("Servicos")) || [];

// ===== ATUALIZAR DASHBOARD =====
function atualizarDashboard() {
    document.getElementById("totalClientes").innerText = clientes.length;
    document.getElementById("totalOrcamentos").innerText = orcamentos.length;
    document.getElementById("totalServicos").innerText = servicos.length;
}

// ===== LISTAR SERVIÇOS =====
function listarServicos() {
    let tabela = document.getElementById("listaServicos");
    tabela.innerHTML = "";

    servicos.forEach(servico => {
        let linha = `
            <tr>
                <td>${servico.cliente}</td>
                <td>${servico.tipo}</td>
                <td>${servico.status}</td>
            </tr>
        `;
        tabela.innerHTML += linha;
    });
}

// ===== SALVAR DADOS =====
function salvarDados() {
    localStorage.setItem("clientes", JSON.stringify(clientes));
    localStorage.setItem("orcamentos", JSON.stringify(orcamentos));
    localStorage.setItem("servicos", JSON.stringify(servicos));
}

// ===== INICIALIZAÇÃO =====
function iniciarSistema() {
    dadosTeste();
    atualizarDashboard();
    listarServicos();
}

// Executa quando abrir a página
iniciarSistema();