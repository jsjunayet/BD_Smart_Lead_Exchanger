import { Card, CardContent } from "@/components/ui/card";

const stats = [
  {
    label: "Registered Users",
    value: "15,271",
  },
  {
    label: "Total Deposit",
    value: "11,053$",
  },
  {
    label: "Total Job Posts",
    value: "11,049",
  },
];

export const StatsSection = () => {
  return (
    <section className="py-12 bg-white">
      <div className="max-w-6xl mx-auto ">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((stat, index) => (
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
      </div>
    </section>
  );
};
