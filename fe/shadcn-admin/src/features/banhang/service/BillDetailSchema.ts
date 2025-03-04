import { z } from 'zod';

export const billDetailSchema = z.object({
    id_bill: z.number().int().positive(),  
    id_product_detail: z.number().int().positive(), 
    quantity: z.number().int().min(0).default(0),  
    price: z.number().nonnegative(),  
    total_price: z.number().nonnegative(), 
});

export type BillDetailSchema = z.infer<typeof billDetailSchema>;
