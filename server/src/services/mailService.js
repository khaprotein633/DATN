const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls:{
    rejectUnauthorized:true
  }
});

const sendOtpEmail = async (email, otp) => {
  await transporter.sendMail({
    from: `"QuizMaster" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Mã xác thực đặt lại mật khẩu",
    html: `
      <div style="
        max-width:600px;
        margin:0 auto;
        font-family:Arial,sans-serif;
        background:#f4f6f9;
        padding:30px;
      ">
        <div style="
          background:#ffffff;
          border-radius:12px;
          padding:40px;
          text-align:center;
          box-shadow:0 2px 10px rgba(0,0,0,0.1);
        ">
          <h1 style="
            color:#2563eb;
            margin-bottom:20px;
          ">
            QuizMaster
          </h1>

          <h2 style="
            color:#333;
            margin-bottom:20px;
          ">
            Đặt lại mật khẩu
          </h2>

          <p style="
            color:#666;
            font-size:16px;
            line-height:1.6;
          ">
            Chúng tôi nhận được yêu cầu đặt lại mật khẩu cho tài khoản của bạn.
          </p>

          <p style="
            color:#666;
            font-size:16px;
          ">
            Mã OTP của bạn là:
          </p>

          <div style="
            background:#2563eb;
            color:white;
            font-size:32px;
            font-weight:bold;
            letter-spacing:8px;
            padding:15px;
            border-radius:10px;
            margin:25px 0;
          ">
            ${otp}
          </div>

          <p style="
            color:#dc2626;
            font-weight:600;
          ">
            Mã OTP có hiệu lực trong 5 phút.
          </p>

          <hr style="
            border:none;
            border-top:1px solid #e5e7eb;
            margin:30px 0;
          ">

          <p style="
            color:#999;
            font-size:14px;
          ">
            Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này.
          </p>

          <p style="
            color:#999;
            font-size:12px;
            margin-top:20px;
          ">
            © 2026 QuizMaster - Hệ thống thi trắc nghiệm DSA
          </p>
        </div>
      </div>
    `,
  });
};

module.exports = {
  sendOtpEmail,
};