-- ============================================================================
-- LEXIKANI NORWEGIAN LEVEL PROGRESSION POPULATION SCRIPT
-- ============================================================================
-- This script populates the database with Norwegian language level configurations
-- that were previously hardcoded in vocabulary-progression.ts
-- 
-- Run this directly in Supabase SQL Editor or through Drizzle migration.
-- ============================================================================

-- First, ensure Norwegian language exists
INSERT INTO language (name, code) 
VALUES ('Norwegian', 'no') 
ON CONFLICT (code) DO NOTHING;

-- Get Norwegian language ID for level population
DO $$
DECLARE
    norwegian_id INTEGER;
BEGIN
    -- Get Norwegian language ID
    SELECT id INTO norwegian_id FROM language WHERE code = 'no' LIMIT 1;
    
    IF norwegian_id IS NULL THEN
        RAISE EXCEPTION 'Norwegian language not found after insertion.';
    END IF;
    
    -- Clear existing Norwegian levels to avoid duplicates
    DELETE FROM language_level WHERE language_id = norwegian_id;
    
    -- Insert all Norwegian level configurations
    INSERT INTO language_level (language_id, level, description, complexity, allowed_types, examples, grammar_focus) VALUES
    
    -- LEVEL 1
    (norwegian_id, 1, 'Essential single words', 'basic_words', 
     '["noun", "verb", "adjective", "adverb"]',
     '["hus (house)", "mann (man)", "å være (to be)", "stor (big)", "fort (quickly)"]',
     '["basic vocabulary", "simple adjectives", "common adverbs"]'),
    
    -- LEVEL 2 
    (norwegian_id, 2, 'Words with articles and basic verb forms', 'simple_phrases',
     '["noun", "verb", "adjective", "adverb", "phrase"]',
     '["et hus (a house)", "er (is/am/are)", "jeg er (I am)"]',
     '["articles (en/ei/et)", "present tense", "basic phrases"]'),
    
    -- LEVEL 3
    (norwegian_id, 3, 'Plural forms and complex adjectives', 'extended_forms',
     '["noun", "verb", "adjective", "adverb", "phrase"]',
     '["huset (the house)", "stor mann (big man)", "snakker fort (speaks quickly)"]',
     '["definite forms", "plurals", "adjective placement"]'),
    
    -- LEVEL 4
    (norwegian_id, 4, 'Simple sentences and verb conjugations', 'basic_sentences',
     '["noun", "verb", "adjective", "adverb", "phrase", "sentence"]',
     '["hun snakker (she speaks)", "en stor mann (a big man)"]',
     '["basic sentences", "personal pronouns"]'),
    
    -- LEVEL 5
    (norwegian_id, 5, 'Adjective agreement and complex phrases', 'complex_agreements',
     '["noun", "verb", "adjective", "adverb", "phrase", "sentence"]',
     '["et stort hus (a big house)", "jeg snakker norsk (I speak Norwegian)"]',
     '["adjective agreement", "complex phrases"]'),
    
    -- LEVEL 6
    (norwegian_id, 6, 'Past tense and time expressions', 'past_tense',
     '["noun", "verb", "adjective", "adverb", "phrase", "sentence"]',
     '["snakket (spoke)", "jeg var (I was)", "i går (yesterday)"]',
     '["past tense", "time expressions"]'),
    
    -- LEVEL 7
    (norwegian_id, 7, 'Questions, possessives, and complex sentences', 'questions_possessives',
     '["noun", "verb", "adjective", "adverb", "phrase", "sentence"]',
     '["hvor er du? (where are you?)", "min far (my father)"]',
     '["questions", "possessives", "negation"]'),
    
    -- LEVEL 8
    (norwegian_id, 8, 'Perfect tense and advanced constructions', 'advanced_constructions',
     '["noun", "verb", "adjective", "adverb", "phrase", "sentence"]',
     '["jeg har snakka (I have spoken)", "conditional sentences"]',
     '["perfect tense", "conditionals", "complex syntax"]'),
    
    -- LEVEL 9
    (norwegian_id, 9, 'Body parts and extended family', 'body_family',
     '["noun", "verb", "adjective", "adverb", "phrase", "sentence"]',
     '["hode (head)", "bestemor (grandmother)", "onkel (uncle)"]',
     '["body parts vocabulary", "extended family terms", "descriptive phrases"]'),
    
    -- LEVEL 10
    (norwegian_id, 10, 'Food and meals', 'food_meals',
     '["noun", "verb", "adjective", "adverb", "phrase", "sentence"]',
     '["brød (bread)", "fisk (fish)", "frokost (breakfast)"]',
     '["food vocabulary", "meal expressions", "culinary terms"]'),
    
    -- LEVEL 11
    (norwegian_id, 11, 'Clothing and appearance', 'clothing_appearance',
     '["noun", "verb", "adjective", "adverb", "phrase", "sentence"]',
     '["klær (clothes)", "skjorte (shirt)", "pen (beautiful)"]',
     '["clothing terms", "appearance descriptions", "style adjectives"]'),
    
    -- LEVEL 12
    (norwegian_id, 12, 'Weather and seasons', 'weather_seasons',
     '["noun", "verb", "adjective", "adverb", "phrase", "sentence"]',
     '["vær (weather)", "vinter (winter)", "varm (warm)"]',
     '["weather expressions", "seasonal vocabulary", "temperature descriptions"]'),
    
    -- LEVEL 13
    (norwegian_id, 13, 'Colors and more descriptions', 'colors_descriptions',
     '["noun", "verb", "adjective", "adverb", "phrase", "sentence"]',
     '["grønn (green)", "gul (yellow)", "tykk (thick)"]',
     '["color adjectives", "physical descriptions", "comparative forms"]'),
    
    -- LEVEL 14
    (norwegian_id, 14, 'Numbers and counting', 'numbers_counting',
     '["noun", "verb", "adjective", "adverb", "phrase", "sentence", "number"]',
     '["en/ett (one)", "to (two)", "ti (ten)"]',
     '["number system", "counting expressions", "quantity phrases"]'),
    
    -- LEVEL 15
    (norwegian_id, 15, 'House and home', 'house_home',
     '["noun", "verb", "adjective", "adverb", "phrase", "sentence", "number"]',
     '["rom (room)", "kjøkken (kitchen)", "seng (bed)"]',
     '["home vocabulary", "furniture terms", "spatial prepositions"]'),
    
    -- LEVEL 16
    (norwegian_id, 16, 'Daily activities', 'daily_activities',
     '["noun", "verb", "adjective", "adverb", "phrase", "sentence", "number"]',
     '["å stå opp (to get up)", "å sove (to sleep)", "å jobbe (to work)"]',
     '["daily routines", "activity verbs", "time sequence"]'),
    
    -- LEVEL 17
    (norwegian_id, 17, 'Transportation', 'transportation',
     '["noun", "verb", "adjective", "adverb", "phrase", "sentence", "number"]',
     '["buss (bus)", "tog (train)", "å kjøre (to drive)"]',
     '["transportation modes", "travel verbs", "movement expressions"]'),
    
    -- LEVEL 18
    (norwegian_id, 18, 'Animals and nature', 'animals_nature',
     '["noun", "verb", "adjective", "adverb", "phrase", "sentence", "number"]',
     '["dyr (animal)", "fugl (bird)", "skog (forest)"]',
     '["animal vocabulary", "nature terms", "environmental descriptions"]'),
    
    -- LEVEL 19
    (norwegian_id, 19, 'Professions and work', 'professions_work',
     '["noun", "verb", "adjective", "adverb", "phrase", "sentence", "number"]',
     '["lærer (teacher)", "lege (doctor)", "kontor (office)"]',
     '["profession names", "workplace vocabulary", "career-related terms"]'),
    
    -- LEVEL 20
    (norwegian_id, 20, 'Time expressions', 'time_expressions',
     '["noun", "verb", "adjective", "adverb", "phrase", "sentence", "number"]',
     '["klokke (clock)", "time (hour)", "på mandag (on Monday)"]',
     '["time units", "temporal expressions", "scheduling phrases"]');
    
    RAISE NOTICE 'Successfully populated % Norwegian level configurations', 20;
END $$;
