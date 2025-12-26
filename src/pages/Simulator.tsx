import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import GSTSimulator from "@/components/simulators/GSTSimulator";
import CompositionSchemeSimulator from "@/components/simulators/CompositionSchemeSimulator";
import IncomeTaxSimulator from "@/components/simulators/IncomeTaxSimulator";
import StartupIndiaSimulator from "@/components/simulators/StartupIndiaSimulator";
import AssumptionsModal from "@/components/AssumptionsModal";
import logo from "@/assets/logo.png";

const Simulator = () => {
  const [showAssumptions, setShowAssumptions] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border/50 bg-background/90 backdrop-blur-md">
        <div className="container mx-auto flex h-14 items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <Link to="/">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
            </Link>
            <div className="h-5 w-px bg-border" />
            <img src={logo} alt="Econiq logo" className="h-6 w-6" />
            <h1 className="font-semibold">Econiq</h1>
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
      <main className="container mx-auto px-4 py-6">
        <Tabs defaultValue="income-tax" className="w-full">
          <TabsList className="mb-6 grid w-full grid-cols-2 lg:grid-cols-4 h-auto gap-2 bg-transparent p-0">
            <TabsTrigger
              value="income-tax"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground bg-card border border-border rounded-lg py-2.5 text-sm transition-colors"
            >
              Income Tax
            </TabsTrigger>
            <TabsTrigger
              value="gst"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground bg-card border border-border rounded-lg py-2.5 text-sm transition-colors"
            >
              GST Calculator
            </TabsTrigger>
            <TabsTrigger
              value="composition"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground bg-card border border-border rounded-lg py-2.5 text-sm transition-colors"
            >
              Composition Scheme
            </TabsTrigger>
            <TabsTrigger
              value="startup"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground bg-card border border-border rounded-lg py-2.5 text-sm transition-colors"
            >
              Startup India
            </TabsTrigger>
          </TabsList>

          <TabsContent value="income-tax" className="mt-0 animate-fade-in">
            <IncomeTaxSimulator />
          </TabsContent>

          <TabsContent value="gst" className="mt-0 animate-fade-in">
            <GSTSimulator />
          </TabsContent>

          <TabsContent value="composition" className="mt-0 animate-fade-in">
            <CompositionSchemeSimulator />
          </TabsContent>

          <TabsContent value="startup" className="mt-0 animate-fade-in">
            <StartupIndiaSimulator />
          </TabsContent>
        </Tabs>
      </main>

      <AssumptionsModal
        isOpen={showAssumptions}
        onClose={() => setShowAssumptions(false)}
      />
    </div>
  );
};

export default Simulator;