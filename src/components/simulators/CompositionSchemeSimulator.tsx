import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
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
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
};

const CompositionSchemeSimulator = () => {
  const [annualTurnover, setAnnualTurnover] = useState(5000000); // 50 lakhs
  const [isComposition, setIsComposition] = useState(false);
  const [businessType, setBusinessType] = useState<"manufacturer" | "trader" | "restaurant">("trader");

  const calculations = useMemo(() => {
    const isEligible = annualTurnover <= 15000000; // 1.5 crore limit
    const regularGSTRate = 18;
    
    const compositionRates: Record<string, number> = {
      manufacturer: 1,
      trader: 1,
      restaurant: 5,
    };
    
    const compositionRate = compositionRates[businessType];
    const regularTax = (annualTurnover * regularGSTRate) / 100;
    const compositionTax = (annualTurnover * compositionRate) / 100;
    const taxSavings = regularTax - compositionTax;
    
    // Compliance costs (simplified)
    const regularComplianceCost = 50000; // Annual cost for regular GST compliance
    const compositionComplianceCost = 15000; // Simpler compliance
    
    return {
      isEligible,
      regularTax,
      compositionTax,
      taxSavings,
      regularComplianceCost,
      compositionComplianceCost,
      effectiveSavings: taxSavings + (regularComplianceCost - compositionComplianceCost),
      compositionRate,
    };
  }, [annualTurnover, businessType]);

  const comparisonData = [
    {
      name: "Regular GST",
      tax: calculations.regularTax,
      compliance: calculations.regularComplianceCost,
    },
    {
      name: "Composition",
      tax: calculations.compositionTax,
      compliance: calculations.compositionComplianceCost,
    },
  ];

  const tradeOffs = [
    {
      pro: true,
      title: "Lower Tax Rate",
      desc: `Pay only ${calculations.compositionRate}% vs 18% under regular GST`,
    },
    {
      pro: true,
      title: "Simpler Compliance",
      desc: "Quarterly returns instead of monthly",
    },
    {
      pro: false,
      title: "No Input Tax Credit",
      desc: "Cannot claim ITC on purchases",
    },
    {
      pro: false,
      title: "Cannot Sell Interstate",
      desc: "Limited to intra-state sales only",
    },
    {
      pro: false,
      title: "B2B Limitations",
      desc: "Cannot issue tax invoices to other businesses",
    },
  ];

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Controls */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="simulator-card space-y-8"
      >
        <div>
          <h2 className="text-xl font-semibold mb-2">GST Composition Scheme</h2>
          <p className="text-sm text-muted-foreground">
            Compare regular GST registration with the simplified Composition Scheme.
          </p>
        </div>

        <div className="space-y-6">
          {/* Turnover Input */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="turnover">Annual Turnover</Label>
              <span className="font-mono text-primary">{formatCurrency(annualTurnover)}</span>
            </div>
            <Input
              id="turnover"
              type="number"
              value={annualTurnover}
              onChange={(e) => setAnnualTurnover(Number(e.target.value))}
              className="bg-muted border-border"
            />
            <p className="text-xs text-muted-foreground">
              Composition scheme is available for turnover up to ₹1.5 crore
            </p>
          </div>

          {/* Business Type */}
          <div className="space-y-3">
            <Label>Business Type</Label>
            <div className="grid grid-cols-3 gap-2">
              {(["manufacturer", "trader", "restaurant"] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => setBusinessType(type)}
                  className={`py-2 px-3 rounded-lg text-sm font-medium transition-all border ${
                    businessType === type
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-muted border-border hover:border-primary/50"
                  }`}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Scheme Toggle */}
          <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50 border border-border">
            <div>
              <Label htmlFor="composition-toggle" className="text-base">Use Composition Scheme</Label>
              <p className="text-xs text-muted-foreground mt-1">
                Toggle to compare the two options
              </p>
            </div>
            <Switch
              id="composition-toggle"
              checked={isComposition}
              onCheckedChange={setIsComposition}
            />
          </div>
        </div>

        {/* Eligibility Status */}
        <div className={`rounded-lg p-4 border ${calculations.isEligible ? 'border-primary/50 bg-primary/5' : 'border-destructive/50 bg-destructive/5'}`}>
          <div className="flex items-center gap-2">
            {calculations.isEligible ? (
              <CheckCircle className="h-5 w-5 text-primary" />
            ) : (
              <XCircle className="h-5 w-5 text-destructive" />
            )}
            <span className="font-medium">
              {calculations.isEligible ? "Eligible for Composition Scheme" : "Not Eligible (Turnover exceeds ₹1.5 crore)"}
            </span>
          </div>
        </div>
      </motion.div>

      {/* Results */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="space-y-6"
      >
        {/* Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="simulator-card">
            <p className="stat-label mb-1">
              {isComposition ? "Composition Tax" : "Regular GST Tax"}
            </p>
            <p className="stat-value text-destructive">
              {formatCurrency(isComposition ? calculations.compositionTax : calculations.regularTax)}
            </p>
          </div>
          <div className="simulator-card">
            <p className="stat-label mb-1">Potential Savings</p>
            <p className="stat-value text-primary">
              {formatCurrency(calculations.taxSavings)}
            </p>
          </div>
        </div>

        {/* Comparison Chart */}
        <div className="simulator-card">
          <h3 className="font-semibold mb-4">Tax & Compliance Comparison</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={comparisonData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 15%, 18%)" />
                <XAxis dataKey="name" stroke="hsl(215, 15%, 55%)" fontSize={12} />
                <YAxis tickFormatter={(v) => `₹${v / 100000}L`} stroke="hsl(215, 15%, 55%)" fontSize={12} />
                <Tooltip
                  formatter={(value: number, name: string) => [formatCurrency(value), name === "tax" ? "Tax Liability" : "Compliance Cost"]}
                  contentStyle={{
                    backgroundColor: "hsl(220, 15%, 8%)",
                    border: "1px solid hsl(220, 15%, 18%)",
                    borderRadius: "8px",
                  }}
                />
                <Bar dataKey="tax" name="Tax Liability" fill="hsl(0, 72%, 55%)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="compliance" name="Compliance Cost" fill="hsl(210, 100%, 55%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Trade-offs */}
        <div className="simulator-card">
          <h3 className="font-semibold mb-4">Trade-offs to Consider</h3>
          <div className="space-y-3">
            {tradeOffs.map((item, index) => (
              <div
                key={index}
                className={`flex items-start gap-3 p-3 rounded-lg ${
                  item.pro ? 'bg-primary/5 border border-primary/20' : 'bg-destructive/5 border border-destructive/20'
                }`}
              >
                {item.pro ? (
                  <CheckCircle className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                ) : (
                  <AlertTriangle className="h-4 w-4 text-destructive mt-0.5 shrink-0" />
                )}
                <div>
                  <p className="text-sm font-medium">{item.title}</p>
                  <p className="text-xs text-muted-foreground">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default CompositionSchemeSimulator;
