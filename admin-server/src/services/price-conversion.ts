import { Lifetime } from 'awilix';
import { TransactionBaseService } from '@medusajs/medusa';
import { createLogger, ILogger } from '../utils/logging/logger';

class PriceConversionService extends TransactionBaseService {
    static LIFE_TIME = Lifetime.SCOPED;
    protected readonly logger: ILogger;

    constructor(container) {
        super(container);
        this.logger = createLogger(container, 'PriceConversionService');
    }
}

export default PriceConversionService;
