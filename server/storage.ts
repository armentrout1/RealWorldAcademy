import { 
  users, type User, type InsertUser,
  courses, type Course, type InsertCourse,
  categories, type Category, type InsertCategory,
  testimonials, type Testimonial, type InsertTestimonial,
  features, type Feature, type InsertFeature
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

  // Initialize with sample data
  async initializeData() {
    // First check if there's already data in the database
    const existingCategories = await this.getAllCategories();
    if (existingCategories.length > 0) return; // Skip initialization if data exists
    
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
      rating: 4.5
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
}

// Create and export the database storage instance
const dbStorage = new DatabaseStorage();
export const storage = dbStorage;

// Initialize data when first imported
dbStorage.initializeData().catch(err => {
  console.error('Failed to initialize database:', err);
});
