let movimentacoes = JSON.parse(localStorage.getItem("movimentacoes")) || [];
let editIndex = null;

// Integração com orçamentos - gerar receitas automaticamente
function integrarOrcamentos() {
	let orcamentos = JSON.parse(localStorage.getItem("orcamentos")) || [];
	let clientes = JSON.parse(localStorage.getItem("clientes")) || [];

	orcamentos.forEach((orc) => {
		if (orc.status === "finalizado") {
			// Verificar se já existe movimentação para este orçamento
			let jaExiste = movimentacoes.find((m) => m.orcamentoId === orc.id);

			if (!jaExiste) {
				let cliente = clientes.find((c) => c.nome === orc.cliente);
				let nomeCliente = cliente ? cliente.nome : orc.cliente;

				// Criar receita automaticamente apenas para orçamentos finalizados
				let receita = {
					tipo: "receita",
					descricao: `Serviço Finalizado - ${nomeCliente}`,
					valor: parseFloat(orc.totalGeral.replace('R$', '').replace(',', '.')) || 0,
					data: new Date().toISOString().split("T")[0],
					categoria: "servicos",
					id: Date.now() + Math.random(),
					orcamentoId: orc.id,
				};

				movimentacoes.push(receita);
			}
		}
	});

	salvar();
}

function salvar() {
	localStorage.setItem("movimentacoes", JSON.stringify(movimentacoes));
}

function cadastrarMovimentacao() {
	let tipo = document.getElementById("tipo").value;
	let descricao = document.getElementById("descricao").value;
	let valor = parseFloat(document.getElementById("valor").value);
	let data = document.getElementById("data").value;
	let categoria = document.getElementById("categoria").value;

	if (!descricao || !valor || !data || !categoria) {
		alert("Preencha todos os campos!");
		return;
	}

	let movimentacao = {
		tipo,
		descricao,
		valor,
		data,
		categoria,
		id: Date.now(),
	};

	if (editIndex !== null) {
		movimentacoes[editIndex] = movimentacao;
		editIndex = null;
		document.querySelector(
			"button[onclick='cadastrarMovimentacao()']",
		).innerText = "Cadastrar";
	} else {
		movimentacoes.push(movimentacao);
	}

	salvar();
	listarMovimentacoes();
	atualizarResumo();
	atualizarGraficos();
	limparFormulario();
}

function listarMovimentacoes() {
	let lista = document.getElementById("listaMovimentacoes");
	lista.innerHTML = "";

	let movimentacoesFiltradas = filtrarDados();

	movimentacoesFiltradas.forEach((m, index) => {
		let valorFormatado = formatarMoeda(m.valor);
		let tipoClass = m.tipo === "receita" ? "receita" : "despesa";
		let tipoIcon = m.tipo === "receita" ? "fa-arrow-up" : "fa-arrow-down";

		lista.innerHTML += `
			<tr>
				<td>${formatarData(m.data)}</td>
				<td><span class="tipo ${tipoClass}"><i class="fa-solid ${tipoIcon}"></i> ${m.tipo.charAt(0).toUpperCase() + m.tipo.slice(1)}</span></td>
				<td>${m.descricao}</td>
				<td>${m.categoria.charAt(0).toUpperCase() + m.categoria.slice(1)}</td>
				<td class="${tipoClass}">${valorFormatado}</td>
				<td>
					<button title="Editar" onclick="editar(${movimentacoes.indexOf(m)})">
						<i class="fa-solid fa-pen-to-square" style="color: #1f6feb;"></i>
					</button>
					<button title="Excluir" onclick="excluir(${movimentacoes.indexOf(m)})">
						<i class="fa-solid fa-trash" style="color: rgb(255, 0, 0);"></i>
					</button>
				</td>
			</tr>
		`;
	});
}

function filtrarDados() {
	let filtroTipo = document.getElementById("filtroTipo").value;
	let filtroCategoria = document.getElementById("filtroCategoria").value;
	let filtroMes = document.getElementById("filtroMes").value;

	return movimentacoes.filter((m) => {
		let passaTipo = !filtroTipo || m.tipo === filtroTipo;
		let passaCategoria = !filtroCategoria || m.categoria === filtroCategoria;
		let passaMes = !filtroMes || m.data.startsWith(filtroMes);

		return passaTipo && passaCategoria && passaMes;
	});
}

function filtrarMovimentacoes() {
	listarMovimentacoes();
	atualizarResumo();
}

function atualizarResumo() {
	let movimentacoesFiltradas = filtrarDados();

	let totalReceitas = movimentacoesFiltradas
		.filter((m) => m.tipo === "receita")
		.reduce((total, m) => total + m.valor, 0);

	let totalDespesas = movimentacoesFiltradas
		.filter((m) => m.tipo === "despesa")
		.reduce((total, m) => total + m.valor, 0);

	let saldo = totalReceitas - totalDespesas;

	document.getElementById("totalReceitas").textContent =
		formatarMoeda(totalReceitas);
	document.getElementById("totalDespesas").textContent =
		formatarMoeda(totalDespesas);
	document.getElementById("saldoTotal").textContent = formatarMoeda(saldo);

	// Colorir saldo
	let saldoElement = document.getElementById("saldoTotal");
	if (saldo > 0) {
		saldoElement.style.color = "#28a745";
	} else if (saldo < 0) {
		saldoElement.style.color = "#dc3545";
	} else {
		saldoElement.style.color = "#6c757d";
	}

	// Atualizar saldos de orçamentos
	atualizarSaldosOrcamentos();
}

