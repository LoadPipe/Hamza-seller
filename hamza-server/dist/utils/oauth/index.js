"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.redirectToOauthLandingPage = redirectToOauthLandingPage;
function redirectToOauthLandingPage(res, type, verify = true, errorMessage) {
    let redirectUrl = `http://localhost:8000/account/verify?type=${type}&verify=${verify ? 'true' : 'false'}`;
    if (errorMessage === null || errorMessage === void 0 ? void 0 : errorMessage.length)
        redirectUrl += `&message=${errorMessage}`;
    return res.redirect(redirectUrl);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvdXRpbHMvb2F1dGgvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFFQSxnRUFXQztBQVhELFNBQWdCLDBCQUEwQixDQUN0QyxHQUFtQixFQUNuQixJQUFzQyxFQUN0QyxTQUFrQixJQUFJLEVBQ3RCLFlBQXFCO0lBRXJCLElBQUksV0FBVyxHQUFHLDZDQUE2QyxJQUFJLFdBQVcsTUFBTSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFDO0lBRTFHLElBQUksWUFBWSxhQUFaLFlBQVksdUJBQVosWUFBWSxDQUFFLE1BQU07UUFBRSxXQUFXLElBQUksWUFBWSxZQUFZLEVBQUUsQ0FBQztJQUVwRSxPQUFPLEdBQUcsQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDLENBQUM7QUFDckMsQ0FBQyJ9