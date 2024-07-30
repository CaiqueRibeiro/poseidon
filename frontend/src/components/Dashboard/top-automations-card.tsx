'use client';

import { getTopAutomations } from "@/services/automation-service";
import { Automation } from "commons/models/automation";
import { useEffect, useState } from "react";

export function TopAutomationsCard() {
    const [automations, setAutomations] = useState<Automation[]>([]);

    useEffect(() => {
        getTopAutomations()
            .then(automations => setAutomations(automations))
            .catch(err => console.log(err.response ? JSON.stringify(err.response.data) : err.message));
    }, []);
    return (
        <div className="parent flex flex-col items-stretch justify-between flex-1 h-96">
            <h2 className="px-5 py-3 font-medium text-sm h-[10%]">Top Automations</h2>
            <table className="child table-auto text-sm flex flex-col flex-1 h-[90%]">
                <thead className="bg-gray-100 text-left uppercase">
                    <tr className="flex w-full">
                        <th scope="col" className="px-5 py-2 w-1/3">Name</th>
                        <th scope="col" className="px-5 py-2 w-1/3">Trades</th>
                        <th scope="col" className="px-5 py-2 w-1/3">PnL</th>
                        </tr>
                </thead>
                <tbody className="text-left flex flex-col items-start overflow-y-scroll">
                    {
                        automations && automations.map(automation => (
                            <tr key={automation.id} className="flex w-full">
                                <td scope="col" className="px-5 py-2 w-1/3 font-bold">{automation.name}</td>
                                <td scope="col" className="px-5 py-2 w-1/3">{automation.tradeCount || 0}</td>
                                <td scope="col" className="px-5 py-2 w-1/3">{automation.pnl ? automation.pnl.toFixed(2) : 0}%</td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>
        </div>
    )
}