let servicos = JSON.parse(localStorage.getItem("Servicos")) || [];
let editIndex = null;

function salvar() {
	localStorage.setItem("Servicos", JSON.stringify(servicos));
}

function carregarClientes() {
	let clientes = JSON.parse(localStorage.getItem("Clientes")) || [];
	let input = document.getElementById("cliente");
	let sugestoes = document.getElementById("clienteSugestoes");

	if (!input || !sugestoes) return;

	input.addEventListener("input", function () {
		const termo = this.value.toLowerCase().trim();

		if (termo.length === 0) {
			sugestoes.classList.remove("show");
			return;
		}

		const clientesFiltrados = clientes.filter(
			(cliente) =>
				cliente.nome.toLowerCase().includes(termo) ||
				cliente.telefone.includes(termo) ||
				cliente.email.toLowerCase().includes(termo),
		);

		mostrarSugestoes(clientesFiltrados);
	});

	document.addEventListener("click", function (e) {
		if (!input.contains(e.target) && !sugestoes.contains(e.target)) {
			sugestoes.classList.remove("show");
		}
	});

	input.addEventListener("keydown", function (e) {
		const items = sugestoes.querySelectorAll(".sugestao-item");
		let selected = sugestoes.querySelector(".sugestao-item.selected");

		if (e.key === "ArrowDown") {
			e.preventDefault();
			if (!selected) {
				items[0]?.classList.add("selected");
			} else {
				selected.classList.remove("selected");
				const next = selected.nextElementSibling;
				if (next) next.classList.add("selected");
				else items[0]?.classList.add("selected");
			}
		} else if (e.key === "ArrowUp") {
			e.preventDefault();
			if (!selected) {
				items[items.length - 1]?.classList.add("selected");
			} else {
				selected.classList.remove("selected");
				const prev = selected.previousElementSibling;
				if (prev) prev.classList.add("selected");
				else items[items.length - 1]?.classList.add("selected");
			}
		} else if (e.key === "Enter") {
			e.preventDefault();
			if (selected) {
				selecionarCliente(selected.dataset.nome);
			}
		} else if (e.key === "Escape") {
			sugestoes.classList.remove("show");
		}
	});
}

function mostrarSugestoes(clientes) {
	const sugestoes = document.getElementById("clienteSugestoes");
	const termo = document.getElementById("cliente").value.trim();

	let html = "";

	if (clientes.length > 0) {
		html = clientes
			.map(
				(cliente) => `
      <div class="sugestao-item" data-nome="${cliente.nome}" onclick="selecionarCliente('${cliente.nome}')">
        <div class="sugestao-nome">${cliente.nome}</div>
        <div class="sugestao-info">${cliente.telefone} • ${cliente.email}</div>
      </div>
    `,
			)
			.join("");

		const clienteExato = clientes.find(
			(c) => c.nome.toLowerCase() === termo.toLowerCase(),
		);
	}

	sugestoes.innerHTML = html;
	sugestoes.classList.add("show");
}

function adicionarNovoCliente(nome) {
	const telefone = prompt(`Digite o telefone para ${nome}:`);
	if (!telefone) return;

	const email = prompt(`Digite o email para ${nome}:`) || "";

	let clientes = JSON.parse(localStorage.getItem("Clientes")) || [];
	const novoCliente = {
		nome: nome,
		telefone: telefone,
		email: email,
		id: Date.now(),
	};

	clientes.push(novoCliente);
	localStorage.setItem("Clientes", JSON.stringify(clientes));

	selecionarCliente(nome);
	alert(`Cliente "${nome}" adicionado com sucesso!`);
}

function selecionarCliente(nome) {
	const input = document.getElementById("cliente");
	const sugestoes = document.getElementById("clienteSugestoes");

	input.value = nome;
	sugestoes.classList.remove("show");
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
		document.querySelector("button[onclick='cadastrarServico()']").innerText =
			"Salvar";
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
                    <button title="Editar" onclick="editar(${index})"><i class="fa-solid fa-pen-to-square" style="color: #1f6feb;"></i></button>
                    <button title="Excluir" onclick="excluir(${index})"><i class="fa-solid fa-trash" style="color: rgb(255, 0, 0);"></i></button>
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
	document.querySelector("button[onclick='cadastrarServico()']").innerText =
		"Atualizar";
}

carregarClientes();
listarServicos();
