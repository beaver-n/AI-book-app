import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// Story queries - import types and tables
import type { InsertStory } from "../drizzle/schema";
import { stories, storyShares } from "../drizzle/schema";

export async function getUserStories(userId: number) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get stories: database not available");
    return [];
  }

  return await db
    .select()
    .from(stories)
    .where(eq(stories.userId, userId))
    .orderBy((t) => t.createdAt);
}

export async function getStoryById(storyId: number) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get story: database not available");
    return undefined;
  }

  const result = await db
    .select()
    .from(stories)
    .where(eq(stories.id, storyId))
    .limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function getStoryByShareToken(shareToken: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get story: database not available");
    return undefined;
  }

  const result = await db
    .select()
    .from(stories)
    .where(eq(stories.shareToken, shareToken))
    .limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function createStory(story: InsertStory) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot create story: database not available");
    return undefined;
  }

  return await db.insert(stories).values(story);
}

export async function updateStory(storyId: number, updates: Partial<InsertStory>) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot update story: database not available");
    return undefined;
  }

  return await db
    .update(stories)
    .set(updates)
    .where(eq(stories.id, storyId));
}

export async function deleteStory(storyId: number) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot delete story: database not available");
    return undefined;
  }

  return await db
    .delete(stories)
    .where(eq(stories.id, storyId));
}

export async function incrementStoryViewCount(storyId: number) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot increment view count: database not available");
    return undefined;
  }

  const { sql } = await import("drizzle-orm");
  return await db
    .update(stories)
    .set({ viewCount: sql`${stories.viewCount} + 1` })
    .where(eq(stories.id, storyId));
}
