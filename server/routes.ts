import express, { type Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertUserSchema, insertCourseSchema, insertCategorySchema, 
  insertTestimonialSchema, insertFeatureSchema,
  insertBadgeSchema, insertCategoryProgressSchema, 
  insertTimelineEventSchema, insertUserProgressSummarySchema,
  insertCareerPathSchema, insertGoalSchema, insertVisionBoardItemSchema,
  insertResourceSchema, insertDailyChallengeSchema, insertUserChallengeSchema,
  insertBuddyProfileSchema, insertBuddyMessageSchema, insertBuddyEmotionLogSchema,
  insertBuddyJournalEntrySchema
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

  // Resource Center endpoints
  app.get("/api/resources", async (req, res) => {
    try {
      const resources = await storage.getAllResources();
      res.json(resources);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch resources" });
    }
  });

  app.get("/api/resources/featured", async (req, res) => {
    try {
      const featuredResources = await storage.getFeaturedResources();
      res.json(featuredResources);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch featured resources" });
    }
  });

  app.get("/api/resources/category/:category", async (req, res) => {
    try {
      const { category } = req.params;
      const resources = await storage.getResourcesByCategory(category);
      res.json(resources);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch resources by category" });
    }
  });

  app.get("/api/resources/audience/:audience", async (req, res) => {
    try {
      const { audience } = req.params;
      const resources = await storage.getResourcesByAudience(audience);
      res.json(resources);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch resources by audience" });
    }
  });

  app.get("/api/resources/type/:type", async (req, res) => {
    try {
      const { type } = req.params;
      const resources = await storage.getResourcesByType(type);
      res.json(resources);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch resources by type" });
    }
  });

  app.get("/api/resources/:id", async (req, res) => {
    try {
      const resource = await storage.getResource(Number(req.params.id));
      if (!resource) {
        return res.status(404).json({ message: "Resource not found" });
      }
      res.json(resource);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch resource" });
    }
  });

  app.post("/api/resources", express.json(), async (req, res) => {
    try {
      const validatedData = insertResourceSchema.parse(req.body);
      const newResource = await storage.createResource(validatedData);
      res.status(201).json(newResource);
    } catch (error) {
      res.status(400).json({ message: "Invalid resource data" });
    }
  });

  app.patch("/api/resources/:id", express.json(), async (req, res) => {
    try {
      const resourceId = Number(req.params.id);
      const resource = await storage.getResource(resourceId);
      
      if (!resource) {
        return res.status(404).json({ message: "Resource not found" });
      }
      
      const updatedResource = await storage.updateResource(resourceId, req.body);
      res.json(updatedResource);
    } catch (error) {
      res.status(400).json({ message: "Invalid resource update data" });
    }
  });

  app.post("/api/resources/:id/download", async (req, res) => {
    try {
      const resourceId = Number(req.params.id);
      const resource = await storage.getResource(resourceId);
      
      if (!resource) {
        return res.status(404).json({ message: "Resource not found" });
      }
      
      // Increment the download count
      const updatedResource = await storage.incrementDownloadCount(resourceId);
      res.json(updatedResource);
    } catch (error) {
      res.status(500).json({ message: "Failed to process download" });
    }
  });

  // Gamification Routes
  // Daily Challenges
  app.get("/api/challenges/daily", async (req, res) => {
    try {
      const activeChallenges = await storage.getActiveDailyChallenges();
      res.json(activeChallenges);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch daily challenges" });
    }
  });
  
  app.get("/api/challenges", async (req, res) => {
    try {
      const challenges = await storage.getAllDailyChallenges();
      res.json(challenges);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch challenges" });
    }
  });
  
  app.get("/api/challenges/:id", async (req, res) => {
    try {
      const challenge = await storage.getDailyChallenge(Number(req.params.id));
      if (!challenge) {
        return res.status(404).json({ message: "Challenge not found" });
      }
      res.json(challenge);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch challenge" });
    }
  });
  
  app.post("/api/challenges", express.json(), async (req, res) => {
    try {
      const validatedData = insertDailyChallengeSchema.parse(req.body);
      const newChallenge = await storage.createDailyChallenge(validatedData);
      res.status(201).json(newChallenge);
    } catch (error) {
      res.status(400).json({ message: "Invalid challenge data" });
    }
  });
  
  // User Challenges (completed challenges)
  app.get("/api/users/:userId/challenges", async (req, res) => {
    try {
      const userId = Number(req.params.userId);
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const userChallenges = await storage.getUserCompletedChallenges(userId);
      res.json(userChallenges);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user challenges" });
    }
  });
  
  app.get("/api/users/:userId/challenges/today", async (req, res) => {
    try {
      const userId = Number(req.params.userId);
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const todayChallenges = await storage.getUserTodayCompletedChallenges(userId);
      res.json(todayChallenges);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch today's completed challenges" });
    }
  });
  
  app.post("/api/users/:userId/challenges/complete", express.json(), async (req, res) => {
    try {
      const userId = Number(req.params.userId);
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const { challengeId, xpEarned } = req.body;
      
      // Validate challenge exists
      const challenge = await storage.getDailyChallenge(Number(challengeId));
      if (!challenge) {
        return res.status(404).json({ message: "Challenge not found" });
      }
      
      const validatedData = insertUserChallengeSchema.parse({
        userId,
        challengeId: Number(challengeId),
        completedAt: new Date(),
        xpEarned: xpEarned || challenge.xpReward // Use provided XP or default from challenge
      });
      
      const completedChallenge = await storage.completeChallenge(validatedData);
      res.status(201).json(completedChallenge);
    } catch (error) {
      res.status(400).json({ message: "Invalid challenge completion data" });
    }
  });
  
  // XP and Level endpoints
  app.post("/api/users/:userId/xp", express.json(), async (req, res) => {
    try {
      const userId = Number(req.params.userId);
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const { xp } = req.body;
      if (xp === undefined || isNaN(Number(xp))) {
        return res.status(400).json({ message: "Valid XP amount required" });
      }
      
      const updatedUser = await storage.updateUserXP(userId, Number(xp));
      // Don't send password back
      const { password, ...userWithoutPassword } = updatedUser;
      res.json(userWithoutPassword);
    } catch (error) {
      res.status(400).json({ message: "Failed to update user XP" });
    }
  });
  
  app.post("/api/users/:userId/streak", express.json(), async (req, res) => {
    try {
      const userId = Number(req.params.userId);
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const { streak } = req.body;
      if (streak === undefined || isNaN(Number(streak))) {
        return res.status(400).json({ message: "Valid streak count required" });
      }
      
      const updatedUser = await storage.updateUserStreak(userId, Number(streak));
      // Don't send password back
      const { password, ...userWithoutPassword } = updatedUser;
      res.json(userWithoutPassword);
    } catch (error) {
      res.status(400).json({ message: "Failed to update user streak" });
    }
  });
  
  // Buddy AI endpoints
  // Get buddy profile
  app.get("/api/users/:userId/buddy", async (req, res) => {
    try {
      const userId = Number(req.params.userId);
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const buddyProfile = await storage.getBuddyProfile(userId);
      if (!buddyProfile) {
        // Initialize a new buddy profile if one doesn't exist
        const newBuddyProfile = await storage.initializeBuddyProfile(userId);
        return res.json(newBuddyProfile);
      }
      
      res.json(buddyProfile);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch buddy profile" });
    }
  });
  
  // Update buddy profile
  app.patch("/api/users/:userId/buddy", express.json(), async (req, res) => {
    try {
      const userId = Number(req.params.userId);
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Only allow updating certain buddy properties
      const { name, avatarType, avatarColor, personalityType } = req.body;
      const updateData: {
        name?: string;
        avatarType?: string;
        avatarColor?: string;
        personalityType?: string;
      } = {};
      
      if (name !== undefined) updateData.name = String(name);
      if (avatarType !== undefined) updateData.avatarType = String(avatarType);
      if (avatarColor !== undefined) updateData.avatarColor = String(avatarColor);
      if (personalityType !== undefined) updateData.personalityType = String(personalityType);
      
      const updatedBuddy = await storage.updateBuddyProfile(userId, updateData);
      res.json(updatedBuddy);
    } catch (error) {
      res.status(400).json({ message: "Failed to update buddy profile" });
    }
  });
  
  // Get buddy chat history
  app.get("/api/users/:userId/buddy/messages", async (req, res) => {
    try {
      const userId = Number(req.params.userId);
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const limit = req.query.limit ? Number(req.query.limit) : undefined;
      const messages = await storage.getBuddyMessages(userId, limit);
      res.json(messages);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch buddy messages" });
    }
  });
  
  // Send message to buddy
  app.post("/api/users/:userId/buddy/messages", express.json(), async (req, res) => {
    try {
      const userId = Number(req.params.userId);
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const { content, isFromBuddy } = req.body;
      
      // Validate that message content exists
      if (!content) {
        return res.status(400).json({ message: "Message content is required" });
      }
      
      // Create message
      const validatedData = insertBuddyMessageSchema.parse({
        userId,
        content: String(content),
        isFromBuddy: Boolean(isFromBuddy),
        sentAt: new Date()
      });
      
      const newMessage = await storage.createBuddyMessage(validatedData);
      res.status(201).json(newMessage);
    } catch (error) {
      res.status(400).json({ message: "Invalid message data" });
    }
  });
  
  // Record buddy emotion
  app.post("/api/users/:userId/buddy/emotions", express.json(), async (req, res) => {
    try {
      const userId = Number(req.params.userId);
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const { emotion, intensity, note } = req.body;
      
      // Validate that emotion exists
      if (!emotion) {
        return res.status(400).json({ message: "Emotion type is required" });
      }
      
      // Create emotion record
      const validatedData = insertBuddyEmotionLogSchema.parse({
        userId,
        emotion: String(emotion),
        intensity: Number(intensity) || 5, // Default to middle intensity
        note: note ? String(note) : null,
        loggedAt: new Date()
      });
      
      const newEmotionLog = await storage.recordBuddyEmotion(validatedData);
      res.status(201).json(newEmotionLog);
    } catch (error) {
      res.status(400).json({ message: "Invalid emotion data" });
    }
  });
  
  // Get latest emotion
  app.get("/api/users/:userId/buddy/emotions/latest", async (req, res) => {
    try {
      const userId = Number(req.params.userId);
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const latestEmotion = await storage.getLatestBuddyEmotion(userId);
      if (!latestEmotion) {
        return res.status(404).json({ message: "No emotion records found" });
      }
      
      res.json(latestEmotion);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch emotion records" });
    }
  });
  
  // Get emotion history
  app.get("/api/users/:userId/buddy/emotions", async (req, res) => {
    try {
      const userId = Number(req.params.userId);
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const limit = req.query.limit ? Number(req.query.limit) : undefined;
      const emotions = await storage.getBuddyEmotions(userId, limit);
      res.json(emotions);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch emotion records" });
    }
  });

  // Journal endpoints
  
  // Get journal entries
  app.get("/api/users/:userId/buddy/journal", async (req, res) => {
    try {
      const userId = Number(req.params.userId);
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const limit = req.query.limit ? Number(req.query.limit) : undefined;
      const entries = await storage.getBuddyJournalEntries(userId, limit);
      res.json(entries);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch journal entries" });
    }
  });
  
  // Create a new journal entry
  app.post("/api/users/:userId/buddy/journal", express.json(), async (req, res) => {
    try {
      const userId = Number(req.params.userId);
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const validatedData = insertBuddyJournalEntrySchema.parse({
        ...req.body,
        userId,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      
      const entry = await storage.createJournalEntry(validatedData);
      res.status(201).json(entry);
    } catch (error) {
      res.status(400).json({ message: "Invalid journal entry data" });
    }
  });
  
  // Get a specific journal entry
  app.get("/api/users/:userId/buddy/journal/:entryId", async (req, res) => {
    try {
      const userId = Number(req.params.userId);
      const entryId = Number(req.params.entryId);
      
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const entry = await storage.getJournalEntryById(entryId);
      if (!entry) {
        return res.status(404).json({ message: "Journal entry not found" });
      }
      
      // Ensure the entry belongs to the user
      if (entry.userId !== userId) {
        return res.status(403).json({ message: "Access denied" });
      }
      
      res.json(entry);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch journal entry" });
    }
  });
  
  // Update a journal entry
  app.patch("/api/users/:userId/buddy/journal/:entryId", express.json(), async (req, res) => {
    try {
      const userId = Number(req.params.userId);
      const entryId = Number(req.params.entryId);
      
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const entry = await storage.getJournalEntryById(entryId);
      if (!entry) {
        return res.status(404).json({ message: "Journal entry not found" });
      }
      
      // Ensure the entry belongs to the user
      if (entry.userId !== userId) {
        return res.status(403).json({ message: "Access denied" });
      }
      
      // Update only allowed fields
      const updates = {
        ...req.body,
        updatedAt: new Date()
      };
      
      const updatedEntry = await storage.updateJournalEntry(entryId, updates);
      res.json(updatedEntry);
    } catch (error) {
      res.status(400).json({ message: "Invalid journal entry update data" });
    }
  });
  
  // Delete a journal entry
  app.delete("/api/users/:userId/buddy/journal/:entryId", async (req, res) => {
    try {
      const userId = Number(req.params.userId);
      const entryId = Number(req.params.entryId);
      
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const entry = await storage.getJournalEntryById(entryId);
      if (!entry) {
        return res.status(404).json({ message: "Journal entry not found" });
      }
      
      // Ensure the entry belongs to the user
      if (entry.userId !== userId) {
        return res.status(403).json({ message: "Access denied" });
      }
      
      await storage.deleteJournalEntry(entryId);
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete journal entry" });
    }
  });
  
  // Get journal entries by tag
  app.get("/api/users/:userId/buddy/journal/tags/:tag", async (req, res) => {
    try {
      const userId = Number(req.params.userId);
      const tag = req.params.tag;
      
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const entries = await storage.getJournalEntriesByTag(userId, tag);
      res.json(entries);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch journal entries by tag" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
