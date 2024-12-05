"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.POST = void 0;
const route_handler_1 = require("../../../../../route-handler");
// TODO: We can move this to our service layer to keep our route clean,
//  we already have a service layer to create users this can easily be added there
const POST = async (req, res) => {
    const handler = new route_handler_1.RouteHandler(req, res, 'POST', '/admin/custom/roles/user');
    await handler.handle(async () => {
        const { id, user_id } = req.params;
        const roleService = req.scope.resolve('roleService');
        const role = await roleService.associateUser(id, user_id);
        res.json(role);
    });
};
exports.POST = POST;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvYXBpL2FkbWluL3JvbGVzL1tpZF0vdXNlci9bdXNlcl9pZF0vcm91dGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBRUEsZ0VBQTREO0FBRTVELHVFQUF1RTtBQUN2RSxrRkFBa0Y7QUFDM0UsTUFBTSxJQUFJLEdBQUcsS0FBSyxFQUFFLEdBQWtCLEVBQUUsR0FBbUIsRUFBRSxFQUFFO0lBQ2xFLE1BQU0sT0FBTyxHQUFpQixJQUFJLDRCQUFZLENBQzFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsTUFBTSxFQUFFLDBCQUEwQixDQUMvQyxDQUFDO0lBRUYsTUFBTSxPQUFPLENBQUMsTUFBTSxDQUFDLEtBQUssSUFBSSxFQUFFO1FBQzVCLE1BQU0sRUFBRSxFQUFFLEVBQUUsT0FBTyxFQUFFLEdBQUcsR0FBRyxDQUFDLE1BQU0sQ0FBQztRQUVuQyxNQUFNLFdBQVcsR0FBRyxHQUFHLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQWdCLENBQUM7UUFDcEUsTUFBTSxJQUFJLEdBQUcsTUFBTSxXQUFXLENBQUMsYUFBYSxDQUFDLEVBQUUsRUFBRSxPQUFPLENBQUMsQ0FBQztRQUUxRCxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ25CLENBQUMsQ0FBQyxDQUFDO0FBQ1AsQ0FBQyxDQUFDO0FBYlcsUUFBQSxJQUFJLFFBYWYifQ==