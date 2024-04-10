-- CreateTable
CREATE TABLE "ActivityLogs" (
    "activity_logs" SERIAL NOT NULL,
    "user_id" INTEGER,
    "action" VARCHAR(255) NOT NULL,
    "timestamp" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ActivityLogs_pkey" PRIMARY KEY ("activity_logs")
);

-- CreateTable
CREATE TABLE "Categories" (
    "categories" SERIAL NOT NULL,
    "name" VARCHAR(100),

    CONSTRAINT "Categories_pkey" PRIMARY KEY ("categories")
);

-- CreateTable
CREATE TABLE "DiscussionThreads" (
    "discussion_threads" SERIAL NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "content" TEXT,
    "startup_id" INTEGER,

    CONSTRAINT "DiscussionThreads_pkey" PRIMARY KEY ("discussion_threads")
);

-- CreateTable
CREATE TABLE "Faq" (
    "faqs" SERIAL NOT NULL,
    "question" TEXT,
    "answer" TEXT,

    CONSTRAINT "Faq_pkey" PRIMARY KEY ("faqs")
);

-- CreateTable
CREATE TABLE "Feature" (
    "features" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "price" DECIMAL,

    CONSTRAINT "Feature_pkey" PRIMARY KEY ("features")
);

-- CreateTable
CREATE TABLE "Investment" (
    "investments" SERIAL NOT NULL,
    "investor_id" INTEGER,
    "startup_id" INTEGER,
    "amount" DECIMAL,
    "equity_percentage" DECIMAL,
    "timestamp" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Investment_pkey" PRIMARY KEY ("investments")
);

-- CreateTable
CREATE TABLE "Investor" (
    "investors" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "portfolio_performance" TEXT,
    "diversification" TEXT,
    "industry_preferences" TEXT[],
    "user_id" INTEGER,

    CONSTRAINT "Investor_pkey" PRIMARY KEY ("investors")
);

-- CreateTable
CREATE TABLE "Message" (
    "messages" SERIAL NOT NULL,
    "sender_id" INTEGER,
    "receiver_id" INTEGER,
    "content" TEXT NOT NULL,
    "timestamp" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("messages")
);

-- CreateTable
CREATE TABLE "Notification" (
    "notifications" SERIAL NOT NULL,
    "user_id" INTEGER,
    "content" TEXT NOT NULL,
    "timestamp" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "seen" BOOLEAN DEFAULT false,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("notifications")
);

-- CreateTable
CREATE TABLE "Payment" (
    "payments" SERIAL NOT NULL,
    "user_id" INTEGER,
    "amount" DECIMAL,
    "timestamp" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("payments")
);

-- CreateTable
CREATE TABLE "PlatformAdmin" (
    "platform_admins" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "user_id" INTEGER,

    CONSTRAINT "PlatformAdmin_pkey" PRIMARY KEY ("platform_admins")
);

-- CreateTable
CREATE TABLE "Resource" (
    "resources" SERIAL NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "url" VARCHAR(255),

    CONSTRAINT "Resource_pkey" PRIMARY KEY ("resources")
);

-- CreateTable
CREATE TABLE "StartupCategory" (
    "startup_id" INTEGER NOT NULL,
    "category_id" INTEGER NOT NULL,

    CONSTRAINT "StartupCategory_pkey" PRIMARY KEY ("startup_id","category_id")
);

-- CreateTable
CREATE TABLE "StartupMetric" (
    "startup_metrics" SERIAL NOT NULL,
    "startup_id" INTEGER,
    "views_count" INTEGER DEFAULT 0,
    "upvotes_count" INTEGER DEFAULT 0,
    "comments_count" INTEGER DEFAULT 0,
    "followers_count" INTEGER DEFAULT 0,
    "weekly_rank" INTEGER DEFAULT 0,
    "daily_rank" INTEGER DEFAULT 0,

    CONSTRAINT "StartupMetric_pkey" PRIMARY KEY ("startup_metrics")
);

-- CreateTable
CREATE TABLE "StartupTag" (
    "startup_id" INTEGER NOT NULL,
    "tag_id" INTEGER NOT NULL,

    CONSTRAINT "StartupTag_pkey" PRIMARY KEY ("startup_id","tag_id")
);

-- CreateTable
CREATE TABLE "Startup" (
    "startups" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "pitch_decks" TEXT[],
    "founders" TEXT[],
    "industry" VARCHAR(100),
    "location" VARCHAR(255),
    "owner_id" INTEGER,

    CONSTRAINT "Startup_pkey" PRIMARY KEY ("startups")
);

-- CreateTable
CREATE TABLE "Tag" (
    "tags" SERIAL NOT NULL,
    "name" VARCHAR(100),

    CONSTRAINT "Tag_pkey" PRIMARY KEY ("tags")
);

-- CreateTable
CREATE TABLE "User" (
    "users" SERIAL NOT NULL,
    "username" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "account_type" VARCHAR(50),
    "profile_info" TEXT,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "User_pkey" PRIMARY KEY ("users")
);

-- CreateTable
CREATE TABLE "Engager" (
    "engager_id" SERIAL NOT NULL,

    CONSTRAINT "Engager_pkey" PRIMARY KEY ("engager_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Categories_name_key" ON "Categories"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Investor_user_id_key" ON "Investor"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "PlatformAdmin_user_id_key" ON "PlatformAdmin"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "StartupMetric_startup_id_key" ON "StartupMetric"("startup_id");

-- CreateIndex
CREATE UNIQUE INDEX "Tag_name_key" ON "Tag"("name");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "ActivityLogs" ADD CONSTRAINT "ActivityLogs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("users") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "DiscussionThreads" ADD CONSTRAINT "DiscussionThreads_startup_id_fkey" FOREIGN KEY ("startup_id") REFERENCES "Startup"("startups") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Investment" ADD CONSTRAINT "Investment_investor_id_fkey" FOREIGN KEY ("investor_id") REFERENCES "Investor"("investors") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Investment" ADD CONSTRAINT "Investment_startup_id_fkey" FOREIGN KEY ("startup_id") REFERENCES "Startup"("startups") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Investor" ADD CONSTRAINT "Investor_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("users") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_receiver_id_fkey" FOREIGN KEY ("receiver_id") REFERENCES "User"("users") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_sender_id_fkey" FOREIGN KEY ("sender_id") REFERENCES "User"("users") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("users") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("users") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "PlatformAdmin" ADD CONSTRAINT "PlatformAdmin_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("users") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "StartupCategory" ADD CONSTRAINT "StartupCategory_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "Categories"("categories") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "StartupCategory" ADD CONSTRAINT "StartupCategory_startup_id_fkey" FOREIGN KEY ("startup_id") REFERENCES "Startup"("startups") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "StartupMetric" ADD CONSTRAINT "StartupMetric_startup_id_fkey" FOREIGN KEY ("startup_id") REFERENCES "Startup"("startups") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "StartupTag" ADD CONSTRAINT "StartupTag_startup_id_fkey" FOREIGN KEY ("startup_id") REFERENCES "Startup"("startups") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "StartupTag" ADD CONSTRAINT "StartupTag_tag_id_fkey" FOREIGN KEY ("tag_id") REFERENCES "Tag"("tags") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Startup" ADD CONSTRAINT "Startup_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "User"("users") ON DELETE NO ACTION ON UPDATE NO ACTION;
