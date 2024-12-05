"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const medusa_1 = require("@medusajs/medusa");
const awilix_1 = require("awilix");
const product_review_1 = require("../models/product-review");
const order_1 = require("../models/order");
const typeorm_1 = require("typeorm");
const logger_1 = require("../utils/logging/logger");
class ProductReviewService extends medusa_1.TransactionBaseService {
    constructor(container) {
        super(container);
        this.productVariantRepository_ = container.productVariantRepository;
        this.productReviewRepository_ = container.productReviewRepository;
        this.orderRepository_ = container.orderRepository;
        this.logger = (0, logger_1.createLogger)(container, 'ProductReviewService');
    }
    async customerHasBoughtProduct(customer_id, product_id) {
        const productReviewRepository = this.activeManager_.getRepository(product_review_1.ProductReview);
        const productReview = await productReviewRepository.find({
            where: { product_id, customer_id },
        });
        if (!productReview) {
            this.logger.debug(`No product review found for product_id: ${product_id} and customer_id: ${customer_id}`);
            return null;
        }
        return !!productReview;
    }
    async customerHasLeftReview(order_id, customer_id, variant_id) {
        const productReviewRepository = this.activeManager_.getRepository(product_review_1.ProductReview);
        let productId;
        try {
            const variantProduct = await this.productVariantRepository_.findOne({
                where: { id: variant_id }, // Assuming product_id is the ID of the variant
            });
            if (!variantProduct) {
                throw new Error('Product variant not found');
            }
            productId = variantProduct.product_id; // This assumes that variantProduct actually contains a product_id
        }
        catch (e) {
            this.logger.error(`Error fetching product variant: ${e}`);
            throw e; // Rethrow or handle the error appropriately
        }
        const productReviews = await productReviewRepository.find({
            where: { order_id: order_id, customer_id, product_id: productId },
        });
        this.logger.debug(`productReviews: ${JSON.stringify(productReviews)}`);
        if (productReviews.length === 0) {
            this.logger.debug(`No product review found for order_id: ${order_id}`);
            return true;
        }
        return false;
    }
    // Order has no relations to product ...
    async getNotReviewedOrders(customer_id) {
        const orderRepository = this.activeManager_.getRepository(order_1.Order);
        const productReviewRepository = this.activeManager_.getRepository(product_review_1.ProductReview);
        // Fetch all non-archived and non-canceled orders for the customer
        const orders = await orderRepository
            .createQueryBuilder('order')
            .leftJoinAndSelect('order.items', 'item')
            .leftJoinAndSelect('item.variant', 'variant')
            .leftJoinAndSelect('variant.product', 'product')
            .where('order.customer_id = :customer_id', { customer_id })
            .andWhere(new typeorm_1.Brackets((qb) => {
            qb.where(new typeorm_1.Brackets((qb2) => {
                qb2.where('order.status = :completedStatus', {
                    completedStatus: 'completed',
                }).andWhere('order.fulfillment_status = :fulfilledStatus', { fulfilledStatus: 'shipped' });
            })).orWhere('order.payment_status = :refundedStatus', {
                refundedStatus: 'refunded',
            });
        }))
            .getMany();
        if (orders.length === 0) {
            return [];
        }
        // Fetch all reviewed product IDs for the customer
        const reviewedProducts = await productReviewRepository
            .createQueryBuilder('review')
            .select('review.product_id')
            .where('review.customer_id = :customer_id', { customer_id })
            .getMany();
        const reviewedProductIds = new Set(reviewedProducts.map((review) => review.product_id));
        // Remove reviewed items from each order
        const ordersWithUnreviewedItems = orders
            .map((order) => ({
            ...order,
            items: order.items.filter((item) => !reviewedProductIds.has(item.variant.product.id)),
        }))
            .filter((order) => order.items.length > 0); // Optionally remove orders that end up with no items
        return ordersWithUnreviewedItems;
    }
    async getSpecificReview(order_id, product_id) {
        console.log(`ProductID is ${product_id}`);
        try {
            const productReviewRepository = this.activeManager_.getRepository(product_review_1.ProductReview);
            const productReview = await productReviewRepository.findOne({
                where: { order_id, product_id: product_id },
            });
            console.log(`ProductReview is ${JSON.stringify(productReview)}`);
            if (productReview === undefined) {
                return { content: '', rating: 0 };
            }
            const { content, rating } = productReview;
            return { content, rating };
        }
        catch (e) {
            this.logger.error(`Error fetching specific review: ${e}`);
            throw e;
        }
    }
    async getReviews(product_id) {
        const productReviewRepository = this.activeManager_.getRepository(product_review_1.ProductReview);
        const reviews = await productReviewRepository.find({
            where: { product_id },
            relations: { customer: true },
            select: {
                customer: {
                    first_name: true,
                    last_name: true,
                },
            },
        });
        if (!reviews) {
            throw new Error('No reviews found');
        }
        return reviews;
    }
    async getCustomerReviews(product_id, customer_id) {
        const productReviewRepository = this.activeManager_.getRepository(product_review_1.ProductReview);
        const reviews = await productReviewRepository.find({
            where: { product_id, customer_id },
        });
        if (!reviews) {
            throw new Error('No reviews found');
        }
        return reviews;
    }
    async getAllCustomerReviews(customer_id) {
        const productReviewRepository = this.activeManager_.getRepository(product_review_1.ProductReview);
        const reviews = await productReviewRepository
            .createQueryBuilder('review')
            .leftJoinAndSelect('review.product', 'product')
            .select([
            'review', // Assuming you want the review's ID; add other review fields as needed
            'product.thumbnail', // This specifies that only the thumbnail field from the product should be included
            'product.handle',
        ])
            .where('review.customer_id = :customer_id', { customer_id })
            .getMany();
        console.log(`reviews: ${JSON.stringify(reviews)}`);
        if (!reviews) {
            throw new Error('No reviews found');
        }
        return reviews;
    }
    async getReviewCount(product_id) {
        const productReviewRepository = this.activeManager_.getRepository(product_review_1.ProductReview);
        const reviews = await productReviewRepository.find({
            where: { product_id },
        });
        if (!reviews) {
            throw new Error('No reviews found');
        }
        return reviews.length;
    }
    async getAverageRating(product_id) {
        const productReviewRepository = this.activeManager_.getRepository(product_review_1.ProductReview);
        const reviews = await productReviewRepository.find({
            where: { product_id },
        });
        if (!reviews) {
            throw new Error('No reviews found');
        }
        const averageRating = reviews.reduce((acc, review) => acc + review.rating, 0) /
            reviews.length;
        this.logger.debug(`The average rating is: ${averageRating.toFixed(2)}`);
        return averageRating;
    }
    async updateProductReview(product_id, review_updates, customer_id) {
        const productReviewRepository = this.activeManager_.getRepository(product_review_1.ProductReview);
        const existingReview = await productReviewRepository.findOne({
            where: { product_id, customer_id },
        });
        this.logger.debug(`existingReview: ${existingReview.content}`);
        if (!existingReview) {
            throw new Error('Review not found'); // Proper error handling if the review doesn't exist
        }
        existingReview.content = review_updates;
        return productReviewRepository.save(existingReview);
    }
    // async updateProduct(
    //     product_id,
    //     review_updates,
    //     rating_updates,
    //     customer_id,
    //     order_id
    // ) {
    //     const productReviewRepository =
    //         this.activeManager_.getRepository(ProductReview);
    //
    //     let productId;
    //
    //     try {
    //         const variantProduct = await this.productVariantRepository_.findOne(
    //             {
    //                 where: { id: product_id }, // Assuming product_id is the ID of the variant
    //             }
    //         );
    //
    //         if (!variantProduct) {
    //             throw new Error('Product variant not found');
    //         }
    //
    //         productId = variantProduct.product_id; // This assumes that variantProduct actually contains a product_id
    //     } catch (e) {
    //         this.logger.error(`Error fetching product variant: ${e}`);
    //         throw e; // Rethrow or handle the error appropriately
    //     }
    //
    //     // Ensure productId was successfully retrieved before proceeding
    //     if (!productId) {
    //         throw new Error('Unable to retrieve product ID for the review');
    //     }
    //
    //     const existingReview = await productReviewRepository.findOne({
    //         where: { product_id: productId, customer_id, order_id },
    //     });
    //
    //     this.logger.debug(`existingReview: ${existingReview.content}`);
    //
    //     if (!existingReview) {
    //         throw new Error('Review not found'); // Proper error handling if the review doesn't exist
    //     }
    //
    //     existingReview.content = review_updates;
    //     existingReview.rating = rating_updates;
    //
    //     return await productReviewRepository.save(existingReview);
    // }
    async updateProduct(product_id, review, rating, customer_id, order_id) {
        const productReviewRepository = this.activeManager_.getRepository(product_review_1.ProductReview);
        const existingReview = await productReviewRepository.findOne({
            where: {
                product_id: product_id,
                customer_id: customer_id,
                order_id: order_id,
            },
        });
        this.logger.debug(`Searching for review with Product ID: ${product_id}, Customer ID: ${customer_id}, Order ID: ${order_id}`);
        if (!existingReview) {
            this.logger.error('Review not found');
            throw new Error('Review not found');
        }
        else {
            this.logger.debug(`Found review with Rating: ${existingReview.rating}`);
        }
        if (!existingReview) {
            throw new Error('Review not found'); // Proper error handling if the review doesn't exist
        }
        existingReview.rating = rating;
        existingReview.content = review;
        return productReviewRepository.save(existingReview);
    }
    // TODO: lock to not allow multiple reviews for this item...
    async addProductReview(product_id, { title, customer_id, content, rating, order_id }) {
        if (!product_id ||
            !title ||
            !customer_id ||
            !content ||
            !rating ||
            !order_id) {
            throw new Error('Product review requires title, customer_id, content, and rating');
        }
        const productReviewRepository = this.activeManager_.getRepository(product_review_1.ProductReview);
        const reviews = await productReviewRepository.find({
            where: { product_id, customer_id, order_id },
        });
        if (reviews.length > 0) {
            return 'REVIEW EXISTS!';
        }
        else {
            console.log(`Review does not exist, lets create one`);
        }
        const createdReview = productReviewRepository.create({
            product_id: product_id,
            title: title,
            customer_id: customer_id, // Assuming there is a customer_id field
            content: content,
            rating: rating,
            order_id: order_id,
        });
        const productReview = await productReviewRepository.save(createdReview);
        return productReview;
    }
}
ProductReviewService.LIFE_TIME = awilix_1.Lifetime.SCOPED;
exports.default = ProductReviewService;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvZHVjdC1yZXZpZXcuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvc2VydmljZXMvcHJvZHVjdC1yZXZpZXcudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSw2Q0FBK0U7QUFDL0UsbUNBQWtDO0FBRWxDLDZEQUF5RDtBQUN6RCwyQ0FBd0M7QUFLeEMscUNBQTRDO0FBQzVDLG9EQUFnRTtBQUVoRSxNQUFNLG9CQUFxQixTQUFRLCtCQUFzQjtJQU9yRCxZQUFZLFNBQVM7UUFDakIsS0FBSyxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQ2pCLElBQUksQ0FBQyx5QkFBeUIsR0FBRyxTQUFTLENBQUMsd0JBQXdCLENBQUM7UUFDcEUsSUFBSSxDQUFDLHdCQUF3QixHQUFHLFNBQVMsQ0FBQyx1QkFBdUIsQ0FBQztRQUNsRSxJQUFJLENBQUMsZ0JBQWdCLEdBQUcsU0FBUyxDQUFDLGVBQWUsQ0FBQztRQUNsRCxJQUFJLENBQUMsTUFBTSxHQUFHLElBQUEscUJBQVksRUFBQyxTQUFTLEVBQUUsc0JBQXNCLENBQUMsQ0FBQztJQUNsRSxDQUFDO0lBRUQsS0FBSyxDQUFDLHdCQUF3QixDQUFDLFdBQVcsRUFBRSxVQUFVO1FBQ2xELE1BQU0sdUJBQXVCLEdBQ3pCLElBQUksQ0FBQyxjQUFjLENBQUMsYUFBYSxDQUFDLDhCQUFhLENBQUMsQ0FBQztRQUNyRCxNQUFNLGFBQWEsR0FBRyxNQUFNLHVCQUF1QixDQUFDLElBQUksQ0FBQztZQUNyRCxLQUFLLEVBQUUsRUFBRSxVQUFVLEVBQUUsV0FBVyxFQUFFO1NBQ3JDLENBQUMsQ0FBQztRQUVILElBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQztZQUNqQixJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FDYiwyQ0FBMkMsVUFBVSxxQkFBcUIsV0FBVyxFQUFFLENBQzFGLENBQUM7WUFDRixPQUFPLElBQUksQ0FBQztRQUNoQixDQUFDO1FBRUQsT0FBTyxDQUFDLENBQUMsYUFBYSxDQUFDO0lB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