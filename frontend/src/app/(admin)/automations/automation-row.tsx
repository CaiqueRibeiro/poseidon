'use client';

import { Automation } from "commons/models/automation";
import { PlayArrow, StopRounded, Edit, Delete } from '@mui/icons-material';
import { deleteAutomation, startAutomation, stopAutomation } from "@/services/automation-service";
import { useRouter } from 'next/navigation';

type AutomationRowProps = {
    data: Automation;
    onUpdate: Function;
}

export function AutomationRow(props: AutomationRowProps) {
  const { push } = useRouter();

  function getPositionClass(isOpened: boolean) {
    return isOpened ? "bg-emerald-500" : "bg-red-500";
  }
  
  function getPositionText(isOpened: boolean) {
    return isOpened ? "Ready to sell" : "Ready to buy";
  }
  
  function getActiveClass(isActive: boolean) {
    return isActive ? "bg-emerald-500" : "bg-red-500";
  }
  
  function getActiveText(isActive: boolean) {
    return isActive ? "Running" : "Stopped";
  }
  
  async function btnStartClick() {
    try {
      await startAutomation(props.data.id!);
      alert('Automation started successfully');
      props.onUpdate();
    } catch (err: any) {
      alert(err.response ? JSON.stringify(err.response.data) : err.message);
    }
  }

  async function btnEditClick() {
    push(`/automations/new?id=${props.data.id}`);
  }

  async function btnDeleteClick() {
    try {
      if(!confirm('This operation is irreversible. Are you sure?')) return;
      await deleteAutomation(props.data.id!);
      alert('Automation deleted successfully');
      props.onUpdate();
    } catch (err: any) {
      alert(err.response ? JSON.stringify(err.response.data) : err.message);
    }
  }

  async function btnStopClick() {
    try {
      await stopAutomation(props.data.id!);
      alert('Automation stopped successfully');
      props.onUpdate();
    } catch (err: any) {
      alert(err.response ? JSON.stringify(err.response.data) : err.message);
    }
  }

    return (
      <tr className="flex w-full">
        <td scope="col" className="px-5 py-4 w-1/4 font-bold">{props.data.name}</td>
        <td scope="col" className="px-5 py-4 w-1/4 flex items-center gap-2">
          <div className={`rounded-full h-2 w-2 ${getPositionClass(props.data.isOpened)}`}></div>
          {getPositionText(props.data.isOpened)}
        </td>
        <td scope="col" className="px-5 py-4 w-1/4 flex items-center gap-2">
          <div className={`rounded-full h-2 w-2 ${getActiveClass(props.data.isActive)}`}></div>
          {getActiveText(props.data.isActive)}
        </td>
        <td scope="col" className="px-5 py-4 w-1/5">
        {
          props.data.isActive
          ? (
            <>
              <button onClick={btnStopClick}><StopRounded /></button>
              <button onClick={btnEditClick}><Edit /></button>
            </>
          )
          : (
            <>
              <button onClick={btnStartClick}><PlayArrow /></button>
              <button onClick={btnEditClick}><Edit /></button>
              <button onClick={btnDeleteClick}><Delete /></button>
            </>
          )
        }
        </td>
      </tr>
    )
}