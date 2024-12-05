"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WhiteListRepository = void 0;
const whitelist_1 = require("../models/whitelist");
const database_1 = require("@medusajs/medusa/dist/loaders/database");
exports.WhiteListRepository = database_1.dataSource.getRepository(whitelist_1.WhiteList);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2hpdGVsaXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3JlcG9zaXRvcmllcy93aGl0ZWxpc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsbURBQWdEO0FBQ2hELHFFQUFvRTtBQUV2RCxRQUFBLG1CQUFtQixHQUFHLHFCQUFVLENBQUMsYUFBYSxDQUFDLHFCQUFTLENBQUMsQ0FBQyJ9