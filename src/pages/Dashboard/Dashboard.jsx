import { Github, Linkedin, Instagram, Globe } from "lucide-react";
import { Link } from "react-router-dom";
import './elegant.css'
export default function Dashboard() {
  return (
    <div className="elegant-container">
      <div className="elegant-card">
        <div className="logo-area">
          <div className="logo-s">S</div>
        </div>

        <div className="content-area">
          <h1>Sistema de Facturación</h1>
          <div className="divider"></div>
          <p className="credit">
            Elaborado por <strong>SebasDev</strong>
          </p>

          <div className="social-links">
            <a
              href="https://github.com/itzsebas121"
              className="social-link"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
            >
              <Github strokeWidth={1.5} />
            </a>


            <a
              href="https://linkedin.com/in/sebas-tipan-17045833b"
              className="social-link"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
            >
              <Linkedin strokeWidth={1.5} />
            </a>

            <a
              href="https://instagram.com/itz_sebas121"
              className="social-link"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
            >
              <Instagram strokeWidth={1.5} />
            </a>

            <a
              href="https://itzsebasdev.netlify.app/"
              className="social-link"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Website"
            >
              <Globe strokeWidth={1.5} />
            </a>
          </div>

          <div className="cta-area">
            {/* Para rutas internas usa Link de react-router-dom */}
            <Link to="/home/sales" className="cta-button">
              Ingresar al Sistema
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
