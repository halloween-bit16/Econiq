import { motion } from "framer-motion";
import { ArrowRight, TrendingUp, Calculator, Building2, Briefcase } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Index = () => {
  const features = [
    {
      icon: Calculator,
      title: "GST Simulator",
      description: "Adjust GST rates and see instant impact on prices and margins",
    },
    {
      icon: Building2,
      title: "Composition Scheme",
      description: "Compare regular GST vs composition scheme trade-offs",
    },
    {
      icon: TrendingUp,
      title: "Income Tax Calculator",
      description: "Old vs New regime comparison with deductions",
    },
    {
      icon: Briefcase,
      title: "Startup India Benefits",
      description: "Simulate Section 80-IAC tax holiday exemptions",
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
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
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
          <div className="absolute top-1/4 left-1/4 h-96 w-96 rounded-full bg-primary/10 blur-[100px]" />
          <div className="absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-secondary/10 blur-[100px]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,hsl(var(--background))_70%)]" />
        </div>

        {/* Grid pattern */}
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(hsl(var(--foreground)) 1px, transparent 1px),
                             linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)`,
            backgroundSize: '60px 60px'
          }}
        />

        <div className="container relative mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-muted/50 px-4 py-2 text-sm text-muted-foreground">
              <span className="inline-block h-2 w-2 rounded-full bg-primary animate-pulse" />
              For India's next generation of professionals
            </div>

            <h1 className="mb-6 text-4xl font-bold leading-tight tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
              Understand Tax Policies
              <br />
              <span className="bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
                Without the Jargon
              </span>
            </h1>

            <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground md:text-xl">
              Adjust tax policies. See the impact instantly. 
              Make informed decisions about GST, income tax, and startup benefits 
              with real-time simulations.
            </p>

            <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Link to="/simulator">
                <Button variant="hero" size="xl" className="group">
                  Start Simulation
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link to="/simulator">
                <Button variant="outline" size="xl">
                  View Demo
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Target audience pills */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mt-16 flex flex-wrap items-center justify-center gap-3"
          >
            <span className="text-sm text-muted-foreground">Built for:</span>
            {targetAudience.map((audience, index) => (
              <motion.span
                key={audience}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
                className="rounded-full border border-border bg-card px-4 py-1.5 text-sm text-foreground"
              >
                {audience}
              </motion.span>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-24 border-t border-border/50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold mb-4 md:text-4xl">
              Four Powerful Simulators
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Each module is designed to help you understand specific tax policies 
              through interactive visualizations and real-time calculations.
            </p>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group simulator-card"
              >
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20 text-primary group-hover:shadow-[0_0_20px_hsl(142_76%_45%/0.3)] transition-all duration-300">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="mb-2 text-lg font-semibold">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 border-t border-border/50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold mb-4 md:text-4xl">How It Works</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Simple, interactive, and educational
            </p>
          </motion.div>

          <div className="grid gap-8 md:grid-cols-3 max-w-4xl mx-auto">
            {[
              { step: "01", title: "Choose a Policy", desc: "Select from GST, Income Tax, or Startup benefits" },
              { step: "02", title: "Adjust Parameters", desc: "Use sliders and toggles to modify policy values" },
              { step: "03", title: "See Results", desc: "Watch charts update in real-time with explanations" },
            ].map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                className="text-center"
              >
                <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full border-2 border-primary/30 font-mono text-2xl font-bold text-primary">
                  {item.step}
                </div>
                <h3 className="mb-2 text-lg font-semibold">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 border-t border-border/50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative overflow-hidden rounded-2xl border border-border bg-card p-8 md:p-12 text-center"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" />
            <div className="relative">
              <h2 className="text-2xl font-bold mb-4 md:text-3xl">
                Ready to understand policy impact?
              </h2>
              <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                No signup required. Start exploring tax policies and see how they 
                affect your income, business, and financial decisions.
              </p>
              <Link to="/simulator">
                <Button variant="hero" size="xl" className="group">
                  Launch Simulator
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p className="mb-2">
            Policy Impact Simulator — Educational tool for understanding Indian tax policies
          </p>
          <p className="text-xs">
            Note: Results are illustrative and based on simplified models. 
            Consult a tax professional for actual financial decisions.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
