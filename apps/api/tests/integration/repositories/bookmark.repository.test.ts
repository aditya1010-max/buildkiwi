import {
  afterAll,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
} from "@jest/globals";
import mongoose from "mongoose";
import type { UserDocument } from "../../../src/models/user.model";
import type { ProjectDocument } from "../../../src/models/project.model";
import Bookmark from "../../../src/models/bookmark.model";
import { Project } from "../../../src/models/project.model";
import { User } from "../../../src/models/user.model";
import { bookmarkRepository } from "../../../src/repositories/bookmark.repository";

describe("bookmark repository", () => {
  let user: UserDocument;
  let creator: UserDocument;
  let project: ProjectDocument;

  beforeAll(async () => {
    const mongoUri =
      process.env.MONGO_URI || "mongodb://127.0.0.1:27017/test_db";

    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(mongoUri);
    }
  }, 15000);

  afterAll(async () => {
    await mongoose.connection.close();
  }, 15000);

  beforeEach(async () => {
    await Bookmark.deleteMany({});
    await Project.deleteMany({});
    await User.deleteMany({});

    creator = await User.create({
      username: "creator",
      email: "creator@example.com",
      passwordHash: "hashed-password",
    });

    user = await User.create({
      username: "bookmark-user",
      email: "bookmark@example.com",
      passwordHash: "hashed-password",
    });

    project = await Project.create({
      creatorId: creator._id,
      title: "BuildKiwi",
      description: "Developer platform",
      tags: ["React", "TypeScript"],
      links: {
        github: "https://github.com/example/buildkiwi",
        demo: "https://buildkiwi.dev",
      },
      stats: {
        likes: 0,
        comments: 0,
        views: 0,
      },
    });
  }, 15000);

  describe("create", () => {
    it("creates a bookmark for a user and project", async () => {
      const bookmark = await bookmarkRepository.create(
        user._id.toString(),
        project._id.toString(),
      );

      expect(bookmark).toBeDefined();

      expect(bookmark.userId.toString()).toBe(user._id.toString());

      expect(bookmark.projectId.toString()).toBe(project._id.toString());

      const savedBookmark = await Bookmark.findById(bookmark._id);

      expect(savedBookmark).not.toBeNull();
    });
  });

  describe("find", () => {
    it("finds a bookmark by user and project", async () => {
      await Bookmark.create({
        userId: user._id,
        projectId: project._id,
      });

      const bookmark = await bookmarkRepository.find(
        user._id.toString(),
        project._id.toString(),
      );

      expect(bookmark).not.toBeNull();

      expect(bookmark!.userId.toString()).toBe(user._id.toString());

      expect(bookmark!.projectId.toString()).toBe(project._id.toString());
    });

    it("returns null when the bookmark does not exist", async () => {
      const bookmark = await bookmarkRepository.find(
        user._id.toString(),
        project._id.toString(),
      );

      expect(bookmark).toBeNull();
    });
  });

  describe("delete", () => {
    it("deletes and returns an existing bookmark", async () => {
      const createdBookmark = await Bookmark.create({
        userId: user._id,
        projectId: project._id,
      });

      const deletedBookmark = await bookmarkRepository.delete(
        user._id.toString(),
        project._id.toString(),
      );

      expect(deletedBookmark).not.toBeNull();

      expect(deletedBookmark!._id.toString()).toBe(
        createdBookmark._id.toString(),
      );

      const bookmark = await Bookmark.findById(createdBookmark._id);

      expect(bookmark).toBeNull();
    });

    it("returns null when the bookmark does not exist", async () => {
      const result = await bookmarkRepository.delete(
        user._id.toString(),
        project._id.toString(),
      );

      expect(result).toBeNull();
    });
  });

  describe("findByUserId", () => {
    it("finds a user's bookmarks with populated project and creator data", async () => {
      await Bookmark.create({
        userId: user._id,
        projectId: project._id,
      });

      const bookmarks = await bookmarkRepository.findByUserId(
        user._id.toString(),
      );

      expect(bookmarks).toHaveLength(1);

      const bookmarkedProject = bookmarks[0].projectId;

      expect(bookmarkedProject).toBeDefined();

      expect(bookmarkedProject.title).toBe("BuildKiwi");

      expect(bookmarkedProject.description).toBe("Developer platform");

      expect(bookmarkedProject.tags).toEqual(["React", "TypeScript"]);

      expect(bookmarkedProject.creatorId).toBeDefined();

      expect(bookmarkedProject.creatorId.username).toBe("creator");
    });

    it("returns an empty array when the user has no bookmarks", async () => {
      const bookmarks = await bookmarkRepository.findByUserId(
        user._id.toString(),
      );

      expect(bookmarks).toEqual([]);
    });

    it("returns only bookmarks belonging to the requested user", async () => {
      const anotherUser = await User.create({
        username: "another-user",
        email: "another@example.com",
        passwordHash: "hashed-password",
      });

      await Bookmark.create({
        userId: user._id,
        projectId: project._id,
      });

      await Bookmark.create({
        userId: anotherUser._id,
        projectId: project._id,
      });

      const bookmarks = await bookmarkRepository.findByUserId(
        user._id.toString(),
      );

      expect(bookmarks).toHaveLength(1);

      expect(bookmarks[0].userId.toString()).toBe(user._id.toString());
    });
  });
});

/*
Test coverage:

1. Creates a bookmark
   → Verifies a bookmark is persisted with the correct user and
     project IDs.

2. Finds a bookmark
   → Verifies an existing bookmark can be retrieved using the
     user and project IDs.

3. Returns null for a missing bookmark
   → Verifies the repository returns null when no matching bookmark
     exists.

4. Deletes a bookmark
   → Verifies an existing bookmark is returned and removed from
     the database.

5. Returns null when deleting a missing bookmark
   → Verifies deleting a non-existent bookmark returns null.

6. Finds a user's bookmarks
   → Verifies bookmarks are filtered by user and the related project
     and creator data are populated correctly.

7. Returns an empty array for a user without bookmarks
   → Verifies the repository returns an empty collection when the
     user has no saved projects.

8. Filters bookmarks by user
   → Verifies bookmarks belonging to another user are not returned.
*/
