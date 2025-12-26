import { useState, useMemo } from "react";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { TrendingDown, TrendingUp, Minus } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
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

// New Tax Regime slabs (FY 2024-25)
const NEW_REGIME_SLABS = [
  { min: 0, max: 300000, rate: 0, label: "₹0 - ₹3L" },
  { min: 300000, max: 600000, rate: 5, label: "₹3L - ₹6L" },
  { min: 600000, max: 900000, rate: 10, label: "₹6L - ₹9L" },
  { min: 900000, max: 1200000, rate: 15, label: "₹9L - ₹12L" },
  { min: 1200000, max: 1500000, rate: 20, label: "₹12L - ₹15L" },
  { min: 1500000, max: Infinity, rate: 30, label: "Above ₹15L" },
];

// Old Tax Regime slabs
const OLD_REGIME_SLABS = [
  { min: 0, max: 250000, rate: 0, label: "₹0 - ₹2.5L" },
  { min: 250000, max: 500000, rate: 5, label: "₹2.5L - ₹5L" },
  { min: 500000, max: 1000000, rate: 20, label: "₹5L - ₹10L" },
  { min: 1000000, max: Infinity, rate: 30, label: "Above ₹10L" },
];

const calculateTax = (income: number, slabs: typeof NEW_REGIME_SLABS, standardDeduction: number = 0) => {
  const taxableIncome = Math.max(0, income - standardDeduction);
  let tax = 0;
  let breakdown: { slab: string; taxable: number; tax: number; rate: number }[] = [];
  
  for (const slab of slabs) {
    if (taxableIncome > slab.min) {
      const taxableInSlab = Math.min(taxableIncome, slab.max) - slab.min;
      const slabTax = (taxableInSlab * slab.rate) / 100;
      tax += slabTax;
      if (taxableInSlab > 0) {
        breakdown.push({
          slab: slab.label,
          taxable: taxableInSlab,
          tax: slabTax,
          rate: slab.rate,
        });
      }
    }
  }
  
  // Add 4% health & education cess
  const cess = tax * 0.04;
  
  return { tax: tax + cess, breakdown, cess };
};

const getCurrentSlab = (income: number, slabs: typeof NEW_REGIME_SLABS) => {
  for (let i = slabs.length - 1; i >= 0; i--) {
    if (income > slabs[i].min) {
      return slabs[i];
    }
  }
  return slabs[0];
};

