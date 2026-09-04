import "../app/globals.css";
import { initDb } from "../lib/db.js"; 


// Chama a inicialização do banco
initDb().catch(console.error); 

export const metadata = {
  title: "bySafirah - Studio",
  description: "Portfólio de fotografia",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR" className="scroll-smooth">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}