function atualizarSaldosOrcamentos() {
	let orcamentos = JSON.parse(localStorage.getItem("orcamentos")) || [];
	let saldoPendente = 0;
	let saldoPositivo = 0;

	orcamentos.forEach(orc => {
		const valor = parseFloat(orc.totalGeral.replace('R$', '').replace(',', '.')) || 0;
		
		if (orc.status === 'aprovado') {
			saldoPendente += valor;
		} else if (orc.status === 'finalizado') {
			saldoPositivo += valor;
		}
	});

	const saldoPendenteEl = document.getElementById("saldoPendenteFinanceiro");
	const saldoPositivoEl = document.getElementById("saldoPositivoFinanceiro");

	if (saldoPendenteEl) {
		saldoPendenteEl.textContent = formatarMoeda(saldoPendente);
	}
	if (saldoPositivoEl) {
		saldoPositivoEl.textContent = formatarMoeda(saldoPositivo);
	}
}

function editar(index) {
	let movimentacao = movimentacoes[index];
	document.getElementById("tipo").value = movimentacao.tipo;
	document.getElementById("descricao").value = movimentacao.descricao;
	document.getElementById("valor").value = movimentacao.valor;
	document.getElementById("data").value = movimentacao.data;
	document.getElementById("categoria").value = movimentacao.categoria;
	editIndex = index;
	document.querySelector(
		"button[onclick='cadastrarMovimentacao()']",
	).innerText = "Atualizar";
}

function excluir(index) {
	if (confirm("Tem certeza que deseja excluir esta movimentação?")) {
		movimentacoes.splice(index, 1);
		salvar();
		listarMovimentacoes();
		atualizarResumo();
		atualizarGraficos();
	}
}

function limparFormulario() {
	document.getElementById("tipo").value = "receita";
	document.getElementById("descricao").value = "";
	document.getElementById("valor").value = "";
	document.getElementById("data").value = "";
	document.getElementById("categoria").value = "";
}

function formatarMoeda(valor) {
	return new Intl.NumberFormat("pt-BR", {
		style: "currency",
		currency: "BRL",
	}).format(valor);
}

function formatarData(data) {
	return new Date(data + "T00:00:00").toLocaleDateString("pt-BR");
}

// GRÁFICOS FINANCEIROS
function criarGraficosFinanceiros() {
	// Gráfico Mensal
	const meses = {};
	const hoje = new Date();

	for (let i = 5; i >= 0; i--) {
		const data = new Date(hoje.getFullYear(), hoje.getMonth() - i, 1);
		const mesAno = data.toISOString().slice(0, 7);
		meses[mesAno] = { receitas: 0, despesas: 0 };
	}

	movimentacoes.forEach((m) => {
		const mesAno = m.data.slice(0, 7);
		if (meses[mesAno]) {
			meses[mesAno][m.tipo === "receita" ? "receitas" : "despesas"] += m.valor;
		}
	});

	const ctxMensal = document.getElementById("graficoFinanceiroMensal");
	if (ctxMensal) {
		new Chart(ctxMensal, {
			type: "line",
			data: {
				labels: Object.keys(meses).map((m) => {
					const [ano, mes] = m.split("-");
					return `${mes}/${ano}`;
				}),
				datasets: [
					{
						label: "Receitas",
						data: Object.values(meses).map((m) => m.receitas),
						borderColor: "#28a745",
						backgroundColor: "rgba(40, 167, 69, 0.1)",
						tension: 0.4,
					},
					{
						label: "Despesas",
						data: Object.values(meses).map((m) => m.despesas),
						borderColor: "#dc3545",
						backgroundColor: "rgba(220, 53, 69, 0.1)",
						tension: 0.4,
					},
				],
			},
			options: {
				responsive: true,
				maintainAspectRatio: false,
				scales: {
					y: {
						beginAtZero: true,
						ticks: {
							callback: function (value) {
								return formatarMoeda(value);
							},
						},
					},
				},
			},
		});
	}

	// Gráfico Despesas por Categoria
	const despesasCategorias = {};
	movimentacoes
		.filter((m) => m.tipo === "despesa")
		.forEach((m) => {
			despesasCategorias[m.categoria] =
				(despesasCategorias[m.categoria] || 0) + m.valor;
		});

	const ctxDespesas = document.getElementById("graficoDespesasCategorias");
	if (ctxDespesas) {
		new Chart(ctxDespesas, {
			type: "doughnut",
			data: {
				labels: Object.keys(despesasCategorias),
				datasets: [
					{
						data: Object.values(despesasCategorias),
						backgroundColor: [
							"#dc3545",
							"#f0ad4e",
							"#17a2b8",
							"#6f42c1",
							"#fd7e14",
						],
						borderWidth: 2,
					},
				],
			},
			options: {
				responsive: true,
				maintainAspectRatio: false,
				plugins: {
					legend: {
						position: "bottom",
					},
				},
			},
		});
	}
}

function atualizarGraficos() {
	// Limpar gráficos existentes
	Chart.getChart("graficoFinanceiroMensal")?.destroy();
	Chart.getChart("graficoDespesasCategorias")?.destroy();

	// Recriar gráficos
	setTimeout(criarGraficosFinanceiros, 100);
}

// Definir data atual como padrão
document.getElementById("data").value = new Date().toISOString().split("T")[0];

// Definir mês atual como filtro padrão
document.getElementById("filtroMes").value = new Date()
	.toISOString()
	.slice(0, 7);

// Integrar orçamentos ao carregar
integrarOrcamentos();

// Carregar dados ao iniciar
listarMovimentacoes();
atualizarResumo();

// Criar gráficos após carregar dados
setTimeout(criarGraficosFinanceiros, 100);

// Função de logout
function logout() {
	if (confirm("Tem certeza que deseja sair do sistema?")) {
		window.location.href = "login.html";
	}
}
