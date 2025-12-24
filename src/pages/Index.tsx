import { ArrowRight, TrendingUp, Calculator, Building2, Briefcase } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Index = () => {
  const features = [
    {
      icon: Calculator,
      title: "GST Simulator",
      description: "See when GST registration becomes mandatory and its impact on pricing",
    },
    {
      icon: Building2,
      title: "Composition Scheme",
      description: "Check eligibility and compare with regular GST based on turnover slabs",
    },
    {
      icon: TrendingUp,
      title: "Income Tax Calculator",
      description: "Understand which slab you're in and compare old vs new regime",
    },
    {
      icon: Briefcase,
      title: "Startup India Benefits",
      description: "Simulate Section 80-IAC eligibility and 3-year tax holiday",
    },
  ];

  const targetAudience = [
    "Students & Interns",
    "Fresh Graduates",
    "Small Business Owners",
    "Early-stage Founders",
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/90 backdrop-blur-md">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-secondary" />
            <span className="font-semibold text-lg">Policy Impact Simulator</span>
          </div>
          <Link to="/simulator">
            <Button variant="outline" size="sm">
              Launch Simulator
            </Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
        {/* Background effects */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 h-96 w-96 rounded-full bg-primary/5 blur-[120px]" />
          <div className="absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-secondary/5 blur-[120px]" />
        </div>

        {/* Grid pattern */}
        <div 
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `linear-gradient(hsl(var(--foreground)) 1px, transparent 1px),
                             linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)`,
            backgroundSize: '80px 80px'
          }}
        />

        <div className="container relative mx-auto px-4 text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm text-muted-foreground">
            <span className="inline-block h-2 w-2 rounded-full bg-primary" />
            For India's next generation of professionals
          </div>

          <h1 className="mb-6 text-4xl font-bold leading-tight tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
            Understand Tax Policies
            <br />
            <span className="text-primary">Without the Jargon</span>
          </h1>

          <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground md:text-xl">
            Adjust tax policies. See the impact instantly. 
            Know which slabs you fall into, when policies apply, 
            and what it means for your income.
          </p>

          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link to="/simulator">
              <Button variant="hero" size="xl" className="group">
                Start Simulation
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>

          {/* Target audience pills */}
          <div className="mt-16 flex flex-wrap items-center justify-center gap-3">
            <span className="text-sm text-muted-foreground">Built for:</span>
            {targetAudience.map((audience) => (
              <span
                key={audience}
                className="rounded-full border border-border bg-card px-4 py-1.5 text-sm text-foreground"
              >
                {audience}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-24 border-t border-border/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4 md:text-4xl">
              Four Policy Simulators
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Each module shows you exactly which slabs and thresholds apply to your situation, 
              with clear explanations of what it means.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="bg-card border border-border rounded-xl p-6 hover:border-primary/30 transition-colors"
              >
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="mb-2 text-lg font-semibold">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 border-t border-border/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4 md:text-4xl">How It Works</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Input your numbers, see which slabs apply, understand why
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3 max-w-4xl mx-auto">
            {[
              { step: "01", title: "Enter Your Details", desc: "Income, turnover, or profit depending on the policy" },
              { step: "02", title: "See Your Slab", desc: "Instantly see which bracket you fall into and what applies" },
              { step: "03", title: "Understand the Impact", desc: "Clear explanations of tax payable, savings, and eligibility" },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-full border border-primary/30 font-mono text-xl font-bold text-primary">
                  {item.step}
                </div>
                <h3 className="mb-2 text-lg font-semibold">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 border-t border-border/50">
        <div className="container mx-auto px-4">
          <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-8 md:p-12 text-center">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" />
            <div className="relative">
              <h2 className="text-2xl font-bold mb-4 md:text-3xl">
                Ready to understand policy impact?
              </h2>
              <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                No signup required. See exactly how tax policies affect your income, 
                business, and financial decisions.
              </p>
              <Link to="/simulator">
                <Button variant="hero" size="xl" className="group">
                  Launch Simulator
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p className="mb-2">
            Policy Impact Simulator — Educational tool for understanding Indian tax policies
          </p>
          <p className="text-xs">
            Results are illustrative and based on simplified models. 
            Consult a tax professional for actual financial decisions.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;