"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomerWalletAddress1714540309785 = void 0;
const typeorm_1 = require("typeorm");
class CustomerWalletAddress1714540309785 {
    constructor() {
        this.name = "CustomerWalletAddress1714540309785";
    }
    async up(queryRunner) {
        await queryRunner.createTable(new typeorm_1.Table({
            name: 'customer_wallet_address',
            columns: [
                {
                    name: 'wallet_address',
                    type: 'varchar',
                    isPrimary: true
                },
                {
                    name: 'customer_id',
                    type: 'varchar',
                    isNullable: true
                }
            ],
            foreignKeys: [
                {
                    columnNames: ['customer_id'],
                    referencedTableName: 'customer',
                    referencedColumnNames: ['id'],
                    onDelete: 'SET NULL'
                }
            ]
        }), true);
    }
    async down(queryRunner) {
        await queryRunner.dropTable('customer_wallet_address');
    }
}
exports.CustomerWalletAddress1714540309785 = CustomerWalletAddress1714540309785;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiMTcxNDU0MDMwOTc4NS1DdXN0b21lcldhbGxldEFkZHJlc3MuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvbWlncmF0aW9ucy8xNzE0NTQwMzA5Nzg1LUN1c3RvbWVyV2FsbGV0QWRkcmVzcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxxQ0FBaUU7QUFFakUsTUFBYSxrQ0FBa0M7SUFBL0M7UUFDSSxTQUFJLEdBQUcsb0NBQW9DLENBQUM7SUErQmhELENBQUM7SUE5QlUsS0FBSyxDQUFDLEVBQUUsQ0FBQyxXQUF3QjtRQUNwQyxNQUFNLFdBQVcsQ0FBQyxXQUFXLENBQUMsSUFBSSxlQUFLLENBQUM7WUFDcEMsSUFBSSxFQUFFLHlCQUF5QjtZQUMvQixPQUFPLEVBQUU7Z0JBQ0w7b0JBQ0ksSUFBSSxFQUFFLGdCQUFnQjtvQkFDdEIsSUFBSSxFQUFFLFNBQVM7b0JBQ2YsU0FBUyxFQUFFLElBQUk7aUJBQ2xCO2dCQUNEO29CQUNJLElBQUksRUFBRSxhQUFhO29CQUNuQixJQUFJLEVBQUUsU0FBUztvQkFDZixVQUFVLEVBQUUsSUFBSTtpQkFDbkI7YUFDSjtZQUNELFdBQVcsRUFBRTtnQkFDVDtvQkFDSSxXQUFXLEVBQUUsQ0FBQyxhQUFhLENBQUM7b0JBQzVCLG1CQUFtQixFQUFFLFVBQVU7b0JBQy9CLHFCQUFxQixFQUFFLENBQUMsSUFBSSxDQUFDO29CQUM3QixRQUFRLEVBQUUsVUFBVTtpQkFDdkI7YUFDSjtTQUNKLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQztJQUVkLENBQUM7SUFFTSxLQUFLLENBQUMsSUFBSSxDQUFDLFdBQXdCO1FBQ3RDLE1BQU0sV0FBVyxDQUFDLFNBQVMsQ0FBQyx5QkFBeUIsQ0FBQyxDQUFDO0lBQzNELENBQUM7Q0FDSjtBQWhDRCxnRkFnQ0MifQ==