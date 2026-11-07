"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { API_BASE } from "../services/api";

export default function Home() {
  const [totais, setTotais] = useState({
    categorias: 0,
    produtos: 0,
    clientes: 0,
    pedidos: 0,
  });
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    async function carregarTotais() {
      try {
        setCarregando(true);
        const [resCat, resProd, resCli, resPed] = await Promise.all([
          fetch(`${API_BASE}/categorias`),
          fetch(`${API_BASE}/produtos`),
          fetch(`${API_BASE}/clientes`),
          fetch(`${API_BASE}/pedidos`),
        ]);

        const [dataCat, dataProd, dataCli, dataPed] = await Promise.all([
          resCat.json(),
          resProd.json(),
          resCli.json(),
          resPed.json(),
        ]);

        setTotais({
          categorias: Array.isArray(dataCat) ? dataCat.length : 0,
          produtos: Array.isArray(dataProd) ? dataProd.length : 0,
          clientes: Array.isArray(dataCli) ? dataCli.length : 0,
          pedidos: Array.isArray(dataPed) ? dataPed.length : 0,
        });
      } catch (err) {
        setErro("Não foi possível carregar os dados da API.");
      } finally {
        setCarregando(false);
      }
    }

    carregarTotais();
  }, []);

  return (
    <div>
      <div className="cartao-aluno">
        <h2>Controle de Estoque da Loja</h2>
        <p>Atividade desenvolvida para o 4º Bimestre &bull; Trabalho Individual</p>
        <p style={{ marginTop: "6px" }}>
          <strong>Aluna:</strong> Anny
        </p>
      </div>

      {erro && <div className="alerta alerta-erro">{erro}</div>}

      <div className="grade-quatro">
        <div className="card-total">
          <div className="card-total-titulo">Categorias</div>
          <div className="card-total-numero">
            {carregando ? "..." : totais.categorias}
          </div>
          <Link href="/categorias" className="card-total-link">
            Ver todas &rarr;
          </Link>
        </div>

        <div className="card-total">
          <div className="card-total-titulo">Produtos</div>
          <div className="card-total-numero">
            {carregando ? "..." : totais.produtos}
          </div>
          <Link href="/produtos" className="card-total-link">
            Ver estoque &rarr;
          </Link>
        </div>

        <div className="card-total">
          <div className="card-total-titulo">Clientes</div>
          <div className="card-total-numero">
            {carregando ? "..." : totais.clientes}
          </div>
          <Link href="/clientes" className="card-total-link">
            Ver clientes &rarr;
          </Link>
        </div>

        <div className="card-total">
          <div className="card-total-titulo">Pedidos</div>
          <div className="card-total-numero">
            {carregando ? "..." : totais.pedidos}
          </div>
          <Link href="/pedidos" className="card-total-link">
            Ver pedidos &rarr;
          </Link>
        </div>
      </div>

      <div className="grade-duas-colunas">
        <div className="bloco">
          <h3 style={{ marginBottom: "8px", color: "#1b4332" }}>Acesso Rápido</h3>
          <p style={{ color: "#666", fontSize: "0.9rem" }}>
            Selecione uma ação para navegar:
          </p>
          <div className="lista-botoes-atalho">
            <Link href="/pedidos/novo" className="botao-atalho">
              + Criar Pedido
            </Link>
            <Link href="/pedidos" className="botao-atalho">
              Listar Pedidos
            </Link>
            <Link href="/produtos" className="botao-atalho">
              Produtos
            </Link>
            <Link href="/clientes" className="botao-atalho">
              Clientes
            </Link>
          </div>
        </div>

        <div className="bloco">
          <h3 style={{ marginBottom: "8px", color: "#1b4332" }}>Rotas da API Utilizadas</h3>
          <p style={{ color: "#666", fontSize: "0.9rem" }}>
            Endpoints conectados via Fetch API:
          </p>
          <div style={{ marginTop: "10px" }}>
            <div className="linha-endpoint">
              <span>Categorias</span>
              <code>/api/categorias</code>
            </div>
            <div className="linha-endpoint">
              <span>Produtos</span>
              <code>/api/produtos</code>
            </div>
            <div className="linha-endpoint">
              <span>Clientes</span>
              <code>/api/clientes</code>
            </div>
            <div className="linha-endpoint">
              <span>Pedidos</span>
              <code>/api/pedidos</code>
            </div>
            <div className="linha-endpoint">
              <span>Itens do Pedido</span>
              <code>/api/itens_pedido</code>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
