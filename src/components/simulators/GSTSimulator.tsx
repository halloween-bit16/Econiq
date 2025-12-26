import { useState, useMemo } from "react";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { CheckCircle, XCircle, AlertCircle } from "lucide-react";
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

const GST_REGISTRATION_THRESHOLD = 4000000; // ₹40 lakhs for services
const GST_GOODS_THRESHOLD = 4000000; // ₹40 lakhs for goods

const GSTSimulator = () => {
  const [annualTurnover, setAnnualTurnover] = useState(3000000);
  const [basePrice, setBasePrice] = useState(10000);
  const [gstRate, setGstRate] = useState(18);
  const [profitMargin, setProfitMargin] = useState(20);

  const calculations = useMemo(() => {
    const isGSTMandatory = annualTurnover >= GST_REGISTRATION_THRESHOLD;
    const isGSTOptional = annualTurnover < GST_REGISTRATION_THRESHOLD;
    
    const gstAmount = (basePrice * gstRate) / 100;
    const finalPrice = basePrice + gstAmount;
    const profitAmount = (basePrice * profitMargin) / 100;
    
    // When GST is applicable
    const annualGSTLiability = (annualTurnover * gstRate) / 100;
    const estimatedInputCredit = annualGSTLiability * 0.6; // Assume 60% ITC
    const netGSTPayable = annualGSTLiability - estimatedInputCredit;
    
    // Cash flow impact (GST paid before collection from customers)
    const cashFlowImpact = -netGSTPayable / 12; // Monthly impact
    
    return {
      isGSTMandatory,
      isGSTOptional,
      gstAmount,
      finalPrice,
      profitAmount,
      annualGSTLiability,
      estimatedInputCredit,
      netGSTPayable,
      cashFlowImpact,
      thresholdDistance: GST_REGISTRATION_THRESHOLD - annualTurnover,
    };
  }, [annualTurnover, basePrice, gstRate, profitMargin]);

  const chartData = [
    { name: "Base Price", value: basePrice, fill: "hsl(210, 100%, 55%)" },
    { name: "GST Amount", value: calculations.gstAmount, fill: "hsl(0, 72%, 55%)" },
    { name: "Final Price", value: calculations.finalPrice, fill: "hsl(142, 76%, 45%)" },
  ];

  const getApplicabilityStatus = () => {
    if (calculations.isGSTMandatory) {
      return {
        status: "mandatory",
        label: "GST Registration Mandatory",
        icon: AlertCircle,
        color: "text-destructive",
        bgColor: "border-destructive/30 bg-destructive/5",
      };
    }
    return {
      status: "optional",
      label: "GST Registration Optional",
      icon: CheckCircle,
      color: "text-primary",
      bgColor: "border-primary/30 bg-primary/5",
    };
  };

  const applicability = getApplicabilityStatus();
  const StatusIcon = applicability.icon;

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Controls */}
      <div className="bg-card border border-border rounded-xl p-6 space-y-6">
        <div>
          <h2 className="text-xl font-semibold mb-2">GST Impact Simulator</h2>
          <p className="text-sm text-muted-foreground">
            See how GST affects your pricing, profits, and when registration becomes mandatory.
          </p>
        </div>

        {/* Applicability Status */}
        <div className={`rounded-lg p-4 border ${applicability.bgColor}`}>
          <div className="flex items-center gap-2 mb-2">
            <StatusIcon className={`h-5 w-5 ${applicability.color}`} />
            <span className={`font-medium ${applicability.color}`}>{applicability.label}</span>
          </div>
          <p className="text-sm text-muted-foreground">
            {calculations.isGSTMandatory 
              ? "Your turnover exceeds ₹40 lakhs. GST registration is required by law."
              : `You're ₹${formatCurrency(calculations.thresholdDistance)} below the ₹40L threshold. GST is optional but may benefit you for input credits.`
            }
          </p>
        </div>

        {/* Turnover Slab Indicator */}
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
            min={500000}
            max={20000000}
            step={100000}
          />
          <div className="relative h-2 bg-muted rounded-full overflow-hidden">
            <div 
              className="absolute inset-y-0 left-0 bg-primary/30"
              style={{ width: `${(GST_REGISTRATION_THRESHOLD / 20000000) * 100}%` }}
            />
            <div 
              className="absolute top-0 bottom-0 w-0.5 bg-destructive"
              style={{ left: `${(GST_REGISTRATION_THRESHOLD / 20000000) * 100}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>₹5L</span>
            <span className="text-destructive">₹40L threshold</span>
            <span>₹2Cr</span>
          </div>
        </div>

        <div className="space-y-6">
          {/* Base Price Input */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Product/Service Base Price</Label>
              <span className="font-mono text-primary">{formatCurrency(basePrice)}</span>
            </div>
            <Input
              type="number"
              value={basePrice}
              onChange={(e) => setBasePrice(Number(e.target.value))}
              className="bg-muted border-border"
            />
          </div>

          {/* GST Rate Slider */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>GST Rate</Label>
              <span className="font-mono text-primary">{gstRate}%</span>
            </div>
            <Slider
              value={[gstRate]}
              onValueChange={(v) => setGstRate(v[0])}
              min={0}
              max={28}
              step={1}
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>0%</span>
              <span>5%</span>
              <span>12%</span>
              <span>18%</span>
              <span>28%</span>
            </div>
          </div>

          {/* Profit Margin */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Profit Margin</Label>
              <span className="font-mono text-primary">{profitMargin}%</span>
            </div>
            <Slider
              value={[profitMargin]}
              onValueChange={(v) => setProfitMargin(v[0])}
              min={5}
              max={50}
              step={1}
            />
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-card border border-border rounded-xl p-4">
            <p className="text-sm text-muted-foreground uppercase tracking-wider mb-1">Final Price</p>
            <p className="font-mono text-2xl font-bold text-primary">{formatCurrency(calculations.finalPrice)}</p>
            <p className="text-xs text-muted-foreground mt-1">Base + GST</p>
          </div>
          <div className="bg-card border border-border rounded-xl p-4">
            <p className="text-sm text-muted-foreground uppercase tracking-wider mb-1">GST Amount</p>
            <p className="font-mono text-2xl font-bold text-destructive">{formatCurrency(calculations.gstAmount)}</p>
            <p className="text-xs text-muted-foreground mt-1">Per unit</p>
          </div>
          <div className="bg-card border border-border rounded-xl p-4">
            <p className="text-sm text-muted-foreground uppercase tracking-wider mb-1">Annual GST Payable</p>
            <p className="font-mono text-2xl font-bold text-secondary">{formatCurrency(calculations.netGSTPayable)}</p>
            <p className="text-xs text-muted-foreground mt-1">After input credit</p>
          </div>
          <div className="bg-card border border-border rounded-xl p-4">
            <p className="text-sm text-muted-foreground uppercase tracking-wider mb-1">Monthly Cash Impact</p>
            <p className={`font-mono text-2xl font-bold ${calculations.cashFlowImpact < 0 ? 'text-destructive' : 'text-primary'}`}>
              {formatCurrency(calculations.cashFlowImpact)}
            </p>
            <p className="text-xs text-muted-foreground mt-1">Working capital</p>
          </div>
        </div>

        {/* Price Breakdown Chart */}
        <div className="bg-card border border-border rounded-xl p-6">
          <h3 className="font-semibold mb-4">Price Breakdown</h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 15%, 18%)" />
                <XAxis type="number" tickFormatter={(v) => `₹${v / 1000}k`} stroke="hsl(215, 15%, 55%)" fontSize={12} />
                <YAxis type="category" dataKey="name" stroke="hsl(215, 15%, 55%)" fontSize={12} width={85} />
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
                <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Explanation */}
        <div className="bg-muted/30 border border-border rounded-lg p-4">
          <h4 className="font-medium mb-2 text-sm">What This Means</h4>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {calculations.isGSTMandatory ? (
              <>At your turnover of <span className="text-foreground font-medium">{formatCurrency(annualTurnover)}</span>, GST registration is mandatory. 
              You'll collect <span className="text-primary font-mono">{formatCurrency(calculations.annualGSTLiability)}</span> in GST annually, 
              and after claiming input credits, pay approximately <span className="text-destructive font-mono">{formatCurrency(calculations.netGSTPayable)}</span> to the government.</>
            ) : (
              <>Your turnover is below the ₹40L threshold, so GST registration is optional. 
              However, registering voluntarily allows you to claim input tax credits on purchases, 
              which could save money if your suppliers charge GST.</>
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

export default GSTSimulator;