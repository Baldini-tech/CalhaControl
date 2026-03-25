let servicos = JSON.parse(localStorage.getItem("Servicos")) || [];
let editIndex = null;

function salvar() {
	localStorage.setItem("Servicos", JSON.stringify(servicos));
}

function carregarClientes() {
	let clientes = JSON.parse(localStorage.getItem("Clientes")) || [];
	let select = document.getElementById("cliente");
	let valorAtual = select.value;
	select.innerHTML = "<option value=''>Selecione o Cliente</option>";
	clientes.forEach(c => {
		select.innerHTML += `<option value="${c.nome}">${c.nome}</option>`;
	});
	if (valorAtual) select.value = valorAtual;
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

	if (editIndex !== null) {
		servicos[editIndex] = novo;
		editIndex = null;
		document.querySelector("button[onclick='cadastrarServico()']").innerText = "Salvar";
	} else {
		servicos.push(novo);
	}

	salvar();
	listarServicos();

	document.getElementById("cliente").value = "";
	document.getElementById("descricao").value = "";
	document.getElementById("data").value = "";
}

function listarServicos() {
	let lista = document.getElementById("listaServicos");
	lista.innerHTML = "";

	servicos.forEach((s, index) => {
		lista.innerHTML += `
            <tr>
                <td>${s.cliente}</td>
                <td>${s.descricao}</td>
                <td>${s.data}</td>
                <td><span class="status ${s.status}">${s.status.charAt(0).toUpperCase() + s.status.slice(1)}</span></td>
                <td>
                    <button onclick="editar(${index})">✏️</button>
                    <button onclick="excluir(${index})">🗑️</button>
                </td>
            </tr>
        `;
	});
}

function excluir(index) {
	if (confirm("Excluir serviço?")) {
		servicos.splice(index, 1);
		salvar();
		listarServicos();
	}
}

function editar(index) {
	let s = servicos[index];
	editIndex = index;
	document.getElementById("cliente").value = s.cliente;
	document.getElementById("descricao").value = s.descricao;
	document.getElementById("data").value = s.data;
	document.getElementById("status").value = s.status;
	document.querySelector("button[onclick='cadastrarServico()']").innerText = "Atualizar";
}

carregarClientes();
listarServicos();
