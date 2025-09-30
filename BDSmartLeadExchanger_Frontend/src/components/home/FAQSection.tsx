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
      "BDSmartLeadX is an online platform that lets you exchange leads and earn money by performing digital tasks.",
  },
  {
    question: "How can I earn with BDSmartLeadX?",
    answer:
      "You can earn through task completion, posting jobs, and participating in the lead exchange system.",
  },
  {
    question: " Does BDSmartLeadX require any fees?",
    answer:
      "A minimal daily maintenance fee is charged to keep the service smooth and reliable.",
  },
  {
    question: "How does BDSmartLeadX function?",
    answer:
      "It works by securely connecting job posters with task completers in a transparent environment.",
  },
  {
    question: "How do I get my leads done?",
    answer:
      "Once your job is approved, it will be visible to other users who can finish your tasks.",
  },
  {
    question: "Will I get support if needed?",
    answer:
      "Yes, our support team is available 24/7 with multiple channels to assist you anytime..",
  },
];

export const FAQSection = () => {
  return (
    <section className="py-12 bg-muted/30">
      <div className="max-w-6xl mx-auto ">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 text-success">
          Help & Information Hub
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
