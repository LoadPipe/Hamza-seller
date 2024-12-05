"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddRolesAndPermissions1713535831474 = void 0;
class AddRolesAndPermissions1713535831474 {
    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "user" ADD "role_id" character varying`);
        await queryRunner.query(`CREATE TABLE "permission" ("id" character varying NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "name" character varying NOT NULL, "metadata" jsonb, CONSTRAINT "PK_3b8b97af9d9d8807e41e6f48362" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "role" ("id" character varying NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "name" character varying NOT NULL, "store_id" character varying, CONSTRAINT "PK_b36bcfe02fc8de3c57a8b2391c2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_29259dd58b1052aef9be56941d" ON "role" ("store_id") `);
        await queryRunner.query(`CREATE TABLE "role_permissions" ("role_id" character varying NOT NULL, "permission_id" character varying NOT NULL, CONSTRAINT "PK_25d24010f53bb80b78e412c9656" PRIMARY KEY ("role_id", "permission_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_178199805b901ccd220ab7740e" ON "role_permissions" ("role_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_17022daf3f885f7d35423e9971" ON "role_permissions" ("permission_id") `);
        await queryRunner.query(`ALTER TABLE "role_permissions" ADD CONSTRAINT "FK_178199805b901ccd220ab7740ec" FOREIGN KEY ("role_id") REFERENCES "role"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "role_permissions" ADD CONSTRAINT "FK_17022daf3f885f7d35423e9971e" FOREIGN KEY ("permission_id") REFERENCES "permission"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_fb2e442d14add3cefbdf33c4561" FOREIGN KEY ("role_id") REFERENCES "role"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "role" ADD CONSTRAINT "FK_29259dd58b1052aef9be56941d4" FOREIGN KEY ("store_id") REFERENCES "store"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`CREATE INDEX "IDX_fb2e442d14add3cefbdf33c456" ON "user" ("role_id") `);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "role_permissions" DROP CONSTRAINT "FK_17022daf3f885f7d35423e9971e"`);
        await queryRunner.query(`ALTER TABLE "role_permissions" DROP CONSTRAINT "FK_178199805b901ccd220ab7740ec"`);
        await queryRunner.query(`ALTER TABLE "role" DROP CONSTRAINT "FK_29259dd58b1052aef9be56941d4"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_fb2e442d14add3cefbdf33c456"`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_fb2e442d14add3cefbdf33c4561"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "role_id"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_17022daf3f885f7d35423e9971"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_178199805b901ccd220ab7740e"`);
        await queryRunner.query(`DROP TABLE "role_permissions"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_29259dd58b1052aef9be56941d"`);
        await queryRunner.query(`DROP TABLE "role"`);
        await queryRunner.query(`DROP TABLE "permission"`);
    }
}
exports.AddRolesAndPermissions1713535831474 = AddRolesAndPermissions1713535831474;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiMTcxMzUzNTgzMTQ3NC1BZGRSb2xlc0FuZFBlcm1pc3Npb25zLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL21pZ3JhdGlvbnMvMTcxMzUzNTgzMTQ3NC1BZGRSb2xlc0FuZFBlcm1pc3Npb25zLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUVBLE1BQWEsbUNBQW1DO0lBQ3JDLEtBQUssQ0FBQyxFQUFFLENBQUMsV0FBd0I7UUFDcEMsTUFBTSxXQUFXLENBQUMsS0FBSyxDQUNuQixvREFBb0QsQ0FDdkQsQ0FBQztRQUNGLE1BQU0sV0FBVyxDQUFDLEtBQUssQ0FDbkIsOFNBQThTLENBQ2pULENBQUM7UUFDRixNQUFNLFdBQVcsQ0FBQyxLQUFLLENBQ25CLG9UQUFvVCxDQUN2VCxDQUFDO1FBQ0YsTUFBTSxXQUFXLENBQUMsS0FBSyxDQUNuQix1RUFBdUUsQ0FDMUUsQ0FBQztRQUNGLE1BQU0sV0FBVyxDQUFDLEtBQUssQ0FDbkIsME1BQTBNLENBQzdNLENBQUM7UUFDRixNQUFNLFdBQVcsQ0FBQyxLQUFLLENBQ25CLGtGQUFrRixDQUNyRixDQUFDO1FBQ0YsTUFBTSxXQUFXLENBQUMsS0FBSyxDQUNuQix3RkFBd0YsQ0FDM0YsQ0FBQztRQUVGLE1BQU0sV0FBVyxDQUFDLEtBQUssQ0FDbkIsb0tBQW9LLENBQ3ZLLENBQUM7UUFDRixNQUFNLFdBQVcsQ0FBQyxLQUFLLENBQ25CLGdMQUFnTCxDQUNuTCxDQUFDO1FBQ0YsTUFBTSxXQUFXLENBQUMsS0FBSyxDQUNuQiw0SkFBNEosQ0FDL0osQ0FBQztRQUNGLE1BQU0sV0FBVyxDQUFDLEtBQUssQ0FDbkIsOEpBQThKLENBQ2pLLENBQUM7UUFDRixNQUFNLFdBQVcsQ0FBQyxLQUFLLENBQ25CLHNFQUFzRSxDQUN6RSxDQUFDO0lBQ04sQ0FBQztJQUVNLEtBQUssQ0FBQyxJQUFJLENBQUMsV0FBd0I7UUFDdEMsTUFBTSxXQUFXLENBQUMsS0FBSyxDQUNuQixpRkFBaUYsQ0FDcEYsQ0FBQztRQUNGLE1BQU0sV0FBVyxDQUFDLEtBQUssQ0FDbkIsaUZBQWlGLENBQ3BGLENBQUM7UUFDRixNQUFNLFdBQVcsQ0FBQyxLQUFLLENBQ25CLHFFQUFxRSxDQUN4RSxDQUFDO1FBQ0YsTUFBTSxXQUFXLENBQUMsS0FBSyxDQUNuQixzREFBc0QsQ0FDekQsQ0FBQztRQUNGLE1BQU0sV0FBVyxDQUFDLEtBQUssQ0FDbkIscUVBQXFFLENBQ3hFLENBQUM7UUFDRixNQUFNLFdBQVcsQ0FBQyxLQUFLLENBQUMsMENBQTBDLENBQUMsQ0FBQztRQUNwRSxNQUFNLFdBQVcsQ0FBQyxLQUFLLENBQ25CLHNEQUFzRCxDQUN6RCxDQUFDO1FBQ0YsTUFBTSxXQUFXLENBQUMsS0FBSyxDQUNuQixzREFBc0QsQ0FDekQsQ0FBQztRQUNGLE1BQU0sV0FBVyxDQUFDLEtBQUssQ0FBQywrQkFBK0IsQ0FBQyxDQUFDO1FBQ3pELE1BQU0sV0FBVyxDQUFDLEtBQUssQ0FDbkIsc0RBQXNELENBQ3pELENBQUM7UUFDRixNQUFNLFdBQVcsQ0FBQyxLQUFLLENBQUMsbUJBQW1CLENBQUMsQ0FBQztRQUM3QyxNQUFNLFdBQVcsQ0FBQyxLQUFLLENBQUMseUJBQXlCLENBQUMsQ0FBQztJQUN2RCxDQUFDO0NBQ0o7QUF2RUQsa0ZBdUVDIn0=