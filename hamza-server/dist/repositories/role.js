"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoleRepository = void 0;
const role_1 = require("../models/role");
const database_1 = require("@medusajs/medusa/dist/loaders/database");
exports.RoleRepository = database_1.dataSource.getRepository(role_1.Role);
exports.default = exports.RoleRepository;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm9sZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9yZXBvc2l0b3JpZXMvcm9sZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSx5Q0FBc0M7QUFDdEMscUVBQW9FO0FBRXZELFFBQUEsY0FBYyxHQUFHLHFCQUFVLENBQUMsYUFBYSxDQUFDLFdBQUksQ0FBQyxDQUFDO0FBRTdELGtCQUFlLHNCQUFjLENBQUMifQ==