CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

DROP TABLE IF EXISTS "ClosureTable";
DROP TABLE IF EXISTS "Replies";
DROP TABLE IF EXISTS "Comments";
DROP TABLE IF EXISTS "Posts";
DROP TABLE IF EXISTS "Media";
DROP TABLE IF EXISTS "MediaTypes";
DROP TABLE IF EXISTS "Votes";
DROP TYPE IF EXISTS VOTE;
DROP TABLE IF EXISTS "Votables";
DROP TABLE IF EXISTS "Sessions";
DROP TABLE IF EXISTS "Users";

CREATE TABLE "Users" (
  "userId" UUID NOT NULL DEFAULT uuid_generate_v4(),
  "username" VARCHAR(20) UNIQUE NOT NULL,
  "password" CHAR(60) NOT NULL,
  "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  PRIMARY KEY ("userId")
);

CREATE TABLE "Sessions" (
  "userId" UUID NOT NULL,
  "refreshToken" UUID NOT NULL DEFAULT uuid_generate_v4(),
  "expiration" TIMESTAMP NOT NULL DEFAULT (NOW() + INTERVAL '1 year'),
  PRIMARY KEY ("refreshToken"),
  FOREIGN KEY ("userId") REFERENCES "Users" ("userId") ON DELETE CASCADE
);

CREATE TABLE "Votables" (
  "votableId" UUID NOT NULL DEFAULT uuid_generate_v4(),
  "netVotes" int NOT NULL DEFAULT 0,
  "upVotes" int NOT NULL DEFAULT 0,
  "downVotes" int NOT NULL DEFAULT 0,
  PRIMARY KEY ("votableId")
);

CREATE TYPE VOTE AS ENUM ('upvote', 'downvote');

CREATE TABLE "Votes" (
  "userId" UUID NOT NULL,
  "votableId" UUID NOT NULL,
  "voteType" VOTE NOT NULL,
  "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  PRIMARY KEY ("userId", "votableId"),
  FOREIGN KEY ("votableId") REFERENCES "Votables" ("votableId") ON DELETE CASCADE,
  FOREIGN KEY ("userId") REFERENCES "Users" ("userId") ON DELETE CASCADE
);

CREATE TABLE "MediaTypes" (
  "mediaTypeId" UUID NOT NULL DEFAULT uuid_generate_v4(),
  "mediaType" VARCHAR(20) NOT NULL UNIQUE,
  PRIMARY KEY ("mediaTypeId")
);

INSERT INTO "MediaTypes" ("mediaType") VALUES ('url'), ('text');

CREATE TABLE "Media" (
  "mediaId" UUID NOT NULL DEFAULT uuid_generate_v4(),
  "mediaTypeId" UUID NOT NULL,
  "media" JSONB NOT NULL,
  PRIMARY KEY ("mediaId"),
  FOREIGN KEY ("mediaTypeId") REFERENCES "MediaTypes"("mediaTypeId")
);

CREATE TABLE "Posts" (
  "postId" UUID NOT NULL DEFAULT uuid_generate_v4(),
  "votableId" UUID NOT NULL,
  "mediaId" UUID,
  "userId" UUID,
  "title" VARCHAR(300) NOT NULL,
  "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  PRIMARY KEY ("postId"),
  FOREIGN KEY ("votableId") REFERENCES "Votables" ("votableId"),
  FOREIGN KEY ("mediaId") REFERENCES "Media" ("mediaId"),
  FOREIGN KEY ("userId") REFERENCES "Users" ("userId") ON DELETE SET NULL
);

CREATE TABLE "Comments" (
  "commentId" UUID NOT NULL DEFAULT uuid_generate_v4(),
  "postId" UUID NOT NULL,
  "votableId" UUID NOT NULL,
  "mediaId" UUID,
  "userId" UUID,
  "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  PRIMARY KEY ("commentId"),
  FOREIGN KEY ("postId") REFERENCES "Posts" ("postId"),
  FOREIGN KEY ("votableId") REFERENCES "Votables" ("votableId"),
  FOREIGN KEY ("mediaId") REFERENCES "Media" ("mediaId"),
  FOREIGN KEY ("userId") REFERENCES "Users" ("userId") ON DELETE SET NULL
);

CREATE TABLE "Replies" (
  "replyId" UUID NOT NULL DEFAULT uuid_generate_v4(),
  "parentId" UUID,
  "commentId" UUID NOT NULL,
  PRIMARY KEY ("replyId"),
  FOREIGN KEY ("parentId") REFERENCES "Comments" ("commentId"),
  FOREIGN KEY ("commentId") REFERENCES "Comments" ("commentId")
);

CREATE TABLE "ClosureTable" (
  "postId" UUID NOT NULL,
  "ancestorId" UUID NOT NULL,
  "descendentId" UUID NOT NULL,
  PRIMARY KEY ("postId", "ancestorId", "descendentId"),
  FOREIGN KEY ("postId") REFERENCES "Posts" ("postId") ON DELETE CASCADE,
  FOREIGN KEY ("ancestorId") REFERENCES "Comments" ("commentId") ON DELETE CASCADE,
  FOREIGN KEY ("descendentId") REFERENCES "Comments" ("commentId") ON DELETE CASCADE
);
