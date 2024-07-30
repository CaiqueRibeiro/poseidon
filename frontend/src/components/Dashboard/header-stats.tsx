'use client';

import { SmartToy, AccessTime, CalendarToday, Percent } from "@mui/icons-material";
import { AdminNavbar } from "./admin-navbar";
import { StatisticTopCard } from "./statistic-top-card";
import { useEffect, useState } from "react";
import { getActiveAutomations,  } from "@/services/automation-service";
import { getClosedTrades } from "@/services/trade-service";

export function HeaderStats() {
    const [activeAutomations, setActiveAutomations] = useState<number>(0);
    const [openedAutomations, setOpenedAutomations] = useState<number>(0);

    const [swapsToday, setSwapsToday] = useState<number>(0);
    const [dailyPerformance, setDailyPerformance] = useState<number>(0);

    const [swapsWeek, setSwapsWeek] = useState<number>(0);
    const [weeklyPerformance, setWeeklyPerformance] = useState<number>(0);

    const [monthlyPerformance, setMonthlyPerformance] = useState<number>(0);
    const [lastPerformance, setLastPerformance] = useState<number>(0);


    useEffect(() => {
        const DAY_IN_MS = 60 * 24 * 60 * 60 * 1000;
        const TWO_MONTHS_IN_DAYS = 60;

        getActiveAutomations()
            .then(automations => {
                setActiveAutomations(automations.length);
                setOpenedAutomations(automations.filter(a => a.isOpened).length)
            })
            .catch(err => err.response ? JSON.stringify(err.response.data) : err.message);

        getClosedTrades(new Date(Date.now() - (DAY_IN_MS * TWO_MONTHS_IN_DAYS)))
            .then(trades => {
                trades = trades.map(t => {
                    return {
                        ...t,
                        openDate: new Date(t.openDate!),
                        closeDate: new Date(t.closeDate!)
                    }
                });
                
                // daily trades
                const yesterday = new Date(Date.now() - DAY_IN_MS);
                const todayTrades = trades.filter(t => t.closeDate && t.closeDate > yesterday);
                if(todayTrades && todayTrades.length > 0) {
                    setSwapsToday(todayTrades.length);
                    const performanceOfDay = todayTrades
                        .filter(t => t.pnl !== undefined)
                        .map(t => t.pnl || 0).reduce((a,b) => a + b);
                    setDailyPerformance(performanceOfDay);
                }

                // week trades
                const oneWeekAgo = new Date(Date.now() - (DAY_IN_MS * 7));
                const weekTrades = trades.filter(t => t.closeDate && t.closeDate > oneWeekAgo);
                if(weekTrades && weekTrades.length > 0) {
                    setSwapsWeek(weekTrades.length);
                    const performanceOfWeek = weekTrades
                        .filter(t => t.pnl !== undefined)
                        .map(t => t.pnl || 0).reduce((a,b) => a + b);
                    setWeeklyPerformance(performanceOfWeek);
                }

                // current month trades
                const currentMonth = new Date(Date.now() - (DAY_IN_MS * 30));
                const currentMonthTrades = trades.filter(t => t.closeDate && t.closeDate > currentMonth);
                if(currentMonthTrades && currentMonthTrades.length > 0) {
                    const performanceOfMonth = currentMonthTrades
                        .filter(t => t.pnl !== undefined)
                        .map(t => t.pnl || 0).reduce((a,b) => a + b);
                    setMonthlyPerformance(performanceOfMonth);
                }

                const lastMonthTrades = trades.filter(t => t.closeDate && t.closeDate < currentMonth);
                if(lastMonthTrades && lastMonthTrades.length > 0) {
                    const lastMonthPerformance = lastMonthTrades
                        .filter(t => t.pnl !== undefined)
                        .map(t => t.pnl || 0).reduce((a,b) => a + b);
                    setLastPerformance(lastMonthPerformance);
                }
            })
            .catch(err => err.response ? JSON.stringify(err.response.data) : err.message);
    }, []);

    return (
        <section className="bg-cyan-950 h-2/5 flex flex-col items-stretch justify-start px-14 py-2">
        <AdminNavbar currentPage="Dashboard" />

        <div className="flex my-14 items-center gap-8 justify-between overflow-x-scroll">
          <StatisticTopCard title="Active Automations" value={activeAutomations.toString()} description={`${openedAutomations} positions opened`}>
            <SmartToy />
          </StatisticTopCard>
          <StatisticTopCard title="Trading Day" value={swapsToday.toString()} description={`${dailyPerformance.toFixed(2)} since yesterday`}>
            <AccessTime />
          </StatisticTopCard>
          <StatisticTopCard title="Trading Week" value={swapsWeek.toString()} description={`${weeklyPerformance.toFixed(2)} since last week`}>
            <CalendarToday />
          </StatisticTopCard>
          <StatisticTopCard title="Trading Month" value={`${monthlyPerformance.toFixed(2)}%`} description={`${lastPerformance.toFixed(2)} since last month`}>
            <Percent />
          </StatisticTopCard>
        </div>
      </section>
    )
}