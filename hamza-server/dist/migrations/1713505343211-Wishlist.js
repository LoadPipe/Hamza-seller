"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Wishlist1713505343211 = void 0;
class Wishlist1713505343211 {
    async up(queryRunner) {
        // Tables
        await queryRunner.query(`CREATE TABLE "wishlist" ( 
            "id" character varying NOT NULL, 
            "customer_id" character varying, 
            "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), 
            "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), 
            "deleted_at" TIMESTAMP WITH TIME ZONE, 
            CONSTRAINT "PK_gknmp6lnikxobwv1rhv1dgs982" PRIMARY KEY ("id") )`);
        await queryRunner.query(`CREATE TABLE "wishlist_item" ( 
            "id" character varying NOT NULL, 
            "wishlist_id" character varying, 
            "variant_id" character varying, 
            "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
            "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), 
            "deleted_at" TIMESTAMP WITH TIME ZONE, 
             CONSTRAINT "PK_7p8joiapu4u0dxbsatkm5n1qs2" PRIMARY KEY ("wishlist_id", "variant_id") )`);
        // Foreign key constraints
        await queryRunner.query(`ALTER TABLE "wishlist" ADD CONSTRAINT "FK_5ix0u284wt3tmrlpb56ppzmxi7" 
            FOREIGN KEY ("customer_id") REFERENCES "customer"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "wishlist_item" ADD CONSTRAINT "FK_vovw0ddpagwehc13uw0q8lrw2o" 
            FOREIGN KEY ("wishlist_id") REFERENCES "wishlist"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "wishlist_item" ADD CONSTRAINT "FK_1cvf31byyh136a7744qmdt03yh" 
            FOREIGN KEY ("variant_id") REFERENCES "product_variant"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "wishlist" DROP CONSTRAINT "FK_5ix0u284wt3tmrlpb56ppzmxi7"`);
        await queryRunner.query(`ALTER TABLE "wishlist_item" DROP CONSTRAINT "FK_vovw0ddpagwehc13uw0q8lrw2o"`);
        await queryRunner.query(`ALTER TABLE "wishlist_item" DROP CONSTRAINT "FK_1cvf31byyh136a7744qmdt03yh"`);
        await queryRunner.query(`DROP TABLE "wishlist"`);
        await queryRunner.query(`DROP TABLE "wishlist_item"`);
    }
}
exports.Wishlist1713505343211 = Wishlist1713505343211;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiMTcxMzUwNTM0MzIxMS1XaXNobGlzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9taWdyYXRpb25zLzE3MTM1MDUzNDMyMTEtV2lzaGxpc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBRUEsTUFBYSxxQkFBcUI7SUFDdkIsS0FBSyxDQUFDLEVBQUUsQ0FBQyxXQUF3QjtRQUNwQyxTQUFTO1FBQ1QsTUFBTSxXQUFXLENBQUMsS0FBSyxDQUNuQjs7Ozs7OzRFQU1nRSxDQUNuRSxDQUFDO1FBQ0YsTUFBTSxXQUFXLENBQUMsS0FBSyxDQUNuQjs7Ozs7OztvR0FPd0YsQ0FDM0YsQ0FBQztRQUVGLDBCQUEwQjtRQUMxQixNQUFNLFdBQVcsQ0FBQyxLQUFLLENBQ25COzRHQUNnRyxDQUNuRyxDQUFDO1FBQ0YsTUFBTSxXQUFXLENBQUMsS0FBSyxDQUNuQjswR0FDOEYsQ0FDakcsQ0FBQztRQUNGLE1BQU0sV0FBVyxDQUFDLEtBQUssQ0FDbkI7Z0hBQ29HLENBQ3ZHLENBQUM7SUFDTixDQUFDO0lBRU0sS0FBSyxDQUFDLElBQUksQ0FBQyxXQUF3QjtRQUN0QyxNQUFNLFdBQVcsQ0FBQyxLQUFLLENBQ25CLHdFQUF3RSxDQUMzRSxDQUFDO1FBQ0YsTUFBTSxXQUFXLENBQUMsS0FBSyxDQUNuQiw2RUFBNkUsQ0FDaEYsQ0FBQztRQUNGLE1BQU0sV0FBVyxDQUFDLEtBQUssQ0FDbkIsNkVBQTZFLENBQ2hGLENBQUM7UUFDRixNQUFNLFdBQVcsQ0FBQyxLQUFLLENBQUMsdUJBQXVCLENBQUMsQ0FBQztRQUNqRCxNQUFNLFdBQVcsQ0FBQyxLQUFLLENBQUMsNEJBQTRCLENBQUMsQ0FBQztJQUMxRCxDQUFDO0NBQ0o7QUFuREQsc0RBbURDIn0=