import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const Footer = () => {
  const { t } = useTranslation();
  return (
    <>
      <style>{`
        .footer {
          background: #0f0a05;
          border-top: 1px solid rgba(212,175,99,0.15);
          padding: 2rem 1.2rem 1rem;
          font-family: 'Poppins', sans-serif;
        }

        .footer-container {
          max-width: 1100px;
          margin: auto;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 1.5rem;
        }

        .footer-logo {
          font-family: 'Playfair Display', serif;
          color: #d4af63;
          font-size: 1.2rem;
          margin-bottom: 0.5rem;
        }

        .footer-desc {
          font-size: 0.8rem;
          color: rgba(230,216,181,0.5);
          line-height: 1.5;
        }

        .footer-title {
          font-size: 0.75rem;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: rgba(212,175,99,0.4);
          margin-bottom: 0.6rem;
        }

        .footer-link {
          display: block;
          font-size: 0.82rem;
          color: rgba(230,216,181,0.6);
          text-decoration: none;
          margin-bottom: 6px;
          transition: 0.2s;
        }

        .footer-link:hover {
          color: #d4af63;
        }

        .footer-bottom {
          text-align: center;
          margin-top: 1.5rem;
          padding-top: 1rem;
          border-top: 1px solid rgba(212,175,99,0.08);
          font-size: 0.7rem;
          color: rgba(212,175,99,0.35);
        }

        @media (max-width: 500px) {
          .footer {
            padding: 1.5rem 1rem;
          }

          .footer-desc {
            font-size: 0.75rem;
          }
        }
      `}</style>

      <footer className="footer">
        <div className="footer-container">

          {/* Brand */}
          <div>
            <div className="footer-logo">🌾 {t("footer.brand")}</div>
            <p className="footer-desc">{t("footer.description")}</p>
          </div>

          {/* Quick Links */}
          <div>
            <div className="footer-title">{t("footer.explore")}</div>
            <Link to="/" className="footer-link">🐄 {t("nav.animals")}</Link>
            <Link to="/post-animal" className="footer-link">＋ {t("nav.postAnimal")}</Link>
            <Link to="/my-listings" className="footer-link">📋 {t("nav.myListings")}</Link>
          </div>

          {/* Legal */}
          <div>
            <div className="footer-title">{t("footer.legal")}</div>
            <Link to="/about" className="footer-link">{t("footer.aboutUs")}</Link>
            <Link to="/privacy" className="footer-link">{t("footer.privacyPolicy")}</Link>
            <Link to="/terms" className="footer-link">{t("footer.termsConditions")}</Link>
          </div>

          {/* Contact */}
          <div>
            <div className="footer-title">{t("footer.contact")}</div>
            <a href="mailto:support@ruralcompany.in" className="footer-link">
              📧 support@ruralcompany.in
            </a>
            <a href="tel:+919999999999" className="footer-link">
              📞 +91 99999 99999
            </a>
          </div>

        </div>

        <div className="footer-bottom">
          {t("footer.copyright", { year: new Date().getFullYear() })}
        </div>
      </footer>
    </>
  );
};

export default Footer;