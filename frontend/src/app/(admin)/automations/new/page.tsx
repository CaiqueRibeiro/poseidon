'use client';

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AdminNavbar } from "@/components/Dashboard/admin-navbar";
import { Alert } from "@/components/Alert";
import { RadioGroup } from "@/components/RadioGroup";
import { Automation } from "commons/models/automation";
import { ChainId } from "commons/models/chainId";
import { Exchange } from "commons/models/exchange";

export default function AutomationManagement() {
    const defaultAutomation = {
        isOpened: false,
        isActive: false,
        network: ChainId.MAINNET,
        exchange: Exchange.Uniswap,
    } as Automation;

    const [automation, setAutomation] = useState<Automation>(defaultAutomation);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>("");

    const { push } = useRouter();
    const queryString = useSearchParams();
    const automationId = queryString.get("id");

    useEffect(() => {
        if(!automationId) return;
        // get automation
    }, [automationId]);

    function onAutomationChange(event: React.ChangeEvent<HTMLInputElement>) {
        setAutomation((prevState: any) => ({ ...prevState, [event.target.id]: event.target.value }));
    }

    async function handleSubmit() {
        if(!confirm('This operation will cost some wei. Are you sure?')) return;
        setError('');
        setIsLoading(true);
        alert(JSON.stringify(automation));
        // save automation
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
                        <div className="flex flex-row justify-start gap-5 w-1/2">
                            <div className="flex flex-col justify-start gap-1 w-1/2">
                                <label htmlFor="email" className="uppercase">Network</label>
                                <input
                                id="network"
                                type="number"
                                placeholder="Choose a network"
                                value={automation.network || ''}
                                onChange={onAutomationChange}
                                className="p-2 rounded-sm bg-gray-200 border border-white focus:bg-white focus:outline-none font-light" />
                            </div>

                            <div className="flex flex-col justify-start gap-1 w-1/2">
                                <label htmlFor="email" className="uppercase">Network</label>
                                <input
                                id="network"
                                type="number"
                                placeholder="Choose a network"
                                value={automation.network || ''}
                                onChange={onAutomationChange}
                                className="p-2 rounded-sm bg-gray-200 border border-white focus:bg-white focus:outline-none font-light" />
                            </div>
                        </div>

                        <div className="flex flex-row justify-start gap-5 w-1/2">
                            <div className="flex flex-col justify-start gap-1 w-1/2">
                                <label htmlFor="email" className="uppercase">Network</label>
                                <input
                                id="network"
                                type="number"
                                placeholder="Choose a network"
                                value={automation.network || ''}
                                onChange={onAutomationChange}
                                className="p-2 rounded-sm bg-gray-200 border border-white focus:bg-white focus:outline-none font-light" />
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col gap-2 pt-5">
                        <h3 className="text-sm text-gray-500 uppercase">Strategy</h3>
                        <div className="flex flex-col justify-start gap-1 w-1/2">
                            <label htmlFor="nextAmount" className="uppercase">Trade Amount</label>
                            <input
                            id="nextAmount"
                            type="text"
                            placeholder="Trade amount"
                            value={automation.nextAmount || '0'}
                            onChange={onAutomationChange}
                            className="p-2 rounded-sm bg-gray-200 border border-white focus:bg-white focus:outline-none font-light" />
                        </div>
                    </div>
                </form>
           </div>
        </section>
      </div>
    );
  }
  