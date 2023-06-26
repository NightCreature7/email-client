import { useEffect, useState } from "react";
import { supabase } from "../supabase";

const Dashboard = () => {
  const [receivedEmails, setReceivedEmails] = useState([]);
  const [sentEmails, setSentEmails] = useState([]);
  const [replyEmail, setReplyEmail] = useState("");
  const [replyMessage, setReplyMessage] = useState("");
  const [showReplyForm, setShowReplyForm] = useState(false);

  useEffect(() => {
    // Fetch received emails from the Supabase database
    const fetchReceivedEmails = async () => {
      const { data, error } = await supabase.from("contacts").select("*");
      if (error) {
        console.error(error);
        // Handle the error
      } else {
        setReceivedEmails(data);
      }
    };

    // Fetch sent emails from the Supabase database
    const fetchSentEmails = async () => {
      const { data, error } = await supabase.from("replied_emails").select("*");
      if (error) {
        console.error(error);
        // Handle the error
      } else {
        setSentEmails(data);
      }
    };

    fetchReceivedEmails();
    fetchSentEmails();
  }, []);

  const handleReply = (email) => {
    setReplyEmail(email);
    setShowReplyForm(true);
  };

  const handleSendReply = async () => {
    try {
      const response = await fetch("/api/sendEmail", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: replyEmail, message: replyMessage }),
      });

      if (response.ok) {
        console.log("Email sent and replied email saved successfully");

        // Save the replied email to the Supabase database
        const { error } = await supabase
          .from("replied_emails")
          .insert([{ email: replyEmail, message: replyMessage }]);

        if (error) {
          console.error(error);
          // Handle the error
        }

        setShowReplyForm(false);
        setReplyEmail("");
        setReplyMessage("");
      } else {
        console.error("Failed to send email");
        // Handle the error
      }
    } catch (error) {
      console.error(error);
      // Handle the error
    }
  };

  return (
    <div className="dashboard-container">
      <h2>Received Emails</h2>
      <div className="email-list">
        {receivedEmails.map((email) => (
          <div className="email-item" key={email.id}>
            <p>Email: {email.email}</p>
            <p>Message: {email.message}</p>
            <button onClick={() => handleReply(email.email)}>Reply</button>
          </div>
        ))}
      </div>
      <h2>Sent Emails</h2>
      <div className="email-list">
        {sentEmails.map((email) => (
          <div className="email-item" key={email.id}>
            <p>Email: {email.email}</p>
            <p>Message: {email.message}</p>
          </div>
        ))}
      </div>
      {showReplyForm && (
        <div className="reply-form">
          <h3>Reply to: {replyEmail}</h3>
          <input
            type="text"
            placeholder="Type your reply..."
            value={replyMessage}
            onChange={(e) => setReplyMessage(e.target.value)}
          />
          <button onClick={handleSendReply}>Send</button>
        </div>
      )}
      <style jsx>{`
        .dashboard-container {
          padding: 20px;
        }

        .email-list {
          margin-bottom: 20px;
        }

        .email-item {
          border: 1px solid #ccc;
          padding: 10px;
          margin-bottom: 10px;
        }

        .reply-form {
          margin-top: 20px;
        }

        .reply-form h3 {
          margin-bottom: 10px;
        }

        .reply-form input {
          margin-bottom: 10px;
          padding: 5px;
        }

        .reply-form button {
          background-color: #4caf50;
          color: white;
          border: none;
          padding: 10px 20px;
          cursor: pointer;
        }

        .reply-form button:hover {
          background-color: #45a049;
        }
      `}</style>
    </div>
  );
};

export default Dashboard;
