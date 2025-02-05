"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isCurrentTimeWithinServiceTimes = exports.calculateTimeInMinutes = exports.generateRiderId = void 0;
const user_constant_1 = require("../user/user.constant");
const user_model_1 = require("../user/user.model");
const findLastRiderId = () => __awaiter(void 0, void 0, void 0, function* () {
    const lastRider = yield user_model_1.User.findOne({ role: user_constant_1.USER_ROLE.rider, status: { $ne: 'in-progress' } }, { id: 1 }, { getDeletedDocs: true }).sort({
        createdAt: -1,
    });
    return (lastRider === null || lastRider === void 0 ? void 0 : lastRider.id) ? lastRider.id.substring(2) : undefined;
});
const generateRiderId = () => __awaiter(void 0, void 0, void 0, function* () {
    const lastRiderId = yield findLastRiderId();
    const currentId = Number(lastRiderId) || 0;
    const incrementedId = (currentId + 1).toString().padStart(6, '0');
    return `DR${incrementedId}`;
});
exports.generateRiderId = generateRiderId;
const calculateTimeInMinutes = (time) => {
    const timeArray = time.split(':');
    const hour = Number(timeArray[0]);
    const minute = Number(timeArray[1]);
    return hour * 60 + minute;
};
exports.calculateTimeInMinutes = calculateTimeInMinutes;
const isCurrentTimeWithinServiceTimes = (slots = []) => {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const currentTimeInMinutes = currentHour * 60 + currentMinute;
    for (const slot of slots) {
        const slotStartMinutes = (0, exports.calculateTimeInMinutes)(slot.start);
        const slotEndMinutes = (0, exports.calculateTimeInMinutes)(slot.end);
        if (currentTimeInMinutes >= slotStartMinutes &&
            currentTimeInMinutes <= slotEndMinutes) {
            return true;
        }
    }
    return false;
};
exports.isCurrentTimeWithinServiceTimes = isCurrentTimeWithinServiceTimes;
