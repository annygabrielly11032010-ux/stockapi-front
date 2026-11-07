"use client";

import { useState, useEffect } from "react";
import { API_BASE } from "../../services/api";

export default function ClientesPage() {
  const [clientes, setClientes] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);
  const [busca, setBusca] = useState("");

  async function carregarClientes() {
    try {
      setCarregando(true);
      setErro(null);
      const res = await fetch(`${API_BASE}/clientes`);
      const data = await res.json();
      setClientes(Array.isArray(data) ? data : []);
    } catch (err) {
      setErro("Erro ao buscar clientes.");
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregarClientes();
  }, []);

  const clientesFiltrados = clientes.filter((c) => {
    const termo = busca.toLowerCase();
    const nome = c.nome ? c.nome.toLowerCase() : "";
    const email = c.email ? c.email.toLowerCase() : "";
    const telefone = c.telefone ? c.telefone.toLowerCase() : "";
    return nome.includes(termo) || email.includes(termo) || telefone.includes(termo);
  });

  return (
    <div>
      <div className="barra-acoes">
        <div>
          <h1 className="titulo-tela">Clientes</h1>
          <p className="subtitulo-tela">Clientes cadastrados no sistema.</p>
        </div>
        <button onClick={carregarClientes} className="btn btn-branco">
          Atualizar
        </button>
      </div>

      {erro && <div className="alerta alerta-erro">{erro}</div>}

      <div className="barra-filtros">
        <div style={{ flex: "1", minWidth: "200px" }}>
          <input
            type="text"
            placeholder="Buscar por nome, e-mail ou telefone..."
            className="campo-texto"
            style={{ width: "100%" }}
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
        </div>
        <span className="contador">Total: {clientesFiltrados.length} clientes</span>
      </div>

      {carregando ? (
        <div className="bloco mensagem-vazio">Carregando clientes...</div>
      ) : clientesFiltrados.length === 0 ? (
        <div className="bloco mensagem-vazio">Nenhum cliente encontrado.</div>
      ) : (
        <div className="bloco" style={{ padding: "0" }}>
          <div className="tabela-container">
            <table className="tabela">
              <thead>
                <tr>
                  <th style={{ width: "70px" }}>ID</th>
                  <th>Nome</th>
                  <th>E-mail</th>
                  <th>Telefone</th>
                </tr>
              </thead>
              <tbody>
                {clientesFiltrados.map((cli) => (
                  <tr key={cli.id}>
                    <td>
                      <span className="badge-id">#{cli.id}</span>
                    </td>
                    <td>
                      <strong>{cli.nome}</strong>
                    </td>
                    <td>{cli.email || "—"}</td>
                    <td>{cli.telefone || "—"}</td>
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
