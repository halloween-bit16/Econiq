import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
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

const GSTSimulator = () => {
  const [basePrice, setBasePrice] = useState(10000);
  const [gstRate, setGstRate] = useState(18);
  const [profitMargin, setProfitMargin] = useState(20);

  const calculations = useMemo(() => {
    const gstAmount = (basePrice * gstRate) / 100;
    const finalPrice = basePrice + gstAmount;
    const profitBeforeGST = (basePrice * profitMargin) / 100;
    const effectiveProfit = profitBeforeGST - (gstAmount * 0.3); // Simplified: 30% GST affects profit
    const cashFlowImpact = -gstAmount * 0.5; // Simplified cash flow impact

    return {
      gstAmount,
      finalPrice,
      profitBeforeGST,
      effectiveProfit,
      cashFlowImpact,
    };
  }, [basePrice, gstRate, profitMargin]);

  const chartData = [
    { name: "Base Price", value: basePrice, fill: "hsl(210, 100%, 55%)" },
    { name: "GST Amount", value: calculations.gstAmount, fill: "hsl(0, 72%, 55%)" },
    { name: "Final Price", value: calculations.finalPrice, fill: "hsl(142, 76%, 45%)" },
  ];

  const profitData = [
    { name: "Profit (No GST)", value: calculations.profitBeforeGST, fill: "hsl(142, 76%, 45%)" },
    { name: "Effective Profit", value: Math.max(0, calculations.effectiveProfit), fill: "hsl(210, 100%, 55%)" },
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
          <h2 className="text-xl font-semibold mb-2">GST Impact Simulator</h2>
          <p className="text-sm text-muted-foreground">
            Adjust the parameters to see how GST affects pricing, profits, and cash flow.
          </p>
        </div>

        <div className="space-y-6">
          {/* Base Price Input */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="base-price">Base Price</Label>
              <span className="font-mono text-primary">{formatCurrency(basePrice)}</span>
            </div>
            <Input
              id="base-price"
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

          {/* Profit Margin Slider */}
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

        {/* Explanation */}
        <div className="rounded-lg bg-muted/50 border border-border p-4">
          <h4 className="font-medium mb-2 text-sm">How GST Affects Your Business</h4>
          <p className="text-xs text-muted-foreground leading-relaxed">
            GST is added to your base price, increasing the final consumer price by{" "}
            <span className="text-primary font-mono">{gstRate}%</span>. While you collect GST from 
            customers, you must deposit it with the government. Input tax credit can offset 
            some costs, but compliance and cash flow timing affect your effective margins.
          </p>
        </div>
      </motion.div>

      {/* Results */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="space-y-6"
      >
        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="simulator-card">
            <p className="stat-label mb-1">Final Price</p>
            <p className="stat-value text-primary">{formatCurrency(calculations.finalPrice)}</p>
          </div>
          <div className="simulator-card">
            <p className="stat-label mb-1">GST Amount</p>
            <p className="stat-value text-destructive">{formatCurrency(calculations.gstAmount)}</p>
          </div>
          <div className="simulator-card">
            <p className="stat-label mb-1">Effective Profit</p>
            <p className={`stat-value ${calculations.effectiveProfit > 0 ? 'text-primary' : 'text-destructive'}`}>
              {formatCurrency(calculations.effectiveProfit)}
            </p>
          </div>
          <div className="simulator-card">
            <p className="stat-label mb-1">Cash Flow Impact</p>
            <p className="stat-value text-secondary">{formatCurrency(calculations.cashFlowImpact)}</p>
          </div>
        </div>

        {/* Price Breakdown Chart */}
        <div className="simulator-card">
          <h3 className="font-semibold mb-4">Price Breakdown</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 15%, 18%)" />
                <XAxis type="number" tickFormatter={(v) => `₹${v / 1000}k`} stroke="hsl(215, 15%, 55%)" fontSize={12} />
                <YAxis type="category" dataKey="name" stroke="hsl(215, 15%, 55%)" fontSize={12} width={100} />
                <Tooltip
                  formatter={(value: number) => formatCurrency(value)}
                  contentStyle={{
                    backgroundColor: "hsl(220, 15%, 8%)",
                    border: "1px solid hsl(220, 15%, 18%)",
                    borderRadius: "8px",
                  }}
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

        {/* Profit Comparison */}
        <div className="simulator-card">
          <h3 className="font-semibold mb-4">Profit Impact</h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={profitData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 15%, 18%)" />
                <XAxis dataKey="name" stroke="hsl(215, 15%, 55%)" fontSize={12} />
                <YAxis tickFormatter={(v) => `₹${v / 1000}k`} stroke="hsl(215, 15%, 55%)" fontSize={12} />
                <Tooltip
                  formatter={(value: number) => formatCurrency(value)}
                  contentStyle={{
                    backgroundColor: "hsl(220, 15%, 8%)",
                    border: "1px solid hsl(220, 15%, 18%)",
                    borderRadius: "8px",
                  }}
                />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {profitData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default GSTSimulator;
