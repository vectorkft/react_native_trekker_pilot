-- CreateTable
CREATE TABLE "Tokens" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "token" TEXT,
    "user_id" INTEGER,
    "created_at" INTEGER,
    "token_type" TEXT
);

-- CreateTable
CREATE TABLE "user" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT,
    "pw" TEXT
);

-- CreateTable
CREATE TABLE "cikk" (
    "cikkszam" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "cikknev" TEXT,
    "eankod" BIGINT
);

-- CreateTable
CREATE TABLE "Tokens_v1" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "accessToken" TEXT,
    "accessExpireDate" INTEGER,
    "refreshToken" TEXT,
    "refreshExpireDate" INTEGER,
    "userId" INTEGER
);

