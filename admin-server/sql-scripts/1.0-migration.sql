CREATE TABLE "store_shipping_spec" ( 
            "id" character varying NOT NULL,
            "store_id" character varying NOT NULL,
            "spec" jsonb NOT NULL,
            "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
            "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
            CONSTRAINT "PK_store_shipping_spec_pk" PRIMARY KEY ("id") );

ALTER TABLE "store_shipping_spec" ADD CONSTRAINT "FK_Store_Shipping_Spec_Store" FOREIGN KEY ("store_id") REFERENCES "store"("id") ON DELETE SET NULL ON UPDATE CASCADE;

CREATE TABLE "cancellation_request" (
            "id" character varying NOT NULL,
            "order_id" character varying NOT NULL,
            "reason" character varying NOT NULL,
            "buyer_note" character varying,
            "seller_note" character varying,
            "status" character varying NOT NULL,
            "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
            "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now());
            
ALTER TABLE "cancellation_request" ADD CONSTRAINT "FK_Cancellation_Request_Order" FOREIGN KEY ("order_id") REFERENCES "order"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "store" ADD "escrow_metadata" jsonb;

ALTER TABLE "product" ADD "external_metadata" jsonb;
ALTER TABLE "product_variant" ADD "external_metadata" jsonb;
ALTER TABLE "product" ADD "external_source" character varying;
ALTER TABLE "product_variant" ADD "external_source" character varying;



-- add amount_adjustment to order_history