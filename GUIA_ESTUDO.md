# Cola pra Apresentação - O Que Falar Pro Wagner

> **Dica de ouro:** Wagner não quer ouvir palestra nem enrolação ele percebe que você decorou ou usou IA e vai te apertar.  
> Quando ele apontar o dedo pro código e perguntar "o que é isso aqui?", responde na lata a frase curta que tá abaixo.

---

## 1. Tags de Tabela (HTML)

| Tag | O que falar pro Wagner (na lata) | Onde tá no nosso projeto |
| :--- | :--- | :--- |
| `<table>` | "Cria a tabela." | Em Categorias, Clientes, Produtos e Pedidos |
| `<thead>` | "Cabeça/topo da tabela. Onde ficam os títulos das colunas." | Linha com ID, Nome, Preço, etc. |
| `<tbody>` | "Corpo da tabela. Onde entram as linhas de dados de verdade." | Onde a gente faz o `.map()` dos dados |
| `<tr>` | "Table Row: uma linha da tabela." | Cada linha que aparece na tela |
| `<th>` | "Table Header: célula de cabeçalho (já vem em negrito)." | ID, Produto, Preço, Subtotal... |
| `<td>` | "Table Data: célula comum que guarda o valor de cada coluna." | Onde aparece o nome da pessoa, valor do item, etc. |

---

## 2. Formulários, Inputs e Tags Visuais

| Elemento | O que falar pro Wagner | Pra que serviu no código |
| :--- | :--- | :--- |
| `<form onSubmit={...}>` | "Formulário. Agrupa os campos e escuta a hora do envio." | Usado em **Novo Pedido** pra adicionar o produto na lista. |
| `<input>` | "Campo de digitação pro usuário." | Usamos `type="text"` pra busca e `type="number"` pra quantidade de itens. |
| `<select>` e `<option>` | "`<select>` é a caixinha dropdown (de opções) e `<option>` é cada item que dá pra escolher." | Usado pra escolher cliente, produto e filtrar status de pedidos. |
| `<label htmlFor="...">` | "Rótulo do campo. O `htmlFor` amarra o texto ao `id` do input pra dar foco ao clicar." | Ex: label do cliente, produto e quantidade. |
| `<button type="submit">` | "Botão que dispara a ação do formulário." | Botão "+ Incluir no Pedido". |
| `<button type="button">` | "Botão comum que só roda uma função no clique, sem submeter formulário." | Botão de "Remover" item ou "Salvar Pedido". |
| `disabled` | "Desativa o botão pro usuário não conseguir clicar." | Usado em `disabled={salvando}` pra evitar clique duplo enquanto envia o pedido pra API. |
| `<> ... </>` *(Fragment)* | "Fragment do React. Agrupa vários elementos sem precisar criar uma `<div>` inútil que quebraria o layout." | Usado nas tabelas dentro do card de pedidos e novo pedido. |
| `<header>`, `<nav>`, `<main>`, `<footer>` | "Tags semânticas. Servem pra organizar a estrutura da página: topo, menu de navegação, miolo do conteúdo e rodapé." | Usados no `layout.js`, `Header.js` e `Footer.js`. |

---

## 3. Hooks e Coisas do React

| Código | O que falar pro Wagner | Como usamos no código |
| :--- | :--- | :--- |
| `"use client"` | "Avisa ao Next.js que esse componente roda no navegador (Client Component), liberando cliques, hooks e estados." | Na primeira linha de todas as páginas que têm interação ou buscam API. |
| `useState` | "Guarda um dado na memória do componente. Quando esse dado muda, o React atualiza a tela sozinho." | Usado pra guardar listas (produtos, pedidos), campos de busca, se o menu tá aberto ou fechado, etc. |
| `useEffect` | "Executa um código automaticamente assim que a página carrega." | Usamos com `[]` vazio no final pra bater na API e carregar os dados assim que a tela abre. |
| `key={...}` *(prop obrigatória)* | "Identificador único pro React saber exatamente qual item da lista mudou, foi criado ou deletado." | Usado em todos os `.map()`, tipo `key={prod.id}` ou `key={pedido.id}`. |
| `children` | "Representa o conteúdo interno que é passado pra dentro de um componente." | No `layout.js`, é onde a página atual é renderizada no meio do Header e Footer. |
| `onClick` | "Escuta o clique do mouse e dispara uma função." | No botão de abrir/fechar itens do pedido, menu mobile e atualizar dados. |
| `onChange` | "Escuta quando o usuário digita no input ou escolhe outra opção no select." | Pra atualizar o estado da busca e dos selects na hora. |
| `e.target.value` | "Pega o texto que o usuário acabou de digitar ou selecionar." | `onChange={(e) => setBusca(e.target.value)}`. |
| `e.preventDefault()` | "Evita o comportamento padrão do navegador, que seria recarregar a página toda ao submeter um formulário." | Na função `adicionarItem` de Novo Pedido. |
| Spread `...` *(três pontinhos)* | "Clona um array ou objeto criando uma cópia nova sem alterar o original (imutabilidade do React)." | Ex: `[...itens, novoItem]` pra adicionar produto sem mutar o estado original. |

---

## 4. Coisas Próprias do Next.js

| Recurso | O que falar pro Wagner | Como usamos no projeto |
| :--- | :--- | :--- |
| `<Link href="...">` | "Link do Next.js. Troca de página na hora sem recarregar o navegador todo como a tag `<a>` faria." | No menu do Header, no botão de "+ Criar Pedido" e nos cards da Home. |
| `usePathname()` | "Hook do Next que descobre qual rota tá aberta na URL naquele momento." | No `Header.js`, pra saber qual link do menu ganha a classe `ativo` (ficar verde). |
| `metadata` | "Configuração de SEO do Next.js pra definir o título da aba do navegador e descrição do site." | No `layout.js`: título "Controle de Estoque". |

