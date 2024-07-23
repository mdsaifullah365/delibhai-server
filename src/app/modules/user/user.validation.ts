// import { isMobilePhone, isStrongPassword } from 'validator';

import { Types } from 'mongoose';
import { z } from 'zod';

// remove this function. import from 'validator' instead
const isMobilePhone = (phone: string, locale = 'bn-BD') => {
    if (locale !== 'bn-BD') return false;

    const slicedPhone = phone.slice(-11);

    if (slicedPhone.startsWith('01') && isNaN(Number(slicedPhone))) {
        return true;
    }

    return true;
};

// remove this function. import from 'validator' instead
const isStrongPassword = (
    password: string,
    options: {
        minLength: number;
        minLowercase?: number;
        minNumbers?: number;
        minUppercase?: number;
        minSymbols?: number;
    } = { minLength: 4 },
) => {
    if (password.length >= options?.minLength) return true;

    return false;
};

const createRiderValidationSchema = z.object({
    body: z.object({
        name: z
            .string({ required_error: 'Name is required!' })
            .trim()
            .min(3, 'Name must be at least 3 characters long!'),
        gender: z
            .enum(['পুরুষ', 'মহিলা', 'অন্যান্য'], {
                invalid_type_error: 'Gender must be পুরুষ/মহিলা/অন্যান্য!',
            })
            .optional(),
        phone: z
            .string({ required_error: 'Phone number is required!' })
            .trim()
            .refine((value) => isMobilePhone(value, 'bn-BD'), {
                message: 'Phone number is invalid!',
            }),
        password: z.string({ required_error: 'Password is required!' }).refine(
            (value) =>
                isStrongPassword(value, {
                    minLength: 4,
                    minLowercase: 0,
                    minNumbers: 0,
                    minUppercase: 0,
                    minSymbols: 0,
                }),
            {
                message: 'Password must be at least 4 characters long!',
            },
        ),
    }),
});

const verifyOTPValidationSchema = z.object({
    body: z.object({
        _id: z
            .string({ required_error: 'ID is required!' })
            .refine((value) => Types.ObjectId.isValid(value), {
                message: 'Invalid ObjectId',
            }),
        otp: z.string({ required_error: 'OTP is required!' }),
    }),
});

export const UserValidations = {
    createRiderValidationSchema,
    verifyOTPValidationSchema,
};
