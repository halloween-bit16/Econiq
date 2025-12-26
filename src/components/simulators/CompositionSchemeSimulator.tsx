import { useState, useMemo } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { CheckCircle, XCircle, AlertTriangle } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

const formatCurrency = (value: number) => {
  if (value >= 10000000) {
    return `₹${(value / 10000000).toFixed(2)} Cr`;
  } else if (value >= 100000) {
    return `₹${(value / 100000).toFixed(2)} L`;
  }
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
};

const COMPOSITION_LIMIT = 15000000; // ₹1.5 crore
const GST_THRESHOLD = 4000000; // ₹40 lakhs

const CompositionSchemeSimulator = () => {
  const [annualTurnover, setAnnualTurnover] = useState(8000000);
  const [useComposition, setUseComposition] = useState(true);
  const [businessType, setBusinessType] = useState<"manufacturer" | "trader" | "restaurant">("trader");
  const [estimatedPurchases, setEstimatedPurchases] = useState(50); // % of turnover

  const calculations = useMemo(() => {
    const isEligible = annualTurnover <= COMPOSITION_LIMIT;
    const isGSTRequired = annualTurnover >= GST_THRESHOLD;
    
    const compositionRates: Record<string, number> = {
      manufacturer: 1,
      trader: 1,
      restaurant: 5,
    };
    
    const compositionRate = compositionRates[businessType];
    const regularGSTRate = 18;
    
    // Regular GST calculations
    const regularGSTOnSales = (annualTurnover * regularGSTRate) / 100;
    const purchaseAmount = (annualTurnover * estimatedPurchases) / 100;
    const inputTaxCredit = (purchaseAmount * regularGSTRate) / 100;
    const netRegularGST = regularGSTOnSales - inputTaxCredit;
    
    // Composition scheme tax
    const compositionTax = (annualTurnover * compositionRate) / 100;
    
    // Lost ITC under composition
    const lostITC = inputTaxCredit;
    
    // Net benefit/loss of composition
    const compositionBenefit = netRegularGST - compositionTax;
    const actualBenefit = compositionTax < netRegularGST;
    
    // Compliance costs
    const regularComplianceCost = 48000; // Monthly returns, detailed records
    const compositionComplianceCost = 12000; // Quarterly returns, simpler
    
    return {
      isEligible,
      isGSTRequired,
      compositionRate,
      regularGSTOnSales,
      inputTaxCredit,
      netRegularGST,
      compositionTax,
      lostITC,
      compositionBenefit,
      actualBenefit,
      regularComplianceCost,
      compositionComplianceCost,
      totalRegularCost: netRegularGST + regularComplianceCost,
      totalCompositionCost: compositionTax + compositionComplianceCost,
    };
  }, [annualTurnover, businessType, estimatedPurchases]);

  const comparisonData = [
    {
      name: "Regular GST",
      tax: calculations.netRegularGST,
      compliance: calculations.regularComplianceCost,
      fill: useComposition ? "hsl(220, 15%, 30%)" : "hsl(142, 76%, 45%)",
    },
    {
      name: "Composition",
      tax: calculations.compositionTax,
      compliance: calculations.compositionComplianceCost,
      fill: useComposition ? "hsl(142, 76%, 45%)" : "hsl(220, 15%, 30%)",
    },
  ];

  const getEligibilityStatus = () => {
    if (!calculations.isGSTRequired) {
      return {
        type: "below-threshold",
        label: "Below GST Threshold",
        description: "Your turnover is below ₹40L. GST registration is optional.",
        color: "text-secondary",
        bgColor: "border-secondary/30 bg-secondary/5",
      };
    }
    if (calculations.isEligible) {
      return {
        type: "eligible",
        label: "Eligible for Composition",
        description: `Turnover is within ₹1.5 Cr limit. You can opt for the ${calculations.compositionRate}% composition rate.`,
        color: "text-primary",
        bgColor: "border-primary/30 bg-primary/5",
      };
    }
    return {
      type: "ineligible",
      label: "Not Eligible",
      description: "Turnover exceeds ₹1.5 Cr. Regular GST registration is mandatory.",
      color: "text-destructive",
      bgColor: "border-destructive/30 bg-destructive/5",
    };
  };

  const eligibility = getEligibilityStatus();

  const tradeOffs = [
    {
      pro: true,
      title: "Lower Tax Rate",
      desc: `Pay only ${calculations.compositionRate}% instead of 18%`,
    },
    {
      pro: true,
      title: "Simpler Compliance",
      desc: "Quarterly returns, basic record-keeping",
    },
    {
      pro: false,
      title: "No Input Tax Credit",
      desc: `Lose ₹${formatCurrency(calculations.lostITC)} in potential ITC`,
    },
    {
      pro: false,
      title: "Intra-state Only",
      desc: "Cannot make inter-state sales",
    },
  ];

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Controls */}
      <div className="bg-card border border-border rounded-xl p-6 space-y-6">
        <div>
          <h2 className="text-xl font-semibold mb-2">GST Composition Scheme</h2>
          <p className="text-sm text-muted-foreground">
            Compare regular GST vs the simplified Composition Scheme based on your turnover slab.
          </p>
        </div>

        {/* Eligibility Status */}
        <div className={`rounded-lg p-4 border ${eligibility.bgColor}`}>
          <div className="flex items-center gap-2 mb-2">
            {eligibility.type === "eligible" ? (
              <CheckCircle className={`h-5 w-5 ${eligibility.color}`} />
            ) : eligibility.type === "ineligible" ? (
              <XCircle className={`h-5 w-5 ${eligibility.color}`} />
            ) : (
              <AlertTriangle className={`h-5 w-5 ${eligibility.color}`} />
            )}
            <span className={`font-medium ${eligibility.color}`}>{eligibility.label}</span>
          </div>
          <p className="text-sm text-muted-foreground">{eligibility.description}</p>
        </div>

        {/* Turnover with slab indicator */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label>Annual Turnover</Label>
            <span className="font-mono text-primary">{formatCurrency(annualTurnover)}</span>
          </div>
          <Input
            type="number"
            value={annualTurnover}
            onChange={(e) => setAnnualTurnover(Number(e.target.value))}
            className="bg-muted border-border"
          />
          <Slider
            value={[annualTurnover]}
            onValueChange={(v) => setAnnualTurnover(v[0])}
            min={1000000}
            max={30000000}
            step={500000}
          />
          {/* Visual slab indicator */}
          <div className="relative h-3 bg-muted rounded-full overflow-hidden">
            <div 
              className="absolute inset-y-0 left-0 bg-secondary/30"
              style={{ width: `${(GST_THRESHOLD / 30000000) * 100}%` }}
            />
            <div 
              className="absolute inset-y-0 bg-primary/30"
              style={{ 
                left: `${(GST_THRESHOLD / 30000000) * 100}%`,
                width: `${((COMPOSITION_LIMIT - GST_THRESHOLD) / 30000000) * 100}%` 
              }}
            />
            <div 
              className="absolute top-0 bottom-0 w-0.5 bg-secondary"
              style={{ left: `${(GST_THRESHOLD / 30000000) * 100}%` }}
            />
            <div 
              className="absolute top-0 bottom-0 w-0.5 bg-destructive"
              style={{ left: `${(COMPOSITION_LIMIT / 30000000) * 100}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>₹10L</span>
            <span className="text-secondary">₹40L GST</span>
            <span className="text-destructive">₹1.5Cr Comp. limit</span>
            <span>₹3Cr</span>
          </div>
        </div>

        {/* Business Type */}
        <div className="space-y-3">
          <Label>Business Type</Label>
          <div className="grid grid-cols-3 gap-2">
            {(["manufacturer", "trader", "restaurant"] as const).map((type) => (
              <button
                key={type}
                onClick={() => setBusinessType(type)}
                disabled={!calculations.isEligible}
                className={`py-2 px-3 rounded-lg text-sm font-medium transition-colors border ${
                  businessType === type
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-muted border-border hover:border-primary/50"
                } ${!calculations.isEligible ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
                <span className="block text-xs opacity-75">
                  {type === "restaurant" ? "5%" : "1%"}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Purchases estimate */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label>Estimated Purchases (% of turnover)</Label>
            <span className="font-mono text-primary">{estimatedPurchases}%</span>
          </div>
          <Slider
            value={[estimatedPurchases]}
            onValueChange={(v) => setEstimatedPurchases(v[0])}
            min={20}
            max={80}
            step={5}
          />
          <p className="text-xs text-muted-foreground">
            Higher purchases = more potential ITC lost under composition
          </p>
        </div>

        {/* Scheme Toggle */}
        <div className={`flex items-center justify-between p-4 rounded-lg border ${
          calculations.isEligible ? 'bg-muted/50 border-border' : 'bg-muted/20 border-border opacity-60'
        }`}>
          <div>
            <Label className="text-base">Use Composition Scheme</Label>
            <p className="text-xs text-muted-foreground mt-1">
              {calculations.isEligible ? "Toggle to compare options" : "Not available at this turnover"}
            </p>
          </div>
          <Switch
            checked={useComposition}
            onCheckedChange={setUseComposition}
            disabled={!calculations.isEligible}
          />
        </div>
      </div>

      {/* Results */}
      <div className="space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-card border border-border rounded-xl p-4">
            <p className="text-sm text-muted-foreground uppercase tracking-wider mb-1">
              {useComposition ? "Composition Tax" : "Net GST Payable"}
            </p>
            <p className="font-mono text-2xl font-bold text-destructive">
              {formatCurrency(useComposition ? calculations.compositionTax : calculations.netRegularGST)}
            </p>
          </div>
          <div className="bg-card border border-border rounded-xl p-4">
            <p className="text-sm text-muted-foreground uppercase tracking-wider mb-1">
              {calculations.actualBenefit ? "You Save" : "Extra Cost"}
            </p>
            <p className={`font-mono text-2xl font-bold ${calculations.actualBenefit ? 'text-primary' : 'text-destructive'}`}>
              {formatCurrency(Math.abs(calculations.compositionBenefit))}
            </p>
          </div>
        </div>

        {/* Recommendation */}
        <div className={`rounded-lg p-4 border ${calculations.actualBenefit ? 'border-primary/30 bg-primary/5' : 'border-secondary/30 bg-secondary/5'}`}>
          <p className={`text-sm font-medium mb-1 ${calculations.actualBenefit ? 'text-primary' : 'text-secondary'}`}>
            Recommendation
          </p>
          <p className="text-sm text-muted-foreground">
            {calculations.isEligible ? (
              calculations.actualBenefit ? (
                <>Composition scheme saves you <span className="text-primary font-medium">{formatCurrency(calculations.compositionBenefit)}</span> annually 
                at your current purchase ratio. Consider opting in.</>
              ) : (
                <>Regular GST is better for you. With {estimatedPurchases}% purchases, your Input Tax Credit of <span className="text-secondary font-medium">{formatCurrency(calculations.inputTaxCredit)}</span> outweighs the lower composition rate.</>
              )
            ) : (
              <>At your turnover level, you must register for regular GST. Composition scheme is not available above ₹1.5 Cr.</>
            )}
          </p>
        </div>

        {/* Comparison Chart */}
        <div className="bg-card border border-border rounded-xl p-6">
          <h3 className="font-semibold mb-4">Tax Comparison</h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={comparisonData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 15%, 18%)" />
                <XAxis dataKey="name" stroke="hsl(215, 15%, 55%)" fontSize={12} />
                <YAxis tickFormatter={(v) => `₹${v / 100000}L`} stroke="hsl(215, 15%, 55%)" fontSize={12} />
                <Tooltip
                  formatter={(value: number, name: string) => [formatCurrency(value), name === "tax" ? "Tax" : "Compliance"]}
                  contentStyle={{
                    backgroundColor: "hsl(220, 15%, 8%)",
                    border: "1px solid hsl(220, 15%, 18%)",
                    borderRadius: "8px",
                    color: "hsl(210, 20%, 95%)",
                  }}
                  labelStyle={{ color: "hsl(210, 20%, 95%)" }}
                  itemStyle={{ color: "white" }}
                  cursor={{ fill: "transparent" }}
                />
                <Bar dataKey="tax" name="Tax" radius={[4, 4, 0, 0]}>
                  {comparisonData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Trade-offs */}
        <div className="bg-card border border-border rounded-xl p-6">
          <h3 className="font-semibold mb-4">Composition Scheme Trade-offs</h3>
          <div className="grid grid-cols-2 gap-3">
            {tradeOffs.map((item, index) => (
              <div
                key={index}
                className={`flex items-start gap-2 p-3 rounded-lg ${
                  item.pro ? 'bg-primary/5 border border-primary/20' : 'bg-destructive/5 border border-destructive/20'
                }`}
              >
                {item.pro ? (
                  <CheckCircle className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                ) : (
                  <XCircle className="h-4 w-4 text-destructive mt-0.5 shrink-0" />
                )}
                <div>
                  <p className="text-sm font-medium">{item.title}</p>
                  <p className="text-xs text-muted-foreground">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompositionSchemeSimulator;