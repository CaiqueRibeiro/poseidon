import { Pool } from "commons/models/pool";
import automationsRepository from "./repositories/automationsRepository";
import { Automation } from "commons/models/automation";
import usersRepository from "./repositories/usersRepository";
import { swap } from "commons/services/uniswapService";
import sendMail from "./services/mailService";
import Config from './config';
import tradesRepository from "./repositories/tradesRepository";
import { PoseidonWSS } from "./wss";

function evalCondition(automation: Automation, pool: Pool): boolean {
    const condition = automation.isOpened ? automation.closeCondition : automation.openCondition;
    if(!condition) return false;

    const ifCondition = `pool.${condition.field}${condition.operator}${condition.value}`;

    // creates a dynamic function that has "pool" as argument and return the boolean condition
    return Function("pool", "return " + ifCondition)(pool);
}

export default async(pool: Pool, WSS: PoseidonWSS): Promise<void> => {
    // search automations
    const automations = await automationsRepository.searchAutomation(pool.id);
    if(!automations || automations.length == 0) return;

    automations.map(async automation => {
        const isValid = evalCondition(automation, pool);
        if(!isValid) return;

        console.log(`${automation.name} fired!`);
        
        const user = await usersRepository.getUserById(automation.userId);
        if(!user || !user.privateKey) return;

        console.log(`${user.email} will swap.`);

        try {
            const swapResult = await swap(user, automation, pool);
            if(!swapResult) return;
            if(swapResult.amountOut) {
                automation.nextAmount = swapResult.amountOut; // What I received now is what I'll use in next swap
            }
            let trade;
            if(automation.isOpened) {
                trade = await tradesRepository.closeTrade(automation.userId, automation.id!, swapResult);
                automation.tradeCount = automation.tradeCount ? automation.tradeCount + 1 : 1;
                automation.pnl = automation.pnl ? automation.pnl + trade?.pnl! : trade?.pnl;
            } else {
                trade = await tradesRepository.addTrade({
                    automationId: automation.id!,
                    userId: automation.userId,
                    openAmountIn: swapResult.amountIn,
                    openAmountOut: swapResult.amountOut,
                    openPrice: swapResult.price
                });
                WSS.direct(automation.userId, { type: 'success', trade});
            }
            automation.isOpened = !automation.isOpened; // switch the situation
        } catch(err: any) {
            console.error(`Cannot swap. Automation ID: ${automation.id}`);
            automation.isActive = false;

            WSS.direct(automation.userId, { type: 'error', text: err.message });

            await sendMail(user.email, "Poseidon - Automation Error", `
                Hi, ${user.name}!

                Your automation was stopped due to an error.

                ${Config.SITE_URL}/pay/${user.address}

                See ya!

                Admin.
            `);
        }

        await automationsRepository.updateAutomation(automation);
    });
    // make swaps
    // update automation
    // register trade
}