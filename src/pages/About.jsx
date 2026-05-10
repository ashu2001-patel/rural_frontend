import { useTranslation } from "react-i18next";

const About = () => {
  const { t } = useTranslation();
  return (
    <div style={s.container}>
      <h1 style={s.title}>{t("legal.about.title")}</h1>
      <p style={s.tagline}>{t("legal.about.tagline")}</p>

      <h3 style={s.section}>{t("legal.about.missionTitle")}</h3>
      <p style={s.body}>{t("legal.about.missionBody")}</p>

      <h3 style={s.section}>{t("legal.about.valuesTitle")}</h3>
      <div style={s.cards}>
        <div style={s.card}>
          <h4 style={s.cardTitle}>{t("legal.about.trustTitle")}</h4>
          <p style={s.cardBody}>{t("legal.about.trustBody")}</p>
        </div>
        <div style={s.card}>
          <h4 style={s.cardTitle}>{t("legal.about.fairnessTitle")}</h4>
          <p style={s.cardBody}>{t("legal.about.fairnessBody")}</p>
        </div>
        <div style={s.card}>
          <h4 style={s.cardTitle}>{t("legal.about.transparencyTitle")}</h4>
          <p style={s.cardBody}>{t("legal.about.transparencyBody")}</p>
        </div>
      </div>

      <h3 style={s.section}>{t("legal.about.techTitle")}</h3>
      <p style={s.body}>{t("legal.about.techBody")}</p>

      <h3 style={s.section}>{t("legal.about.contactTitle")}</h3>
      <p style={s.body}>
        {t("legal.about.contactBody")}{" "}
        <a href="mailto:support@ruralcompany.in" style={s.link}>support@ruralcompany.in</a>
      </p>
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
  title:   { fontFamily: "'Playfair Display',serif", color: "#d4af63", fontSize: "1.9rem", margin: "0 0 8px" },
  tagline: { color: "rgba(240,230,208,.55)", fontSize: ".95rem", marginBottom: "2rem" },
  section: { fontFamily: "'Playfair Display',serif", color: "#d4af63", fontSize: "1.15rem", marginTop: "1.8rem", marginBottom: ".6rem" },
  body:    { color: "rgba(240,230,208,.7)", fontSize: ".92rem", margin: 0 },
  cards: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "12px",
    marginTop: "12px",
  },
  card: {
    background: "rgba(212,175,99,.04)",
    border: "1px solid rgba(212,175,99,.12)",
    borderRadius: "12px",
    padding: "14px 16px",
  },
  cardTitle: { color: "#d4af63", fontSize: ".95rem", margin: "0 0 6px" },
  cardBody:  { color: "rgba(240,230,208,.55)", fontSize: ".85rem", margin: 0, lineHeight: 1.55 },
  link: { color: "#d4af63" },
};

export default About;
