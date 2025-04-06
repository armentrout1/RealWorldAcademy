import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import Layout from "@/components/layout/Layout";

// Import pages
import Home from "@/pages/Home";
import Dashboard from "@/pages/Dashboard";
import Learn from "@/pages/Learn";
import SelfDiscovery from "@/pages/SelfDiscovery";
import Projects from "@/pages/Projects";
import About from "@/pages/About";
import FinancialLiteracy from "@/pages/FinancialLiteracy";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/dashboard" component={Dashboard} />
        <Route path="/learn" component={Learn} />
        <Route path="/learn/:subject" component={Learn} />
        <Route path="/self-discovery" component={SelfDiscovery} />
        <Route path="/projects" component={Projects} />
        <Route path="/about" component={About} />
        <Route path="/financial-literacy" component={FinancialLiteracy} />
        <Route path="/financial-literacy/:moduleId" component={FinancialLiteracy} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
