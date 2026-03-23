let clientes = JSON.parse(localStorage.getItem("Clientes")) || [];

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
	clientes.push(cliente);

	salvar();
	listarClientes();

	// limpar campos
	document.getElementById("nome").value = "";
	document.getElementById("telefone").value = "";
	document.getElementById("endereco").value = "";
}

function listarClientes() {
	let lista = document.getElementById("listaClientes");
	lista.innerHTML = "";

	clientes.forEach((c) => {
		lista.innerHTML += `
            <tr>
                <td>${c.nome}</td>
                <td>${c.telefone}</td>
                <td>${c.endereco}</td>
            </tr>
        `;
	});
}

// carregar ao abrir
listarClientes();
