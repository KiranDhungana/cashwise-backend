-- CreateTable
CREATE TABLE "GroupEvent" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "totalAmount" DOUBLE PRECISION NOT NULL,
    "collectedAmount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "perPerson" DOUBLE PRECISION NOT NULL,
    "dueDate" TIMESTAMP(3) NOT NULL,
    "uid" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GroupEvent_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "GroupEvent" ADD CONSTRAINT "GroupEvent_uid_fkey" FOREIGN KEY ("uid") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
