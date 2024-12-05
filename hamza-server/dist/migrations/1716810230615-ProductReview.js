"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductReview1716810230615 = void 0;
class ProductReview1716810230615 {
    async up(queryRunner) {
        await queryRunner.query(`CREATE TABLE "product_review"
             (
                 "id"          character varying NOT NULL,
                 "product_id"  character varying,
                 "title"       character varying NOT NULL,
                 "customer_id" character varying,
                 "order_id"    character varying,
                 "rating"      integer           NOT NULL,
                 "content"     character varying NOT NULL,
                 "created_at"   TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                 "updated_at"   TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                 "deleted_at"   TIMESTAMP WITH TIME ZONE,
                 CONSTRAINT "PK_product_review_1716810230615" PRIMARY KEY ("id")
             )`);
        await queryRunner.query(`ALTER TABLE "product_review"
                ADD CONSTRAINT "FK_5ix0u284wt3tmrlpb56ppzmxi7" FOREIGN KEY ("customer_id") REFERENCES "customer"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "product_review"
                ADD CONSTRAINT "FK_1cvf31byyh136a7744qmdt02yh" FOREIGN KEY ("product_id") REFERENCES "product"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "product_review"
                ADD CONSTRAINT "FK_1cvf31byyh136a7744qmdt03yh" FOREIGN KEY ("order_id") REFERENCES "order"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }
    async down(queryRunner) {
        await queryRunner.query(`DROP TABLE "product_review"`);
    }
}
exports.ProductReview1716810230615 = ProductReview1716810230615;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiMTcxNjgxMDIzMDYxNS1Qcm9kdWN0UmV2aWV3LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL21pZ3JhdGlvbnMvMTcxNjgxMDIzMDYxNS1Qcm9kdWN0UmV2aWV3LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUVBLE1BQWEsMEJBQTBCO0lBQzVCLEtBQUssQ0FBQyxFQUFFLENBQUMsV0FBd0I7UUFDcEMsTUFBTSxXQUFXLENBQUMsS0FBSyxDQUNuQjs7Ozs7Ozs7Ozs7OztlQWFHLENBQ04sQ0FBQztRQUVGLE1BQU0sV0FBVyxDQUFDLEtBQUssQ0FDbkI7K0pBQ21KLENBQ3RKLENBQUM7UUFFRixNQUFNLFdBQVcsQ0FBQyxLQUFLLENBQ25COzJKQUMrSSxDQUNsSixDQUFDO1FBRUYsTUFBTSxXQUFXLENBQUMsS0FBSyxDQUNuQjt1SkFDMkksQ0FDOUksQ0FBQztJQUNOLENBQUM7SUFFTSxLQUFLLENBQUMsSUFBSSxDQUFDLFdBQXdCO1FBQ3RDLE1BQU0sV0FBVyxDQUFDLEtBQUssQ0FBQyw2QkFBNkIsQ0FBQyxDQUFDO0lBQzNELENBQUM7Q0FDSjtBQXRDRCxnRUFzQ0MifQ==