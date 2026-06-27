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
  role: text("role").default("student").notNull(), // student, parent, admin
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
  role: true,
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
  category: text("category").notNull(), // "money", "mindset", "future", "wellness"
  ageGroups: text("age_groups").array().notNull(), // ["9-12", "13-15", "16-18"]
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
  slug: text("slug").notNull(),
  order: integer("order").notNull(), // Order within the subject
  
  // Standard lesson format fields
  learningObjective: text("learning_objective").notNull(), // 🎯 Learning Objective
  warmUpQuestion: text("warm_up_question").notNull(), // 🧠 Warm-Up Question
  lessonExplanation: text("lesson_explanation").notNull(), // 📘 Lesson Explanation
  
  // Real-world scenario fields
  scenarioTitle: text("scenario_title").notNull(), // 💬 Real-World Scenario title
  scenarioContent: text("scenario_content").notNull(), // 💬 Real-World Scenario content
  
  // Activity fields
  activityType: text("activity_type").notNull(), // 🛠️ Type of activity (quiz, reflection, budget-tool, etc)
  activityContent: json("activity_content").notNull(), // Activity configuration as JSON
  
  // Reflection prompt
  reflectionPrompt: text("reflection_prompt").notNull(), // 🔍 Reflection Prompt
  
  // Additional metadata
  estimatedMinutes: integer("estimated_minutes").notNull(), // Estimated time to complete
  xpReward: integer("xp_reward").default(50).notNull(), // XP reward for completing
  badgeId: integer("badge_id"), // Optional badge to award
  
  // Age-specific content - contains different versions for different age groups
  ageGroupContent: json("age_group_content").notNull(), // Different content for different age groups
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
  ageGroup: text("age_group").notNull(), // Which age group version the user is taking "9-12", "13-15", "16-18"
  startedAt: timestamp("started_at"),
  completedAt: timestamp("completed_at"),
  answers: json("answers"), // Store user's answers/work as JSON
  reflectionResponse: text("reflection_response"), // User's response to the reflection prompt
  notes: text("notes"), // User's personal notes for this lesson
  xpEarned: integer("xp_earned"), // XP earned from completing this lesson
  badgeEarned: boolean("badge_earned").default(false), // Whether the user earned a badge from this lesson
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

// Buddy AI Companion Schema
export const buddyProfiles = pgTable("buddy_profiles", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id).unique(),
  name: text("name").notNull().default("Buddy"),
  avatarType: text("avatar_type").notNull().default("robot"), // "robot", "animal", "human", "fantasy"
  avatarColor: text("avatar_color").notNull().default("blue"),
  personalityType: text("personality_type").notNull().default("friendly_supportive"), // "friendly_supportive", "chill_funny", "focused_motivational", "curious_reflective"
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  relationshipLevel: integer("relationship_level").default(1).notNull(), // 1-10 level of bonding
  lastInteraction: timestamp("last_interaction"),
  // New Memory Profile Fields
  nickname: text("nickname"), // Student's nickname, if they have one
  favoriteSubjects: text("favorite_subjects").array(), // Student's favorite subjects
  goals: text("goals").array(), // Goals or dreams the student has shared
  projects: json("projects"), // Current or completed projects, stored as JSON
  preferences: json("preferences"), // Student preferences, stored as JSON
  lastConversationSummary: text("last_conversation_summary"), // Summary of last conversation
});

export const buddyProfilesRelations = relations(buddyProfiles, ({ one }) => ({
  user: one(users, {
    fields: [buddyProfiles.userId],
    references: [users.id],
  }),
}));

export const insertBuddyProfileSchema = createInsertSchema(buddyProfiles).omit({ id: true });
export type InsertBuddyProfile = z.infer<typeof insertBuddyProfileSchema>;
export type BuddyProfile = typeof buddyProfiles.$inferSelect;

export const buddyMessages = pgTable("buddy_messages", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  role: text("role").notNull(), // "user" or "buddy"
  content: text("content").notNull(),
  sentAt: timestamp("sent_at").defaultNow(),
  emotion: text("emotion"), // Optional emotion tag for the message
  relatedToEntity: text("related_to_entity"), // Optional reference to what this relates to (lesson, subject, etc.)
  relatedEntityId: integer("related_entity_id"), // Optional ID for the related entity
});

export const buddyMessagesRelations = relations(buddyMessages, ({ one }) => ({
  user: one(users, {
    fields: [buddyMessages.userId],
    references: [users.id],
  }),
}));

export const insertBuddyMessageSchema = createInsertSchema(buddyMessages).omit({ id: true });
export type InsertBuddyMessage = z.infer<typeof insertBuddyMessageSchema>;
export type BuddyMessage = typeof buddyMessages.$inferSelect;

