import { useTranslation } from "react-i18next";

const Terms = () => {
  const { t } = useTranslation();
  return (
    <div style={s.container}>
      <h1 style={s.title}>{t("legal.terms.title")}</h1>
      <p style={s.meta}>{t("legal.terms.lastUpdated")}</p>
      <p style={s.body}>{t("legal.terms.intro")}</p>

      <h3 style={s.section}>{t("legal.terms.useTitle")}</h3>
      <p style={s.body}>{t("legal.terms.useBody")}</p>

      <h3 style={s.section}>{t("legal.terms.paymentsTitle")}</h3>
      <p style={s.body}>{t("legal.terms.paymentsBody")}</p>

      <h3 style={s.section}>{t("legal.terms.responsibilityTitle")}</h3>
      <p style={s.body}>{t("legal.terms.responsibilityBody")}</p>

      <h3 style={s.section}>{t("legal.terms.terminationTitle")}</h3>
      <p style={s.body}>{t("legal.terms.terminationBody")}</p>

      <h3 style={s.section}>{t("legal.terms.changesTitle")}</h3>
      <p style={s.body}>{t("legal.terms.changesBody")}</p>
    </div>
  );
};

const s = {
  container: {
    padding: "2rem 1.2rem",
    maxWidth: "780px",
    margin: "0 auto",
    color: "#f0e6d0",
    fontFamily: "'Poppins',sans-serif",
    lineHeight: 1.7,
  },
  title:   { fontFamily: "'Playfair Display',serif", color: "#d4af63", fontSize: "1.9rem", margin: "0 0 4px" },
  meta:    { fontSize: ".75rem", color: "rgba(212,175,99,.45)", marginBottom: "1.6rem", letterSpacing: ".05em" },
  section: { fontFamily: "'Playfair Display',serif", color: "#d4af63", fontSize: "1.1rem", marginTop: "1.6rem", marginBottom: ".5rem" },
  body:    { color: "rgba(240,230,208,.7)", fontSize: ".92rem", margin: 0 },
};

export default Terms;
