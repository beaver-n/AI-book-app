import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router, protectedProcedure } from "./_core/trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import {
  getUserStories,
  getStoryById,
  getStoryByShareToken,
  createStory,
  updateStory,
  deleteStory,
  incrementStoryViewCount,
} from "./db";
import { invokeLLM } from "./_core/llm";
import { generateImage } from "./_core/imageGeneration";
import { nanoid } from "nanoid";
import { storagePut } from "./storage";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  stories: router({
    // Get all stories for the current user
    list: protectedProcedure.query(async ({ ctx }) => {
      return await getUserStories(ctx.user.id);
    }),

    // Get a specific story by ID
    getById: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        const story = await getStoryById(input.id);
        if (!story) {
          throw new TRPCError({ code: "NOT_FOUND", message: "Story not found" });
        }
        return story;
      }),

    // Get a story by share token (public)
    getByShareToken: publicProcedure
      .input(z.object({ shareToken: z.string() }))
      .query(async ({ input }) => {
        const story = await getStoryByShareToken(input.shareToken);
        if (!story) {
          throw new TRPCError({ code: "NOT_FOUND", message: "Story not found" });
        }
        // Increment view count
        await incrementStoryViewCount(story.id);
        return story;
      }),

    // Generate a story using LLM with streaming
    generate: protectedProcedure
      .input(z.object({ prompt: z.string() }))
      .mutation(async ({ input, ctx }) => {
        try {
          // Call LLM to generate story
          const response = await invokeLLM({
            messages: [
              {
                role: "system",
                content: "You are a creative storyteller. Generate an engaging and imaginative short story based on the user's prompt. The story should be 300-500 words long, well-structured with a beginning, middle, and end. Make it compelling and emotionally engaging.",
              },
              {
                role: "user",
                content: input.prompt,
              },
            ],
          });

          const storyContentRaw = response.choices[0]?.message?.content;
          const storyContent = typeof storyContentRaw === "string" ? storyContentRaw : "";
          if (!storyContent) {
            throw new Error("Failed to generate story content");
          }

          // Generate a title from the prompt
          const titleResponse = await invokeLLM({
            messages: [
              {
                role: "system",
                content: "Generate a short, engaging title for a story based on the following prompt. Return only the title, nothing else.",
              },
              {
                role: "user",
                content: input.prompt,
              },
            ],
          });

          const titleContent = titleResponse.choices[0]?.message?.content;
          const title = (typeof titleContent === "string" ? titleContent : "Untitled Story").trim();

          // Generate cover image
          let coverImageUrl: string | undefined;
          try {
            const imageResponse = await generateImage({
              prompt: `Create a beautiful book cover illustration for a story with this prompt: ${input.prompt}. The image should be visually appealing, artistic, and suitable for a book cover.`,
            });
            if (imageResponse?.url) {
              // Upload image to S3
              const imageKey = `stories/${ctx.user.id}/${nanoid()}.png`;
              const uploadResult = await storagePut(imageKey, imageResponse.url, "image/png");
              coverImageUrl = uploadResult.url;
            }
          } catch (error) {
            console.error("Failed to generate cover image:", error);
            // Continue without cover image
          }

          // Save story to database
          const shareToken = nanoid(32);
          const result = await createStory({
            userId: ctx.user.id,
            title,
            content: storyContent,
            prompt: input.prompt,
            coverImage: coverImageUrl,
            shareToken,
            isPublic: 0,
          });

          return {
            success: true,
            title,
            content: storyContent,
            coverImage: coverImageUrl,
            shareToken,
          };
        } catch (error) {
          console.error("Story generation error:", error);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to generate story",
          });
        }
      }),

    // Update a story
    update: protectedProcedure
      .input(
        z.object({
          id: z.number(),
          title: z.string().optional(),
          content: z.string().optional(),
          isPublic: z.number().optional(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        const story = await getStoryById(input.id);
        if (!story) {
          throw new TRPCError({ code: "NOT_FOUND", message: "Story not found" });
        }
        if (story.userId !== ctx.user.id) {
          throw new TRPCError({ code: "FORBIDDEN", message: "You don't have permission to update this story" });
        }

        const updates: Record<string, any> = {};
        if (input.title !== undefined) updates.title = input.title;
        if (input.content !== undefined) updates.content = input.content;
        if (input.isPublic !== undefined) updates.isPublic = input.isPublic;

        await updateStory(input.id, updates);
        return { success: true };
      }),

    // Delete a story
    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input, ctx }) => {
        const story = await getStoryById(input.id);
        if (!story) {
          throw new TRPCError({ code: "NOT_FOUND", message: "Story not found" });
        }
        if (story.userId !== ctx.user.id) {
          throw new TRPCError({ code: "FORBIDDEN", message: "You don't have permission to delete this story" });
        }

        await deleteStory(input.id);
        return { success: true };
      }),

    // Toggle public/private
    togglePublic: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input, ctx }) => {
        const story = await getStoryById(input.id);
        if (!story) {
          throw new TRPCError({ code: "NOT_FOUND", message: "Story not found" });
        }
        if (story.userId !== ctx.user.id) {
          throw new TRPCError({ code: "FORBIDDEN", message: "You don't have permission to modify this story" });
        }

        await updateStory(input.id, { isPublic: story.isPublic ? 0 : 1 });
        return { success: true, isPublic: story.isPublic ? 0 : 1 };
      }),
  }),
});

export type AppRouter = typeof appRouter;
