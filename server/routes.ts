import express, { type Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertUserSchema, insertCourseSchema, insertCategorySchema, 
  insertTestimonialSchema, insertFeatureSchema,
  insertBadgeSchema, insertCategoryProgressSchema, 
  insertTimelineEventSchema, insertUserProgressSummarySchema,
  insertCareerPathSchema, insertGoalSchema, insertVisionBoardItemSchema
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Courses endpoints
  app.get("/api/courses", async (req, res) => {
    try {
      const courses = await storage.getAllCourses();
      res.json(courses);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch courses" });
    }
  });

  app.get("/api/courses/featured", async (req, res) => {
    try {
      const featuredCourses = await storage.getFeaturedCourses();
      res.json(featuredCourses);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch featured courses" });
    }
  });

  app.get("/api/courses/:id", async (req, res) => {
    try {
      const course = await storage.getCourse(Number(req.params.id));
      if (!course) {
        return res.status(404).json({ message: "Course not found" });
      }
      res.json(course);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch course" });
    }
  });

  app.post("/api/courses", express.json(), async (req, res) => {
    try {
      const validatedData = insertCourseSchema.parse(req.body);
      const newCourse = await storage.createCourse(validatedData);
      res.status(201).json(newCourse);
    } catch (error) {
      res.status(400).json({ message: "Invalid course data" });
    }
  });

  // Categories endpoints
  app.get("/api/categories", async (req, res) => {
    try {
      const categories = await storage.getAllCategories();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch categories" });
    }
  });

  app.get("/api/categories/:id", async (req, res) => {
    try {
      const category = await storage.getCategory(Number(req.params.id));
      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }
      res.json(category);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch category" });
    }
  });

  app.post("/api/categories", express.json(), async (req, res) => {
    try {
      const validatedData = insertCategorySchema.parse(req.body);
      const newCategory = await storage.createCategory(validatedData);
      res.status(201).json(newCategory);
    } catch (error) {
      res.status(400).json({ message: "Invalid category data" });
    }
  });

  // Testimonials endpoints
  app.get("/api/testimonials", async (req, res) => {
    try {
      const testimonials = await storage.getAllTestimonials();
      res.json(testimonials);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch testimonials" });
    }
  });

  app.post("/api/testimonials", express.json(), async (req, res) => {
    try {
      const validatedData = insertTestimonialSchema.parse(req.body);
      const newTestimonial = await storage.createTestimonial(validatedData);
      res.status(201).json(newTestimonial);
    } catch (error) {
      res.status(400).json({ message: "Invalid testimonial data" });
    }
  });

  // Features endpoints
  app.get("/api/features", async (req, res) => {
    try {
      const features = await storage.getAllFeatures();
      res.json(features);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch features" });
    }
  });

  app.post("/api/features", express.json(), async (req, res) => {
    try {
      const validatedData = insertFeatureSchema.parse(req.body);
      const newFeature = await storage.createFeature(validatedData);
      res.status(201).json(newFeature);
    } catch (error) {
      res.status(400).json({ message: "Invalid feature data" });
    }
  });

  // User endpoints
  app.post("/api/users", express.json(), async (req, res) => {
    try {
      const validatedData = insertUserSchema.parse(req.body);
      const existingUser = await storage.getUserByUsername(validatedData.username);
      
      if (existingUser) {
        return res.status(409).json({ message: "Username already exists" });
      }
      
      const newUser = await storage.createUser(validatedData);
      // Don't send password back
      const { password, ...userWithoutPassword } = newUser;
      res.status(201).json(userWithoutPassword);
    } catch (error) {
      res.status(400).json({ message: "Invalid user data" });
    }
  });

  app.get("/api/users/:id", async (req, res) => {
    try {
      const user = await storage.getUser(Number(req.params.id));
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      // Don't send password back
      const { password, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Progress tracking endpoints
  // Badges endpoints
  app.get("/api/users/:userId/badges", async (req, res) => {
    try {
      const userId = Number(req.params.userId);
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const badges = await storage.getUserBadges(userId);
      res.json(badges);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch badges" });
    }
  });

  app.post("/api/users/:userId/badges", express.json(), async (req, res) => {
    try {
      const userId = Number(req.params.userId);
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const validatedData = insertBadgeSchema.parse({
        ...req.body,
        userId
      });
      
      const newBadge = await storage.createBadge(validatedData);
      res.status(201).json(newBadge);
    } catch (error) {
      res.status(400).json({ message: "Invalid badge data" });
    }
  });

  app.patch("/api/users/:userId/badges/:badgeId", express.json(), async (req, res) => {
    try {
      const userId = Number(req.params.userId);
      const badgeId = Number(req.params.badgeId);
      
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Only allow updating unlocked status and dateUnlocked
      const { unlocked, dateUnlocked } = req.body;
      const updateData: { unlocked?: boolean; dateUnlocked?: Date } = {};
      
      if (unlocked !== undefined) {
        updateData.unlocked = Boolean(unlocked);
      }
      
      if (unlocked && !dateUnlocked) {
        updateData.dateUnlocked = new Date();
      } else if (dateUnlocked) {
        updateData.dateUnlocked = new Date(dateUnlocked);
      }
      
      const updatedBadge = await storage.updateBadge(badgeId, updateData);
      res.json(updatedBadge);
    } catch (error) {
      res.status(400).json({ message: "Invalid badge update data" });
    }
  });

  // Category progress endpoints
  app.get("/api/users/:userId/category-progress", async (req, res) => {
    try {
      const userId = Number(req.params.userId);
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const categoryProgress = await storage.getUserCategoryProgress(userId);
      res.json(categoryProgress);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch category progress" });
    }
  });

  app.post("/api/users/:userId/category-progress", express.json(), async (req, res) => {
    try {
      const userId = Number(req.params.userId);
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const validatedData = insertCategoryProgressSchema.parse({
        ...req.body,
        userId
      });
      
      const newCategoryProgress = await storage.createCategoryProgress(validatedData);
      res.status(201).json(newCategoryProgress);
    } catch (error) {
      res.status(400).json({ message: "Invalid category progress data" });
    }
  });

  app.patch("/api/users/:userId/category-progress/:progressId", express.json(), async (req, res) => {
    try {
      const userId = Number(req.params.userId);
      const progressId = Number(req.params.progressId);
      
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Only allow updating completed and total
      const { completed, total } = req.body;
      const updateData: { completed?: number; total?: number } = {};
      
      if (completed !== undefined) {
        updateData.completed = Number(completed);
      }
      
      if (total !== undefined) {
        updateData.total = Number(total);
      }
      
      const updatedProgress = await storage.updateCategoryProgress(progressId, updateData);
      res.json(updatedProgress);
    } catch (error) {
      res.status(400).json({ message: "Invalid category progress update data" });
    }
  });

  // Timeline events endpoints
  app.get("/api/users/:userId/timeline", async (req, res) => {
    try {
      const userId = Number(req.params.userId);
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const timelineEvents = await storage.getUserTimelineEvents(userId);
      // Sort by date, newest first
      timelineEvents.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      res.json(timelineEvents);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch timeline events" });
    }
  });

  app.post("/api/users/:userId/timeline", express.json(), async (req, res) => {
    try {
      const userId = Number(req.params.userId);
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const validatedData = insertTimelineEventSchema.parse({
        ...req.body,
        userId,
        date: req.body.date || new Date()
      });
      
      const newTimelineEvent = await storage.createTimelineEvent(validatedData);
      res.status(201).json(newTimelineEvent);
    } catch (error) {
      res.status(400).json({ message: "Invalid timeline event data" });
    }
  });

  // Progress summary endpoints
  app.get("/api/users/:userId/progress-summary", async (req, res) => {
    try {
      const userId = Number(req.params.userId);
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const progressSummary = await storage.getUserProgressSummary(userId);
      if (!progressSummary) {
        return res.status(404).json({ message: "Progress summary not found" });
      }
      
      res.json(progressSummary);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch progress summary" });
    }
  });

  app.post("/api/users/:userId/progress-summary", express.json(), async (req, res) => {
    try {
      const userId = Number(req.params.userId);
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Check if summary already exists
      const existingSummary = await storage.getUserProgressSummary(userId);
      if (existingSummary) {
        return res.status(409).json({ message: "Progress summary already exists. Use PATCH to update." });
      }
      
      const validatedData = insertUserProgressSummarySchema.parse({
        ...req.body,
        userId,
        lastUpdated: new Date()
      });
      
      const newProgressSummary = await storage.createUserProgressSummary(validatedData);
      res.status(201).json(newProgressSummary);
    } catch (error) {
      res.status(400).json({ message: "Invalid progress summary data" });
    }
  });

  app.patch("/api/users/:userId/progress-summary", express.json(), async (req, res) => {
    try {
      const userId = Number(req.params.userId);
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const { overallProgress } = req.body;
      const updateData: { overallProgress?: number; lastUpdated: Date } = {
        lastUpdated: new Date()
      };
      
      if (overallProgress !== undefined) {
        updateData.overallProgress = Number(overallProgress);
      }
      
      const updatedSummary = await storage.updateUserProgressSummary(userId, updateData);
      res.json(updatedSummary);
    } catch (error) {
      res.status(400).json({ message: "Invalid progress summary update data" });
    }
  });

  // Career paths endpoints
  app.get("/api/career-paths", async (req, res) => {
    try {
      const careerPaths = await storage.getAllCareerPaths();
      res.json(careerPaths);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch career paths" });
    }
  });

  app.get("/api/career-paths/:id", async (req, res) => {
    try {
      const careerPath = await storage.getCareerPath(Number(req.params.id));
      if (!careerPath) {
        return res.status(404).json({ message: "Career path not found" });
      }
      res.json(careerPath);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch career path" });
    }
  });

  app.post("/api/career-paths", express.json(), async (req, res) => {
    try {
      const validatedData = insertCareerPathSchema.parse(req.body);
      const newCareerPath = await storage.createCareerPath(validatedData);
      res.status(201).json(newCareerPath);
    } catch (error) {
      res.status(400).json({ message: "Invalid career path data" });
    }
  });

  // Goals endpoints
  app.get("/api/users/:userId/goals", async (req, res) => {
    try {
      const userId = Number(req.params.userId);
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const goals = await storage.getUserGoals(userId);
      res.json(goals);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch goals" });
    }
  });

  app.post("/api/users/:userId/goals", express.json(), async (req, res) => {
    try {
      const userId = Number(req.params.userId);
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const validatedData = insertGoalSchema.parse({
        ...req.body,
        userId
      });
      
      const newGoal = await storage.createGoal(validatedData);
      res.status(201).json(newGoal);
    } catch (error) {
      res.status(400).json({ message: "Invalid goal data" });
    }
  });

  app.patch("/api/users/:userId/goals/:goalId", express.json(), async (req, res) => {
    try {
      const userId = Number(req.params.userId);
      const goalId = Number(req.params.goalId);
      
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const { text, completed } = req.body;
      const updateData: { text?: string; completed?: boolean } = {};
      
      if (text !== undefined) {
        updateData.text = text;
      }
      
      if (completed !== undefined) {
        updateData.completed = Boolean(completed);
      }
      
      const updatedGoal = await storage.updateGoal(goalId, updateData);
      res.json(updatedGoal);
    } catch (error) {
      res.status(400).json({ message: "Invalid goal update data" });
    }
  });

  app.delete("/api/users/:userId/goals/:goalId", async (req, res) => {
    try {
      const userId = Number(req.params.userId);
      const goalId = Number(req.params.goalId);
      
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      await storage.deleteGoal(goalId);
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete goal" });
    }
  });

  // Vision Board Items endpoints
  app.get("/api/users/:userId/vision-board", async (req, res) => {
    try {
      const userId = Number(req.params.userId);
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const visionBoardItems = await storage.getUserVisionBoardItems(userId);
      res.json(visionBoardItems);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch vision board items" });
    }
  });

  app.post("/api/users/:userId/vision-board", express.json(), async (req, res) => {
    try {
      const userId = Number(req.params.userId);
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const validatedData = insertVisionBoardItemSchema.parse({
        ...req.body,
        userId
      });
      
      const newVisionBoardItem = await storage.createVisionBoardItem(validatedData);
      res.status(201).json(newVisionBoardItem);
    } catch (error) {
      res.status(400).json({ message: "Invalid vision board item data" });
    }
  });

  app.patch("/api/users/:userId/vision-board/:itemId", express.json(), async (req, res) => {
    try {
      const userId = Number(req.params.userId);
      const itemId = Number(req.params.itemId);
      
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const { content, position } = req.body;
      const updateData: { content?: string; position?: any } = {};
      
      if (content !== undefined) {
        updateData.content = content;
      }
      
      if (position !== undefined) {
        updateData.position = position;
      }
      
      const updatedItem = await storage.updateVisionBoardItem(itemId, updateData);
      res.json(updatedItem);
    } catch (error) {
      res.status(400).json({ message: "Invalid vision board item update data" });
    }
  });

  app.delete("/api/users/:userId/vision-board/:itemId", async (req, res) => {
    try {
      const userId = Number(req.params.userId);
      const itemId = Number(req.params.itemId);
      
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      await storage.deleteVisionBoardItem(itemId);
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete vision board item" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
