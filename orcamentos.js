// 🔥 CARREGAR DADOS
let orcamentos = JSON.parse(localStorage.getItem("orcamentos")) || [];
let editIndex = null;

function salvar() {
  localStorage.setItem("orcamentos", JSON.stringify(orcamentos));
}

// 🔥 FORMATAR MOEDA
function formatarMoeda(valor) {
  return valor.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

// 🔥 CONVERTER STRING DE MOEDA PARA NÚMERO
function parseMoeda(str) {
  // Remove "R$", espaços, pontos de milhar, troca vírgula decimal por ponto
  return (
    parseFloat(
      String(str)
        .replace(/R\$\s*/g, "")
        .replace(/\./g, "")
        .replace(",", ".")
        .trim(),
    ) || 0
  );
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

  if (clientes.length === 0 && termo.length > 0) {
    html = `
      <div class="sugestao-item novo-cliente" onclick="adicionarNovoCliente('${termo}')">
        <div class="sugestao-nome"><i class="fa-solid fa-plus"></i> Adicionar "${termo}" como novo cliente</div>
        <div class="sugestao-info">Clique para criar um novo cliente</div>
      </div>
    `;
  } else if (clientes.length > 0) {
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
    if (!clienteExato && termo.length > 0) {
      html += `
        <div class="sugestao-item novo-cliente" onclick="adicionarNovoCliente('${termo}')">
          <div class="sugestao-nome"><i class="fa-solid fa-plus"></i> Adicionar "${termo}" como novo cliente</div>
          <div class="sugestao-info">Clique para criar um novo cliente</div>
        </div>
      `;
    }
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

// 🔥 ADICIONAR LINHA
// Colunas: [0] Serviço | [1] Corte | [2] Metros | [3] Valor/m | [4] Total | [5] Ações
function adicionarItem() {
  const tabela = document.getElementById("itens");
  const linha = document.createElement("tr");

  linha.innerHTML = `
    <td><input type="text" placeholder="Serviço"></td>
    <td><input type="number" class="corte" placeholder="0"></td>
    <td><input type="number" class="metros" placeholder="0"></td>
    <td><input type="number" class="valorMetro" placeholder="0"></td>
    <td class="total">R$ 0,00</td>
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

    total.innerText = formatarMoeda(resultado);
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
    soma += parseMoeda(td.innerText);
  });

  document.getElementById("totalGeral").innerText = formatarMoeda(soma);
}

// 🔥 SALVAR OU EDITAR
// Índices: [0] Serviço | [1] Corte | [2] Metros | [3] Valor/m | [4] Total | [5] Ações
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

  let totalGeralNumero = parseMoeda(
    document.getElementById("totalGeral").innerText,
  );

  let novo = {
    id: editIndex !== null ? orcamentos[editIndex].id : Date.now(),
    cliente,
    status,
    itens,
    totalGeral: formatarMoeda(totalGeralNumero),
    total: totalGeralNumero,
  };

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
  document.getElementById("totalGeral").innerText = "R$ 0,00";
  document.getElementById("status").value = "pendente";

  const sugestoes = document.getElementById("clienteSugestoes");
  if (sugestoes) {
    sugestoes.classList.remove("show");
  }
}

// 🔥 LISTAR COM AÇÕES
function listarOrcamentos() {
  let lista = document.getElementById("listaOrcamentos");
  if (!lista) return;

  lista.innerHTML = "";

  orcamentos.forEach((o, index) => {
    // Garante exibição formatada mesmo em registros antigos com valor cru
    const totalExibido =
      typeof o.total === "number"
        ? formatarMoeda(o.total)
        : formatarMoeda(parseMoeda(o.totalGeral));

    lista.innerHTML += `
      <tr>
        <td>${o.cliente}</td>
        <td><span class="status ${o.status}">${o.status.charAt(0).toUpperCase() + o.status.slice(1)}</span></td>
        <td>${totalExibido}</td>
        <td>
          <button title="Editar" onclick="editar(${index})"><i class="fa-solid fa-pen-to-square" style="color: #1f6feb;"></i></button>
          <button title="Excluir" onclick="excluir(${index})"><i class="fa-solid fa-trash" style="color: rgb(255, 0, 0);"></i></button>
          <button title="Gerar PDF" onclick="gerarPDF(${index})"><i class="fa-solid fa-file-pdf" style="color: rgb(255, 2, 2);"></i></button>
          <button title="Enviar WhatsApp" onclick="enviarWhats(${index})"><i class="fa-brands fa-whatsapp" style="color: rgb(0, 255, 17);"></i></button>
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
// Índices: [0] Serviço | [1] Corte | [2] Metros | [3] Valor/m | [4] Total | [5] Ações
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
    linha.children[4].innerText = item.total;
  });

  document.getElementById("totalGeral").innerText = o.totalGeral;
}

// 🔥 PDF
function gerarPDF(index) {
  try {
    mostrarNotificacao("Processando orçamento...", "info", 2000);

    const { jsPDF } = window.jspdf;
    let doc = new jsPDF();

    let o = orcamentos[index];
    let clientes = JSON.parse(localStorage.getItem("Clientes")) || [];
    let clienteInfo = clientes.find((c) => c.nome === o.cliente) || {
      nome: o.cliente,
      telefone: "",
      email: "",
      endereco: "",
    };

    const azulPrimario = [31, 111, 235];
    const azulSecundario = [0, 35, 68];
    const pretoTexto = [0, 0, 0];
    const cinzaEscuro = [200, 200, 200];

    doc.setFillColor(...azulPrimario);
    doc.rect(0, 0, 210, 35, "F");

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont(undefined, "bold");
    doc.text("MN Calhas", 15, 10);

    doc.setFontSize(10);
    doc.setFont(undefined, "normal");
    doc.text("Soluções em Calhas, Rufos e Condutores", 15, 15);
    doc.text("Endereço: Travessa 7  n° 640 FD", 15, 25);
    doc.text("Bairro: Jardim Bandeirantes   Orlândia-SP", 15, 30);

    doc.setFontSize(9);
    doc.text("Tel: (16) 3726-3606", 150, 13);
    doc.text("Cel: (16) 99979-0603", 150, 17);
    doc.text("Cel: (16) 99211-9315", 150, 22);

    doc.setTextColor(...azulSecundario);
    doc.setFontSize(18);
    doc.setFont(undefined, "bold");
    doc.text("ORÇAMENTO", 15, 50);

    doc.setFontSize(10);
    doc.setFont(undefined, "normal");
    doc.text("• Profissional responsável: Marco Antônio", 15, 60);

    const dataAtual = new Date().toLocaleDateString("pt-BR");
    const numeroOrcamento = `#${String(o.id || Date.now()).slice(-6)}`;

    doc.text(`Número: ${numeroOrcamento}`, 140, 45);
    doc.text(`Data: ${dataAtual}`, 140, 50);
    doc.text(`Status: ${o.status.toUpperCase()}`, 140, 55);

    let y = 70;
    doc.setFillColor(...cinzaEscuro);
    doc.rect(15, y - 5, 180, 25, "F");

    doc.setTextColor(...azulSecundario);
    doc.setFontSize(12);
    doc.setFont(undefined, "bold");
    doc.text("DADOS DO CLIENTE", 20, y + 2);

    doc.setTextColor(...pretoTexto);
    doc.setFontSize(10);
    doc.setFont(undefined, "normal");
    doc.text(`Nome: ${clienteInfo.nome}`, 20, y + 10);
    doc.text(`Telefone: ${clienteInfo.telefone}`, 20, y + 15);
    doc.text(`Email: ${clienteInfo.email}`, 110, y + 10);
    doc.text(`Endereço: ${clienteInfo.endereco || ""}`, 110, y + 15);

    y += 35;
    doc.setTextColor(...azulSecundario);
    doc.setFontSize(12);
    doc.setFont(undefined, "bold");
    doc.text("ITENS DO ORÇAMENTO", 15, y);

    y += 10;

    doc.setFillColor(...azulPrimario);
    doc.rect(15, y, 180, 8, "F");

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(9);
    doc.setFont(undefined, "bold");
    doc.text("SERVIÇO", 20, y + 5);
    doc.text("METROS", 105, y + 5);
    doc.text("TOTAL", 175, y + 5);

    y += 8;

    doc.setTextColor(...pretoTexto);
    doc.setFont(undefined, "normal");

    let subtotal = 0;
    o.itens.forEach((item, i) => {
      if (y > 270) {
        doc.addPage();
        y = 20;
      }

      if (i % 2 === 0) {
        doc.setFillColor(250, 250, 250);
        doc.rect(15, y, 180, 8, "F");
      }

      const valorTotal = parseMoeda(item.total);
      subtotal += valorTotal;

      doc.text(item.servico.substring(0, 25), 20, y + 5);
      doc.text(item.metros || "0", 105, y + 5);
      doc.text(formatarMoeda(valorTotal), 175, y + 5);

      y += 8;
    });

    y += 5;
    doc.setDrawColor(...azulPrimario);
    doc.line(15, y, 195, y);

    y += 10;

    if (y > 200) {
      doc.addPage();
      y = 20;
    }
    doc.setFontSize(11);
    doc.setFont(undefined, "bold");
    doc.setTextColor(...azulSecundario);
    doc.text("SUBTOTAL:", 140, y);
    doc.text(formatarMoeda(subtotal), 175, y);

    y += 8;

    if (y > 200) {
      doc.addPage();
      y = 20;
    }
    doc.text("TOTAL GERAL:", 140, y);
    doc.setFontSize(14);
    doc.setTextColor(...azulPrimario);
    doc.text(formatarMoeda(o.total || parseMoeda(o.totalGeral)), 175, y);

    y += -10;
    if (y > 220) {
      doc.addPage();
      y = 20;
    }

    doc.setFontSize(10);
    doc.setFont(undefined, "bold");
    doc.setTextColor(...azulSecundario);
    doc.text("OBSERVAÇÕES:", 15, y);

    y += 8;
    doc.setFont(undefined, "normal");
    doc.setTextColor(...pretoTexto);
    doc.text("• Orçamento válido por 30 dias", 15, y);
    doc.text("• Materiais inclusos conforme especificação", 15, y + 6);
    doc.text(
      "• Instalação realizada por profissionais qualificados",
      15,
      y + 12,
    );

    const alturaRodape = 27;
    const margemInferior = 5;
    let posicaoRodape = Math.max(y + 30, 100 - alturaRodape - margemInferior);

    doc.setFillColor(...azulSecundario);
    doc.rect(0, posicaoRodape, 210, alturaRodape, "F");

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(8);
    doc.text(
      "CalhaControl - Sistema de Gestão de Oficinas de Calhas",
      15,
      posicaoRodape + 8,
    );
    doc.text(
      "Este orçamento foi gerado automaticamente pelo sistema CalhaControl",
      15,
      posicaoRodape + 14,
    );
    doc.text(
      `Gerado em: ${new Date().toLocaleString("pt-BR")}`,
      15,
      posicaoRodape + 20,
    );

    const nomeArquivo = `Orcamento_${clienteInfo.nome.replace(/\s+/g, "_")}_${numeroOrcamento}.pdf`;
    pdfGerado = { doc, nomeArquivo };

    setTimeout(() => {
      mostrarNotificacao(
        `PDF do orçamento de ${clienteInfo.nome} está pronto!`,
        "success",
        0,
        [
          { texto: "Baixar", tipo: "primary", funcao: "baixarPDF()" },
          { texto: "Cancelar", tipo: "secondary", funcao: "cancelarPDF()" },
        ],
      );
    }, 1000);
  } catch (error) {
    console.error("Erro ao gerar PDF:", error);
    mostrarNotificacao("Erro ao gerar PDF. Tente novamente.", "error", 4000);
  }
}

// 🔥 INICIAR
carregarClientes();
listarOrcamentos();

// 🔥 SISTEMA DE NOTIFICAÇÕES
function mostrarNotificacao(
  mensagem,
  tipo = "success",
  duracao = 3000,
  acoes = null,
) {
  const notificacaoExistente = document.querySelector(".notification-popup");
  if (notificacaoExistente) {
    notificacaoExistente.remove();
  }

  const notificacao = document.createElement("div");
  notificacao.className = `notification-popup ${tipo}`;

  if (acoes) {
    notificacao.classList.add("with-actions");
  }

  let icone = "";
  switch (tipo) {
    case "success":
      icone = "fa-check-circle";
      break;
    case "error":
      icone = "fa-exclamation-circle";
      break;
    case "info":
      icone = "fa-info-circle";
      break;
    case "warning":
      icone = "fa-exclamation-triangle";
      break;
    default:
      icone = "fa-check-circle";
  }

  let html = `
    <div class="notification-content">
      <i class="fa-solid ${icone}"></i>
      <span>${mensagem}</span>
    </div>
  `;

  if (acoes) {
    html += `
      <div class="notification-actions">
        ${acoes.map((acao) => `<button class="action-btn ${acao.tipo}" onclick="${acao.funcao}">${acao.texto}</button>`).join("")}
      </div>
      <button class="close-btn-actions" onclick="fecharNotificacao(this)">
        <i class="fa-solid fa-times"></i>
      </button>
    `;
    duracao = 0;
  } else {
    html += `
      <button class="close-btn" onclick="fecharNotificacao(this)">
        <i class="fa-solid fa-times"></i>
      </button>
    `;
  }

  notificacao.innerHTML = html;
  document.body.appendChild(notificacao);

  setTimeout(() => notificacao.classList.add("show"), 100);

  if (duracao > 0) {
    setTimeout(() => fecharNotificacao(notificacao), duracao);
  }

  return notificacao;
}

function fecharNotificacao(elemento) {
  const notificacao = elemento.classList
    ? elemento
    : elemento.closest(".notification-popup");
  notificacao.classList.remove("show");
  setTimeout(() => {
    if (notificacao.parentElement) {
      notificacao.remove();
    }
  }, 300);
}

// Variável global para armazenar o PDF gerado
let pdfGerado = null;

function baixarPDF() {
  if (pdfGerado) {
    pdfGerado.doc.save(pdfGerado.nomeArquivo);
    mostrarNotificacao("PDF baixado com sucesso!", "success", 3000);
    pdfGerado = null;
  }
  fecharNotificacao(document.querySelector(".notification-popup"));
}

function cancelarPDF() {
  pdfGerado = null;
  mostrarNotificacao("Download cancelado", "info", 2000);
  fecharNotificacao(document.querySelector(".notification-popup"));
}
