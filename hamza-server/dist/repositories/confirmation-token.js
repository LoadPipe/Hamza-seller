"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfirmationTokenRepository = void 0;
const database_1 = require("@medusajs/medusa/dist/loaders/database");
const confirmation_token_1 = require("../models/confirmation-token");
exports.ConfirmationTokenRepository = database_1.dataSource.getRepository(confirmation_token_1.ConfirmationToken);
exports.default = exports.ConfirmationTokenRepository;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uZmlybWF0aW9uLXRva2VuLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3JlcG9zaXRvcmllcy9jb25maXJtYXRpb24tdG9rZW4udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEscUVBQW9FO0FBQ3BFLHFFQUFpRTtBQUVwRCxRQUFBLDJCQUEyQixHQUFHLHFCQUFVLENBQUMsYUFBYSxDQUFDLHNDQUFpQixDQUFDLENBQUM7QUFFdkYsa0JBQWUsbUNBQTJCLENBQUMifQ==