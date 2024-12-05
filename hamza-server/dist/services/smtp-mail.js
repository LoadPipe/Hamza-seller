"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer_1 = __importDefault(require("nodemailer"));
const ejs_1 = __importDefault(require("ejs"));
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
class SmtpMailService {
    constructor() {
        this.SMTP_TRANSPORTER = nodemailer_1.default.createTransport({
            port: Number(process.env.SMTP_PORT),
            host: process.env.SMTP_HOST,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASSWORD,
            },
            debug: true,
            tls: {
                // do not fail on invalid certs
                rejectUnauthorized: false,
            },
        });
    }
    mailInitiator(mailOptions) {
        this.SMTP_TRANSPORTER.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log('error in sending email', error);
            }
            else {
                console.log('Message sent: ' + info.response);
            }
        });
    }
    async sendMail({ from, mailData, subject, templateName, to, html, }) {
        if (templateName) {
            ejs_1.default.renderFile(path_1.default.join(__dirname, `../../views/${templateName}.ejs`), { data: mailData }, (err, data) => {
                if (err) {
                    console.log('error in rendering the template ', err);
                    return;
                }
                console.log('sending mail');
                this.mailInitiator({
                    from,
                    to,
                    subject,
                    html: data,
                });
                return;
            });
        }
        else {
            this.mailInitiator({ from, to, subject, html });
        }
    }
}
exports.default = SmtpMailService;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic210cC1tYWlsLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3NlcnZpY2VzL3NtdHAtbWFpbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUNBLDREQUFvQztBQUNwQyw4Q0FBc0I7QUFDdEIsZ0RBQXdCO0FBRXhCLG9EQUE0QjtBQUM1QixnQkFBTSxDQUFDLE1BQU0sRUFBRSxDQUFDO0FBRWhCLE1BQU0sZUFBZTtJQUdqQjtRQUNJLElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxvQkFBVSxDQUFDLGVBQWUsQ0FBQztZQUMvQyxJQUFJLEVBQUUsTUFBTSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDO1lBQ25DLElBQUksRUFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLFNBQVM7WUFDM0IsSUFBSSxFQUFFO2dCQUNGLElBQUksRUFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLFNBQVM7Z0JBQzNCLElBQUksRUFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLGFBQWE7YUFDbEM7WUFDRCxLQUFLLEVBQUUsSUFBSTtZQUNYLEdBQUcsRUFBRTtnQkFDRCwrQkFBK0I7Z0JBQy9CLGtCQUFrQixFQUFFLEtBQUs7YUFDNUI7U0FDSixDQUFDLENBQUM7SUFDUCxDQUFDO0lBRU8sYUFBYSxDQUFDLFdBQVc7UUFDN0IsSUFBSSxDQUFDLGdCQUFnQixDQUFDLFFBQVEsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxLQUFVLEVBQUUsSUFBUyxFQUFFLEVBQUU7WUFDbEUsSUFBSSxLQUFLLEVBQUUsQ0FBQztnQkFDUixPQUFPLENBQUMsR0FBRyxDQUFDLHdCQUF3QixFQUFFLEtBQUssQ0FBQyxDQUFDO1lBQ2pELENBQUM7aUJBQU0sQ0FBQztnQkFDSixPQUFPLENBQUMsR0FBRyxDQUFDLGdCQUFnQixHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUNsRCxDQUFDO1FBQ0wsQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDO0lBRU0sS0FBSyxDQUFDLFFBQVEsQ0FBQyxFQUNsQixJQUFJLEVBQ0osUUFBUSxFQUNSLE9BQU8sRUFDUCxZQUFZLEVBQ1osRUFBRSxFQUNGLElBQUksR0FRUDtRQUNHLElBQUksWUFBWSxFQUFFLENBQUM7WUFDZixhQUFHLENBQUMsVUFBVSxDQUNWLGNBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLGVBQWUsWUFBWSxNQUFNLENBQUMsRUFDdkQsRUFBRSxJQUFJLEVBQUUsUUFBUSxFQUFFLEVBQ2xCLENBQUMsR0FBRyxFQUFFLElBQUksRUFBRSxFQUFFO2dCQUNWLElBQUksR0FBRyxFQUFFLENBQUM7b0JBQ04sT0FBTyxDQUFDLEdBQUcsQ0FBQyxrQ0FBa0MsRUFBRSxHQUFHLENBQUMsQ0FBQztvQkFDckQsT0FBTztnQkFDWCxDQUFDO2dCQUNELE9BQU8sQ0FBQyxHQUFHLENBQUMsY0FBYyxDQUFDLENBQUM7Z0JBQzVCLElBQUksQ0FBQyxhQUFhLENBQUM7b0JBQ2YsSUFBSTtvQkFDSixFQUFFO29CQUNGLE9BQU87b0JBQ1AsSUFBSSxFQUFFLElBQUk7aUJBQ2IsQ0FBQyxDQUFDO2dCQUNILE9BQU87WUFDWCxDQUFDLENBQ0osQ0FBQztRQUNOLENBQUM7YUFBTSxDQUFDO1lBQ0osSUFBSSxDQUFDLGFBQWEsQ0FBQyxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUM7UUFDcEQsQ0FBQztJQUNMLENBQUM7Q0FDSjtBQUVELGtCQUFlLGVBQWUsQ0FBQyJ9