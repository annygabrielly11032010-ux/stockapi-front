import "./globals.css";
import Header from "../components/Header";
import Footer from "../components/Footer";

export const metadata = {
  title: "Controle de Estoque",
  description: "Aplicação para controle de estoque de loja",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-br">
      <body>
        <Header />
        <main className="conteudo">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
