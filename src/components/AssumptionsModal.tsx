import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AlertTriangle, Info } from "lucide-react";

interface AssumptionsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AssumptionsModal = ({ isOpen, onClose }: AssumptionsModalProps) => {
  const assumptions = [
    {
      title: "Simplified Economic Models",
      description:
        "All calculations use simplified formulas that approximate real-world tax calculations. Actual tax liability may vary based on specific circumstances, exemptions, and deductions not covered here.",
    },
    {
      title: "GST Calculations",
      description:
        "Input Tax Credit (ITC) utilization is simplified. Actual ITC depends on the nature of purchases, supplier compliance, and business type.",
    },
    {
      title: "Income Tax Slabs",
      description:
        "Based on FY 2023-24 tax slabs. Does not include surcharge for high income earners or all possible deductions under various sections.",
    },
    {
      title: "Startup India Benefits",
      description:
        "Section 80-IAC benefits require DPIIT recognition and meeting specific criteria. Consult a CA for eligibility assessment.",
    },
    {
      title: "Illustrative Results",
      description:
        "All results are for educational purposes only. They are not predictions or financial advice. Always consult a qualified tax professional for actual tax planning.",
    },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg bg-card border-border">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Info className="h-5 w-5 text-secondary" />
            Assumptions & Disclaimers
          </DialogTitle>
          <DialogDescription>
            Important information about the calculations in this simulator.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {assumptions.map((item, index) => (
            <div
              key={index}
              className="p-4 rounded-lg bg-muted/50 border border-border"
            >
              <h4 className="font-medium text-sm mb-1">{item.title}</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}

          <div className="p-4 rounded-lg bg-destructive/5 border border-destructive/20">
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 text-destructive mt-0.5 shrink-0" />
              <div>
                <h4 className="font-medium text-sm text-destructive mb-1">
                  Not Financial Advice
                </h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  This tool is for educational purposes only. Do not make
                  financial decisions based solely on these simulations. Always
                  consult a qualified Chartered Accountant or tax professional.
                </p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AssumptionsModal;
