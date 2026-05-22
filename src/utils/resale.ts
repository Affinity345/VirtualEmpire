export const RESALE_RATE = 0.7;

export const getResalePrice = (price: number) => Math.floor(price * RESALE_RATE);
