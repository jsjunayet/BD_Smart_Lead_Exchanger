import { Card, CardContent } from "@/components/ui/card";

const services = [
  {
    title: "From here you can exchange your CPA leads.",
    description: "Exchange your leads efficiently",
    bgColor: "bg-gradient-to-br from-cyan-400 to-cyan-500",
    textColor: "text-white",
  },
  {
    title: "Create your smart link here for best marketing.",
    description: "Smart marketing solutions",
    bgColor: "bg-gradient-to-br from-purple-500 to-indigo-500",
    textColor: "text-white",
  },
  {
    title: "The best virtual shopping center for you.",
    description: "Virtual shopping experience",
    bgColor: "bg-gradient-to-br from-blue-400 to-blue-500",
    textColor: "text-white",
  },
  {
    title: "Best e-solutions services.",
    description: "Complete digital solutions",
    bgColor: "bg-gradient-to-br from-teal-600 to-emerald-700",
    textColor: "text-white",
  },
];

export const ServiceSection = () => {
  return (
    <section className="py-12 bg-muted/30">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {services.map((service, index) => (
            <Card
              key={index}
              className={`${service.bgColor} border-0 overflow-hidden h-48`}
            >
              <CardContent className="p-6 h-full flex flex-col justify-center items-center text-center">
                <h3
                  className={`text-lg font-semibold mb-2 ${service.textColor}`}
                >
                  {service.title}
                </h3>
                <p className={`text-sm ${service.textColor} opacity-90`}>
                  {service.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
