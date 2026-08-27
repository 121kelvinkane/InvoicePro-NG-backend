const layOut = require("./emailLayout");

const welcomeEmail = ({ name }) =>
    layOut({
        title: `Welcome to Invoice Pro, ${name}!`,
        subtitle: "Your account is ready.",
        body: `
            <p style="
                margin:0 0 28px;
                font-size:16px;
                line-height:1.7;
                color:#555;
            ">
                Thanks for joining <strong>Invoice Pro</strong>.
                Your account has been created successfully.
            </p>

            <div style="text-align:center;margin:30px 0;">
                <a
                    href="${process.env.APP_URL}"
                    style="
                        display:inline-block;
                        padding:13px 28px;
                        background:#1f0637;
                        color:#fff;
                        text-decoration:none;
                        border-radius:6px;
                        font-size:15px;
                        font-weight:600;
                    "
                >
                    Get Started
                </a>
            </div>

            <p style="
                margin:28px 0 0;
                font-size:15px;
                line-height:1.7;
                color:#555;
            ">
                We’re glad to have you with us.
            </p>

            <p style="
                margin:20px 0 0;
                font-size:15px;
                line-height:1.7;
                color:#555;
            ">
                Best regards,<br>
                <strong style="color:#1f0637;">
                    The Invoice Pro Team
                </strong>
            </p>
        `
    });

module.exports = welcomeEmail;