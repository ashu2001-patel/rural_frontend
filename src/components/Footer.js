import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <div style={styles.footer}>
      <p>© {new Date().getFullYear()} Rural Company</p>

      <div style={styles.links}>
        <Link to="/about">About</Link>
        <Link to="/privacy">Privacy</Link>
        <Link to="/terms">Terms</Link>
      </div>
    </div>
  );
};

const styles = {
  footer: {
    padding: "1rem",
    textAlign: "center",
    borderTop: "1px solid #ddd",
    marginTop: "2rem"
  },
  links: {
    display: "flex",
    justifyContent: "center",
    gap: "15px",
    marginTop: "8px"
  }
};

export default Footer;