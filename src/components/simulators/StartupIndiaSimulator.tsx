import { useState, useMemo } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { CheckCircle, XCircle, Rocket, Building, Award, Clock } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, LineChart, Line } from "recharts";
const formatCurrency = (value: number) => {
  if (value >= 10000000) {
    return `₹${(value / 10000000).toFixed(2)} Cr`;
  } else if (value >= 100000) {
    return `₹${(value / 100000).toFixed(2)} L`;
  }
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(value);
};

// Tax slabs for startup profits (treated as business income)
const PROFIT_TAX_SLABS = [{
  min: 0,
  max: 300000,
  rate: 0
}, {
  min: 300000,
  max: 600000,
  rate: 5
}, {
  min: 600000,
  max: 900000,
  rate: 10
}, {
  min: 900000,
  max: 1200000,
  rate: 15
}, {
  min: 1200000,
  max: 1500000,
  rate: 20
}, {
  min: 1500000,
  max: Infinity,
  rate: 30
}];
const calculateTaxOnProfit = (profit: number) => {
  let tax = 0;
  for (const slab of PROFIT_TAX_SLABS) {
    if (profit > slab.min) {
      const taxableInSlab = Math.min(profit, slab.max) - slab.min;
      tax += taxableInSlab * slab.rate / 100;
    }
  }
  return tax * 1.04; // Add 4% cess
};
const getTaxSlab = (profit: number) => {
  for (let i = PROFIT_TAX_SLABS.length - 1; i >= 0; i--) {
    if (profit > PROFIT_TAX_SLABS[i].min) {
      return PROFIT_TAX_SLABS[i];
    }
  }
  return PROFIT_TAX_SLABS[0];
};
const TAX_HOLIDAY_YEARS = 3;
const ELIGIBLE_WINDOW_YEARS = 10;
const TURNOVER_LIMIT = 1000000000; // ₹100 Cr

