const nodemailer = require("nodemailer");

const mailOptions = (user, url, type) => {
    let subject, html;
    if (type === 'accepted') {
        subject = "✅ Your image was approved!";
        html = `<p>Hi ${user.fName} ${user.lName},</p>
        <p>Thank you for your contribution to PicsForAll! Your image has been successfully approved and is now available for others to view.</p>`;
    }
    else if (type === 'rejected') {
        subject = "❌ Your image was rejected",
            html = `<p>Hi ${user.fName} ${user.lName},
            </p><p>Unfortunately, your image did not pass our moderation checks. This may be due to a lack of nature or wildlife content, or the presence of content deemed offensive.</p>`;
    } else {
        subject = "Something went wrong",
            html = `<p>Hi ${user.fName} ${user.lName},</p>
            <p>Unfortunately, your image could not be processed because we ran into an error. Please try reuploading the image after some time.</p>`;
    }

    return {
        from: `PicsForAll <${process.env.APP_EMAIL}>`,
        to: user.email,
        subject: subject,
        html: html
    }
}

const emailNotification = async (user, url, type) => {
    try {
        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true, // use SSL
            auth: {
                user: process.env.APP_EMAIL,
                pass: process.env.APP_PASSWORD,
            },
        });

        await transporter.sendMail(mailOptions(user, url, type));

    } catch (error) {
        console.error("Error sending email:", error);
    }
}

module.exports = emailNotification;