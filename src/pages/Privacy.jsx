// src/pages/Privacy.js
const Privacy = () => {
  return (
    <div style={styles.container}>
      <h1>Privacy Policy</h1>

      <p>We respect your privacy and protect your data.</p>

      <h3>Data We Collect</h3>
      <ul>
        <li>Name, phone, email</li>
        <li>Location & listings</li>
      </ul>

      <h3>Usage</h3>
      <p>We use your data to connect buyers and sellers.</p>

      <h3>Security</h3>
      <p>Your data is सुरक्षित with us.</p>
    </div>
  );
};

const styles = {
  container: {
    padding: "2rem",
    maxWidth: "800px",
    margin: "auto"
  }
};

export default Privacy;