import { 
  users, type User, type InsertUser,
  courses, type Course, type InsertCourse,
  categories, type Category, type InsertCategory,
  testimonials, type Testimonial, type InsertTestimonial,
  features, type Feature, type InsertFeature,
  badges, type Badge, type InsertBadge,
  categoryProgress, type CategoryProgress, type InsertCategoryProgress,
  timelineEvents, type TimelineEvent, type InsertTimelineEvent,
  userProgressSummary, type UserProgressSummary, type InsertUserProgressSummary
} from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Course operations
  getAllCourses(): Promise<Course[]>;
  getFeaturedCourses(): Promise<Course[]>;
  getCourse(id: number): Promise<Course | undefined>;
  createCourse(course: InsertCourse): Promise<Course>;
  
  // Category operations
  getAllCategories(): Promise<Category[]>;
  getCategory(id: number): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;
  
  // Testimonial operations
  getAllTestimonials(): Promise<Testimonial[]>;
  createTestimonial(testimonial: InsertTestimonial): Promise<Testimonial>;
  
  // Feature operations 
  getAllFeatures(): Promise<Feature[]>;
  createFeature(feature: InsertFeature): Promise<Feature>;
  
  // Progress tracking operations
  // Badge operations
  getUserBadges(userId: number): Promise<Badge[]>;
  createBadge(badge: InsertBadge): Promise<Badge>;
  updateBadge(id: number, badge: Partial<Badge>): Promise<Badge>;
  
  // Category progress operations
  getUserCategoryProgress(userId: number): Promise<CategoryProgress[]>;
  createCategoryProgress(progress: InsertCategoryProgress): Promise<CategoryProgress>;
  updateCategoryProgress(id: number, progress: Partial<CategoryProgress>): Promise<CategoryProgress>;
  
  // Timeline operations
  getUserTimelineEvents(userId: number): Promise<TimelineEvent[]>;
  createTimelineEvent(event: InsertTimelineEvent): Promise<TimelineEvent>;
  
  // Overall progress operations
  getUserProgressSummary(userId: number): Promise<UserProgressSummary | undefined>;
  createUserProgressSummary(summary: InsertUserProgressSummary): Promise<UserProgressSummary>;
  updateUserProgressSummary(userId: number, summary: Partial<UserProgressSummary>): Promise<UserProgressSummary>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: number): Promise<User | undefined> {
    const results = await db.select().from(users).where(eq(users.id, id));
    return results.length > 0 ? results[0] : undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const results = await db.select().from(users).where(eq(users.username, username));
    return results.length > 0 ? results[0] : undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const results = await db.insert(users).values(insertUser).returning();
    return results[0];
  }
  
  // Course operations
  async getAllCourses(): Promise<Course[]> {
    return await db.select().from(courses);
  }
  
  async getFeaturedCourses(): Promise<Course[]> {
    return await db.select().from(courses).where(eq(courses.isFeatured, true));
  }
  
  async getCourse(id: number): Promise<Course | undefined> {
    const results = await db.select().from(courses).where(eq(courses.id, id));
    return results.length > 0 ? results[0] : undefined;
  }
  
  async createCourse(insertCourse: InsertCourse): Promise<Course> {
    const results = await db.insert(courses).values(insertCourse).returning();
    return results[0];
  }
  
  // Category operations
  async getAllCategories(): Promise<Category[]> {
    return await db.select().from(categories);
  }
  
  async getCategory(id: number): Promise<Category | undefined> {
    const results = await db.select().from(categories).where(eq(categories.id, id));
    return results.length > 0 ? results[0] : undefined;
  }
  
  async createCategory(insertCategory: InsertCategory): Promise<Category> {
    const results = await db.insert(categories).values(insertCategory).returning();
    return results[0];
  }
  
  // Testimonial operations
  async getAllTestimonials(): Promise<Testimonial[]> {
    return await db.select().from(testimonials);
  }
  
  async createTestimonial(insertTestimonial: InsertTestimonial): Promise<Testimonial> {
    const results = await db.insert(testimonials).values(insertTestimonial).returning();
    return results[0];
  }
  
  // Feature operations
  async getAllFeatures(): Promise<Feature[]> {
    return await db.select().from(features);
  }
  
  async createFeature(insertFeature: InsertFeature): Promise<Feature> {
    const results = await db.insert(features).values(insertFeature).returning();
    return results[0];
  }
  
  // Badge operations
  async getUserBadges(userId: number): Promise<Badge[]> {
    return await db.select().from(badges).where(eq(badges.userId, userId));
  }
  
  async createBadge(badge: InsertBadge): Promise<Badge> {
    const results = await db.insert(badges).values(badge).returning();
    return results[0];
  }
  
  async updateBadge(id: number, badge: Partial<Badge>): Promise<Badge> {
    const results = await db
      .update(badges)
      .set(badge)
      .where(eq(badges.id, id))
      .returning();
    return results[0];
  }
  
  // Category progress operations
  async getUserCategoryProgress(userId: number): Promise<CategoryProgress[]> {
    return await db.select().from(categoryProgress).where(eq(categoryProgress.userId, userId));
  }
  
  async createCategoryProgress(progress: InsertCategoryProgress): Promise<CategoryProgress> {
    const results = await db.insert(categoryProgress).values(progress).returning();
    return results[0];
  }
  
  async updateCategoryProgress(id: number, progress: Partial<CategoryProgress>): Promise<CategoryProgress> {
    const results = await db
      .update(categoryProgress)
      .set(progress)
      .where(eq(categoryProgress.id, id))
      .returning();
    return results[0];
  }
  
  // Timeline operations
  async getUserTimelineEvents(userId: number): Promise<TimelineEvent[]> {
    return await db.select().from(timelineEvents).where(eq(timelineEvents.userId, userId));
  }
  
  async createTimelineEvent(event: InsertTimelineEvent): Promise<TimelineEvent> {
    const results = await db.insert(timelineEvents).values(event).returning();
    return results[0];
  }
  
  // Overall progress operations
  async getUserProgressSummary(userId: number): Promise<UserProgressSummary | undefined> {
    const results = await db.select().from(userProgressSummary).where(eq(userProgressSummary.userId, userId));
    return results.length > 0 ? results[0] : undefined;
  }
  
  async createUserProgressSummary(summary: InsertUserProgressSummary): Promise<UserProgressSummary> {
    const results = await db.insert(userProgressSummary).values(summary).returning();
    return results[0];
  }
  
  async updateUserProgressSummary(userId: number, summary: Partial<UserProgressSummary>): Promise<UserProgressSummary> {
    // First check if summary exists
    const existing = await this.getUserProgressSummary(userId);
    
    if (existing) {
      const results = await db
        .update(userProgressSummary)
        .set(summary)
        .where(eq(userProgressSummary.userId, userId))
        .returning();
      return results[0];
    } else {
      // Create new summary if it doesn't exist
      const newSummary: InsertUserProgressSummary = {
        userId,
        overallProgress: summary.overallProgress || 0,
        lastUpdated: summary.lastUpdated || new Date(),
      };
      return await this.createUserProgressSummary(newSummary);
    }
  }

  // Initialize with sample data
  async initializeData() {
    // First check if there's already data in the database
    const existingCategories = await this.getAllCategories();
    if (existingCategories.length > 0) {
      // Check if we need to initialize progress data
      await this.initializeProgressData();
      return; // Skip initialization if categories exist
    }
    
    // Create categories
    const techCategory = await this.createCategory({ name: "Technology", color: "bg-secondary/10 text-secondary" });
    const financeCategory = await this.createCategory({ name: "Finance", color: "bg-green-100 text-green-700" });
    const softSkillsCategory = await this.createCategory({ name: "Soft Skills", color: "bg-purple-100 text-purple-700" });
    
    // Create courses
    await this.createCourse({
      title: "Digital Skills for the Modern Workplace",
      description: "Learn essential digital tools and strategies to excel in today's technology-driven work environment.",
      image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
      categoryId: techCategory.id,
      duration: "8 weeks",
      rating: "4.8",
      isFeatured: true
    });
    
    await this.createCourse({
      title: "Financial Literacy 101",
      description: "Master the fundamentals of personal finance, budgeting, and investing for long-term financial success.",
      image: "https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
      categoryId: financeCategory.id,
      duration: "6 weeks",
      rating: "4.6",
      isFeatured: true
    });
    
    await this.createCourse({
      title: "Effective Communication Skills",
      description: "Develop powerful communication techniques for professional and personal success in any situation.",
      image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
      categoryId: softSkillsCategory.id,
      duration: "4 weeks",
      rating: "4.9",
      isFeatured: true
    });
    
    // Create testimonials
    await this.createTestimonial({
      content: "Real World Academy completely changed my career trajectory. The financial literacy course gave me practical knowledge I use every day. Worth every minute!",
      userName: "Sarah Johnson",
      userTitle: "Digital Marketing Specialist",
      userAvatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80",
      rating: 5
    });
    
    await this.createTestimonial({
      content: "The self-discovery program helped me understand my strengths and find a career path I'm passionate about. The project-based approach built my confidence.",
      userName: "James Rivera",
      userTitle: "Software Developer",
      userAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80",
      rating: 5
    });
    
    await this.createTestimonial({
      content: "I was skeptical at first, but the communication skills course transformed how I interact with clients. The AI-powered learning adapted to my busy schedule.",
      userName: "Michelle Chen",
      userTitle: "Freelance Consultant",
      userAvatar: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80",
      rating: 4
    });
    
    // Create features
    await this.createFeature({
      title: "Practical Learning",
      description: "Focus on real-world applications and skills that matter in today's job market.",
      icon: "graduation-cap",
      colorClass: "bg-primary/10 text-primary"
    });
    
    await this.createFeature({
      title: "AI-Powered Learning",
      description: "Personalized learning paths adapted to your unique needs and learning style.",
      icon: "users",
      colorClass: "bg-secondary/10 text-secondary"
    });
    
    await this.createFeature({
      title: "Self Discovery",
      description: "Uncover your strengths, passions, and career paths that align with your values.",
      icon: "lightbulb",
      colorClass: "bg-accent/10 text-accent"
    });
    
    await this.createFeature({
      title: "Project-Based",
      description: "Build a portfolio of real projects that demonstrate your skills to employers.",
      icon: "puzzle-piece",
      colorClass: "bg-green-100 text-green-600"
    });
  }
  
  // Initialize progress data for the default user
  async initializeProgressData() {
    // Check if we have a default user
    let defaultUser;
    const existingUsers = await db.select().from(users);
    
    if (existingUsers.length === 0) {
      // Create a default user if none exists
      defaultUser = await this.createUser({
        username: "student",
        password: "password", // In a real app, you'd hash this
        fullName: "Student User",
        email: "student@realworldacademy.com",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80",
        bio: "Learning at Real World Academy"
      });
    } else {
      defaultUser = existingUsers[0];
    }
    
    // Check if default user already has badge data
    const existingBadges = await this.getUserBadges(defaultUser.id);
    if (existingBadges.length > 0) return; // Progress data already exists
    
    // Initialize badges
    const badges = [
      {
        userId: defaultUser.id,
        title: "First Quiz Completed",
        description: "You completed your first self-discovery quiz!",
        icon: "🎯",
        unlocked: false,
      },
      {
        userId: defaultUser.id,
        title: "Budget Master",
        description: "You created your first budget plan!",
        icon: "💰",
        unlocked: false,
      },
      {
        userId: defaultUser.id,
        title: "First Project Built",
        description: "You completed your first hands-on project!",
        icon: "🛠️",
        unlocked: false,
      },
      {
        userId: defaultUser.id,
        title: "Knowledge Explorer",
        description: "You finished a complete subject module!",
        icon: "📘",
        unlocked: false,
      },
      {
        userId: defaultUser.id,
        title: "Teamwork Champion",
        description: "You completed a team project simulation!",
        icon: "🤝",
        unlocked: false,
      },
      {
        userId: defaultUser.id,
        title: "Financial Wizard",
        description: "You mastered all financial literacy modules!",
        icon: "✨",
        unlocked: false,
      }
    ];
    
    for (const badge of badges) {
      await this.createBadge(badge);
    }
    
    // Initialize category progress
    const categories = [
      {
        userId: defaultUser.id,
        title: "Self Discovery",
        completed: 0,
        total: 1,
        color: "hsl(280, 90%, 65%)",
        icon: "🧠",
      },
      {
        userId: defaultUser.id,
        title: "Subject Modules",
        completed: 0,
        total: 5,
        color: "hsl(220, 90%, 65%)",
        icon: "📚",
      },
      {
        userId: defaultUser.id,
        title: "Projects",
        completed: 0,
        total: 5,
        color: "hsl(160, 90%, 40%)",
        icon: "🛠️",
      },
      {
        userId: defaultUser.id,
        title: "Financial Literacy",
        completed: 0,
        total: 4,
        color: "hsl(40, 90%, 55%)",
        icon: "💰",
      },
      {
        userId: defaultUser.id,
        title: "Team Projects",
        completed: 0,
        total: 3,
        color: "hsl(340, 90%, 65%)",
        icon: "👥",
      }
    ];
    
    for (const category of categories) {
      await this.createCategoryProgress(category);
    }
    
    // Initialize timeline
    await this.createTimelineEvent({
      userId: defaultUser.id,
      title: "Started learning journey",
      date: new Date(),
      completed: true,
      category: "general",
    });
    
    // Initialize overall progress
    await this.createUserProgressSummary({
      userId: defaultUser.id,
      overallProgress: 0,
      lastUpdated: new Date(),
    });
    
    console.log("Progress data initialized for user:", defaultUser.username);
  }
}

// Create and export the database storage instance
const dbStorage = new DatabaseStorage();
export const storage = dbStorage;

// Initialize data when first imported
dbStorage.initializeData().catch(err => {
  console.error('Failed to initialize database:', err);
});
