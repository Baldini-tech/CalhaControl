function cadastrar() {
	const nomeEmpresa = document.getElementById("nomeEmpresa").value.trim();
	const nomeFantasia = document.getElementById("nomeFantasia").value.trim();
	const senhaConta = document.getElementById("senhaConta").value.trim();
	const cnpj = document.getElementById("cnpj").value.trim();
	const inscricaoEstadual = document
		.getElementById("inscricaoEstadual")
		.value.trim();
	const telefoneFixo = document.getElementById("telefoneFixo").value.trim();
	const whatsApp = document.getElementById("whatsApp").value.trim();
	const email = document.getElementById("email").value.trim();
	const cep = document.getElementById("cep").value.trim();
	const rua = document.getElementById("rua").value.trim();
	const numero = document.getElementById("numero").value.trim();
	const bairro = document.getElementById("bairro").value.trim();
	const cidade = document.getElementById("cidade").value.trim();
	const estado = document.getElementById("estado").value.trim();
	const complemento = document.getElementById("complemento").value.trim();

	if (
		!nomeEmpresa ||
		!nomeFantasia ||
		!senhaConta ||
		!cnpj ||
		!inscricaoEstadual ||
		!telefoneFixo ||
		!whatsApp
	) {
		alert("Preencha todos os campos obrigatórios!");
		return;
	}

	const novaOficina = {
		nomeEmpresa: nomeEmpresa,
		nomeFantasia: nomeFantasia,
		senha: senhaConta,
		cnpj: cnpj,
		inscricaoEstadual: inscricaoEstadual,
		telefoneFixo: telefoneFixo,
		whatsApp: whatsApp,
		email: email,
		cep: cep,
		rua: rua,
		numero: numero,
		bairro: bairro,
		cidade: cidade,
		estado: estado,
		complemento: complemento,
		dataCadastro: new Date().toISOString(),
	};

	const oficinas = JSON.parse(localStorage.getItem("oficinasCadastradas")) || [];
	const empresaJaCadastrada = oficinas.some(
		(oficina) =>
			oficina.nomeEmpresa.toLowerCase() === nomeEmpresa.toLowerCase() ||
			oficina.cnpj === cnpj,
	);

	if (empresaJaCadastrada) {
		alert("Empresa já cadastrada!");
		return;
	}

	oficinas.push(novaOficina);
	localStorage.setItem("oficinasCadastradas", JSON.stringify(oficinas));
	alert("Cadastro realizado com sucesso!");
	window.location.href = "login.html";
}

function cancelar() {
	window.location.href = "login.html";
}
