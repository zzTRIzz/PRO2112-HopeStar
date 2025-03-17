import { z } from 'zod';

export const billDetailSchema = z.object({
    idBill: z.number().int().positive(),  
    idProductDetail: z.number().int().positive()
});

export type BillDetailSchema = z.infer<typeof billDetailSchema>;
