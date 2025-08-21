import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";

const partners = [
  {
    name: "Mim",
    role: "Freelancer",
    status: "PARTNER",
    avatar: "",
  },
  {
    name: "MD RUMAN",
    role: "Freelancer",
    status: "SUPPORT SYSTEM OPERATOR",
    avatar: "",
  },
  {
    name: "RUMANA",
    role: "Freelancer",
    status: "SUPPORT SYSTEM OPERATOR",
    avatar: "",
  },
];

export const PartnersSection = () => {
  return (
    <section className="py-12 bg-muted/30">
      <div className="max-w-6xl mx-auto ">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 text-foreground">
          Our Partners
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {partners.map((partner, index) => (
            <Card
              key={index}
              className="bg-primary text-primary-foreground text-center"
            >
              <CardContent className="p-6">
                <div className="mb-4">
                  <Avatar className="w-16 h-16 mx-auto mb-3">
                    <AvatarImage src={partner.avatar} />
                    <AvatarFallback className="bg-primary-foreground text-primary">
                      {partner.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <h3 className="font-bold text-lg mb-1">{partner.name}</h3>
                <p className="text-sm opacity-90 mb-2">{partner.role}</p>
                <p className="text-xs font-semibold">{partner.status}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
