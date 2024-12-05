"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.POST = void 0;
const route_handler_1 = require("../../../route-handler");
//TODO: I do not think this is used 
const POST = async (req, res) => {
    const productService = req.scope.resolve('productService');
    const storeRepository = req.scope.resolve('storeRepository');
    const handler = new route_handler_1.RouteHandler(req, res, 'POST', '/admin/custom/product', ['products']);
    await handler.handle(async () => {
        const products = handler.inputParams.products;
        handler.logger.debug(`got ${products.length} products: ${products}`);
        if (!products) {
            return res
                .status(400)
                .json({ message: 'Missing products' });
        }
        const promises = [];
        for (let prod of products) {
            const store = (await storeRepository.findOne({ where: { name: prod.store_id } }));
            prod.store_id = store.id;
            //prod.collection_id = (await productCollectionRepository.findOne({ where: { title: prod.collection_id } })).id;
            console.log(prod);
            promises.push(productService.create(prod));
        }
        await Promise.all(promises);
        handler.logger.debug(`added ${products.length} products.`);
        return res.json({ ok: 'true' });
    });
};
exports.POST = POST;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9zcmMvYXBpL2FkbWluL2N1c3RvbS9wcm9kdWN0L3JvdXRlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUVBLDBEQUFzRDtBQUV0RCxvQ0FBb0M7QUFDN0IsTUFBTSxJQUFJLEdBQUcsS0FBSyxFQUFFLEdBQWtCLEVBQUUsR0FBbUIsRUFBRSxFQUFFO0lBQ2xFLE1BQU0sY0FBYyxHQUFHLEdBQUcsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLGdCQUFnQixDQUFDLENBQUM7SUFDM0QsTUFBTSxlQUFlLEdBQUcsR0FBRyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsaUJBQWlCLENBQUMsQ0FBQztJQUU3RCxNQUFNLE9BQU8sR0FBaUIsSUFBSSw0QkFBWSxDQUMxQyxHQUFHLEVBQUUsR0FBRyxFQUFFLE1BQU0sRUFBRSx1QkFBdUIsRUFBRSxDQUFDLFVBQVUsQ0FBQyxDQUMxRCxDQUFDO0lBRUYsTUFBTSxPQUFPLENBQUMsTUFBTSxDQUFDLEtBQUssSUFBSSxFQUFFO1FBQzVCLE1BQU0sUUFBUSxHQUFHLE9BQU8sQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDO1FBQzlDLE9BQU8sQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLE9BQU8sUUFBUSxDQUFDLE1BQU0sY0FBYyxRQUFRLEVBQUUsQ0FBQyxDQUFBO1FBRXBFLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQztZQUNaLE9BQU8sR0FBRztpQkFDTCxNQUFNLENBQUMsR0FBRyxDQUFDO2lCQUNYLElBQUksQ0FBQyxFQUFFLE9BQU8sRUFBRSxrQkFBa0IsRUFBRSxDQUFDLENBQUM7UUFDL0MsQ0FBQztRQUVELE1BQU0sUUFBUSxHQUF1QixFQUFFLENBQUM7UUFDeEMsS0FBSyxJQUFJLElBQUksSUFBSSxRQUFRLEVBQUUsQ0FBQztZQUN4QixNQUFNLEtBQUssR0FBRyxDQUFDLE1BQU0sZUFBZSxDQUFDLE9BQU8sQ0FBQyxFQUFFLEtBQUssRUFBRSxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsUUFBUSxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFDbEYsSUFBSSxDQUFDLFFBQVEsR0FBRyxLQUFLLENBQUMsRUFBRSxDQUFDO1lBQ3pCLGdIQUFnSDtZQUVoSCxPQUFPLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ2xCLFFBQVEsQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1FBQy9DLENBQUM7UUFFRCxNQUFNLE9BQU8sQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDNUIsT0FBTyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsU0FBUyxRQUFRLENBQUMsTUFBTSxZQUFZLENBQUMsQ0FBQTtRQUUxRCxPQUFPLEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBRSxFQUFFLEVBQUUsTUFBTSxFQUFFLENBQUMsQ0FBQztJQUNwQyxDQUFDLENBQUMsQ0FBQztBQUNQLENBQUMsQ0FBQztBQWpDVyxRQUFBLElBQUksUUFpQ2YifQ==