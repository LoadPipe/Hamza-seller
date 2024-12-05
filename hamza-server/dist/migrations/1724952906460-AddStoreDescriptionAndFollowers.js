"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddStoreDescriptionAndFollowers1724952906460 = void 0;
class AddStoreDescriptionAndFollowers1724952906460 {
    async up(queryRunner) {
        await queryRunner.query(`
            ALTER TABLE "store"
            ADD COLUMN IF NOT EXISTS "store_description" varchar;
        `);
        await queryRunner.query(`
            ALTER TABLE "store"
            ADD COLUMN IF NOT EXISTS "store_followers" integer; 
        `);
    }
    async down(queryRunner) {
        await queryRunner.query(`
            ALTER TABLE "store"
                DROP COLUMN "store_description"
        `);
        await queryRunner.query(`
            ALTER TABLE "store"
                DROP COLUMN "store_followers"
        `);
    }
}
exports.AddStoreDescriptionAndFollowers1724952906460 = AddStoreDescriptionAndFollowers1724952906460;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiMTcyNDk1MjkwNjQ2MC1BZGRTdG9yZURlc2NyaXB0aW9uQW5kRm9sbG93ZXJzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL21pZ3JhdGlvbnMvMTcyNDk1MjkwNjQ2MC1BZGRTdG9yZURlc2NyaXB0aW9uQW5kRm9sbG93ZXJzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUVBLE1BQWEsNENBQTRDO0lBRzlDLEtBQUssQ0FBQyxFQUFFLENBQUMsV0FBd0I7UUFDcEMsTUFBTSxXQUFXLENBQUMsS0FBSyxDQUFDOzs7U0FHdkIsQ0FBQyxDQUFDO1FBQ0gsTUFBTSxXQUFXLENBQUMsS0FBSyxDQUFDOzs7U0FHdkIsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztJQUVNLEtBQUssQ0FBQyxJQUFJLENBQUMsV0FBd0I7UUFDdEMsTUFBTSxXQUFXLENBQUMsS0FBSyxDQUFDOzs7U0FHdkIsQ0FBQyxDQUFDO1FBQ0gsTUFBTSxXQUFXLENBQUMsS0FBSyxDQUFDOzs7U0FHdkIsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztDQUNKO0FBeEJELG9HQXdCQyJ9