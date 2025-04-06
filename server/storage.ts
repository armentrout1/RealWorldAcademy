import { 
  users, type User, type InsertUser,
  courses, type Course, type InsertCourse,
  categories, type Category, type InsertCategory,
  testimonials, type Testimonial, type InsertTestimonial,
  features, type Feature, type InsertFeature
} from "@shared/schema";

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

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private courses: Map<number, Course>;
  private categories: Map<number, Category>;
  private testimonials: Map<number, Testimonial>;
  private features: Map<number, Feature>;
  
  private userCurrentId: number;
  private courseCurrentId: number;
  private categoryCurrentId: number;
  private testimonialCurrentId: number;
  private featureCurrentId: number;

  constructor() {
    this.users = new Map();
    this.courses = new Map();
    this.categories = new Map();
    this.testimonials = new Map();
    this.features = new Map();
    
    this.userCurrentId = 1;
    this.courseCurrentId = 1;
    this.categoryCurrentId = 1;
    this.testimonialCurrentId = 1;
    this.featureCurrentId = 1;
    
    // Initialize with sample data
    this.initializeData();
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userCurrentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  
  // Course operations
  async getAllCourses(): Promise<Course[]> {
    return Array.from(this.courses.values());
  }
  
  async getFeaturedCourses(): Promise<Course[]> {
    return Array.from(this.courses.values()).filter(course => course.isFeatured);
  }
  
  async getCourse(id: number): Promise<Course | undefined> {
    return this.courses.get(id);
  }
  
  async createCourse(insertCourse: InsertCourse): Promise<Course> {
    const id = this.courseCurrentId++;
    const course: Course = { ...insertCourse, id };
    this.courses.set(id, course);
    return course;
  }
  
  // Category operations
  async getAllCategories(): Promise<Category[]> {
    return Array.from(this.categories.values());
  }
  
  async getCategory(id: number): Promise<Category | undefined> {
    return this.categories.get(id);
  }
  
  async createCategory(insertCategory: InsertCategory): Promise<Category> {
    const id = this.categoryCurrentId++;
    const category: Category = { ...insertCategory, id };
    this.categories.set(id, category);
    return category;
  }
  
  // Testimonial operations
  async getAllTestimonials(): Promise<Testimonial[]> {
    return Array.from(this.testimonials.values());
  }
  
  async createTestimonial(insertTestimonial: InsertTestimonial): Promise<Testimonial> {
    const id = this.testimonialCurrentId++;
    const testimonial: Testimonial = { ...insertTestimonial, id };
    this.testimonials.set(id, testimonial);
    return testimonial;
  }
  
  // Feature operations
  async getAllFeatures(): Promise<Feature[]> {
    return Array.from(this.features.values());
  }
  
  async createFeature(insertFeature: InsertFeature): Promise<Feature> {
    const id = this.featureCurrentId++;
    const feature: Feature = { ...insertFeature, id };
    this.features.set(id, feature);
    return feature;
  }
  
  // Initialize with sample data
  private initializeData() {
    // Create categories
    const techCategory = this.createCategory({ name: "Technology", color: "bg-secondary/10 text-secondary" });
    const financeCategory = this.createCategory({ name: "Finance", color: "bg-green-100 text-green-700" });
    const softSkillsCategory = this.createCategory({ name: "Soft Skills", color: "bg-purple-100 text-purple-700" });
    
    // Create courses
    this.createCourse({
      title: "Digital Skills for the Modern Workplace",
      description: "Learn essential digital tools and strategies to excel in today's technology-driven work environment.",
      image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
      categoryId: 1, // Technology
      duration: "8 weeks",
      rating: "4.8",
      isFeatured: true
    });
    
    this.createCourse({
      title: "Financial Literacy 101",
      description: "Master the fundamentals of personal finance, budgeting, and investing for long-term financial success.",
      image: "https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
      categoryId: 2, // Finance
      duration: "6 weeks",
      rating: "4.6",
      isFeatured: true
    });
    
    this.createCourse({
      title: "Effective Communication Skills",
      description: "Develop powerful communication techniques for professional and personal success in any situation.",
      image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
      categoryId: 3, // Soft Skills
      duration: "4 weeks",
      rating: "4.9",
      isFeatured: true
    });
    
    // Create testimonials
    this.createTestimonial({
      content: "Real World Academy completely changed my career trajectory. The financial literacy course gave me practical knowledge I use every day. Worth every minute!",
      userName: "Sarah Johnson",
      userTitle: "Digital Marketing Specialist",
      userAvatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80",
      rating: 5
    });
    
    this.createTestimonial({
      content: "The self-discovery program helped me understand my strengths and find a career path I'm passionate about. The project-based approach built my confidence.",
      userName: "James Rivera",
      userTitle: "Software Developer",
      userAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80",
      rating: 5
    });
    
    this.createTestimonial({
      content: "I was skeptical at first, but the communication skills course transformed how I interact with clients. The AI-powered learning adapted to my busy schedule.",
      userName: "Michelle Chen",
      userTitle: "Freelance Consultant",
      userAvatar: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80",
      rating: 4.5
    });
    
    // Create features
    this.createFeature({
      title: "Practical Learning",
      description: "Focus on real-world applications and skills that matter in today's job market.",
      icon: "graduation-cap",
      colorClass: "bg-primary/10 text-primary"
    });
    
    this.createFeature({
      title: "AI-Powered Learning",
      description: "Personalized learning paths adapted to your unique needs and learning style.",
      icon: "users",
      colorClass: "bg-secondary/10 text-secondary"
    });
    
    this.createFeature({
      title: "Self Discovery",
      description: "Uncover your strengths, passions, and career paths that align with your values.",
      icon: "lightbulb",
      colorClass: "bg-accent/10 text-accent"
    });
    
    this.createFeature({
      title: "Project-Based",
      description: "Build a portfolio of real projects that demonstrate your skills to employers.",
      icon: "puzzle-piece",
      colorClass: "bg-green-100 text-green-600"
    });
  }
}

export const storage = new MemStorage();
