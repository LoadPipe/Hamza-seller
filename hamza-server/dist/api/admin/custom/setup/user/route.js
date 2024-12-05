"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.POST = void 0;
const route_handler_1 = require("../../../../route-handler");
const POST = async (req, res) => {
    const userService = req.scope.resolve('userService');
    const storeService = req.scope.resolve('storeService');
    const productCollectionService = req.scope.resolve('productCollectionService');
    const handler = new route_handler_1.RouteHandler(req, res, 'POST', '/admin/custom/setup/user');
    await handler.handle(async () => {
        const users = await Promise.all([
            userService.create({
                email: 'medusaVendor@hamza.com',
                first_name: 'medusa',
                last_name: 'Vendor',
                wallet_address: '0xb794f5ea0ba39494ce839613fffba74279579268'.toLowerCase(),
            }, 'password'),
            userService.create({
                email: 'QualityVendor@hamza.com',
                first_name: 'Quality',
                last_name: 'Vendor',
                wallet_address: '0x6A75b412495838621e9352FE72fF5e9191DD5ab1'.toLowerCase(),
            }, 'password'),
            userService.create({
                email: 'HeadphonesVendor@hamza.com',
                first_name: 'Headphones',
                last_name: 'Vendor',
                wallet_address: '0x5728C7b8b448332Acda43369afa3a2c25C947D43'.toLowerCase(),
            }, 'password'),
            userService.create({
                email: 'indiana_drones@hamza.com',
                first_name: 'Indiana',
                last_name: 'Jones',
                wallet_address: '0x56348d548852e72d8c7fB24C89c7Fb1492504738'.toLowerCase(),
            }, 'password'),
            userService.create({
                email: 'jarl@jarburg.net',
                first_name: 'Jarl',
                last_name: 'Droischevnsky',
                wallet_address: '0xc0ffee254729296a45a3885639AC7E10F9d54979'.toLowerCase(),
            }, 'password'),
            userService.create({
                email: 'support@gamefi-studios.io',
                first_name: 'GameFi',
                last_name: 'Studios',
                wallet_address: '0xb975Bf5ca0b09E17834d0b5A526F8315F82986D4'.toLowerCase(),
            }, 'password'),
            userService.create({
                email: 'support@razorsedge.io',
                first_name: 'Razors',
                last_name: 'Edge',
                wallet_address: '0xfB20a78fD35D20925af6F7379Ab35Fa6C41e9834'.toLowerCase(),
            }, 'password'),
            userService.create({
                email: 'support@dunderchiefs.io',
                first_name: '21',
                last_name: 'Laptops',
                wallet_address: '0x9315fe04f0e18AA0F8C92e98f6783177A2156D1F'.toLowerCase(),
            }, 'password'),
            userService.create({
                email: 'jablinski@jablinksi-gaming.com',
                first_name: 'Jack',
                last_name: 'Black',
                wallet_address: '0xcafb8Cd7d8c5574f0c412619A08EC47f2eA1e434'.toLowerCase(),
            }, 'password'),
            userService.create({
                email: 'jern@javels.com',
                first_name: 'Jern',
                last_name: 'Javels',
                wallet_address: '0x8bA35513C3F5ac659907D222e3DaB38b20f8F52A'.toLowerCase(),
            }, 'password'),
            userService.create({
                email: 'horatio-turdburger@imagescience.org',
                first_name: 'Horatio',
                last_name: 'Turdmuncher',
                wallet_address: '0x0000F49cC0f91d66Bc5bBbE931913D8709500003'.toLowerCase(),
            }, 'password'),
        ]);
        // Destructing the users array
        const [user0, user1, user2, user3, user4, user5, user6, user7, user8, user9, user10,] = users;
        const stores = await Promise.all([
            storeService.createStore(user0, 'Medusa Merch', 'pcol_01HRVF8HCVY8B00RF5S54THTPC', 'https://medusa-public-images.s3.eu-west-1.amazonaws.com/sweatpants-gray-front.png', 500, 'Medusa Merch Store where we sell our Medusa Sweatpants, its a nice store', '0xFF0A7A96A5DdDD33976262728Ec62ec05AB0DF6b'),
            storeService.createStore(user1, 'Echo Rift', 'pcol_01HSGAM4918EX0DETKY6E662WT', 'https://images.hamza.market/headphones.webp', 200, "We Sell VR Headsets here, the best quality VR headsets you wouldn't believe it", '0xFF0A7A96A5DdDD33976262728Ec62ec05AB0DF6b'),
            storeService.createStore(user2, 'Dauntless', 'pcol_01HSGAMXDJD725MR3VSW631SN2', 'https://images.hamza.market/dalle_vr.webp', 450, 'Dauntless Store - Where bold and resilient products meet exceptional quality. Perfect for those who seek adventure and durability in every purchase.', '0xFF0A7A96A5DdDD33976262728Ec62ec05AB0DF6b'),
            storeService.createStore(user3, 'Drones', 'pcol_01HSGAMXDJD725MR3VSW631DR0', 'https://images.hamza.market/Drones/dji_mini_4_pro/dji_mini_pro_1.jpg', 720, 'Drones Store - Your go-to destination for cutting-edge aerial technology. Explore our wide range of high-performance drones perfect for every enthusiast.', '0xFF0A7A96A5DdDD33976262728Ec62ec05AB0DF6b'),
            storeService.createStore(user4, 'Legos', 'pcol_01HSGAMXDJD725MR3VSW63LEG0', 'https://images.hamza.market/Lego/corvette/corvette_1.jpg', 315, 'Legos Store - Dive into the world of creativity and building blocks. Find the latest Lego sets and build your imagination with endless possibilities.', '0xFF0A7A96A5DdDD33976262728Ec62ec05AB0DF6b'),
            storeService.createStore(user5, 'Board Games', 'pcol_01HSGAMXDJD725MR3VSW63B0RD', 'https://images.hamza.market/Board_Games/dark_souls/souls_1.jpg', 860, 'Board Games Store - A haven for tabletop enthusiasts. Discover a wide selection of board games, from strategy to family fun, and everything in between.', '0xFF0A7A96A5DdDD33976262728Ec62ec05AB0DF6b'),
            storeService.createStore(user6, 'Workout Gear', 'pcol_01HSGAMXDJD725MR3VSW63W0GE', 'https://images.hamza.market/Workout/dumbbell/dumb_2.jpg', 580, 'Workout Gear Store - Equip yourself with the best in fitness gear. From weights to apparel, we have everything you need to power your workouts.', '0xFF0A7A96A5DdDD33976262728Ec62ec05AB0DF6b'),
            storeService.createStore(user7, 'Gaming Gear', 'pcol_01HSGAMXDJD725MR3VSW63W0GA', 'https://images.hamza.market/gaming_store/6.1.png', 930, 'Gaming Gear Store - Elevate your gaming experience with top-tier gear. Find the latest peripherals, accessories, and more for the ultimate gaming setup.', '0xFF0A7A96A5DdDD33976262728Ec62ec05AB0DF6b'),
            storeService.createStore(user8, 'Shake', 'pcol_shake', 'https://images.hamza.market/headphones.webp', 290, 'Shake Store - Blend your way to a healthier lifestyle. Our store offers a range of premium shakes and blenders for the health-conscious consumer.', '0xFF0A7A96A5DdDD33976262728Ec62ec05AB0DF6b'),
            storeService.createStore(user9, 'Legendary Light Design', 'pcol_lighting', 'https://images.hamza.market/Legendary/mood/LLD_mood1.webp', 670, 'Legendary Light Design Store - Illuminate your space with style. Explore our collection of designer lighting solutions for a touch of elegance and functionality.', '0xFF0A7A96A5DdDD33976262728Ec62ec05AB0DF6b'),
            storeService.createStore(user10, 'Block', 'pcol_blocks', 'https://images.hamza.market/headphones.webp', 410, 'Block Store - Specializing in building blocks and construction toys. Let your creativity soar with our range of products designed for endless fun.', '0xFF0A7A96A5DdDD33976262728Ec62ec05AB0DF6b'),
        ]);
        const [store0, store1, store2, store3, store4, store5, store6, store7, store8, store9, store10,] = stores;
        await Promise.all([
            productCollectionService.update('pcol_01HRVF8HCVY8B00RF5S54THTPC', {
                store_id: store0.id,
            }),
            productCollectionService.update('pcol_01HSGAM4918EX0DETKY6E662WT', {
                store_id: store1.id,
            }),
            productCollectionService.update('pcol_01HSGAMXDJD725MR3VSW631SN2', {
                store_id: store2.id,
            }),
            productCollectionService.update('pcol_01HSGAMXDJD725MR3VSW631DR0', {
                store_id: store3.id,
            }),
            productCollectionService.update('pcol_01HSGAMXDJD725MR3VSW63LEG0', {
                store_id: store4.id,
            }),
            productCollectionService.update('pcol_01HSGAMXDJD725MR3VSW63B0RD', {
                store_id: store5.id,
            }),
            productCollectionService.update('pcol_01HSGAMXDJD725MR3VSW63W0GE', {
                store_id: store6.id,
            }),
            productCollectionService.update('pcol_drones', {
                store_id: store3.id,
            }),
            productCollectionService.update('pcol_sound', {
                store_id: store4.id,
            }),
            productCollectionService.update('pcol_gamefi', {
                store_id: store5.id,
            }),
            productCollectionService.update('pcol_razor', {
                store_id: store6.id,
            }),
            productCollectionService.update('pcol_01HSGAMXDJD725MR3VSW63W0GA', {
                store_id: store7.id,
            }),
            productCollectionService.update('pcol_shake', {
                store_id: store8.id,
            }),
            productCollectionService.update('pcol_lighting', {
                store_id: store9.id,
            }),
            productCollectionService.update('pcol_blocks', {
                store_id: store10.id,
            }),
        ]);
        //assign users to stores
        return res.json({
            user0,
            user1,
            user2,
            user3,
            user4,
            user5,
            user6,
            user7,
            user8,
            user9,
            user10,
            store0,
            store1,
            store2,
            store3,
            store4,
            store5,
            store6,
            store7,
            store8,
            store9,
            store10,
        });
    });
};
exports.POST = POST;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvYXBpL2FkbWluL2N1c3RvbS9zZXR1cC91c2VyL3JvdXRlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUNBLDZEQUF5RDtBQUlsRCxNQUFNLElBQUksR0FBRyxLQUFLLEVBQUUsR0FBa0IsRUFBRSxHQUFtQixFQUFFLEVBQUU7SUFDbEUsTUFBTSxXQUFXLEdBQUcsR0FBRyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDLENBQUM7SUFDckQsTUFBTSxZQUFZLEdBQWlCLEdBQUcsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLGNBQWMsQ0FBQyxDQUFDO0lBQ3JFLE1BQU0sd0JBQXdCLEdBQUcsR0FBRyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQzlDLDBCQUEwQixDQUM3QixDQUFDO0lBRUYsTUFBTSxPQUFPLEdBQWlCLElBQUksNEJBQVksQ0FDMUMsR0FBRyxFQUNILEdBQUcsRUFDSCxNQUFNLEVBQ04sMEJBQTBCLENBQzdCLENBQUM7SUFFRixNQUFNLE9BQU8sQ0FBQyxNQUFNLENBQUMsS0FBSyxJQUFJLEVBQUU7UUFDNUIsTUFBTSxLQUFLLEdBQUcsTUFBTSxPQUFPLENBQUMsR0FBRyxDQUFDO1lBQzVCLFdBQVcsQ0FBQyxNQUFNLENBQ2Q7Z0JBQ0ksS0FBSyxFQUFFLHdCQUF3QjtnQkFDL0IsVUFBVSxFQUFFLFFBQVE7Z0JBQ3BCLFNBQVMsRUFBRSxRQUFRO2dCQUNuQixjQUFjLEVBQ1YsNENBQTRDLENBQUMsV0FBVyxFQUFFO2FBQ2pFLEVBQ0QsVUFBVSxDQUNiO1lBQ0QsV0FBVyxDQUFDLE1BQU0sQ0FDZDtnQkFDSSxLQUFLLEVBQUUseUJBQXlCO2dCQUNoQyxVQUFVLEVBQUUsU0FBUztnQkFDckIsU0FBUyxFQUFFLFFBQVE7Z0JBQ25CLGNBQWMsRUFDViw0Q0FBNEMsQ0FBQyxXQUFXLEVBQUU7YUFDakUsRUFDRCxVQUFVLENB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