import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { CheckCircle, XCircle, Rocket, Building, Award } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  LineChart,
  Line,
} from "recharts";

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
};

const StartupIndiaSimulator = () => {
  const [annualProfit, setAnnualProfit] = useState(2000000);
  const [yearsActive, setYearsActive] = useState(2);
  const [isEligible, setIsEligible] = useState(true);

  const calculations = useMemo(() => {
    const taxRate = 0.25; // 25% corporate tax
    const normalTax = annualProfit * taxRate;
    
    // 3-year tax holiday under Section 80-IAC
    const taxHolidayYears = 3;
    const isInHolidayPeriod = yearsActive <= taxHolidayYears && isEligible;
    
    const exemptedTax = isInHolidayPeriod ? normalTax : 0;
    const actualTax = isInHolidayPeriod ? 0 : normalTax;
    
    // 10-year benefit period
    const yearsRemaining = Math.max(0, 10 - yearsActive);
    const holidayYearsRemaining = Math.max(0, taxHolidayYears - yearsActive);
    
    // Calculate total savings over eligible period
    const totalSavings = annualProfit * taxRate * (isEligible ? Math.min(taxHolidayYears, 10 - yearsActive + taxHolidayYears) : 0);
    
    return {
      normalTax,
      exemptedTax,
      actualTax,
      isInHolidayPeriod,
      yearsRemaining,
      holidayYearsRemaining,
      totalSavings,
      netProfit: annualProfit - actualTax,
    };
  }, [annualProfit, yearsActive, isEligible]);

  // Projection data for 5 years
  const projectionData = useMemo(() => {
    const data = [];
    for (let year = 1; year <= 5; year++) {
      const inHoliday = year <= 3 && isEligible;
      const normalTax = annualProfit * 0.25;
      data.push({
        year: `Year ${year}`,
        withoutExemption: annualProfit - normalTax,
        withExemption: inHoliday ? annualProfit : annualProfit - normalTax,
      });
    }
    return data;
  }, [annualProfit, isEligible]);

  const comparisonData = [
    { name: "Without Exemption", profit: annualProfit - calculations.normalTax, fill: "hsl(220, 15%, 25%)" },
    { name: "With Exemption", profit: calculations.netProfit, fill: "hsl(142, 76%, 45%)" },
  ];

  const eligibilityCriteria = [
    { label: "DPIIT Recognition", desc: "Startup must be recognized by DPIIT" },
    { label: "Age < 10 Years", desc: "Incorporated for less than 10 years" },
    { label: "Turnover < ₹100 Cr", desc: "Annual turnover under ₹100 crore" },
    { label: "Innovative Business", desc: "Working towards innovation or improvement" },
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
          <div className="flex items-center gap-3 mb-2">
            <Rocket className="h-6 w-6 text-primary" />
            <h2 className="text-xl font-semibold">Startup India Benefits</h2>
          </div>
          <p className="text-sm text-muted-foreground">
            Simulate Section 80-IAC tax holiday for DPIIT-recognized startups.
          </p>
        </div>

        <div className="space-y-6">
          {/* Annual Profit */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="profit">Annual Profit</Label>
              <span className="font-mono text-primary">{formatCurrency(annualProfit)}</span>
            </div>
            <Input
              id="profit"
              type="number"
              value={annualProfit}
              onChange={(e) => setAnnualProfit(Number(e.target.value))}
              className="bg-muted border-border"
            />
            <Slider
              value={[annualProfit]}
              onValueChange={(v) => setAnnualProfit(v[0])}
              min={100000}
              max={10000000}
              step={100000}
            />
          </div>

          {/* Years Active */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Years Since Incorporation</Label>
              <span className="font-mono text-primary">{yearsActive} years</span>
            </div>
            <Slider
              value={[yearsActive]}
              onValueChange={(v) => setYearsActive(v[0])}
              min={1}
              max={10}
              step={1}
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>1 year</span>
              <span>Tax holiday ends at 3 years</span>
              <span>10 years</span>
            </div>
          </div>

          {/* Eligibility Toggle */}
          <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50 border border-border">
            <div>
              <Label htmlFor="eligible-toggle" className="text-base">DPIIT Recognized</Label>
              <p className="text-xs text-muted-foreground mt-1">
                Toggle to simulate with/without eligibility
              </p>
            </div>
            <Switch
              id="eligible-toggle"
              checked={isEligible}
              onCheckedChange={setIsEligible}
            />
          </div>
        </div>

        {/* Status Badge */}
        <div className={`rounded-lg p-4 border ${calculations.isInHolidayPeriod ? 'border-primary/50 bg-primary/5' : 'border-border bg-muted/50'}`}>
          <div className="flex items-center gap-2">
            {calculations.isInHolidayPeriod ? (
              <>
                <Award className="h-5 w-5 text-primary" />
                <span className="font-medium text-primary">Tax Holiday Active</span>
              </>
            ) : (
              <>
                <Building className="h-5 w-5 text-muted-foreground" />
                <span className="font-medium">Standard Tax Regime</span>
              </>
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            {calculations.isInHolidayPeriod 
              ? `You're in year ${yearsActive} of the 3-year tax holiday period. ${calculations.holidayYearsRemaining} more years of exemption remaining.`
              : isEligible 
                ? "Tax holiday period has ended. Standard corporate tax applies."
                : "Not eligible for Startup India benefits. Standard corporate tax applies."
            }
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
            <p className="stat-label mb-1">Tax Saved</p>
            <p className="stat-value text-primary">{formatCurrency(calculations.exemptedTax)}</p>
          </div>
          <div className="simulator-card">
            <p className="stat-label mb-1">Tax Payable</p>
            <p className="stat-value text-destructive">{formatCurrency(calculations.actualTax)}</p>
          </div>
          <div className="simulator-card">
            <p className="stat-label mb-1">Net Profit</p>
            <p className="stat-value text-primary">{formatCurrency(calculations.netProfit)}</p>
          </div>
          <div className="simulator-card">
            <p className="stat-label mb-1">Holiday Years Left</p>
            <p className="stat-value text-secondary">{calculations.holidayYearsRemaining}</p>
          </div>
        </div>

        {/* Before vs After */}
        <div className="simulator-card">
          <h3 className="font-semibold mb-4">Profit Comparison</h3>
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
                <Bar dataKey="profit" name="Net Profit" radius={[4, 4, 0, 0]}>
                  {comparisonData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 5-Year Projection */}
        <div className="simulator-card">
          <h3 className="font-semibold mb-4">5-Year Projection</h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={projectionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 15%, 18%)" />
                <XAxis dataKey="year" stroke="hsl(215, 15%, 55%)" fontSize={12} />
                <YAxis tickFormatter={(v) => `₹${v / 100000}L`} stroke="hsl(215, 15%, 55%)" fontSize={12} />
                <Tooltip
                  formatter={(value: number) => formatCurrency(value)}
                  contentStyle={{
                    backgroundColor: "hsl(220, 15%, 8%)",
                    border: "1px solid hsl(220, 15%, 18%)",
                    borderRadius: "8px",
                  }}
                />
                <Line type="monotone" dataKey="withoutExemption" name="Without Exemption" stroke="hsl(220, 15%, 45%)" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="withExemption" name="With Exemption" stroke="hsl(142, 76%, 45%)" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Eligibility Criteria */}
        <div className="simulator-card">
          <h3 className="font-semibold mb-4">Eligibility Criteria</h3>
          <div className="grid grid-cols-2 gap-3">
            {eligibilityCriteria.map((item, index) => (
              <div key={index} className="flex items-start gap-2 p-3 rounded-lg bg-muted/50 border border-border">
                <CheckCircle className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs font-medium">{item.label}</p>
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

export default StartupIndiaSimulator;
