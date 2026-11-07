"use client";

import { useState, useEffect } from "react";
import { API_BASE } from "../../services/api";

export default function CategoriasPage() {
  const [categorias, setCategorias] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);

  async function carregarCategorias() {
    try {
      setCarregando(true);
      setErro(null);
      const res = await fetch(`${API_BASE}/categorias`);
      const data = await res.json();
      setCategorias(Array.isArray(data) ? data : []);
    } catch (err) {
      setErro("Erro ao carregar categorias.");
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregarCategorias();
  }, []);

  return (
    <div>
      <div className="barra-acoes">
        <div>
          <h1 className="titulo-tela">Categorias</h1>
          <p className="subtitulo-tela">Categorias cadastradas na loja.</p>
        </div>
        <button onClick={carregarCategorias} className="btn btn-branco">
          Atualizar
        </button>
      </div>

      {erro && <div className="alerta alerta-erro">{erro}</div>}

      <div className="barra-filtros">
        <span className="contador" style={{ marginLeft: "0" }}>
          Total: {categorias.length} categorias
        </span>
      </div>

      {carregando ? (
        <div className="bloco mensagem-vazio">Carregando categorias...</div>
      ) : categorias.length === 0 ? (
        <div className="bloco mensagem-vazio">Nenhuma categoria cadastrada.</div>
      ) : (
        <div className="bloco" style={{ padding: "0" }}>
          <div className="tabela-container">
            <table className="tabela">
              <thead>
                <tr>
                  <th style={{ width: "80px" }}>ID</th>
                  <th>Nome da Categoria</th>
                </tr>
              </thead>
              <tbody>
                {categorias.map((cat) => (
                  <tr key={cat.id}>
                    <td>
                      <span className="badge-id">#{cat.id}</span>
                    </td>
                    <td>
                      <strong>{cat.nome}</strong>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
