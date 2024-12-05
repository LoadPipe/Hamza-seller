"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const route_1 = require("../../api/admin/custom/route");
describe('/custom', () => {
    it('responds to GET with 200 status', async () => {
        // Correctly mocking the sendStatus method
        const sendStatusMock = jest.fn();
        const req = { method: 'GET' }; // Mock request object
        const res = { sendStatus: sendStatusMock }; // Correct mock response object
        await (0, route_1.GET)(req, res);
        // Verify that sendStatus was called with 200
        expect(sendStatusMock).toHaveBeenCalledWith(200);
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGUudGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy90ZXN0L19fdGVzdHNfXy9yb3V0ZS50ZXN0LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsd0RBQW1EO0FBRW5ELFFBQVEsQ0FBQyxTQUFTLEVBQUUsR0FBRyxFQUFFO0lBQ3JCLEVBQUUsQ0FBQyxpQ0FBaUMsRUFBRSxLQUFLLElBQUksRUFBRTtRQUM3QywwQ0FBMEM7UUFDMUMsTUFBTSxjQUFjLEdBQUcsSUFBSSxDQUFDLEVBQUUsRUFBRSxDQUFDO1FBRWpDLE1BQU0sR0FBRyxHQUFHLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBRSxDQUFDLENBQUMsc0JBQXNCO1FBQ3JELE1BQU0sR0FBRyxHQUFHLEVBQUUsVUFBVSxFQUFFLGNBQWMsRUFBRSxDQUFDLENBQUMsK0JBQStCO1FBRTNFLE1BQU0sSUFBQSxXQUFHLEVBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDO1FBRXBCLDZDQUE2QztRQUM3QyxNQUFNLENBQUMsY0FBYyxDQUFDLENBQUMsb0JBQW9CLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDckQsQ0FBQyxDQUFDLENBQUM7QUFDUCxDQUFDLENBQUMsQ0FBQyJ9