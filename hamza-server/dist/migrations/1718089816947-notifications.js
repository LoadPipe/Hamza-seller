"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Notifications1718089816947 = void 0;
class Notifications1718089816947 {
    async up(queryRunner) {
        // Create customer_notification table
        await queryRunner.query(`
            CREATE TABLE "customer_notification"
            (
                "id"                varchar                  NOT NULL,
                "customer_id"       varchar                  NOT NULL,
                "notification_type" varchar                  NOT NULL,
                "created_at"        TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "updated_at"        TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "deleted_at"        TIMESTAMP WITH TIME ZONE,
                CONSTRAINT "PK_customer_notifications_id" PRIMARY KEY ("id"),
                CONSTRAINT "FK_customer_notifications_customer_id" FOREIGN KEY ("customer_id") REFERENCES "customer" ("id") ON DELETE CASCADE
            )
        `);
    }
    async down(queryRunner) {
        await queryRunner.query(`DROP TABLE "customer_notification"`);
    }
}
exports.Notifications1718089816947 = Notifications1718089816947;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiMTcxODA4OTgxNjk0Ny1ub3RpZmljYXRpb25zLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL21pZ3JhdGlvbnMvMTcxODA4OTgxNjk0Ny1ub3RpZmljYXRpb25zLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUVBLE1BQWEsMEJBQTBCO0lBQzVCLEtBQUssQ0FBQyxFQUFFLENBQUMsV0FBd0I7UUFDcEMscUNBQXFDO1FBQ3JDLE1BQU0sV0FBVyxDQUFDLEtBQUssQ0FBQzs7Ozs7Ozs7Ozs7O1NBWXZCLENBQUMsQ0FBQztJQUNQLENBQUM7SUFFTSxLQUFLLENBQUMsSUFBSSxDQUFDLFdBQXdCO1FBQ3RDLE1BQU0sV0FBVyxDQUFDLEtBQUssQ0FBQyxvQ0FBb0MsQ0FBQyxDQUFDO0lBQ2xFLENBQUM7Q0FDSjtBQXJCRCxnRUFxQkMifQ==