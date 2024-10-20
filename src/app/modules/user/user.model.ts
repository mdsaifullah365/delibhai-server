import bcrypt from 'bcrypt';
import { Schema, model } from 'mongoose';
import config from '../../config';
import { IAddress, IArea, IUser, UserModel } from './user.interface';

const addressSchema = new Schema<IAddress>(
    {
        division: { type: Schema.Types.ObjectId, ref: 'Division' },
        district: { type: Schema.Types.ObjectId, ref: 'District' },
        upazila: { type: Schema.Types.ObjectId, ref: 'Upazila' },
        union: { type: Schema.Types.ObjectId, ref: 'Union' },
        village: { type: Schema.Types.ObjectId, ref: 'Village' },
    },
    { _id: false },
);

const areaSchema = new Schema<IArea>(
    {
        division: { type: Schema.Types.ObjectId, ref: 'Division' },
        district: { type: Schema.Types.ObjectId, ref: 'District' },
        upazila: { type: Schema.Types.ObjectId, ref: 'Upazila' },
        union: { type: Schema.Types.ObjectId, ref: 'Union' },
        village: [{ type: Schema.Types.ObjectId, ref: 'Village' }],
    },
    { _id: false },
);

const userSchema = new Schema<IUser, UserModel>(
    {
        id: { type: String, required: true, unique: true },
        name: { type: String, required: true },
        fatherName: String,
        gender: { type: String, enum: ['পুরুষ', 'মহিলা', 'অন্যান্য'] },
        bloodGroup: {
            type: String,
            enum: ['এ+', 'বি+', 'এবি+', 'ও+', 'এ-', 'বি-', 'এবি-', 'ও-'],
        },
        dateOfBirth: String,
        nid: String,
        nidURL: String,
        avatarURL: String,
        avatarOriginURL: String,
        avatarCropData: {
            unit: String,
            x: Number,
            y: Number,
            width: Number,
            height: Number,
        },
        contactNo1: String,
        contactNo2: String,
        email: String,
        facebookURL: String,
        presentAddress: addressSchema,
        permanentAddress: addressSchema,
        vehicleType: String,
        vehicleBrand: String,
        vehicleModel: String,
        vehicleNumber: String,
        vehicleName: String,
        ownerName: String,
        ownerAddress: addressSchema,
        ownerContactNo: String,
        ownerEmail: String,
        vehiclePhotos: [String],
        serviceType: {
            type: String,
            enum: ['ব্যক্তিগত', 'ভাড়ায় চালিত'],
        },
        rentType: {
            type: String,
            enum: [
                'লোকাল ভাড়া',
                'রিজার্ভ ভাড়া',
                'লোকাল ও রিজার্ভ ভাড়া',
                'কন্টাক্ট ভাড়া',
            ],
        },
        mainStation: addressSchema,
        serviceArea: [areaSchema],
        serviceTimeSlots: [
            {
                start: String,
                end: String,
            },
        ],
        serviceStatus: {
            type: String,
            enum: ['off', 'scheduled', 'on'],
            default: 'scheduled',
        },
        liveLocation: {
            latitude: Number,
            longitude: Number,
            timestamp: Number,
        },
        manualLocation: {
            latitude: Number,
            longitude: Number,
        },
        videoURL: String,
        mobile: { type: String, unique: true },
        password: { type: String, required: true, select: 0 },
        status: {
            type: String,
            enum: ['in-progress', 'active', 'blocked'],
            default: 'in-progress',
        },
        role: {
            type: String,
            required: true,
            enum: ['admin', 'rider'],
        },
        otp: String,
        otpExpires: Date,
        otpSessionExpires: Date,
        tempMobile: String,
        passwordChangedAt: Date,
        isDeleted: { type: Boolean, default: false },
    },
    {
        timestamps: true,
    },
);

userSchema.pre('save', async function (next) {
    this.password = await bcrypt.hash(
        this.password,
        Number(config.bcrypt_salt_rounds),
    );

    next();
});

userSchema.post('save', async function (doc, next) {
    doc.password = '';
    next();
});

userSchema.statics.comparePassword = async function (
    plain: string,
    hashed: string,
) {
    return await bcrypt.compare(plain, hashed);
};

userSchema.statics.isJWTIssuedBeforePasswordChange = function (
    jwtIssuedAt: number,
    passwordChangedAt: Date,
) {
    const passwordChangeTimeStamp = new Date(passwordChangedAt).getTime();
    const jwtIssueTimeStamp = jwtIssuedAt * 1000;

    return passwordChangeTimeStamp > jwtIssueTimeStamp;
};

export const User = model<IUser, UserModel>('User', userSchema);