import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
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
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
};

// Tax calculation helpers
const calculateOldRegimeTax = (income: number, deductions: number) => {
  const taxableIncome = Math.max(0, income - deductions);
  
  const slabs = [
    { limit: 250000, rate: 0 },
    { limit: 500000, rate: 0.05 },
    { limit: 1000000, rate: 0.2 },
    { limit: Infinity, rate: 0.3 },
  ];
  
  let tax = 0;
  let remaining = taxableIncome;
  let prevLimit = 0;
  
  for (const slab of slabs) {
    const taxableInSlab = Math.min(remaining, slab.limit - prevLimit);
    if (taxableInSlab <= 0) break;
    tax += taxableInSlab * slab.rate;
    remaining -= taxableInSlab;
    prevLimit = slab.limit;
  }
  
  // Add 4% health & education cess
  tax = tax * 1.04;
  
  return tax;
};

const calculateNewRegimeTax = (income: number) => {
  // New regime slabs (FY 2023-24)
  const slabs = [
    { limit: 300000, rate: 0 },
    { limit: 600000, rate: 0.05 },
    { limit: 900000, rate: 0.1 },
    { limit: 1200000, rate: 0.15 },
    { limit: 1500000, rate: 0.2 },
    { limit: Infinity, rate: 0.3 },
  ];
  
  let tax = 0;
  let remaining = income;
  let prevLimit = 0;
  
  for (const slab of slabs) {
    const taxableInSlab = Math.min(remaining, slab.limit - prevLimit);
    if (taxableInSlab <= 0) break;
    tax += taxableInSlab * slab.rate;
    remaining -= taxableInSlab;
    prevLimit = slab.limit;
  }
  
  // Standard deduction of 50,000 in new regime
  if (income > 300000) {
    tax = calculateNewRegimeTax(Math.max(0, income - 50000));
  }
  
  // Add 4% health & education cess
  tax = tax * 1.04;
  
  // Rebate under section 87A for income up to 7 lakhs
  if (income <= 700000) {
    tax = 0;
  }
  
  return tax;
};

const IncomeTaxSimulator = () => {
  const [annualIncome, setAnnualIncome] = useState(1000000);
  const [deductions, setDeductions] = useState(150000);
  const [regime, setRegime] = useState<"old" | "new">("new");

  const calculations = useMemo(() => {
    const oldRegimeTax = calculateOldRegimeTax(annualIncome, deductions);
    const newRegimeTax = calculateNewRegimeTax(annualIncome);
    const betterRegime = oldRegimeTax < newRegimeTax ? "old" : "new";
    const savings = Math.abs(oldRegimeTax - newRegimeTax);
    
    const currentTax = regime === "old" ? oldRegimeTax : newRegimeTax;
    const netIncome = annualIncome - currentTax;
    const effectiveRate = (currentTax / annualIncome) * 100;
    
    return {
      oldRegimeTax,
      newRegimeTax,
      betterRegime,
      savings,
      currentTax,
      netIncome,
      effectiveRate,
    };
  }, [annualIncome, deductions, regime]);

  const comparisonData = [
    {
      name: "Old Regime",
      tax: calculations.oldRegimeTax,
      fill: regime === "old" ? "hsl(142, 76%, 45%)" : "hsl(220, 15%, 25%)",
    },
    {
      name: "New Regime",
      tax: calculations.newRegimeTax,
      fill: regime === "new" ? "hsl(142, 76%, 45%)" : "hsl(220, 15%, 25%)",
    },
  ];

  const pieData = [
    { name: "Net Income", value: calculations.netIncome, fill: "hsl(142, 76%, 45%)" },
    { name: "Tax", value: calculations.currentTax, fill: "hsl(0, 72%, 55%)" },
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
          <h2 className="text-xl font-semibold mb-2">Income Tax Calculator</h2>
          <p className="text-sm text-muted-foreground">
            Compare Old vs New Tax Regime and find which saves you more.
          </p>
        </div>

        <div className="space-y-6">
          {/* Annual Income */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="income">Annual Income</Label>
              <span className="font-mono text-primary">{formatCurrency(annualIncome)}</span>
            </div>
            <Input
              id="income"
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
          </div>

          {/* Deductions (only for old regime) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="deductions">
                Deductions (80C, 80D, HRA, etc.)
                <span className="text-xs text-muted-foreground ml-2">(Old Regime only)</span>
              </Label>
              <span className="font-mono text-primary">{formatCurrency(deductions)}</span>
            </div>
            <Slider
              value={[deductions]}
              onValueChange={(v) => setDeductions(v[0])}
              min={0}
              max={500000}
              step={10000}
              disabled={regime === "new"}
              className={regime === "new" ? "opacity-50" : ""}
            />
            <p className="text-xs text-muted-foreground">
              Include 80C (₹1.5L max), 80D health insurance, HRA, etc.
            </p>
          </div>

          {/* Regime Selection */}
          <div className="space-y-3">
            <Label>Tax Regime</Label>
            <RadioGroup value={regime} onValueChange={(v) => setRegime(v as "old" | "new")} className="grid grid-cols-2 gap-4">
              <div className={`flex items-center space-x-3 p-4 rounded-lg border transition-all ${regime === "old" ? "border-primary bg-primary/5" : "border-border bg-muted/50"}`}>
                <RadioGroupItem value="old" id="old" />
                <Label htmlFor="old" className="cursor-pointer">
                  <span className="font-medium">Old Regime</span>
                  <p className="text-xs text-muted-foreground">With deductions</p>
                </Label>
              </div>
              <div className={`flex items-center space-x-3 p-4 rounded-lg border transition-all ${regime === "new" ? "border-primary bg-primary/5" : "border-border bg-muted/50"}`}>
                <RadioGroupItem value="new" id="new" />
                <Label htmlFor="new" className="cursor-pointer">
                  <span className="font-medium">New Regime</span>
                  <p className="text-xs text-muted-foreground">Lower rates, no deductions</p>
                </Label>
              </div>
            </RadioGroup>
          </div>
        </div>

        {/* Recommendation */}
        <div className="rounded-lg bg-primary/5 border border-primary/20 p-4">
          <p className="text-sm font-medium text-primary mb-1">Recommendation</p>
          <p className="text-sm text-muted-foreground">
            Based on your inputs, the <span className="text-foreground font-medium">{calculations.betterRegime === "old" ? "Old Regime" : "New Regime"}</span> saves 
            you <span className="text-primary font-mono">{formatCurrency(calculations.savings)}</span> more in taxes.
          </p>
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
            <p className="stat-label mb-1">Tax Payable</p>
            <p className="stat-value text-destructive">{formatCurrency(calculations.currentTax)}</p>
          </div>
          <div className="simulator-card">
            <p className="stat-label mb-1">Net Income</p>
            <p className="stat-value text-primary">{formatCurrency(calculations.netIncome)}</p>
          </div>
          <div className="simulator-card col-span-2">
            <p className="stat-label mb-1">Effective Tax Rate</p>
            <p className="stat-value text-secondary">{calculations.effectiveRate.toFixed(1)}%</p>
          </div>
        </div>

        {/* Regime Comparison */}
        <div className="simulator-card">
          <h3 className="font-semibold mb-4">Regime Comparison</h3>
          <div className="h-48">
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
                  }}
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

        {/* Income Split */}
        <div className="simulator-card">
          <h3 className="font-semibold mb-4">Income Split</h3>
          <div className="h-48 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
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
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default IncomeTaxSimulator;
