"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DELETE = void 0;
const route_handler_1 = require("../../../route-handler");
/**
 * DELETE /admin/custom/logs
 *
 * Purge old logs (older than a specific number of seconds) from the app_logs table.
 *
 * Query Parameters:
 * - `seconds` (number): Optional number of seconds - any logs older than this number of seconds from the
 * current date are to be purged
 *
 * Response:
 * - Returns a 200 on success
 * - Returns 500 on failure of any kind
 */
const DELETE = async (req, res) => {
    const appLogRepository = req.scope.resolve('appLogRepository');
    const handler = new route_handler_1.RouteHandler(req, res, 'DELETE', '/admin/custom/logs');
    const getUnixTimestamp = () => {
        return Math.floor(Date.now() / 1000);
    };
    await handler.handle(async () => {
        const seconds = handler.hasParam('seconds') ?
            parseInt(handler.inputParams.seconds) :
            (60 * 60 * 24);
        await appLogRepository
            .createQueryBuilder()
            .delete()
            .where('timestamp < :timestamp', {
            timestamp: getUnixTimestamp() - seconds
        })
            .execute();
        return res.json({ ok: 'true' });
    });
};
exports.DELETE = DELETE;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9zcmMvYXBpL2FkbWluL2N1c3RvbS9sb2dzL3JvdXRlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUNBLDBEQUFzRDtBQUd0RDs7Ozs7Ozs7Ozs7O0dBWUc7QUFDSSxNQUFNLE1BQU0sR0FBRyxLQUFLLEVBQUUsR0FBa0IsRUFBRSxHQUFtQixFQUFFLEVBQUU7SUFDcEUsTUFBTSxnQkFBZ0IsR0FBNEIsR0FBRyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsa0JBQWtCLENBQUMsQ0FBQztJQUV4RixNQUFNLE9BQU8sR0FBaUIsSUFBSSw0QkFBWSxDQUMxQyxHQUFHLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRSxvQkFBb0IsQ0FDM0MsQ0FBQztJQUVGLE1BQU0sZ0JBQWdCLEdBQUcsR0FBRyxFQUFFO1FBQzFCLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLEdBQUcsSUFBSSxDQUFDLENBQUM7SUFDekMsQ0FBQyxDQUFBO0lBRUQsTUFBTSxPQUFPLENBQUMsTUFBTSxDQUFDLEtBQUssSUFBSSxFQUFFO1FBRTVCLE1BQU0sT0FBTyxHQUFHLE9BQU8sQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQztZQUN6QyxRQUFRLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO1lBQ3ZDLENBQUMsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQTtRQUVsQixNQUFNLGdCQUFnQjthQUNqQixrQkFBa0IsRUFBRTthQUNwQixNQUFNLEVBQUU7YUFDUixLQUFLLENBQUMsd0JBQXdCLEVBQUU7WUFDN0IsU0FBUyxFQUFFLGdCQUFnQixFQUFFLEdBQUcsT0FBTztTQUMxQyxDQUFDO2FBQ0QsT0FBTyxFQUFFLENBQUE7UUFFZCxPQUFPLEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBRSxFQUFFLEVBQUUsTUFBTSxFQUFFLENBQUMsQ0FBQztJQUNwQyxDQUFDLENBQUMsQ0FBQztBQUNQLENBQUMsQ0FBQztBQTNCVyxRQUFBLE1BQU0sVUEyQmpCIn0=