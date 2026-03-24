let servicos = JSON.parse(localStorage.getItem("Servicos")) || [];

function salvar() {
	localStorage.setItem("Servicos", JSON.stringify(servicos));
}

function cadastrarServico() {
	let cliente = document.getElementById("cliente").value;
	let descricao = document.getElementById("descricao").value;
	let data = document.getElementById("data").value;
	let status = document.getElementById("status").value;

	if (cliente === "" || descricao === "" || data === "") {
		alert("Preencha todos os campos!");
		return;
	}

	let novo = { cliente, descricao, data, status };
	servicos.push(novo);

	salvar();
	listarServicos();

	// limpar
	document.getElementById("cliente").value = "";
	document.getElementById("descricao").value = "";
	document.getElementById("data").value = "";
}

function listarServicos() {
	let lista = document.getElementById("listaServicos");
	lista.innerHTML = "";

	servicos.forEach((s) => {
		lista.innerHTML += `
            <tr>
                <td>${s.cliente}</td>
                <td>${s.descricao}</td>
                <td>${s.data}</td>
                <td><span class="status ${s.status}">${s.status}</span></td>
            </tr>
        `;
	});
}

listarServicos();

function toggleMenu(element) {
	let menuItem = element.parentElement;
	menuItem.classList.toggle("open");
}
