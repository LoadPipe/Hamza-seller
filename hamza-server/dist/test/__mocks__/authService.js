"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class AuthService {
    async authenticate(email, password) {
        console.log('Mock authenticate called');
        if (email === 'admin@medusa-test.com' && password === 'supersecret') {
            return {
                role_id: null,
                wallet_address: '0x84318B362Cf6a7DBc46655bF66dF3B5e2a17eb9A',
                id: 'usr_01J20RCEG32K0ZE7Q5E4YM60WB',
                created_at: '2024-07-05T06:12:55.914Z',
                updated_at: '2024-07-05T06:12:55.914Z',
                deleted_at: null,
                role: 'admin',
                email: 'admin@medusa-test.com',
                first_name: null,
                last_name: null,
                api_token: null,
                metadata: null,
            };
        }
        else {
            throw new Error('Invalid credentials');
        }
    }
}
exports.default = AuthService;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXV0aFNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvdGVzdC9fX21vY2tzX18vYXV0aFNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxNQUFNLFdBQVc7SUFDTixLQUFLLENBQUMsWUFBWSxDQUFDLEtBQWEsRUFBRSxRQUFnQjtRQUNyRCxPQUFPLENBQUMsR0FBRyxDQUFDLDBCQUEwQixDQUFDLENBQUM7UUFDeEMsSUFBSSxLQUFLLEtBQUssdUJBQXVCLElBQUksUUFBUSxLQUFLLGFBQWEsRUFBRSxDQUFDO1lBQ2xFLE9BQU87Z0JBQ0gsT0FBTyxFQUFFLElBQUk7Z0JBQ2IsY0FBYyxFQUFFLDRDQUE0QztnQkFDNUQsRUFBRSxFQUFFLGdDQUFnQztnQkFDcEMsVUFBVSxFQUFFLDBCQUEwQjtnQkFDdEMsVUFBVSxFQUFFLDBCQUEwQjtnQkFDdEMsVUFBVSxFQUFFLElBQUk7Z0JBQ2hCLElBQUksRUFBRSxPQUFPO2dCQUNiLEtBQUssRUFBRSx1QkFBdUI7Z0JBQzlCLFVBQVUsRUFBRSxJQUFJO2dCQUNoQixTQUFTLEVBQUUsSUFBSTtnQkFDZixTQUFTLEVBQUUsSUFBSTtnQkFDZixRQUFRLEVBQUUsSUFBSTthQUNqQixDQUFDO1FBQ04sQ0FBQzthQUFNLENBQUM7WUFDSixNQUFNLElBQUksS0FBSyxDQUFDLHFCQUFxQixDQUFDLENBQUM7UUFDM0MsQ0FBQztJQUNMLENBQUM7Q0FDSjtBQUVELGtCQUFlLFdBQVcsQ0FBQyJ9