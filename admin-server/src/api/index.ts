// DOCS: https://docs.medusajs.com/development/api-routes/extend-validator
// Creating extended validators to add new properties

import { registerOverriddenValidators } from '@medusajs/medusa';
import { StorePostAuthReq as MedusaStorePostAuthReq } from '@medusajs/medusa/dist/api/routes/store/auth';
import { IsString } from 'class-validator';

export class StorePostAuthReq extends MedusaStorePostAuthReq {
    @IsString()
    wallet_address: string;
}

registerOverriddenValidators(StorePostAuthReq);
