"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { API_BASE } from "../../services/api";

export default function PedidosPage() {
  const [pedidos, setPedidos] = useState([]);
  const [clientes, setClientes] = useState({});
  const [produtos, setProdutos] = useState({});
  const [itensPorPedido, setItensPorPedido] = useState({});
  const [carregandoItens, setCarregandoItens] = useState({});
  const [pedidoAberto, setPedidoAberto] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);
  const [filtroStatus, setFiltroStatus] = useState("todos");

  async function carregarDados() {
    try {
      setCarregando(true);
      setErro(null);

      const [resPedidos, resClientes, resProdutos] = await Promise.all([
        fetch(`${API_BASE}/pedidos`),
        fetch(`${API_BASE}/clientes`),
        fetch(`${API_BASE}/produtos`),
      ]);

      const [dataPedidos, dataClientes, dataProdutos] = await Promise.all([
        resPedidos.json(),
        resClientes.json(),
        resProdutos.json(),
      ]);

      const mapaClientes = {};
      if (Array.isArray(dataClientes)) {
        dataClientes.forEach((cli) => {
          mapaClientes[cli.id] = cli.nome;
        });
      }

      const mapaProdutos = {};
      if (Array.isArray(dataProdutos)) {
        dataProdutos.forEach((prod) => {
          mapaProdutos[prod.id] = prod.nome;
        });
      }

      setClientes(mapaClientes);
      setProdutos(mapaProdutos);
      setPedidos(Array.isArray(dataPedidos) ? dataPedidos.reverse() : []);
    } catch (err) {
      setErro("Erro ao buscar pedidos na API.");
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregarDados();
  }, []);

  async function alternarItens(pedidoId) {
    if (pedidoAberto === pedidoId) {
      setPedidoAberto(null);
      return;
    }

    setPedidoAberto(pedidoId);

    if (!itensPorPedido[pedidoId]) {
      try {
        setCarregandoItens((prev) => ({ ...prev, [pedidoId]: true }));
        const res = await fetch(`${API_BASE}/itens_pedido?pedido_id=${pedidoId}`);
        const data = await res.json();
        setItensPorPedido((prev) => ({
          ...prev,
          [pedidoId]: Array.isArray(data) ? data : [],
        }));
      } catch (err) {
        setItensPorPedido((prev) => ({
          ...prev,
          [pedidoId]: [],
        }));
      } finally {
        setCarregandoItens((prev) => ({ ...prev, [pedidoId]: false }));
      }
    }
  }

  const pedidosFiltrados = pedidos.filter((p) => {
    if (filtroStatus === "todos") return true;
    return p.status?.toLowerCase() === filtroStatus.toLowerCase();
  });

  return (
    <div>
      <div className="barra-acoes">
        <div>
          <h1 className="titulo-tela">Listar Pedidos</h1>
          <p className="subtitulo-tela">Consulta de pedidos e itens vinculados.</p>
        </div>
        <div>
          <button onClick={carregarDados} className="btn btn-branco" style={{ marginRight: "8px" }}>
            Atualizar
          </button>
          <Link href="/pedidos/novo" className="btn btn-verde">
            + Criar Pedido
          </Link>
        </div>
      </div>

      {erro && <div className="alerta alerta-erro">{erro}</div>}

      <div className="barra-filtros">
        <label htmlFor="status-select">Filtrar por Status:</label>
        <select
          id="status-select"
          value={filtroStatus}
          onChange={(e) => setFiltroStatus(e.target.value)}
          className="campo-select"
        >
          <option value="todos">Todos</option>
          <option value="pendente">Pendente</option>
          <option value="enviado">Enviado</option>
          <option value="concluido">Concluído</option>
          <option value="cancelado">Cancelado</option>
        </select>
        <span className="contador">Total: {pedidosFiltrados.length} pedidos</span>
      </div>

      {carregando ? (
        <div className="bloco mensagem-vazio">Carregando pedidos da API...</div>
      ) : pedidosFiltrados.length === 0 ? (
        <div className="bloco mensagem-vazio">Nenhum pedido cadastrado no momento.</div>
      ) : (
        <div>
          {pedidosFiltrados.map((pedido) => {
            const dataTexto = pedido.data_pedido
              ? new Date(pedido.data_pedido).toLocaleString("pt-BR")
              : "Sem data";
            const nomeCliente = clientes[pedido.cliente_id] || `Cliente #${pedido.cliente_id}`;
            const aberto = pedidoAberto === pedido.id;
            const itens = itensPorPedido[pedido.id] || [];
            const carregandoItensPedido = carregandoItens[pedido.id];

            const totalSoma = itens.reduce((soma, it) => {
              const q = Number(it.quantidade) || 0;
              const p = parseFloat(it.preco_unitario) || 0;
              return soma + q * p;
            }, 0);

            return (
              <div key={pedido.id} className="card-pedido">
                <div className="cabecalho-pedido">
                  <div>
                    <span className="badge-id">Pedido #{pedido.id}</span>
                    <span
                      className={`badge-status badge-${pedido.status || "pendente"}`}
                      style={{ marginLeft: "8px" }}
                    >
                      {pedido.status || "pendente"}
                    </span>
                  </div>
                  <span style={{ fontSize: "0.85rem", color: "#666" }}>{dataTexto}</span>
                </div>

                <div style={{ margin: "6px 0" }}>
                  <strong>Cliente:</strong> {nomeCliente}
                </div>

                <div className="rodape-pedido">
                  <button onClick={() => alternarItens(pedido.id)} className="btn-detalhes">
                    {aberto ? "Ocultar Itens ▲" : "Ver Itens do Pedido ▼"}
                  </button>
                </div>

                {aberto && (
                  <div className="painel-itens">
                    <h4 style={{ marginBottom: "8px", color: "#1b4332" }}>
                      Itens do Pedido #{pedido.id}
                    </h4>

                    {carregandoItensPedido ? (
                      <p style={{ color: "#666" }}>Buscando itens do pedido...</p>
                    ) : itens.length === 0 ? (
                      <p style={{ color: "#666" }}>Nenhum item associado a este pedido.</p>
                    ) : (
                      <>
                        <div className="tabela-container">
                          <table className="tabela">
                            <thead>
                              <tr>
                                <th>Produto</th>
                                <th>Quantidade</th>
                                <th>Preço Unitário</th>
                                <th>Subtotal</th>
                              </tr>
                            </thead>
                            <tbody>
                              {itens.map((it) => {
                                const nomeProd = produtos[it.produto_id] || `Produto #${it.produto_id}`;
                                const precoUnit = parseFloat(it.preco_unitario) || 0;
                                const subtotal = (Number(it.quantidade) || 0) * precoUnit;

                                return (
                                  <tr key={it.id}>
                                    <td>{nomeProd}</td>
                                    <td>{it.quantidade}</td>
                                    <td>R$ {precoUnit.toFixed(2)}</td>
                                    <td>R$ {subtotal.toFixed(2)}</td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                        <div className="total-pedido">
                          <strong>Total do Pedido:</strong> R$ {totalSoma.toFixed(2)}
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
