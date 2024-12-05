"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderHistory2749448201588 = void 0;
class OrderHistory2749448201588 {
    async up(queryRunner) {
        await queryRunner.query(`CREATE TABLE "order_history" ( 
            "id" character varying NOT NULL,
            "order_id" character varying NOT NULL,
            "title" character varying,
            "to_status" character varying,
            "to_payment_status" character varying,
            "to_fulfillment_status" character varying,
            "metadata" jsonb NOT NULL,
            "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
            CONSTRAINT "PK_gknsjklsfjsfxobwv1r1dgs912" PRIMARY KEY ("id") )`);
        await queryRunner.query(`ALTER TABLE "order_history" ADD CONSTRAINT "FK_Order_History_Order" FOREIGN KEY ("order_id") REFERENCES "order"("id") ON DELETE SET NULL ON UPDATE CASCADE`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "order_history" DROP CONSTRAINT "FK_Order_History_Order"`);
        await queryRunner.query(`DROP TABLE "order_history"`);
    }
}
exports.OrderHistory2749448201588 = OrderHistory2749448201588;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiMjc0OTQ0ODIwMTU4OC1PcmRlckhpc3RvcnkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvbWlncmF0aW9ucy8yNzQ5NDQ4MjAxNTg4LU9yZGVySGlzdG9yeS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFFQSxNQUFhLHlCQUF5QjtJQUMzQixLQUFLLENBQUMsRUFBRSxDQUFDLFdBQXdCO1FBQ3BDLE1BQU0sV0FBVyxDQUFDLEtBQUssQ0FDbkI7Ozs7Ozs7Ozs0RUFTZ0UsQ0FDbkUsQ0FBQztRQUVGLE1BQU0sV0FBVyxDQUFDLEtBQUssQ0FDbkIsNEpBQTRKLENBQy9KLENBQUM7SUFDTixDQUFDO0lBRU0sS0FBSyxDQUFDLElBQUksQ0FBQyxXQUF3QjtRQUN0QyxNQUFNLFdBQVcsQ0FBQyxLQUFLLENBQ25CLHNFQUFzRSxDQUN6RSxDQUFDO1FBQ0YsTUFBTSxXQUFXLENBQUMsS0FBSyxDQUFDLDRCQUE0QixDQUFDLENBQUM7SUFDMUQsQ0FBQztDQUNKO0FBMUJELDhEQTBCQyJ9