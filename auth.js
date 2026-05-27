function verificarLogin() {
	const oficinaLogada = localStorage.getItem("oficinaLogada");
	const paginaAtual = window.location.pathname;

	if (
		!oficinaLogada &&
		!paginaAtual.includes("login.html") &&
		!paginaAtual.includes("registrar.html")
	) {
		window.location.href = "login.html";
	}
}

function fazerLogout() {
	if (confirm("Deseja realmente sair?")) {
		localStorage.removeItem("oficinaLogada");
		window.location.href = "login.html";
	}
}

function buscarPerfilLogado() {
	const oficinaLogada = JSON.parse(localStorage.getItem("oficinaLogada"));

	if (!oficinaLogada) {
		return null;
	}

	const oficinas = JSON.parse(localStorage.getItem("oficinasCadastradas")) || [];
	const cadastroCompleto = oficinas.find(
		(oficina) =>
			oficina.cnpj === oficinaLogada.cnpj ||
			oficina.nomeEmpresa === oficinaLogada.nome,
	);

	return {
		...oficinaLogada,
		...cadastroCompleto,
	};
}

function montarAreaUsuario() {
	const sidebar = document.querySelector(".sidebar");
	const perfil = buscarPerfilLogado();

	if (!sidebar || !perfil || document.querySelector(".user-area")) {
		return;
	}

	const nomeExibicao = perfil.nomeFantasia || perfil.nomeEmpresa || perfil.nome;

	const areaUsuario = document.createElement("div");
	areaUsuario.className = "user-area";
	areaUsuario.innerHTML = `
		<div class="user-summary">
			<i class="fa-solid fa-circle-user"></i>
			<span>${nomeExibicao}</span>
		</div>
		<button type="button" class="user-button" onclick="abrirPerfil()">
			<i class="fa-solid fa-user"></i> Perfil
		</button>
		<button type="button" class="logout-button" onclick="fazerLogout()">
			<i class="fa-solid fa-right-from-bracket"></i> Sair
		</button>
	`;

	sidebar.appendChild(areaUsuario);
}

function montarModalPerfil() {
	if (document.getElementById("modalPerfil")) {
		return;
	}

	const modal = document.createElement("div");
	modal.id = "modalPerfil";
	modal.className = "modal-overlay";
	modal.innerHTML = `
		<div class="modal-box perfil-modal">
			<h2>Perfil logado</h2>
			<div id="dadosPerfil" class="perfil-dados"></div>
			<button type="button" onclick="fecharPerfil()">Fechar</button>
		</div>
	`;

	document.body.appendChild(modal);
}

function abrirPerfil() {
	const perfil = buscarPerfilLogado();

	if (!perfil) {
		window.location.href = "login.html";
		return;
	}

	const dadosPerfil = document.getElementById("dadosPerfil");
	const modalPerfil = document.getElementById("modalPerfil");

	dadosPerfil.innerHTML = `
		<p><strong>Empresa:</strong> ${perfil.nomeEmpresa || perfil.nome || "-"}</p>
		<p><strong>Nome fantasia:</strong> ${perfil.nomeFantasia || "-"}</p>
		<p><strong>CNPJ:</strong> ${perfil.cnpj || "-"}</p>
		<p><strong>Telefone:</strong> ${perfil.telefoneFixo || "-"}</p>
		<p><strong>WhatsApp:</strong> ${perfil.whatsApp || "-"}</p>
		<p><strong>Email:</strong> ${perfil.email || "-"}</p>
		<p><strong>Cidade:</strong> ${perfil.cidade || "-"}</p>
		<p><strong>Estado:</strong> ${perfil.estado || "-"}</p>
	`;
	modalPerfil.style.display = "block";
}

function fecharPerfil() {
	document.getElementById("modalPerfil").style.display = "none";
}

verificarLogin();

document.addEventListener("DOMContentLoaded", function () {
	montarAreaUsuario();
	montarModalPerfil();
});
