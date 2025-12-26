import { ArrowRight, TrendingUp, Calculator, Building2, Briefcase } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import logo from "@/assets/logo.png";

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
            <img src={logo} alt="Econiq logo" className="h-8 w-8" />
            <span className="font-semibold text-lg">Econiq</span>
          </div>
          <Link to="/simulator" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Launch Simulator
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

      {/* Features Section */}
      <section className="py-32">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center max-w-6xl mx-auto">
            {/* Left side - Text */}
            <div>
              <span className="text-xs uppercase tracking-widest text-primary font-medium">Simulators</span>
              <h2 className="mt-4 text-3xl md:text-4xl font-bold tracking-tight">
                Everything you need to understand Indian taxes
              </h2>
              <p className="mt-4 text-muted-foreground leading-relaxed">
                Four focused tools that cut through complexity. No accounts, no fees, no confusion.
              </p>
            </div>

            {/* Right side - Feature list */}
            <div className="space-y-1">
              {[
                { icon: Calculator, title: "GST Calculator", desc: "₹40L threshold · Registration rules" },
                { icon: Building2, title: "Composition Scheme", desc: "₹1.5Cr limit · ITC tradeoffs" },
                { icon: TrendingUp, title: "Income Tax", desc: "New vs Old regime · Slab comparison" },
                { icon: Briefcase, title: "Startup Benefits", desc: "80-IAC · 3-year tax holiday" },
              ].map((item, i) => (
                <Link
                  key={item.title}
                  to="/simulator"
                  className="flex items-center gap-4 p-4 -mx-4 rounded-xl hover:bg-card transition-colors group"
                >
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <item.icon className="w-4 h-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium">{item.title}</div>
                    <div className="text-sm text-muted-foreground">{item.desc}</div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="container mx-auto px-4">
        <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      </div>

      {/* How it works */}
      <section className="py-32">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <span className="text-xs uppercase tracking-widest text-primary font-medium">Process</span>
            <h2 className="mt-4 text-3xl md:text-4xl font-bold tracking-tight">
              Three steps. Zero confusion.
            </h2>

            <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { num: "01", title: "Input", desc: "Enter your income, turnover, or profit figures" },
                { num: "02", title: "Analyze", desc: "We calculate which slab and policies apply to you" },
                { num: "03", title: "Understand", desc: "See the impact with clear explanations" },
              ].map((step) => (
                <div key={step.num} className="relative">
                  <span className="text-6xl font-bold text-primary/10">{step.num}</span>
                  <h3 className="mt-2 text-lg font-semibold">{step.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 bg-card/50">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
              Ready to understand your taxes?
            </h2>
            <p className="mt-4 text-muted-foreground">
              No signup required. Start exploring in seconds.
            </p>
            <div className="mt-8">
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
      <footer className="py-8 border-t border-border">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-muted-foreground">
            Made by Team Biryani. For educational purposes only. <a className="underline" href="https://github.com/halloween-bit16/Econiq.git">Click here for github repository.</a>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;