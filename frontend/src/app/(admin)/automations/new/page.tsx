'use client';

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ethers} from 'ethers';
import { AdminNavbar } from "@/components/Dashboard/admin-navbar";
import { Alert } from "@/components/Alert";
import { RadioGroup } from "@/components/RadioGroup";
import { Automation, Condition } from "commons/models/automation";
import { ChainId } from "commons/models/chainId";
import { Exchange } from "commons/models/exchange";
import { PoolInput } from "./pool-input";
import { Pool } from "commons/models/pool";
import { ConditionInput } from "./condition-input";
import { addAutomation, getAutomation, updateAutomation } from "@/services/automation-service";

export default function AutomationManagement() {
    const defaultAutomation = {
        isOpened: false,
        isActive: false,
        network: ChainId.MAINNET,
        exchange: Exchange.Uniswap,
        nextAmount: '0',
    } as Automation;

    const [automation, setAutomation] = useState<Automation>(defaultAutomation);
    const [pool, setPool] = useState<Pool>({} as Pool);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>("");

    const { push } = useRouter();

    const queryString = useSearchParams();
    const automationId = queryString.get("id");

    useEffect(() => {
        if(!automationId) return;
        getAutomation(automationId)
            .then(automation => setAutomation(automation))
            .catch(err => setError(err.response ? JSON.stringify(err.response.data) : err.message));
    }, [automationId]);

    function onAutomationChange(event: React.ChangeEvent<HTMLInputElement>) {
        setAutomation((prevState: any) => ({ ...prevState, [event.target.id]: event.target.value }));
    }

    function onPoolChange(pool: Pool | null) {
        setAutomation((prevState: any) => ({ ...prevState, poolId: pool ? pool.id : null }));
        setPool(pool || {} as Pool);
    }

    function onOpenConditionChange(condition: Condition) {
        setAutomation((prevState: any) => ({ ...prevState, openCondition: condition }));
    }

    function onCloseConditionChange(condition: Condition) {
        setAutomation(prevState => ({ ...prevState, closeCondition: condition }));
    }

    async function handleSubmit() {
        if(!automation.name) {
            setError('Automation name is required');
            return;
        }
        if(!automation.poolId) {
            setError('Automation pool ID is required');
            return;
        }
        if(!confirm('This operation will cost some wei. Are you sure?')) return;
        setError('');
        setIsLoading(true);
        let promise: Promise<Automation>;
        if(automationId) {
            promise = updateAutomation(automationId, automation);
        } else {
            promise = addAutomation(automation);
        }
        promise
            .then(automation => push('/automations'))
            .catch(err => {
                setIsLoading(false);
                setError(err.response ? JSON.stringify(err.response.data) : err.message);
            });
    }

    function getDecimals() {
        let decimals: number = 18;
        if (pool && pool.decimals0 && pool.decimals1) {
            decimals = automation.isOpened ? pool.decimals0 : pool.decimals1;
        }
        return decimals;
    }

    function formatAmount() {
        if(!automation || !automation.nextAmount) return 0;
        const decimals = getDecimals();
        return ethers.formatUnits(automation.nextAmount, decimals) || '0';
    }

    function onAmountChange(event: React.ChangeEvent<HTMLInputElement>) {
        if(isNaN(Number(event.target.value))) return;
        const decimals = getDecimals();
        const amountInWei = ethers.parseUnits(event.target.value, decimals);
        setAutomation((prevState: any) => ({ ...prevState, nextAmount: amountInWei.toString() }));
    }

    function getAmountTooltip() {
        if(!pool || !automation) return "";

        return automation.isOpened
        ? `${pool.symbol0 || 'Symbol0'} to sell`
        : `${pool.symbol1 || 'Symbol1'} to buy ${pool.symbol0 || 'Symbol0'}`;
    }

    return (
      <div className="min-h-screen flex flex-1 flex-col overflow-y-scroll">
        <section className="bg-cyan-950 h-2/5 flex flex-col items-stretch justify-start px-14 py-2">
          <AdminNavbar currentPage="Settings" />
        </section>

        <section className="flex-1 -mt-56 grid h-3/5 px-14">
          <div className="bg-white h-fit rounded-md shadow-md parent flex flex-col items-stretch justify-between flex-1">
                <div className="px-7 py-4 flex items-center justify-between">
                    <h2 className="font-medium text-sm h-[10%]">{automationId ? 'Edit' : 'New'} Automation</h2>
                    <button className="bg-sky-500 text-white rounded-sm px-3 py-1 font-semibold text-sm hover:bg-sky-600" onClick={handleSubmit}>
                        {
                            isLoading ? 'Saving...' : 'Save Automation'
                        }
                    </button>
                </div>

                { error
                    ? <Alert isError={!!error} message={error} />
                    : <></>
                }
                
                <form className="w-full flex flex-col bg-gray-100 flex-1 py-4 px-8 divide-y">
                    <div className="flex flex-col gap-2 pb-5">
                        <h3 className="text-sm text-gray-500 uppercase">General</h3>
                        <div className="flex flex-col justify-start gap-1 w-1/2">
                            <label htmlFor="name" className="uppercase">NAME</label>
                            <input
                            id="name"
                            type="text"
                            placeholder="Automation name"
                            value={automation.name || ''}
                            onChange={onAutomationChange}
                            className="p-2 rounded-sm bg-gray-200 border border-white focus:bg-white focus:outline-none font-light" />
                        </div>

                        <RadioGroup
                            id="isActive"
                            textOn="Automation On"
                            textOff="Automation Off"
                            isOn={automation.isActive}
                            onChange={onAutomationChange}
                        />

                        <RadioGroup
                            id="isOpened"
                            textOn="Is Opened"
                            textOff="Is Closed"
                            isOn={automation.isOpened}
                            onChange={onAutomationChange}
                        />
                    </div>

                    <div className="flex flex-col gap-2 py-5">
                        <h3 className="text-sm text-gray-500 uppercase">Pool</h3>
                        <PoolInput poolId={automation.poolId} onError={setError} onChange={onPoolChange} />
                    </div>

                    <div className="flex flex-col gap-2 pt-5">
                        <h3 className="text-sm text-gray-500 uppercase">Strategy</h3>
                        <ConditionInput
                            id="openCondition"
                            title="Open Condition"
                            symbol0={pool.symbol0}
                            symbol1={pool.symbol1}
                            condition={automation.openCondition}
                            onChange={onOpenConditionChange}
                        />

                        <div className="flex flex-col justify-start gap-1 w-1/4">
                            <label htmlFor="nextAmount" className="uppercase">
                                Wei Amount <span className="text-xs">({getAmountTooltip()})</span>
                            </label>
                            <input
                            id="nextAmount"
                            type="text"
                            value={formatAmount()}
                            onChange={evt => onAmountChange(evt)}
                            className="p-2 rounded-sm bg-gray-200 border border-white focus:bg-white focus:outline-none font-light" />
                        </div>

                        <ConditionInput
                            id="closeCondition"
                            title="Close Condition"
                            symbol0={pool.symbol0}
                            symbol1={pool.symbol1}
                            condition={automation.closeCondition}
                            onChange={onCloseConditionChange}
                        />
                    </div>
                </form>
           </div>
        </section>
      </div>
    );
  }
  