---

## 5. Métodos de Array e Manipulação de Dados (O que o Wagner mais gosta de pegar)

| Método | O que falar pro Wagner | Exemplo real do nosso projeto |
| :--- | :--- | :--- |
| `.map()` | "Percorre uma lista e transforma cada item em um pedaço de HTML na tela." | `produtos.map((p) => <tr>...</tr>)` gera as linhas da tabela. |
| `.filter()` | "Filtra a lista. Cria uma lista nova só com os itens que passaram no teste." | Na barra de busca (filtrar por nome) e no filtro de status dos pedidos. |
| `.find()` | "Procura e devolve o **primeiro** item que bater com a condição." | `produtos.find(p => p.id === id)` pra achar o produto selecionado no select. |
| `.findIndex()` | "Acha a posição (índice) do item no array. Se achar devolve `0` ou mais, se não achar devolve `-1`." | Em Novo Pedido, pra ver se o produto já tava no pedido antes (se já tava, só soma a quantidade). |
| `.reduce()` | "Reduz a lista toda a um único número acumulado." | `itens.reduce((soma, it) => soma + it.subtotal, 0)` pra calcular o valor total do pedido. |
| `.forEach()` | "Percorre a lista rodando uma instrução pra cada elemento, sem retornar nada." | Usado pra montar um dicionário `{ id: nome }` de clientes e categorias pra consulta rápida. |
| `.reverse()` | "Inverte a ordem dos itens da lista." | `pedidos.reverse()` pra mostrar os pedidos mais recentes primeiro. |
| `Array.isArray(...)` | "Verifica se o dado que veio da API é realmente um array antes de tentar dar `.map()`." | Evita o site quebrar com tela branca caso a API responda com erro ou objeto. |
| `Object.entries(...)` | "Pega um objeto chave-valor e transforma numa lista de pares `[chave, valor]` pra gente poder fazer `.map()`." | Usado no select de filtro de categoria em Produtos. |
| `.length` | "Tamanho da lista ou quantidade de caracteres." | Pra mostrar o "Total: 10 clientes" e saber se a lista tá vazia (`itens.length === 0`). |

---

## 6. API, Fetch e Requisições

| Código | O que falar pro Wagner | Onde tá no nosso projeto |
| :--- | :--- | :--- |
| `fetch(url)` | "Função nativa do JavaScript pra fazer requisição HTTP pra API." | Em todas as buscas de dados e no POST de criar pedido. |
| `method: "POST"` | "Avisa que a requisição é de criação/gravação de dados, e não de apenas leitura." | No salvamento do pedido e dos itens do pedido. |
| `res.json()` | "Converte a resposta bruta que veio da internet em objeto ou array JavaScript legível." | Sempre depois de um `await fetch(...)`. |
| `Promise.all([...])` | "Dispara várias requisições ao mesmo tempo em paralelo. Muito mais rápido do que esperar uma por uma terminar." | Na Home (busca 4 tabelas de uma vez) e em Produtos/Pedidos. |
| `async / await` | "Permite esperar uma resposta demorada (como a da API) de forma assíncrona, sem travar o navegador." | Em todas as funções que puxam ou gravam dados. |
| `try / catch / finally` | "`try`: tenta rodar o código.<br>`catch`: se a API falhar, cai aqui e guarda a mensagem de erro.<br>`finally`: roda sempre no fim, ótimo pra desligar o 'Carregando...'." | Em todas as requisições do sistema. |
| `JSON.stringify(...)` | "Transforma um objeto JavaScript em texto no formato JSON pra enviar no corpo (`body`) da requisição POST." | No envio do pedido e dos itens pra API. |
| `headers: { "Content-Type": "application/json" }` | "Avisa pro servidor que os dados que estamos enviando no corpo da requisição são no formato JSON." | No cabeçalho do `fetch` de gravação. |

---

## 7. Truques de JavaScript e Operadores Rápidos

| Código | O que falar pro Wagner | Exemplo no código |
| :--- | :--- | :--- |
| **Ternário** (`? :`) | "É um `if / else` escrito em uma linha só pra decidir o que exibir." | `{carregando ? "Carregando..." : "Mostrar Tabela"}` |
| **Curto-circuito** (`&&`) | "Só renderiza o que tá na direita se o que tá na esquerda for verdadeiro." | `{erro && <div className="alerta">{erro}</div>}` |
| **Fallback** (`\|\|`) | "Valor padrão caso o primeiro venha nulo ou vazio." | `{cli.email \|\| "—"}` (se não tiver e-mail, põe um tracinho). |
| **Optional Chaining** (`?.`) | "Acessa a propriedade só se ela existir, sem quebrar o código se vier `null` ou `undefined`." | `p.status?.toLowerCase()` |
| `.toFixed(2)` | "Fixa o número em duas casas decimais com arredondamento, ideal pra moeda." | `preco.toFixed(2)` vira `12.50`. |
| `parseInt()` e `parseFloat()` | "Convertem texto em número: `parseInt` pra inteiro (quantidade) e `parseFloat` pra decimal (preço)." | Nos inputs e cálculos de total. |
| `.toLowerCase()` e `.includes()` | "Passa tudo pra letra minúscula e verifica se um trecho de texto está contido no outro." | Motor da barra de busca de clientes e produtos. |
| `new Date(...).toLocaleString("pt-BR")` | "Pega a data feia em formato ISO que veio do banco e formata pro padrão brasileiro legível (dia/mês/ano hora:minuto)." | Na data de criação de cada pedido. |
| Template string (crase \` \`) | "Permite injetar variáveis direto dentro do texto usando `${...}`." | ``fetch(`${API_BASE}/produtos`)`` |
