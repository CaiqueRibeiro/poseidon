'use client';

import { AdminNavbar } from "@/components/Dashboard/admin-navbar";
import { getAutomations } from "@/services/automation-service";
import { Automation } from "commons/models/automation";
import { useRouter } from 'next/navigation';
import { useEffect, useState } from "react";
import { AutomationRow } from "./automation-row";

export default function Automations() {
  const [automations, setAutomations] = useState<Automation[]>([]);
  const [reload, setReload] = useState<number>(0);

    const { push } = useRouter();

    useEffect(() => {
      getAutomations(1, 100)
        .then(automations => setAutomations(automations))
        .catch(err => alert(err.response ? JSON.stringify(err.response.data) : err.message))
      ;
    }, [reload]);

    function btnNewAutomationClick() {
      push('automations/new');
    }

    return (
      <div className="min-h-screen flex flex-1 flex-col overflow-y-scroll">
        <section className="bg-cyan-950 h-2/5 flex flex-col items-stretch justify-start px-14 py-2">
          <AdminNavbar currentPage="Automations" />
        </section>

        <section className="flex-1 -mt-20 grid h-3/5 px-14">
          <div className="bg-white h-fit max-h-96 rounded-md shadow-md parent flex flex-col items-stretch justify-between flex-1">
          <div className="px-7 py-4 flex items-center justify-between">
                    <h2 className="font-medium text-sm h-[10%]"></h2>
                    <button className="bg-sky-500 text-white rounded-sm px-3 py-1 font-semibold text-sm hover:bg-sky-600" onClick={btnNewAutomationClick}>
                      New Automation
                    </button>
                </div>            <table className="child table-auto text-sm flex flex-col flex-1 h-[90%]">
                <thead className="bg-gray-100 text-left uppercase">
                    <tr className="flex w-full">
                        <th scope="col" className="px-5 py-2 w-1/4">Automation</th>
                        <th scope="col" className="px-5 py-2 w-1/4">Position</th>
                        <th scope="col" className="px-5 py-2 w-1/4">Status</th>
                        <th scope="col" className="px-5 py-2 w-1/4">Actions</th>
                        </tr>
                </thead>
                <tbody className="text-left flex max-h-72 flex-col items-start overflow-y-scroll">
                  {
                    automations.length > 0
                    ? automations.map(automation => <AutomationRow key={automation.id!} data={automation} onUpdate={() => setReload(Date.now)} />)
                    :
                    <tr>
                      <td colSpan={4} className="border-t-0 px-6 align-middle border-l-0 text-xs whitespace-nowrap p-4">
                        0 automations found. Create one.
                      </td>
                    </tr>
                  }
                </tbody>
            </table>
           </div>
        </section>
      </div>
    );
  }
  