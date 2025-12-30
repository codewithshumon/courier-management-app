export const welcomeHtml = `
<div style="
  font-family: 'Segoe UI', Roboto, sans-serif;
  max-width: 500px;
  margin: 0 auto;
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 5px 20px rgba(0,0,0,0.1);
">
  <!-- Header -->
  <div style="
    background: linear-gradient(to right, #4CAF50, #45a049);
    padding: 30px;
    text-align: center;
    color: white;
  ">
    <h1 style="margin: 0; font-size: 28px; font-weight: 600;">🚀 Courier Pro</h1>
    <p style="margin: 8px 0 0; opacity: 0.9; font-size: 14px;">Smart Logistics Solution</p>
  </div>
  
  <!-- Content -->
  <div style="padding: 40px 30px;">
    <h2 style="
      color: #2c3e50;
      margin: 0 0 20px;
      font-size: 24px;
      font-weight: 600;
    ">
      Welcome!
    </h2>
    
    <p style="
      color: #555;
      line-height: 1.6;
      margin: 0 0 25px;
      font-size: 16px;
    ">
      Your account has been successfully created and is ready to use.
    </p>
    
    <!-- Features -->
    <div style="
      background: #f8f9fa;
      padding: 20px;
      border-radius: 8px;
      margin: 25px 0;
    ">
      <h3 style="
        color: #4CAF50;
        margin: 0 0 15px;
        font-size: 18px;
        font-weight: 600;
      ">
        📦 What You Can Do:
      </h3>
      <ul style="
        margin: 0;
        padding-left: 20px;
        color: #555;
        line-height: 1.8;
      ">
        <li>Book parcel pickups instantly</li>
        <li>Track deliveries in real-time</li>
        <li>Manage all your shipments</li>
        <li>Get live notifications</li>
      </ul>
    </div>
    
    <!-- Button -->
    <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/dashboard" 
       style="
         display: inline-block;
         background: linear-gradient(to right, #4CAF50, #45a049);
         color: white;
         padding: 14px 30px;
         text-decoration: none;
         border-radius: 8px;
         font-weight: 600;
         font-size: 16px;
         text-align: center;
         margin: 20px 0;
       ">
      Go to Dashboard →
    </a>
  </div>
  
  <!-- Footer -->
  <div style="
    background: #f8f9fa;
    padding: 20px;
    text-align: center;
    border-top: 1px solid #eee;
    color: #666;
    font-size: 12px;
  ">
    <p style="margin: 0 0 10px;">
      This is an automated message. Please do not reply.
    </p>
    <p style="margin: 0 0 10px;">
      <a href="https://shumon.scaledive.com/" 
         style="color: #4CAF50; text-decoration: none; font-weight: 500;">
        Software Developer Portfolio
      </a>
    </p>
    <p style="margin: 0;">
      © ${new Date().getFullYear()} Courier Pro. All rights reserved.
    </p>
  </div>
</div>
`;