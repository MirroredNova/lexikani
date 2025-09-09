CREATE INDEX "user_vocabulary_user_reviews_idx" ON "user_vocabulary" USING btree ("user_id","next_review_at");--> statement-breakpoint
CREATE INDEX "user_vocabulary_user_srs_idx" ON "user_vocabulary" USING btree ("user_id","srs_stage");--> statement-breakpoint
CREATE INDEX "user_vocabulary_user_unlocked_idx" ON "user_vocabulary" USING btree ("user_id","unlocked_at");--> statement-breakpoint
CREATE INDEX "user_vocabulary_next_review_idx" ON "user_vocabulary" USING btree ("next_review_at");--> statement-breakpoint
CREATE INDEX "vocabulary_language_level_idx" ON "vocabulary" USING btree ("language_id","level");--> statement-breakpoint
CREATE INDEX "vocabulary_language_type_idx" ON "vocabulary" USING btree ("language_id","type");--> statement-breakpoint
CREATE INDEX "vocabulary_word_idx" ON "vocabulary" USING btree ("word");--> statement-breakpoint
CREATE INDEX "vocabulary_meaning_idx" ON "vocabulary" USING btree ("meaning");