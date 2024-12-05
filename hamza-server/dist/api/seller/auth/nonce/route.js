"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GET = void 0;
const siwe_1 = require("siwe");
const route_handler_1 = require("../../../route-handler");
const GET = async (req, res) => {
    const handler = new route_handler_1.RouteHandler(req, res, 'GET', '/seller/auth/nonce');
    await handler.handle(async () => {
        const nonce = (0, siwe_1.generateNonce)();
        req.session.nonce = nonce;
        await req.session.save();
        handler.returnStatus(200, { nonce: req.session.nonce });
    });
};
exports.GET = GET;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9zcmMvYXBpL3NlbGxlci9hdXRoL25vbmNlL3JvdXRlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLCtCQUFxQztBQUVyQywwREFBc0Q7QUFFL0MsTUFBTSxHQUFHLEdBQUcsS0FBSyxFQUFFLEdBQWtCLEVBQUUsR0FBbUIsRUFBRSxFQUFFO0lBQ2pFLE1BQU0sT0FBTyxHQUFpQixJQUFJLDRCQUFZLENBQzFDLEdBQUcsRUFDSCxHQUFHLEVBQ0gsS0FBSyxFQUNMLG9CQUFvQixDQUN2QixDQUFDO0lBRUYsTUFBTSxPQUFPLENBQUMsTUFBTSxDQUFDLEtBQUssSUFBSSxFQUFFO1FBQzVCLE1BQU0sS0FBSyxHQUFHLElBQUEsb0JBQWEsR0FBRSxDQUFDO1FBQzlCLEdBQUcsQ0FBQyxPQUFPLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztRQUMxQixNQUFNLEdBQUcsQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDekIsT0FBTyxDQUFDLFlBQVksQ0FBQyxHQUFHLEVBQUUsRUFBRSxLQUFLLEVBQUUsR0FBRyxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDO0lBQzVELENBQUMsQ0FBQyxDQUFDO0FBQ1AsQ0FBQyxDQUFDO0FBZFcsUUFBQSxHQUFHLE9BY2QifQ==