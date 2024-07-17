'use client';

import { getPool, getPoolSymbols } from "@/services/pool-service";
import { Pool } from "commons/models/pool";
import { useEffect, useState } from "react";
import Select from "react-select";
import { FeeInput } from "./fee-input";

type PoolInputProps = {
    poolId: string | null;
    onError: (msg: string) => void;
    onChange: (pool: Pool | null) => void;
}

export type SelectOption = {
    value: string;
    label: string;
}

export function PoolInput(props: PoolInputProps) {
    const [symbol, setSymbol] = useState<string>('');
    const [symbols, setSymbols] = useState<SelectOption[]>([]);

    useEffect(() => {
        getPoolSymbols()
            .then(symbols => {
                const options = [{ value: "ANY", label: "ANY" }];
                options.push(...symbols.map(s => {
                    return { value: s, label: s };
                }));

                setSymbols(options);

                if(props.poolId) {
                    return getPool(props.poolId);
                } else {
                    return;
                }
            })
            .then(pool => {
                pool ? setSymbol(pool.symbol) : setSymbol("ANY");
                props.onChange(pool || null);
            })
            .catch(err => props.onError(err.response ? JSON.stringify(err.response.data) : err.message));
    }, [props.poolId]);

    function onSymbolChange(symbol?: string) {
        setSymbol(symbol || "ANY");
        if(!symbol || symbol === "ANY") {
            props.onChange(null);
            return;
        }
    }

    function onPoolChange(pool?: Pool) {
        props.onChange(pool || null);
    }

    return (
        <>
            <div className="flex flex-row justify-start gap-5 w-1/2">
                <div className="flex flex-col justify-start gap-1 w-1/2">
                    <label htmlFor="network" className="uppercase">Network</label>
                    <input
                    id="network"
                    type="text"
                    value="Ethereum"
                    disabled={true}
                    className="p-2 rounded-sm bg-gray-200 border border-white focus:bg-white focus:outline-none font-light" />
                </div>

                <div className="flex flex-col justify-start gap-1 w-1/2">
                    <label htmlFor="exchange" className="uppercase">Exchange</label>
                    <input
                    id="exchange"
                    type="text"
                    value="Uniswap V3"
                    disabled={true}
                    className="p-2 rounded-sm bg-gray-200 border border-white focus:bg-white focus:outline-none font-light" />
                </div>
            </div>

            <div className="flex flex-row justify-start gap-5 w-1/2">
                <div className="flex flex-col justify-start gap-1 w-1/2">
                    <label htmlFor="selectSymbol" className="uppercase">Symbol</label>
                    <Select
                        id="selectSymbol"
                        instanceId="selectSymbol"
                        value={{ value: symbol, label: symbol }}
                        onChange={option => onSymbolChange(option?.value)}
                        getOptionLabel={(f: SelectOption) => f.label}
                        getOptionValue={(f: SelectOption) => f.value}
                        isSearchable={true}
                        options={symbols}
                        className="bg-gray-50 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block"
                    />
                </div>    

                {
                    symbol && symbol !== "ANY"
                    ? <FeeInput poolId={props.poolId} symbol={symbol} onChange={onPoolChange} onError={props.onError} />
                    : <></>
                }           
            </div> 
        </>
    )
}