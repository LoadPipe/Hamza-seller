"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddStoreOwnerId1681287255173 = void 0;
class AddStoreOwnerId1681287255173 {
    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "store" ADD "owner_id" character varying`);
        await queryRunner.query(`ALTER TABLE "store" ADD CONSTRAINT "UQ_Store_Owner" UNIQUE ("owner_id")`);
        await queryRunner.query(`ALTER TABLE "store" ADD CONSTRAINT "FK_Store_Owner" FOREIGN KEY ("owner_id") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "store" ADD CONSTRAINT name_unique UNIQUE (name)`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "store" DROP CONSTRAINT "FK_Store_Owner"`);
        await queryRunner.query(`ALTER TABLE "store" DROP CONSTRAINT "UQ_Store_Owner"`);
        await queryRunner.query(`ALTER TABLE "store" DROP COLUMN "owner_id"`);
        await queryRunner.query(`ALTER TABLE "store" DROP CONSTRAINT name_unique`);
    }
}
exports.AddStoreOwnerId1681287255173 = AddStoreOwnerId1681287255173;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiMTcwOTE5MTQ1ODYxNS1Vc2VyYW5kU3RvcmUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvbWlncmF0aW9ucy8xNzA5MTkxNDU4NjE1LVVzZXJhbmRTdG9yZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFFQSxNQUFhLDRCQUE0QjtJQUM5QixLQUFLLENBQUMsRUFBRSxDQUFDLFdBQXdCO1FBQ3BDLE1BQU0sV0FBVyxDQUFDLEtBQUssQ0FDbkIsc0RBQXNELENBQ3pELENBQUM7UUFDRixNQUFNLFdBQVcsQ0FBQyxLQUFLLENBQ25CLHlFQUF5RSxDQUM1RSxDQUFDO1FBQ0YsTUFBTSxXQUFXLENBQUMsS0FBSyxDQUNuQiwySUFBMkksQ0FDOUksQ0FBQztRQUVGLE1BQU0sV0FBVyxDQUFDLEtBQUssQ0FDbkIsOERBQThELENBQ2pFLENBQUM7SUFDTixDQUFDO0lBRU0sS0FBSyxDQUFDLElBQUksQ0FBQyxXQUF3QjtRQUN0QyxNQUFNLFdBQVcsQ0FBQyxLQUFLLENBQ25CLHNEQUFzRCxDQUN6RCxDQUFDO1FBQ0YsTUFBTSxXQUFXLENBQUMsS0FBSyxDQUNuQixzREFBc0QsQ0FDekQsQ0FBQztRQUNGLE1BQU0sV0FBVyxDQUFDLEtBQUssQ0FBQyw0Q0FBNEMsQ0FBQyxDQUFDO1FBRXRFLE1BQU0sV0FBVyxDQUFDLEtBQUssQ0FDbkIsaURBQWlELENBQ3BELENBQUM7SUFDTixDQUFDO0NBQ0o7QUE5QkQsb0VBOEJDIn0=