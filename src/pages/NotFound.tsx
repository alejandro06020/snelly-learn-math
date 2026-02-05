import { useLocation, Link } from "react-router-dom";
import { useEffect, useRef } from "react";
import { Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();
  const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
    titleRef.current?.focus();
  }, [location.pathname]);

  return (
    <div className="page-container bg-gradient-to-b from-background to-muted/30">
      <a href="#main-content" className="skip-link">
        Saltar al contenido principal
      </a>
      <main id="main-content" className="content-wrapper flex min-h-screen items-center justify-center">
        <div className="hero-card text-center max-w-md">
          <h1 ref={titleRef} tabIndex={0} className="mb-4 text-6xl font-bold text-gradient">404</h1>
          <p tabIndex={0} className="mb-6 text-xl text-muted-foreground">
            ¡Ups! Página no encontrada
          </p>
          <p tabIndex={0} className="mb-8 text-muted-foreground">
            La página que buscas no existe o ha sido movida.
          </p>
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-colors focus:outline-none focus:ring-4 focus:ring-focus-ring/40"
          >
            <Home className="w-5 h-5" />
            Volver al inicio
          </Link>
        </div>
      </main>
    </div>
  );
};

export default NotFound;
