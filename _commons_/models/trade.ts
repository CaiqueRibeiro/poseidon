export class Trade {
    id?: string;
    userId: string;
    automationId: string;
    openDate?: Date;
    closeDate?: Date | null;
    openPrice: number;
    openAmountIn: string;
    openAmountOut: string;
    closePrice?: number | null;
    closeAmountIn?: string | null;
    closeAmountOut?: string | null;
    pnl?: number; // profit and losses

    constructor(trade: Trade) {
        this.id = trade.id;
        this.userId = trade.userId;
        this.automationId = trade.automationId;
        this.openDate = trade.openDate || new Date();
        this.openPrice = trade.openPrice;
        this.openAmountIn = trade.openAmountIn;
        this.openAmountOut = trade.openAmountOut;
        this.closePrice = trade.closePrice || null;
        this.closeAmountIn = trade.closeAmountIn || null;
        this.closeAmountOut = trade.closeAmountOut || null;
        this.pnl = trade.pnl || 0;

    }
}