export const buddyEmotionLogs = pgTable("buddy_emotion_logs", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  emotion: text("emotion").notNull(), // "happy", "sad", "excited", "bored", "stressed", etc.
  intensity: integer("intensity").default(5).notNull(), // 1-10 scale
  loggedAt: timestamp("logged_at").defaultNow(),
  note: text("note"), // Optional context
  supportAction: text("support_action"), // What support action was taken (e.g., "breathe", "distract", "vent", etc.)
  reflectionText: text("reflection_text"), // Additional reflection on the emotion
});

export const buddyEmotionLogsRelations = relations(buddyEmotionLogs, ({ one }) => ({
  user: one(users, {
    fields: [buddyEmotionLogs.userId],
    references: [users.id],
  }),
}));

export const insertBuddyEmotionLogSchema = createInsertSchema(buddyEmotionLogs).omit({ id: true });
export type InsertBuddyEmotionLog = z.infer<typeof insertBuddyEmotionLogSchema>;
export type BuddyEmotionLog = typeof buddyEmotionLogs.$inferSelect;

// Journal System
export const buddyJournalEntries = pgTable("buddy_journal_entries", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  prompt: text("prompt").notNull(), // The question or prompt
  response: text("response").notNull(), // Student's written response
  emotion: text("emotion"), // Associated emotion tag
  emojiReaction: text("emoji_reaction"), // Emoji reaction to the entry
  tags: text("tags").array(), // Tags like "creative", "proud", "stressed"
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  isPrivate: boolean("is_private").default(true).notNull(), // Whether entry is private
  isHighlighted: boolean("is_highlighted").default(false).notNull(), // Featured/important entry
});

export const buddyJournalEntriesRelations = relations(buddyJournalEntries, ({ one }) => ({
  user: one(users, {
    fields: [buddyJournalEntries.userId],
    references: [users.id],
  }),
}));

export const insertBuddyJournalEntrySchema = createInsertSchema(buddyJournalEntries).omit({ id: true });
export type InsertBuddyJournalEntry = z.infer<typeof insertBuddyJournalEntrySchema>;
export type BuddyJournalEntry = typeof buddyJournalEntries.$inferSelect;

// Credential System
export const credentialDefinitions = pgTable("credential_definitions", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description").notNull(),
  subjectId: integer("subject_id").references(() => subjects.id),
  criteriaSummary: text("criteria_summary").notNull(),
  disclaimer: text("disclaimer").notNull().default("This is a Real World Academy completion credential and does not represent accredited school credit."),
  active: boolean("active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const credentialRequirements = pgTable("credential_requirements", {
  id: serial("id").primaryKey(),
  credentialId: integer("credential_id").notNull().references(() => credentialDefinitions.id),
  requirementType: text("requirement_type").notNull(), // lesson, reflection, project, parent_review
  title: text("title").notNull(),
  description: text("description").notNull(),
  targetId: integer("target_id"),
  required: boolean("required").default(true).notNull(),
  order: integer("order").notNull(),
});

export const issuedCredentials = pgTable("issued_credentials", {
  id: serial("id").primaryKey(),
  credentialId: integer("credential_id").notNull().references(() => credentialDefinitions.id),
  userId: integer("user_id").notNull().references(() => users.id),
  status: text("status").notNull().default("issued"), // pending_review, issued, revoked
  issuedAt: timestamp("issued_at").defaultNow(),
  reviewedByUserId: integer("reviewed_by_user_id").references(() => users.id),
  reviewNote: text("review_note"),
  shareCode: text("share_code").notNull().unique(),
});

export const credentialDefinitionsRelations = relations(credentialDefinitions, ({ one, many }) => ({
  subject: one(subjects, {
    fields: [credentialDefinitions.subjectId],
    references: [subjects.id],
  }),
  requirements: many(credentialRequirements),
  issuedCredentials: many(issuedCredentials),
}));

export const credentialRequirementsRelations = relations(credentialRequirements, ({ one }) => ({
  credential: one(credentialDefinitions, {
    fields: [credentialRequirements.credentialId],
    references: [credentialDefinitions.id],
  }),
}));

export const issuedCredentialsRelations = relations(issuedCredentials, ({ one }) => ({
  credential: one(credentialDefinitions, {
    fields: [issuedCredentials.credentialId],
    references: [credentialDefinitions.id],
  }),
  user: one(users, {
    fields: [issuedCredentials.userId],
    references: [users.id],
  }),
  reviewer: one(users, {
    fields: [issuedCredentials.reviewedByUserId],
    references: [users.id],
  }),
}));

export const insertCredentialDefinitionSchema = createInsertSchema(credentialDefinitions).omit({ id: true });
export type InsertCredentialDefinition = z.infer<typeof insertCredentialDefinitionSchema>;
export type CredentialDefinition = typeof credentialDefinitions.$inferSelect;

