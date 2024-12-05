"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppLogRepository = void 0;
const app_log_1 = require("../models/app-log");
const database_1 = require("@medusajs/medusa/dist/loaders/database");
exports.AppLogRepository = database_1.dataSource.getRepository(app_log_1.AppLog);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLWxvZy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9yZXBvc2l0b3JpZXMvYXBwLWxvZy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSwrQ0FBMkM7QUFDM0MscUVBQW9FO0FBRXZELFFBQUEsZ0JBQWdCLEdBQUcscUJBQVUsQ0FBQyxhQUFhLENBQUMsZ0JBQU0sQ0FBQyxDQUFDIn0=