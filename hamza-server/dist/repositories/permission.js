"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PermissionRepository = void 0;
const permission_1 = require("../models/permission");
const database_1 = require("@medusajs/medusa/dist/loaders/database");
exports.PermissionRepository = database_1.dataSource.getRepository(permission_1.Permission);
exports.default = exports.PermissionRepository;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGVybWlzc2lvbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9yZXBvc2l0b3JpZXMvcGVybWlzc2lvbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxxREFBa0Q7QUFDbEQscUVBQW9FO0FBRXZELFFBQUEsb0JBQW9CLEdBQUcscUJBQVUsQ0FBQyxhQUFhLENBQUMsdUJBQVUsQ0FBQyxDQUFDO0FBRXpFLGtCQUFlLDRCQUFvQixDQUFDIn0=