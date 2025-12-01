-- DropForeignKey
ALTER TABLE "TravelPlan" DROP CONSTRAINT "TravelPlan_touristId_fkey";

-- AddForeignKey
ALTER TABLE "TravelPlan" ADD CONSTRAINT "TravelPlan_touristId_fkey" FOREIGN KEY ("touristId") REFERENCES "Tourist"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;
