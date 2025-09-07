/**
 * Script to populate accepted_answers field for existing vocabulary entries
 * Run this script to automatically generate acceptable answers for existing words
 */

import { db } from '@/db/db';
import { vocabulary } from '@/db/schema';
import { generateAcceptableAnswers } from '@/lib/utils/text';
import { isNull, eq } from 'drizzle-orm';

async function populateAcceptedAnswers() {
  console.log('🚀 Starting to populate accepted answers...');

  try {
    // Get all vocabulary entries that don't have accepted answers yet
    const vocabularyEntries = await db
      .select({
        id: vocabulary.id,
        meaning: vocabulary.meaning,
        acceptedAnswers: vocabulary.acceptedAnswers,
      })
      .from(vocabulary)
      .where(isNull(vocabulary.acceptedAnswers));

    console.log(`📝 Found ${vocabularyEntries.length} entries without accepted answers`);

    let updatedCount = 0;

    for (const entry of vocabularyEntries) {
      // Generate acceptable answers from the meaning
      const generatedAnswers = generateAcceptableAnswers(entry.meaning);

      // Only update if we generated more than just the original meaning
      if (generatedAnswers.length > 1) {
        await db
          .update(vocabulary)
          .set({
            acceptedAnswers: generatedAnswers,
          })
          .where(eq(vocabulary.id, entry.id));

        updatedCount++;
        console.log(`✅ Updated "${entry.meaning}" → [${generatedAnswers.join(', ')}]`);
      }
    }

    console.log(`🎉 Successfully updated ${updatedCount} vocabulary entries!`);
  } catch (error) {
    console.error('❌ Error populating accepted answers:', error);
    process.exit(1);
  }
}

// Run the script if called directly
if (require.main === module) {
  populateAcceptedAnswers()
    .then(() => {
      console.log('✨ Done!');
      process.exit(0);
    })
    .catch(error => {
      console.error('💥 Script failed:', error);
      process.exit(1);
    });
}

export { populateAcceptedAnswers };
