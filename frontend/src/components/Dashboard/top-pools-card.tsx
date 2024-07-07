'use client';

import { useState, useEffect } from 'react';
import { Pool } from 'commons/models/pool';
import { getTopPools } from '@/services/pool-service';

export function TopPoolsCard() {
    const [pools, setPools] = useState<Pool[]>([]);

    useEffect(() => {
        getTopPools()
            .then(pools => setPools(pools))
            .catch(err => console.error(err))
    }, []);

    return (
        <div className="parent flex flex-col items-stretch justify-between flex-1 h-96">
            <h2 className="px-5 py-3 font-medium text-sm h-[10%]">Top Pools</h2>
            <table className="child table-auto text-sm flex flex-col flex-1 h-[90%]">
                <thead className="bg-gray-100 text-left uppercase">
                    <tr className="flex w-full">
                        <th scope="col" className="px-5 py-2 w-1/3">Symbol</th>
                        <th scope="col" className="px-5 py-2 w-1/3">Price0 change 1h (%)</th>
                        <th scope="col" className="px-5 py-2 w-1/3">Price1 change 1h (%)</th>
                        </tr>
                </thead>
                <tbody className="text-left flex flex-col items-start overflow-y-scroll">
                    {
                        pools && pools.map(p => (
                        <tr className="flex w-full" key={p.id}>
                            <td scope="col" className="px-5 py-2 w-1/3">{p.symbol} ({p.fee / 10000}%)</td>
                            <td scope="col" className="px-5 py-2 w-1/3">{p.price0Change_60}</td>
                            <td scope="col" className="px-5 py-2 w-1/3">{p.price1Change_60}</td>
                        </tr>
                        ))
                    }
                </tbody>
            </table>
        </div>
    )
}