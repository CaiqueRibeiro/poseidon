import { HeaderStats } from "@/components/Dashboard/header-stats";
import { TopAutomationsCard } from "@/components/Dashboard/top-automations-card";
import { TopPoolsCard } from "@/components/Dashboard/top-pools-card";
import TradingViewWidget from "@/components/Dashboard/trading-view-widget";
import { Toast } from "@/components/Toast";

export default function Dashboard() {
    return (
      <>
        <div className="min-h-screen flex flex-1 flex-col overflow-y-scroll">
          <HeaderStats />

          <section className="flex-1 -mt-20 grid h-3/5 grid-cols-1 sm:grid-cols-3 gap-y-8 sm:gap-8 px-14">
            <div className="bg-white col-span-3 h-96 overflow-hidden shadow-md rounded-md">
              <TradingViewWidget />
            </div>
            <div className="bg-white h-96 col-span-2 shadow-md rounded-md">
              <TopPoolsCard />
            </div>
            <div className="bg-white col-span-1 shadow-md rounded-md">
              <TopAutomationsCard />
            </div>
          </section>
        </div>
        <Toast />
      </>
    );
  }
  