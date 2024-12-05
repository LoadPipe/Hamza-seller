"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
exports.default = customerVerifiedHandler;
async function customerVerifiedHandler({ data, eventName, container, }) {
    let smtpMailService = container.resolve('smtpMailService');
    //TODO: parameterize this with (a) the support email addr and (b) the URL of Hamza
    await smtpMailService.sendMail({
        from: process.env.SMTP_FROM,
        subject: 'Email Verified',
        templateName: 'verify-confirmation',
        to: data.email,
        mailData: {},
    });
    return;
    // Do something with the order
}
exports.config = {
    event: 'customer.verified',
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3VzdG9tZXItdmVyaWZpZWQtY29uZmlybWF0aW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3N1YnNjcmliZXJzL2N1c3RvbWVyLXZlcmlmaWVkLWNvbmZpcm1hdGlvbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFFQSwwQ0FpQkM7QUFqQmMsS0FBSyxVQUFVLHVCQUF1QixDQUFDLEVBQ2xELElBQUksRUFDSixTQUFTLEVBQ1QsU0FBUyxHQUN1QjtJQUNoQyxJQUFJLGVBQWUsR0FBRyxTQUFTLENBQUMsT0FBTyxDQUFDLGlCQUFpQixDQUFDLENBQUM7SUFFM0Qsa0ZBQWtGO0lBQ2xGLE1BQU0sZUFBZSxDQUFDLFFBQVEsQ0FBQztRQUMzQixJQUFJLEVBQUUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxTQUFTO1FBQzNCLE9BQU8sRUFBRSxnQkFBZ0I7UUFDekIsWUFBWSxFQUFFLHFCQUFxQjtRQUNuQyxFQUFFLEVBQUUsSUFBSSxDQUFDLEtBQUs7UUFDZCxRQUFRLEVBQUUsRUFBRTtLQUNmLENBQUMsQ0FBQztJQUNILE9BQU87SUFDUCw4QkFBOEI7QUFDbEMsQ0FBQztBQUVZLFFBQUEsTUFBTSxHQUFxQjtJQUNwQyxLQUFLLEVBQUUsbUJBQW1CO0NBQzdCLENBQUMifQ==