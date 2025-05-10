const nodemailer = require('nodemailer');
require('dotenv').config();

// Create reusable transporter
const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Send flood alert email
const sendFloodAlert = async (user, waterLevel, location) => {
  try {
    let alertLevel = 'Alert';
    let color = '#a9ff6e';
    
    if (waterLevel >= process.env.CRITICAL_FLOOD_LEVEL) {
      alertLevel = 'CRITICAL FLOOD';
      color = '#ec3e40';
    } else if (waterLevel >= process.env.MAJOR_FLOOD_LEVEL) {
      alertLevel = 'MAJOR FLOOD';
      color = '#ff9b2b';
    } else if (waterLevel >= process.env.MINOR_FLOOD_LEVEL) {
      alertLevel = 'MINOR FLOOD';
      color = '#F9E973';
    }
    
    const mailOptions = {
      from: `"Flood Alert System" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: `${alertLevel}: ${location} Water Level Alert`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: ${color}; padding: 20px; text-align: center; color: #333;">
            <h1>${alertLevel} ALERT</h1>
          </div>
          <div style="padding: 20px; border: 1px solid #ddd;">
            <p>Dear ${user.name},</p>
            <p>This is an automated alert to inform you that the water level at <strong>${location}</strong> has reached <strong>${waterLevel} meters</strong>, which exceeds your alert threshold of ${user.alertThreshold} meters.</p>
            <p>Current Status: <strong>${alertLevel}</strong></p>
            <h3>Safety Measures:</h3>
            <ul>
              <li>Stay tuned to local news and weather updates</li>
              <li>Prepare emergency supplies</li>
              <li>Consider evacuation if authorities recommend</li>
              <li>Move important belongings to higher ground</li>
            </ul>
            <p>Please take necessary precautions for your safety.</p>
            <p>This is an automated message. Do not reply to this email.</p>
          </div>
          <div style="background-color: #f1f1f1; padding: 10px; text-align: center; font-size: 12px;">
            <p>Kalu River Flood Monitoring System</p>
          </div>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`Alert email sent to ${user.email}: ${info.messageId}`);
    return true;
  } catch (error) {
    console.error('Email sending failed:', error);
    return false;
  }
};

module.exports = {
  sendFloodAlert
};