const IncomeTaxSimulator = () => {
  const [annualIncome, setAnnualIncome] = useState(1200000);
  const [deductions, setDeductions] = useState(150000);
  const [regime, setRegime] = useState<"old" | "new">("new");

  const calculations = useMemo(() => {
    // New regime: ₹75,000 standard deduction
    const newRegimeResult = calculateTax(annualIncome, NEW_REGIME_SLABS, 75000);
    // Old regime: ₹50,000 standard deduction + other deductions
    const oldRegimeResult = calculateTax(annualIncome, OLD_REGIME_SLABS, 50000 + deductions);
    
    // Rebate under 87A for new regime (income up to ₹7L after standard deduction)
    let newRegimeTax = newRegimeResult.tax;
    if (annualIncome - 75000 <= 700000) {
      newRegimeTax = 0;
    }
    
    // Rebate for old regime (income up to ₹5L after deductions)
    let oldRegimeTax = oldRegimeResult.tax;
    if (annualIncome - 50000 - deductions <= 500000) {
      oldRegimeTax = 0;
    }
    
    const betterRegime = oldRegimeTax < newRegimeTax ? "old" : "new";
    const savings = Math.abs(oldRegimeTax - newRegimeTax);
    
    const currentTax = regime === "old" ? oldRegimeTax : newRegimeTax;
    const currentBreakdown = regime === "old" ? oldRegimeResult.breakdown : newRegimeResult.breakdown;
    const netIncome = annualIncome - currentTax;
    const effectiveRate = annualIncome > 0 ? (currentTax / annualIncome) * 100 : 0;
    
    const currentSlabNew = getCurrentSlab(annualIncome - 75000, NEW_REGIME_SLABS);
    const currentSlabOld = getCurrentSlab(annualIncome - 50000 - deductions, OLD_REGIME_SLABS);
    
    return {
      newRegimeTax,
      oldRegimeTax,
      betterRegime,
      savings,
      currentTax,
      currentBreakdown,
      netIncome,
      effectiveRate,
      currentSlabNew,
      currentSlabOld,
      monthlyTakeHome: netIncome / 12,
    };
  }, [annualIncome, deductions, regime]);

  const comparisonData = [
    {
      name: "Old Regime",
      tax: calculations.oldRegimeTax,
      fill: regime === "old" ? "hsl(142, 76%, 45%)" : "hsl(220, 15%, 30%)",
    },
    {
      name: "New Regime",
      tax: calculations.newRegimeTax,
      fill: regime === "new" ? "hsl(142, 76%, 45%)" : "hsl(220, 15%, 30%)",
    },
  ];

  const pieData = [
    { name: "Take Home", value: calculations.netIncome, fill: "hsl(142, 76%, 45%)" },
    { name: "Tax", value: calculations.currentTax, fill: "hsl(0, 72%, 55%)" },
  ];

  const currentSlab = regime === "new" ? calculations.currentSlabNew : calculations.currentSlabOld;

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Controls */}
      <div className="bg-card border border-border rounded-xl p-6 space-y-6">
        <div>
          <h2 className="text-xl font-semibold mb-2">Income Tax Calculator</h2>
          <p className="text-sm text-muted-foreground">
            Compare Old vs New Tax Regime with exact slab calculations.
          </p>
        </div>

        {/* Current Slab Indicator */}
        <div className="rounded-lg p-4 border border-border bg-muted/30">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Your Tax Slab</span>
            <span className={`text-sm font-medium px-2 py-0.5 rounded ${
              currentSlab.rate === 0 ? 'bg-primary/20 text-primary' :
              currentSlab.rate <= 10 ? 'bg-secondary/20 text-secondary' :
              currentSlab.rate <= 20 ? 'bg-yellow-500/20 text-yellow-500' :
              'bg-destructive/20 text-destructive'
            }`}>
              {currentSlab.rate}% Marginal Rate
            </span>
          </div>
          <p className="text-lg font-semibold">{currentSlab.label}</p>
          <p className="text-xs text-muted-foreground mt-1">
            {regime === "new" ? "New Regime" : "Old Regime"} • Additional income taxed at {currentSlab.rate}%
          </p>
        </div>

        {/* Annual Income */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label>Annual Income (CTC/Gross)</Label>
            <span className="font-mono text-primary">{formatCurrency(annualIncome)}</span>
          </div>
          <Input
            type="number"
            value={annualIncome}
            onChange={(e) => setAnnualIncome(Number(e.target.value))}
            className="bg-muted border-border"
          />
          <Slider
            value={[annualIncome]}
            onValueChange={(v) => setAnnualIncome(v[0])}
            min={300000}
            max={5000000}
            step={50000}
          />
          {/* Slab visualization */}
          <div className="relative h-2 bg-muted rounded-full overflow-hidden flex">
            {NEW_REGIME_SLABS.slice(0, -1).map((slab, i) => (
              <div 
                key={i}
                className={`h-full ${
                  slab.rate === 0 ? 'bg-primary/40' :
                  slab.rate === 5 ? 'bg-primary/30' :
                  slab.rate === 10 ? 'bg-secondary/40' :
                  slab.rate === 15 ? 'bg-yellow-500/40' :
                  slab.rate === 20 ? 'bg-orange-500/40' :
                  'bg-destructive/40'
                }`}
                style={{ width: `${((slab.max - slab.min) / 5000000) * 100}%` }}
              />
            ))}
          </div>
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>₹3L</span>
            <span>₹6L</span>
            <span>₹9L</span>
            <span>₹12L</span>
            <span>₹15L+</span>
          </div>
        </div>

        {/* Deductions (for old regime) */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className={regime === "new" ? "text-muted-foreground" : ""}>
              Deductions (80C, 80D, HRA, etc.)
            </Label>
            <span className={`font-mono ${regime === "new" ? "text-muted-foreground" : "text-primary"}`}>
              {formatCurrency(deductions)}
            </span>
          </div>
          <Slider
            value={[deductions]}
            onValueChange={(v) => setDeductions(v[0])}
            min={0}
            max={500000}
            step={10000}
            disabled={regime === "new"}
            className={regime === "new" ? "opacity-40" : ""}
          />
          <p className="text-xs text-muted-foreground">
            {regime === "new" 
              ? "Deductions not applicable in New Regime" 
              : "80C (₹1.5L) + 80D + HRA + NPS + others"}
          </p>
        </div>

        {/* Regime Selection */}
        <div className="space-y-3">
          <Label>Select Tax Regime</Label>
          <RadioGroup value={regime} onValueChange={(v) => setRegime(v as "old" | "new")} className="grid grid-cols-2 gap-4">
            <div className={`flex items-center space-x-3 p-4 rounded-lg border transition-colors cursor-pointer ${
              regime === "old" ? "border-primary bg-primary/5" : "border-border bg-muted/30 hover:border-border/80"
            }`}>
              <RadioGroupItem value="old" id="old" />
              <Label htmlFor="old" className="cursor-pointer flex-1">
                <span className="font-medium block">Old Regime</span>
                <p className="text-xs text-muted-foreground">With deductions</p>
              </Label>
            </div>
            <div className={`flex items-center space-x-3 p-4 rounded-lg border transition-colors cursor-pointer ${
              regime === "new" ? "border-primary bg-primary/5" : "border-border bg-muted/30 hover:border-border/80"
            }`}>
              <RadioGroupItem value="new" id="new" />
              <Label htmlFor="new" className="cursor-pointer flex-1">
                <span className="font-medium block">New Regime</span>
                <p className="text-xs text-muted-foreground">Lower rates, no deductions</p>
              </Label>
            </div>
          </RadioGroup>
        </div>
      </div>

      {/* Results */}
      <div className="space-y-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-card border border-border rounded-xl p-4">
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Tax Payable</p>
            <p className="font-mono text-xl font-bold text-destructive">{formatCurrency(calculations.currentTax)}</p>
          </div>
          <div className="bg-card border border-border rounded-xl p-4">
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Net Annual</p>
            <p className="font-mono text-xl font-bold text-primary">{formatCurrency(calculations.netIncome)}</p>
          </div>
          <div className="bg-card border border-border rounded-xl p-4">
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Monthly</p>
            <p className="font-mono text-xl font-bold text-secondary">{formatCurrency(calculations.monthlyTakeHome)}</p>
          </div>
        </div>

        {/* Recommendation */}
        <div className={`rounded-lg p-4 border flex items-start gap-3 ${
          calculations.savings > 0 ? 'border-primary/30 bg-primary/5' : 'border-border bg-muted/30'
        }`}>
          {calculations.savings > 1000 ? (
            calculations.betterRegime === "new" ? (
              <TrendingDown className="h-5 w-5 text-primary shrink-0 mt-0.5" />
            ) : (
              <TrendingUp className="h-5 w-5 text-primary shrink-0 mt-0.5" />
            )
          ) : (
            <Minus className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
          )}
          <div>
            <p className="text-sm font-medium">
              {calculations.savings > 1000 ? (
                <>Switch to <span className="text-primary">{calculations.betterRegime === "old" ? "Old" : "New"} Regime</span> to save {formatCurrency(calculations.savings)}/year</>
              ) : (
                <>Both regimes result in similar tax at your income level</>
              )}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Your income falls in the {currentSlab.rate}% slab ({currentSlab.label}). 
              Effective tax rate: {calculations.effectiveRate.toFixed(1)}%
            </p>
          </div>
        </div>

        {/* Regime Comparison */}
        <div className="bg-card border border-border rounded-xl p-6">
          <h3 className="font-semibold mb-4">Regime Comparison</h3>
          <div className="h-40">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={comparisonData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 15%, 18%)" />
                <XAxis dataKey="name" stroke="hsl(215, 15%, 55%)" fontSize={12} />
                <YAxis tickFormatter={(v) => `₹${v / 100000}L`} stroke="hsl(215, 15%, 55%)" fontSize={12} />
                <Tooltip
                  formatter={(value: number) => formatCurrency(value)}
                  contentStyle={{
                    backgroundColor: "hsl(220, 15%, 8%)",
                    border: "1px solid hsl(220, 15%, 18%)",
                    borderRadius: "8px",
                    color: "hsl(210, 20%, 95%)",
                  }}
                  labelStyle={{ color: "hsl(210, 20%, 95%)" }}
                  itemStyle={{ color: "white" }}
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

        {/* Slab Breakdown */}
        <div className="bg-card border border-border rounded-xl p-6">
          <h3 className="font-semibold mb-4">Tax Slab Breakdown</h3>
          <div className="space-y-2">
            {calculations.currentBreakdown.length > 0 ? (
              calculations.currentBreakdown.map((item, index) => (
                <div key={index} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                  <div>
                    <span className="text-sm font-medium">{item.slab}</span>
                    <span className={`ml-2 text-xs px-1.5 py-0.5 rounded ${
                      item.rate === 0 ? 'bg-primary/20 text-primary' :
                      item.rate <= 10 ? 'bg-secondary/20 text-secondary' :
                      item.rate <= 20 ? 'bg-yellow-500/20 text-yellow-500' :
                      'bg-destructive/20 text-destructive'
                    }`}>
                      {item.rate}%
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="font-mono text-sm">{formatCurrency(item.tax)}</span>
                    <span className="text-xs text-muted-foreground ml-2">on {formatCurrency(item.taxable)}</span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground py-4 text-center">
                No tax applicable - eligible for full rebate under Section 87A
              </p>
            )}
          </div>
        </div>

        {/* Income Split Pie */}
        <div className="bg-card border border-border rounded-xl p-6">
          <h3 className="font-semibold mb-4">Income Split</h3>
          <div className="h-40">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={65}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number) => formatCurrency(value)}
                  contentStyle={{
                    backgroundColor: "hsl(220, 15%, 8%)",
                    border: "1px solid hsl(220, 15%, 18%)",
                    borderRadius: "8px",
                    color: "hsl(210, 20%, 95%)",
                  }}
                  labelStyle={{ color: "hsl(210, 20%, 95%)" }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IncomeTaxSimulator;