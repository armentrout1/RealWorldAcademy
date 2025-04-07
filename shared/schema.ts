import { pgTable, text, serial, integer, boolean, timestamp, json, date } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  fullName: text("full_name").notNull(),
  email: text("email").notNull().unique(),
  avatar: text("avatar"),
  bio: text("bio"),
  firstName: text("first_name"),
  lastName: text("last_name"),
  ageGroup: text("age_group"),
  interests: text("interests").array(),
  // Gamification fields
  xp: integer("xp").default(0).notNull(),
  level: integer("level").default(1).notNull(),
  levelTitle: text("level_title").default("Beginner").notNull(),
  streakCount: integer("streak_count").default(0).notNull(),
  lastLogin: timestamp("last_login"),
  gamificationEnabled: boolean("gamification_enabled").default(true).notNull(),
  showLeaderboard: boolean("show_leaderboard").default(true).notNull(),
  showLevelUpNotifications: boolean("show_level_up_notifications").default(true).notNull()
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  fullName: true,
  email: true,
  avatar: true,
  bio: true,
  firstName: true,
  lastName: true,
  ageGroup: true,
  interests: true,
  xp: true,
  level: true,
  levelTitle: true,
  streakCount: true,
  lastLogin: true,
  gamificationEnabled: true,
  showLeaderboard: true,
  showLevelUpNotifications: true
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  color: text("color").notNull()
});

export const insertCategorySchema = createInsertSchema(categories);
export type InsertCategory = z.infer<typeof insertCategorySchema>;
export type Category = typeof categories.$inferSelect;

export const courses = pgTable("courses", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  image: text("image").notNull(),
  categoryId: integer("category_id").notNull(),
  duration: text("duration").notNull(),
  rating: text("rating"),
  isFeatured: boolean("is_featured").default(false)
});

export const coursesRelations = relations(courses, ({ one }) => ({
  category: one(categories, {
    fields: [courses.categoryId],
    references: [categories.id]
  })
}));

export const insertCourseSchema = createInsertSchema(courses);
export type InsertCourse = z.infer<typeof insertCourseSchema>;
export type Course = typeof courses.$inferSelect;

// Now define the categories relations after courses is defined
export const categoriesRelations = relations(categories, ({ many }) => ({
  courses: many(courses)
}));

export const testimonials = pgTable("testimonials", {
  id: serial("id").primaryKey(),
  content: text("content").notNull(),
  userName: text("user_name").notNull(),
  userTitle: text("user_title").notNull(),
  userAvatar: text("user_avatar"),
  rating: integer("rating").notNull()
});

export const insertTestimonialSchema = createInsertSchema(testimonials);
export type InsertTestimonial = z.infer<typeof insertTestimonialSchema>;
export type Testimonial = typeof testimonials.$inferSelect;

export const features = pgTable("features", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  icon: text("icon").notNull(),
  colorClass: text("color_class").notNull()
});

export const insertFeatureSchema = createInsertSchema(features);
export type InsertFeature = z.infer<typeof insertFeatureSchema>;
export type Feature = typeof features.$inferSelect;

// Progress tracking schema
export const badges = pgTable("badges", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  title: text("title").notNull(),
  description: text("description").notNull(),
  icon: text("icon").notNull(),
  unlocked: boolean("unlocked").default(false).notNull(),
  dateUnlocked: timestamp("date_unlocked"),
});

export const badgesRelations = relations(badges, ({ one }) => ({
  user: one(users, {
    fields: [badges.userId],
    references: [users.id],
  }),
}));

export const insertBadgeSchema = createInsertSchema(badges).omit({ id: true });
export type InsertBadge = z.infer<typeof insertBadgeSchema>;
export type Badge = typeof badges.$inferSelect;

export const categoryProgress = pgTable("category_progress", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  title: text("title").notNull(),
  completed: integer("completed").notNull(),
  total: integer("total").notNull(),
  color: text("color").notNull(),
  icon: text("icon").notNull(),
});

export const categoryProgressRelations = relations(categoryProgress, ({ one }) => ({
  user: one(users, {
    fields: [categoryProgress.userId],
    references: [users.id],
  }),
}));

export const insertCategoryProgressSchema = createInsertSchema(categoryProgress).omit({ id: true });
export type InsertCategoryProgress = z.infer<typeof insertCategoryProgressSchema>;
export type CategoryProgress = typeof categoryProgress.$inferSelect;

export const timelineEvents = pgTable("timeline_events", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  title: text("title").notNull(),
  date: timestamp("date").notNull(),
  completed: boolean("completed").default(true).notNull(),
  category: text("category").notNull(),
});

export const timelineEventsRelations = relations(timelineEvents, ({ one }) => ({
  user: one(users, {
    fields: [timelineEvents.userId],
    references: [users.id],
  }),
}));

export const insertTimelineEventSchema = createInsertSchema(timelineEvents).omit({ id: true });
export type InsertTimelineEvent = z.infer<typeof insertTimelineEventSchema>;
export type TimelineEvent = typeof timelineEvents.$inferSelect;

