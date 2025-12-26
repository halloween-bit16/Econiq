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
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm text-muted-foreground animate-fade-in">
            <span className="inline-block h-2 w-2 rounded-full bg-primary animate-pulse" />
            For India's next generation of professionals
          </div>

          <h1 className="mb-6 text-4xl font-bold leading-tight tracking-tight sm:text-5xl md:text-6xl lg:text-7xl animate-fade-in [animation-delay:100ms]">
            Understand Tax Policies
            <br />
            <span className="text-primary">Without the Jargon</span>
          </h1>

          <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground md:text-xl animate-fade-in [animation-delay:200ms]">
            Adjust tax policies. See the impact instantly. 
            Know which slabs you fall into, when policies apply, 
            and what it means for your income.
          </p>

          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center animate-fade-in [animation-delay:300ms]">
            <Link to="/simulator">
              <Button variant="hero" size="xl" className="group">
                Start Simulation
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>

          {/* Target audience pills */}
          <div className="mt-16 flex flex-wrap items-center justify-center gap-3 animate-fade-in [animation-delay:400ms]">
            <span className="text-sm text-muted-foreground">Built for:</span>
            {targetAudience.map((audience, index) => (
              <span
                key={audience}
                className="rounded-full border border-border bg-card px-4 py-1.5 text-sm text-foreground transition-colors hover:border-primary/50"
                style={{ animationDelay: `${450 + index * 50}ms` }}
              >
                {audience}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Simulators Grid */}
      <section className="py-24 bg-card/30">
        <div className="container mx-auto px-4">
          <h2 className="text-lg font-medium text-muted-foreground mb-10">
            What's inside
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
            <Link to="/simulator" className="group p-6 border border-border rounded-lg hover:border-primary/40 transition-colors">
              <Calculator className="h-5 w-5 text-primary mb-3" />
              <h3 className="font-medium mb-1">GST Calculator</h3>
              <p className="text-sm text-muted-foreground">Check if GST applies based on your turnover</p>
            </Link>

            <Link to="/simulator" className="group p-6 border border-border rounded-lg hover:border-primary/40 transition-colors">
              <Building2 className="h-5 w-5 text-primary mb-3" />
              <h3 className="font-medium mb-1">Composition Scheme</h3>
              <p className="text-sm text-muted-foreground">Compare regular GST vs composition</p>
            </Link>

            <Link to="/simulator" className="group p-6 border border-border rounded-lg hover:border-primary/40 transition-colors">
              <TrendingUp className="h-5 w-5 text-primary mb-3" />
              <h3 className="font-medium mb-1">Income Tax</h3>
              <p className="text-sm text-muted-foreground">Old regime vs new regime comparison</p>
            </Link>

            <Link to="/simulator" className="group p-6 border border-border rounded-lg hover:border-primary/40 transition-colors">
              <Briefcase className="h-5 w-5 text-primary mb-3" />
              <h3 className="font-medium mb-1">Startup Benefits</h3>
              <p className="text-sm text-muted-foreground">Section 80-IAC tax holiday eligibility</p>
            </Link>
          </div>
        </div>
      </section>

      {/* Simple explainer */}
      <section className="py-24">
        <div className="container mx-auto px-4 max-w-2xl">
          <h2 className="text-lg font-medium text-muted-foreground mb-8">How it works</h2>
          
          <div className="space-y-6 text-foreground">
            <p>
              <span className="text-primary font-medium">1.</span> Enter your income or turnover
            </p>
            <p>
              <span className="text-primary font-medium">2.</span> See which tax slab applies to you
            </p>
            <p>
              <span className="text-primary font-medium">3.</span> Understand the impact in plain numbers
            </p>
          </div>

          <div className="mt-12 pt-8 border-t border-border">
            <Link to="/simulator">
              <Button variant="hero" size="lg" className="group">
                Try the simulator
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="container mx-auto px-4">
          <p className="text-sm text-muted-foreground">
            For educational purposes only. Not legal or financial advice.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;