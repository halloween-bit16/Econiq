import { ArrowRight, TrendingUp, Calculator, Building2, Briefcase } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

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
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-lg">
        <div className="container mx-auto flex h-14 items-center justify-between px-6">
          <div className="flex items-center gap-2.5">
            <div className="h-7 w-7 rounded-md bg-primary/90" />
            <span className="font-medium text-foreground/90">Policy Impact Simulator</span>
          </div>
          <Link to="/simulator">
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
              Launch Simulator →
            </Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center pt-14">
        {/* Subtle gradient orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/3 left-1/4 h-[500px] w-[500px] rounded-full bg-primary/[0.03] blur-[100px]" />
          <div className="absolute bottom-1/3 right-1/4 h-[400px] w-[400px] rounded-full bg-secondary/[0.03] blur-[100px]" />
        </div>

        <div className="container relative mx-auto px-6">
          <motion.div 
            className="max-w-3xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <p className="mb-4 text-sm text-muted-foreground tracking-wide uppercase">
              Tax policy simulator for India
            </p>

            <h1 className="mb-6 text-4xl font-semibold leading-[1.1] tracking-tight sm:text-5xl md:text-6xl">
              Understand tax policies
              <br />
              <span className="text-primary">without the jargon</span>
            </h1>

            <p className="mb-10 max-w-xl text-lg text-muted-foreground leading-relaxed">
              Adjust sliders. See which slabs you fall into. 
              Understand what policies actually mean for your income and business.
            </p>

            <div className="flex items-center gap-4">
              <Link to="/simulator">
                <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 px-6">
                  Start Simulation
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <span className="text-sm text-muted-foreground">No signup required</span>
            </div>

            {/* Target audience */}
            <motion.div 
              className="mt-20 flex flex-wrap items-center gap-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <span className="text-xs text-muted-foreground mr-2">Built for</span>
              {targetAudience.map((audience, i) => (
                <span
                  key={audience}
                  className="rounded-full border border-border/60 bg-muted/30 px-3 py-1 text-xs text-muted-foreground"
                >
                  {audience}
                </span>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 border-t border-border/30">
        <div className="container mx-auto px-6">
          <div className="mb-14">
            <h2 className="text-2xl font-semibold mb-3 md:text-3xl">
              Four policy simulators
            </h2>
            <p className="text-muted-foreground max-w-lg">
              Each module shows which slabs and thresholds apply to your situation.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                className="group bg-card/50 border border-border/50 rounded-lg p-5 hover:bg-card hover:border-border transition-all duration-200"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05, duration: 0.3 }}
              >
                <div className="mb-3 inline-flex h-9 w-9 items-center justify-center rounded-md bg-muted text-primary">
                  <feature.icon className="h-4 w-4" />
                </div>
                <h3 className="mb-1.5 font-medium text-foreground/90">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 border-t border-border/30">
        <div className="container mx-auto px-6">
          <div className="mb-14">
            <h2 className="text-2xl font-semibold mb-3 md:text-3xl">How it works</h2>
            <p className="text-muted-foreground">Three steps to clarity</p>
          </div>

          <div className="grid gap-12 md:grid-cols-3 max-w-3xl">
            {[
              { step: "1", title: "Enter your details", desc: "Income, turnover, or profit depending on the policy" },
              { step: "2", title: "See your slab", desc: "Instantly see which bracket you fall into" },
              { step: "3", title: "Understand the impact", desc: "Clear explanations of tax payable and savings" },
            ].map((item, i) => (
              <motion.div 
                key={item.step}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.3 }}
              >
                <div className="mb-3 text-3xl font-light text-muted-foreground/50">
                  {item.step}
                </div>
                <h3 className="mb-2 font-medium text-foreground/90">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 border-t border-border/30">
        <div className="container mx-auto px-6">
          <motion.div 
            className="max-w-xl"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
          >
            <h2 className="text-2xl font-semibold mb-3 md:text-3xl">
              Ready to understand policy impact?
            </h2>
            <p className="text-muted-foreground mb-6">
              See exactly how tax policies affect your income and financial decisions.
            </p>
            <Link to="/simulator">
              <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 px-6">
                Launch Simulator
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/30 py-8">
        <div className="container mx-auto px-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-xs text-muted-foreground">
            <p>Policy Impact Simulator — Educational tool</p>
            <p>Results are illustrative. Consult a tax professional for actual decisions.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;