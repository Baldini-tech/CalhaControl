function fazerLogin() {
	const nomeEmpresa = document.getElementById("nomeEmpresa").value.trim();
	const senhaConta = document.getElementById("senhaConta").value.trim();

	if (!nomeEmpresa || !senhaConta) {
		alert("Preencha todos os campos obrigatórios!");
		return;
	}

	const oficinas = JSON.parse(localStorage.getItem("oficinasCadastradas")) || [];
	const oficinaEncontrada = oficinas.find(
		(oficina) =>
			oficina.nomeEmpresa.toLowerCase() === nomeEmpresa.toLowerCase() &&
			oficina.senha === senhaConta,
	);

	if (!oficinaEncontrada) {
		alert("Empresa ou senha inválidos!");
		return;
	}

	const oficinaLogada = {
		nome: oficinaEncontrada.nomeEmpresa,
		nomeFantasia: oficinaEncontrada.nomeFantasia,
		cnpj: oficinaEncontrada.cnpj,
		dataLogin: new Date().toISOString(),
	};

	localStorage.setItem("oficinaLogada", JSON.stringify(oficinaLogada));
	window.location.href = "index.html";
}

// Carregar dados se já existirem
window.onload = function () {
	const oficina = JSON.parse(localStorage.getItem("oficinaLogada"));
	if (oficina) {
		if (confirm("Já existe uma sessão ativa. Deseja continuar?")) {
			window.location.href = "index.html";
		}
	}
};
