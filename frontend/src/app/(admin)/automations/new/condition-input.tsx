'use client';

import { Condition } from "commons/models/automation";
import { useEffect, useState } from "react";

type ConditionInputProps = {
    id: string;
    title: string;
    symbol0: string;
    symbol1: string;
    condition: Condition | null;
    onChange: (condition: Condition) => void;
}

export function ConditionInput(props: ConditionInputProps) {
    const DEFAULT_CONDITION: Condition = {
        field: 'price0',
        operator: '==',
        value: '0'
    }

    const [condition, setCondition] = useState<Condition>(props.condition || DEFAULT_CONDITION);
    const [symbol0, setSymbol0] = useState<string>("");
    const [symbol1, setSymbol1] = useState<string>("");

    useEffect(() => {
        setSymbol0(props.symbol0 || "Symbol 0");
    }, [props.symbol0]);

    useEffect(() => {
        setSymbol1(props.symbol1 || "Symbol 1");
    }, [props.symbol1]);

    useEffect(() => {
        if(props.condition) {
            setCondition(props.condition);
        }
    }, [props.condition]);

    function onConditionChange(id: string, value?: string | number) {
        if(id === "value" && isNaN(Number(value))) {
            return; // does not allow filling the current key if it's not a number
        }
        setCondition(prevState => ({ ...prevState, [id]: value }));
        props.onChange({ ...condition, [id]: value });
    }

    return (
        <>
        <div className="flex flex-row justify-start gap-5 w-1/2">
            <div className="flex flex-col justify-start gap-1 w-1/2">
                <label htmlFor={`selectField${props.id}`}  className="uppercase">{props.title}</label>
                <select
                    name="fee"
                    id={`selectField${props.id}`}
                    value={condition ? condition.field : "price0"}
                    onChange={evt => onConditionChange("field", evt.target.value)}
                    className="bg-gray-50 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5"
                >
                <option value="price0">{symbol0 + " Price"}</option>
                <option value="price0Change">{symbol0 + " Price %"}</option>
                <option value="price0_15">{symbol0 + " Price (15m)"}</option>
                <option value="price0Change_15">{symbol0 + " Price % (15m)"}</option>
                <option value="price0_60">{symbol0 + " Price (60m)"}</option>
                <option value="price0Change_60">{symbol0 + " Price % (60m)"}</option>

                <option value="price1">{symbol1 + " Price"}</option>
                <option value="price1Change">{symbol1 + " Price %"}</option>
                <option value="price1_15">{symbol1 + " Price (15m)"}</option>
                <option value="price1Change_15">{symbol1 + " Price % (15m)"}</option>
                <option value="price1_60">{symbol1 + " Price (60m)"}</option>
                <option value="price0Change_60">{symbol1 + " Price % (60m)"}</option>
                </select>
            </div>   

            <div className="flex flex-col justify-start gap-1 w-1/2 mt-7">
            {
                condition.field
                ? (
                    <select
                        name="fee"
                        id={`selectOperator${props.id}`}
                        value={condition ? condition.operator : "=="}
                        onChange={evt => onConditionChange("operator", evt.target.value)}
                        className="bg-gray-50 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5"
                    >
                        <option value="==">Equals</option>
                        <option value="!=">Not Equals</option>
                        <option value=">">Greater Than</option>
                        <option value=">=">Greater or Equals</option>
                        <option value="<">Less Than</option>
                        <option value="<=">Less or Equals</option>

                    </select>
                )
                : <></>
            }
            </div>      

            
            <div className="flex flex-col justify-start gap-1 w-1/2 mt-7">
            {
                condition.operator
                ? (
                    <input
                        name="fee"
                        id={`txtValue${props.id}`}
                        value={condition ? condition.value : "0"}
                        onChange={evt => onConditionChange("value", evt.target.value)}
                        className="rounded-sm bg-gray-200 border border-white focus:bg-white focus:outline-none font-light block p-1.5"
                    />
                )
                : <></>
            }
            </div>      
        </div> 
    </>
    )
}