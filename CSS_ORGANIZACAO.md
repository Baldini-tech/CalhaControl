# Organização dos CSS - CalhaControl

## Estrutura dos Arquivos CSS

### 📁 css/base.css
**Usado em:** Todas as páginas
**Contém:**
- Estilos do menu lateral (sidebar)
- Layout básico (body, main)
- Elementos comuns (input, button, select)
- Tabelas básicas
- Botão dark mode
- Estilos dark mode gerais

### 📁 css/dashboard.css
**Usado em:** index.html
**Contém:**
- Cards do dashboard
- Tabela específica do dashboard (#tabelaDeshboard)
- Dark mode para cards

### 📁 css/clientes.css
**Usado em:** clientes.html
**Contém:**
- Tabela de clientes (#tabelaClientes)
- Botões de ação específicos
- Dark mode para clientes

### 📁 css/orcamentos.css
**Usado em:** orcamentos.html
**Contém:**
- Status badges (pendente, aprovado, etc.)
- Tabela de orçamentos (#tabelaLista)
- Tabela de orçamento completo (.tabelaOrcCompleto)
- Botões de ação específicos

### 📁 css/servicos.css
**Usado em:** servicos.html
**Contém:**
- Tabela de serviços (#tabelaServicos)
- Botões de ação específicos
- Dark mode para serviços

### 📁 css/usuarios.css
**Usado em:** usuario.html (quando existir)
**Contém:**
- Tabela de usuários (#tabelaUsuarios)
- Botões de ação específicos
- Dark mode para usuários

### 📁 css/modais.css
**Usado em:** Páginas com modais (clientes.html)
**Contém:**
- Modal overlay e box
- Tabelas de histórico (.tabelaHistOrc, .tabelaHistServ)
- Dark mode para modais

## Como Usar

### Para cada página HTML:
```html
<!-- Sempre incluir o base.css primeiro -->
<link rel="stylesheet" href="css/base.css" />

<!-- Depois incluir o CSS específico da página -->
<link rel="stylesheet" href="css/dashboard.css" />

<!-- Se usar modais, incluir também -->
<link rel="stylesheet" href="css/modais.css" />
```

## Vantagens desta Organização

✅ **Fácil manutenção** - Cada página tem seu CSS separado
✅ **Melhor performance** - Carrega apenas o CSS necessário
✅ **Organização clara** - Fácil encontrar estilos específicos
✅ **Reutilização** - base.css é compartilhado
✅ **Escalabilidade** - Fácil adicionar novas páginas

## Páginas Atualizadas

- ✅ index.html → base.css + dashboard.css
- ✅ clientes.html → base.css + clientes.css + modais.css
- ✅ orcamentos.html → base.css + orcamentos.css
- ✅ servicos.html → base.css + servicos.css

## Arquivo Original

O arquivo `style.css` original ainda existe como backup, mas não é mais usado pelas páginas.