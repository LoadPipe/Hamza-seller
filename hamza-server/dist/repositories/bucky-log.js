"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BuckyLogRepository = void 0;
const bucky_log_1 = require("../models/bucky-log");
const database_1 = require("@medusajs/medusa/dist/loaders/database");
exports.BuckyLogRepository = database_1.dataSource.getRepository(bucky_log_1.BuckyLog);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVja3ktbG9nLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3JlcG9zaXRvcmllcy9idWNreS1sb2cudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsbURBQStDO0FBQy9DLHFFQUFvRTtBQUV2RCxRQUFBLGtCQUFrQixHQUFHLHFCQUFVLENBQUMsYUFBYSxDQUFDLG9CQUFRLENBQUMsQ0FBQyJ9