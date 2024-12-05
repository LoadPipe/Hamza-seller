"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.filterDuplicatesById = filterDuplicatesById;
function filterDuplicatesById(items) {
    return items.filter((i, index, array) => index === array.findIndex((ii) => ii.id === i.id));
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmlsdGVyLWR1cGxpY2F0ZXMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvdXRpbHMvZmlsdGVyLWR1cGxpY2F0ZXMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFFQSxvREFLQztBQUxELFNBQWdCLG9CQUFvQixDQUEyQixLQUFVO0lBQ3JFLE9BQU8sS0FBSyxDQUFDLE1BQU0sQ0FDZixDQUFDLENBQUMsRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEVBQUUsQ0FDaEIsS0FBSyxLQUFLLEtBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUN4RCxDQUFDO0FBQ04sQ0FBQyJ9