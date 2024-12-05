"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BuckyLogs1725491792885 = void 0;
class BuckyLogs1725491792885 {
    async up(queryRunner) {
        await queryRunner.query(`CREATE TABLE "bucky_logs"(
                "id" character varying NOT NULL,
                "endpoint" character varying NOT NULL,
                "input" jsonb,
                "output" jsonb,
                "context" jsonb, 
                "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "deleted_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                CONSTRAINT "PK_okumu5lnikxobwv1rhv1dgs912" PRIMARY KEY ("id"))`);
    }
    async down(queryRunner) {
        await queryRunner.query(`DROP TABLE "bucky_logs"`);
    }
}
exports.BuckyLogs1725491792885 = BuckyLogs1725491792885;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiMTcyNTQ5MjUzNDU3Ny1CdWNreUxvZ3MuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvbWlncmF0aW9ucy8xNzI1NDkyNTM0NTc3LUJ1Y2t5TG9ncy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFFQSxNQUFhLHNCQUFzQjtJQUN4QixLQUFLLENBQUMsRUFBRSxDQUFDLFdBQXdCO1FBQ3BDLE1BQU0sV0FBVyxDQUFDLEtBQUssQ0FDbkI7Ozs7Ozs7OzsrRUFTbUUsQ0FDdEUsQ0FBQztJQUNOLENBQUM7SUFFTSxLQUFLLENBQUMsSUFBSSxDQUFDLFdBQXdCO1FBQ3RDLE1BQU0sV0FBVyxDQUFDLEtBQUssQ0FBQyx5QkFBeUIsQ0FBQyxDQUFDO0lBQ3ZELENBQUM7Q0FDSjtBQW5CRCx3REFtQkMifQ==