import express, { type Express, type Request, type Response } from "express";
import { createServer, type Server } from "http";
import { randomUUID } from "crypto";
import { storage } from "./storage";
import { hashPassword, toSafeUser, verifyPassword } from "./auth";
import { 
  insertUserSchema, insertCourseSchema, insertCategorySchema, 
  insertTestimonialSchema, insertFeatureSchema,
  insertBadgeSchema, insertCategoryProgressSchema, 
  insertTimelineEventSchema, insertUserProgressSummarySchema,
  insertCareerPathSchema, insertGoalSchema, insertVisionBoardItemSchema,
  insertSubjectSchema, insertLessonSchema,
  insertLessonResourceSchema,
  insertResourceSchema, insertDailyChallengeSchema, insertUserChallengeSchema,
  insertBuddyProfileSchema, insertBuddyMessageSchema, insertBuddyEmotionLogSchema,
  insertBuddyJournalEntrySchema, insertParentChildRelationshipSchema,
  insertParentLessonReviewSchema, insertCurriculumSubmissionSchema,
  insertResourceSubmissionSchema,
  insertCurriculumCollectionSchema, insertCurriculumCollectionItemSchema,
  insertFeedbackSubmissionSchema,
  insertCredentialDefinitionSchema, insertCredentialRequirementSchema,
  insertContributorProfileSchema,
  type CurriculumCollection,
  type CurriculumSubmission,
  type ResourceSubmission,
  type User
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  const configuredAdminEmails = new Set(
    (process.env.ADMIN_EMAILS || process.env.ADMIN_EMAIL || "")
      .split(",")
      .map((email) => email.trim().toLowerCase())
      .filter(Boolean),
  );

  const isConfiguredAdminEmail = (email: string): boolean => configuredAdminEmails.has(email.trim().toLowerCase());

  const promoteConfiguredAdmin = async (user: User): Promise<User> => {
    if (user.role === "admin" || !isConfiguredAdminEmail(user.email)) {
      return user;
    }

    return await storage.updateUserRole(user.id, "admin");
  };

  const requireSessionUserId = (req: Request, res: Response): number | undefined => {
    if (!req.session.userId) {
      res.status(401).json({ message: "Not authenticated" });
      return undefined;
    }

    return req.session.userId;
  };

  const canAccessUserRecord = async (
    req: Request,
    res: Response,
    targetUserId: number,
    options: { allowAdmin?: boolean; allowParent?: boolean } = {},
  ): Promise<boolean> => {
    const sessionUserId = requireSessionUserId(req, res);
    if (!sessionUserId) return false;

    if (sessionUserId === targetUserId) return true;

    if (options.allowAdmin !== false) {
      const sessionUser = await storage.getUser(sessionUserId);
      if (sessionUser?.role === "admin") return true;
    }

    if (options.allowParent) {
      const children = await storage.getChildrenForParent(sessionUserId);
      if (children.some((child) => child.id === targetUserId)) {
        return true;
      }
    }

    res.status(403).json({ message: "Not authorized for this account" });
    return false;
  };

  const requireAdminUser = async (req: Request, res: Response): Promise<boolean> => {
    const sessionUserId = requireSessionUserId(req, res);
    if (!sessionUserId) return false;

    const user = await storage.getUser(sessionUserId);
    if (user?.role === "admin") return true;

    res.status(403).json({ message: "Admin access required" });
    return false;
  };

  const withLessonResources = async <T extends { id: number }>(lesson: T) => ({
    ...lesson,
    resources: await storage.getLessonResources(lesson.id),
  });

  app.get("/api/health", (_req, res) => {
    res.json({
      ok: true,
      service: "real-world-academy",
      version: "2-roadmap",
      timestamp: new Date().toISOString()
    });
  });

  app.get("/api/auth/me", async (req, res) => {
    try {
      if (!req.session.userId) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      let user = await storage.getUser(req.session.userId);
      if (!user) {
        req.session.destroy(() => undefined);
        return res.status(401).json({ message: "Not authenticated" });
      }

      user = await promoteConfiguredAdmin(user);
      res.json(toSafeUser(user));
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch current user" });
    }
  });

  app.post("/api/auth/signup", express.json(), async (req, res) => {
    try {
      const { email, password, firstName, lastName, ageGroup, interests, role } = req.body;

      if (!email || !password || !firstName || !lastName || !ageGroup) {
        return res.status(400).json({ message: "Email, password, name, and age group are required" });
      }

      if (String(password).length < 8) {
        return res.status(400).json({ message: "Password must be at least 8 characters" });
      }

      const normalizedEmail = String(email).trim().toLowerCase();
      const existingUser = await storage.getUserByEmail(normalizedEmail);
      if (existingUser) {
        return res.status(409).json({ message: "An account with that email already exists" });
      }

      const hashedPassword = await hashPassword(String(password));
      const accountRole = isConfiguredAdminEmail(normalizedEmail)
        ? "admin"
        : role === "parent" ? "parent" : "student";
      const newUser = await storage.createUser({
        username: normalizedEmail,
        password: hashedPassword,
        fullName: `${String(firstName).trim()} ${String(lastName).trim()}`,
        email: normalizedEmail,
        firstName: String(firstName).trim(),
        lastName: String(lastName).trim(),
        role: accountRole,
        ageGroup: String(ageGroup),
        interests: Array.isArray(interests) ? interests.map(String) : [],
        xp: 0,
        level: 1,
        levelTitle: "Beginner",
        streakCount: 0,
        gamificationEnabled: true,
        showLeaderboard: false,
        showLevelUpNotifications: true,
      });

      req.session.userId = newUser.id;
      res.status(201).json(toSafeUser(newUser));
    } catch (error) {
      res.status(400).json({ message: "Invalid signup data" });
    }
  });

  app.post("/api/auth/login", express.json(), async (req, res) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
      }

      let user = await storage.getUserByEmail(String(email).trim().toLowerCase());
      if (!user || !(await verifyPassword(String(password), user.password))) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      user = await promoteConfiguredAdmin(user);
      req.session.userId = user.id;
      res.json(toSafeUser(user));
    } catch (error) {
      res.status(500).json({ message: "Failed to log in" });
    }
  });

  app.post("/api/auth/logout", (req, res) => {
    req.session.destroy((error) => {
      if (error) {
        return res.status(500).json({ message: "Failed to log out" });
      }

      res.clearCookie("rwa.sid");
      res.status(204).end();
    });
  });

  app.post("/api/admin/bootstrap", async (req, res) => {
    try {
      const sessionUserId = requireSessionUserId(req, res);
      if (!sessionUserId) return;

      const user = await storage.getUser(sessionUserId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      if (!isConfiguredAdminEmail(user.email)) {
        return res.status(403).json({ message: "This account is not listed in ADMIN_EMAILS" });
      }

      const promotedUser = await promoteConfiguredAdmin(user);
      res.json(toSafeUser(promotedUser));
    } catch (error) {
      res.status(500).json({ message: "Failed to bootstrap admin account" });
    }
  });

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

  // Subject/pathway endpoints
  app.get("/api/subjects", async (req, res) => {
    try {
      const subjects = await storage.getAllSubjects();
      res.json(subjects);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch subjects" });
    }
  });

  app.get("/api/subjects/featured", async (req, res) => {
    try {
      const featuredSubjects = await storage.getFeaturedSubjects();
      res.json(featuredSubjects);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch featured subjects" });
    }
  });

  app.get("/api/subjects/:slug/lessons", async (req, res) => {
    try {
      const subject = await storage.getSubjectBySlug(req.params.slug);
      if (!subject) {
        return res.status(404).json({ message: "Subject not found" });
      }

      const lessons = await storage.getLessonsBySubject(subject.id);
      res.json(lessons);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch subject lessons" });
    }
  });

  app.get("/api/subjects/:slug", async (req, res) => {
    try {
      const subject = await storage.getSubjectBySlug(req.params.slug);
      if (!subject) {
        return res.status(404).json({ message: "Subject not found" });
      }
      res.json(subject);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch subject" });
    }
  });

  app.post("/api/subjects", express.json(), async (req, res) => {
    try {
      const validatedData = insertSubjectSchema.parse(req.body);
      const newSubject = await storage.createSubject(validatedData);
      res.status(201).json(newSubject);
    } catch (error) {
      res.status(400).json({ message: "Invalid subject data" });
    }
  });

  app.get("/api/lessons/:id", async (req, res) => {
    try {
      const lesson = await storage.getLesson(Number(req.params.id));
      if (!lesson) {
        return res.status(404).json({ message: "Lesson not found" });
      }
      res.json(await withLessonResources(lesson));
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch lesson" });
    }
  });

  app.get("/api/subjects/:subjectSlug/lessons/:lessonSlug", async (req, res) => {
    try {
      const lesson = await storage.getLessonBySlug(req.params.subjectSlug, req.params.lessonSlug);
      if (!lesson) {
        return res.status(404).json({ message: "Lesson not found" });
      }
      res.json(await withLessonResources(lesson));
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch lesson" });
    }
  });

  app.post("/api/lessons", express.json(), async (req, res) => {
    try {
      const validatedData = insertLessonSchema.parse(req.body);
      const newLesson = await storage.createLesson(validatedData);
      res.status(201).json(newLesson);
    } catch (error) {
      res.status(400).json({ message: "Invalid lesson data" });
    }
  });

  app.use("/api/users/:userId", async (req, res, next) => {
    const userId = Number(req.params.userId);
    if (Number.isNaN(userId)) {
      return res.status(400).json({ message: "Invalid user id" });
    }

    const isParentReviewWrite = req.method === "POST" && req.path.includes("/lessons/") && req.path.endsWith("/reviews");
    const allowParent = req.method === "GET" || isParentReviewWrite;

    if (await canAccessUserRecord(req, res, userId, { allowParent })) {
      next();
    }
  });

  // Lesson progress endpoints
  app.get("/api/users/:userId/lessons/:lessonId/progress", async (req, res) => {
    try {
      const userId = Number(req.params.userId);
      if (!(await canAccessUserRecord(req, res, userId, { allowParent: true }))) return;

      const lessonId = Number(req.params.lessonId);
      const user = await storage.getUser(userId);
      const lesson = await storage.getLesson(lessonId);

      if (!user || !lesson) {
        return res.status(404).json({ message: "User or lesson not found" });
      }

      const progress = await storage.getUserLessonProgress(userId, lessonId);
      res.json(progress || null);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch lesson progress" });
    }
  });

  app.patch("/api/users/:userId/lessons/:lessonId/progress", express.json(), async (req, res) => {
    try {
      const userId = Number(req.params.userId);
      if (!(await canAccessUserRecord(req, res, userId))) return;

      const lessonId = Number(req.params.lessonId);
      const user = await storage.getUser(userId);
      const lesson = await storage.getLesson(lessonId);

      if (!user || !lesson) {
        return res.status(404).json({ message: "User or lesson not found" });
      }

      const existing = await storage.getUserLessonProgress(userId, lessonId);
      const status = req.body.status || existing?.status || "in_progress";
      const progress = await storage.updateUserLessonProgress(userId, lessonId, {
        status,
        ageGroup: req.body.ageGroup || existing?.ageGroup || user.ageGroup || "13-15",
        startedAt: existing?.startedAt || new Date(),
        completedAt: status === "completed" ? (existing?.completedAt || new Date()) : existing?.completedAt,
        answers: req.body.answers ?? existing?.answers,
        reflectionResponse: req.body.reflectionResponse ?? existing?.reflectionResponse,
        notes: req.body.notes ?? existing?.notes,
        xpEarned: status === "completed" ? (existing?.xpEarned || lesson.xpReward) : existing?.xpEarned,
        badgeEarned: status === "completed" ? true : existing?.badgeEarned,
      });

      if (status === "completed") {
        const subjectLessons = await storage.getLessonsBySubject(lesson.subjectId);
        const lessonProgress = await storage.getAllUserLessonProgressBySubject(userId, lesson.subjectId);
        const completedLessonIds = new Set(
          lessonProgress
            .filter((item) => item.status === "completed")
            .map((item) => item.lessonId)
        );
        completedLessonIds.add(lessonId);

        await storage.updateUserSubjectProgress(userId, lesson.subjectId, {
          status: completedLessonIds.size >= subjectLessons.length ? "completed" : "in_progress",
          currentLessonId: lessonId,
          startedAt: new Date(),
          completedAt: completedLessonIds.size >= subjectLessons.length ? new Date() : undefined,
          percentComplete: subjectLessons.length > 0
            ? Math.round((completedLessonIds.size / subjectLessons.length) * 100)
            : 0,
        });

        await storage.updateUserXP(userId, lesson.xpReward);
        await storage.createTimelineEvent({
          userId,
          title: `Completed lesson: ${lesson.title}`,
          date: new Date(),
          completed: true,
          category: "lesson",
        });
      }

      res.json(progress);
    } catch (error) {
      res.status(400).json({ message: "Invalid lesson progress data" });
    }
  });

  app.get("/api/users/:userId/lesson-progress", async (req, res) => {
    try {
      const userId = Number(req.params.userId);
      if (!(await canAccessUserRecord(req, res, userId, { allowParent: true }))) return;

      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const progress = await storage.getAllUserLessonProgress(userId);
      const enrichedProgress = await Promise.all(progress.map(async (item) => ({
        progress: item,
        lesson: await storage.getLesson(item.lessonId),
      })));

      res.json(enrichedProgress);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch lesson progress" });
    }
  });

  app.get("/api/users/:childId/lesson-reviews", async (req, res) => {
    try {
      const childId = Number(req.params.childId);
      if (!(await canAccessUserRecord(req, res, childId, { allowParent: true }))) return;

      const child = await storage.getUser(childId);
      if (!child) {
        return res.status(404).json({ message: "Child user not found" });
      }

      const reviews = await storage.getParentLessonReviewsForChild(childId);
      res.json(reviews);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch lesson reviews" });
    }
  });

  app.post("/api/users/:childId/lessons/:lessonId/reviews", express.json(), async (req, res) => {
    try {
      const sessionUserId = requireSessionUserId(req, res);
      if (!sessionUserId) return;

      const childId = Number(req.params.childId);
      const lessonId = Number(req.params.lessonId);
      const validatedData = insertParentLessonReviewSchema.parse({
        ...req.body,
        parentUserId: sessionUserId,
        childUserId: childId,
        lessonId,
        reviewedAt: new Date(),
      });

      const [parent, child, lesson] = await Promise.all([
        storage.getUser(validatedData.parentUserId),
        storage.getUser(childId),
        storage.getLesson(lessonId),
      ]);

      if (!parent || !child || !lesson) {
        return res.status(404).json({ message: "Parent, child, or lesson not found" });
      }

      const children = await storage.getChildrenForParent(validatedData.parentUserId);
      if (!children.some((linkedChild) => linkedChild.id === childId)) {
        return res.status(403).json({ message: "Parent is not linked to this child" });
      }

      const review = await storage.createParentLessonReview(validatedData);
      res.status(201).json(review);
    } catch (error) {
      res.status(400).json({ message: "Invalid parent review data" });
    }
  });

  // User endpoints
  app.post("/api/users", express.json(), async (req, res) => {
    try {
      const validatedData = insertUserSchema.parse({
        ...req.body,
        password: await hashPassword(String(req.body.password)),
      });
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

  app.get("/api/users/:parentId/children", async (req, res) => {
    try {
      const parentId = Number(req.params.parentId);
      if (!(await canAccessUserRecord(req, res, parentId))) return;

      const parent = await storage.getUser(parentId);
      if (!parent) {
        return res.status(404).json({ message: "Parent user not found" });
      }

      const children = await storage.getChildrenForParent(parentId);
      const safeChildren = children.map(({ password, ...child }) => child);
      res.json(safeChildren);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch child accounts" });
    }
  });

  app.get("/api/users/:childId/parents", async (req, res) => {
    try {
      const childId = Number(req.params.childId);
      if (!(await canAccessUserRecord(req, res, childId, { allowParent: true }))) return;

      const child = await storage.getUser(childId);
      if (!child) {
        return res.status(404).json({ message: "Child user not found" });
      }

      const parents = await storage.getParentsForChild(childId);
      const safeParents = parents.map(({ password, ...parent }) => parent);
      res.json(safeParents);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch parent accounts" });
    }
  });

  app.post("/api/family/relationships", express.json(), async (req, res) => {
    try {
      const sessionUserId = requireSessionUserId(req, res);
      if (!sessionUserId) return;

      const validatedData = insertParentChildRelationshipSchema.parse(req.body);
      if (validatedData.parentUserId !== sessionUserId) {
        return res.status(403).json({ message: "Parent account must match the current session" });
      }

      const parent = await storage.getUser(validatedData.parentUserId);
      const child = await storage.getUser(validatedData.childUserId);
      if (!parent || !child) {
        return res.status(404).json({ message: "Parent or child user not found" });
      }

      const relationship = await storage.createParentChildRelationship(validatedData);
      res.status(201).json(relationship);
    } catch (error) {
      res.status(400).json({ message: "Invalid parent-child relationship data" });
    }
  });

  app.post("/api/family/link-child", express.json(), async (req, res) => {
    try {
      const sessionUserId = requireSessionUserId(req, res);
      if (!sessionUserId) return;

      const childEmail = typeof req.body.childEmail === "string"
        ? req.body.childEmail.trim().toLowerCase()
        : "";
      const relationshipLabel = typeof req.body.relationshipLabel === "string" && req.body.relationshipLabel.trim()
        ? req.body.relationshipLabel.trim()
        : "parent";

      if (!childEmail) {
        return res.status(400).json({ message: "Child account email is required" });
      }

      const parent = await storage.getUser(sessionUserId);
      const child = await storage.getUserByEmail(childEmail);
      if (!parent) {
        return res.status(404).json({ message: "Parent account not found" });
      }
      if (!child) {
        return res.status(404).json({ message: "No child account found for that email" });
      }
      if (child.id === sessionUserId) {
        return res.status(400).json({ message: "You cannot link your own account as a child" });
      }

      const linkedChildren = await storage.getChildrenForParent(sessionUserId);
      const alreadyLinked = linkedChildren.find((linkedChild) => linkedChild.id === child.id);
      if (!alreadyLinked) {
        await storage.createParentChildRelationship({
          parentUserId: sessionUserId,
          childUserId: child.id,
          relationshipLabel,
          status: "active",
          createdAt: new Date(),
        });
      }

      res.status(alreadyLinked ? 200 : 201).json(toSafeUser(child));
    } catch (error) {
      res.status(500).json({ message: "Failed to link child account" });
    }
  });

  const contributionSubjectAliases: Record<string, string> = {
    "financial-literacy": "money-basics",
    finance: "money-basics",
    technology: "digital-productivity",
    "digital-skills": "digital-productivity",
    communication: "communication-relationships",
    "well-being": "career-exploration",
    "critical-thinking": "career-exploration",
    creativity: "career-exploration",
    citizenship: "digital-productivity",
  };

  const slugify = (value: string): string => value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);

  const publishCurriculumSubmission = async (submission: CurriculumSubmission) => {
    const requestedSubjectSlug = slugify(submission.subject);
    const subjectSlug = contributionSubjectAliases[requestedSubjectSlug] || requestedSubjectSlug;
    const subject = await storage.getSubjectBySlug(subjectSlug);

    if (!subject) {
      throw new Error(`No publishable subject exists for "${submission.subject}"`);
    }

    const baseSlug = slugify(submission.title) || `submission-${submission.id}`;
    const slug = `contrib-${submission.id}-${baseSlug}`;
    const existingLesson = await storage.getLessonBySlug(subject.slug, slug);

    if (existingLesson) {
      return existingLesson;
    }

    const existingLessons = await storage.getLessonsBySubject(subject.id);
    const contributorProfile = submission.contributorProfileId
      ? await storage.getContributorProfile(submission.contributorProfileId)
      : undefined;
    const contributorName = contributorProfile?.displayName || submission.contributorName;

    const lesson = await storage.createLesson(insertLessonSchema.parse({
      subjectId: subject.id,
      title: submission.title,
      subtitle: `Community lesson by ${contributorName}`,
      slug,
      order: existingLessons.length + 1,
      learningObjective: submission.objective,
      warmUpQuestion: submission.warmUp,
      lessonExplanation: submission.coreContent,
      scenarioTitle: "Real-World Scenario",
      scenarioContent: submission.scenario,
      activityType: "reflection",
      activityContent: {
        instructions: submission.activity,
        contributor: {
          id: contributorProfile?.id,
          name: contributorName,
          affiliation: contributorProfile?.affiliation || submission.affiliation,
          trustLevel: contributorProfile?.trustLevel,
        },
        sourceSubmissionId: submission.id,
      },
      reflectionPrompt: submission.reflection,
      estimatedMinutes: 30,
      xpReward: 50,
      ageGroupContent: {
        [submission.ageGroup]: {
          learningObjective: submission.objective,
          warmUpQuestion: submission.warmUp,
          lessonExplanation: submission.coreContent,
          scenarioContent: submission.scenario,
          activityContent: submission.activity,
          reflectionPrompt: submission.reflection,
        },
      },
    }));

    if (submission.resourceTitle && submission.resourceUrl) {
      const resourceType = submission.resourceType || "link";
      await storage.createLessonResource(insertLessonResourceSchema.parse({
        lessonId: lesson.id,
        resourceId: null,
        resourceType,
        title: submission.resourceTitle,
        description: submission.resourceDescription || null,
        url: submission.resourceUrl,
        embedUrl: resourceType === "video" ? getYouTubeEmbedUrl(submission.resourceUrl) : null,
        sourceLabel: submission.resourceSourceLabel || null,
        duration: submission.resourceDuration || null,
        safetyNotes: submission.resourceSafetyNotes || null,
        parentPrompt: submission.resourceParentPrompt || null,
        studentPrompt: submission.resourceStudentPrompt || null,
        order: 1,
      }));
    }

    return lesson;
  };

  const attachContributorProfiles = async (submissions: CurriculumSubmission[]) => {
    const profiles = await storage.getAllContributorProfiles();
    const profileById = new Map(profiles.map((profile) => [profile.id, profile]));

    return submissions.map((submission) => ({
      ...submission,
      contributorProfile: submission.contributorProfileId
        ? profileById.get(submission.contributorProfileId) || null
        : profiles.find((profile) =>
            profile.displayName.toLowerCase() === submission.contributorName.toLowerCase() ||
            profile.affiliation?.toLowerCase() === submission.affiliation.toLowerCase()
          ) || null,
    }));
  };

  const attachResourceContributorProfiles = async (submissions: ResourceSubmission[]) => {
    const profiles = await storage.getAllContributorProfiles();
    const profileById = new Map(profiles.map((profile) => [profile.id, profile]));

    return submissions.map((submission) => ({
      ...submission,
      contributorProfile: submission.contributorProfileId
        ? profileById.get(submission.contributorProfileId) || null
        : profiles.find((profile) =>
            profile.displayName.toLowerCase() === submission.contributorName.toLowerCase() ||
            profile.affiliation?.toLowerCase() === submission.affiliation.toLowerCase()
          ) || null,
    }));
  };

  const attachCollectionDetails = async (collections: CurriculumCollection[]) => {
    const profiles = await storage.getAllContributorProfiles();
    const profileById = new Map(profiles.map((profile) => [profile.id, profile]));

    return Promise.all(collections.map(async (collection) => ({
      ...collection,
      contributorProfile: profileById.get(collection.contributorProfileId) || null,
      items: await storage.getCurriculumCollectionItems(collection.id),
    })));
  };

  const getYouTubeEmbedUrl = (url: string | null) => {
    if (!url) return null;

    try {
      const parsed = new URL(url);
      const host = parsed.hostname.replace(/^www\./, "");
      const videoId = host === "youtu.be"
        ? parsed.pathname.split("/").filter(Boolean)[0]
        : parsed.searchParams.get("v");

      if (!videoId || !["youtube.com", "m.youtube.com", "youtu.be"].includes(host)) {
        return null;
      }

      return `https://www.youtube.com/embed/${videoId}`;
    } catch {
      return null;
    }
  };

  const publishResourceSubmission = async (submission: ResourceSubmission) => {
    const isVideo = submission.resourceType === "video";

    return await storage.createResource({
      title: submission.title,
      description: `${submission.description}\n\nLearning use: ${submission.learningUse}\n\nSafety notes: ${submission.safetyNotes}`,
      resourceType: submission.resourceType,
      category: submission.category,
      audience: submission.audience || ["student", "parent"],
      fileUrl: isVideo ? null : submission.url,
      embedUrl: isVideo ? submission.embedUrl || getYouTubeEmbedUrl(submission.url) || submission.url : null,
      thumbnailUrl: submission.thumbnailUrl,
      downloadCount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
      relatedSubjectId: null,
      featured: false,
    });
  };

  const normalizeCollectionItems = (collectionId: number, rawItems: unknown[]) =>
    rawItems.map((rawItem, index) => {
      const item = rawItem as Record<string, unknown>;
      const url = item.url ? String(item.url).trim() : null;
      const embedUrl = item.embedUrl ? String(item.embedUrl).trim() : getYouTubeEmbedUrl(url);

      return insertCurriculumCollectionItemSchema.parse({
        collectionId,
        itemType: String(item.itemType || "link"),
        title: String(item.title || "").trim(),
        description: item.description ? String(item.description).trim() : null,
        url,
        embedUrl,
        sourceLabel: item.sourceLabel ? String(item.sourceLabel).trim() : null,
        duration: item.duration ? String(item.duration).trim() : null,
        safetyNotes: item.safetyNotes ? String(item.safetyNotes).trim() : null,
        lessonId: item.lessonId ? Number(item.lessonId) : null,
        resourceId: item.resourceId ? Number(item.resourceId) : null,
        order: index + 1,
        parentPrompt: item.parentPrompt ? String(item.parentPrompt).trim() : null,
        studentPrompt: item.studentPrompt ? String(item.studentPrompt).trim() : null,
      });
    });

  app.get("/api/contributor-profiles/me", async (req, res) => {
    try {
      const sessionUserId = requireSessionUserId(req, res);
      if (!sessionUserId) return;

      const profile = await storage.getContributorProfileByUserId(sessionUserId);
      res.json(profile || null);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch contributor profile" });
    }
  });

  app.put("/api/contributor-profiles/me", express.json(), async (req, res) => {
    try {
      const sessionUserId = requireSessionUserId(req, res);
      if (!sessionUserId) return;

      const existingProfile = await storage.getContributorProfileByUserId(sessionUserId);
      const validatedData = insertContributorProfileSchema.parse({
        userId: sessionUserId,
        displayName: String(req.body.displayName || "").trim(),
        bio: req.body.bio ? String(req.body.bio).trim() : null,
        affiliation: req.body.affiliation ? String(req.body.affiliation).trim() : null,
        website: req.body.website ? String(req.body.website).trim() : null,
        avatarUrl: req.body.avatarUrl ? String(req.body.avatarUrl).trim() : null,
        expertiseTags: Array.isArray(req.body.expertiseTags)
          ? req.body.expertiseTags.map(String).map((tag: string) => tag.trim()).filter(Boolean)
          : [],
        trustLevel: existingProfile?.trustLevel || "new",
        status: existingProfile?.status || "active",
        createdAt: existingProfile?.createdAt || new Date(),
        updatedAt: new Date(),
      });

      if (!validatedData.displayName) {
        return res.status(400).json({ message: "Display name is required" });
      }

      const profile = await storage.upsertContributorProfile(validatedData);
      res.json(profile);
    } catch (error) {
      res.status(400).json({ message: "Invalid contributor profile" });
    }
  });

  app.get("/api/admin/contributor-profiles", async (req, res) => {
    try {
      if (!(await requireAdminUser(req, res))) return;

      const profiles = await storage.getAllContributorProfiles();
      res.json(profiles);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch contributor profiles" });
    }
  });

  app.get("/api/contributor-submissions/me", async (req, res) => {
    try {
      const sessionUserId = requireSessionUserId(req, res);
      if (!sessionUserId) return;

      const user = await storage.getUser(sessionUserId);
      const profile = await storage.getContributorProfileByUserId(sessionUserId);
      if (!user || !profile) {
        return res.json([]);
      }

      const submissions = await storage.getCurriculumSubmissionsForContributor(profile.id, user.email);
      res.json(await attachContributorProfiles(submissions));
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch contributor submissions" });
    }
  });

  app.get("/api/contributor-resource-submissions/me", async (req, res) => {
    try {
      const sessionUserId = requireSessionUserId(req, res);
      if (!sessionUserId) return;

      const user = await storage.getUser(sessionUserId);
      const profile = await storage.getContributorProfileByUserId(sessionUserId);
      if (!user || !profile) {
        return res.json([]);
      }

      const submissions = await storage.getResourceSubmissionsForContributor(profile.id, user.email);
      res.json(await attachResourceContributorProfiles(submissions));
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch contributor resource submissions" });
    }
  });

  app.post("/api/resource-submissions", express.json(), async (req, res) => {
    try {
      const sessionUserId = requireSessionUserId(req, res);
      if (!sessionUserId) return;

      const user = await storage.getUser(sessionUserId);
      const contributorProfile = await storage.getContributorProfileByUserId(sessionUserId);
      if (!user || !contributorProfile) {
        return res.status(403).json({ message: "Create a contributor profile before submitting resources" });
      }

      const url = String(req.body.url || "").trim();
      const isVideo = req.body.resourceType === "video";
      const validatedData = insertResourceSubmissionSchema.parse({
        contributorProfileId: contributorProfile.id,
        contributorName: contributorProfile.displayName,
        contributorEmail: user.email,
        affiliation: contributorProfile.affiliation || "Independent contributor",
        title: String(req.body.title || "").trim(),
        description: String(req.body.description || "").trim(),
        resourceType: String(req.body.resourceType || "link"),
        category: String(req.body.category || "").trim(),
        audience: Array.isArray(req.body.audience)
          ? req.body.audience.map(String).filter(Boolean)
          : ["student", "parent"],
        ageGroup: String(req.body.ageGroup || "").trim(),
        url,
        embedUrl: req.body.embedUrl ? String(req.body.embedUrl).trim() : isVideo ? getYouTubeEmbedUrl(url) : null,
        sourceLabel: req.body.sourceLabel ? String(req.body.sourceLabel).trim() : null,
        duration: req.body.duration ? String(req.body.duration).trim() : null,
        learningUse: String(req.body.learningUse || "").trim(),
        safetyNotes: String(req.body.safetyNotes || "").trim(),
        thumbnailUrl: req.body.thumbnailUrl ? String(req.body.thumbnailUrl).trim() : null,
        status: "pending_review",
        reviewerNote: null,
        publishedResourceId: null,
        submittedAt: new Date(),
        reviewedAt: null,
      });

      if (!validatedData.title || !validatedData.description || !validatedData.category || !validatedData.ageGroup || !validatedData.url) {
        return res.status(400).json({ message: "Title, description, category, age group, and URL are required" });
      }

      const submission = await storage.createResourceSubmission(validatedData);
      res.status(201).json(submission);
    } catch (error) {
      res.status(400).json({ message: "Invalid resource submission data" });
    }
  });

  app.get("/api/resource-submissions", async (req, res) => {
    try {
      if (!(await requireAdminUser(req, res))) return;

      const status = typeof req.query.status === "string" ? req.query.status : undefined;
      const submissions = await storage.getResourceSubmissions(status);
      res.json(await attachResourceContributorProfiles(submissions));
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch resource submissions" });
    }
  });

  app.patch("/api/resource-submissions/:id/review", express.json(), async (req, res) => {
    try {
      if (!(await requireAdminUser(req, res))) return;

      const id = Number(req.params.id);
      const existing = await storage.getResourceSubmission(id);
      if (!existing) {
        return res.status(404).json({ message: "Resource submission not found" });
      }

      const allowedStatuses = new Set(["approved", "changes_requested", "rejected", "archived"]);
      if (!allowedStatuses.has(req.body.status)) {
        return res.status(400).json({ message: "Invalid review status" });
      }

      const publishedResource = req.body.status === "approved"
        ? await publishResourceSubmission(existing)
        : undefined;

      const updated = await storage.reviewResourceSubmission(id, {
        status: req.body.status,
        reviewerNote: req.body.reviewerNote,
        publishedResourceId: publishedResource?.id || existing.publishedResourceId,
        reviewedAt: new Date(),
      });

      const [enriched] = await attachResourceContributorProfiles([updated]);
      res.json({ ...enriched, publishedResource });
    } catch (error) {
      res.status(400).json({ message: "Failed to review resource submission" });
    }
  });

  app.get("/api/curriculum-collections", async (_req, res) => {
    try {
      const collections = await storage.getCurriculumCollections();
      const publicCollections = collections.filter((collection) =>
        collection.status === "approved" || collection.status === "published"
      );
      res.json(await attachCollectionDetails(publicCollections));
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch curriculum collections" });
    }
  });

  app.get("/api/curriculum-collections/me", async (req, res) => {
    try {
      const sessionUserId = requireSessionUserId(req, res);
      if (!sessionUserId) return;

      const profile = await storage.getContributorProfileByUserId(sessionUserId);
      if (!profile) {
        return res.json([]);
      }

      const collections = await storage.getCurriculumCollectionsForContributor(profile.id);
      res.json(await attachCollectionDetails(collections));
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch contributor collections" });
    }
  });

  app.get("/api/curriculum-collections/:id", async (req, res) => {
    try {
      const collection = await storage.getCurriculumCollection(Number(req.params.id));
      if (!collection || !["approved", "published"].includes(collection.status)) {
        return res.status(404).json({ message: "Curriculum collection not found" });
      }

      const [enriched] = await attachCollectionDetails([collection]);
      res.json(enriched);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch curriculum collection" });
    }
  });

  app.get("/api/curriculum-collections/:id/progress", async (req, res) => {
    try {
      const sessionUserId = requireSessionUserId(req, res);
      if (!sessionUserId) return;

      const collection = await storage.getCurriculumCollection(Number(req.params.id));
      if (!collection || !["approved", "published"].includes(collection.status)) {
        return res.status(404).json({ message: "Curriculum collection not found" });
      }

      const progress = await storage.getUserCurriculumCollectionProgress(sessionUserId, collection.id);
      res.json(progress || null);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch collection progress" });
    }
  });

  app.post("/api/curriculum-collections/:id/start", async (req, res) => {
    try {
      const sessionUserId = requireSessionUserId(req, res);
      if (!sessionUserId) return;

      const collection = await storage.getCurriculumCollection(Number(req.params.id));
      if (!collection || !["approved", "published"].includes(collection.status)) {
        return res.status(404).json({ message: "Curriculum collection not found" });
      }

      const items = await storage.getCurriculumCollectionItems(collection.id);
      const existing = await storage.getUserCurriculumCollectionProgress(sessionUserId, collection.id);
      const progress = await storage.upsertUserCurriculumCollectionProgress(sessionUserId, collection.id, {
        status: existing?.status === "completed" ? "completed" : "in_progress",
        currentItemId: existing?.currentItemId || items[0]?.id,
        completedItemIds: existing?.completedItemIds || [],
        percentComplete: existing?.percentComplete || 0,
        startedAt: existing?.startedAt || new Date(),
      });

      res.status(existing ? 200 : 201).json(progress);
    } catch (error) {
      res.status(400).json({ message: "Failed to start curriculum collection" });
    }
  });

  app.patch("/api/curriculum-collections/:id/progress", express.json(), async (req, res) => {
    try {
      const sessionUserId = requireSessionUserId(req, res);
      if (!sessionUserId) return;

      const collection = await storage.getCurriculumCollection(Number(req.params.id));
      if (!collection || !["approved", "published"].includes(collection.status)) {
        return res.status(404).json({ message: "Curriculum collection not found" });
      }

      const items = await storage.getCurriculumCollectionItems(collection.id);
      const itemId = Number(req.body.itemId);
      if (!items.some((item) => item.id === itemId)) {
        return res.status(400).json({ message: "Collection item not found" });
      }

      const existing = await storage.getUserCurriculumCollectionProgress(sessionUserId, collection.id);
      const completedItemIds = Array.from(new Set([...(existing?.completedItemIds || []), itemId]));
      const nextItem = items.find((item) => !completedItemIds.includes(item.id));
      const percentComplete = items.length > 0
        ? Math.round((completedItemIds.length / items.length) * 100)
        : 100;
      const isComplete = items.length > 0 && completedItemIds.length >= items.length;

      const progress = await storage.upsertUserCurriculumCollectionProgress(sessionUserId, collection.id, {
        status: isComplete ? "completed" : "in_progress",
        currentItemId: nextItem?.id || itemId,
        completedItemIds,
        percentComplete,
        startedAt: existing?.startedAt || new Date(),
        completedAt: isComplete ? existing?.completedAt || new Date() : undefined,
      });

      res.json(progress);
    } catch (error) {
      res.status(400).json({ message: "Failed to update collection progress" });
    }
  });

  app.post("/api/curriculum-collections", express.json(), async (req, res) => {
    try {
      const sessionUserId = requireSessionUserId(req, res);
      if (!sessionUserId) return;

      const profile = await storage.getContributorProfileByUserId(sessionUserId);
      if (!profile) {
        return res.status(403).json({ message: "Create a contributor profile before building collections" });
      }

      const now = new Date();
      const collection = insertCurriculumCollectionSchema.parse({
        contributorProfileId: profile.id,
        title: String(req.body.title || "").trim(),
        description: String(req.body.description || "").trim(),
        subject: String(req.body.subject || "").trim(),
        ageGroup: String(req.body.ageGroup || "").trim(),
        estimatedWeeks: Number(req.body.estimatedWeeks || 1),
        learningGoals: Array.isArray(req.body.learningGoals)
          ? req.body.learningGoals.map(String).map((goal: string) => goal.trim()).filter(Boolean)
          : [],
        parentNotes: req.body.parentNotes ? String(req.body.parentNotes).trim() : null,
        finalProject: req.body.finalProject ? String(req.body.finalProject).trim() : null,
        status: "draft",
        reviewerNote: null,
        submittedAt: null,
        reviewedAt: null,
        createdAt: now,
        updatedAt: now,
      });

      const rawItems = Array.isArray(req.body.items) ? req.body.items : [];
      if (!collection.title || !collection.description || !collection.subject || !collection.ageGroup) {
        return res.status(400).json({ message: "Title, description, subject, and age group are required" });
      }

      const created = await storage.createCurriculumCollection(collection);
      const items = await storage.replaceCurriculumCollectionItems(
        created.id,
        normalizeCollectionItems(created.id, rawItems).filter((item) => item.title),
      );

      const [enriched] = await attachCollectionDetails([{ ...created, items } as CurriculumCollection]);
      res.status(201).json(enriched);
    } catch (error) {
      res.status(400).json({ message: "Invalid curriculum collection data" });
    }
  });

  app.put("/api/curriculum-collections/:id", express.json(), async (req, res) => {
    try {
      const sessionUserId = requireSessionUserId(req, res);
      if (!sessionUserId) return;

      const id = Number(req.params.id);
      const existing = await storage.getCurriculumCollection(id);
      const profile = await storage.getContributorProfileByUserId(sessionUserId);
      const user = await storage.getUser(sessionUserId);
      const isOwner = existing && profile && existing.contributorProfileId === profile.id;
      const isAdmin = user?.role === "admin";

      if (!existing) {
        return res.status(404).json({ message: "Curriculum collection not found" });
      }

      if (!isOwner && !isAdmin) {
        return res.status(403).json({ message: "You can only edit your own collections" });
      }

      if (!isAdmin && !["draft", "changes_requested"].includes(existing.status)) {
        return res.status(400).json({ message: "Submitted collections cannot be edited until review returns them" });
      }

      const updates = insertCurriculumCollectionSchema.partial().parse({
        title: String(req.body.title || "").trim(),
        description: String(req.body.description || "").trim(),
        subject: String(req.body.subject || "").trim(),
        ageGroup: String(req.body.ageGroup || "").trim(),
        estimatedWeeks: Number(req.body.estimatedWeeks || existing.estimatedWeeks || 1),
        learningGoals: Array.isArray(req.body.learningGoals)
          ? req.body.learningGoals.map(String).map((goal: string) => goal.trim()).filter(Boolean)
          : [],
        parentNotes: req.body.parentNotes ? String(req.body.parentNotes).trim() : null,
        finalProject: req.body.finalProject ? String(req.body.finalProject).trim() : null,
        status: isAdmin ? req.body.status || existing.status : "draft",
      });

      const rawItems = Array.isArray(req.body.items) ? req.body.items : [];
      const updated = await storage.updateCurriculumCollection(id, updates);
      await storage.replaceCurriculumCollectionItems(
        id,
        normalizeCollectionItems(id, rawItems).filter((item) => item.title),
      );

      const [enriched] = await attachCollectionDetails([updated]);
      res.json(enriched);
    } catch (error) {
      res.status(400).json({ message: "Failed to update curriculum collection" });
    }
  });

  app.patch("/api/curriculum-collections/:id/submit", async (req, res) => {
    try {
      const sessionUserId = requireSessionUserId(req, res);
      if (!sessionUserId) return;

      const id = Number(req.params.id);
      const existing = await storage.getCurriculumCollection(id);
      const profile = await storage.getContributorProfileByUserId(sessionUserId);

      if (!existing) {
        return res.status(404).json({ message: "Curriculum collection not found" });
      }

      if (!profile || existing.contributorProfileId !== profile.id) {
        return res.status(403).json({ message: "You can only submit your own collections" });
      }

      const items = await storage.getCurriculumCollectionItems(id);
      if (items.length === 0) {
        return res.status(400).json({ message: "Add at least one collection item before submitting" });
      }

      const updated = await storage.updateCurriculumCollection(id, {
        status: "pending_review",
        submittedAt: new Date(),
        reviewerNote: null,
      });
      const [enriched] = await attachCollectionDetails([updated]);
      res.json(enriched);
    } catch (error) {
      res.status(400).json({ message: "Failed to submit curriculum collection" });
    }
  });

  app.get("/api/admin/curriculum-collections", async (req, res) => {
    try {
      if (!(await requireAdminUser(req, res))) return;

      const status = typeof req.query.status === "string" ? req.query.status : undefined;
      const collections = await storage.getCurriculumCollections(status);
      res.json(await attachCollectionDetails(collections));
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch curriculum collections" });
    }
  });

  app.patch("/api/admin/curriculum-collections/:id/review", express.json(), async (req, res) => {
    try {
      if (!(await requireAdminUser(req, res))) return;

      const id = Number(req.params.id);
      const existing = await storage.getCurriculumCollection(id);
      if (!existing) {
        return res.status(404).json({ message: "Curriculum collection not found" });
      }

      const allowedStatuses = new Set(["approved", "published", "changes_requested", "rejected", "archived"]);
      if (!allowedStatuses.has(req.body.status)) {
        return res.status(400).json({ message: "Invalid review status" });
      }

      const updated = await storage.updateCurriculumCollection(id, {
        status: req.body.status,
        reviewerNote: req.body.reviewerNote,
        reviewedAt: new Date(),
      });
      const [enriched] = await attachCollectionDetails([updated]);
      res.json(enriched);
    } catch (error) {
      res.status(400).json({ message: "Failed to review curriculum collection" });
    }
  });

  // Curriculum contribution and review endpoints
  app.get("/api/curriculum-submissions", async (req, res) => {
    try {
      if (!(await requireAdminUser(req, res))) return;

      const status = typeof req.query.status === "string" ? req.query.status : undefined;
      const submissions = await storage.getCurriculumSubmissions(status);
      res.json(await attachContributorProfiles(submissions));
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch curriculum submissions" });
    }
  });

  app.get("/api/curriculum-submissions/:id", async (req, res) => {
    try {
      if (!(await requireAdminUser(req, res))) return;

      const submission = await storage.getCurriculumSubmission(Number(req.params.id));
      if (!submission) {
        return res.status(404).json({ message: "Curriculum submission not found" });
      }

      const enriched = await attachContributorProfiles([submission]);
      res.json(enriched[0]);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch curriculum submission" });
    }
  });

  app.post("/api/curriculum-submissions", express.json(), async (req, res) => {
    try {
      const sessionUserId = req.session.userId;
      const contributorProfile = sessionUserId
        ? await storage.getContributorProfileByUserId(sessionUserId)
        : undefined;
      const validatedData = insertCurriculumSubmissionSchema.parse({
        ...req.body,
        contributorProfileId: contributorProfile?.id,
        contributorName: contributorProfile?.displayName || req.body.contributorName,
        contributorEmail: req.body.contributorEmail,
        affiliation: contributorProfile?.affiliation || req.body.affiliation,
        status: "pending_review",
        submittedAt: new Date(),
      });
      const submission = await storage.createCurriculumSubmission(validatedData);
      res.status(201).json(submission);
    } catch (error) {
      res.status(400).json({ message: "Invalid curriculum submission data" });
    }
  });

  app.patch("/api/curriculum-submissions/:id/review", express.json(), async (req, res) => {
    try {
      if (!(await requireAdminUser(req, res))) return;

      const id = Number(req.params.id);
      const existing = await storage.getCurriculumSubmission(id);
      if (!existing) {
        return res.status(404).json({ message: "Curriculum submission not found" });
      }

      const allowedStatuses = new Set(["approved", "changes_requested", "rejected", "archived"]);
      if (!allowedStatuses.has(req.body.status)) {
        return res.status(400).json({ message: "Invalid review status" });
      }

      const publishedLesson = req.body.status === "approved"
        ? await publishCurriculumSubmission(existing)
        : undefined;

      const updated = await storage.reviewCurriculumSubmission(id, {
        status: req.body.status,
        reviewerNote: req.body.reviewerNote,
        reviewedAt: new Date(),
      });

      res.json({ ...updated, publishedLesson });
    } catch (error) {
      res.status(400).json({
        message: error instanceof Error ? error.message : "Failed to review curriculum submission",
      });
    }
  });

  app.post("/api/feedback", express.json(), async (req, res) => {
    try {
      const validatedData = insertFeedbackSubmissionSchema.parse({
        ...req.body,
        status: "new",
        createdAt: new Date(),
      });
      const feedback = await storage.createFeedbackSubmission(validatedData);
      res.status(201).json(feedback);
    } catch (error) {
      res.status(400).json({ message: "Invalid feedback submission" });
    }
  });

  app.get("/api/feedback", async (req, res) => {
    try {
      if (!(await requireAdminUser(req, res))) return;

      const feedback = await storage.getFeedbackSubmissions();
      res.json(feedback);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch feedback" });
    }
  });

  app.patch("/api/feedback/:id", express.json(), async (req, res) => {
    try {
      if (!(await requireAdminUser(req, res))) return;

      const allowedStatuses = new Set(["new", "reviewing", "resolved", "archived"]);
      if (!allowedStatuses.has(req.body.status)) {
        return res.status(400).json({ message: "Invalid feedback status" });
      }

      const feedback = await storage.updateFeedbackSubmission(Number(req.params.id), {
        status: req.body.status,
      });
      res.json(feedback);
    } catch (error) {
      res.status(400).json({ message: "Failed to update feedback" });
    }
  });

  app.get("/api/admin/users", async (req, res) => {
    try {
      if (!(await requireAdminUser(req, res))) return;

      const users = await storage.getAllUsers();
      const safeUsers = users.map(({ password, ...user }) => user);
      res.json(safeUsers);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch users" });
    }
  });

  app.patch("/api/admin/users/:userId/role", express.json(), async (req, res) => {
    try {
      if (!(await requireAdminUser(req, res))) return;

      const allowedRoles = new Set(["student", "parent", "admin"]);
      if (!allowedRoles.has(req.body.role)) {
        return res.status(400).json({ message: "Invalid user role" });
      }

      const user = await storage.updateUserRole(Number(req.params.userId), req.body.role);
      const { password, ...safeUser } = user;
      res.json(safeUser);
    } catch (error) {
      res.status(400).json({ message: "Failed to update user role" });
    }
  });

  // Credential endpoints
  app.get("/api/credentials", async (_req, res) => {
    try {
      const credentials = await storage.getAllCredentialDefinitions();
      res.json(credentials);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch credentials" });
    }
  });

  app.get("/api/credentials/:slug", async (req, res) => {
    try {
      const credential = await storage.getCredentialDefinitionBySlug(req.params.slug);
      if (!credential) {
        return res.status(404).json({ message: "Credential not found" });
      }

      const requirements = await storage.getCredentialRequirements(credential.id);
      res.json({ ...credential, requirements });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch credential" });
    }
  });

  app.get("/api/credential-verifications/:shareCode", async (req, res) => {
    try {
      const shareCode = req.params.shareCode.trim();
      const issuedCredential = await storage.getIssuedCredentialByShareCode(shareCode);
      if (!issuedCredential) {
        return res.status(404).json({ message: "Credential verification not found" });
      }

      const credential = await storage.getCredentialDefinition(issuedCredential.credentialId);
      const learner = await storage.getUser(issuedCredential.userId);
      if (!credential || !learner) {
        return res.status(404).json({ message: "Credential verification record is incomplete" });
      }

      res.json({
        shareCode: issuedCredential.shareCode,
        status: issuedCredential.status,
        issuedAt: issuedCredential.issuedAt,
        reviewNote: issuedCredential.reviewNote,
        learner: {
          fullName: learner.fullName,
        },
        credential: {
          title: credential.title,
          description: credential.description,
          criteriaSummary: credential.criteriaSummary,
          disclaimer: credential.disclaimer,
        },
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to verify credential" });
    }
  });

  app.post("/api/credentials", express.json(), async (req, res) => {
    try {
      if (!(await requireAdminUser(req, res))) return;

      const validatedData = insertCredentialDefinitionSchema.parse(req.body);
      const credential = await storage.createCredentialDefinition(validatedData);
      res.status(201).json(credential);
    } catch (error) {
      res.status(400).json({ message: "Invalid credential data" });
    }
  });

  app.post("/api/credentials/:credentialId/requirements", express.json(), async (req, res) => {
    try {
      if (!(await requireAdminUser(req, res))) return;

      const credentialId = Number(req.params.credentialId);
      const credential = await storage.getCredentialDefinition(credentialId);
      if (!credential) {
        return res.status(404).json({ message: "Credential not found" });
      }

      const validatedData = insertCredentialRequirementSchema.parse({
        ...req.body,
        credentialId,
      });
      const requirement = await storage.createCredentialRequirement(validatedData);
      res.status(201).json(requirement);
    } catch (error) {
      res.status(400).json({ message: "Invalid credential requirement data" });
    }
  });

  app.get("/api/users/:userId/credentials", async (req, res) => {
    try {
      const userId = Number(req.params.userId);
      if (!(await canAccessUserRecord(req, res, userId, { allowParent: true }))) return;

      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const credentials = await storage.getIssuedCredentialsForUser(userId);
      res.json(credentials);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch issued credentials" });
    }
  });

  app.post("/api/users/:userId/credentials/:credentialId/issue", async (req, res) => {
    try {
      const userId = Number(req.params.userId);
      if (!(await canAccessUserRecord(req, res, userId))) return;

      const credentialId = Number(req.params.credentialId);
      const user = await storage.getUser(userId);
      const credential = await storage.getCredentialDefinition(credentialId);

      if (!user || !credential) {
        return res.status(404).json({ message: "User or credential not found" });
      }

      const requirements = await storage.getCredentialRequirements(credentialId);
      const lessonRequirements = requirements.filter((requirement) => requirement.requirementType === "lesson" && requirement.targetId);

      for (const requirement of lessonRequirements) {
        const progress = await storage.getUserLessonProgress(userId, requirement.targetId!);
        if (progress?.status !== "completed") {
          return res.status(409).json({ message: "Credential requirements are not complete" });
        }
      }

      const issuedCredential = await storage.issueCredential({
        credentialId,
        userId,
        status: "issued",
        issuedAt: new Date(),
        reviewNote: "Issued automatically after required lesson completion.",
        shareCode: randomUUID(),
      });

      res.status(201).json(issuedCredential);
    } catch (error) {
      res.status(400).json({ message: "Failed to issue credential" });
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
      
      const { content, isFromBuddy, role } = req.body;
      
      // Validate that message content exists
      if (!content) {
        return res.status(400).json({ message: "Message content is required" });
      }
      
      // Create message
      const validatedData = insertBuddyMessageSchema.parse({
        userId,
        role: role ? String(role) : Boolean(isFromBuddy) ? "buddy" : "user",
        content: String(content),
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
      
      const { emotion, intensity, note, supportAction, reflectionText } = req.body;
      
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
        supportAction: supportAction ? String(supportAction) : null,
        reflectionText: reflectionText ? String(reflectionText) : null,
        loggedAt: new Date()
      });
      
      const newEmotionLog = await storage.recordBuddyEmotion(validatedData);
      res.status(201).json(newEmotionLog);
    } catch (error) {
      console.error("Error recording emotion:", error);
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
