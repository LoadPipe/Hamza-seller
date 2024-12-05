"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GET = void 0;
const route_handler_1 = require("../../../../route-handler");
const GET = async (req, res) => {
    const storeService = req.scope.resolve('storeService');
    let buckyService = req.scope.resolve('buckydropService');
    let salesChannelService = req.scope.resolve('salesChannelService');
    let productCollectionRepository = req.scope.resolve('productCollectionRepository');
    const handler = new route_handler_1.RouteHandler(req, res, 'GET', '/admin/custom/bucky/import', ['count', 'page', 'link', 'store', 'category_id']);
    const getImportData = async (storeName, categoryId) => {
        const output = {
            storeId: '',
            categoryId,
            collectionId: '',
            salesChannelId: '',
        };
        output.storeId = (await storeService.getStoreByName(storeName)).id;
        output.collectionId = (await productCollectionRepository.findOne({
            where: { store_id: output.storeId },
        })).id;
        const salesChannels = await salesChannelService.list({}, { take: 1 });
        output.salesChannelId = salesChannels[0].id;
        return output;
    };
    //soup bowls
    await handler.handle(async () => {
        var _a, _b, _c, _d, _e, _f, _g;
        const importData = await getImportData((_a = handler.inputParams.store) !== null && _a !== void 0 ? _a : 'Medusa Merch', handler.inputParams.category_id);
        const goodsId = (_b = handler.inputParams.goodsId) === null || _b === void 0 ? void 0 : _b.toString();
        const link = (_c = handler.inputParams.link) === null || _c === void 0 ? void 0 : _c.toString();
        let output = {};
        if (link) {
            output = await buckyService.importProductsByLink(link, importData.storeId, importData.categoryId, importData.collectionId, importData.salesChannelId);
        }
        else {
            output = await buckyService.importProductsByKeyword(handler.inputParams.keyword.toString(), importData.storeId, importData.categoryId, importData.collectionId, importData.salesChannelId, parseInt((_e = (_d = handler.inputParams.count) === null || _d === void 0 ? void 0 : _d.toString()) !== null && _e !== void 0 ? _e : '10'), parseInt((_g = (_f = handler.inputParams.page) === null || _f === void 0 ? void 0 : _f.toString()) !== null && _g !== void 0 ? _g : '1'), goodsId);
        }
        return res.status(201).json({ status: true, output });
    });
};
exports.GET = GET;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvYXBpL2FkbWluL2N1c3RvbS9idWNreS9pbXBvcnQvcm91dGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBS0EsNkRBQXlEO0FBS2xELE1BQU0sR0FBRyxHQUFHLEtBQUssRUFBRSxHQUFrQixFQUFFLEdBQW1CLEVBQUUsRUFBRTtJQUNqRSxNQUFNLFlBQVksR0FBaUIsR0FBRyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsY0FBYyxDQUFDLENBQUM7SUFDckUsSUFBSSxZQUFZLEdBQXFCLEdBQUcsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLGtCQUFrQixDQUFDLENBQUM7SUFDM0UsSUFBSSxtQkFBbUIsR0FBd0IsR0FBRyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQzVELHFCQUFxQixDQUN4QixDQUFDO0lBQ0YsSUFBSSwyQkFBMkIsR0FDM0IsR0FBRyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsNkJBQTZCLENBQUMsQ0FBQztJQUVyRCxNQUFNLE9BQU8sR0FBaUIsSUFBSSw0QkFBWSxDQUMxQyxHQUFHLEVBQ0gsR0FBRyxFQUNILEtBQUssRUFDTCw0QkFBNEIsRUFDNUIsQ0FBQyxPQUFPLEVBQUUsTUFBTSxFQUFFLE1BQU0sRUFBRSxPQUFPLEVBQUUsYUFBYSxDQUFDLENBQ3BELENBQUM7SUFFRixNQUFNLGFBQWEsR0FBRyxLQUFLLEVBQUUsU0FBaUIsRUFBRSxVQUFrQixFQUFFLEVBQUU7UUFDbEUsTUFBTSxNQUFNLEdBQUc7WUFDWCxPQUFPLEVBQUUsRUFBRTtZQUNYLFVBQVU7WUFDVixZQUFZLEVBQUUsRUFBRTtZQUNoQixjQUFjLEVBQUUsRUFBRTtTQUNyQixDQUFDO1FBRUYsTUFBTSxDQUFDLE9BQU8sR0FBRyxDQUFDLE1BQU0sWUFBWSxDQUFDLGNBQWMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztRQUNuRSxNQUFNLENBQUMsWUFBWSxHQUFHLENBQ2xCLE1BQU0sMkJBQTJCLENBQUMsT0FBTyxDQUFDO1lBQ3RDLEtBQUssRUFBRSxFQUFFLFFBQVEsRUFBRSxNQUFNLENBQUMsT0FBTyxFQUFFO1NBQ3RDLENBQUMsQ0FDTCxDQUFDLEVBQUUsQ0FBQztRQUVMLE1BQU0sYUFBYSxHQUFHLE1BQU0sbUJBQW1CLENBQUMsSUFBSSxDQUFDLEVBQUUsRUFBRSxFQUFFLElBQUksRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQ3RFLE1BQU0sQ0FBQyxjQUFjLEdBQUcsYUFBYSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztRQUU1QyxPQUFPLE1BQU0sQ0FBQztJQUNsQixDQUFDLENBQUM7SUFFRixZQUFZO0lBRVosTUFBTSxPQUFPLENBQUMsTUFBTSxDQUFDLEtBQUssSUFBSSxFQUFFOztRQUM1QixNQUFNLFVBQVUsR0FBRyxNQUFNLGFBQWEsQ0FDbEMsTUFBQSxPQUFPLENBQUMsV0FBVyxDQUFDLEtBQUssbUNBQUksY0FBYyxFQUMzQyxPQUFPLENBQUMsV0FBVyxDQUFDLFdBQVcsQ0FDbEMsQ0FBQztRQUVGLE1BQU0sT0FBTyxHQUFHLE1BQUEsT0FBTyxDQUFDLFdBQVcsQ0FBQyxPQUFPLDBDQUFFLFFBQVEsRUFBRSxDQUFDO1FBQ3hELE1BQU0sSUFBSSxHQUFHLE1BQUEsT0FBTyxDQUFDLFdBQVcsQ0FBQyxJQUFJLDBDQUFFLFFBQVEsRUFBRSxDQUFDO1FBRWxELElBQUksTUFBTSxHQUFHLEVBQUUsQ0FBQztRQUNoQixJQUFJLElBQUksRUFBRSxDQUFDO1lBQ1AsTUFBTSxHQUFHLE1BQU0sWUFBWSxDQUFDLG9CQUFvQixDQUM1QyxJQUFJLEVBQ0osVUFBVSxDQUFDLE9BQU8sRUFDbEIsVUFBVSxDQUFDLFVBQVUsRUFDckIsVUFBVSxDQUFDLFlBQVksRUFDdkIsVUFBVSxDQUFDLGNBQWMsQ0FDNUIsQ0FBQztRQUNOLENBQUM7YUFDSSxDQUFDO1lBQ0YsTUFBTSxHQUFHLE1BQU0sWUFBWSxDQUFDLHVCQUF1QixDQUMvQyxPQUFPLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxRQUFRLEVBQUUsRUFDdEMsVUFBVSxDQUFDLE9BQU8sRUFDbEIsVUFBVSxDQUFDLFVBQVUsRUFDckIsVUFBVSxDQUFDLFlBQVksRUFDdkIsVUFBVSxDQUFDLGNBQWMsRUFDekIsUUFBUSxDQUFDLE1BQUEsTUFBQSxPQUFPLENBQUMsV0FBVyxDQUFDLEtBQUssMENBQUUsUUFBUSxFQUFFLG1DQUFJLElBQUksQ0FBQyxFQUN2RCxRQUFRLENBQUMsTUFBQSxNQUFBLE9BQU8sQ0FBQyxXQUFXLENBQUMsSUFBSSwwQ0FBRSxRQUFRLEVBQUUsbUNBQUksR0FBRyxDQUFDLEVBQ3JELE9BQU8sQ0FDVixDQUFDO1FBQ04sQ0FBQztRQUVELE9BQU8sR0FBRyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxDQUFDLENBQUM7SUFDMUQsQ0FBQyxDQUFDLENBQUM7QUFDUCxDQUFDLENBQUM7QUExRVcsUUFBQSxHQUFHLE9BMEVkIn0=