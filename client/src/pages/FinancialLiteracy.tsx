import React, { useState, useEffect } from "react";
import { Link } from "wouter";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Calculator, 
  CreditCard, 
  DollarSign, 
  Landmark, 
  LineChart, 
  PiggyBank, 
  ShoppingCart,
  Home,
  Utensils,
  Car,
  Music,
  Smartphone,
  ChevronRight
} from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Legend, 
  Tooltip 
} from "recharts";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";

// Learning modules data
const learningModules = [
  {
    id: "what-is-money",
    title: "What is Money?",
    description: "Learn about the history, purpose, and different forms of money in modern society.",
    icon: <DollarSign className="h-6 w-6" />,
    color: "bg-green-500",
    level: "Beginner"
  },
  {
    id: "budgeting-basics",
    title: "Budgeting Basics",
    description: "Master the essential skill of creating and maintaining a personal budget that works for your lifestyle.",
    icon: <Calculator className="h-6 w-6" />,
    color: "bg-blue-500",
    level: "Beginner"
  },
  {
    id: "credit-scores",
    title: "Credit Scores Explained",
    description: "Understand how credit scores work, why they matter, and how to build and maintain good credit.",
    icon: <CreditCard className="h-6 w-6" />,
    color: "bg-purple-500",
    level: "Intermediate"
  },
  {
    id: "loans-mortgages",
    title: "Loans & Mortgages",
    description: "Navigate the world of borrowing money, from student loans to home mortgages and everything in between.",
    icon: <Landmark className="h-6 w-6" />,
    color: "bg-amber-500",
    level: "Intermediate"
  },
  {
    id: "needs-vs-wants",
    title: "Needs vs. Wants",
    description: "Learn to distinguish between essential expenses and discretionary spending to make better financial decisions.",
    icon: <ShoppingCart className="h-6 w-6" />,
    color: "bg-rose-500",
    level: "Beginner"
  },
  {
    id: "investing-101",
    title: "Investing 101",
    description: "Discover the basics of growing your money through different investment vehicles and strategies.",
    icon: <LineChart className="h-6 w-6" />,
    color: "bg-cyan-500",
    level: "Advanced"
  }
];

// Budget categories with icons
const budgetCategories = [
  { id: "rent", name: "Rent/Housing", icon: <Home className="h-5 w-5" />, color: "#3b82f6" },
  { id: "food", name: "Food & Groceries", icon: <Utensils className="h-5 w-5" />, color: "#10b981" },
  { id: "transportation", name: "Transportation", icon: <Car className="h-5 w-5" />, color: "#f59e0b" },
  { id: "entertainment", name: "Entertainment", icon: <Music className="h-5 w-5" />, color: "#8b5cf6" },
  { id: "internet", name: "Internet/Phone", icon: <Smartphone className="h-5 w-5" />, color: "#ec4899" },
  { id: "savings", name: "Savings", icon: <PiggyBank className="h-5 w-5" />, color: "#6366f1" }
];

// Interface for budget allocations
interface BudgetAllocation {
  id: string;
  name: string;
  amount: number;
  icon: React.ReactNode;
  color: string;
}