export const insertCredentialRequirementSchema = createInsertSchema(credentialRequirements).omit({ id: true });
export type InsertCredentialRequirement = z.infer<typeof insertCredentialRequirementSchema>;
export type CredentialRequirement = typeof credentialRequirements.$inferSelect;

export const insertIssuedCredentialSchema = createInsertSchema(issuedCredentials).omit({ id: true });
export type InsertIssuedCredential = z.infer<typeof insertIssuedCredentialSchema>;
export type IssuedCredential = typeof issuedCredentials.$inferSelect;

// Family relationships for homeschool parent review
export const parentChildRelationships = pgTable("parent_child_relationships", {
  id: serial("id").primaryKey(),
  parentUserId: integer("parent_user_id").notNull().references(() => users.id),
  childUserId: integer("child_user_id").notNull().references(() => users.id),
  relationshipLabel: text("relationship_label").default("parent").notNull(),
  status: text("status").default("active").notNull(), // pending, active, revoked
  createdAt: timestamp("created_at").defaultNow(),
});

export const parentChildRelationshipsRelations = relations(parentChildRelationships, ({ one }) => ({
  parent: one(users, {
    fields: [parentChildRelationships.parentUserId],
    references: [users.id],
    relationName: "parentRelationships",
  }),
  child: one(users, {
    fields: [parentChildRelationships.childUserId],
    references: [users.id],
    relationName: "childRelationships",
  }),
}));

export const insertParentChildRelationshipSchema = createInsertSchema(parentChildRelationships).omit({ id: true });
export type InsertParentChildRelationship = z.infer<typeof insertParentChildRelationshipSchema>;
export type ParentChildRelationship = typeof parentChildRelationships.$inferSelect;

export const parentLessonReviews = pgTable("parent_lesson_reviews", {
  id: serial("id").primaryKey(),
  parentUserId: integer("parent_user_id").notNull().references(() => users.id),
  childUserId: integer("child_user_id").notNull().references(() => users.id),
  lessonId: integer("lesson_id").notNull().references(() => lessons.id),
  status: text("status").default("approved").notNull(), // approved, changes_requested
  note: text("note"),
  reviewedAt: timestamp("reviewed_at").defaultNow(),
});

export const parentLessonReviewsRelations = relations(parentLessonReviews, ({ one }) => ({
  parent: one(users, {
    fields: [parentLessonReviews.parentUserId],
    references: [users.id],
    relationName: "parentLessonReviews",
  }),
  child: one(users, {
    fields: [parentLessonReviews.childUserId],
    references: [users.id],
    relationName: "childLessonReviews",
  }),
  lesson: one(lessons, {
    fields: [parentLessonReviews.lessonId],
    references: [lessons.id],
  }),
}));

export const insertParentLessonReviewSchema = createInsertSchema(parentLessonReviews).omit({ id: true });
export type InsertParentLessonReview = z.infer<typeof insertParentLessonReviewSchema>;
export type ParentLessonReview = typeof parentLessonReviews.$inferSelect;

export const contributorProfiles = pgTable("contributor_profiles", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id).unique(),
  displayName: text("display_name").notNull(),
  bio: text("bio"),
  affiliation: text("affiliation"),
  website: text("website"),
  avatarUrl: text("avatar_url"),
  expertiseTags: text("expertise_tags").array(),
  trustLevel: text("trust_level").default("new").notNull(), // new, verified, trusted, partner, restricted
  status: text("status").default("active").notNull(), // active, restricted, archived
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const contributorProfilesRelations = relations(contributorProfiles, ({ one }) => ({
  user: one(users, {
    fields: [contributorProfiles.userId],
    references: [users.id],
  }),
}));

export const insertContributorProfileSchema = createInsertSchema(contributorProfiles).omit({ id: true });
export type InsertContributorProfile = z.infer<typeof insertContributorProfileSchema>;
export type ContributorProfile = typeof contributorProfiles.$inferSelect;

export const curriculumSubmissions = pgTable("curriculum_submissions", {
  id: serial("id").primaryKey(),
  contributorProfileId: integer("contributor_profile_id").references(() => contributorProfiles.id),
  contributorName: text("contributor_name").notNull(),
  contributorEmail: text("contributor_email").notNull(),
  affiliation: text("affiliation").notNull(),
  title: text("title").notNull(),
  subject: text("subject").notNull(),
  ageGroup: text("age_group").notNull(),
  objective: text("objective").notNull(),
  warmUp: text("warm_up").notNull(),
  coreContent: text("core_content").notNull(),
  scenario: text("scenario").notNull(),
  activity: text("activity").notNull(),
  reflection: text("reflection").notNull(),
  badge: text("badge"),
  status: text("status").default("pending_review").notNull(), // draft, pending_review, changes_requested, approved, rejected, archived
  reviewerNote: text("reviewer_note"),
  submittedAt: timestamp("submitted_at").defaultNow(),
  reviewedAt: timestamp("reviewed_at"),
});

