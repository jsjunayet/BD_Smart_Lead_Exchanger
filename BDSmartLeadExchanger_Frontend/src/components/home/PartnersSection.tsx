import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { getAllHome } from "@/services/userService";

export const revalidate = 60;
export const PartnersSection = async () => {
  const response = await getAllHome();
  const data = response?.data || [];
  console.log(data);
  return (
    <section className="md:py-12 py-10 bg-muted/30  md:px-0 px-2">
      <div className="max-w-6xl mx-auto ">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 text-foreground">
          The Team Behind the Vision
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {data.map((partner: any, index: any) => (
            <Card
              key={index}
              className="bg-gradient-to-r from-blue-600 to-green-600  text-white  text-center"
            >
              <CardContent className="p-6">
                <div className="mb-4">
                  <Avatar className="w-16 h-16 mx-auto mb-3">
                    <AvatarImage src={partner.ProfileImage} />
                    <AvatarFallback className="bg-primary-foreground text-primary">
                      {partner.name
                        .split(" ")
                        .map((n: any) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <h3 className="font-bold text-lg mb-1">{partner.name}</h3>
                <p className="text-sm opacity-90 mb-2">
                  {partner.role.charAt(0).toUpperCase() + partner.role.slice(1)}
                </p>
                <hr className="py-2" />
                <p className="text-xs font-semibold">
                  {"Support & Solutions Officer"}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
