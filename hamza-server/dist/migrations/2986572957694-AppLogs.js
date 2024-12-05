"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppLogs2986572957694 = void 0;
class AppLogs2986572957694 {
    async up(queryRunner) {
        await queryRunner.query(`CREATE TABLE "app_log" ( 
            "id" character varying NOT NULL,
            "session_id" character varying,
            "request_id" character varying,
            "customer_id" character varying,
            "log_level" character varying,
            "text" character varying,
            "content" character varying,
            "timestamp" int,
            "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
            "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
            "deleted_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
            CONSTRAINT "PK_gknmp6lnikxobwv1rhv1dgs912" PRIMARY KEY ("id") )`);
    }
    async down(queryRunner) {
        await queryRunner.query(`DROP TABLE "app_log"`);
    }
}
exports.AppLogs2986572957694 = AppLogs2986572957694;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiMjk4NjU3Mjk1NzY5NC1BcHBMb2dzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL21pZ3JhdGlvbnMvMjk4NjU3Mjk1NzY5NC1BcHBMb2dzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUVBLE1BQWEsb0JBQW9CO0lBQ3RCLEtBQUssQ0FBQyxFQUFFLENBQUMsV0FBd0I7UUFDcEMsTUFBTSxXQUFXLENBQUMsS0FBSyxDQUNuQjs7Ozs7Ozs7Ozs7OzRFQVlnRSxDQUNuRSxDQUFDO0lBQ04sQ0FBQztJQUVNLEtBQUssQ0FBQyxJQUFJLENBQUMsV0FBd0I7UUFDdEMsTUFBTSxXQUFXLENBQUMsS0FBSyxDQUNuQixzQkFBc0IsQ0FDekIsQ0FBQztJQUNOLENBQUM7Q0FDSjtBQXhCRCxvREF3QkMifQ==