export const insertCurriculumSubmissionSchema = createInsertSchema(curriculumSubmissions).omit({ id: true });
export type InsertCurriculumSubmission = z.infer<typeof insertCurriculumSubmissionSchema>;
export type CurriculumSubmission = typeof curriculumSubmissions.$inferSelect;

export const curriculumSubmissionsRelations = relations(curriculumSubmissions, ({ one }) => ({
  contributorProfile: one(contributorProfiles, {
    fields: [curriculumSubmissions.contributorProfileId],
    references: [contributorProfiles.id],
  }),
}));

export const curriculumCollections = pgTable("curriculum_collections", {
  id: serial("id").primaryKey(),
  contributorProfileId: integer("contributor_profile_id").notNull().references(() => contributorProfiles.id),
  title: text("title").notNull(),
  description: text("description").notNull(),
  subject: text("subject").notNull(),
  ageGroup: text("age_group").notNull(),
  estimatedWeeks: integer("estimated_weeks").default(1).notNull(),
  learningGoals: text("learning_goals").array(),
  parentNotes: text("parent_notes"),
  finalProject: text("final_project"),
  status: text("status").default("draft").notNull(), // draft, pending_review, changes_requested, approved, published, rejected, archived
  reviewerNote: text("reviewer_note"),
  submittedAt: timestamp("submitted_at"),
  reviewedAt: timestamp("reviewed_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertCurriculumCollectionSchema = createInsertSchema(curriculumCollections).omit({ id: true });
export type InsertCurriculumCollection = z.infer<typeof insertCurriculumCollectionSchema>;
export type CurriculumCollection = typeof curriculumCollections.$inferSelect;

export const curriculumCollectionItems = pgTable("curriculum_collection_items", {
  id: serial("id").primaryKey(),
  collectionId: integer("collection_id").notNull().references(() => curriculumCollections.id),
  itemType: text("item_type").notNull(), // lesson, resource, video, link, activity
  title: text("title").notNull(),
  description: text("description"),
  url: text("url"),
  lessonId: integer("lesson_id").references(() => lessons.id),
  resourceId: integer("resource_id").references(() => resources.id),
  order: integer("order").notNull(),
  parentPrompt: text("parent_prompt"),
  studentPrompt: text("student_prompt"),
});

export const insertCurriculumCollectionItemSchema = createInsertSchema(curriculumCollectionItems).omit({ id: true });
export type InsertCurriculumCollectionItem = z.infer<typeof insertCurriculumCollectionItemSchema>;
export type CurriculumCollectionItem = typeof curriculumCollectionItems.$inferSelect;

export const curriculumCollectionsRelations = relations(curriculumCollections, ({ one, many }) => ({
  contributorProfile: one(contributorProfiles, {
    fields: [curriculumCollections.contributorProfileId],
    references: [contributorProfiles.id],
  }),
  items: many(curriculumCollectionItems),
}));

export const curriculumCollectionItemsRelations = relations(curriculumCollectionItems, ({ one }) => ({
  collection: one(curriculumCollections, {
    fields: [curriculumCollectionItems.collectionId],
    references: [curriculumCollections.id],
  }),
  lesson: one(lessons, {
    fields: [curriculumCollectionItems.lessonId],
    references: [lessons.id],
  }),
  resource: one(resources, {
    fields: [curriculumCollectionItems.resourceId],
    references: [resources.id],
  }),
}));

export const feedbackSubmissions = pgTable("feedback_submissions", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  audience: text("audience").notNull(), // parent, student, contributor, other
  category: text("category").notNull(), // bug, content, safety, idea, general
  message: text("message").notNull(),
  status: text("status").default("new").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertFeedbackSubmissionSchema = createInsertSchema(feedbackSubmissions).omit({ id: true });
export type InsertFeedbackSubmission = z.infer<typeof insertFeedbackSubmissionSchema>;
export type FeedbackSubmission = typeof feedbackSubmissions.$inferSelect;

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
  buddyProfile: one(buddyProfiles),
  buddyMessages: many(buddyMessages),
  buddyEmotionLogs: many(buddyEmotionLogs),
  buddyJournalEntries: many(buddyJournalEntries),
  issuedCredentials: many(issuedCredentials),
  parentRelationships: many(parentChildRelationships, { relationName: "parentRelationships" }),
  childRelationships: many(parentChildRelationships, { relationName: "childRelationships" }),
  parentLessonReviews: many(parentLessonReviews, { relationName: "parentLessonReviews" }),
  childLessonReviews: many(parentLessonReviews, { relationName: "childLessonReviews" }),
  contributorProfile: one(contributorProfiles),
}));
