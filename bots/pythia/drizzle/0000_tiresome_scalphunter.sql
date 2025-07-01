CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE "facts" (
	"fact_pk" serial PRIMARY KEY NOT NULL,
	"guild_id" varchar NOT NULL,
	"user_id" varchar NOT NULL,
	"content" text NOT NULL,
	"vector" vector(1536) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "resource_chunks" (
	"id" serial PRIMARY KEY NOT NULL,
	"resource_id" integer NOT NULL,
	"content" text NOT NULL,
	"vector" vector(1536) NOT NULL,
	"start_line" integer NOT NULL,
	"end_line" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "resources" (
	"id" serial PRIMARY KEY NOT NULL,
	"resource_id" integer NOT NULL,
	"guild_id" bigint NOT NULL,
	"user_id" varchar NOT NULL,
	"title" text NOT NULL,
	"length" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "thread_messages" (
	"thread_message_pk" serial PRIMARY KEY NOT NULL,
	"thread_id" bigint NOT NULL,
	"user_id" bigint NOT NULL,
	"content" text NOT NULL,
	"vector" vector(1536) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "threads" (
	"guild_id" bigint NOT NULL,
	"channel_id" bigint NOT NULL,
	"thread_id" bigint NOT NULL,
	"private" boolean NOT NULL,
	CONSTRAINT "threads_thread_id_pk" PRIMARY KEY("thread_id")
);
--> statement-breakpoint
ALTER TABLE "resource_chunks" ADD CONSTRAINT "resource_chunks_resource_id_resources_id_fk" FOREIGN KEY ("resource_id") REFERENCES "public"."resources"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "thread_messages" ADD CONSTRAINT "thread_messages_thread_id_threads_thread_id_fk" FOREIGN KEY ("thread_id") REFERENCES "public"."threads"("thread_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "embedding_idx" ON "facts" USING hnsw ("vector" vector_cosine_ops);--> statement-breakpoint
CREATE INDEX "resource_chunk_embedding_idx" ON "resource_chunks" USING hnsw ("vector" vector_cosine_ops);--> statement-breakpoint
CREATE INDEX "thread_message_embedding_idx" ON "thread_messages" USING hnsw ("vector" vector_cosine_ops);