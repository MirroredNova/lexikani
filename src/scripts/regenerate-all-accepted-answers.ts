/**
 * Regenerate all accepted answers from scratch using the latest logic
 * This ensures all entries use the most refined generateAcceptableAnswers function
 */

import { db } from '@/db/db';
import { vocabulary } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { generateAcceptableAnswers } from '@/lib/utils/text';

async function regenerateAllAcceptedAnswers() {
  console.log('🔄 Regenerating ALL accepted answers from scratch...');

  try {
    // Get all vocabulary entries
    const allEntries = await db
      .select({
        id: vocabulary.id,
        word: vocabulary.word,
        meaning: vocabulary.meaning,
        type: vocabulary.type,
        level: vocabulary.level,
        acceptedAnswers: vocabulary.acceptedAnswers,
      })
      .from(vocabulary)
      .orderBy(vocabulary.level, vocabulary.type, vocabulary.word);

    console.log(`📝 Found ${allEntries.length} vocabulary entries to process`);

    let updatedCount = 0;
    let unchangedCount = 0;
    const examples: Array<{
      word: string;
      meaning: string;
      oldAnswers: string[];
      newAnswers: string[];
      changed: boolean;
    }> = [];

    console.log('\n🔧 Processing entries...');

    for (const entry of allEntries) {
      // Generate new accepted answers using current logic
      const newAnswers = generateAcceptableAnswers(entry.meaning);
      const oldAnswers = (entry.acceptedAnswers as string[]) || [];

      // Check if answers changed
      const answersChanged =
        oldAnswers.length !== newAnswers.length ||
        !oldAnswers.every((answer, index) => answer === newAnswers[index]);

      // Update database with new answers
      await db
        .update(vocabulary)
        .set({
          acceptedAnswers: newAnswers,
        })
        .where(eq(vocabulary.id, entry.id));

      if (answersChanged) {
        updatedCount++;

        // Store examples of changed entries (first 10)
        if (examples.length < 10) {
          examples.push({
            word: entry.word,
            meaning: entry.meaning,
            oldAnswers,
            newAnswers,
            changed: true,
          });
        }
      } else {
        unchangedCount++;
      }

      // Progress indicator
      if ((updatedCount + unchangedCount) % 100 === 0) {
        console.log(
          `   Processed ${updatedCount + unchangedCount}/${allEntries.length} entries...`,
        );
      }
    }

    console.log(`\n✅ Regeneration complete!`);
    console.log(`📊 Results:`);
    console.log(`   Total entries: ${allEntries.length}`);
    console.log(`   Updated: ${updatedCount}`);
    console.log(`   Unchanged: ${unchangedCount}`);

    if (examples.length > 0) {
      console.log(`\n📝 Examples of updated entries:`);
      examples.forEach((example, i) => {
        console.log(`\n   ${i + 1}. "${example.word}" → "${example.meaning}"`);
        console.log(`      Old: [${example.oldAnswers.map(a => `"${a}"`).join(', ')}]`);
        console.log(`      New: [${example.newAnswers.map(a => `"${a}"`).join(', ')}]`);
      });
    }

    // Summary by level
    console.log(`\n📊 Breakdown by level:`);
    const levelGroups = new Map<number, { total: number; updated: number }>();

    for (const entry of allEntries) {
      if (!levelGroups.has(entry.level)) {
        levelGroups.set(entry.level, { total: 0, updated: 0 });
      }
      const group = levelGroups.get(entry.level);
      if (group) {
        group.total++;

        // Check if this entry was updated (re-run the logic to determine)
        const currentAnswers = generateAcceptableAnswers(entry.meaning);
        const storedAnswers = (entry.acceptedAnswers as string[]) || [];
        const wasUpdated =
          storedAnswers.length !== currentAnswers.length ||
          !storedAnswers.every((answer, index) => answer === currentAnswers[index]);

        if (wasUpdated) {
          group.updated++;
        }
      }
    }

    Array.from(levelGroups.entries())
      .sort(([a], [b]) => a - b)
      .forEach(([level, stats]) => {
        const percentage = stats.total > 0 ? Math.round((stats.updated / stats.total) * 100) : 0;
        console.log(`   Level ${level}: ${stats.updated}/${stats.total} updated (${percentage}%)`);
      });
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

regenerateAllAcceptedAnswers()
  .then(() => {
    console.log('\n✨ All accepted answers have been regenerated with the latest logic!');
    console.log('🎯 Your vocabulary database now uses the most refined accepted answers system.');
    process.exit(0);
  })
  .catch(error => {
    console.error('💥 Script failed:', error);
    process.exit(1);
  });
