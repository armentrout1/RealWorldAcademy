import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import Layout from "@/components/layout/Layout";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ProgressProvider } from "@/contexts/ProgressContext";
import { AuthProvider } from "@/contexts/AuthContext";

// Import pages
import Home from "@/pages/Home";
import Dashboard from "@/pages/Dashboard";
import Learn from "@/pages/Learn";
import SelfDiscovery from "@/pages/SelfDiscovery";
import Projects from "@/pages/Projects";
import TeamProjects from "@/pages/TeamProjects";
import About from "@/pages/About";
import FinancialLiteracy from "@/pages/FinancialLiteracy";
import HowWeLearn from "@/pages/HowWeLearn";
import PlanYourFuture from "@/pages/PlanYourFuture";
import Login from "@/pages/Login";
import Signup from "@/pages/Signup";
import Profile from "@/pages/Profile";
import Settings from "@/pages/Settings";
import TeacherDashboard from "@/pages/TeacherDashboard";
import ParentDashboard from "@/pages/ParentDashboard";
import CurriculumBuilder from "@/pages/CurriculumBuilder";
import ResourceCenter from "@/pages/ResourceCenter";
import Community from "@/pages/Community";
import Journal from "@/pages/Journal";
import LessonTemplate from "@/pages/LessonTemplate";
import NotFound from "@/pages/not-found";
import ContributeLesson from "@/pages/ContributeLesson";
import ContributorDashboard from "@/pages/ContributorDashboard";
import ContributorProfile from "@/pages/ContributorProfile";
import AdminLessons from "@/pages/AdminLessons";
import LessonLibrary from "@/pages/LessonLibrary";
import Credentials from "@/pages/Credentials";
import CredentialVerification from "@/pages/CredentialVerification";
import Portfolio from "@/pages/Portfolio";
import LegalInfo from "@/pages/LegalInfo";
import Feedback from "@/pages/Feedback";

// Page transition variants
const pageVariants = {
  initial: {
    opacity: 0,
    y: 10,
  },
  in: {
    opacity: 1,
    y: 0,
  },
  out: {
    opacity: 0,
    y: -10,
  },
};

const pageTransition = {
  type: "tween",
  ease: "easeInOut",
  duration: 0.3,
};

// Page wrapper component with transitions
const PageWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
      className="h-full w-full"
    >
      {children}
    </motion.div>
  );
};