// Placeholder component for module content
const ModulePlaceholder: React.FC<{ moduleId: string }> = ({ moduleId }) => {
  const module = learningModules.find(m => m.id === moduleId);
  
  if (!module) {
    return <div>Module not found</div>;
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href="/financial-literacy">
          <Button variant="outline" className="mb-4">
            <ChevronRight className="h-4 w-4 mr-2 rotate-180" />
            Back to Financial Literacy
          </Button>
        </Link>
        <h1 className="font-sans font-bold text-3xl text-neutral-900 mb-2">{module.title}</h1>
        <p className="text-neutral-600">Module content coming soon!</p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Get Started</CardTitle>
          <CardDescription>This module is currently under development. Check back soon for interactive lessons and activities!</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-8 text-center">
            <div className={`${module.color} text-white p-4 rounded-full inline-flex mb-4`}>
              {module.icon}
            </div>
            <h3 className="text-xl font-medium mb-2">Coming Soon</h3>
            <p className="text-neutral-600 mb-4">Our team is working hard to create engaging content for this module.</p>
          </div>
        </CardContent>
        <CardFooter>
          <Button asChild className="w-full">
            <Link href="/financial-literacy">Return to Financial Literacy</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

// Monthly Budget Activity Component
const MonthlyBudgetActivity: React.FC = () => {
  const monthlyIncome = 3000;
  const [allocations, setAllocations] = useState<BudgetAllocation[]>(
    budgetCategories.map(category => ({
      ...category,
      amount: 0
    }))
  );
  
  const [totalAllocated, setTotalAllocated] = useState(0);
  const [remaining, setRemaining] = useState(monthlyIncome);
  const [isOverBudget, setIsOverBudget] = useState(false);
  
  // Update a specific allocation
  const updateAllocation = (id: string, amount: number) => {
    setAllocations(prev => 
      prev.map(item => 
        item.id === id ? { ...item, amount } : item
      )
    );
  };
  
  // Recalculate totals when allocations change
  useEffect(() => {
    const total = allocations.reduce((sum, item) => sum + item.amount, 0);
    setTotalAllocated(total);
    setRemaining(monthlyIncome - total);
    setIsOverBudget(total > monthlyIncome);
  }, [allocations]);
  
  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };
  
  // Prepare chart data
  const chartData = allocations
    .filter(item => item.amount > 0)
    .map(item => ({
      name: item.name,
      value: item.amount,
      color: item.color
    }));
    
  // Reset allocations to zero
  const resetBudget = () => {
    setAllocations(budgetCategories.map(category => ({
      ...category,
      amount: 0
    })));
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="h-5 w-5" />
          Monthly Budget Activity
        </CardTitle>
        <CardDescription>
          Practice allocating a monthly income of {formatCurrency(monthlyIncome)} across different expense categories.
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="grid gap-6 md:grid-cols-[1fr_auto]">
          <div>
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-medium text-lg">Your Budget</h3>
                <Button variant="outline" size="sm" onClick={resetBudget}>Reset</Button>
              </div>
              
              <div className="flex justify-between mb-2">
                <span className="text-neutral-600">Monthly Income:</span>
                <span className="font-medium">{formatCurrency(monthlyIncome)}</span>
              </div>
              
              <div className="flex justify-between mb-2">
                <span className="text-neutral-600">Allocated:</span>
                <span className="font-medium">{formatCurrency(totalAllocated)}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-neutral-600">Remaining:</span>
                <span className={`font-medium ${isOverBudget ? 'text-red-500' : 'text-green-500'}`}>
                  {formatCurrency(remaining)}
                </span>
              </div>
            </div>
            
            {isOverBudget && (
              <Alert variant="destructive" className="mb-6">
                <AlertTitle className="flex items-center gap-2">
                  Warning: Over Budget!
                </AlertTitle>
                <AlertDescription>
                  You've allocated {formatCurrency(Math.abs(remaining))} more than your monthly income.
                  Adjust your categories to stay within your budget.
                </AlertDescription>
              </Alert>
            )}
            
            {remaining === 0 && totalAllocated > 0 && (
              <Alert className="mb-6 bg-green-50 border-green-200 text-green-800">
                <AlertTitle className="flex items-center gap-2">
                  Perfect Balance!
                </AlertTitle>
                <AlertDescription>
                  You've allocated exactly {formatCurrency(monthlyIncome)}, using your entire budget efficiently.
                </AlertDescription>
              </Alert>
            )}
            
            <div className="space-y-6">
              {allocations.map((item) => (
                <div key={item.id}>
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-full" style={{ backgroundColor: item.color }}>
                        {React.cloneElement(item.icon as React.ReactElement, { className: 'h-4 w-4 text-white' })}
                      </div>
                      <span className="font-medium">{item.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="font-mono">
                        {formatCurrency(item.amount)}
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        {totalAllocated > 0 ? Math.round((item.amount / totalAllocated) * 100) : 0}%
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <Slider
                        value={[item.amount]}
                        max={monthlyIncome}
                        step={50}
                        onValueChange={(values) => updateAllocation(item.id, values[0])}
                      />
                    </div>
                    <div className="w-24">
                      <input
                        type="number"
                        value={item.amount}
                        onChange={(e) => updateAllocation(item.id, Math.max(0, parseInt(e.target.value) || 0))}
                        className="w-full p-2 border rounded-md text-right"
                        min="0"
                        max={monthlyIncome}
                        step="50"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex flex-col items-center">
            <h3 className="font-medium text-lg mb-4 text-center">Budget Breakdown</h3>
            {chartData.length > 0 ? (
              <div className="h-[300px] w-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={2}
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      labelLine={false}
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value: number) => formatCurrency(value)} 
                      contentStyle={{ borderRadius: '8px' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-[300px] w-[300px] flex items-center justify-center bg-neutral-50 rounded-full">
                <div className="text-center text-neutral-500">
                  <PiggyBank className="h-12 w-12 mx-auto mb-2 text-neutral-300" />
                  <p>Adjust sliders to see<br />your budget breakdown</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between border-t pt-6">
        <Button variant="outline">Save Budget</Button>
        <Button>Download PDF Report</Button>
      </CardFooter>
    </Card>
  );
};

// Main Financial Literacy Page
const FinancialLiteracy: React.FC = () => {
  const { pathname } = window.location;
  
  // Check if we're on a specific module page
  const matchModule = pathname.match(/\/financial-literacy\/([a-z-]+)/);
  if (matchModule) {
    const moduleId = matchModule[1];
    return <ModulePlaceholder moduleId={moduleId} />;
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="font-sans font-bold text-3xl md:text-4xl text-neutral-900 mb-3">Financial Literacy</h1>
        <p className="text-lg text-neutral-600 max-w-3xl">
          Understanding money is a critical life skill that affects everything from daily decisions to long-term goals. 
          Financial literacy empowers you to make informed choices, build security, and achieve your dreams without the stress 
          of financial uncertainty.
        </p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {learningModules.map((module) => (
          <Card key={module.id} className="overflow-hidden hover:shadow-md transition-all duration-200">
            <div className={`${module.color} h-2`}></div>
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="flex items-center gap-2">
                  <div className={`${module.color} text-white p-1.5 rounded-lg`}>
                    {module.icon}
                  </div>
                  {module.title}
                </CardTitle>
                <Badge variant={
                  module.level === "Beginner" ? "default" : 
                  module.level === "Intermediate" ? "secondary" : 
                  "outline"
                }>
                  {module.level}
                </Badge>
              </div>
              <CardDescription>{module.description}</CardDescription>
            </CardHeader>
            <CardFooter>
              <Button asChild className="w-full">
                <Link href={`/financial-literacy/${module.id}`}>
                  Start Learning
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      
      <div className="mb-6">
        <h2 className="font-sans font-bold text-2xl text-neutral-900 mb-2">Interactive Practice: Monthly Budget</h2>
        <p className="text-neutral-600 max-w-3xl mb-6">
          Planning how to use your money is one of the most important financial skills. Try this budgeting activity to practice 
          allocating a monthly income across different expense categories, and see a visual breakdown of your choices.
        </p>
        
        <MonthlyBudgetActivity />
      </div>
    </div>
  );
};

export default FinancialLiteracy;