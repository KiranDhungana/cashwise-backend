-- CreateTable
CREATE TABLE "UserPost" (
    "id" SERIAL NOT NULL,
    "uid" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserPost_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "UserPost" ADD CONSTRAINT "UserPost_uid_fkey" FOREIGN KEY ("uid") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
