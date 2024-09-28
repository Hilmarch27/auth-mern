-- DropIndex
DROP INDEX "users_id_idx";

-- CreateIndex
CREATE INDEX "users_id_name_email_idx" ON "users"("id", "name", "email");
