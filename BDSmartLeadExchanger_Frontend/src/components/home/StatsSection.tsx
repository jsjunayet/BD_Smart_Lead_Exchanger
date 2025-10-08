import { Card, CardContent } from "@/components/ui/card";
import { DashboardStatsSkeleton } from "@/components/ui/skeletons";
import { getAllStats } from "@/services/statsService";
import { Suspense } from "react";

const StatsContent = async () => {
  try {
    const response = await getAllStats();
    const data = response?.data || [];

    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {data.map((stat: any, index: any) => (
          <Card
            key={index}
            className="text-center border-2 border-border hover:border-primary/50 transition-colors"
          >
            <CardContent className="p-6">
              <div className="text-2xl md:text-3xl font-bold text-primary mb-2">
                {stat.value}
              </div>
              <div className="text-muted-foreground font-medium">
                {stat.label}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  } catch (error) {
    console.error("Error fetching stats:", error);
    return null;
  }
};

export const StatsSection = () => {
  return (
    <section className="md:py-12 py-0 bg-white  md:px-0 px-2">
      <div className="max-w-6xl mx-auto">
        <Suspense fallback={<DashboardStatsSkeleton />}>
          <StatsContent />
        </Suspense>
      </div>
    </section>
  );
};
