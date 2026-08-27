const env = require("../config/env");

const APP_NAME = env.appName;
const APP_URL = env.appUrl;
const APP_LOGO = env.appLogo;
const APP_TAGLINE = env.appTagline;

const layOut = ({ title, subtitle, body }) => `
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title}</title>
</head>

<body style="
  margin:0;
  padding:0;
  background:#f6f7f9;
  font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;
  color:#171717;
">

<table
  width="100%"
  cellpadding="0"
  cellspacing="0"
  role="presentation"
  style="background:#f6f7f9;padding:40px 16px;"
>
  <tr>
    <td align="center">

      <table
        width="100%"
        cellpadding="0"
        cellspacing="0"
        role="presentation"
        style="
          max-width:560px;
          background:#ffffff;
          border:1px solid #e8e8e8;
          border-radius:12px;
          overflow:hidden;
        "
      >

        <!-- HEADER -->

        <tr>
          <td style="padding:28px 32px 22px;">

            <table
              width="100%"
              cellpadding="0"
              cellspacing="0"
              role="presentation"
            >
              <tr>

                <td align="left">
                  ${
                    APP_LOGO
                      ? `
                  <img
                    src="${APP_LOGO}"
                    alt="${APP_NAME}"
                    width="42"
                    height="42"
                    style="
                      display:block;
                      width:42px;
                      height:42px;
                      object-fit:contain;
                      border-radius:8px;
                    "
                  />
                  `
                      : `
                  <span style="
                    font-size:20px;
                    font-weight:700;
                    color:#111111;
                  ">
                    ${APP_NAME}
                  </span>
                  `
                  }
                </td>

              </tr>
            </table>

          </td>
        </tr>

        <!-- DIVIDER -->

        <tr>
          <td style="padding:0 32px;">
            <div style="
              height:1px;
              background:#eeeeee;
              line-height:1px;
              font-size:1px;
            ">
              &nbsp;
            </div>
          </td>
        </tr>

        <!-- CONTENT -->

        <tr>
          <td style="padding:36px 32px 40px;">

            <h1 style="
              margin:0 0 14px;
              font-size:25px;
              line-height:1.3;
              font-weight:700;
              letter-spacing:-0.4px;
              color:#111111;
            ">
              ${title}
            </h1>

            ${
              subtitle
                ? `
            <p style="
              margin:0 0 26px;
              font-size:15px;
              line-height:1.7;
              color:#666666;
            ">
              ${subtitle}
            </p>
            `
                : ""
            }

            <div style="
              font-size:15px;
              line-height:1.7;
              color:#333333;
            ">
              ${body}
            </div>

          </td>
        </tr>

        <!-- FOOTER -->

        <tr>
          <td style="
            padding:20px 32px;
            background:#fafafa;
            border-top:1px solid #eeeeee;
          ">

            <p style="
              margin:0;
              font-size:12px;
              line-height:1.6;
              color:#888888;
            ">
              ${APP_TAGLINE || ""}
            </p>

            <p style="
              margin:8px 0 0;
              font-size:12px;
              line-height:1.6;
              color:#999999;
            ">
              © ${new Date().getFullYear()} ${APP_NAME}. All rights reserved.
            </p>

            ${
              APP_URL
                ? `
            <p style="
              margin:8px 0 0;
              font-size:12px;
            ">
              <a
                href="${APP_URL}"
                style="
                  color:#111111;
                  text-decoration:none;
                  font-weight:500;
                "
              >
                Visit ${APP_NAME}
              </a>
            </p>
            `
                : ""
            }

          </td>
        </tr>

      </table>

      <!-- OUTSIDE FOOTER -->

      <p style="
        margin:18px 0 0;
        font-size:11px;
        line-height:1.5;
        color:#aaaaaa;
      ">
        You're receiving this email because you have an account with ${APP_NAME}.
      </p>

    </td>
  </tr>
</table>

</body>
</html>
`;

module.exports = layOut;