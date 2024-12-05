"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StoreIcons1718007439614 = void 0;
class StoreIcons1718007439614 {
    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "store" ADD "icon" character varying`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "store" DROP COLUMN "icon"`);
    }
}
exports.StoreIcons1718007439614 = StoreIcons1718007439614;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiMTcxODAwNzQzOTYxNC1zdG9yZS1pY29ucy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9taWdyYXRpb25zLzE3MTgwMDc0Mzk2MTQtc3RvcmUtaWNvbnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBRUEsTUFBYSx1QkFBdUI7SUFDekIsS0FBSyxDQUFDLEVBQUUsQ0FBQyxXQUF3QjtRQUNwQyxNQUFNLFdBQVcsQ0FBQyxLQUFLLENBQ25CLGtEQUFrRCxDQUNyRCxDQUFDO0lBQ04sQ0FBQztJQUVNLEtBQUssQ0FBQyxJQUFJLENBQUMsV0FBd0I7UUFDdEMsTUFBTSxXQUFXLENBQUMsS0FBSyxDQUFDLHdDQUF3QyxDQUFDLENBQUM7SUFDdEUsQ0FBQztDQUNKO0FBVkQsMERBVUMifQ==