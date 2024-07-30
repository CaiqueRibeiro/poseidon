import { DashboardCard } from "./dashboard-card";

type StatisticTopCardProps = {
    title: string;
    value: string;
    description: string;
    children: React.ReactNode;
};

export function StatisticTopCard({ title, value, description, children }: StatisticTopCardProps) {
    return (
        <DashboardCard>
            <div className="flex gap-3 flex-col font-light text-sm">
                <div className="flex self-stretch justify-between items-start">
                    <div className="flex flex-col items-start">
                    <h2 className="text-sm text-gray-500">{title.toLocaleUpperCase()}</h2>
                    <span className="text-lg font-bold">{value}</span>
                    </div>
                    <div className="rounded-full bg-green-500 w-11 h-11 flex items-center justify-center text-white">
                        {children}
                    </div>
                </div>

                <span className="text-gray-500">{description}</span>
            </div>
      </DashboardCard>
    );
}