import nodemailer from "nodemailer";

const sendMail = async (subject, email, message) => {
    if (!email) {
    console.error("❌ Email is missing or undefined!");
    return;
  }
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false, 
      auth: {
        user: process.env.SMTP_USER, 
        pass: process.env.SMTP_PASS, 
      },
      tls: {
        rejectUnauthorized: false, 
      },
    });

    await transporter.sendMail({
      from: `"30DC Shop" <${process.env.SMTP_USER}>`,
      to: email,
      subject,
      html: message,
    });

    console.log("✅ Welcome email sent successfully");
  } catch (error) {
    console.error("❌ Failed to send message:", error.message);
  }
};

export default sendMail;