const StartupIndiaSimulator = () => {
  const [annualProfit, setAnnualProfit] = useState(5000000);
  const [yearsActive, setYearsActive] = useState(2);
  const [isDPIITRecognized, setIsDPIITRecognized] = useState(true);
  const [hasUsedHoliday, setHasUsedHoliday] = useState(0); // Years of holiday already used

  const calculations = useMemo(() => {
    // Eligibility check
    const isWithinWindow = yearsActive <= ELIGIBLE_WINDOW_YEARS;
    const holidayYearsRemaining = Math.max(0, TAX_HOLIDAY_YEARS - hasUsedHoliday);
    const canClaimHoliday = isDPIITRecognized && isWithinWindow && holidayYearsRemaining > 0;

    // Tax calculations
    const normalTax = calculateTaxOnProfit(annualProfit);
    const taxSlab = getTaxSlab(annualProfit);

    // With exemption
    const exemptedTax = canClaimHoliday ? normalTax : 0;
    const actualTax = canClaimHoliday ? 0 : normalTax;

    // 3-year total benefit
    const totalPotentialSavings = normalTax * TAX_HOLIDAY_YEARS;
    const remainingSavings = normalTax * holidayYearsRemaining;
    const netProfit = annualProfit - actualTax;
    const effectiveTaxRate = annualProfit > 0 ? actualTax / annualProfit * 100 : 0;
    return {
      isWithinWindow,
      canClaimHoliday,
      holidayYearsRemaining,
      normalTax,
      exemptedTax,
      actualTax,
      netProfit,
      taxSlab,
      effectiveTaxRate,
      totalPotentialSavings,
      remainingSavings
    };
  }, [annualProfit, yearsActive, isDPIITRecognized, hasUsedHoliday]);

  // 5-year projection
  const projectionData = useMemo(() => {
    const data = [];
    let holidayUsed = hasUsedHoliday;
    for (let year = 1; year <= 5; year++) {
      const currentYear = yearsActive + year - 1;
      const canClaim = isDPIITRecognized && currentYear <= ELIGIBLE_WINDOW_YEARS && holidayUsed < TAX_HOLIDAY_YEARS;
      const taxWithout = calculateTaxOnProfit(annualProfit);
      const taxWith = canClaim ? 0 : taxWithout;
      if (canClaim) holidayUsed++;
      data.push({
        year: `Year ${currentYear}`,
        withExemption: annualProfit - taxWith,
        withoutExemption: annualProfit - taxWithout,
        savings: taxWithout - taxWith
      });
    }
    return data;
  }, [annualProfit, yearsActive, isDPIITRecognized, hasUsedHoliday]);
  const comparisonData = [{
    name: "Without 80-IAC",
    profit: annualProfit - calculations.normalTax,
    fill: "hsl(220, 15%, 30%)"
  }, {
    name: "With 80-IAC",
    profit: calculations.netProfit,
    fill: "hsl(142, 76%, 45%)"
  }];
  const getEligibilityStatus = () => {
    if (!isDPIITRecognized) {
      return {
        type: "not-recognized",
        label: "DPIIT Recognition Required",
        description: "Get DPIIT recognition to claim Section 80-IAC benefits.",
        icon: XCircle,
        color: "text-destructive",
        bgColor: "border-destructive/30 bg-destructive/5"
      };
    }
    if (!calculations.isWithinWindow) {
      return {
        type: "expired",
        label: "Eligibility Window Expired",
        description: "Section 80-IAC is only available for startups within 10 years of incorporation.",
        icon: Clock,
        color: "text-muted-foreground",
        bgColor: "border-border bg-muted/30"
      };
    }
    if (calculations.holidayYearsRemaining === 0) {
      return {
        type: "exhausted",
        label: "Tax Holiday Exhausted",
        description: "You've used all 3 years of tax holiday. Standard tax applies.",
        icon: Building,
        color: "text-secondary",
        bgColor: "border-secondary/30 bg-secondary/5"
      };
    }
    return {
      type: "eligible",
      label: "Tax Holiday Active",
      description: `You can claim ${calculations.holidayYearsRemaining} more year(s) of tax exemption.`,
      icon: Award,
      color: "text-primary",
      bgColor: "border-primary/30 bg-primary/5"
    };
  };
  const eligibility = getEligibilityStatus();
  const StatusIcon = eligibility.icon;
  const eligibilityCriteria = [{
    label: "DPIIT Recognition",
    met: isDPIITRecognized,
    desc: "Recognized by Dept. for Promotion of Industry"
  }, {
    label: "Within 10 Years",
    met: calculations.isWithinWindow,
    desc: `Currently year ${yearsActive} of 10`
  }, {
    label: "Turnover < ₹100 Cr",
    met: true,
    desc: "Annual turnover under ₹100 crore"
  }, {
    label: "Holiday Years Left",
    met: calculations.holidayYearsRemaining > 0,
    desc: `${calculations.holidayYearsRemaining} of 3 years remaining`
  }];
  return <div className="grid gap-6 lg:grid-cols-2">
      {/* Controls */}
      <div className="bg-card border border-border rounded-xl p-6 space-y-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Rocket className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold">Startup India Benefits</h2>
          </div>
          <p className="text-sm text-muted-foreground">
            Simulate Section 80-IAC tax holiday based on eligibility and years since incorporation.
          </p>
        </div>

        {/* Eligibility Status */}
        <div className={`rounded-lg p-4 border ${eligibility.bgColor}`}>
          <div className="flex items-center gap-2 mb-2">
            <StatusIcon className={`h-5 w-5 ${eligibility.color}`} />
            <span className={`font-medium ${eligibility.color}`}>{eligibility.label}</span>
          </div>
          <p className="text-sm text-muted-foreground">{eligibility.description}</p>
        </div>

        {/* Annual Profit */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label>Annual Profit</Label>
            <span className="font-mono text-primary">{formatCurrency(annualProfit)}</span>
          </div>
          <Input type="number" value={annualProfit} onChange={e => setAnnualProfit(Number(e.target.value))} className="bg-muted border-border" />
          <Slider value={[annualProfit]} onValueChange={v => setAnnualProfit(v[0])} min={100000} max={20000000} step={100000} />
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Would fall in {calculations.taxSlab.rate}% slab without exemption</span>
          </div>
        </div>

        {/* Years Active with visual timeline */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label>Years Since Incorporation</Label>
            <span className="font-mono text-primary">{yearsActive} years</span>
          </div>
          <Slider value={[yearsActive]} onValueChange={v => setYearsActive(v[0])} min={1} max={12} step={1} />
          {/* Timeline visualization */}
          <div className="relative h-3 bg-muted rounded-full overflow-hidden flex">
            <div className="h-full bg-primary/40" style={{
            width: `${3 / 12 * 100}%`
          }} />
            <div className="h-full bg-secondary/30" style={{
            width: `${7 / 12 * 100}%`
          }} />
            <div className="absolute top-0 bottom-0 w-0.5 bg-destructive" style={{
            left: `${10 / 12 * 100}%`
          }} />
          </div>
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Year 1</span>
            <span className="text-primary">Tax holiday (3 yrs)</span>
            <span className="text-destructive">Year 10 limit</span>
            <span>12</span>
          </div>
        </div>

        {/* Holiday years used */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label>Tax Holiday Years Already Used</Label>
            <span className="font-mono text-primary">{hasUsedHoliday} of 3</span>
          </div>
          <Slider value={[hasUsedHoliday]} onValueChange={v => setHasUsedHoliday(v[0])} min={0} max={3} step={1} />
        </div>

        {/* DPIIT Toggle */}
        <div className={`flex items-center justify-between p-4 rounded-lg border ${isDPIITRecognized ? 'border-primary/30 bg-primary/5' : 'border-border bg-muted/30'}`}>
          <div>
            <Label className="text-base">DPIIT Recognized</Label>
            <p className="text-xs text-muted-foreground mt-1">
              Required for Section 80-IAC benefits
            </p>
          </div>
          <Switch checked={isDPIITRecognized} onCheckedChange={setIsDPIITRecognized} />
        </div>
      </div>

      {/* Results */}
      <div className="space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-card border border-border rounded-xl p-4">
            <p className="text-sm text-muted-foreground uppercase tracking-wider mb-1">Tax Saved This Year</p>
            <p className="font-mono text-2xl font-bold text-primary">{formatCurrency(calculations.exemptedTax)}</p>
          </div>
          <div className="bg-card border border-border rounded-xl p-4">
            <p className="text-sm text-muted-foreground uppercase tracking-wider mb-1">Tax Payable</p>
            <p className={`font-mono text-2xl font-bold ${calculations.actualTax > 0 ? 'text-destructive' : 'text-primary'}`}>
              {formatCurrency(calculations.actualTax)}
            </p>
          </div>
          <div className="bg-card border border-border rounded-xl p-4">
            <p className="text-sm text-muted-foreground uppercase tracking-wider mb-1">Net Profit</p>
            <p className="font-mono text-2xl font-bold text-primary">{formatCurrency(calculations.netProfit)}</p>
          </div>
          <div className="bg-card border border-border rounded-xl p-4">
            <p className="text-sm text-muted-foreground uppercase tracking-wider mb-1">Remaining Savings</p>
            <p className="font-mono text-2xl font-bold text-secondary">{formatCurrency(calculations.remainingSavings)}</p>
            <p className="text-xs text-muted-foreground mt-1">{calculations.holidayYearsRemaining} years left</p>
          </div>
        </div>

        {/* Tax Slab Context */}
        <div className="bg-muted/30 border border-border rounded-lg p-4">
          <h4 className="font-medium mb-2 text-sm">What This Means</h4>
          <p className="text-sm text-muted-foreground">
            {calculations.canClaimHoliday ? <>Without Section 80-IAC, your profit of <span className="text-foreground font-medium">{formatCurrency(annualProfit)}</span> would 
              fall in the <span className="text-destructive font-medium">{calculations.taxSlab.rate}%</span> tax slab, 
              resulting in <span className="text-destructive font-medium">{formatCurrency(calculations.normalTax)}</span> tax. 
              With the exemption, you pay <span className="text-primary font-medium">₹0</span> and keep the full profit.</> : <>Your profit of <span className="text-foreground font-medium">{formatCurrency(annualProfit)}</span> falls 
              in the <span className="text-destructive font-medium">{calculations.taxSlab.rate}%</span> slab. 
              Without an active tax holiday, you'll pay <span className="text-destructive font-medium">{formatCurrency(calculations.normalTax)}</span> in tax 
              (effective rate: {calculations.effectiveTaxRate.toFixed(1)}%).</>}
          </p>
        </div>

        {/* Comparison Chart */}
        <div className="bg-card border border-border rounded-xl p-6">
          <h3 className="font-semibold mb-4">Profit Comparison</h3>
          <div className="h-40">
            <ResponsiveContainer width="100%" height="100%" className="bg-secondary-foreground">
              <BarChart data={comparisonData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 15%, 18%)" />
                <XAxis dataKey="name" stroke="hsl(215, 15%, 55%)" fontSize={12} />
                <YAxis tickFormatter={v => `₹${v / 100000}L`} stroke="hsl(215, 15%, 55%)" fontSize={12} />
                <Tooltip formatter={(value: number) => formatCurrency(value)} contentStyle={{
                backgroundColor: "hsl(220, 15%, 8%)",
                border: "1px solid hsl(220, 15%, 18%)",
                borderRadius: "8px",
                color: "hsl(210, 20%, 95%)"
              }} labelStyle={{
                color: "hsl(210, 20%, 95%)"
              }} itemStyle={{
                color: "white"
              }} />
                <Bar dataKey="profit" name="Net Profit" radius={[4, 4, 0, 0]}>
                  {comparisonData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.fill} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 5-Year Projection */}
        <div className="bg-card border border-border rounded-xl p-6">
          <h3 className="font-semibold mb-4">5-Year Net Profit Projection</h3>
          <div className="h-40">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={projectionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 15%, 18%)" />
                <XAxis dataKey="year" stroke="hsl(215, 15%, 55%)" fontSize={11} />
                <YAxis tickFormatter={v => `₹${v / 100000}L`} stroke="hsl(215, 15%, 55%)" fontSize={11} />
                <Tooltip formatter={(value: number) => formatCurrency(value)} contentStyle={{
                backgroundColor: "hsl(220, 15%, 8%)",
                border: "1px solid hsl(220, 15%, 18%)",
                borderRadius: "8px",
                color: "hsl(210, 20%, 95%)"
              }} labelStyle={{
                color: "hsl(210, 20%, 95%)"
              }} itemStyle={{
                color: "white"
              }} />
                <Line type="monotone" dataKey="withoutExemption" name="Without 80-IAC" stroke="hsl(220, 15%, 45%)" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="withExemption" name="With 80-IAC" stroke="hsl(142, 76%, 45%)" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Eligibility Checklist */}
        <div className="bg-card border border-border rounded-xl p-6">
          <h3 className="font-semibold mb-4">Eligibility Checklist</h3>
          <div className="grid grid-cols-2 gap-3">
            {eligibilityCriteria.map((item, index) => <div key={index} className={`flex items-start gap-2 p-3 rounded-lg border ${item.met ? 'bg-primary/5 border-primary/20' : 'bg-destructive/5 border-destructive/20'}`}>
                {item.met ? <CheckCircle className="h-4 w-4 text-primary mt-0.5 shrink-0" /> : <XCircle className="h-4 w-4 text-destructive mt-0.5 shrink-0" />}
                <div>
                  <p className="text-xs font-medium">{item.label}</p>
                  <p className="text-xs text-muted-foreground">{item.desc}</p>
                </div>
              </div>)}
          </div>
        </div>
      </div>
    </div>;
};
export default StartupIndiaSimulator;