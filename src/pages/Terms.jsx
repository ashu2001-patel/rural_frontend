// src/pages/Terms.js
const Terms = () => {
  return (
    <div style={styles.container}>
      <h1>Terms & Conditions</h1>

      <p>By using Rural Company, you agree:</p>

      <ul>
        <li>Provide correct information</li>
        <li>No fake listings</li>
        <li>We are only a platform (not responsible for deals)</li>
      </ul>

      <h3>Payments</h3>
      <p>All payments are non-refundable.</p>

      <h3>Account</h3>
      <p>You are responsible for your account activity.</p>
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

export default Terms;