import { z } from 'zod';

export const ImeiSold = z.object({
    id_Imei: z.array(z.number()), // Danh sách số nguyên
    idBillDetail: z.number(), 
});

export type ImeiSoldSchema = z.infer<typeof ImeiSold>;
