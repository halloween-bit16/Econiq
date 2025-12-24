import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import GSTSimulator from "@/components/simulators/GSTSimulator";
import CompositionSchemeSimulator from "@/components/simulators/CompositionSchemeSimulator";
import IncomeTaxSimulator from "@/components/simulators/IncomeTaxSimulator";
import StartupIndiaSimulator from "@/components/simulators/StartupIndiaSimulator";
import AssumptionsModal from "@/components/AssumptionsModal";

const Simulator = () => {
  const [showAssumptions, setShowAssumptions] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <Link to="/">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
            </Link>
            <div className="h-6 w-px bg-border" />
            <h1 className="font-semibold">Policy Impact Simulator</h1>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowAssumptions(true)}
            className="gap-2"
          >
            <Info className="h-4 w-4" />
            Assumptions
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Tabs defaultValue="gst" className="w-full">
            <TabsList className="mb-8 grid w-full grid-cols-2 lg:grid-cols-4 h-auto gap-2 bg-transparent p-0">
              <TabsTrigger
                value="gst"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-[0_0_20px_hsl(142_76%_45%/0.3)] bg-card border border-border rounded-lg py-3 transition-all duration-300"
              >
                GST Calculator
              </TabsTrigger>
              <TabsTrigger
                value="composition"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-[0_0_20px_hsl(142_76%_45%/0.3)] bg-card border border-border rounded-lg py-3 transition-all duration-300"
              >
                Composition Scheme
              </TabsTrigger>
              <TabsTrigger
                value="income-tax"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-[0_0_20px_hsl(142_76%_45%/0.3)] bg-card border border-border rounded-lg py-3 transition-all duration-300"
              >
                Income Tax
              </TabsTrigger>
              <TabsTrigger
                value="startup"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-[0_0_20px_hsl(142_76%_45%/0.3)] bg-card border border-border rounded-lg py-3 transition-all duration-300"
              >
                Startup India
              </TabsTrigger>
            </TabsList>

            <TabsContent value="gst" className="mt-0">
              <GSTSimulator />
            </TabsContent>

            <TabsContent value="composition" className="mt-0">
              <CompositionSchemeSimulator />
            </TabsContent>

            <TabsContent value="income-tax" className="mt-0">
              <IncomeTaxSimulator />
            </TabsContent>

            <TabsContent value="startup" className="mt-0">
              <StartupIndiaSimulator />
            </TabsContent>
          </Tabs>
        </motion.div>
      </main>

      <AssumptionsModal
        isOpen={showAssumptions}
        onClose={() => setShowAssumptions(false)}
      />
    </div>
  );
};

export default Simulator;
