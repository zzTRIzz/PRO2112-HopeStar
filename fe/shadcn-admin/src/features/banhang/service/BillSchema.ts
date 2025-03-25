import { z } from 'zod';

export const billSchema = z.object({
    id: z.number().int().positive(),
    nameBill: z.string().max(255),
    idAccount: z.number().int().positive().nullable(),
    idNhanVien: z.number().int().positive().nullable(),
    idVoucher: z.number().int().positive().nullable(),
    totalPrice: z.number().nonnegative().default(0),
    customerPayment: z.number().nonnegative().default(0),
    amountChange: z.number().nonnegative().default(0),
    deliveryFee: z.number().nonnegative().default(0),
    totalDue: z.number(),
    customerRefund: z.number().nonnegative().default(0),
    discountedTotal: z.number().nonnegative().default(0),
    deliveryDate: z.string().datetime().nullable(),
    customerPreferred_date: z.string().datetime().nullable(),
    customerAppointment_date: z.string().datetime().nullable(),
    receiptDate: z.string().datetime().nullable(),
    paymentDate: z.string().datetime().nullable(),
    billType: z.number().int().default(0),
    status:z.string().max(255),
    address: z.string().max(255).nullable(),
    email: z.string().email().max(255).nullable(),
    note: z.string().max(1000).nullable(),
    phone: z.string().max(255).nullable(),
    name: z.string().max(255),
    idPayment: z.number().int().positive().nullable(),
    idDelivery: z.number().int().positive().nullable(),
    itemCount: z.number().int().positive(),
});

export type BillSchema = z.infer<typeof billSchema>;

export const Voucher = z.object({
    id: z.number(),
    code: z.string(),
    name: z.string(),
    conditionPriceMin: z.number(),
    conditionPriceMax: z.number(),
    discountValue: z.number(),
    voucherType: z.boolean(),
    quantity: z.number(),
    startTime: z.string(),
    endTime: z.string(),
    status: z.string(),
});

export type Voucher = z.infer<typeof Voucher>;