export const userProgressSummary = pgTable("user_progress_summary", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id).unique(),
  overallProgress: integer("overall_progress").notNull(),
  lastUpdated: timestamp("last_updated").notNull(),
});

export const userProgressSummaryRelations = relations(userProgressSummary, ({ one }) => ({
  user: one(users, {
    fields: [userProgressSummary.userId],
    references: [users.id],
  }),
}));

export const insertUserProgressSummarySchema = createInsertSchema(userProgressSummary).omit({ id: true });
export type InsertUserProgressSummary = z.infer<typeof insertUserProgressSummarySchema>;
export type UserProgressSummary = typeof userProgressSummary.$inferSelect;

// Career Paths model
export const careerPaths = pgTable("career_paths", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  iconName: text("icon_name").notNull(),
  color: text("color").notNull(),
  whyLoveIt: text("why_love_it").notNull(),
  tasks: json("tasks").notNull(), // Store as JSON
  education: text("education").notNull(),
  skills: json("skills").notNull() // Store as JSON
});

export const insertCareerPathSchema = createInsertSchema(careerPaths).omit({ id: true });
export type InsertCareerPath = z.infer<typeof insertCareerPathSchema>;
export type CareerPath = typeof careerPaths.$inferSelect;

// Goals model
export const goals = pgTable("goals", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  type: text("type").notNull(), // short-term, mid-term, long-term
  text: text("text").notNull(),
  completed: boolean("completed").default(false).notNull()
});

export const goalsRelations = relations(goals, ({ one }) => ({
  user: one(users, {
    fields: [goals.userId],
    references: [users.id],
  }),
}));

export const insertGoalSchema = createInsertSchema(goals).omit({ id: true });
export type InsertGoal = z.infer<typeof insertGoalSchema>;
export type Goal = typeof goals.$inferSelect;

// Vision Board Items model
export const visionBoardItems = pgTable("vision_board_items", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  type: text("type").notNull(), // quote, image, goal
  content: text("content").notNull(),
  position: json("position")
});

export const visionBoardItemsRelations = relations(visionBoardItems, ({ one }) => ({
  user: one(users, {
    fields: [visionBoardItems.userId],
    references: [users.id],
  }),
}));

export const insertVisionBoardItemSchema = createInsertSchema(visionBoardItems).omit({ id: true });
export type InsertVisionBoardItem = z.infer<typeof insertVisionBoardItemSchema>;
export type VisionBoardItem = typeof visionBoardItems.$inferSelect;

// Subjects model - for our core learning areas
export const subjects = pgTable("subjects", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  slug: text("slug").notNull().unique(),
  imageUrl: text("image_url"),
  iconName: text("icon_name").notNull(),
  color: text("color").notNull(),
  featured: boolean("featured").default(false),
  order: integer("order").notNull(),
  summary: text("summary"), // Summary shown on completion
  nextSubjectIds: integer("next_subject_ids").array(), // Suggested subjects to explore next
});

export const insertSubjectSchema = createInsertSchema(subjects).omit({ id: true });
export type InsertSubject = z.infer<typeof insertSubjectSchema>;
export type Subject = typeof subjects.$inferSelect;

// Lessons model - individual lessons within a subject
export const lessons = pgTable("lessons", {
  id: serial("id").primaryKey(),
  subjectId: integer("subject_id").notNull().references(() => subjects.id),
  title: text("title").notNull(),
  subtitle: text("subtitle"),
  content: text("content").notNull(), // Main lesson content
  slug: text("slug").notNull(),
  order: integer("order").notNull(), // Order within the subject
  scenarioTitle: text("scenario_title"), // Real-world scenario title
  scenarioContent: text("scenario_content"), // Real-world scenario content
  activityType: text("activity_type"), // Type of activity (quiz, reflection, etc)
  activityContent: json("activity_content"), // Activity configuration as JSON
  estimatedMinutes: integer("estimated_minutes"), // Estimated time to complete
  ageGroupContent: json("age_group_content"), // Different content for different age groups
});

export const insertLessonSchema = createInsertSchema(lessons).omit({ id: true });
export type InsertLesson = z.infer<typeof insertLessonSchema>;
export type Lesson = typeof lessons.$inferSelect;

// User-Subject junction table to track progress
export const userSubjectProgress = pgTable("user_subject_progress", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  subjectId: integer("subject_id").notNull().references(() => subjects.id),
  status: text("status").default('not_started').notNull(),
  currentLessonId: integer("current_lesson_id"),
  startedAt: timestamp("started_at"),
  completedAt: timestamp("completed_at"),
  percentComplete: integer("percent_complete").default(0),
});

export const insertUserSubjectProgressSchema = createInsertSchema(userSubjectProgress).omit({ id: true });
export type InsertUserSubjectProgress = z.infer<typeof insertUserSubjectProgressSchema>;
export type UserSubjectProgress = typeof userSubjectProgress.$inferSelect;

