"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserStor1749488828370 = void 0;
class UserStor1749488828370 {
    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "user" ADD store_id VARCHAR NULL`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_User_Store" FOREIGN KEY ("store_id") REFERENCES "store"("id") ON DELETE SET NULL ON UPDATE CASCADE`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_User_Store"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "store_id" `);
    }
}
exports.UserStor1749488828370 = UserStor1749488828370;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiMTc0OTQ4ODgyODM3MC1Vc2VyU3RvcmUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvbWlncmF0aW9ucy8xNzQ5NDg4ODI4MzcwLVVzZXJTdG9yZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFFQSxNQUFhLHFCQUFxQjtJQUN2QixLQUFLLENBQUMsRUFBRSxDQUFDLFdBQXdCO1FBQ3BDLE1BQU0sV0FBVyxDQUFDLEtBQUssQ0FBQyw4Q0FBOEMsQ0FBQyxDQUFDO1FBQ3hFLE1BQU0sV0FBVyxDQUFDLEtBQUssQ0FDbkIsMElBQTBJLENBQzdJLENBQUM7SUFDTixDQUFDO0lBRU0sS0FBSyxDQUFDLElBQUksQ0FBQyxXQUF3QjtRQUN0QyxNQUFNLFdBQVcsQ0FBQyxLQUFLLENBQ25CLG9EQUFvRCxDQUN2RCxDQUFDO1FBQ0YsTUFBTSxXQUFXLENBQUMsS0FBSyxDQUFDLDRDQUE0QyxDQUFDLENBQUM7SUFDMUUsQ0FBQztDQUNKO0FBZEQsc0RBY0MifQ==