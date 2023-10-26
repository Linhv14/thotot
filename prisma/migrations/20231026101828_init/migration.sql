-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'WORKER', 'ADMIN');

-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE');

-- CreateEnum
CREATE TYPE "Order_status" AS ENUM ('NONE', 'MATCHED', 'PROCESSING', 'DONE', 'CANCELLED');

-- CreateEnum
CREATE TYPE "Account_status" AS ENUM ('ACTIVED', 'BLOCKED');

-- CreateTable
CREATE TABLE "Service" (
    "ID" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "creatAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Service_pkey" PRIMARY KEY ("ID")
);

-- CreateTable
CREATE TABLE "User" (
    "ID" SERIAL NOT NULL,
    "default_address" TEXT,
    "name" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "long" DOUBLE PRECISION,
    "lat" DOUBLE PRECISION,
    "phoneNumber" TEXT,
    "gender" "Gender" NOT NULL DEFAULT 'MALE',
    "age" INTEGER DEFAULT 18,
    "avatar" TEXT,
    "role" "Role" NOT NULL DEFAULT 'USER',
    "status" "Account_status" NOT NULL DEFAULT 'ACTIVED',
    "workingMode" BOOLEAN DEFAULT false,
    "refreshToken" TEXT,
    "creatAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("ID")
);

-- CreateTable
CREATE TABLE "UsersHasServices" (
    "serviceID" INTEGER NOT NULL,
    "userID" INTEGER NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UsersHasServices_pkey" PRIMARY KEY ("userID","serviceID")
);

-- CreateTable
CREATE TABLE "Order" (
    "ID" SERIAL NOT NULL,
    "address" TEXT NOT NULL,
    "serviceID" INTEGER NOT NULL,
    "status" "Order_status" NOT NULL DEFAULT 'NONE',
    "amount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "creatAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("ID")
);

-- CreateTable
CREATE TABLE "OrderHasUsers" (
    "orderID" INTEGER NOT NULL,
    "userID" INTEGER NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OrderHasUsers_pkey" PRIMARY KEY ("orderID","userID")
);

-- CreateTable
CREATE TABLE "Post" (
    "id" SERIAL NOT NULL,
    "userID" INTEGER NOT NULL,
    "address" TEXT NOT NULL,
    "serviceID" INTEGER NOT NULL,
    "content" TEXT NOT NULL,
    "creatAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Post_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Review" (
    "id" SERIAL NOT NULL,
    "userID" INTEGER NOT NULL,
    "orderID" INTEGER NOT NULL,
    "content" TEXT NOT NULL,
    "creatAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Review_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_phoneNumber_key" ON "User"("phoneNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Order_serviceID_key" ON "Order"("serviceID");

-- CreateIndex
CREATE UNIQUE INDEX "Post_userID_key" ON "Post"("userID");

-- CreateIndex
CREATE UNIQUE INDEX "Post_serviceID_key" ON "Post"("serviceID");

-- CreateIndex
CREATE UNIQUE INDEX "Review_userID_key" ON "Review"("userID");

-- CreateIndex
CREATE UNIQUE INDEX "Review_orderID_key" ON "Review"("orderID");

-- AddForeignKey
ALTER TABLE "UsersHasServices" ADD CONSTRAINT "UsersHasServices_serviceID_fkey" FOREIGN KEY ("serviceID") REFERENCES "Service"("ID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UsersHasServices" ADD CONSTRAINT "UsersHasServices_userID_fkey" FOREIGN KEY ("userID") REFERENCES "User"("ID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_serviceID_fkey" FOREIGN KEY ("serviceID") REFERENCES "Service"("ID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderHasUsers" ADD CONSTRAINT "OrderHasUsers_orderID_fkey" FOREIGN KEY ("orderID") REFERENCES "Order"("ID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderHasUsers" ADD CONSTRAINT "OrderHasUsers_userID_fkey" FOREIGN KEY ("userID") REFERENCES "User"("ID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_userID_fkey" FOREIGN KEY ("userID") REFERENCES "User"("ID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_serviceID_fkey" FOREIGN KEY ("serviceID") REFERENCES "Service"("ID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_userID_fkey" FOREIGN KEY ("userID") REFERENCES "User"("ID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_orderID_fkey" FOREIGN KEY ("orderID") REFERENCES "Order"("ID") ON DELETE RESTRICT ON UPDATE CASCADE;
