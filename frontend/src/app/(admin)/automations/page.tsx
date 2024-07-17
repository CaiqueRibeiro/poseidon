'use client';

import { AdminNavbar } from "@/components/Dashboard/admin-navbar";
import { PlayArrow, StopRounded, Edit, Delete } from '@mui/icons-material';
import { useRouter } from 'next/navigation';

export default function Automations() {
    const { push } = useRouter();

    function btnNewAutomationClick() {
      push('automations/new');
    }

    return (
      <div className="min-h-screen flex flex-1 flex-col overflow-y-scroll">
        <section className="bg-cyan-950 h-2/5 flex flex-col items-stretch justify-start px-14 py-2">
          <AdminNavbar currentPage="Automations" />
        </section>

        <section className="flex-1 -mt-20 grid h-3/5 px-14">
          <div className="bg-white h-fit max-h-96 overflow-hidden rounded-md shadow-md parent flex flex-col items-stretch justify-between flex-1">
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
                <tbody className="text-left flex flex-col items-start overflow-y-scroll">
                    <tr className="flex w-full">
                        <td scope="col" className="px-5 py-4 w-1/4 font-bold">Automation 1</td>
                        <td scope="col" className="px-5 py-4 w-1/4 flex items-center gap-2">
                          <div className="rounded-full h-2 w-2 bg-orange-500"></div>
                          Ready to buy
                        </td>
                        <td scope="col" className="px-5 py-4 w-1/4 flex items-center gap-2">
                          <div className="rounded-full h-2 w-2 bg-orange-500"></div>
                          Pending
                        </td>
                        <td scope="col" className="px-5 py-4 w-1/5">
                          <PlayArrow />
                          <StopRounded />
                          <Edit />
                          <Delete />
                        </td>
                    </tr>
                    <tr className="flex w-full">
                        <td scope="col" className="px-5 py-4 w-1/4 font-bold">Automation 1</td>
                        <td scope="col" className="px-5 py-4 w-1/4 flex items-center gap-2">
                          <div className="rounded-full h-2 w-2 bg-orange-500"></div>
                          Ready to buy
                        </td>
                        <td scope="col" className="px-5 py-4 w-1/4 flex items-center gap-2">
                          <div className="rounded-full h-2 w-2 bg-orange-500"></div>
                          Pending
                        </td>
                        <td scope="col" className="px-5 py-4 w-1/5">
                          <PlayArrow />
                          <StopRounded />
                          <Edit />
                          <Delete />
                        </td>
                    </tr>
                </tbody>
            </table>
           </div>
        </section>
      </div>
    );
  }
  