function Router() {
  const [location] = useLocation();
  const [displayLocation, setDisplayLocation] = useState(location);
  const [transitionStage, setTransitionStage] = useState("fadeIn");

  useEffect(() => {
    if (location !== displayLocation) {
      setTransitionStage("fadeOut");
      
      // Small delay to allow for exit animation
      const timeoutId = setTimeout(() => {
        setDisplayLocation(location);
        setTransitionStage("fadeIn");
      }, 300);
      
      return () => clearTimeout(timeoutId);
    }
  }, [location, displayLocation]);

  return (
    <Layout>
      <div className={`${transitionStage}`}>
        <AnimatePresence mode="wait">
          <Switch key={displayLocation} location={displayLocation}>
            <Route path="/">
              <PageWrapper>
                <Home />
              </PageWrapper>
            </Route>
            <Route path="/dashboard">
              <PageWrapper>
                <Dashboard />
              </PageWrapper>
            </Route>
            <Route path="/learn">
              <PageWrapper>
                <Learn />
              </PageWrapper>
            </Route>
            <Route path="/learn/:subject/:lesson">
              <PageWrapper>
                <LessonTemplate />
              </PageWrapper>
            </Route>
            <Route path="/learn/:subject">
              <PageWrapper>
                <Learn />
              </PageWrapper>
            </Route>
            <Route path="/self-discovery">
              <PageWrapper>
                <SelfDiscovery />
              </PageWrapper>
            </Route>
            <Route path="/projects">
              <PageWrapper>
                <Projects />
              </PageWrapper>
            </Route>
            <Route path="/projects/:projectId">
              <PageWrapper>
                <Projects />
              </PageWrapper>
            </Route>
            <Route path="/about">
              <PageWrapper>
                <About />
              </PageWrapper>
            </Route>
            <Route path="/financial-literacy">
              <PageWrapper>
                <FinancialLiteracy />
              </PageWrapper>
            </Route>
            <Route path="/financial-literacy/:moduleId">
              <PageWrapper>
                <FinancialLiteracy />
              </PageWrapper>
            </Route>
            <Route path="/how-we-learn">
              <PageWrapper>
                <HowWeLearn />
              </PageWrapper>
            </Route>
            <Route path="/team-projects">
              <PageWrapper>
                <TeamProjects />
              </PageWrapper>
            </Route>
            <Route path="/plan-your-future">
              <PageWrapper>
                <PlanYourFuture />
              </PageWrapper>
            </Route>
            <Route path="/login">
              <PageWrapper>
                <Login />
              </PageWrapper>
            </Route>
            <Route path="/signup">
              <PageWrapper>
                <Signup />
              </PageWrapper>
            </Route>
            <Route path="/profile">
              <PageWrapper>
                <Profile />
              </PageWrapper>
            </Route>
            <Route path="/settings">
              <PageWrapper>
                <Settings />
              </PageWrapper>
            </Route>
            <Route path="/teacher-dashboard">
              <PageWrapper>
                <TeacherDashboard />
              </PageWrapper>
            </Route>
            <Route path="/parent-dashboard">
              <PageWrapper>
                <ParentDashboard />
              </PageWrapper>
            </Route>
            <Route path="/curriculum-builder">
              <PageWrapper>
                <CurriculumBuilder />
              </PageWrapper>
            </Route>
            <Route path="/resource-center">
              <PageWrapper>
                <ResourceCenter />
              </PageWrapper>
            </Route>
            <Route path="/credentials">
              <PageWrapper>
                <Credentials />
              </PageWrapper>
            </Route>
            <Route path="/verify/:shareCode">
              <PageWrapper>
                <CredentialVerification />
              </PageWrapper>
            </Route>
            <Route path="/portfolio">
              <PageWrapper>
                <Portfolio />
              </PageWrapper>
            </Route>
            <Route path="/privacy">
              <PageWrapper>
                <LegalInfo />
              </PageWrapper>
            </Route>
            <Route path="/terms">
              <PageWrapper>
                <LegalInfo />
              </PageWrapper>
            </Route>
            <Route path="/safety">
              <PageWrapper>
                <LegalInfo />
              </PageWrapper>
            </Route>
            <Route path="/feedback">
              <PageWrapper>
                <Feedback />
              </PageWrapper>
            </Route>
            <Route path="/community">
              <PageWrapper>
                <Community />
              </PageWrapper>
            </Route>
            <Route path="/journal">
              <PageWrapper>
                <Journal />
              </PageWrapper>
            </Route>
            <Route path="/lesson/smart-money-challenge">
              <PageWrapper>
                <LessonTemplate />
              </PageWrapper>
            </Route>
            <Route path="/contribute">
              <PageWrapper>
                <ContributeLesson />
              </PageWrapper>
            </Route>
            <Route path="/contributor-profile">
              <PageWrapper>
                <ContributorProfile />
              </PageWrapper>
            </Route>
            <Route path="/contributor-dashboard">
              <PageWrapper>
                <ContributorDashboard />
              </PageWrapper>
            </Route>
            <Route path="/admin/lessons">
              <PageWrapper>
                <AdminLessons />
              </PageWrapper>
            </Route>
            <Route path="/library">
              <PageWrapper>
                <LessonLibrary />
              </PageWrapper>
            </Route>
            <Route>
              <PageWrapper>
                <NotFound />
              </PageWrapper>
            </Route>
          </Switch>
        </AnimatePresence>
      </div>
    </Layout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ProgressProvider>
          <Router />
          <Toaster />
        </ProgressProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
