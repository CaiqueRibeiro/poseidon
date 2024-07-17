'use client';

import { searchPool } from "@/services/pool-service";
import { Pool } from "commons/models/pool";
import { useEffect, useState } from "react";

type FeeInputProps = {
    poolId: string | null;
    symbol: string;
    onChange: (pool?: Pool) => void
    onError: (msg: string) => void
}

export function FeeInput(props: FeeInputProps) {
    const [pools, setPools] = useState<Pool[]>([]);

    useEffect(() => {
        searchPool(props.symbol)
            .then(pools => {
                setPools(pools)
            })
            .catch(error => props.onError(error ? JSON.stringify(error.response.data) : error.message));
    }, [props.symbol]);

    function onFeeChange(evt: React.ChangeEvent<HTMLSelectElement>) {
        if(evt.target.value === "0") return;
        props.onChange(pools.find(p => p.id === evt.target.value));
    }

    return (
        <div className="flex flex-col justify-start gap-1 w-1/2">
            <label htmlFor="exchange" className="uppercase">Fee</label>
            <select
            name="fee"
            id="fee"
            value={props.poolId || ""}
            onChange={onFeeChange}
            className="bg-gray-50 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5"
            >
                <option value="0">Select...</option>
                {
                    pools.map(p => (<option key={p.id} value={p.id}>{p.fee / 10000}%</option>))
                }
            </select>
        </div>
    )
}