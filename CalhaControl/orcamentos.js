// 🔥 CARREGAR DADOS
let orcamentos = JSON.parse(localStorage.getItem("orcamentos")) || [];
let editIndex = null;

function salvar() {
	localStorage.setItem("orcamentos", JSON.stringify(orcamentos));
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

// 🔥 ADICIONAR LINHA
function adicionarItem() {
	const tabela = document.getElementById("itens");

	const linha = document.createElement("tr");

	linha.innerHTML = `
        <td><input type="text" placeholder="Serviço"></td>
        <td><input type="number" class="corte" placeholder="0"></td>
        <td><input type="number" class="metros" placeholder="0"></td>
        <td><input type="number" class="valorMetro" placeholder="0"></td>
        <td class="total">R$ 0.00</td>
        <td><button onclick="removerLinha(this)">🗑️</button></td>
    `;

	tabela.appendChild(linha);
	atualizarCalculo(linha);
}

// 🔥 REMOVER LINHA
function removerLinha(btn) {
	btn.parentElement.parentElement.remove();
	atualizarTotalGeral();
}

// 🔥 CALCULAR
function atualizarCalculo(linha) {
	const metros = linha.querySelector(".metros");
	const corte = linha.querySelector(".corte");
	const valorMetro = linha.querySelector(".valorMetro");
	const total = linha.querySelector(".total");

	function calcular() {
		let m = parseFloat(metros.value) || 0;
		let c = parseFloat(corte.value) || 0;
		let v = parseFloat(valorMetro.value) || 0;

		let resultado = v * c * m;

		total.innerHTML = "R$ " + resultado.toFixed(2);
		atualizarTotalGeral();
	}

	metros.addEventListener("input", calcular);
	corte.addEventListener("input", calcular);
	valorMetro.addEventListener("input", calcular);
}

// 🔥 TOTAL GERAL
function atualizarTotalGeral() {
	let totais = document.querySelectorAll(".total");
	let soma = 0;

	totais.forEach((td) => {
		let valor = parseFloat(td.innerText.replace("R$", "")) || 0;
		soma += valor;
	});

	document.getElementById("totalGeral").innerText = "R$ " + soma.toFixed(2);
}

// 🔥 SALVAR OU EDITAR
function salvarOrcamento() {
	let cliente = document.getElementById("cliente").value;
	let status = document.getElementById("status").value;

	if (cliente === "") {
		alert("Selecione o cliente!");
		return;
	}

	let itens = [];

	document.querySelectorAll("#itens tr").forEach((linha) => {
		let servico = linha.children[0].querySelector("input").value;
		let corte = linha.children[1].querySelector("input").value;
		let metros = linha.children[2].querySelector("input").value;
		let valorMetro = linha.children[3].querySelector("input").value;
		let total = linha.children[4].innerText;

		if (servico !== "") {
			itens.push({ servico, corte, metros, valorMetro, total });
		}
	});

	let totalGeral = document.getElementById("totalGeral").innerText;

	let novo = { cliente, status, itens, totalGeral };

	if (editIndex !== null) {
		orcamentos[editIndex] = novo;
		editIndex = null;
	} else {
		orcamentos.push(novo);
	}

	salvar();
	listarOrcamentos();
	limparTela();
}

// 🔥 LIMPAR
function limparTela() {
	document.getElementById("cliente").value = "";
	document.getElementById("itens").innerHTML = "";
	document.getElementById("totalGeral").innerText = "R$ 0.00";
}

// 🔥 LISTAR COM AÇÕES
function listarOrcamentos() {
	let lista = document.getElementById("listaOrcamentos");
	if (!lista) return;

	lista.innerHTML = "";

	orcamentos.forEach((o, index) => {
		lista.innerHTML += `
        <tr>
            <td>${o.cliente}</td>
            <td><span class="status ${o.status}">${o.status.charAt(0).toUpperCase() + o.status.slice(1)}</span></td>
            <td>${o.totalGeral}</td>
            <td>
                <button onclick="editar(${index})">✏️</button>
                <button onclick="excluir(${index})">🗑️</button>
                <button onclick="gerarPDF(${index})">📄</button>
                <button onclick="enviarWhats(${index})">📲</button>
            </td>
        </tr>
        `;
	});
}

// 🔥 EXCLUIR
function excluir(index) {
	if (confirm("Excluir orçamento?")) {
		orcamentos.splice(index, 1);
		salvar();
		listarOrcamentos();
	}
}

// 🔥 EDITAR
function editar(index) {
	let o = orcamentos[index];

	editIndex = index;

	document.getElementById("cliente").value = o.cliente;
	document.getElementById("status").value = o.status;
	document.getElementById("itens").innerHTML = "";

	o.itens.forEach((item) => {
		adicionarItem();

		let linha = document.querySelector("#itens tr:last-child");

		linha.children[0].querySelector("input").value = item.servico;
		linha.children[1].querySelector("input").value = item.corte;
		linha.children[2].querySelector("input").value = item.metros;
		linha.children[3].querySelector("input").value = item.valorMetro;
	});

	atualizarTotalGeral();
}

// 🔥 PDF PROFISSIONAL
function gerarPDF(index) {
	const { jsPDF } = window.jspdf;
	let doc = new jsPDF();

	let o = orcamentos[index];

	let y = 10;
	doc.setFontSize(16);
	doc.text("CalhaControl - Orçamento", 10, y);

	y += 10;
	doc.setFontSize(12);
	doc.text("Cliente: " + o.cliente, 10, y);

	y += 10;

	o.itens.forEach((item) => {
		doc.text(`${item.servico} - ${item.metros}m - ${item.total}`, 10, y);
		y += 8;
	});

	y += 5;
	doc.text("Total: " + o.totalGeral, 10, y);

	doc.save("orcamento.pdf");
}

// 🔥 WHATSAPP
function enviarWhats(index) {
	let o = orcamentos[index];

	let texto = `Orçamento - ${o.cliente}%0A`;

	o.itens.forEach((item) => {
		texto += `${item.servico} - ${item.metros}m - ${item.total}%0A`;
	});

	texto += `Total: ${o.totalGeral}`;

	window.open(`https://wa.me/?text=${texto}`);
}

// 🔥 DASHBOARD (FATURAMENTO)
function calcularFaturamento() {
	let total = 0;

	orcamentos.forEach((o) => {
		if (o.status === "aprovado") {
			let valor = parseFloat(o.totalGeral.replace("R$", "")) || 0;
			total += valor;
		}
	});

	console.log("Faturamento:", total);
	return total;
}

// 🔥 INICIAR
carregarClientes();
listarOrcamentos();
