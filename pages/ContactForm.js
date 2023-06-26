import { useState } from "react";
import { supabase } from "../supabase";

const ContactForm = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Save the data to the Supabase database
    const { data, error } = await supabase
      .from("contacts")
      .insert([{ email, message }]);

    if (error) {
      console.error(error);
      // Handle the error
    } else {
      // Handle the success
      console.log("Data saved successfully");
    }

    setEmail("");
    setMessage("");
  };

  const styles = {
    container: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      height: "100vh",
    },
    form: {
      display: "flex",
      flexDirection: "column",
      maxWidth: "400px",
      padding: "20px",
      border: "1px solid #ccc",
      borderRadius: "4px",
      backgroundColor: "#f9f9f9",
    },
    title: {
      marginBottom: "20px",
      fontSize: "24px",
      fontWeight: "bold",
      textAlign: "center",
    },
    input: {
      padding: "10px",
      marginBottom: "10px",
    },
    textarea: {
      padding: "10px",
      marginBottom: "10px",
    },
    button: {
      padding: "10px",
      backgroundColor: "#007bff",
      color: "#fff",
      border: "none",
      cursor: "pointer",
    },
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleSubmit} style={styles.form}>
        <h2 style={styles.title}>Contact Form</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={styles.input}
        />
        <textarea
          placeholder="Message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          style={styles.textarea}
        />
        <button type="submit" style={styles.button}>
          Send
        </button>
      </form>
    </div>
  );
};

export default ContactForm;
