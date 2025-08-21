import { Card, CardContent } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Plus } from "lucide-react";

const faqs = [
  {
    question: "What is BDSmartLeadX?",
    answer:
      "BDSmartLeadX is a digital services provider that helps you exchange leads and earn money through various online tasks.",
  },
  {
    question: "How to earn from BDSmartLeadX?",
    answer:
      "You can earn by completing tasks, posting jobs, and participating in the lead exchange program.",
  },
  {
    question: "Does BDSmartLeadX charge any fees?",
    answer:
      "BDSmartLeadX has a minimal daily server fee to maintain the platform and ensure quality service.",
  },
  {
    question: "How BDSmartLeadX Work?",
    answer:
      "BDSmartLeadX works by connecting job posters with task completers in a secure and transparent environment.",
  },
  {
    question: "How do I get my leads completed?",
    answer:
      "Once you post a job and it gets approved, it will be available to other users who can complete your tasks.",
  },
  {
    question: "Will users get any support from the owner?",
    answer:
      "Yes, we provide 24/7 customer support through our dedicated support team and multiple communication channels.",
  },
];

export const FAQSection = () => {
  return (
    <section className="py-12 bg-muted/30">
      <div className="max-w-6xl mx-auto ">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 text-success">
          Frequently asked Questions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {faqs.map((faq, index) => (
            <Collapsible key={index}>
              <Card className="bg-white hover:shadow-md transition-shadow relative">
                <CollapsibleTrigger className="w-full text-left">
                  <CardContent className="px-4 py-0">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-foreground pr-4">
                        {faq.question}
                      </span>
                      <Plus className="h-4 w-4 text-success flex-shrink-0" />
                    </div>
                  </CardContent>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent className="px-4 pb-4 pt-0">
                    <p className="text-muted-foreground text-sm">
                      {faq.answer}
                    </p>
                  </CardContent>
                </CollapsibleContent>
              </Card>
            </Collapsible>
          ))}
        </div>
      </div>
    </section>
  );
};
