import dotenv from 'dotenv';
dotenv.config();

import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false 
  }
});

export const sendEmail = async (options) => {
  try {
    const mailOptions = {
      from: `"Courier System" <${process.env.EMAIL_USER}>`,
      to: options.email,
      subject: options.subject,
      html: options.html,
    };

    await transporter.sendMail(mailOptions);
    console.log('✅ Email sent successfully to:', options.email);
    
  } catch (error) {
    console.error('❌ Error sending email:', error.message);
    
    console.log('⚠️ Continuing (email not sent):', error.message);
  }
};

export const sendParcelStatusEmail = async (parcel, user) => {
  const statusMessages = {
    pending: 'Your parcel has been booked and is pending assignment.',
    assigned: 'Your parcel has been assigned to a delivery agent.',
    picked_up: 'Your parcel has been picked up by our delivery agent.',
    in_transit: 'Your parcel is in transit to the destination.',
    out_for_delivery: 'Your parcel is out for delivery.',
    delivered: 'Your parcel has been successfully delivered.',
    failed: 'There was an issue with your parcel delivery.',
  };

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #4CAF50;">Parcel Status Update</h2>
      <p>Hello ${user.name},</p>
      <p>Your parcel with tracking number <strong>${parcel.trackingNumber}</strong> has been updated.</p>
      <div style="background-color: #f5f5f5; padding: 20px; border-radius: 5px; margin: 20px 0;">
        <h3 style="margin-top: 0;">Status: ${parcel.delivery.status.toUpperCase()}</h3>
        <p>${statusMessages[parcel.delivery.status] || 'Your parcel status has been updated.'}</p>
        ${parcel.delivery.deliveryNotes ? `<p><strong>Notes:</strong> ${parcel.delivery.deliveryNotes}</p>` : ''}
      </div>
      <p>You can track your parcel using this link:</p>
      <a href="${process.env.FRONTEND_URL}/track/${parcel.trackingNumber}" 
         style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">
        Track Your Parcel
      </a>
      <p style="margin-top: 30px; color: #666; font-size: 12px;">
        This is an automated message. Please do not reply to this email.
      </p>
    </div>
  `;

  await sendEmail({
    email: user.email,
    subject: `Parcel Status Update - ${parcel.trackingNumber}`,
    html,
  });
};