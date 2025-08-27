# Norwegian Vocabulary Setup

This script populates your Lexikani database with comprehensive Norwegian vocabulary across all 8 levels.

## How to Use

### 1. In Supabase Dashboard
1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Copy and paste the entire contents of `populate-norwegian-vocabulary.sql`
4. Click **Run** to execute

### 2. What Gets Created

The script will create **100+ Norwegian vocabulary words** organized by level:

- **Level 1** (33 words): Basic nouns, verbs, adjectives, adverbs
- **Level 2** (13 words): Articles and basic phrases  
- **Level 3** (11 words): Definite forms and plurals
- **Level 4** (8 words): Simple sentences
- **Level 5** (6 words): Complex adjective agreement
- **Level 6** (8 words): Past tense and time expressions
- **Level 7** (9 words): Questions and possessives
- **Level 8** (3 words): Perfect tense and conditionals

### 3. Features

**Authentic Norwegian grammar** - Proper genders, articles, conjugations  
**Progressive complexity** - Each level builds on previous knowledge  
**Rich attributes** - Full grammatical information for each word  
**Realistic learning path** - Follows pedagogical best practices  

### 4. Verification

After running the script, you can verify it worked in two ways:

**Option A: In Supabase (SQL query)**
```sql
SELECT 
    level,
    type,
    COUNT(*) as word_count
FROM vocabulary v 
JOIN language l ON v.language_id = l.id 
WHERE l.name = 'Norwegian'
GROUP BY level, type
ORDER BY level, type;
```

**Option B: Local verification script**
```bash
npx tsx scripts/verify-norwegian-vocabulary.ts
```

This will show a detailed breakdown and validate that everything is set up correctly.

### 5. Safe to Re-run

The script automatically clears existing Norwegian vocabulary before inserting new data, so it's safe to run multiple times.

## Example Vocabulary by Level

**Level 1**: hus (house), stor (big), å være (to be), fort (quickly)  
**Level 2**: jeg er (I am), et hus (a house), hun har (she has)  
**Level 3**: huset (the house), bilen (the car), mannen (the man)  
**Level 4**: jeg er norsk (I am Norwegian), hun snakker norsk (she speaks Norwegian)  
**Level 5**: et stort hus (a big house), den fine bilen (the nice car)  
**Level 6**: jeg var hjemme (I was home), i går (yesterday)  
**Level 7**: hvor er du? (where are you?), min far (my father)  
**Level 8**: jeg har snakket (I have spoken), hvis jeg hadde tid (if I had time)

---

After running this script, your app will have a rich Norwegian vocabulary dataset ready for learning!
