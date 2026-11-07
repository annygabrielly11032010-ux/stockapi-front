"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { API_BASE } from "../../../services/api";

export default function CriarPedidoPage() {
  const [clientes, setClientes] = useState([]);
  const [produtos, setProdutos] = useState([]);

  const [clienteId, setClienteId] = useState("");
  const [produtoId, setProdutoId] = useState("");
  const [quantidade, setQuantidade] = useState(1);

  const [itens, setItens] = useState([]);

  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [sucesso, setSucesso] = useState(null);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    async function carregarDados() {
      try {
        setCarregando(true);
        const [resCli, resProd] = await Promise.all([
          fetch(`${API_BASE}/clientes`),
          fetch(`${API_BASE}/produtos`),
        ]);

        const [dataCli, dataProd] = await Promise.all([
          resCli.json(),
          resProd.json(),
        ]);

        if (Array.isArray(dataCli)) setClientes(dataCli);
        if (Array.isArray(dataProd)) setProdutos(dataProd);
      } catch (err) {
        setErro("Não foi possível carregar clientes e produtos da API.");
      } finally {
        setCarregando(false);
      }
    }

    carregarDados();
  }, []);

  function adicionarItem(e) {
    e.preventDefault();
    setErro(null);

    if (!produtoId) {
      setErro("Selecione um produto.");
      return;
    }

    const qtdNum = parseInt(quantidade, 10);
    if (isNaN(qtdNum) || qtdNum <= 0) {
      setErro("Informe uma quantidade válida maior que zero.");
      return;
    }

    const prod = produtos.find((p) => String(p.id) === String(produtoId));
    if (!prod) {
      setErro("Produto não encontrado.");
      return;
    }

    const indexExistente = itens.findIndex(
      (item) => String(item.produto_id) === String(prod.id)
    );

    if (indexExistente >= 0) {
      const listaAtualizada = [...itens];
      listaAtualizada[indexExistente].quantidade += qtdNum;
      listaAtualizada[indexExistente].subtotal =
        listaAtualizada[indexExistente].quantidade * listaAtualizada[indexExistente].preco_unitario;
      setItens(listaAtualizada);
    } else {
      const preco = parseFloat(prod.preco) || 0;
      setItens([
        ...itens,
        {
          produto_id: prod.id,
          nome: prod.nome,
          quantidade: qtdNum,
          preco_unitario: preco,
          subtotal: qtdNum * preco,
        },
      ]);
    }

    setProdutoId("");
    setQuantidade(1);
  }

  function removerItem(index) {
    setItens(itens.filter((_, i) => i !== index));
  }

  const totalGeral = itens.reduce((soma, item) => soma + item.subtotal, 0);

  async function salvarPedido() {
    setErro(null);
    setSucesso(null);

    if (!clienteId) {
      setErro("Selecione um cliente para o pedido.");
      return;
    }

    if (itens.length === 0) {
      setErro("Adicione ao menos um produto no pedido.");
      return;
    }

    try {
      setSalvando(true);

      const resPedido = await fetch(`${API_BASE}/pedidos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cliente_id: parseInt(clienteId, 10),
          status: "pendente",
        }),
      });

      if (!resPedido.ok) {
        const erroJson = await resPedido.json().catch(() => ({}));
        throw new Error(erroJson.erro || "Erro ao salvar pedido na API.");
      }

      const pedidoCriado = await resPedido.json();
      const idCriado = pedidoCriado.id;

      for (const item of itens) {
        const resItem = await fetch(`${API_BASE}/itens_pedido`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            pedido_id: idCriado,
            produto_id: parseInt(item.produto_id, 10),
            quantidade: parseInt(item.quantidade, 10),
            preco_unitario: parseFloat(item.preco_unitario),
          }),
        });

        if (!resItem.ok) {
          const erroItemJson = await resItem.json().catch(() => ({}));
          throw new Error(
            erroItemJson.erro || `Erro ao salvar item ${item.nome}.`
          );
        }
      }

      setSucesso(`Pedido #${idCriado} salvo com sucesso!`);
      setItens([]);
      setClienteId("");
      setProdutoId("");
      setQuantidade(1);
    } catch (err) {
      setErro(err.message || "Erro ao processar pedido.");
    } finally {
      setSalvando(false);
    }
  }

  return (
    <div>
      <div className="barra-acoes">
        <div>
          <h1 className="titulo-tela">Criar Pedido</h1>
          <p className="subtitulo-tela">
            Escolha o cliente e inclua os produtos com as quantidades desejadas.
          </p>
        </div>
        <Link href="/pedidos" className="btn btn-branco">
          &larr; Voltar para Pedidos
        </Link>
      </div>

      {sucesso && (
        <div className="alerta alerta-sucesso">
          <p><strong>{sucesso}</strong></p>
          <div style={{ marginTop: "6px" }}>
            <Link href="/pedidos" className="btn btn-verde" style={{ fontSize: "0.85rem", padding: "4px 10px" }}>
              Ver na lista de pedidos &rarr;
            </Link>
          </div>
        </div>
      )}

      {erro && <div className="alerta alerta-erro">{erro}</div>}

      {carregando ? (
        <div className="bloco mensagem-vazio">Carregando dados da API...</div>
      ) : (
        <div className="grade-duas-colunas">
          <div>
            <div className="bloco">
              <h3 style={{ marginBottom: "12px", color: "#1b4332" }}>
                1. Selecionar Cliente
              </h3>
              <div className="form-grupo">
                <label htmlFor="cliente-select">Cliente *</label>
                <select
                  id="cliente-select"
                  className="campo-select"
                  style={{ width: "100%" }}
                  value={clienteId}
                  onChange={(e) => setClienteId(e.target.value)}
                >
                  <option value="">-- Selecione o cliente --</option>
                  {clientes.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.nome} {c.email ? `(${c.email})` : ""}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="bloco">
              <h3 style={{ marginBottom: "12px", color: "#1b4332" }}>
                2. Adicionar Produto
              </h3>
              <form onSubmit={adicionarItem}>
                <div className="form-grupo">
                  <label htmlFor="produto-select">Produto *</label>
                  <select
                    id="produto-select"
                    className="campo-select"
                    style={{ width: "100%" }}
                    value={produtoId}
                    onChange={(e) => setProdutoId(e.target.value)}
                  >
                    <option value="">-- Selecione o produto --</option>
                    {produtos.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.nome} - R$ {parseFloat(p.preco || 0).toFixed(2)} (Estoque: {p.quantidade_estoque})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="linha-inputs">
                  <div className="form-grupo" style={{ flex: "1" }}>
                    <label htmlFor="quantidade-input">Quantidade *</label>
                    <input
                      id="quantidade-input"
                      type="number"
                      min="1"
                      className="campo-texto"
                      style={{ width: "100%" }}
                      value={quantidade}
                      onChange={(e) => setQuantidade(e.target.value)}
                    />
                  </div>
                  <button type="submit" className="btn btn-verde btn-incluir-item">
                    + Incluir no Pedido
                  </button>
                </div>
              </form>
            </div>
          </div>

          <div className="bloco">
            <h3 style={{ marginBottom: "12px", color: "#1b4332" }}>
              Itens do Pedido ({itens.length})
            </h3>

            {itens.length === 0 ? (
              <p style={{ color: "#666", padding: "20px 0", textAlign: "center" }}>
                Nenhum produto adicionado ainda.
              </p>
            ) : (
              <>
                {/* Tabela para desktop e telas maiores */}
                <div className="tabela-container itens-tabela-desktop">
                  <table className="tabela">
                    <thead>
                      <tr>
                        <th>Produto</th>
                        <th className="col-centro" style={{ width: "65px" }}>Qtd.</th>
                        <th className="col-moeda">Preço</th>
                        <th className="col-moeda">Subtotal</th>
                        <th className="col-centro" style={{ width: "85px" }}>Ação</th>
                      </tr>
                    </thead>
                    <tbody>
                      {itens.map((it, idx) => (
                        <tr key={idx}>
                          <td><strong>{it.nome}</strong></td>
                          <td className="col-centro">{it.quantidade}</td>
                          <td className="col-moeda">R$ {it.preco_unitario.toFixed(2)}</td>
                          <td className="col-moeda">R$ {it.subtotal.toFixed(2)}</td>
                          <td className="col-centro">
                            <button
                              type="button"
                              onClick={() => removerItem(idx)}
                              className="btn btn-vermelho"
                            >
                              Remover
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Cards para celular e telas menores */}
                <div className="itens-lista-mobile">
                  {itens.map((it, idx) => (
                    <div key={idx} className="item-pedido-card">
                      <div className="item-pedido-topo">
                        <strong className="item-pedido-nome">{it.nome}</strong>
                        <button
                          type="button"
                          onClick={() => removerItem(idx)}
                          className="btn btn-vermelho"
                          style={{ flexShrink: 0 }}
                        >
                          Remover
                        </button>
                      </div>
                      <div className="item-pedido-detalhes">
                        <span>
                          {it.quantidade} un. &times; R$ {it.preco_unitario.toFixed(2)}
                        </span>
                        <span className="item-pedido-subtotal">
                          Subtotal: R$ {it.subtotal.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="total-carrinho">
                  <span>Total do Pedido:</span>
                  <strong>R$ {totalGeral.toFixed(2)}</strong>
                </div>

                <div style={{ marginTop: "16px" }}>
                  <button
                    type="button"
                    onClick={salvarPedido}
                    disabled={salvando}
                    className="btn btn-verde btn-bloco"
                  >
                    {salvando ? "Salvando..." : "Salvar Pedido"}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