// User-Lesson junction table to track progress
export const userLessonProgress = pgTable("user_lesson_progress", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  lessonId: integer("lesson_id").notNull().references(() => lessons.id),
  status: text("status").default('not_started').notNull(),
  startedAt: timestamp("started_at"),
  completedAt: timestamp("completed_at"),
  answers: json("answers"), // Store user's answers/work as JSON
  notes: text("notes"), // User's personal notes for this lesson
});

export const insertUserLessonProgressSchema = createInsertSchema(userLessonProgress).omit({ id: true });
export type InsertUserLessonProgress = z.infer<typeof insertUserLessonProgressSchema>;
export type UserLessonProgress = typeof userLessonProgress.$inferSelect;

// Define relations
export const subjectsRelations = relations(subjects, ({ many }) => ({
  lessons: many(lessons),
  userProgress: many(userSubjectProgress),
}));

export const lessonsRelations = relations(lessons, ({ one, many }) => ({
  subject: one(subjects, {
    fields: [lessons.subjectId],
    references: [subjects.id],
  }),
  userProgress: many(userLessonProgress),
}));

export const userSubjectProgressRelations = relations(userSubjectProgress, ({ one }) => ({
  user: one(users, {
    fields: [userSubjectProgress.userId],
    references: [users.id],
  }),
  subject: one(subjects, {
    fields: [userSubjectProgress.subjectId],
    references: [subjects.id],
  }),
}));

export const userLessonProgressRelations = relations(userLessonProgress, ({ one }) => ({
  user: one(users, {
    fields: [userLessonProgress.userId],
    references: [users.id],
  }),
  lesson: one(lessons, {
    fields: [userLessonProgress.lessonId],
    references: [lessons.id],
  }),
}));

// Resources for the Resource Center
export const resources = pgTable("resources", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  resourceType: text("resource_type").notNull(), // "pdf", "video", "worksheet", "guide"
  category: text("category").notNull(), // "financial-literacy", "projects", "health", etc.
  audience: text("audience").array(), // ["teacher", "parent", "student"]
  fileUrl: text("file_url"), // URL to file (PDF, etc.)
  embedUrl: text("embed_url"), // URL for embedded content (videos)
  thumbnailUrl: text("thumbnail_url"), // URL to thumbnail image
  downloadCount: integer("download_count").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  relatedSubjectId: integer("related_subject_id").references(() => subjects.id),
  featured: boolean("featured").default(false),
});

export const insertResourceSchema = createInsertSchema(resources).omit({ id: true });
export type InsertResource = z.infer<typeof insertResourceSchema>;
export type Resource = typeof resources.$inferSelect;

export const resourcesRelations = relations(resources, ({ one }) => ({
  subject: one(subjects, {
    fields: [resources.relatedSubjectId],
    references: [subjects.id],
  }),
}));

// Daily challenges model
export const dailyChallenges = pgTable("daily_challenges", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  xpReward: integer("xp_reward").notNull(),
  type: text("type").notNull(), // "lesson", "quiz", "login", "project", etc.
  targetId: integer("target_id"), // Optional related entity id (lesson, subject, etc.)
  activeDate: date("active_date").notNull(), // Date this challenge is active
  difficultyLevel: integer("difficulty_level").default(1).notNull(), // 1-5 scale
  icon: text("icon").notNull(),
});

export const insertDailyChallengeSchema = createInsertSchema(dailyChallenges).omit({ id: true });
export type InsertDailyChallenge = z.infer<typeof insertDailyChallengeSchema>;
export type DailyChallenge = typeof dailyChallenges.$inferSelect;

// User completed challenges
export const userChallenges = pgTable("user_challenges", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  challengeId: integer("challenge_id").notNull().references(() => dailyChallenges.id),
  completedAt: timestamp("completed_at").notNull(),
  xpEarned: integer("xp_earned").notNull(),
});

export const userChallengesRelations = relations(userChallenges, ({ one }) => ({
  user: one(users, {
    fields: [userChallenges.userId],
    references: [users.id],
  }),
  challenge: one(dailyChallenges, {
    fields: [userChallenges.challengeId],
    references: [dailyChallenges.id],
  }),
}));

export const insertUserChallengeSchema = createInsertSchema(userChallenges).omit({ id: true });
export type InsertUserChallenge = z.infer<typeof insertUserChallengeSchema>;
export type UserChallenge = typeof userChallenges.$inferSelect;

// Define the user relations after all models are defined
export const usersRelations = relations(users, ({ many, one }) => ({
  badges: many(badges),
  categoryProgress: many(categoryProgress),
  timelineEvents: many(timelineEvents),
  progressSummary: one(userProgressSummary),
  goals: many(goals),
  visionBoardItems: many(visionBoardItems),
  subjectProgress: many(userSubjectProgress),
  lessonProgress: many(userLessonProgress),
  challenges: many(userChallenges),
}));
