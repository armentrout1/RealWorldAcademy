import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
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
  bio: text("bio")
});

export const usersRelations = relations(users, ({ many, one }) => ({
  badges: many(badges),
  categoryProgress: many(categoryProgress),
  timelineEvents: many(timelineEvents),
  progressSummary: one(userProgressSummary),
}));

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  fullName: true,
  email: true,
  avatar: true,
  bio: true
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
