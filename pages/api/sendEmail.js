import { supabase } from "../../supabase";
import nodemailer from "nodemailer";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { email, message } = req.body;

    // Send an email using Nodemailer
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: "", // Replace with your Gmail email address
        pass: "", // Replace with your Gmail password
      },
    });

    const mailOptions = {
      from: "", // Replace with your Gmail email address
      to: email,
      subject: "Reply to your email",
      text: message,
    };

    try {
      const info = await transporter.sendMail(mailOptions);
      console.log("Email sent: " + info.response);

      // Save the replied email to the Supabase database
      const { error } = await supabase
        .from("replied_emails")
        .insert([{ email, message }]);

      if (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to save replied email" });
      } else {
        res
          .status(200)
          .json({ message: "Email sent and replied email saved successfully" });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to send email" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
