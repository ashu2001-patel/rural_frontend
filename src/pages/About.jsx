// src/pages/About.js
const About = () => {
  return (
    <div style={styles.container}>
      <h1>About Us</h1>
      <p>
        Welcome to <b>Rural Company</b> — a platform built to simplify the buying
        and selling of animals in rural India.
      </p>

      <h3>Our Mission</h3>
      <p>
        To connect farmers and buyers directly and remove middlemen.
      </p>

      <h3>What You Can Do</h3>
      <ul>
        <li>Post animals for sale</li>
        <li>Browse nearby listings</li>
        <li>Connect with buyers</li>
      </ul>

      <p>📍 Made for Rural India 🇮🇳</p>
    </div>
  );
};

const styles = {
  container: {
    padding: "2rem",
    maxWidth: "800px",
    margin: "auto",
    lineHeight: "1.6"
  }
};

export default About;