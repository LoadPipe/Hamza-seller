"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = async (container) => {
    const notificationService = container.resolve('notificationService');
    notificationService.subscribe('order.placed', 'smtp-notification');
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibm90aWZpY2F0aW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2xvYWRlcnMvbm90aWZpY2F0aW9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBRUEsa0JBQWUsS0FBSyxFQUFFLFNBQTBCLEVBQWlCLEVBQUU7SUFDL0QsTUFBTSxtQkFBbUIsR0FBRyxTQUFTLENBQUMsT0FBTyxDQUN6QyxxQkFBcUIsQ0FDeEIsQ0FBQztJQUVGLG1CQUFtQixDQUFDLFNBQVMsQ0FBQyxjQUFjLEVBQUUsbUJBQW1CLENBQUMsQ0FBQztBQUN2RSxDQUFDLENBQUMifQ==