"use client";

import { useState, useEffect } from "react";
import { API_BASE } from "../../services/api";

export default function ProdutosPage() {
  const [produtos, setProdutos] = useState([]);
  const [categorias, setCategorias] = useState({});
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);
  const [busca, setBusca] = useState("");
  const [categoriaId, setCategoriaId] = useState("todas");

  async function carregarProdutos() {
    try {
      setCarregando(true);
      setErro(null);

      const [resProd, resCat] = await Promise.all([
        fetch(`${API_BASE}/produtos`),
        fetch(`${API_BASE}/categorias`),
      ]);

      const [dataProd, dataCat] = await Promise.all([
        resProd.json(),
        resCat.json(),
      ]);

      const mapaCat = {};
      if (Array.isArray(dataCat)) {
        dataCat.forEach((c) => {
          mapaCat[c.id] = c.nome;
        });
      }

      setCategorias(mapaCat);
      setProdutos(Array.isArray(dataProd) ? dataProd : []);
    } catch (err) {
      setErro("Erro ao carregar produtos da API.");
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregarProdutos();
  }, []);

  const produtosFiltrados = produtos.filter((p) => {
    const nomeVal = p.nome ? p.nome.toLowerCase() : "";
    const descVal = p.descricao ? p.descricao.toLowerCase() : "";
    const termo = busca.toLowerCase();

    const bateBusca = nomeVal.includes(termo) || descVal.includes(termo);
    const bateCat =
      categoriaId === "todas" || String(p.categoria_id) === String(categoriaId);

    return bateBusca && bateCat;
  });

  return (
    <div>
      <div className="barra-acoes">
        <div>
          <h1 className="titulo-tela">Produtos</h1>
          <p className="subtitulo-tela">Estoque atualizado de mercadorias da loja.</p>
        </div>
        <button onClick={carregarProdutos} className="btn btn-branco">
          Atualizar
        </button>
      </div>

      {erro && <div className="alerta alerta-erro">{erro}</div>}

      <div className="barra-filtros">
        <div style={{ flex: "1", minWidth: "180px" }}>
          <input
            type="text"
            placeholder="Buscar por nome ou descrição..."
            className="campo-texto"
            style={{ width: "100%" }}
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
        </div>

        <div>
          <select
            value={categoriaId}
            onChange={(e) => setCategoriaId(e.target.value)}
            className="campo-select"
          >
            <option value="todas">Todas as categorias</option>
            {Object.entries(categorias).map(([id, nome]) => (
              <option key={id} value={id}>
                {nome}
              </option>
            ))}
          </select>
        </div>

        <span className="contador">Total: {produtosFiltrados.length} produtos</span>
      </div>

      {carregando ? (
        <div className="bloco mensagem-vazio">Carregando produtos...</div>
      ) : produtosFiltrados.length === 0 ? (
        <div className="bloco mensagem-vazio">Nenhum produto encontrado.</div>
      ) : (
        <div className="bloco" style={{ padding: "0" }}>
          <div className="tabela-container">
            <table className="tabela">
              <thead>
                <tr>
                  <th style={{ width: "60px" }}>ID</th>
                  <th>Produto</th>
                  <th>Categoria</th>
                  <th>Preço</th>
                  <th>Estoque</th>
                  <th>Descrição</th>
                </tr>
              </thead>
              <tbody>
                {produtosFiltrados.map((prod) => {
                  const nomeCat = categorias[prod.categoria_id] || "Sem categoria";
                  const preco = parseFloat(prod.preco) || 0;
                  const baixo = Number(prod.quantidade_estoque) <= 5;

                  return (
                    <tr key={prod.id}>
                      <td>
                        <span className="badge-id">#{prod.id}</span>
                      </td>
                      <td>
                        <strong>{prod.nome}</strong>
                      </td>
                      <td>
                        <span className="badge-categoria">{nomeCat}</span>
                      </td>
                      <td>R$ {preco.toFixed(2)}</td>
                      <td>
                        <span
                          className={baixo ? "badge-estoque-baixo" : "badge-estoque-ok"}
                        >
                          {prod.quantidade_estoque} un
                        </span>
                      </td>
                      <td style={{ color: "#666", fontSize: "0.85rem", maxWidth: "260px" }}>
                        {prod.descricao || "—"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
