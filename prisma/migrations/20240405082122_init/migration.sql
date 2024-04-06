-- CreateTable
CREATE TABLE "activity_logs" (
    "log_id" SERIAL NOT NULL,
    "user_id" INTEGER,
    "action" VARCHAR(255) NOT NULL,
    "timestamp" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "activity_logs_pkey" PRIMARY KEY ("log_id")
);

-- CreateTable
CREATE TABLE "categories" (
    "category_id" SERIAL NOT NULL,
    "name" VARCHAR(100),

    CONSTRAINT "categories_pkey" PRIMARY KEY ("category_id")
);

-- CreateTable
CREATE TABLE "discussion_threads" (
    "thread_id" SERIAL NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "content" TEXT,
    "startup_id" INTEGER,

    CONSTRAINT "discussion_threads_pkey" PRIMARY KEY ("thread_id")
);

-- CreateTable
CREATE TABLE "faqs" (
    "faq_id" SERIAL NOT NULL,
    "question" TEXT,
    "answer" TEXT,

    CONSTRAINT "faqs_pkey" PRIMARY KEY ("faq_id")
);

-- CreateTable
CREATE TABLE "features" (
    "feature_id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "price" DECIMAL,

    CONSTRAINT "features_pkey" PRIMARY KEY ("feature_id")
);

-- CreateTable
CREATE TABLE "investments" (
    "investment_id" SERIAL NOT NULL,
    "investor_id" INTEGER,
    "startup_id" INTEGER,
    "amount" DECIMAL,
    "equity_percentage" DECIMAL,
    "timestamp" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "investments_pkey" PRIMARY KEY ("investment_id")
);

-- CreateTable
CREATE TABLE "investors" (
    "investor_id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "portfolio_performance" TEXT,
    "diversification" TEXT,
    "industry_preferences" TEXT[],
    "user_id" INTEGER,

    CONSTRAINT "investors_pkey" PRIMARY KEY ("investor_id")
);

-- CreateTable
CREATE TABLE "messages" (
    "message_id" SERIAL NOT NULL,
    "sender_id" INTEGER,
    "receiver_id" INTEGER,
    "content" TEXT NOT NULL,
    "timestamp" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "messages_pkey" PRIMARY KEY ("message_id")
);

-- CreateTable
CREATE TABLE "notifications" (
    "notification_id" SERIAL NOT NULL,
    "user_id" INTEGER,
    "content" TEXT NOT NULL,
    "timestamp" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "seen" BOOLEAN DEFAULT false,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("notification_id")
);

-- CreateTable
CREATE TABLE "payments" (
    "payment_id" SERIAL NOT NULL,
    "user_id" INTEGER,
    "amount" DECIMAL,
    "timestamp" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "payments_pkey" PRIMARY KEY ("payment_id")
);

-- CreateTable
CREATE TABLE "platform_admins" (
    "admin_id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "user_id" INTEGER,

    CONSTRAINT "platform_admins_pkey" PRIMARY KEY ("admin_id")
);

-- CreateTable
CREATE TABLE "resources" (
    "resource_id" SERIAL NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "url" VARCHAR(255),

    CONSTRAINT "resources_pkey" PRIMARY KEY ("resource_id")
);

-- CreateTable
CREATE TABLE "startup_categories" (
    "startup_id" INTEGER NOT NULL,
    "category_id" INTEGER NOT NULL,

    CONSTRAINT "startup_categories_pkey" PRIMARY KEY ("startup_id","category_id")
);

-- CreateTable
CREATE TABLE "startup_metrics" (
    "metrics_id" SERIAL NOT NULL,
    "startup_id" INTEGER,
    "views_count" INTEGER DEFAULT 0,
    "upvotes_count" INTEGER DEFAULT 0,
    "comments_count" INTEGER DEFAULT 0,
    "followers_count" INTEGER DEFAULT 0,
    "weekly_rank" INTEGER DEFAULT 0,
    "daily_rank" INTEGER DEFAULT 0,

    CONSTRAINT "startup_metrics_pkey" PRIMARY KEY ("metrics_id")
);

-- CreateTable
CREATE TABLE "startup_tags" (
    "startup_id" INTEGER NOT NULL,
    "tag_id" INTEGER NOT NULL,

    CONSTRAINT "startup_tags_pkey" PRIMARY KEY ("startup_id","tag_id")
);

-- CreateTable
CREATE TABLE "startups" (
    "startup_id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "pitch_decks" TEXT[],
    "founders" TEXT[],
    "industry" VARCHAR(100),
    "location" VARCHAR(255),
    "owner_id" INTEGER,

    CONSTRAINT "startups_pkey" PRIMARY KEY ("startup_id")
);

-- CreateTable
CREATE TABLE "tags" (
    "tag_id" SERIAL NOT NULL,
    "name" VARCHAR(100),

    CONSTRAINT "tags_pkey" PRIMARY KEY ("tag_id")
);

-- CreateTable
CREATE TABLE "users" (
    "user_id" SERIAL NOT NULL,
    "username" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "account_type" VARCHAR(50) NOT NULL,
    "profile_info" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("user_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "categories_name_key" ON "categories"("name");

-- CreateIndex
CREATE UNIQUE INDEX "investors_user_id_key" ON "investors"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "platform_admins_user_id_key" ON "platform_admins"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "startup_metrics_startup_id_key" ON "startup_metrics"("startup_id");

-- CreateIndex
CREATE UNIQUE INDEX "tags_name_key" ON "tags"("name");

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- AddForeignKey
ALTER TABLE "activity_logs" ADD CONSTRAINT "activity_logs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "discussion_threads" ADD CONSTRAINT "discussion_threads_startup_id_fkey" FOREIGN KEY ("startup_id") REFERENCES "startups"("startup_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "investments" ADD CONSTRAINT "investments_investor_id_fkey" FOREIGN KEY ("investor_id") REFERENCES "investors"("investor_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "investments" ADD CONSTRAINT "investments_startup_id_fkey" FOREIGN KEY ("startup_id") REFERENCES "startups"("startup_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "investors" ADD CONSTRAINT "investors_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_receiver_id_fkey" FOREIGN KEY ("receiver_id") REFERENCES "users"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_sender_id_fkey" FOREIGN KEY ("sender_id") REFERENCES "users"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "platform_admins" ADD CONSTRAINT "platform_admins_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "startup_categories" ADD CONSTRAINT "startup_categories_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories"("category_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "startup_categories" ADD CONSTRAINT "startup_categories_startup_id_fkey" FOREIGN KEY ("startup_id") REFERENCES "startups"("startup_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "startup_metrics" ADD CONSTRAINT "startup_metrics_startup_id_fkey" FOREIGN KEY ("startup_id") REFERENCES "startups"("startup_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "startup_tags" ADD CONSTRAINT "startup_tags_startup_id_fkey" FOREIGN KEY ("startup_id") REFERENCES "startups"("startup_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "startup_tags" ADD CONSTRAINT "startup_tags_tag_id_fkey" FOREIGN KEY ("tag_id") REFERENCES "tags"("tag_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "startups" ADD CONSTRAINT "startups_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "users"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION;
