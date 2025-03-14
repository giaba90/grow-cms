-- CreateEnum
CREATE TYPE "post_status" AS ENUM ('draft', 'published', 'archived');

-- CreateEnum
CREATE TYPE "taxonomy_type" AS ENUM ('category', 'tag');

-- CreateTable
CREATE TABLE "content_taxonomy" (
    "id" SERIAL NOT NULL,
    "content_id" INTEGER,
    "taxonomy_id" INTEGER,

    CONSTRAINT "content_taxonomy_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "media" (
    "id" SERIAL NOT NULL,
    "user_id" UUID,
    "file_name" VARCHAR(255),
    "file_path" VARCHAR(255),
    "file_type" VARCHAR(50),
    "size" INTEGER,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "content_id" INTEGER,

    CONSTRAINT "media_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "page" (
    "id" SERIAL NOT NULL,
    "title" TEXT,
    "content" TEXT,
    "url" VARCHAR(255),
    "description" VARCHAR(255) NOT NULL,
    "status" "post_status" DEFAULT 'draft',

    CONSTRAINT "page_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "post" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "url" VARCHAR(255),
    "description" VARCHAR(255),
    "status" "post_status" DEFAULT 'draft',
    "featured" BOOLEAN DEFAULT false,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "author_id" UUID,

    CONSTRAINT "post_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "taxonomy" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "slug" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "type" "taxonomy_type" NOT NULL,
    "parent_id" INTEGER,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "taxonomy_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" VARCHAR(500) NOT NULL,
    "surname" VARCHAR(500) NOT NULL,
    "email" VARCHAR(500),
    "password" VARCHAR(500),
    "lastlogin" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "taxonomy_slug_key" ON "taxonomy"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- AddForeignKey
ALTER TABLE "content_taxonomy" ADD CONSTRAINT "content_taxonomy_content_id_fk" FOREIGN KEY ("content_id") REFERENCES "post"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "content_taxonomy" ADD CONSTRAINT "content_taxonomy_taxonomy_id_fk" FOREIGN KEY ("taxonomy_id") REFERENCES "taxonomy"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "media" ADD CONSTRAINT "media_content_id_fk" FOREIGN KEY ("content_id") REFERENCES "post"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "media" ADD CONSTRAINT "media_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "post" ADD CONSTRAINT "post_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "taxonomy" ADD CONSTRAINT "taxonomy_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "taxonomy"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
