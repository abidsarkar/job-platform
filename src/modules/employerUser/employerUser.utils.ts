import nodemailer from 'nodemailer';

export const sendSubEmployerRegistrationEmail = async (
  subEmployerName: string,
  subEmployerEmail: string,
  confirmationLink: string
) => {
  // Create a transporter using your SMTP service (e.g., Gmail)
  const transporter = nodemailer.createTransport({
    service: 'gmail', // Replace with your email service
    auth: {
      user: 'your-email@gmail.com', // Your email
      pass: 'your-email-password', // Your email password or app-specific password
    },
  });

  // Define email options
  const mailOptions = {
    from: 'your-email@gmail.com', // Sender address
    to: subEmployerEmail, // Receiver's email
    subject: 'Welcome to [Your Company Name] - Sub-Employer Registration Confirmation',
    html: `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Sub-Employer Registration Confirmation</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              margin: 0;
              padding: 0;
              background-color: #f4f4f4;
            }
            .container {
              width: 100%;
              max-width: 600px;
              margin: 20px auto;
              background-color: #fff;
              padding: 20px;
              border-radius: 5px;
              box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            }
            h1 {
              color: #333;
            }
            p {
              color: #555;
            }
            .button {
              background-color: #4CAF50;
              color: #fff;
              padding: 10px 20px;
              text-align: center;
              border-radius: 5px;
              text-decoration: none;
            }
            .footer {
              margin-top: 30px;
              font-size: 12px;
              color: #888;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>Welcome to [Your Company Name], ${subEmployerName}!</h1>
            <p>We are excited to have you onboard as a Sub-Employer at [Your Company Name]. Please find the details of your registration below:</p>
            <p><strong>Email:</strong> ${subEmployerEmail}</p>
            <p>Your account is now created, and you can start managing your duties as a Sub-Employer. We have a lot of exciting opportunities ahead!</p>
            <p>If you have any questions, feel free to reach out to our support team at [support@yourcompany.com].</p>
            <p>Click the button below to confirm your registration and activate your account:</p>
            <a href="${confirmationLink}" class="button">Confirm Registration</a>
            <div class="footer">
              <p>&copy; ${new Date().getFullYear()} [Your Company Name]. All Rights Reserved.</p>
              <p>If you did not request this registration, please ignore this email.</p>
            </div>
          </div>
        </body>
      </html>
    `,
  };

  // Send the email
  await transporter.sendMail(mailOptions);
};
