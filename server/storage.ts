import { 
  users, type User, type InsertUser,
  courses, type Course, type InsertCourse,
  categories, type Category, type InsertCategory,
  testimonials, type Testimonial, type InsertTestimonial,
  features, type Feature, type InsertFeature,
  badges, type Badge, type InsertBadge,
  categoryProgress, type CategoryProgress, type InsertCategoryProgress,
  timelineEvents, type TimelineEvent, type InsertTimelineEvent,
  userProgressSummary, type UserProgressSummary, type InsertUserProgressSummary,
  careerPaths, type CareerPath, type InsertCareerPath,
  goals, type Goal, type InsertGoal,
  visionBoardItems, type VisionBoardItem, type InsertVisionBoardItem,
  subjects, type Subject, type InsertSubject,
  lessons, type Lesson, type InsertLesson,
  lessonResources, type LessonResource, type InsertLessonResource,
  userSubjectProgress, type UserSubjectProgress, type InsertUserSubjectProgress,
  userLessonProgress, type UserLessonProgress, type InsertUserLessonProgress,
  resources, type Resource, type InsertResource,
  dailyChallenges, type DailyChallenge, type InsertDailyChallenge,
  userChallenges, type UserChallenge, type InsertUserChallenge,
  buddyProfiles, type BuddyProfile, type InsertBuddyProfile,
  buddyMessages, type BuddyMessage, type InsertBuddyMessage,
  buddyEmotionLogs, type BuddyEmotionLog, type InsertBuddyEmotionLog,
  buddyJournalEntries, type BuddyJournalEntry, type InsertBuddyJournalEntry,
  parentChildRelationships, type ParentChildRelationship, type InsertParentChildRelationship,
  parentLessonReviews, type ParentLessonReview, type InsertParentLessonReview,
  contributorProfiles, type ContributorProfile, type InsertContributorProfile,
  educatorOfferings, type EducatorOffering, type InsertEducatorOffering,
  offeringInterests, type OfferingInterest, type InsertOfferingInterest,
  curriculumSubmissions, type CurriculumSubmission, type InsertCurriculumSubmission,
  resourceSubmissions, type ResourceSubmission, type InsertResourceSubmission,
  curriculumCollections, type CurriculumCollection, type InsertCurriculumCollection,
  curriculumCollectionItems, type CurriculumCollectionItem, type InsertCurriculumCollectionItem,
  userCurriculumCollectionProgress, type UserCurriculumCollectionProgress, type InsertUserCurriculumCollectionProgress,
  feedbackSubmissions, type FeedbackSubmission, type InsertFeedbackSubmission,
  contentReports, type ContentReport, type InsertContentReport,
  credentialDefinitions, type CredentialDefinition, type InsertCredentialDefinition,
  credentialRequirements, type CredentialRequirement, type InsertCredentialRequirement,
  issuedCredentials, type IssuedCredential, type InsertIssuedCredential
} from "@shared/schema";
import { db } from "./db";
import { eq, sql, and, inArray } from "drizzle-orm";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getAllUsers(): Promise<User[]>;
  createUser(user: InsertUser): Promise<User>;
  updateUserRole(userId: number, role: string): Promise<User>;
  getChildrenForParent(parentUserId: number): Promise<User[]>;
  getParentsForChild(childUserId: number): Promise<User[]>;
  createParentChildRelationship(relationship: InsertParentChildRelationship): Promise<ParentChildRelationship>;
  getParentLessonReviewsForChild(childUserId: number): Promise<ParentLessonReview[]>;
  createParentLessonReview(review: InsertParentLessonReview): Promise<ParentLessonReview>;
  getCurriculumSubmissions(status?: string): Promise<CurriculumSubmission[]>;
  getCurriculumSubmissionsForContributor(contributorProfileId: number, contributorEmail: string): Promise<CurriculumSubmission[]>;
  getCurriculumSubmission(id: number): Promise<CurriculumSubmission | undefined>;
  createCurriculumSubmission(submission: InsertCurriculumSubmission): Promise<CurriculumSubmission>;
  reviewCurriculumSubmission(id: number, updates: Partial<CurriculumSubmission>): Promise<CurriculumSubmission>;
  getResourceSubmissions(status?: string): Promise<ResourceSubmission[]>;
  getResourceSubmissionsForContributor(contributorProfileId: number, contributorEmail: string): Promise<ResourceSubmission[]>;
  getResourceSubmission(id: number): Promise<ResourceSubmission | undefined>;
  createResourceSubmission(submission: InsertResourceSubmission): Promise<ResourceSubmission>;
  reviewResourceSubmission(id: number, updates: Partial<ResourceSubmission>): Promise<ResourceSubmission>;
  getCurriculumCollections(status?: string): Promise<CurriculumCollection[]>;
  getCurriculumCollectionsForContributor(contributorProfileId: number): Promise<CurriculumCollection[]>;
  getCurriculumCollection(id: number): Promise<CurriculumCollection | undefined>;
  createCurriculumCollection(collection: InsertCurriculumCollection): Promise<CurriculumCollection>;
  updateCurriculumCollection(id: number, updates: Partial<CurriculumCollection>): Promise<CurriculumCollection>;
  getCurriculumCollectionItems(collectionId: number): Promise<CurriculumCollectionItem[]>;
  replaceCurriculumCollectionItems(
    collectionId: number,
    items: InsertCurriculumCollectionItem[],
  ): Promise<CurriculumCollectionItem[]>;
  getUserCurriculumCollectionProgress(userId: number, collectionId: number): Promise<UserCurriculumCollectionProgress | undefined>;
  getAllUserCurriculumCollectionProgress(userId: number): Promise<UserCurriculumCollectionProgress[]>;
  upsertUserCurriculumCollectionProgress(
    userId: number,
    collectionId: number,
    updates: Partial<UserCurriculumCollectionProgress>,
  ): Promise<UserCurriculumCollectionProgress>;
  getAllContributorProfiles(): Promise<ContributorProfile[]>;
  getContributorProfile(id: number): Promise<ContributorProfile | undefined>;
  getContributorProfileByUserId(userId: number): Promise<ContributorProfile | undefined>;
  upsertContributorProfile(profile: InsertContributorProfile): Promise<ContributorProfile>;
  getEducatorOfferings(status?: string): Promise<EducatorOffering[]>;
  getEducatorOffering(id: number): Promise<EducatorOffering | undefined>;
  getEducatorOfferingsForContributor(contributorProfileId: number): Promise<EducatorOffering[]>;
  createEducatorOffering(offering: InsertEducatorOffering): Promise<EducatorOffering>;
  updateEducatorOffering(id: number, updates: Partial<EducatorOffering>): Promise<EducatorOffering>;
  getOfferingInterests(): Promise<OfferingInterest[]>;
  getOfferingInterestsForContributor(contributorProfileId: number): Promise<OfferingInterest[]>;
  getOfferingInterestsForOffering(educatorOfferingId: number): Promise<OfferingInterest[]>;
  createOfferingInterest(interest: InsertOfferingInterest): Promise<OfferingInterest>;
  updateOfferingInterest(id: number, updates: Partial<OfferingInterest>): Promise<OfferingInterest>;
  getFeedbackSubmissions(): Promise<FeedbackSubmission[]>;
  createFeedbackSubmission(submission: InsertFeedbackSubmission): Promise<FeedbackSubmission>;
  updateFeedbackSubmission(id: number, updates: Partial<FeedbackSubmission>): Promise<FeedbackSubmission>;
  getContentReports(status?: string): Promise<ContentReport[]>;
  createContentReport(report: InsertContentReport): Promise<ContentReport>;
  updateContentReport(id: number, updates: Partial<ContentReport>): Promise<ContentReport>;

  // Credential operations
  getAllCredentialDefinitions(): Promise<CredentialDefinition[]>;
  getCredentialDefinition(id: number): Promise<CredentialDefinition | undefined>;
  getCredentialDefinitionBySlug(slug: string): Promise<CredentialDefinition | undefined>;
  createCredentialDefinition(credential: InsertCredentialDefinition): Promise<CredentialDefinition>;
  getCredentialRequirements(credentialId: number): Promise<CredentialRequirement[]>;
  createCredentialRequirement(requirement: InsertCredentialRequirement): Promise<CredentialRequirement>;
  getIssuedCredentialsForUser(userId: number): Promise<IssuedCredential[]>;
  getIssuedCredentialByShareCode(shareCode: string): Promise<IssuedCredential | undefined>;
  issueCredential(credential: InsertIssuedCredential): Promise<IssuedCredential>;
  
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
  
  // Career path operations
  getAllCareerPaths(): Promise<CareerPath[]>;
  getCareerPath(id: number): Promise<CareerPath | undefined>;
  createCareerPath(careerPath: InsertCareerPath): Promise<CareerPath>;
  
  // Goal operations
  getUserGoals(userId: number): Promise<Goal[]>;
  createGoal(goal: InsertGoal): Promise<Goal>;
  updateGoal(id: number, goal: Partial<Goal>): Promise<Goal>;
  deleteGoal(id: number): Promise<void>;
  
  // Vision board operations
  getUserVisionBoardItems(userId: number): Promise<VisionBoardItem[]>;
  createVisionBoardItem(item: InsertVisionBoardItem): Promise<VisionBoardItem>;
  updateVisionBoardItem(id: number, item: Partial<VisionBoardItem>): Promise<VisionBoardItem>;
  deleteVisionBoardItem(id: number): Promise<void>;
  
  // Resource Center operations
  getAllResources(): Promise<Resource[]>;
  getResourcesByCategory(category: string): Promise<Resource[]>;
  getResourcesByAudience(audience: string): Promise<Resource[]>;
  getResourcesByType(type: string): Promise<Resource[]>;
  getFeaturedResources(): Promise<Resource[]>;
  getResource(id: number): Promise<Resource | undefined>;
  createResource(resource: InsertResource): Promise<Resource>;
  updateResource(id: number, resource: Partial<Resource>): Promise<Resource>;
  incrementDownloadCount(id: number): Promise<Resource>;
  
  // Subject operations
  getAllSubjects(): Promise<Subject[]>;
  getFeaturedSubjects(): Promise<Subject[]>;
  getSubject(id: number): Promise<Subject | undefined>;
  getSubjectBySlug(slug: string): Promise<Subject | undefined>;
  createSubject(subject: InsertSubject): Promise<Subject>;
  updateSubject(id: number, subject: Partial<Subject>): Promise<Subject>;
  
  // Lesson operations
  getLessonsBySubject(subjectId: number): Promise<Lesson[]>;
  getLesson(id: number): Promise<Lesson | undefined>;
  getLessonBySlug(subjectSlug: string, lessonSlug: string): Promise<Lesson | undefined>;
  createLesson(lesson: InsertLesson): Promise<Lesson>;
  updateLesson(id: number, lesson: Partial<Lesson>): Promise<Lesson>;
  getLessonResources(lessonId: number): Promise<LessonResource[]>;
  createLessonResource(resource: InsertLessonResource): Promise<LessonResource>;
  
  // User Subject Progress operations
  getUserSubjectProgress(userId: number, subjectId: number): Promise<UserSubjectProgress | undefined>;
  getAllUserSubjectProgress(userId: number): Promise<UserSubjectProgress[]>;
  createUserSubjectProgress(progress: InsertUserSubjectProgress): Promise<UserSubjectProgress>;
  updateUserSubjectProgress(userId: number, subjectId: number, progress: Partial<UserSubjectProgress>): Promise<UserSubjectProgress>;
  
  // User Lesson Progress operations
  getUserLessonProgress(userId: number, lessonId: number): Promise<UserLessonProgress | undefined>;
  getAllUserLessonProgress(userId: number): Promise<UserLessonProgress[]>;
  getAllUserLessonProgressBySubject(userId: number, subjectId: number): Promise<UserLessonProgress[]>;
  createUserLessonProgress(progress: InsertUserLessonProgress): Promise<UserLessonProgress>;
  updateUserLessonProgress(userId: number, lessonId: number, progress: Partial<UserLessonProgress>): Promise<UserLessonProgress>;
  
  // User operations - Gamification
  updateUserXP(userId: number, xpToAdd: number): Promise<User>;
  updateUserStreak(userId: number, streak: number): Promise<User>;
  updateUserLevel(userId: number, level: number, title?: string): Promise<User>;
  
  // Daily Challenge operations
  getAllDailyChallenges(): Promise<DailyChallenge[]>;
  getActiveDailyChallenges(): Promise<DailyChallenge[]>;
  getDailyChallenge(id: number): Promise<DailyChallenge | undefined>;
  createDailyChallenge(challenge: InsertDailyChallenge): Promise<DailyChallenge>;
  updateDailyChallenge(id: number, challenge: Partial<DailyChallenge>): Promise<DailyChallenge>;
  
  // User Challenge operations
  getUserCompletedChallenges(userId: number): Promise<UserChallenge[]>;
  getUserTodayCompletedChallenges(userId: number): Promise<UserChallenge[]>;
  completeChallenge(userChallenge: InsertUserChallenge): Promise<UserChallenge>;
  
  // Buddy AI operations
  getBuddyProfile(userId: number): Promise<BuddyProfile | undefined>;
  createBuddyProfile(profile: InsertBuddyProfile): Promise<BuddyProfile>;
  updateBuddyProfile(userId: number, profile: Partial<BuddyProfile>): Promise<BuddyProfile>;
  
  // Buddy Messages operations
  getBuddyMessages(userId: number, limit?: number): Promise<BuddyMessage[]>;
  createBuddyMessage(message: InsertBuddyMessage): Promise<BuddyMessage>;
  
  // Buddy Emotion operations
  getBuddyEmotions(userId: number, limit?: number): Promise<BuddyEmotionLog[]>;
  recordBuddyEmotion(emotionLog: InsertBuddyEmotionLog): Promise<BuddyEmotionLog>;
  getLatestBuddyEmotion(userId: number): Promise<BuddyEmotionLog | undefined>;
  
  // Journal Entries operations
  getBuddyJournalEntries(userId: number, limit?: number): Promise<BuddyJournalEntry[]>;
  createJournalEntry(entry: InsertBuddyJournalEntry): Promise<BuddyJournalEntry>;
  getJournalEntryById(entryId: number): Promise<BuddyJournalEntry | undefined>;
  updateJournalEntry(entryId: number, updates: Partial<Omit<InsertBuddyJournalEntry, 'userId'>>): Promise<BuddyJournalEntry | undefined>;
  deleteJournalEntry(entryId: number): Promise<void>;
  getJournalEntriesByTag(userId: number, tag: string): Promise<BuddyJournalEntry[]>;
  
  // Initialize Buddy for new user
  initializeBuddyProfile(userId: number): Promise<BuddyProfile>;
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

  async getUserByEmail(email: string): Promise<User | undefined> {
    const results = await db.select().from(users).where(eq(users.email, email));
    return results.length > 0 ? results[0] : undefined;
  }

  async getAllUsers(): Promise<User[]> {
    return await db.select().from(users);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const results = await db.insert(users).values(insertUser).returning();
    return results[0];
  }

  async updateUserRole(userId: number, role: string): Promise<User> {
    const results = await db.update(users)
      .set({ role })
      .where(eq(users.id, userId))
      .returning();
    return results[0];
  }

  async getChildrenForParent(parentUserId: number): Promise<User[]> {
    const relationships = await db.select().from(parentChildRelationships)
      .where(and(
        eq(parentChildRelationships.parentUserId, parentUserId),
        eq(parentChildRelationships.status, "active")
      ));

    if (relationships.length === 0) return [];

    const childIds = relationships.map((relationship) => relationship.childUserId);
    return await db.select().from(users).where(inArray(users.id, childIds));
  }

  async getParentsForChild(childUserId: number): Promise<User[]> {
    const relationships = await db.select().from(parentChildRelationships)
      .where(and(
        eq(parentChildRelationships.childUserId, childUserId),
        eq(parentChildRelationships.status, "active")
      ));

    if (relationships.length === 0) return [];

    const parentIds = relationships.map((relationship) => relationship.parentUserId);
    return await db.select().from(users).where(inArray(users.id, parentIds));
  }

  async createParentChildRelationship(relationship: InsertParentChildRelationship): Promise<ParentChildRelationship> {
    const results = await db.insert(parentChildRelationships).values(relationship).returning();
    return results[0];
  }

  async getParentLessonReviewsForChild(childUserId: number): Promise<ParentLessonReview[]> {
    return await db.select().from(parentLessonReviews)
      .where(eq(parentLessonReviews.childUserId, childUserId));
  }

  async createParentLessonReview(review: InsertParentLessonReview): Promise<ParentLessonReview> {
    const results = await db.insert(parentLessonReviews).values(review).returning();
    return results[0];
  }

  async getCurriculumSubmissions(status?: string): Promise<CurriculumSubmission[]> {
    if (status) {
      return await db.select().from(curriculumSubmissions)
        .where(eq(curriculumSubmissions.status, status));
    }

    return await db.select().from(curriculumSubmissions);
  }

  async getCurriculumSubmissionsForContributor(
    contributorProfileId: number,
    contributorEmail: string,
  ): Promise<CurriculumSubmission[]> {
    const allSubmissions = await this.getCurriculumSubmissions();
    const normalizedEmail = contributorEmail.trim().toLowerCase();

    return allSubmissions.filter((submission) =>
      submission.contributorProfileId === contributorProfileId ||
      submission.contributorEmail.trim().toLowerCase() === normalizedEmail
    );
  }

  async getCurriculumSubmission(id: number): Promise<CurriculumSubmission | undefined> {
    const results = await db.select().from(curriculumSubmissions)
      .where(eq(curriculumSubmissions.id, id));
    return results[0];
  }

  async createCurriculumSubmission(submission: InsertCurriculumSubmission): Promise<CurriculumSubmission> {
    const results = await db.insert(curriculumSubmissions).values(submission).returning();
    return results[0];
  }

  async reviewCurriculumSubmission(id: number, updates: Partial<CurriculumSubmission>): Promise<CurriculumSubmission> {
    const results = await db.update(curriculumSubmissions)
      .set(updates)
      .where(eq(curriculumSubmissions.id, id))
      .returning();
    return results[0];
  }

  async getResourceSubmissions(status?: string): Promise<ResourceSubmission[]> {
    if (status) {
      return await db.select().from(resourceSubmissions)
        .where(eq(resourceSubmissions.status, status));
    }

    return await db.select().from(resourceSubmissions);
  }

  async getResourceSubmissionsForContributor(
    contributorProfileId: number,
    contributorEmail: string,
  ): Promise<ResourceSubmission[]> {
    const allSubmissions = await this.getResourceSubmissions();
    const normalizedEmail = contributorEmail.trim().toLowerCase();

    return allSubmissions.filter((submission) =>
      submission.contributorProfileId === contributorProfileId ||
      submission.contributorEmail.trim().toLowerCase() === normalizedEmail
    );
  }

  async getResourceSubmission(id: number): Promise<ResourceSubmission | undefined> {
    const results = await db.select().from(resourceSubmissions)
      .where(eq(resourceSubmissions.id, id));
    return results[0];
  }

  async createResourceSubmission(submission: InsertResourceSubmission): Promise<ResourceSubmission> {
    const results = await db.insert(resourceSubmissions).values(submission).returning();
    return results[0];
  }

  async reviewResourceSubmission(id: number, updates: Partial<ResourceSubmission>): Promise<ResourceSubmission> {
    const results = await db.update(resourceSubmissions)
      .set(updates)
      .where(eq(resourceSubmissions.id, id))
      .returning();
    return results[0];
  }

  async getCurriculumCollections(status?: string): Promise<CurriculumCollection[]> {
    if (status) {
      return await db.select().from(curriculumCollections)
        .where(eq(curriculumCollections.status, status));
    }

    return await db.select().from(curriculumCollections);
  }

  async getCurriculumCollectionsForContributor(contributorProfileId: number): Promise<CurriculumCollection[]> {
    return await db.select().from(curriculumCollections)
      .where(eq(curriculumCollections.contributorProfileId, contributorProfileId));
  }

  async getCurriculumCollection(id: number): Promise<CurriculumCollection | undefined> {
    const results = await db.select().from(curriculumCollections)
      .where(eq(curriculumCollections.id, id));
    return results[0];
  }

  async createCurriculumCollection(collection: InsertCurriculumCollection): Promise<CurriculumCollection> {
    const results = await db.insert(curriculumCollections).values(collection).returning();
    return results[0];
  }

  async updateCurriculumCollection(
    id: number,
    updates: Partial<CurriculumCollection>,
  ): Promise<CurriculumCollection> {
    const results = await db.update(curriculumCollections)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(curriculumCollections.id, id))
      .returning();
    return results[0];
  }

  async getCurriculumCollectionItems(collectionId: number): Promise<CurriculumCollectionItem[]> {
    const items = await db.select().from(curriculumCollectionItems)
      .where(eq(curriculumCollectionItems.collectionId, collectionId));
    return items.sort((left, right) => left.order - right.order);
  }

  async replaceCurriculumCollectionItems(
    collectionId: number,
    items: InsertCurriculumCollectionItem[],
  ): Promise<CurriculumCollectionItem[]> {
    await db.delete(curriculumCollectionItems)
      .where(eq(curriculumCollectionItems.collectionId, collectionId));

    if (items.length === 0) {
      return [];
    }

    const results = await db.insert(curriculumCollectionItems)
      .values(items)
      .returning();
    return results.sort((left, right) => left.order - right.order);
  }

  async getUserCurriculumCollectionProgress(
    userId: number,
    collectionId: number,
  ): Promise<UserCurriculumCollectionProgress | undefined> {
    const results = await db.select().from(userCurriculumCollectionProgress)
      .where(and(
        eq(userCurriculumCollectionProgress.userId, userId),
        eq(userCurriculumCollectionProgress.collectionId, collectionId),
      ));
    return results[0];
  }

  async getAllUserCurriculumCollectionProgress(userId: number): Promise<UserCurriculumCollectionProgress[]> {
    return await db.select().from(userCurriculumCollectionProgress)
      .where(eq(userCurriculumCollectionProgress.userId, userId));
  }

  async upsertUserCurriculumCollectionProgress(
    userId: number,
    collectionId: number,
    updates: Partial<UserCurriculumCollectionProgress>,
  ): Promise<UserCurriculumCollectionProgress> {
    const existing = await this.getUserCurriculumCollectionProgress(userId, collectionId);

    if (existing) {
      const results = await db.update(userCurriculumCollectionProgress)
        .set({ ...updates, updatedAt: new Date() })
        .where(and(
          eq(userCurriculumCollectionProgress.userId, userId),
          eq(userCurriculumCollectionProgress.collectionId, collectionId),
        ))
        .returning();
      return results[0];
    }

    const newProgress: InsertUserCurriculumCollectionProgress = {
      userId,
      collectionId,
      status: updates.status || "in_progress",
      currentItemId: updates.currentItemId,
      completedItemIds: updates.completedItemIds || [],
      percentComplete: updates.percentComplete || 0,
      startedAt: updates.startedAt || new Date(),
      completedAt: updates.completedAt,
      updatedAt: new Date(),
    };

    const results = await db.insert(userCurriculumCollectionProgress)
      .values(newProgress)
      .returning();
    return results[0];
  }

  async getAllContributorProfiles(): Promise<ContributorProfile[]> {
    return await db.select().from(contributorProfiles);
  }

  async getContributorProfile(id: number): Promise<ContributorProfile | undefined> {
    const results = await db.select().from(contributorProfiles)
      .where(eq(contributorProfiles.id, id));
    return results[0];
  }

  async getContributorProfileByUserId(userId: number): Promise<ContributorProfile | undefined> {
    const results = await db.select().from(contributorProfiles)
      .where(eq(contributorProfiles.userId, userId));
    return results[0];
  }

  async upsertContributorProfile(profile: InsertContributorProfile): Promise<ContributorProfile> {
    const existing = await this.getContributorProfileByUserId(profile.userId);

    if (existing) {
      const results = await db.update(contributorProfiles)
        .set({ ...profile, updatedAt: new Date() })
        .where(eq(contributorProfiles.userId, profile.userId))
        .returning();
      return results[0];
    }

    const results = await db.insert(contributorProfiles)
      .values(profile)
      .returning();
    return results[0];
  }

  async getEducatorOfferings(status?: string): Promise<EducatorOffering[]> {
    if (status) {
      return await db.select().from(educatorOfferings).where(eq(educatorOfferings.status, status));
    }

    return await db.select().from(educatorOfferings);
  }

  async getEducatorOffering(id: number): Promise<EducatorOffering | undefined> {
    const results = await db.select().from(educatorOfferings)
      .where(eq(educatorOfferings.id, id));
    return results[0];
  }

  async getEducatorOfferingsForContributor(contributorProfileId: number): Promise<EducatorOffering[]> {
    return await db.select().from(educatorOfferings)
      .where(eq(educatorOfferings.contributorProfileId, contributorProfileId));
  }

  async createEducatorOffering(offering: InsertEducatorOffering): Promise<EducatorOffering> {
    const results = await db.insert(educatorOfferings).values(offering).returning();
    return results[0];
  }

  async updateEducatorOffering(id: number, updates: Partial<EducatorOffering>): Promise<EducatorOffering> {
    const results = await db.update(educatorOfferings)
      .set(updates)
      .where(eq(educatorOfferings.id, id))
      .returning();
    return results[0];
  }

  async getOfferingInterests(): Promise<OfferingInterest[]> {
    return await db.select().from(offeringInterests);
  }

  async getOfferingInterestsForContributor(contributorProfileId: number): Promise<OfferingInterest[]> {
    return await db.select().from(offeringInterests)
      .where(eq(offeringInterests.contributorProfileId, contributorProfileId));
  }

  async getOfferingInterestsForOffering(educatorOfferingId: number): Promise<OfferingInterest[]> {
    return await db.select().from(offeringInterests)
      .where(eq(offeringInterests.educatorOfferingId, educatorOfferingId));
  }

  async createOfferingInterest(interest: InsertOfferingInterest): Promise<OfferingInterest> {
    const results = await db.insert(offeringInterests).values(interest).returning();
    return results[0];
  }

  async updateOfferingInterest(id: number, updates: Partial<OfferingInterest>): Promise<OfferingInterest> {
    const results = await db.update(offeringInterests)
      .set(updates)
      .where(eq(offeringInterests.id, id))
      .returning();
    return results[0];
  }

  async getFeedbackSubmissions(): Promise<FeedbackSubmission[]> {
    return await db.select().from(feedbackSubmissions);
  }

  async createFeedbackSubmission(submission: InsertFeedbackSubmission): Promise<FeedbackSubmission> {
    const results = await db.insert(feedbackSubmissions).values(submission).returning();
    return results[0];
  }

  async updateFeedbackSubmission(id: number, updates: Partial<FeedbackSubmission>): Promise<FeedbackSubmission> {
    const results = await db.update(feedbackSubmissions)
      .set(updates)
      .where(eq(feedbackSubmissions.id, id))
      .returning();
    return results[0];
  }

  async getContentReports(status?: string): Promise<ContentReport[]> {
    if (status) {
      return await db.select().from(contentReports).where(eq(contentReports.status, status));
    }

    return await db.select().from(contentReports);
  }

  async createContentReport(report: InsertContentReport): Promise<ContentReport> {
    const results = await db.insert(contentReports).values(report).returning();
    return results[0];
  }

  async updateContentReport(id: number, updates: Partial<ContentReport>): Promise<ContentReport> {
    const results = await db.update(contentReports)
      .set(updates)
      .where(eq(contentReports.id, id))
      .returning();
    return results[0];
  }

  async getAllCredentialDefinitions(): Promise<CredentialDefinition[]> {
    return await db.select().from(credentialDefinitions).where(eq(credentialDefinitions.active, true));
  }

  async getCredentialDefinition(id: number): Promise<CredentialDefinition | undefined> {
    const results = await db.select().from(credentialDefinitions).where(eq(credentialDefinitions.id, id));
    return results[0];
  }

  async getCredentialDefinitionBySlug(slug: string): Promise<CredentialDefinition | undefined> {
    const results = await db.select().from(credentialDefinitions).where(eq(credentialDefinitions.slug, slug));
    return results[0];
  }

  async createCredentialDefinition(credential: InsertCredentialDefinition): Promise<CredentialDefinition> {
    const results = await db.insert(credentialDefinitions).values(credential).returning();
    return results[0];
  }

  async getCredentialRequirements(credentialId: number): Promise<CredentialRequirement[]> {
    return await db.select().from(credentialRequirements)
      .where(eq(credentialRequirements.credentialId, credentialId))
      .orderBy(credentialRequirements.order);
  }

  async createCredentialRequirement(requirement: InsertCredentialRequirement): Promise<CredentialRequirement> {
    const results = await db.insert(credentialRequirements).values(requirement).returning();
    return results[0];
  }

  async getIssuedCredentialsForUser(userId: number): Promise<IssuedCredential[]> {
    return await db.select().from(issuedCredentials).where(eq(issuedCredentials.userId, userId));
  }

  async getIssuedCredentialByShareCode(shareCode: string): Promise<IssuedCredential | undefined> {
    const results = await db.select().from(issuedCredentials).where(eq(issuedCredentials.shareCode, shareCode));
    return results.length > 0 ? results[0] : undefined;
  }

  async issueCredential(credential: InsertIssuedCredential): Promise<IssuedCredential> {
    const results = await db.insert(issuedCredentials).values(credential).returning();
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
  
  // Career path operations
  async getAllCareerPaths(): Promise<CareerPath[]> {
    return await db.select().from(careerPaths);
  }
  
  async getCareerPath(id: number): Promise<CareerPath | undefined> {
    const results = await db.select().from(careerPaths).where(eq(careerPaths.id, id));
    return results.length > 0 ? results[0] : undefined;
  }
  
  async createCareerPath(careerPath: InsertCareerPath): Promise<CareerPath> {
    const results = await db.insert(careerPaths).values(careerPath).returning();
    return results[0];
  }
  
  // Goal operations
  async getUserGoals(userId: number): Promise<Goal[]> {
    return await db.select().from(goals).where(eq(goals.userId, userId));
  }
  
  async createGoal(goal: InsertGoal): Promise<Goal> {
    const results = await db.insert(goals).values(goal).returning();
    return results[0];
  }
  
  async updateGoal(id: number, goal: Partial<Goal>): Promise<Goal> {
    const results = await db
      .update(goals)
      .set(goal)
      .where(eq(goals.id, id))
      .returning();
    return results[0];
  }
  
  async deleteGoal(id: number): Promise<void> {
    await db.delete(goals).where(eq(goals.id, id));
  }
  
  // Vision board operations
  async getUserVisionBoardItems(userId: number): Promise<VisionBoardItem[]> {
    return await db.select().from(visionBoardItems).where(eq(visionBoardItems.userId, userId));
  }
  
  async createVisionBoardItem(item: InsertVisionBoardItem): Promise<VisionBoardItem> {
    const results = await db.insert(visionBoardItems).values(item).returning();
    return results[0];
  }
  
  async updateVisionBoardItem(id: number, item: Partial<VisionBoardItem>): Promise<VisionBoardItem> {
    const results = await db
      .update(visionBoardItems)
      .set(item)
      .where(eq(visionBoardItems.id, id))
      .returning();
    return results[0];
  }
  
  async deleteVisionBoardItem(id: number): Promise<void> {
    await db.delete(visionBoardItems).where(eq(visionBoardItems.id, id));
  }
  
  // Subject operations
  async getAllSubjects(): Promise<Subject[]> {
    return await db.select().from(subjects).orderBy(subjects.order);
  }
  
  async getFeaturedSubjects(): Promise<Subject[]> {
    return await db.select().from(subjects).where(eq(subjects.featured, true)).orderBy(subjects.order);
  }
  
  async getSubject(id: number): Promise<Subject | undefined> {
    const results = await db.select().from(subjects).where(eq(subjects.id, id));
    return results.length > 0 ? results[0] : undefined;
  }
  
  async getSubjectBySlug(slug: string): Promise<Subject | undefined> {
    const results = await db.select().from(subjects).where(eq(subjects.slug, slug));
    return results.length > 0 ? results[0] : undefined;
  }
  
  async createSubject(subject: InsertSubject): Promise<Subject> {
    const results = await db.insert(subjects).values(subject).returning();
    return results[0];
  }
  
  async updateSubject(id: number, subject: Partial<Subject>): Promise<Subject> {
    const results = await db
      .update(subjects)
      .set(subject)
      .where(eq(subjects.id, id))
      .returning();
    return results[0];
  }
  
  // Lesson operations
  async getLessonsBySubject(subjectId: number): Promise<Lesson[]> {
    return await db.select().from(lessons)
      .where(eq(lessons.subjectId, subjectId))
      .orderBy(lessons.order);
  }
  
  async getLesson(id: number): Promise<Lesson | undefined> {
    const results = await db.select().from(lessons).where(eq(lessons.id, id));
    return results.length > 0 ? results[0] : undefined;
  }
  
  async getLessonBySlug(subjectSlug: string, lessonSlug: string): Promise<Lesson | undefined> {
    const subject = await this.getSubjectBySlug(subjectSlug);
    if (!subject) return undefined;
    
    const results = await db.select().from(lessons)
      .where(and(
        eq(lessons.subjectId, subject.id),
        eq(lessons.slug, lessonSlug)
      ));
    return results.length > 0 ? results[0] : undefined;
  }
  
  async createLesson(lesson: InsertLesson): Promise<Lesson> {
    const results = await db.insert(lessons).values(lesson).returning();
    return results[0];
  }
  
  async updateLesson(id: number, lesson: Partial<Lesson>): Promise<Lesson> {
    const results = await db
      .update(lessons)
      .set(lesson)
      .where(eq(lessons.id, id))
      .returning();
    return results[0];
  }

  async getLessonResources(lessonId: number): Promise<LessonResource[]> {
    const items = await db.select().from(lessonResources)
      .where(eq(lessonResources.lessonId, lessonId));
    return items.sort((left, right) => left.order - right.order);
  }

  async createLessonResource(resource: InsertLessonResource): Promise<LessonResource> {
    const results = await db.insert(lessonResources).values(resource).returning();
    return results[0];
  }
  
  // User Subject Progress operations
  async getUserSubjectProgress(userId: number, subjectId: number): Promise<UserSubjectProgress | undefined> {
    const results = await db.select().from(userSubjectProgress)
      .where(and(
        eq(userSubjectProgress.userId, userId),
        eq(userSubjectProgress.subjectId, subjectId)
      ));
    return results.length > 0 ? results[0] : undefined;
  }
  
  async getAllUserSubjectProgress(userId: number): Promise<UserSubjectProgress[]> {
    return await db.select().from(userSubjectProgress)
      .where(eq(userSubjectProgress.userId, userId));
  }
  
  async createUserSubjectProgress(progress: InsertUserSubjectProgress): Promise<UserSubjectProgress> {
    const results = await db.insert(userSubjectProgress).values(progress).returning();
    return results[0];
  }
  
  async updateUserSubjectProgress(userId: number, subjectId: number, progress: Partial<UserSubjectProgress>): Promise<UserSubjectProgress> {
    const existing = await this.getUserSubjectProgress(userId, subjectId);
    
    if (existing) {
      const results = await db
        .update(userSubjectProgress)
        .set(progress)
        .where(and(
          eq(userSubjectProgress.userId, userId),
          eq(userSubjectProgress.subjectId, subjectId)
        ))
        .returning();
      return results[0];
    } else {
      // Create new progress if it doesn't exist
      const newProgress: InsertUserSubjectProgress = {
        userId,
        subjectId,
        status: progress.status || 'not_started',
        currentLessonId: progress.currentLessonId,
        startedAt: progress.startedAt || new Date(),
        completedAt: progress.completedAt,
        percentComplete: progress.percentComplete || 0,
      };
      return await this.createUserSubjectProgress(newProgress);
    }
  }
  
  // User Lesson Progress operations
  async getUserLessonProgress(userId: number, lessonId: number): Promise<UserLessonProgress | undefined> {
    const results = await db.select().from(userLessonProgress)
      .where(and(
        eq(userLessonProgress.userId, userId),
        eq(userLessonProgress.lessonId, lessonId)
      ));
    return results.length > 0 ? results[0] : undefined;
  }

  async getAllUserLessonProgress(userId: number): Promise<UserLessonProgress[]> {
    return await db.select().from(userLessonProgress)
      .where(eq(userLessonProgress.userId, userId));
  }
  
  async getAllUserLessonProgressBySubject(userId: number, subjectId: number): Promise<UserLessonProgress[]> {
    const subjectLessons = await this.getLessonsBySubject(subjectId);
    const lessonIds = subjectLessons.map(lesson => lesson.id);
    
    // If no lessons found, return empty array
    if (lessonIds.length === 0) return [];
    
    return await db.select().from(userLessonProgress)
      .where(and(
        eq(userLessonProgress.userId, userId),
        inArray(userLessonProgress.lessonId, lessonIds)
      ));
  }
  
  async createUserLessonProgress(progress: InsertUserLessonProgress): Promise<UserLessonProgress> {
    const results = await db.insert(userLessonProgress).values(progress).returning();
    return results[0];
  }
  
  async updateUserLessonProgress(userId: number, lessonId: number, progress: Partial<UserLessonProgress>): Promise<UserLessonProgress> {
    const existing = await this.getUserLessonProgress(userId, lessonId);
    
    if (existing) {
      const results = await db
        .update(userLessonProgress)
        .set(progress)
        .where(and(
          eq(userLessonProgress.userId, userId),
          eq(userLessonProgress.lessonId, lessonId)
        ))
        .returning();
      return results[0];
    } else {
      // Create new progress if it doesn't exist
      const newProgress: InsertUserLessonProgress = {
        userId,
        lessonId,
        status: progress.status || 'not_started',
        ageGroup: progress.ageGroup || '13-15',
        startedAt: progress.startedAt,
        completedAt: progress.completedAt,
        answers: progress.answers as InsertUserLessonProgress["answers"],
        notes: progress.notes,
      };
      return await this.createUserLessonProgress(newProgress);
    }
  }
  
  // Resource Center operations
  async getAllResources(): Promise<Resource[]> {
    return await db.select().from(resources);
  }

  async getResourcesByCategory(category: string): Promise<Resource[]> {
    return await db.select().from(resources).where(eq(resources.category, category));
  }

  async getResourcesByAudience(audience: string): Promise<Resource[]> {
    // We need a different approach for array fields
    // Since audience is an array, we need to find resources where the audience array includes the requested audience
    const allResources = await this.getAllResources();
    return allResources.filter(resource => resource.audience?.includes(audience));
  }

  async getResourcesByType(type: string): Promise<Resource[]> {
    return await db.select().from(resources).where(eq(resources.resourceType, type));
  }

  async getFeaturedResources(): Promise<Resource[]> {
    return await db.select().from(resources).where(eq(resources.featured, true));
  }

  async getResource(id: number): Promise<Resource | undefined> {
    const results = await db.select().from(resources).where(eq(resources.id, id));
    return results.length > 0 ? results[0] : undefined;
  }

  async createResource(resource: InsertResource): Promise<Resource> {
    const results = await db.insert(resources).values(resource).returning();
    return results[0];
  }

  async updateResource(id: number, resource: Partial<Resource>): Promise<Resource> {
    const results = await db
      .update(resources)
      .set(resource)
      .where(eq(resources.id, id))
      .returning();
    return results[0];
  }

  async incrementDownloadCount(id: number): Promise<Resource> {
    const resource = await this.getResource(id);
    if (!resource) {
      throw new Error(`Resource with id ${id} not found`);
    }
    
    return await this.updateResource(id, {
      downloadCount: (resource.downloadCount || 0) + 1
    });
  }
  
  // User operations - Gamification
  async updateUserXP(userId: number, xpToAdd: number): Promise<User> {
    const user = await this.getUser(userId);
    if (!user) throw new Error(`User with id ${userId} not found`);
    
    // Add XP and check if we need to level up
    const currentXP = user.xp || 0;
    const newXP = currentXP + xpToAdd;
    const currentLevel = user.level || 1;
    
    // Simple leveling formula: level = Math.floor(1 + Math.sqrt(totalXP / 100))
    // This means approximately:
    // Level 1: 0-99 XP
    // Level 2: 100-399 XP
    // Level 3: 400-899 XP
    // Level 4: 900-1599 XP
    // and so on
    const newLevel = Math.floor(1 + Math.sqrt(newXP / 100));
    const leveledUp = newLevel > currentLevel;
    
    // Generate level title based on level
    let levelTitle = user.levelTitle;
    if (leveledUp) {
      // Simple level titles
      const titles = [
        "Novice Explorer", // Level 1
        "Curious Apprentice", // Level 2
        "Knowledge Seeker", // Level 3
        "Wisdom Gatherer", // Level 4
        "Dedicated Scholar", // Level 5
        "Skillful Practitioner", // Level 6
        "Accomplished Learner", // Level 7
        "Academic Virtuoso", // Level 8
        "Enlightened Expert", // Level 9
        "Master of Knowledge" // Level 10+
      ];
      levelTitle = titles[Math.min(newLevel - 1, titles.length - 1)];
    }
    
    // Update user with new XP and possibly new level
    const results = await db
      .update(users)
      .set({ 
        xp: newXP,
        level: newLevel,
        levelTitle: levelTitle
      })
      .where(eq(users.id, userId))
      .returning();
    
    // If user leveled up, we could create a timeline event or notification here
    if (leveledUp) {
      await this.createTimelineEvent({
        userId,
        title: `Leveled up to ${levelTitle}!`,
        date: new Date(),
        completed: true,
        category: 'achievement'
      });
    }
    
    return results[0];
  }
  
  async updateUserStreak(userId: number, streak: number): Promise<User> {
    const user = await this.getUser(userId);
    if (!user) throw new Error(`User with id ${userId} not found`);
    
    const results = await db
      .update(users)
      .set({ 
        streakCount: streak,
        lastLogin: new Date()
      })
      .where(eq(users.id, userId))
      .returning();
    
    // If the streak hits certain milestones (7, 30, 100 days), we could award badges
    const streakMilestones = [7, 30, 100];
    if (streakMilestones.includes(streak)) {
      // Award streak badge
      await this.createBadge({
        userId,
        title: `${streak}-Day Streak`,
        description: `You've maintained a learning streak for ${streak} consecutive days!`,
        icon: 'fire',
        unlocked: true,
        dateUnlocked: new Date()
      });
      
      // Create timeline event
      await this.createTimelineEvent({
        userId,
        title: `${streak}-Day Streak Achievement`,
        date: new Date(),
        completed: true,
        category: 'streak'
      });
    }
    
    return results[0];
  }
  
  async updateUserLevel(userId: number, level: number, title?: string): Promise<User> {
    const user = await this.getUser(userId);
    if (!user) throw new Error(`User with id ${userId} not found`);
    
    const updateData: Partial<User> = { level };
    if (title) {
      updateData.levelTitle = title;
    }
    
    const results = await db
      .update(users)
      .set(updateData)
      .where(eq(users.id, userId))
      .returning();
    
    return results[0];
  }
  
  // Daily Challenge operations
  async getAllDailyChallenges(): Promise<DailyChallenge[]> {
    return await db.select().from(dailyChallenges);
  }
  
  async getActiveDailyChallenges(): Promise<DailyChallenge[]> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Format date to match the date column format in the database
    const formattedDate = today.toISOString().split('T')[0];
    
    return await db.select().from(dailyChallenges)
      .where(eq(dailyChallenges.activeDate, formattedDate));
  }
  
  async getDailyChallenge(id: number): Promise<DailyChallenge | undefined> {
    const results = await db.select().from(dailyChallenges).where(eq(dailyChallenges.id, id));
    return results.length > 0 ? results[0] : undefined;
  }
  
  async createDailyChallenge(challenge: InsertDailyChallenge): Promise<DailyChallenge> {
    const results = await db.insert(dailyChallenges).values(challenge).returning();
    return results[0];
  }
  
  async updateDailyChallenge(id: number, challenge: Partial<DailyChallenge>): Promise<DailyChallenge> {
    const results = await db
      .update(dailyChallenges)
      .set(challenge)
      .where(eq(dailyChallenges.id, id))
      .returning();
    return results[0];
  }
  
  // User Challenge operations
  async getUserCompletedChallenges(userId: number): Promise<UserChallenge[]> {
    return await db.select().from(userChallenges).where(eq(userChallenges.userId, userId));
  }
  
  async getUserTodayCompletedChallenges(userId: number): Promise<UserChallenge[]> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    return await db.select().from(userChallenges)
      .where(and(
        eq(userChallenges.userId, userId),
        sql`${userChallenges.completedAt} >= ${today.toISOString()}`,
        sql`${userChallenges.completedAt} < ${tomorrow.toISOString()}`
      ));
  }
  
  async completeChallenge(userChallenge: InsertUserChallenge): Promise<UserChallenge> {
    const results = await db.insert(userChallenges).values(userChallenge).returning();
    
    // Also award XP to the user
    await this.updateUserXP(userChallenge.userId, userChallenge.xpEarned);
    
    // Create a timeline event for completing the challenge
    const challenge = await this.getDailyChallenge(userChallenge.challengeId);
    if (challenge) {
      await this.createTimelineEvent({
        userId: userChallenge.userId,
        title: `Completed challenge: ${challenge.title}`,
        date: new Date(),
        completed: true,
        category: 'challenge'
      });
    }
    
    return results[0];
  }
  
  // Buddy methods moved to the end of the class

  // Initialize with sample data
  async initializeData() {
    // First check if there's already data in the database
    const existingCategories = await this.getAllCategories();
    if (existingCategories.length > 0) {
      // Check if we need to initialize progress data
      await this.initializeProgressData();
      // Check if we need to initialize subject data
      await this.initializeSubjectsData();
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
    if (existingBadges.length > 0) {
      // Initialize career paths if none exist
      const existingCareerPaths = await this.getAllCareerPaths();
      if (existingCareerPaths.length === 0) {
        await this.initializeCareerPathsData();
      }
      return; // Progress data already exists
    }
    
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
    
    // Initialize career paths data
    await this.initializeCareerPathsData();
  }
  
  // Initialize subject data with lessons for Phase 19
  async initializeSubjectsData() {
    // Check if subjects already exist
    try {
      const parseJsonSeedField = (value: unknown) => {
        if (typeof value !== "string") return value;
        try {
          return JSON.parse(value);
        } catch {
          return value;
        }
      };

      const normalizeLessonSeed = (lesson: any): InsertLesson => ({
        subjectId: lesson.subjectId,
        title: lesson.title,
        subtitle: lesson.subtitle,
        slug: lesson.slug,
        order: lesson.order,
        learningObjective: lesson.learningObjective || `Understand and apply ${lesson.title.toLowerCase()} in real-world situations.`,
        warmUpQuestion: lesson.warmUpQuestion || `Where have you seen ${lesson.title.toLowerCase()} show up in everyday life?`,
        lessonExplanation: lesson.lessonExplanation || lesson.content || "",
        scenarioTitle: lesson.scenarioTitle,
        scenarioContent: lesson.scenarioContent,
        activityType: lesson.activityType,
        activityContent: parseJsonSeedField(lesson.activityContent),
        reflectionPrompt: lesson.reflectionPrompt || "What is one specific way you can use this lesson in your own life?",
        estimatedMinutes: lesson.estimatedMinutes,
        xpReward: lesson.xpReward || 50,
        badgeId: lesson.badgeId,
        ageGroupContent: parseJsonSeedField(lesson.ageGroupContent),
      });

      const seedBetaPathway = async ({
        subject,
        lessons: lessonSeeds,
        credential,
      }: {
        subject: InsertSubject;
        lessons: Omit<InsertLesson, "subjectId">[];
        credential: {
          title: string;
          slug: string;
          description: string;
          criteriaSummary: string;
        };
      }) => {
        let subjectRecord = await this.getSubjectBySlug(subject.slug);
        if (!subjectRecord) {
          subjectRecord = await this.createSubject(subject);
        }

        const existingLessons = await this.getLessonsBySubject(subjectRecord.id);
        const createdOrExistingLessons: Lesson[] = [];
        for (const lesson of lessonSeeds) {
          const existingLesson = existingLessons.find((item) => item.slug === lesson.slug);
          if (existingLesson) {
            createdOrExistingLessons.push(existingLesson);
          } else {
            createdOrExistingLessons.push(await this.createLesson(normalizeLessonSeed({
              ...lesson,
              subjectId: subjectRecord.id,
            })));
          }
        }

        const existingCredential = await this.getCredentialDefinitionBySlug(credential.slug);
        if (!existingCredential) {
          const credentialRecord = await this.createCredentialDefinition({
            ...credential,
            subjectId: subjectRecord.id,
            disclaimer: "This is a Real World Academy completion credential and does not represent accredited school credit.",
            active: true,
            createdAt: new Date(),
            updatedAt: new Date(),
          });

          for (let index = 0; index < createdOrExistingLessons.length; index++) {
            const lesson = createdOrExistingLessons[index];
            await this.createCredentialRequirement({
              credentialId: credentialRecord.id,
              requirementType: "lesson",
              title: `Complete lesson: ${lesson.title}`,
              description: `Student must complete the ${lesson.title} lesson.`,
              targetId: lesson.id,
              required: true,
              order: index + 1,
            });
          }
        }
      };

      const seedRoadmapBetaPathways = async () => {
        await seedBetaPathway({
          subject: {
            title: "Career Exploration",
            description: "Discover strengths, research career options, practice workplace communication, and build a clear next-step plan.",
            slug: "career-exploration",
            iconName: "briefcase",
            color: "indigo",
            featured: true,
            order: 4,
            category: "future",
            ageGroups: ["13-15", "16-18"],
            summary: "You've explored career options, practiced professional communication, and built a practical next-step plan.",
            nextSubjectIds: [],
          },
          lessons: [
            {
              title: "Strengths and Interests",
              subtitle: "Notice the patterns in what you enjoy and do well",
              slug: "strengths-and-interests",
              order: 1,
              learningObjective: "Identify personal strengths, interests, and values that can guide career exploration.",
              warmUpQuestion: "What is something people often ask you for help with?",
              lessonExplanation: "Career exploration starts by noticing patterns. Your strengths are things you tend to do well, your interests are things that pull your attention, and your values are what you want your work to support. A good career direction often sits where these three overlap.",
              scenarioTitle: "Choosing a Direction",
              scenarioContent: "Jordan likes helping younger students, enjoys organizing events, and cares about community impact. Jordan is trying to choose between education, nonprofit work, and business.",
              activityType: "reflection",
              activityContent: { prompts: ["List three strengths.", "List three interests.", "Name two values you want your work to support."] },
              reflectionPrompt: "Which strength or interest could become part of a future career path?",
              estimatedMinutes: 20,
              xpReward: 50,
              ageGroupContent: { "13-15": { focus: "school activities and hobbies" }, "16-18": { focus: "work, volunteering, and postsecondary options" } },
            },
            {
              title: "Career Research",
              subtitle: "Learn how to compare real jobs",
              slug: "career-research",
              order: 2,
              learningObjective: "Research a career using reliable sources and compare pay, training, tasks, and lifestyle fit.",
              warmUpQuestion: "What is one job you are curious about but do not fully understand?",
              lessonExplanation: "A career title only tells part of the story. Good research looks at daily tasks, training requirements, work environment, pay range, growth outlook, and whether the work fits your values.",
              scenarioTitle: "Beyond the Job Title",
              scenarioContent: "Sam thinks graphic design sounds fun, but needs to learn what designers actually do each day, what skills are required, and how people get started.",
              activityType: "research-profile",
              activityContent: { fields: ["career title", "daily tasks", "required skills", "training path", "why it fits or does not fit"] },
              reflectionPrompt: "What did your research reveal that surprised you?",
              estimatedMinutes: 30,
              xpReward: 60,
              ageGroupContent: { "13-15": { sources: "family interviews and career websites" }, "16-18": { sources: "career databases, job postings, and training programs" } },
            },
            {
              title: "Resume Basics",
              subtitle: "Show what you can do",
              slug: "resume-basics",
              order: 3,
              learningObjective: "Create a simple resume section that highlights skills, experience, projects, or volunteer work.",
              warmUpQuestion: "What is one project, chore, club, or responsibility you could proudly explain to someone?",
              lessonExplanation: "A beginner resume is not about having a long work history. It is about clearly showing responsibility, skills, projects, learning, and character. Strong bullets start with action words and describe what you did.",
              scenarioTitle: "First Opportunity",
              scenarioContent: "A local business is hiring weekend help. Taylor has never had a formal job but has babysitting experience, a school project, and volunteer hours.",
              activityType: "resume-draft",
              activityContent: { sections: ["summary", "skills", "experience or projects", "education"] },
              reflectionPrompt: "Which experience from your life shows responsibility or initiative?",
              estimatedMinutes: 35,
              xpReward: 60,
              ageGroupContent: { "13-15": { resumeType: "project and responsibility based" }, "16-18": { resumeType: "job, volunteer, and project based" } },
            },
            {
              title: "Interview Practice",
              subtitle: "Answer with examples",
              slug: "interview-practice",
              order: 4,
              learningObjective: "Practice answering interview questions with specific examples and a confident structure.",
              warmUpQuestion: "What is one time you solved a problem or helped someone?",
              lessonExplanation: "Strong interview answers are specific. A simple structure is situation, action, result: explain what was happening, what you did, and what changed because of it.",
              scenarioTitle: "Tell Me About Yourself",
              scenarioContent: "Riley has an interview for a summer program and wants to sound prepared without memorizing every word.",
              activityType: "practice-script",
              activityContent: { questions: ["Tell me about yourself.", "Describe a challenge you handled.", "Why are you interested in this opportunity?"] },
              reflectionPrompt: "Which example from your life would make a strong interview answer?",
              estimatedMinutes: 25,
              xpReward: 50,
              ageGroupContent: { "13-15": { interviewType: "club, volunteer, and school opportunities" }, "16-18": { interviewType: "job, internship, and program opportunities" } },
            },
            {
              title: "Career Next-Step Plan",
              subtitle: "Turn research into action",
              slug: "career-next-step-plan",
              order: 5,
              learningObjective: "Create a short action plan for exploring or preparing for one career direction.",
              warmUpQuestion: "What is one small step you could take this month to learn more about a career?",
              lessonExplanation: "A career plan should be useful, not perfect. Pick one direction to explore, choose a skill to build, identify someone to learn from, and set one next action with a date.",
              scenarioTitle: "One Month From Now",
              scenarioContent: "Avery is interested in healthcare but does not know whether to explore nursing, therapy, medical technology, or administration.",
              activityType: "action-plan",
              activityContent: { steps: ["career to explore", "skill to practice", "person or source to learn from", "next action", "deadline"] },
              reflectionPrompt: "What is your next step, and when will you do it?",
              estimatedMinutes: 30,
              xpReward: 70,
              ageGroupContent: { "13-15": { timeline: "one month exploration plan" }, "16-18": { timeline: "three month preparation plan" } },
            },
          ],
          credential: {
            title: "Career Explorer Credential",
            slug: "career-explorer",
            description: "Awarded for completing the Career Exploration pathway and creating a practical career next-step plan.",
            criteriaSummary: "Complete Career Exploration lessons and save a career profile or next-step plan.",
          },
        });

        await seedBetaPathway({
          subject: {
            title: "Digital Productivity",
            description: "Build practical computer, document, spreadsheet, email, research, and digital safety habits for school, work, and life.",
            slug: "digital-productivity",
            iconName: "laptop",
            color: "cyan",
            featured: true,
            order: 5,
            category: "technology",
            ageGroups: ["9-12", "13-15", "16-18"],
            summary: "You've practiced the digital organization and communication skills needed for modern learning and work.",
            nextSubjectIds: [],
          },
          lessons: [
            {
              title: "Files and Folders",
              subtitle: "Keep digital work findable",
              slug: "files-and-folders",
              order: 1,
              learningObjective: "Organize files with clear names, folders, and backup habits.",
              warmUpQuestion: "Have you ever lost a file or forgotten where you saved something?",
              lessonExplanation: "Digital organization saves time and prevents stress. Strong file habits include clear names, logical folders, dates or versions when needed, and backups for important work.",
              scenarioTitle: "Missing Assignment",
              scenarioContent: "Mia finished a project but saved it as final-final-new.docx somewhere on the computer and cannot find it before the deadline.",
              activityType: "organization-plan",
              activityContent: { folders: ["School", "Projects", "Personal", "Archive"], namingExample: "2026-06-budget-project-v1" },
              reflectionPrompt: "What folder system would make your digital work easier to find?",
              estimatedMinutes: 20,
              xpReward: 50,
              ageGroupContent: { "9-12": { focus: "simple folders" }, "13-15": { focus: "projects and versions" }, "16-18": { focus: "school, work, and backup habits" } },
            },
            {
              title: "Document Basics",
              subtitle: "Make writing readable and polished",
              slug: "document-basics",
              order: 2,
              learningObjective: "Create a clear document using headings, spacing, lists, and proofreading.",
              warmUpQuestion: "What makes a document easy or hard to read?",
              lessonExplanation: "A polished document helps readers understand your ideas. Good formatting uses a clear title, headings, short paragraphs, consistent spacing, and careful proofreading.",
              scenarioTitle: "Instructions That Work",
              scenarioContent: "Noah wrote instructions for a science activity, but classmates are confused because everything is in one long paragraph.",
              activityType: "document-polish",
              activityContent: { checklist: ["title", "headings", "short paragraphs", "bullets or numbers", "proofread"] },
              reflectionPrompt: "What formatting choice would most improve your next document?",
              estimatedMinutes: 25,
              xpReward: 50,
              ageGroupContent: { "9-12": { focus: "titles and spacing" }, "13-15": { focus: "headings and lists" }, "16-18": { focus: "professional formatting" } },
            },
            {
              title: "Spreadsheet Basics",
              subtitle: "Use rows, columns, and formulas",
              slug: "spreadsheet-basics",
              order: 3,
              learningObjective: "Build a simple spreadsheet with labels, numbers, and a total formula.",
              warmUpQuestion: "Where could a table or spreadsheet help you keep track of something?",
              lessonExplanation: "Spreadsheets organize information in rows and columns. Labels explain what data means, formulas calculate automatically, and formatting makes patterns easier to see.",
              scenarioTitle: "Savings Tracker",
              scenarioContent: "Kai wants to track weekly income, spending, and savings for eight weeks to see if a goal is realistic.",
              activityType: "spreadsheet-plan",
              activityContent: { columns: ["week", "income", "spending", "saved", "running total"], formula: "SUM saved amounts" },
              reflectionPrompt: "What could you track in a spreadsheet for your own life?",
              estimatedMinutes: 30,
              xpReward: 60,
              ageGroupContent: { "9-12": { formula: "simple totals" }, "13-15": { formula: "totals and averages" }, "16-18": { formula: "budgets and comparisons" } },
            },
            {
              title: "Email Etiquette",
              subtitle: "Communicate clearly online",
              slug: "email-etiquette",
              order: 4,
              learningObjective: "Write a clear, respectful email with a subject, greeting, message, and closing.",
              warmUpQuestion: "What makes a message sound respectful instead of rushed?",
              lessonExplanation: "Email is still important for school, work, and formal communication. A strong email has a useful subject line, polite greeting, clear request, context, and a closing.",
              scenarioTitle: "Asking for Help",
              scenarioContent: "Leah needs to ask a mentor for advice but wants the message to sound respectful and easy to answer.",
              activityType: "email-draft",
              activityContent: { parts: ["subject", "greeting", "context", "request", "closing"] },
              reflectionPrompt: "What is one email you might need to write this year?",
              estimatedMinutes: 20,
              xpReward: 50,
              ageGroupContent: { "9-12": { focus: "polite messages" }, "13-15": { focus: "clear requests" }, "16-18": { focus: "professional tone" } },
            },
            {
              title: "Online Research and Safety",
              subtitle: "Find useful information without getting fooled",
              slug: "online-research-and-safety",
              order: 5,
              learningObjective: "Evaluate online sources for trustworthiness and practice basic digital safety.",
              warmUpQuestion: "How do you decide whether something online is true?",
              lessonExplanation: "Good online research means checking the source, date, evidence, purpose, and whether other reliable sources agree. Digital safety also means protecting personal information and slowing down before clicking suspicious links.",
              scenarioTitle: "Too Good to Be True",
              scenarioContent: "A search result claims students can earn thousands of dollars instantly with no skills. The page asks for personal information before explaining the opportunity.",
              activityType: "source-check",
              activityContent: { checks: ["author", "date", "evidence", "purpose", "personal information risk"] },
              reflectionPrompt: "What warning sign would make you leave a website or ask an adult for help?",
              estimatedMinutes: 30,
              xpReward: 70,
              ageGroupContent: { "9-12": { focus: "ask before sharing info" }, "13-15": { focus: "source checks" }, "16-18": { focus: "research quality and scams" } },
            },
          ],
          credential: {
            title: "Digital Productivity Credential",
            slug: "digital-productivity",
            description: "Awarded for completing the Digital Productivity pathway and demonstrating practical digital organization and communication skills.",
            criteriaSummary: "Complete Digital Productivity lessons and save a practical digital workflow or project reflection.",
          },
        });
      };

      const existingSubjects = await db.select().from(subjects);
      if (existingSubjects.length > 0) {
        await seedRoadmapBetaPathways();
        return;
      }
      
      console.log("Initializing subjects and lessons data...");
      
      // Create the three core subjects for Phase 19
      const financialLiteracySubject = await this.createSubject({
        title: "Money Basics",
        description: "Learn essential money management skills for real-world financial success. Understand budgeting, saving, investing, and making smart financial decisions.",
        slug: "money-basics",
        iconName: "wallet",
        color: "green",
        featured: true,
        order: 1,
        category: "money",
        ageGroups: ["9-12", "13-15", "16-18"],
        summary: "You've gained practical money skills that will serve you throughout life. You now understand needs and wants, budgeting, saving strategies, credit basics, and how to build a simple money plan.",
        nextSubjectIds: []
      });
      
      const communicationSubject = await this.createSubject({
        title: "Communication & Relationships",
        description: "Develop the skills to communicate effectively, build healthy relationships, and navigate social situations with confidence.",
        slug: "communication-relationships",
        iconName: "message-circle",
        color: "violet",
        featured: true,
        order: 2,
        category: "life",
        ageGroups: ["9-12", "13-15", "16-18"],
        summary: "You've developed essential communication skills to express yourself clearly, listen actively, resolve conflicts, and build meaningful connections with others.",
        nextSubjectIds: []
      });
      
      const realWorldMathSubject = await this.createSubject({
        title: "Real-World Math",
        description: "Apply mathematical concepts to practical, everyday situations. Learn how math is used in budgeting, decision-making, and problem-solving.",
        slug: "real-world-math",
        iconName: "calculator",
        color: "blue",
        featured: true,
        order: 3,
        category: "math",
        ageGroups: ["9-12", "13-15", "16-18"],
        summary: "You've mastered practical mathematical skills for everyday life, from calculating tips and understanding percentages to making data-driven decisions.",
        nextSubjectIds: []
      });
      
      // Create lessons for Financial Literacy
      const financialLiteracyLessons = [
        {
          subjectId: financialLiteracySubject.id,
          title: "Budgeting Basics",
          subtitle: "Creating a plan for your money",
          slug: "budgeting-basics",
          order: 1,
          content: "Budgeting is the foundation of financial health. It's simply tracking your income and expenses to understand where your money goes and make intentional decisions about spending. A good budget helps you live within your means, save for the future, and reduce financial stress. The 50/30/20 rule suggests allocating 50% of income to needs, 30% to wants, and 20% to savings and debt repayment.",
          scenarioTitle: "First Paycheck Planning",
          scenarioContent: "You just got your first part-time job that pays $800 per month. You need to cover your phone bill ($50), save for a laptop ($1000), help with family expenses ($100), and have some spending money. How would you create a balanced budget?",
          activityType: "budget-form",
          activityContent: JSON.stringify({
            incomeCategories: ["Job", "Allowance", "Other"],
            expenseCategories: ["Needs", "Wants", "Savings", "Giving"]
          }),
          estimatedMinutes: 20,
          ageGroupContent: JSON.stringify({
            "9-12": {
              scenario: "You receive $30 in allowance each month and want to save for a $60 game.",
              terminology: "simpler"
            },
            "13-15": {
              scenario: "You earn $200 monthly from babysitting and yard work, and want to save for a $400 tablet.",
              terminology: "moderate"
            },
            "16-18": {
              scenario: "You just got your first part-time job that pays $800 per month.",
              terminology: "advanced"
            }
          })
        },
        {
          subjectId: financialLiteracySubject.id,
          title: "Saving Strategies",
          subtitle: "Building your financial safety net",
          slug: "saving-strategies",
          order: 2,
          content: "Saving money is crucial for financial security and reaching your goals. An emergency fund should cover 3-6 months of expenses. Automating savings makes the process easier - 'pay yourself first' by transferring money to savings immediately when you receive income. Different savings accounts serve different purposes: emergency funds should be easily accessible, while retirement savings can be in less liquid, higher-return investments.",
          scenarioTitle: "Emergency Fund Challenge",
          scenarioContent: "You have a part-time job making $500 monthly with $300 in monthly expenses. You currently have no savings. An unexpected car repair cost your family $600 last month, causing financial strain. How would you build an emergency fund to prepare for future surprises?",
          activityType: "savings-calculator",
          activityContent: JSON.stringify({
            calculatorType: "emergency-fund",
            fields: ["monthly-income", "monthly-expenses", "savings-goal"]
          }),
          estimatedMinutes: 25,
          ageGroupContent: JSON.stringify({
            "9-12": {
              scenario: "Your bike needs repairs that cost $40, but you have no savings.",
              terminology: "simpler"
            },
            "13-15": {
              scenario: "Your phone broke and costs $200 to replace, but you have no savings.",
              terminology: "moderate"
            },
            "16-18": {
              scenario: "An unexpected car repair cost $600, causing financial strain.",
              terminology: "advanced"
            }
          })
        },
        {
          subjectId: financialLiteracySubject.id,
          title: "Understanding Credit",
          subtitle: "Using loans and credit cards wisely",
          slug: "understanding-credit",
          order: 3,
          content: "Credit is borrowed money that you promise to repay over time, usually with interest. Your credit score (ranging from 300-850) affects your ability to borrow and the interest rates you'll receive. Building good credit requires paying bills on time, keeping credit card balances low, and avoiding unnecessary debt. Credit cards offer convenience but can lead to financial problems if not used responsibly. Always pay more than the minimum payment to avoid accumulating interest.",
          scenarioTitle: "First Credit Card Decision",
          scenarioContent: "You're 18 and received a credit card offer with a $1,000 limit, 22% APR, and $39 annual fee. You work part-time making $800 monthly. You're considering using it for everyday purchases and a $600 laptop. How would you decide whether to accept this offer and how to use the card responsibly?",
          activityType: "credit-simulator",
          activityContent: JSON.stringify({
            simulatorType: "credit-card-payoff",
            defaults: {
              balance: 600,
              interestRate: 22,
              minimumPayment: 25
            }
          }),
          estimatedMinutes: 30,
          ageGroupContent: JSON.stringify({
            "9-12": {
              scenario: "Your friend lent you $20 for a game, expecting to be paid back next month.",
              terminology: "simpler"
            },
            "13-15": {
              scenario: "You borrowed $100 from your parents for concert tickets, promising to repay from your upcoming birthday money.",
              terminology: "moderate" 
            },
            "16-18": {
              scenario: "You're 18 and received a credit card offer with a $1,000 limit and 22% APR.",
              terminology: "advanced"
            }
          })
        },
        {
          subjectId: financialLiteracySubject.id,
          title: "Investing Fundamentals",
          subtitle: "Growing your money over time",
          slug: "investing-fundamentals",
          order: 4,
          content: "Investing means putting money into assets with the expectation of generating income or profit over time. While investing involves risk, historically it has provided higher returns than savings accounts over long periods. The power of compound interest means earnings generate their own earnings over time. Common investment options include stocks (ownership in companies), bonds (loans to companies or governments), mutual funds (collections of investments), and real estate. Starting early, even with small amounts, gives your investments more time to grow.",
          scenarioTitle: "First Investment Plan",
          scenarioContent: "You've saved $1,000 and want to start investing for college, which is 5 years away. You're trying to understand different investment options, the concept of risk vs. return, and how to create a simple investment plan that aligns with your goals and timeframe.",
          activityType: "compound-interest-calculator",
          activityContent: JSON.stringify({
            calculatorType: "compound-growth",
            fields: ["initial-investment", "monthly-contribution", "years", "estimated-return"],
            defaults: {
              initialInvestment: 1000,
              monthlyContribution: 50,
              years: 5,
              estimatedReturn: 7
            }
          }),
          estimatedMinutes: 35,
          ageGroupContent: JSON.stringify({
            "9-12": {
              scenario: "You have $50 saved and want to grow it for a bigger purchase in two years.",
              terminology: "simpler"
            },
            "13-15": {
              scenario: "You've saved $300 from birthdays and want to make it grow for a future car down payment.",
              terminology: "moderate"
            }, 
            "16-18": {
              scenario: "You've saved $1,000 and want to start investing for college expenses.",
              terminology: "advanced"
            }
          })
        }
      ];
      
      // Create lessons for Communication & Relationships
      const communicationLessons = [
        {
          subjectId: communicationSubject.id,
          title: "Active Listening",
          subtitle: "The foundation of effective communication",
          slug: "active-listening",
          order: 1,
          content: "Active listening means fully focusing on the speaker, understanding their message, and thoughtfully responding. It's different from passive hearing - active listening requires engagement and attention. This skill strengthens relationships by showing respect, building trust, and preventing misunderstandings. Techniques include maintaining eye contact, asking clarifying questions, and paraphrasing what you've heard to confirm understanding. Avoiding distractions and not planning your response while the other person is still speaking are essential aspects of active listening.",
          scenarioTitle: "Friend in Need",
          scenarioContent: "Your friend seems upset and finally reaches out to talk about a difficult situation at home. They start sharing something important, but you're also expecting an important text about plans later. How do you practice active listening while managing the competing demands for your attention?",
          activityType: "scenario-response",
          activityContent: JSON.stringify({
            scenarioOptions: [
              {
                text: "Check your phone quickly while they're talking to make sure you don't miss anything important",
                feedback: "This shows your phone is more important than your friend's feelings. Active listening requires giving your full attention."
              },
              {
                text: "Put your phone away, make eye contact, and focus completely on what they're saying",
                feedback: "Great choice! Giving your undivided attention shows respect and helps you truly understand what they're sharing.",
                isCorrect: true
              },
              {
                text: "Tell them you're expecting an important text so they should hurry up with their story",
                feedback: "This dismisses their feelings and rush them through something important, damaging trust in the relationship."
              }
            ]
          }),
          estimatedMinutes: 15,
          ageGroupContent: JSON.stringify({
            "9-12": {
              scenario: "Your friend is telling you about something that made them sad at school today.",
              terminology: "simpler"
            },
            "13-15": {
              scenario: "Your friend is upset about something that happened with their group of friends and wants to talk.",
              terminology: "moderate"
            },
            "16-18": {
              scenario: "Your friend seems upset and finally reaches out to talk about a difficult situation at home.",
              terminology: "advanced"
            }
          })
        },
        {
          subjectId: communicationSubject.id,
          title: "Conflict Resolution",
          subtitle: "Turning disagreements into growth opportunities",
          slug: "conflict-resolution",
          order: 2,
          content: "Conflict is a natural part of relationships, and resolving it constructively can strengthen connections. Effective conflict resolution focuses on finding mutually beneficial solutions rather than proving who is right. Key principles include addressing the issue promptly, focusing on the specific behavior (not attacking the person), using 'I' statements to express feelings, actively listening to understand the other perspective, and working together on solutions. Different conflict styles include avoiding, accommodating, competing, compromising, and collaborating - with collaboration generally producing the most sustainable results.",
          scenarioTitle: "Team Project Tension",
          scenarioContent: "You're working on an important group project with three classmates. One team member hasn't completed their portion, which is now overdue. Another member is angry and wants to report them to the teacher. The third member wants to ignore the problem and do the work themselves. As tensions rise, how would you approach this conflict?",
          activityType: "conflict-simulation",
          activityContent: JSON.stringify({
            steps: [
              {
                name: "Identify the real issue",
                options: [
                  "Missing work that affects the group grade",
                  "Laziness of one team member",
                  "Teacher's unfair group assignment"
                ],
                correctIndex: 0
              },
              {
                name: "Choose your approach",
                options: [
                  "Confront the person publicly about their failure",
                  "Have a private, non-accusatory conversation to understand what's happening",
                  "Immediately report to the teacher without discussion"
                ],
                correctIndex: 1
              },
              {
                name: "Find a solution",
                options: [
                  "Exclude them from the project completely",
                  "Do their work for them this time",
                  "Create a revised plan with clear deadlines and check-ins"
                ],
                correctIndex: 2
              }
            ]
          }),
          estimatedMinutes: 25,
          ageGroupContent: JSON.stringify({
            "9-12": {
              scenario: "Your friend took your favorite pencil without asking and now it's broken.",
              terminology: "simpler"
            },
            "13-15": {
              scenario: "You and your friend disagree about which activity to do this weekend, and you're both getting frustrated.",
              terminology: "moderate"
            },
            "16-18": {
              scenario: "You're working on an important group project and one team member hasn't completed their portion.",
              terminology: "advanced"
            }
          })
        },
        {
          subjectId: communicationSubject.id,
          title: "Digital Communication",
          subtitle: "Navigating online interactions effectively",
          slug: "digital-communication",
          order: 3,
          content: "Digital communication has transformed how we connect, but presents unique challenges. Text lacks tone and body language, leading to misinterpretations. Digital etiquette includes responding in a timely manner, being clear and concise, considering the appropriate platform for different messages, and remembering that digital communications can be permanent and shareable. Social media interactions add complexity to relationships, and it's important to think carefully about what we share and how we engage with others online. Finding balance between digital and face-to-face communication is essential for maintaining healthy relationships.",
          scenarioTitle: "Group Chat Misunderstanding",
          scenarioContent: "You're in a group chat with friends planning a weekend activity. After someone suggests an idea, you respond with 'Yeah, that sounds great...' meaning to show sarcasm because you had a bad experience with that activity before. Several people take your message as genuine enthusiasm, and now plans are moving forward. How do you handle this miscommunication?",
          activityType: "text-interpretation",
          activityContent: JSON.stringify({
            messages: [
              {
                text: "Let's go to that new climbing gym on Saturday!",
                sender: "Alex",
                emotion: "excited"
              },
              {
                text: "Yeah, that sounds great...",
                sender: "You",
                intended: "sarcastic",
                interpreted: "enthusiastic"
              },
              {
                text: "Awesome! I'll book our spots for 2pm then!",
                sender: "Sam",
                emotion: "happy"
              }
            ],
            options: [
              {
                text: "Say nothing and just go along with the plan to avoid awkwardness",
                feedback: "This avoids temporary discomfort but creates a bigger problem - you'll end up doing something you don't want to do."
              },
              {
                text: "Send a clarifying message: 'Sorry for the confusion - I was actually being sarcastic because I had a bad experience there. Can we consider other options?'",
                feedback: "Good choice! Clear communication helps prevent misunderstandings from escalating.",
                isCorrect: true
              },
              {
                text: "Respond: 'Can't believe you all thought I was serious... I HATE climbing.'",
                feedback: "This aggressive response blames others for a misunderstanding that resulted from your unclear communication."
              }
            ]
          }),
          estimatedMinutes: 20,
          ageGroupContent: JSON.stringify({
            "9-12": {
              scenario: "Your friend sends a message that makes you feel sad, but they added a smiley face emoji.",
              terminology: "simpler"
            },
            "13-15": {
              scenario: "Your comment on a friend's social media post gets misinterpreted, and now other friends are upset with you.",
              terminology: "moderate"
            },
            "16-18": {
              scenario: "Your sarcastic message in a group chat is taken as genuine enthusiasm, and now plans are moving forward that you don't actually want.",
              terminology: "advanced"
            }
          })
        },
        {
          subjectId: communicationSubject.id,
          title: "Setting Healthy Boundaries",
          subtitle: "Balancing your needs with relationships",
          slug: "healthy-boundaries",
          order: 4,
          content: "Boundaries are guidelines that define what behaviors you find acceptable and how you wish to be treated. Healthy boundaries protect your wellbeing while maintaining positive relationships. Different relationships may have different boundaries - what's appropriate with close friends differs from work relationships. Setting boundaries involves clearly communicating your limits, being consistent in enforcing them, and respecting others' boundaries. Signs of poor boundaries include feeling resentful, overwhelmed, or taken advantage of. While initially uncomfortable, establishing healthy boundaries ultimately strengthens relationships by creating mutual respect and understanding.",
          scenarioTitle: "Friend Overload",
          scenarioContent: "Your close friend is going through a difficult time and has been texting you constantly throughout the day and night, including during school and late hours. You want to be supportive, but it's affecting your sleep, schoolwork, and other relationships. How do you maintain the friendship while setting healthy boundaries?",
          activityType: "boundary-builder",
          activityContent: JSON.stringify({
            scenario: "Friend needing excessive support",
            steps: [
              {
                step: "Identify your feelings",
                options: ["Annoyed", "Overwhelmed", "Concerned", "Resentful"],
                reflection: "Understanding your feelings helps clarify which boundaries are being crossed."
              },
              {
                step: "Clarify your boundary",
                input: true,
                example: "I need uninterrupted time for school and sleep to maintain my well-being",
                tips: ["Be specific", "Focus on your needs", "Avoid blaming language"]
              },
              {
                step: "Communicate your boundary",
                options: [
                  "I care about you, but I can't respond 24/7. Let's set specific times to talk so I can give you my full attention while still managing school and sleep.",
                  "You're texting me too much. Please stop.",
                  "Sorry, I'll be busy indefinitely."
                ],
                correctIndex: 0,
                feedback: "This approach shows care while clearly stating your needs and offering a solution."
              }
            ]
          }),
          estimatedMinutes: 30,
          ageGroupContent: JSON.stringify({
            "9-12": {
              scenario: "Your friend always wants to play the same game at recess, but you'd like to try other activities sometimes.",
              terminology: "simpler"
            },
            "13-15": {
              scenario: "Your friend gets upset when you spend time with other people and demands to know who you're with constantly.",
              terminology: "moderate"
            },
            "16-18": {
              scenario: "Your close friend is going through a difficult time and has been texting constantly throughout the day and night.",
              terminology: "advanced"
            }
          })
        }
      ];
      
      // Create lessons for Real-World Math
      const realWorldMathLessons = [
        {
          subjectId: realWorldMathSubject.id,
          title: "Percentage Applications",
          subtitle: "Using percentages in everyday situations",
          slug: "percentage-applications",
          order: 1,
          content: "Percentages are fractions expressed out of 100, making them useful for comparing values. Understanding percentages is essential for shopping (discounts, sales tax), finances (interest rates, tip calculation), data analysis, and many other real-world situations. To calculate a percentage of a number, convert the percentage to a decimal (divide by 100) and multiply by the number. To find what percentage one number is of another, divide the first number by the second and multiply by 100. Mental shortcuts can make percentage calculations easier - for example, finding 10% and then multiplying or dividing to find other percentages.",
          scenarioTitle: "Shopping Decisions",
          scenarioContent: "You're shopping for a new pair of shoes with a budget of $80. Store A has a pair for $90 with a 20% discount. Store B has a similar pair originally priced at $100, but with a 25% discount. Both stores add 8% sales tax after discounts. Which store offers the better deal, and how much will you actually pay at checkout?",
          activityType: "percentage-calculator",
          activityContent: JSON.stringify({
            steps: [
              {
                name: "Calculate Store A final price",
                work: [
                  { description: "Original price", value: 90 },
                  { description: "Apply 20% discount", formula: "90 × 0.8", value: 72 },
                  { description: "Add 8% sales tax", formula: "72 × 1.08", value: 77.76 }
                ]
              },
              {
                name: "Calculate Store B final price",
                work: [
                  { description: "Original price", value: 100 },
                  { description: "Apply 25% discount", formula: "100 × 0.75", value: 75 },
                  { description: "Add 8% sales tax", formula: "75 × 1.08", value: 81 }
                ]
              },
              {
                name: "Compare prices",
                conclusion: "Store A offers the better deal at $77.76, which is $3.24 less than Store B at $81.00."
              }
            ]
          }),
          estimatedMinutes: 25,
          ageGroupContent: JSON.stringify({
            "9-12": {
              scenario: "You're buying a $20 toy with your allowance. The store has a 10% discount and then adds 5% tax.",
              terminology: "simpler",
              numbers: "smaller"
            },
            "13-15": {
              scenario: "You're buying a $50 video game. One store offers 15% off while another has a 'buy one, get one half off' deal if you buy with a friend.",
              terminology: "moderate",
              numbers: "moderate"
            },
            "16-18": {
              scenario: "You're comparing discounted shoes with different original prices, discount percentages, and need to account for sales tax.",
              terminology: "advanced",
              numbers: "complex"
            }
          })
        },
        {
          subjectId: realWorldMathSubject.id,
          title: "Budgeting Mathematics",
          subtitle: "Using math to plan your finances",
          slug: "budgeting-mathematics",
          order: 2,
          content: "Successful budgeting requires practical mathematical skills. Key concepts include calculating income (hourly wages, salaries), estimating and categorizing expenses, determining percentages for different budget categories, and projecting savings over time. Creating a balanced budget means ensuring your expenses don't exceed your income. Fixed expenses remain constant (rent, car payment), while variable expenses change (groceries, entertainment). The 50/30/20 rule, which suggests spending 50% on needs, 30% on wants, and 20% on savings, provides a helpful framework for budget allocation. Tracking spending by category helps identify areas where you might be overspending relative to your goals.",
          scenarioTitle: "First Apartment Budget",
          scenarioContent: "You're planning to move into your first apartment after graduation. You have a job offer with a gross salary of $3,000 per month, but need to create a realistic budget to determine what rent you can afford. You need to account for taxes, living expenses, student loan payments, savings goals, and still have some money for entertainment.",
          activityType: "budget-allocation",
          activityContent: JSON.stringify({
            income: 3000,
            expenses: [
              { category: "Taxes and deductions (25%)", amount: 750, editable: false },
              { category: "Rent", amount: 0, editable: true, maxRecommended: 900 },
              { category: "Utilities", amount: 200, editable: true },
              { category: "Groceries", amount: 350, editable: true },
              { category: "Transportation", amount: 200, editable: true },
              { category: "Student loans", amount: 250, editable: false },
              { category: "Phone/Internet", amount: 100, editable: true },
              { category: "Entertainment", amount: 0, editable: true },
              { category: "Savings", amount: 0, editable: true, recommended: "at least 200" }
            ],
            goal: "Create a balanced budget where expenses don't exceed take-home pay of $2,250"
          }),
          estimatedMinutes: 30,
          ageGroupContent: JSON.stringify({
            "9-12": {
              scenario: "You get $25 allowance each month and want to plan how to spend and save it.",
              terminology: "simpler",
              numbers: "smaller"
            },
            "13-15": {
              scenario: "You earn $200 monthly from a weekend job and need to budget for savings, expenses, and fun.",
              terminology: "moderate",
              numbers: "moderate"
            },
            "16-18": {
              scenario: "You're creating a budget for your first apartment based on your new job's salary.",
              terminology: "advanced",
              numbers: "realistic"
            }
          })
        },
        {
          subjectId: realWorldMathSubject.id,
          title: "Data Interpretation",
          subtitle: "Making sense of numbers and statistics",
          slug: "data-interpretation",
          order: 3,
          content: "Data literacy is the ability to read, understand, and communicate with data - an increasingly important skill in today's world. Interpreting graphs requires understanding different visualization types: bar graphs compare quantities across categories, line graphs show trends over time, pie charts show proportions of a whole, and scatter plots display relationships between variables. Statistics provide ways to summarize data, with measures like mean (average), median (middle value), and mode (most common value) offering different insights. It's important to evaluate the source and quality of data, consider potential biases, and understand that correlation doesn't imply causation. Data can be misleading if presented with manipulated scales, selective framing, or without proper context.",
          scenarioTitle: "Phone Plan Comparison",
          scenarioContent: "You're choosing between three cell phone plans and have collected data on your usage patterns. You need to analyze this information to determine which plan would be most cost-effective based on your specific needs and usage habits.",
          activityType: "data-analysis",
          activityContent: JSON.stringify({
            dataTable: {
              headers: ["Plan Feature", "Economy Plan", "Standard Plan", "Unlimited Plan"],
              rows: [
                ["Monthly cost", "$35", "$50", "$75"],
                ["Data included", "2 GB", "10 GB", "Unlimited"],
                ["Overage rate", "$15/GB", "$10/GB", "None"],
                ["Talk & text", "Unlimited", "Unlimited", "Unlimited"],
                ["Contract length", "None", "1 year", "2 years"],
                ["Family discount", "None", "$5/line", "$10/line"]
              ]
            },
            userUsage: {
              description: "Your average monthly usage:",
              data: [
                ["Data", "8.5 GB"],
                ["Talk minutes", "120 minutes"],
                ["Texts sent", "1500 texts"]
              ]
            },
            questions: [
              {
                question: "Which plan would cost the most for your current usage pattern?",
                options: ["Economy Plan", "Standard Plan", "Unlimited Plan"],
                correctAnswer: "Economy Plan",
                explanation: "With Economy Plan, you'd pay $35 base + $97.50 in overage charges (6.5GB × $15) = $132.50 total"
              },
              {
                question: "Which plan offers the best value for your usage?",
                options: ["Economy Plan", "Standard Plan", "Unlimited Plan"],
                correctAnswer: "Standard Plan",
                explanation: "Standard Plan would cost $50 base + (0 for first 10GB) = $50 total"
              }
            ]
          }),
          estimatedMinutes: 35,
          ageGroupContent: JSON.stringify({
            "9-12": {
              scenario: "You're choosing between different video game subscription options based on how often you play.",
              terminology: "simpler",
              numbers: "smaller"
            },
            "13-15": {
              scenario: "You're comparing three streaming services with different prices, content libraries, and features.",
              terminology: "moderate",
              numbers: "moderate"
            },
            "16-18": {
              scenario: "You're analyzing cell phone plans with different pricing structures against your usage patterns.",
              terminology: "advanced",
              numbers: "complex"
            }
          })
        },
        {
          subjectId: realWorldMathSubject.id,
          title: "Financial Calculations",
          subtitle: "Math tools for financial decisions",
          slug: "financial-calculations",
          order: 4,
          content: "Financial mathematics provides tools for making informed money decisions. Simple interest (I = P × r × t) is straightforward - you earn interest only on the principal. Compound interest, calculated as A = P(1 + r)^t, is more powerful as it generates interest on previously earned interest. Understanding the Rule of 72 (years to double = 72 ÷ interest rate) helps estimate investment growth. When comparing loans, the Annual Percentage Rate (APR) accounts for interest and fees, while calculating total cost over the loan term reveals the true expense. Future value calculations help with retirement planning by estimating how investments will grow over time. Amortization schedules show how loan payments are applied to principal and interest over time, revealing how much you'll ultimately pay for financed purchases.",
          scenarioTitle: "Car Purchase Decision",
          scenarioContent: "You're considering buying a used car for $12,000. You have three options: pay in full using your savings, take a 3-year loan at 5% interest, or take a 5-year loan at 7% interest. You need to calculate the total cost of each option and determine which makes the most financial sense based on your situation.",
          activityType: "loan-calculator",
          activityContent: JSON.stringify({
            options: [
              {
                name: "Cash payment",
                calculation: {
                  principalAmount: 12000,
                  description: "Pay full amount from savings",
                  totalCost: 12000,
                  opportunity: "Lost potential investment returns on $12,000"
                }
              },
              {
                name: "3-year loan (5%)",
                calculation: {
                  principalAmount: 12000,
                  interestRate: 5,
                  termYears: 3,
                  monthlyPayment: 359.37,
                  totalPayments: 12937.32,
                  totalInterest: 937.32
                }
              },
              {
                name: "5-year loan (7%)",
                calculation: {
                  principalAmount: 12000,
                  interestRate: 7,
                  termYears: 5,
                  monthlyPayment: 237.42,
                  totalPayments: 14245.20,
                  totalInterest: 2245.20
                }
              }
            ],
            comparisonPoints: [
              "Total cost difference between best and worst options: $2,245.20",
              "Monthly payment difference between 3-year and 5-year loans: $121.95",
              "With the 3-year loan, you'll pay off the car 2 years sooner and save $1,307.88 in interest compared to the 5-year loan"
            ]
          }),
          estimatedMinutes: 40,
          ageGroupContent: JSON.stringify({
            "9-12": {
              scenario: "You're saving $5 weekly for a $60 toy and want to know how long it will take.",
              terminology: "simpler",
              numbers: "smaller"
            },
            "13-15": {
              scenario: "You're deciding between saving for a $500 phone or getting it on a payment plan of $25/month for 24 months.",
              terminology: "moderate",
              numbers: "moderate"
            },
            "16-18": {
              scenario: "You're analyzing different payment options for a used car, including loans with different terms and interest rates.",
              terminology: "advanced",
              numbers: "realistic"
            }
          })
        },
        {
          subjectId: realWorldMathSubject.id,
          title: "Problem-Solving Logic",
          subtitle: "Using math thinking for complex decisions",
          slug: "problem-solving-logic",
          order: 5,
          content: "Mathematical thinking provides powerful tools for approaching complex problems beyond just calculation. Breaking problems into smaller components makes them more manageable - for instance, dividing a project into discrete tasks with time estimates. Decision matrices help evaluate options across multiple criteria by assigning weights and scores. Probability concepts assist in risk assessment by examining the likelihood of different outcomes. Systematic trial and error allows testing solutions and refining approaches based on results. Logical reasoning helps identify patterns, draw valid conclusions from evidence, and avoid common cognitive biases. These problem-solving approaches can be applied to everything from career decisions to travel planning to major purchases.",
          scenarioTitle: "College Decision Matrix",
          scenarioContent: "You've been accepted to three colleges and need to make a decision. Each option has different costs, academic programs, locations, and campus cultures. You want to make an objective decision that considers all important factors according to your personal priorities.",
          activityType: "decision-matrix",
          activityContent: JSON.stringify({
            options: ["State University", "Private College", "Community College + Transfer"],
            criteria: [
              { name: "Total Cost (4 years)", weight: 30, description: "Lower is better" },
              { name: "Program Strength", weight: 25, description: "Academic reputation in your field" },
              { name: "Location", weight: 15, description: "Proximity to home/opportunities" },
              { name: "Campus Life", weight: 10, description: "Activities, housing, community" },
              { name: "Career Support", weight: 20, description: "Internships, job placement" }
            ],
            ratings: [
              [2, 4, 5], // State University ratings for each criterion
              [1, 5, 3], // Private College ratings
              [5, 3, 2]  // Community College ratings
            ],
            instructions: "1. Rate each option on each criterion (1-5)\n2. Multiply ratings by weights\n3. Sum the weighted scores\n4. Compare total scores",
            template: true // Allow user to input their own ratings
          }),
          estimatedMinutes: 35,
          ageGroupContent: JSON.stringify({
            "9-12": {
              scenario: "You're choosing which of three summer camps to attend based on activities, friends attending, and location.",
              terminology: "simpler",
              decisions: "age-appropriate"
            },
            "13-15": {
              scenario: "You're deciding between several extracurricular activities based on your interests, time commitment, and future benefits.",
              terminology: "moderate",
              decisions: "teenage-focused"
            },
            "16-18": {
              scenario: "You're evaluating college options considering costs, programs, location, and other key factors.",
              terminology: "advanced",
              decisions: "young adult"
            }
          })
        }
      ];
      
      // Create the lessons for each subject
      console.log("Creating Financial Literacy lessons...");
      const createdFinancialLessons: Lesson[] = [];
      for (const lesson of financialLiteracyLessons) {
        createdFinancialLessons.push(await this.createLesson(normalizeLessonSeed(lesson)));
      }
      
      console.log("Creating Communication & Relationships lessons...");
      for (const lesson of communicationLessons) {
        await this.createLesson(normalizeLessonSeed(lesson));
      }
      
      console.log("Creating Real-World Math lessons...");
      for (const lesson of realWorldMathLessons) {
        await this.createLesson(normalizeLessonSeed(lesson));
      }
      
      // Update subject relations
      await this.updateSubject(financialLiteracySubject.id, {
        nextSubjectIds: [communicationSubject.id, realWorldMathSubject.id]
      });
      
      await this.updateSubject(communicationSubject.id, {
        nextSubjectIds: [financialLiteracySubject.id, realWorldMathSubject.id]
      });
      
      await this.updateSubject(realWorldMathSubject.id, {
        nextSubjectIds: [financialLiteracySubject.id, communicationSubject.id]
      });

      const existingMoneyCredential = await this.getCredentialDefinitionBySlug("money-basics");
      if (!existingMoneyCredential) {
        const moneyCredential = await this.createCredentialDefinition({
          title: "Money Basics Credential",
          slug: "money-basics",
          description: "Awarded for completing the Money Basics pathway and demonstrating core budgeting, saving, credit, and investing concepts.",
          subjectId: financialLiteracySubject.id,
          criteriaSummary: "Complete all Money Basics lessons and save a reflection or activity response.",
          disclaimer: "This is a Real World Academy completion credential and does not represent accredited school credit.",
          active: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        });

        for (let index = 0; index < createdFinancialLessons.length; index++) {
          const lesson = createdFinancialLessons[index];
          await this.createCredentialRequirement({
            credentialId: moneyCredential.id,
            requirementType: "lesson",
            title: `Complete lesson: ${lesson.title}`,
            description: `Student must complete the ${lesson.title} lesson.`,
            targetId: lesson.id,
            required: true,
            order: index + 1,
          });
        }

        await this.createCredentialRequirement({
          credentialId: moneyCredential.id,
          requirementType: "parent_review",
          title: "Parent review",
          description: "A parent or mentor should review the student's final reflection or activity work.",
          targetId: null,
          required: false,
          order: createdFinancialLessons.length + 1,
        });
      }

      await seedRoadmapBetaPathways();
      
      console.log("Subjects and lessons data initialization complete!");
      
    } catch (error) {
      console.error("Error initializing subjects data:", error);
    }
  }
  
  // Initialize career paths data
  async initializeCareerPathsData() {
    // Check if career paths already exist
    const existingCareerPaths = await this.getAllCareerPaths();
    if (existingCareerPaths.length > 0) return; // Skip if data exists
    
    // Create sample career paths
    const careerPathsData = [
      {
        title: "Software Developer",
        description: "Design, build, and maintain software applications and systems",
        tasks: JSON.stringify([
          "Write clean, efficient code",
          "Debug and fix issues in software",
          "Collaborate with teams to design features",
          "Test and document software"
        ]),
        skills: JSON.stringify([
          { name: "Programming", level: 4 },
          { name: "Problem Solving", level: 5 },
          { name: "Critical Thinking", level: 4 },
          { name: "Communication", level: 3 }
        ]),
        education: "Bachelor's degree in Computer Science or related field, or equivalent experience through coding bootcamps and self-learning",
        whyLoveIt: "Building solutions that solve real problems, constant learning, and the satisfaction of creating something that works",
        iconName: "Code",
        color: "blue"
      },
      {
        title: "Data Scientist",
        description: "Analyze complex data to help organizations make better decisions",
        tasks: JSON.stringify([
          "Collect and clean large datasets",
          "Build predictive models",
          "Visualize data findings",
          "Present insights to stakeholders"
        ]),
        skills: JSON.stringify([
          { name: "Statistics", level: 5 },
          { name: "Programming", level: 4 },
          { name: "Data Visualization", level: 4 },
          { name: "Machine Learning", level: 4 }
        ]),
        education: "Master's or PhD in Statistics, Mathematics, Computer Science, or related field",
        whyLoveIt: "Discovering hidden patterns in data, solving complex problems, and directly impacting business decisions",
        iconName: "BarChart",
        color: "purple"
      },
      {
        title: "Digital Marketing Specialist",
        description: "Create and implement strategies to promote brands and products online",
        tasks: JSON.stringify([
          "Run social media campaigns",
          "Analyze marketing metrics",
          "Create content strategies",
          "Optimize websites for search engines"
        ]),
        skills: JSON.stringify([
          { name: "Creative Thinking", level: 4 },
          { name: "Analytics", level: 3 },
          { name: "Communication", level: 5 },
          { name: "Strategic Planning", level: 4 }
        ]),
        education: "Bachelor's degree in Marketing, Communications, or related field; certifications in digital marketing platforms",
        whyLoveIt: "Combining creativity with analytics, seeing immediate results from campaigns, and staying on top of digital trends",
        iconName: "Megaphone",
        color: "green"
      },
      {
        title: "Healthcare Professional",
        description: "Provide care and treatment to patients in various medical settings",
        tasks: JSON.stringify([
          "Assess patient health problems",
          "Develop care plans",
          "Administer treatments",
          "Educate patients on health management"
        ]),
        skills: JSON.stringify([
          { name: "Patient Care", level: 5 },
          { name: "Critical Thinking", level: 4 },
          { name: "Empathy", level: 5 },
          { name: "Communication", level: 4 }
        ]),
        education: "Degrees vary by specialization: Associate to Doctoral degrees in Nursing, Medicine, or related fields",
        whyLoveIt: "Making a direct impact on people's lives, intellectual challenges of medicine, and the human connection with patients",
        iconName: "Heart",
        color: "red"
      },
      {
        title: "Financial Analyst",
        description: "Evaluate financial data and market trends to guide investment decisions",
        tasks: JSON.stringify([
          "Analyze financial statements",
          "Create financial models",
          "Research market trends",
          "Prepare investment recommendations"
        ]),
        skills: JSON.stringify([
          { name: "Financial Modeling", level: 5 },
          { name: "Research", level: 4 },
          { name: "Analytical Thinking", level: 5 },
          { name: "Attention to Detail", level: 4 }
        ]),
        education: "Bachelor's degree in Finance, Economics, Accounting, or related field; MBA or CFA often preferred",
        whyLoveIt: "The challenge of predicting market movements, helping others build wealth, and working with complex financial systems",
        iconName: "Landmark",
        color: "amber"
      }
    ];
    
    for (const careerPathData of careerPathsData) {
      await this.createCareerPath(careerPathData);
    }
    
    console.log("Career paths data initialized");
    
    // Initialize resources data
    await this.initializeResourcesData();
    
    // Initialize gamification data
    await this.initializeGamificationData();
  }
  
  // Initialize gamification elements like daily challenges
  async initializeGamificationData() {
    // Check if challenges already exist
    const existingChallenges = await db.select().from(dailyChallenges);
    if (existingChallenges.length > 0) return; // Skip if data exists
    
    console.log("Initializing gamification data...");
    
    // Get today's date for the challenges
    const today = new Date();
    const todayFormatted = today.toISOString().split('T')[0];
    
    // Create daily challenges
    const challenges = [
      {
        title: "Study Streak",
        description: "Complete at least one lesson today to maintain your streak",
        xpReward: 50,
        type: "login",
        activeDate: todayFormatted,
        difficultyLevel: 1,
        icon: "calendar-check"
      },
      {
        title: "Financial Quiz Master",
        description: "Complete today's financial literacy quiz with at least 80% accuracy",
        xpReward: 100,
        type: "quiz",
        activeDate: todayFormatted,
        difficultyLevel: 2,
        icon: "award"
      },
      {
        title: "Goal Setter",
        description: "Set at least one new goal in your Plan Your Future page",
        xpReward: 75,
        type: "goal",
        activeDate: todayFormatted,
        difficultyLevel: 1,
        icon: "target"
      },
      {
        title: "Learning Explorer",
        description: "Explore a new subject area you haven't started yet",
        xpReward: 60,
        type: "subject",
        activeDate: todayFormatted,
        difficultyLevel: 1,
        icon: "compass"
      },
      {
        title: "Resource Collector",
        description: "Download or save at least 3 resources from the Resource Center",
        xpReward: 80,
        type: "resource",
        activeDate: todayFormatted,
        difficultyLevel: 2,
        icon: "book-open"
      }
    ];
    
    for (const challenge of challenges) {
      await this.createDailyChallenge(challenge);
    }
    
    console.log("Gamification data initialized!");
  }
  
  // Initialize resources for the Resource Center
  async initializeResourcesData() {
    // Check if resources already exist
    const existingResources = await this.getAllResources();
    if (existingResources.length > 0) return; // Skip if data exists
    
    console.log("Initializing resources data...");
    
    // Get subjects to link resources
    const allSubjects = await this.getAllSubjects();
    const financialLiteracySubject = allSubjects.find(subject => subject.slug === "money-basics");
    const communicationSubject = allSubjects.find(subject => subject.slug === "communication-relationships");
    const mathSubject = allSubjects.find(subject => subject.slug === "real-world-math");
    
    // Financial Literacy Resources
    await this.createResource({
      title: "Monthly Teen Budget Worksheet",
      description: "A printable worksheet for teenagers to track income, expenses, and savings goals.",
      resourceType: "pdf",
      category: "financial-literacy",
      audience: ["student", "parent"],
      fileUrl: "/resources/budget-worksheet.pdf",
      thumbnailUrl: "/resources/thumbnails/budget-worksheet.jpg",
      downloadCount: 0,
      relatedSubjectId: financialLiteracySubject?.id,
      featured: true
    });
    
    await this.createResource({
      title: "What is a Mortgage?",
      description: "A short explainer video that breaks down how mortgages work, interest rates, and the home buying process.",
      resourceType: "video",
      category: "financial-literacy",
      audience: ["student", "parent"],
      embedUrl: "https://www.youtube.com/embed/dummylink1",
      thumbnailUrl: "/resources/thumbnails/mortgage-video.jpg",
      downloadCount: 0,
      relatedSubjectId: financialLiteracySubject?.id,
      featured: false
    });
    
    await this.createResource({
      title: "Emergency Fund Planning Guide",
      description: "Learn how to build financial security with this step-by-step guide to creating an emergency fund.",
      resourceType: "guide",
      category: "financial-literacy",
      audience: ["student", "parent", "teacher"],
      fileUrl: "/resources/emergency-fund-guide.pdf",
      thumbnailUrl: "/resources/thumbnails/emergency-fund.jpg",
      downloadCount: 0,
      relatedSubjectId: financialLiteracySubject?.id,
      featured: false
    });
    
    // Communication Resources
    await this.createResource({
      title: "Communication Challenge Cards",
      description: "Printable cards with communication scenarios and exercises to practice healthy dialogue.",
      resourceType: "worksheet",
      category: "communication",
      audience: ["student", "teacher"],
      fileUrl: "/resources/communication-cards.pdf",
      thumbnailUrl: "/resources/thumbnails/communication-cards.jpg",
      downloadCount: 0,
      relatedSubjectId: communicationSubject?.id,
      featured: true
    });
    
    await this.createResource({
      title: "Active Listening Techniques",
      description: "A poster highlighting the key components of active listening with practical examples.",
      resourceType: "pdf",
      category: "communication",
      audience: ["student", "teacher", "parent"],
      fileUrl: "/resources/active-listening.pdf",
      thumbnailUrl: "/resources/thumbnails/active-listening.jpg",
      downloadCount: 0,
      relatedSubjectId: communicationSubject?.id,
      featured: false
    });
    
    // Project Resources
    await this.createResource({
      title: "How to Build a Simple Business Plan",
      description: "Step-by-step guide to creating a business plan for your first entrepreneurial venture.",
      resourceType: "guide",
      category: "projects",
      audience: ["student", "teacher"],
      fileUrl: "/resources/business-plan-guide.pdf",
      thumbnailUrl: "/resources/thumbnails/business-plan.jpg",
      downloadCount: 0,
      relatedSubjectId: null,
      featured: true
    });
    
    await this.createResource({
      title: "Project Presentation Template",
      description: "A customizable template for creating professional project presentations.",
      resourceType: "worksheet",
      category: "projects",
      audience: ["student", "teacher"],
      fileUrl: "/resources/presentation-template.pptx",
      thumbnailUrl: "/resources/thumbnails/presentation-template.jpg",
      downloadCount: 0,
      relatedSubjectId: null,
      featured: false
    });
    
    // Math Resources
    await this.createResource({
      title: "Real-World Math Problems",
      description: "A collection of practice problems that apply mathematical concepts to everyday scenarios.",
      resourceType: "worksheet",
      category: "tech-skills",
      audience: ["student", "teacher"],
      fileUrl: "/resources/math-problems.pdf",
      thumbnailUrl: "/resources/thumbnails/math-problems.jpg",
      downloadCount: 0,
      relatedSubjectId: mathSubject?.id,
      featured: false
    });
    
    // Teacher Resources
    await this.createResource({
      title: "Classroom Implementation Guide",
      description: "For educators: How to integrate Real World Academy modules into your classroom curriculum.",
      resourceType: "guide",
      category: "teacher-guides",
      audience: ["teacher"],
      fileUrl: "/resources/classroom-implementation.pdf",
      thumbnailUrl: "/resources/thumbnails/classroom-guide.jpg",
      downloadCount: 0,
      relatedSubjectId: null,
      featured: true
    });
    
    await this.createResource({
      title: "Assessment Rubrics",
      description: "Evaluation templates for projects and assignments across all subject areas.",
      resourceType: "worksheet",
      category: "teacher-guides",
      audience: ["teacher"],
      fileUrl: "/resources/assessment-rubrics.pdf",
      thumbnailUrl: "/resources/thumbnails/rubrics.jpg",
      downloadCount: 0,
      relatedSubjectId: null,
      featured: false
    });
    
    // Parent Resources
    await this.createResource({
      title: "Supporting Your Child's Learning",
      description: "Tips and strategies for parents to reinforce real-world skills at home.",
      resourceType: "guide",
      category: "parent-guides",
      audience: ["parent"],
      fileUrl: "/resources/parent-support-guide.pdf",
      thumbnailUrl: "/resources/thumbnails/parent-guide.jpg",
      downloadCount: 0,
      relatedSubjectId: null,
      featured: true
    });
    
    console.log("Resources data initialized");
  }
  
  // Buddy AI operations
  async getBuddyProfile(userId: number): Promise<BuddyProfile | undefined> {
    const results = await db.select().from(buddyProfiles).where(eq(buddyProfiles.userId, userId));
    return results.length > 0 ? results[0] : undefined;
  }
  
  async createBuddyProfile(profile: InsertBuddyProfile): Promise<BuddyProfile> {
    const results = await db.insert(buddyProfiles).values(profile).returning();
    return results[0];
  }
  
  async updateBuddyProfile(userId: number, profile: Partial<BuddyProfile>): Promise<BuddyProfile> {
    // First check if profile exists
    const existing = await this.getBuddyProfile(userId);
    
    if (existing) {
      const results = await db
        .update(buddyProfiles)
        .set({
          ...profile,
          updatedAt: new Date(),
        })
        .where(eq(buddyProfiles.userId, userId))
        .returning();
      return results[0];
    } else {
      // Create new profile if it doesn't exist
      const newProfile: InsertBuddyProfile = {
        userId,
        name: profile.name || "Buddy",
        avatarType: profile.avatarType || "robot",
        avatarColor: profile.avatarColor || "blue",
        personalityType: profile.personalityType || "friendly",
        relationshipLevel: profile.relationshipLevel || 1,
        lastInteraction: profile.lastInteraction || new Date(),
      };
      return await this.createBuddyProfile(newProfile);
    }
  }
  
  // Buddy Messages operations
  async getBuddyMessages(userId: number, limit?: number): Promise<BuddyMessage[]> {
    let query: any = db.select().from(buddyMessages)
      .where(eq(buddyMessages.userId, userId))
      .orderBy(sql`${buddyMessages.sentAt} DESC`);
    
    if (limit) {
      query = query.limit(limit);
    }
    
    const messages = await query;
    return messages.reverse(); // Return in chronological order
  }
  
  async createBuddyMessage(message: InsertBuddyMessage): Promise<BuddyMessage> {
    const results = await db.insert(buddyMessages).values(message).returning();
    
    // Update last interaction in the buddy profile
    const userId = message.userId;
    await this.updateBuddyProfile(userId, { lastInteraction: new Date() });
    
    return results[0];
  }
  
  // Buddy Emotion operations
  async getBuddyEmotions(userId: number, limit?: number): Promise<BuddyEmotionLog[]> {
    let query: any = db.select().from(buddyEmotionLogs)
      .where(eq(buddyEmotionLogs.userId, userId))
      .orderBy(sql`${buddyEmotionLogs.loggedAt} DESC`);
    
    if (limit) {
      query = query.limit(limit);
    }
    
    return await query;
  }
  
  async recordBuddyEmotion(emotionLog: InsertBuddyEmotionLog): Promise<BuddyEmotionLog> {
    const results = await db.insert(buddyEmotionLogs).values(emotionLog).returning();
    return results[0];
  }
  
  async getLatestBuddyEmotion(userId: number): Promise<BuddyEmotionLog | undefined> {
    const emotions = await this.getBuddyEmotions(userId, 1);
    return emotions.length > 0 ? emotions[0] : undefined;
  }
  
  // Journal Entries operations
  async getBuddyJournalEntries(userId: number, limit?: number): Promise<BuddyJournalEntry[]> {
    let query: any = db.select().from(buddyJournalEntries)
      .where(eq(buddyJournalEntries.userId, userId))
      .orderBy(sql`${buddyJournalEntries.createdAt} DESC`);
    
    if (limit) {
      query = query.limit(limit);
    }
    
    return await query;
  }
  
  async createJournalEntry(entry: InsertBuddyJournalEntry): Promise<BuddyJournalEntry> {
    const results = await db.insert(buddyJournalEntries).values(entry).returning();
    return results[0];
  }
  
  async getJournalEntryById(entryId: number): Promise<BuddyJournalEntry | undefined> {
    const [entry] = await db.select().from(buddyJournalEntries)
      .where(eq(buddyJournalEntries.id, entryId));
    return entry;
  }
  
  async updateJournalEntry(
    entryId: number, 
    updates: Partial<Omit<InsertBuddyJournalEntry, 'userId'>>
  ): Promise<BuddyJournalEntry | undefined> {
    const [updated] = await db.update(buddyJournalEntries)
      .set({...updates, updatedAt: new Date()})
      .where(eq(buddyJournalEntries.id, entryId))
      .returning();
    return updated;
  }
  
  async deleteJournalEntry(entryId: number): Promise<void> {
    await db.delete(buddyJournalEntries)
      .where(eq(buddyJournalEntries.id, entryId));
  }
  
  async getJournalEntriesByTag(userId: number, tag: string): Promise<BuddyJournalEntry[]> {
    // Need to use custom SQL for array contains operation
    // This handles searching for entries where the tags array contains the specified tag
    return await db.select().from(buddyJournalEntries)
      .where(
        and(
          eq(buddyJournalEntries.userId, userId),
          sql`${tag} = ANY(${buddyJournalEntries.tags})`
        )
      )
      .orderBy(sql`${buddyJournalEntries.createdAt} DESC`);
  }
  
  // Initialize buddy profile for new user
  async initializeBuddyProfile(userId: number): Promise<BuddyProfile> {
    const defaultProfile: InsertBuddyProfile = {
      userId,
      name: "Buddy",
      avatarType: "robot",
      avatarColor: "blue",
      personalityType: "friendly_supportive",
      relationshipLevel: 1,
      lastInteraction: new Date(),
    };
    
    return await this.createBuddyProfile(defaultProfile);
  }
}

// Create and export the database storage instance
const dbStorage = new DatabaseStorage();
export const storage = dbStorage;

// Initialize data when first imported
dbStorage.initializeData().catch(err => {
  console.error('Failed to initialize database:', err);
});
