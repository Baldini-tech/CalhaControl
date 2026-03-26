let clientes = JSON.parse(localStorage.getItem("Clientes")) || [];
let editIndex = null;

function salvar() {
	localStorage.setItem("Clientes", JSON.stringify(clientes));
}

function cadastrarCliente() {
	let nome = document.getElementById("nome").value;
	let telefone = document.getElementById("telefone").value;
	let endereco = document.getElementById("endereco").value;

	if (nome === "" || telefone === "") {
		alert("Preencha os campos obrigatórios!");
		return;
	}

	let cliente = { nome, telefone, endereco };

	if (editIndex !== null) {
		clientes[editIndex] = cliente;
		editIndex = null;
		document.querySelector("button[onclick='cadastrarCliente()']").innerText =
			"Cadastrar";
	} else {
		clientes.push(cliente);
	}

	salvar();
	listarClientes();

	document.getElementById("nome").value = "";
	document.getElementById("telefone").value = "";
	document.getElementById("endereco").value = "";
}

function listarClientes() {
	let lista = document.getElementById("listaClientes");
	lista.innerHTML = "";

	clientes.forEach((c, index) => {
		lista.innerHTML += `
            <tr>
                <td>${c.nome}</td>
                <td>${c.telefone}</td>
                <td>${c.endereco}</td>
                <td>
                    <button title="Editar" onclick="editar(${index})"><i class="fa-solid fa-pen-to-square"></i></button>
                    <button title="Excluir" onclick="excluir(${index})"><i class="fa-solid fa-trash" style="color: rgb(255, 0, 0);"></i></button>
                    <button title="Ver Histórico" onclick="verHistorico(${index})"><i class="fa-solid fa-clock" style="color: rgb(0, 102, 255);"></i></button>
                </td>
            </tr>
        `;
	});
}

function excluir(index) {
	if (confirm("Excluir cliente e todos os seus orçamentos e serviços?")) {
		let nome = clientes[index].nome.toLowerCase();

		let orcamentos = JSON.parse(localStorage.getItem("orcamentos")) || [];
		localStorage.setItem(
			"orcamentos",
			JSON.stringify(
				orcamentos.filter((o) => o.cliente.toLowerCase() !== nome),
			),
		);

		let servicos = JSON.parse(localStorage.getItem("Servicos")) || [];
		localStorage.setItem(
			"Servicos",
			JSON.stringify(servicos.filter((s) => s.cliente.toLowerCase() !== nome)),
		);

		clientes.splice(index, 1);
		salvar();
		listarClientes();
	}
}

function editar(index) {
	let c = clientes[index];
	editIndex = index;
	document.getElementById("nome").value = c.nome;
	document.getElementById("telefone").value = c.telefone;
	document.getElementById("endereco").value = c.endereco;
	document.querySelector("button[onclick='cadastrarCliente()']").innerText =
		"Atualizar";
}

function verHistorico(index) {
	let c = clientes[index];
	let orcamentos = JSON.parse(localStorage.getItem("orcamentos")) || [];
	let servicos = JSON.parse(localStorage.getItem("Servicos")) || [];

	document.getElementById("tituloHistorico").innerText =
		"Histórico — " + c.nome;

	let tbOrc = document.getElementById("historicoOrcamentos");
	let orcDoCliente = orcamentos.filter(
		(o) => o.cliente.toLowerCase() === c.nome.toLowerCase(),
	);
	tbOrc.innerHTML =
		orcDoCliente.length === 0
			? "<tr><td colspan='2'>Nenhum orçamento encontrado.</td></tr>"
			: orcDoCliente
					.map(
						(o) => `
			<tr>
				<td>${o.totalGeral}</td>
				<td><span class="status ${o.status}">${o.status.charAt(0).toUpperCase() + o.status.slice(1)}</span></td>
			</tr>`,
					)
					.join("");

	let tbServ = document.getElementById("historicoServicos");
	let servDoCliente = servicos.filter(
		(s) => s.cliente.toLowerCase() === c.nome.toLowerCase(),
	);
	tbServ.innerHTML =
		servDoCliente.length === 0
			? "<tr><td colspan='3'>Nenhum serviço encontrado.</td></tr>"
			: servDoCliente
					.map(
						(s) => `
			<tr>
				<td>${s.descricao}</td>
				<td>${s.data}</td>
				<td><span class="status ${s.status}">${s.status.charAt(0).toUpperCase() + s.status.slice(1)}</span></td>
			</tr>`,
					)
					.join("");

	document.getElementById("modalHistorico").style.display = "block";
}

function fecharHistorico() {
	document.getElementById("modalHistorico").style.display = "none";
}

listarClientes();
