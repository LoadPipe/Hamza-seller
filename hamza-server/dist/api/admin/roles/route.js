"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.POST = void 0;
const route_handler_1 = require("../../route-handler");
const POST = async (req, res) => {
    const roleService = req.scope.resolve('roleService');
    // omitting validation for simplicity
    const handler = new route_handler_1.RouteHandler(req, res, 'POST', '/admin/custom/roles', ['name', 'store_id', 'permissions']);
    await handler.handle(async () => {
        const { name, store_id, permissions } = handler.inputParams;
        const role = await roleService.create({
            name,
            store_id,
            permissions,
        });
        res.json(role);
    });
};
exports.POST = POST;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvYXBpL2FkbWluL3JvbGVzL3JvdXRlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUdBLHVEQUFtRDtBQUU1QyxNQUFNLElBQUksR0FBRyxLQUFLLEVBQUUsR0FBa0IsRUFBRSxHQUFtQixFQUFFLEVBQUU7SUFDbEUsTUFBTSxXQUFXLEdBQUcsR0FBRyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFnQixDQUFDO0lBRXBFLHFDQUFxQztJQUNyQyxNQUFNLE9BQU8sR0FBaUIsSUFBSSw0QkFBWSxDQUMxQyxHQUFHLEVBQUUsR0FBRyxFQUFFLE1BQU0sRUFBRSxxQkFBcUIsRUFBRSxDQUFDLE1BQU0sRUFBRSxVQUFVLEVBQUUsYUFBYSxDQUFDLENBQy9FLENBQUM7SUFFRixNQUFNLE9BQU8sQ0FBQyxNQUFNLENBQUMsS0FBSyxJQUFJLEVBQUU7UUFDNUIsTUFBTSxFQUFFLElBQUksRUFBRSxRQUFRLEVBQUUsV0FBVyxFQUFFLEdBQUcsT0FBTyxDQUFDLFdBQVcsQ0FBQztRQUU1RCxNQUFNLElBQUksR0FBRyxNQUFNLFdBQVcsQ0FBQyxNQUFNLENBQUM7WUFDbEMsSUFBSTtZQUNKLFFBQVE7WUFDUixXQUFXO1NBQ2QsQ0FBQyxDQUFDO1FBRUgsR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUNuQixDQUFDLENBQUMsQ0FBQztBQUNQLENBQUMsQ0FBQztBQW5CVyxRQUFBLElBQUksUUFtQmYifQ==