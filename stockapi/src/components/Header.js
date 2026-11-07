"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header() {
  const [menuAberto, setMenuAberto] = useState(false);
  const pathname = usePathname();

  function fecharMenu() {
    setMenuAberto(false);
  }

  return (
    <header className="cabecalho">
      <div className="cabecalho-conteudo">
        <Link href="/" className="logo" onClick={fecharMenu}>
          Controle de Estoque
        </Link>

        <button
          className="btn-menu"
          onClick={() => setMenuAberto(!menuAberto)}
          aria-label="Menu"
        >
          {menuAberto ? "✕" : "☰"}
        </button>

        <nav className={`menu ${menuAberto ? "aberto" : ""}`}>
          <Link
            href="/"
            className={`menu-item ${pathname === "/" ? "ativo" : ""}`}
            onClick={fecharMenu}
          >
            Início
          </Link>
          <Link
            href="/categorias"
            className={`menu-item ${pathname === "/categorias" ? "ativo" : ""}`}
            onClick={fecharMenu}
          >
            Categorias
          </Link>
          <Link
            href="/produtos"
            className={`menu-item ${pathname === "/produtos" ? "ativo" : ""}`}
            onClick={fecharMenu}
          >
            Produtos
          </Link>
          <Link
            href="/clientes"
            className={`menu-item ${pathname === "/clientes" ? "ativo" : ""}`}
            onClick={fecharMenu}
          >
            Clientes
          </Link>
          <Link
            href="/pedidos"
            className={`menu-item ${pathname === "/pedidos" ? "ativo" : ""}`}
            onClick={fecharMenu}
          >
            Pedidos
          </Link>
          <Link
            href="/pedidos/novo"
            className={`menu-item menu-item-destaque ${pathname === "/pedidos/novo" ? "ativo" : ""}`}
            onClick={fecharMenu}
          >
            + Novo Pedido
          </Link>
        </nav>
      </div>
    </header>
  );
}
