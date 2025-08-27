-- ============================================================================
-- LEXIKANI NORWEGIAN VOCABULARY POPULATION SCRIPT
-- ============================================================================
-- This script populates the database with comprehensive Norwegian vocabulary
-- organized by levels according to the vocabulary progression system.
-- 
-- Run this directly in Supabase SQL Editor.
-- ============================================================================

-- First, get the Norwegian language ID
DO $$
DECLARE
    norwegian_id INTEGER;
BEGIN
    -- Get Norwegian language ID
    SELECT id INTO norwegian_id FROM language WHERE name = 'Norwegian' LIMIT 1;
    
    IF norwegian_id IS NULL THEN
        RAISE EXCEPTION 'Norwegian language not found. Please ensure languages are seeded first.';
    END IF;
    
    -- Clear existing Norwegian vocabulary to avoid duplicates
    DELETE FROM vocabulary WHERE language_id = norwegian_id;
    
    -- ========================================================================
    -- LEVEL 1: Essential single words (nouns, verbs, adjectives, adverbs)
    -- ========================================================================
    
    INSERT INTO vocabulary (language_id, word, meaning, level, type, attributes) VALUES
    
    -- LEVEL 1 NOUNS - Basic everyday objects and people
    (norwegian_id, 'hus', 'house', 1, 'noun', '{"gender": "neuter", "article": "et", "definite": "huset", "plural": "hus"}'),
    (norwegian_id, 'bil', 'car', 1, 'noun', '{"gender": "masculine", "article": "en", "definite": "bilen", "plural": "biler"}'),
    (norwegian_id, 'mann', 'man', 1, 'noun', '{"gender": "masculine", "article": "en", "definite": "mannen", "plural": "menn"}'),
    (norwegian_id, 'kvinne', 'woman', 1, 'noun', '{"gender": "feminine", "article": "ei/en", "definite": "kvinnen", "plural": "kvinner"}'),
    (norwegian_id, 'barn', 'child', 1, 'noun', '{"gender": "neuter", "article": "et", "definite": "barnet", "plural": "barn"}'),
    (norwegian_id, 'bok', 'book', 1, 'noun', '{"gender": "feminine", "article": "ei/en", "definite": "boka/boken", "plural": "bøker"}'),
    (norwegian_id, 'bord', 'table', 1, 'noun', '{"gender": "neuter", "article": "et", "definite": "bordet", "plural": "bord"}'),
    (norwegian_id, 'stol', 'chair', 1, 'noun', '{"gender": "masculine", "article": "en", "definite": "stolen", "plural": "stoler"}'),
    (norwegian_id, 'dør', 'door', 1, 'noun', '{"gender": "feminine", "article": "ei/en", "definite": "døra/døren", "plural": "dører"}'),
    (norwegian_id, 'vindu', 'window', 1, 'noun', '{"gender": "neuter", "article": "et", "definite": "vinduet", "plural": "vinduer"}'),
    (norwegian_id, 'kaffe', 'coffee', 1, 'noun', '{"gender": "masculine", "article": "en", "definite": "kaffen", "plural": null}'),
    (norwegian_id, 'øl', 'beer', 1, 'noun', '{"gender": "neuter", "article": "et", "definite": "ølet", "plural": "øl"}'),
    (norwegian_id, 'vann', 'water', 1, 'noun', '{"gender": "neuter", "article": "et", "definite": "vannet", "plural": null}'),
    (norwegian_id, 'mat', 'food', 1, 'noun', '{"gender": "masculine", "article": "en", "definite": "maten", "plural": null}'),
    (norwegian_id, 'hund', 'dog', 1, 'noun', '{"gender": "masculine", "article": "en", "definite": "hunden", "plural": "hunder"}'),
    (norwegian_id, 'katt', 'cat', 1, 'noun', '{"gender": "masculine", "article": "en", "definite": "katten", "plural": "katter"}'),
    
    -- LEVEL 1 VERBS - Basic actions
    (norwegian_id, 'å være', 'to be', 1, 'verb', '{"infinitive": "å være", "present": "er", "past": "var", "perfect": "vært"}'),
    (norwegian_id, 'å ha', 'to have', 1, 'verb', '{"infinitive": "å ha", "present": "har", "past": "hadde", "perfect": "hatt"}'),
    (norwegian_id, 'å gå', 'to go/walk', 1, 'verb', '{"infinitive": "å gå", "present": "går", "past": "gikk", "perfect": "gått"}'),
    (norwegian_id, 'å komme', 'to come', 1, 'verb', '{"infinitive": "å komme", "present": "kommer", "past": "kom", "perfect": "kommet"}'),
    (norwegian_id, 'å spise', 'to eat', 1, 'verb', '{"infinitive": "å spise", "present": "spiser", "past": "spiste", "perfect": "spist"}'),
    (norwegian_id, 'å drikke', 'to drink', 1, 'verb', '{"infinitive": "å drikke", "present": "drikker", "past": "drakk", "perfect": "drukket"}'),
    (norwegian_id, 'å snakke', 'to speak/talk', 1, 'verb', '{"infinitive": "å snakke", "present": "snakker", "past": "snakket", "perfect": "snakket"}'),
    (norwegian_id, 'å se', 'to see', 1, 'verb', '{"infinitive": "å se", "present": "ser", "past": "så", "perfect": "sett"}'),
    (norwegian_id, 'å høre', 'to hear', 1, 'verb', '{"infinitive": "å høre", "present": "hører", "past": "hørte", "perfect": "hørt"}'),
    (norwegian_id, 'å lese', 'to read', 1, 'verb', '{"infinitive": "å lese", "present": "leser", "past": "leste", "perfect": "lest"}'),
    
    -- LEVEL 1 ADJECTIVES - Basic descriptive words
    (norwegian_id, 'stor', 'big/large', 1, 'adjective', '{"masc_sing": "stor", "fem_sing": "stor", "neut_sing": "stort", "plural": "store", "definite": "store"}'),
    (norwegian_id, 'liten', 'small/little', 1, 'adjective', '{"masc_sing": "liten", "fem_sing": "lita", "neut_sing": "lite", "plural": "små", "definite": "lille"}'),
    (norwegian_id, 'fin', 'nice/fine', 1, 'adjective', '{"masc_sing": "fin", "fem_sing": "fin", "neut_sing": "fint", "plural": "fine", "definite": "fine"}'),
    (norwegian_id, 'god', 'good', 1, 'adjective', '{"masc_sing": "god", "fem_sing": "god", "neut_sing": "godt", "plural": "gode", "definite": "gode"}'),
    (norwegian_id, 'dårlig', 'bad', 1, 'adjective', '{"masc_sing": "dårlig", "fem_sing": "dårlig", "neut_sing": "dårlig", "plural": "dårlige", "definite": "dårlige"}'),
    (norwegian_id, 'ny', 'new', 1, 'adjective', '{"masc_sing": "ny", "fem_sing": "ny", "neut_sing": "nytt", "plural": "nye", "definite": "nye"}'),
    (norwegian_id, 'gammel', 'old', 1, 'adjective', '{"masc_sing": "gammel", "fem_sing": "gammel", "neut_sing": "gammelt", "plural": "gamle", "definite": "gamle"}'),
    (norwegian_id, 'rød', 'red', 1, 'adjective', '{"masc_sing": "rød", "fem_sing": "rød", "neut_sing": "rødt", "plural": "røde", "definite": "røde"}'),
    (norwegian_id, 'blå', 'blue', 1, 'adjective', '{"masc_sing": "blå", "fem_sing": "blå", "neut_sing": "blått", "plural": "blå", "definite": "blå"}'),
    
    -- LEVEL 1 ADVERBS - Common modifiers
    (norwegian_id, 'fort', 'quickly/fast', 1, 'adverb', '{"type": "manner"}'),
    (norwegian_id, 'sakte', 'slowly', 1, 'adverb', '{"type": "manner"}'),
    (norwegian_id, 'godt', 'well', 1, 'adverb', '{"type": "manner"}'),
    (norwegian_id, 'dårlig', 'badly', 1, 'adverb', '{"type": "manner"}'),
    (norwegian_id, 'nå', 'now', 1, 'adverb', '{"type": "time"}'),
    (norwegian_id, 'her', 'here', 1, 'adverb', '{"type": "place"}'),
    (norwegian_id, 'der', 'there', 1, 'adverb', '{"type": "place"}'),
    (norwegian_id, 'alltid', 'always', 1, 'adverb', '{"type": "frequency"}'),
    
    -- ========================================================================
    -- LEVEL 2: Words with articles and basic phrases
    -- ========================================================================
    
    -- LEVEL 2 PHRASES - Articles and basic combinations
    (norwegian_id, 'et hus', 'a house', 2, 'phrase', '{"type": "indefinite_article", "gender": "neuter"}'),
    (norwegian_id, 'en bil', 'a car', 2, 'phrase', '{"type": "indefinite_article", "gender": "masculine"}'),
    (norwegian_id, 'ei bok', 'a book', 2, 'phrase', '{"type": "indefinite_article", "gender": "feminine"}'),
    (norwegian_id, 'jeg er', 'I am', 2, 'phrase', '{"type": "pronoun_verb", "person": "first", "tense": "present"}'),
    (norwegian_id, 'du er', 'you are', 2, 'phrase', '{"type": "pronoun_verb", "person": "second", "tense": "present"}'),
    (norwegian_id, 'han er', 'he is', 2, 'phrase', '{"type": "pronoun_verb", "person": "third", "tense": "present"}'),
    (norwegian_id, 'hun er', 'she is', 2, 'phrase', '{"type": "pronoun_verb", "person": "third", "tense": "present"}'),
    (norwegian_id, 'jeg har', 'I have', 2, 'phrase', '{"type": "pronoun_verb", "person": "first", "tense": "present"}'),
    (norwegian_id, 'du har', 'you have', 2, 'phrase', '{"type": "pronoun_verb", "person": "second", "tense": "present"}'),
    
    -- LEVEL 2 NOUNS - More objects
    (norwegian_id, 'skole', 'school', 2, 'noun', '{"gender": "masculine", "article": "en", "definite": "skolen", "plural": "skoler"}'),
    (norwegian_id, 'jobb', 'job', 2, 'noun', '{"gender": "masculine", "article": "en", "definite": "jobben", "plural": "jobber"}'),
    (norwegian_id, 'penger', 'money', 2, 'noun', '{"gender": "masculine", "article": null, "definite": "pengene", "plural": "penger"}'),
    (norwegian_id, 'tid', 'time', 2, 'noun', '{"gender": "masculine/feminine", "article": "en/ei", "definite": "tiden/tida", "plural": "tider"}'),
    (norwegian_id, 'dag', 'day', 2, 'noun', '{"gender": "masculine", "article": "en", "definite": "dagen", "plural": "dager"}'),
    
    -- LEVEL 2 VERBS - More actions
    (norwegian_id, 'å like', 'to like', 2, 'verb', '{"infinitive": "å like", "present": "liker", "past": "likte", "perfect": "likt"}'),
    (norwegian_id, 'å ville', 'to want/will', 2, 'verb', '{"infinitive": "å ville", "present": "vil", "past": "ville", "perfect": "villet"}'),
    (norwegian_id, 'å kunne', 'to be able to/can', 2, 'verb', '{"infinitive": "å kunne", "present": "kan", "past": "kunne", "perfect": "kunnet"}'),
    (norwegian_id, 'å skulle', 'to shall/should', 2, 'verb', '{"infinitive": "å skulle", "present": "skal", "past": "skulle", "perfect": "skullet"}'),
    
    -- ========================================================================
    -- LEVEL 3: Definite forms and plurals
    -- ========================================================================
    
    -- LEVEL 3 PHRASES - Definite forms
    (norwegian_id, 'huset', 'the house', 3, 'phrase', '{"type": "definite_form", "gender": "neuter", "base": "hus"}'),
    (norwegian_id, 'bilen', 'the car', 3, 'phrase', '{"type": "definite_form", "gender": "masculine", "base": "bil"}'),
    (norwegian_id, 'boka', 'the book', 3, 'phrase', '{"type": "definite_form", "gender": "feminine", "base": "bok"}'),
    (norwegian_id, 'mannen', 'the man', 3, 'phrase', '{"type": "definite_form", "gender": "masculine", "base": "mann"}'),
    (norwegian_id, 'kvinnen', 'the woman', 3, 'phrase', '{"type": "definite_form", "gender": "feminine", "base": "kvinne"}'),
    (norwegian_id, 'barna', 'the children', 3, 'phrase', '{"type": "definite_plural", "gender": "neuter", "base": "barn"}'),
    (norwegian_id, 'bilene', 'the cars', 3, 'phrase', '{"type": "definite_plural", "gender": "masculine", "base": "bil"}'),
    
    -- LEVEL 3 ADJECTIVES - More descriptive
    (norwegian_id, 'lang', 'long/tall', 3, 'adjective', '{"masc_sing": "lang", "fem_sing": "lang", "neut_sing": "langt", "plural": "lange", "definite": "lange"}'),
    (norwegian_id, 'kort', 'short', 3, 'adjective', '{"masc_sing": "kort", "fem_sing": "kort", "neut_sing": "kort", "plural": "korte", "definite": "korte"}'),
    (norwegian_id, 'høy', 'high/tall', 3, 'adjective', '{"masc_sing": "høy", "fem_sing": "høy", "neut_sing": "høyt", "plural": "høye", "definite": "høye"}'),
    (norwegian_id, 'lav', 'low', 3, 'adjective', '{"masc_sing": "lav", "fem_sing": "lav", "neut_sing": "lavt", "plural": "lave", "definite": "lave"}'),
    
    -- ========================================================================
    -- LEVEL 4: Simple sentences and verb conjugations
    -- ========================================================================
    
    -- LEVEL 4 SENTENCES - Basic complete thoughts
    (norwegian_id, 'jeg er norsk', 'I am Norwegian', 4, 'sentence', '{"structure": "subject_verb_predicate", "tense": "present"}'),
    (norwegian_id, 'hun snakker norsk', 'she speaks Norwegian', 4, 'sentence', '{"structure": "subject_verb_object", "tense": "present"}'),
    (norwegian_id, 'jeg har en bil', 'I have a car', 4, 'sentence', '{"structure": "subject_verb_object", "tense": "present"}'),
    (norwegian_id, 'han er stor', 'he is big', 4, 'sentence', '{"structure": "subject_verb_adjective", "tense": "present"}'),
    (norwegian_id, 'boka er fin', 'the book is nice', 4, 'sentence', '{"structure": "subject_verb_adjective", "tense": "present"}'),
    
    -- LEVEL 4 NOUNS - More complex
    (norwegian_id, 'familie', 'family', 4, 'noun', '{"gender": "masculine", "article": "en", "definite": "familien", "plural": "familier"}'),
    (norwegian_id, 'venn', 'friend', 4, 'noun', '{"gender": "masculine", "article": "en", "definite": "vennen", "plural": "venner"}'),
    (norwegian_id, 'hjem', 'home', 4, 'noun', '{"gender": "neuter", "article": "et", "definite": "hjemmet", "plural": "hjem"}'),
    
    -- ========================================================================
    -- LEVEL 5: Adjective agreement and complex phrases
    -- ========================================================================
    
    -- LEVEL 5 PHRASES - Complex adjective agreement
    (norwegian_id, 'et stort hus', 'a big house', 5, 'phrase', '{"structure": "article_adjective_noun", "agreement": "neuter_indefinite"}'),
    (norwegian_id, 'en stor mann', 'a big man', 5, 'phrase', '{"structure": "article_adjective_noun", "agreement": "masculine_indefinite"}'),
    (norwegian_id, 'ei fin jente', 'a nice girl', 5, 'phrase', '{"structure": "article_adjective_noun", "agreement": "feminine_indefinite"}'),
    (norwegian_id, 'det store huset', 'the big house', 5, 'phrase', '{"structure": "determiner_adjective_noun", "agreement": "neuter_definite"}'),
    
    -- LEVEL 5 SENTENCES - More complex
    (norwegian_id, 'jeg snakker norsk godt', 'I speak Norwegian well', 5, 'sentence', '{"structure": "subject_verb_object_adverb", "tense": "present"}'),
    (norwegian_id, 'hun har en fin bil', 'she has a nice car', 5, 'sentence', '{"structure": "subject_verb_article_adjective_noun", "tense": "present"}'),
    
    -- ========================================================================
    -- LEVEL 6: Past tense and time expressions
    -- ========================================================================
    
    -- LEVEL 6 SENTENCES - Past tense
    (norwegian_id, 'jeg var hjemme', 'I was at home', 6, 'sentence', '{"structure": "subject_verb_location", "tense": "past"}'),
    (norwegian_id, 'hun snakket norsk', 'she spoke Norwegian', 6, 'sentence', '{"structure": "subject_verb_object", "tense": "past"}'),
    (norwegian_id, 'vi spiste middag', 'we ate dinner', 6, 'sentence', '{"structure": "subject_verb_object", "tense": "past"}'),
    
    -- LEVEL 6 ADVERBS - Time expressions
    (norwegian_id, 'i går', 'yesterday', 6, 'adverb', '{"type": "time_expression"}'),
    (norwegian_id, 'i dag', 'today', 6, 'adverb', '{"type": "time_expression"}'),
    (norwegian_id, 'i morgen', 'tomorrow', 6, 'adverb', '{"type": "time_expression"}'),
    (norwegian_id, 'tidligere', 'earlier', 6, 'adverb', '{"type": "time"}'),
    
    -- ========================================================================
    -- LEVEL 7: Questions, possessives, and complex sentences
    -- ========================================================================
    
    -- LEVEL 7 SENTENCES - Questions and possessives
    (norwegian_id, 'hvor er du?', 'where are you?', 7, 'sentence', '{"structure": "question_word_verb_subject", "type": "question"}'),
    (norwegian_id, 'hva gjør du?', 'what are you doing?', 7, 'sentence', '{"structure": "question_word_verb_subject", "type": "question"}'),
    (norwegian_id, 'min far', 'my father', 7, 'phrase', '{"structure": "possessive_noun", "person": "first"}'),
    (norwegian_id, 'din mor', 'your mother', 7, 'phrase', '{"structure": "possessive_noun", "person": "second"}'),
    (norwegian_id, 'hans bil', 'his car', 7, 'phrase', '{"structure": "possessive_noun", "person": "third_masculine"}'),
    
    -- ========================================================================
    -- LEVEL 8: Perfect tense and advanced constructions
    -- ========================================================================
    
    -- LEVEL 8 SENTENCES - Perfect tense and complex structures
    (norwegian_id, 'jeg har snakket norsk', 'I have spoken Norwegian', 8, 'sentence', '{"structure": "subject_auxiliary_participle_object", "tense": "perfect"}'),
    (norwegian_id, 'hvis jeg hadde tid', 'if I had time', 8, 'sentence', '{"structure": "conditional_clause", "type": "conditional"}'),
    (norwegian_id, 'hun ville ha kommet', 'she would have come', 8, 'sentence', '{"structure": "conditional_perfect", "type": "conditional"}'),
    
    -- ========================================================================
    -- LEVEL 9: Body parts and family
    -- ========================================================================
    
    -- LEVEL 9 NOUNS - Body parts
    (norwegian_id, 'kropp', 'body', 9, 'noun', '{"gender": "masculine", "article": "en", "definite": "kroppen", "plural": "kropper"}'),
    (norwegian_id, 'hode', 'head', 9, 'noun', '{"gender": "neuter", "article": "et", "definite": "hodet", "plural": "hoder"}'),
    (norwegian_id, 'øye', 'eye', 9, 'noun', '{"gender": "neuter", "article": "et", "definite": "øyet", "plural": "øyne"}'),
    (norwegian_id, 'øre', 'ear', 9, 'noun', '{"gender": "neuter", "article": "et", "definite": "øret", "plural": "ører"}'),
    (norwegian_id, 'munn', 'mouth', 9, 'noun', '{"gender": "masculine", "article": "en", "definite": "munnen", "plural": "munner"}'),
    (norwegian_id, 'nese', 'nose', 9, 'noun', '{"gender": "feminine", "article": "ei/en", "definite": "nesa/nesen", "plural": "neser"}'),
    (norwegian_id, 'arm', 'arm', 9, 'noun', '{"gender": "masculine", "article": "en", "definite": "armen", "plural": "armer"}'),
    (norwegian_id, 'hånd', 'hand', 9, 'noun', '{"gender": "feminine", "article": "ei/en", "definite": "hånda/hånden", "plural": "hender"}'),
    (norwegian_id, 'ben', 'leg', 9, 'noun', '{"gender": "neuter", "article": "et", "definite": "benet", "plural": "ben"}'),
    (norwegian_id, 'fot', 'foot', 9, 'noun', '{"gender": "masculine", "article": "en", "definite": "foten", "plural": "føtter"}'),
    
    -- LEVEL 9 NOUNS - Extended family
    (norwegian_id, 'mor', 'mother', 9, 'noun', '{"gender": "feminine", "article": "ei/en", "definite": "mora/moren", "plural": "mødre"}'),
    (norwegian_id, 'far', 'father', 9, 'noun', '{"gender": "masculine", "article": "en", "definite": "faren", "plural": "fedre"}'),
    (norwegian_id, 'søster', 'sister', 9, 'noun', '{"gender": "feminine", "article": "ei/en", "definite": "søstera/søsteren", "plural": "søstre"}'),
    (norwegian_id, 'bror', 'brother', 9, 'noun', '{"gender": "masculine", "article": "en", "definite": "broren", "plural": "brødre"}'),
    
    -- ========================================================================
    -- LEVEL 10: Food and meals
    -- ========================================================================
    
    -- LEVEL 10 NOUNS - Food items
    (norwegian_id, 'brød', 'bread', 10, 'noun', '{"gender": "neuter", "article": "et", "definite": "brødet", "plural": "brød"}'),
    (norwegian_id, 'melk', 'milk', 10, 'noun', '{"gender": "feminine", "article": "ei/en", "definite": "melka/melken", "plural": null}'),
    (norwegian_id, 'smør', 'butter', 10, 'noun', '{"gender": "neuter", "article": "et", "definite": "smøret", "plural": null}'),
    (norwegian_id, 'ost', 'cheese', 10, 'noun', '{"gender": "masculine", "article": "en", "definite": "osten", "plural": "oster"}'),
    (norwegian_id, 'egg', 'egg', 10, 'noun', '{"gender": "neuter", "article": "et", "definite": "egget", "plural": "egg"}'),
    (norwegian_id, 'kjøtt', 'meat', 10, 'noun', '{"gender": "neuter", "article": "et", "definite": "kjøttet", "plural": null}'),
    (norwegian_id, 'fisk', 'fish', 10, 'noun', '{"gender": "masculine", "article": "en", "definite": "fisken", "plural": "fisker"}'),
    (norwegian_id, 'frukt', 'fruit', 10, 'noun', '{"gender": "feminine", "article": "ei/en", "definite": "frukta/frukten", "plural": "frukter"}'),
    (norwegian_id, 'eple', 'apple', 10, 'noun', '{"gender": "neuter", "article": "et", "definite": "eplet", "plural": "epler"}'),
    (norwegian_id, 'banan', 'banana', 10, 'noun', '{"gender": "masculine", "article": "en", "definite": "bananen", "plural": "bananer"}'),
    
    -- LEVEL 10 NOUNS - Meals
    (norwegian_id, 'frokost', 'breakfast', 10, 'noun', '{"gender": "masculine", "article": "en", "definite": "frokosten", "plural": "frokoster"}'),
    (norwegian_id, 'lunsj', 'lunch', 10, 'noun', '{"gender": "masculine", "article": "en", "definite": "lunsjen", "plural": "lunsjer"}'),
    (norwegian_id, 'middag', 'dinner', 10, 'noun', '{"gender": "masculine", "article": "en", "definite": "middagen", "plural": "middager"}'),
    
    -- ========================================================================
    -- LEVEL 11: Clothing and appearance
    -- ========================================================================
    
    -- LEVEL 11 NOUNS - Clothing
    (norwegian_id, 'klær', 'clothes', 11, 'noun', '{"gender": "neuter", "article": null, "definite": "klærne", "plural": "klær"}'),
    (norwegian_id, 'skjorte', 'shirt', 11, 'noun', '{"gender": "feminine", "article": "ei/en", "definite": "skjorta/skjorten", "plural": "skjorter"}'),
    (norwegian_id, 'bukse', 'trousers/pants', 11, 'noun', '{"gender": "feminine", "article": "ei/en", "definite": "buksa/buksen", "plural": "bukser"}'),
    (norwegian_id, 'kjole', 'dress', 11, 'noun', '{"gender": "feminine", "article": "ei/en", "definite": "kjolen", "plural": "kjoler"}'),
    (norwegian_id, 'sko', 'shoe', 11, 'noun', '{"gender": "masculine", "article": "en", "definite": "skoen", "plural": "sko"}'),
    (norwegian_id, 'jakke', 'jacket', 11, 'noun', '{"gender": "feminine", "article": "ei/en", "definite": "jakka/jakken", "plural": "jakker"}'),
    (norwegian_id, 'genser', 'sweater', 11, 'noun', '{"gender": "masculine", "article": "en", "definite": "genseren", "plural": "gensere"}'),
    (norwegian_id, 'sokk', 'sock', 11, 'noun', '{"gender": "masculine", "article": "en", "definite": "sokken", "plural": "sokker"}'),
    
    -- LEVEL 11 ADJECTIVES - Appearance
    (norwegian_id, 'pen', 'beautiful/pretty', 11, 'adjective', '{"masc_sing": "pen", "fem_sing": "pen", "neut_sing": "pent", "plural": "pene", "definite": "pene"}'),
    (norwegian_id, 'stygg', 'ugly', 11, 'adjective', '{"masc_sing": "stygg", "fem_sing": "stygg", "neut_sing": "stygt", "plural": "stygge", "definite": "stygge"}'),
    
    -- ========================================================================
    -- LEVEL 12: Weather and seasons
    -- ========================================================================
    
    -- LEVEL 12 NOUNS - Weather
    (norwegian_id, 'vær', 'weather', 12, 'noun', '{"gender": "neuter", "article": "et", "definite": "været", "plural": null}'),
    (norwegian_id, 'sol', 'sun', 12, 'noun', '{"gender": "feminine", "article": "ei/en", "definite": "sola/solen", "plural": "soler"}'),
    (norwegian_id, 'regn', 'rain', 12, 'noun', '{"gender": "neuter", "article": "et", "definite": "regnet", "plural": null}'),
    (norwegian_id, 'snø', 'snow', 12, 'noun', '{"gender": "masculine", "article": "en", "definite": "snøen", "plural": null}'),
    (norwegian_id, 'vind', 'wind', 12, 'noun', '{"gender": "masculine", "article": "en", "definite": "vinden", "plural": "vinder"}'),
    (norwegian_id, 'skye', 'cloud', 12, 'noun', '{"gender": "feminine", "article": "ei/en", "definite": "skya/skyen", "plural": "skyer"}'),
    
    -- LEVEL 12 NOUNS - Seasons
    (norwegian_id, 'vinter', 'winter', 12, 'noun', '{"gender": "masculine", "article": "en", "definite": "vinteren", "plural": "vintre"}'),
    (norwegian_id, 'vår', 'spring', 12, 'noun', '{"gender": "masculine", "article": "en", "definite": "våren", "plural": "vårer"}'),
    (norwegian_id, 'sommer', 'summer', 12, 'noun', '{"gender": "masculine", "article": "en", "definite": "sommeren", "plural": "somre"}'),
    (norwegian_id, 'høst', 'autumn/fall', 12, 'noun', '{"gender": "masculine", "article": "en", "definite": "høsten", "plural": "høster"}'),
    
    -- LEVEL 12 ADJECTIVES - Weather descriptions
    (norwegian_id, 'varm', 'warm', 12, 'adjective', '{"masc_sing": "varm", "fem_sing": "varm", "neut_sing": "varmt", "plural": "varme", "definite": "varme"}'),
    (norwegian_id, 'kald', 'cold', 12, 'adjective', '{"masc_sing": "kald", "fem_sing": "kald", "neut_sing": "kaldt", "plural": "kalde", "definite": "kalde"}'),
    (norwegian_id, 'våt', 'wet', 12, 'adjective', '{"masc_sing": "våt", "fem_sing": "våt", "neut_sing": "vått", "plural": "våte", "definite": "våte"}'),
    (norwegian_id, 'tørr', 'dry', 12, 'adjective', '{"masc_sing": "tørr", "fem_sing": "tørr", "neut_sing": "tørt", "plural": "tørre", "definite": "tørre"}'),
    
    -- ========================================================================
    -- LEVEL 13: Colors and more descriptions
    -- ========================================================================
    
    -- LEVEL 13 ADJECTIVES - Colors
    (norwegian_id, 'grønn', 'green', 13, 'adjective', '{"masc_sing": "grønn", "fem_sing": "grønn", "neut_sing": "grønt", "plural": "grønne", "definite": "grønne"}'),
    (norwegian_id, 'gul', 'yellow', 13, 'adjective', '{"masc_sing": "gul", "fem_sing": "gul", "neut_sing": "gult", "plural": "gule", "definite": "gule"}'),
    (norwegian_id, 'svart', 'black', 13, 'adjective', '{"masc_sing": "svart", "fem_sing": "svart", "neut_sing": "svart", "plural": "svarte", "definite": "svarte"}'),
    (norwegian_id, 'hvit', 'white', 13, 'adjective', '{"masc_sing": "hvit", "fem_sing": "hvit", "neut_sing": "hvitt", "plural": "hvite", "definite": "hvite"}'),
    (norwegian_id, 'brun', 'brown', 13, 'adjective', '{"masc_sing": "brun", "fem_sing": "brun", "neut_sing": "brunt", "plural": "brune", "definite": "brune"}'),
    (norwegian_id, 'rosa', 'pink', 13, 'adjective', '{"masc_sing": "rosa", "fem_sing": "rosa", "neut_sing": "rosa", "plural": "rosa", "definite": "rosa"}'),
    (norwegian_id, 'lilla', 'purple', 13, 'adjective', '{"masc_sing": "lilla", "fem_sing": "lilla", "neut_sing": "lilla", "plural": "lilla", "definite": "lilla"}'),
    (norwegian_id, 'oransje', 'orange', 13, 'adjective', '{"masc_sing": "oransje", "fem_sing": "oransje", "neut_sing": "oransje", "plural": "oransje", "definite": "oransje"}'),
    
    -- LEVEL 13 ADJECTIVES - More descriptions
    (norwegian_id, 'tykk', 'thick/fat', 13, 'adjective', '{"masc_sing": "tykk", "fem_sing": "tykk", "neut_sing": "tykt", "plural": "tykke", "definite": "tykke"}'),
    (norwegian_id, 'tynn', 'thin', 13, 'adjective', '{"masc_sing": "tynn", "fem_sing": "tynn", "neut_sing": "tynt", "plural": "tynne", "definite": "tynne"}'),
    (norwegian_id, 'bred', 'wide', 13, 'adjective', '{"masc_sing": "bred", "fem_sing": "bred", "neut_sing": "bredt", "plural": "brede", "definite": "brede"}'),
    (norwegian_id, 'smal', 'narrow', 13, 'adjective', '{"masc_sing": "smal", "fem_sing": "smal", "neut_sing": "smalt", "plural": "smale", "definite": "smale"}'),
    
    -- ========================================================================
    -- LEVEL 14: Numbers and counting
    -- ========================================================================
    
    -- LEVEL 14 NUMBERS - Basic numbers
    (norwegian_id, 'null', 'zero', 14, 'number', '{"value": 0}'),
    (norwegian_id, 'en/ett', 'one', 14, 'number', '{"value": 1, "note": "en for masculine/feminine, ett for neuter"}'),
    (norwegian_id, 'to', 'two', 14, 'number', '{"value": 2}'),
    (norwegian_id, 'tre', 'three', 14, 'number', '{"value": 3}'),
    (norwegian_id, 'fire', 'four', 14, 'number', '{"value": 4}'),
    (norwegian_id, 'fem', 'five', 14, 'number', '{"value": 5}'),
    (norwegian_id, 'seks', 'six', 14, 'number', '{"value": 6}'),
    (norwegian_id, 'syv', 'seven', 14, 'number', '{"value": 7}'),
    (norwegian_id, 'åtte', 'eight', 14, 'number', '{"value": 8}'),
    (norwegian_id, 'ni', 'nine', 14, 'number', '{"value": 9}'),
    (norwegian_id, 'ti', 'ten', 14, 'number', '{"value": 10}'),
    
    -- ========================================================================
    -- LEVEL 15: House and home
    -- ========================================================================
    
    -- LEVEL 15 NOUNS - Parts of house
    (norwegian_id, 'rom', 'room', 15, 'noun', '{"gender": "neuter", "article": "et", "definite": "rommet", "plural": "rom"}'),
    (norwegian_id, 'kjøkken', 'kitchen', 15, 'noun', '{"gender": "neuter", "article": "et", "definite": "kjøkkenet", "plural": "kjøkken"}'),
    (norwegian_id, 'stue', 'living room', 15, 'noun', '{"gender": "feminine", "article": "ei/en", "definite": "stua/stuen", "plural": "stuer"}'),
    (norwegian_id, 'soverom', 'bedroom', 15, 'noun', '{"gender": "neuter", "article": "et", "definite": "soverommet", "plural": "soverom"}'),
    (norwegian_id, 'bad', 'bathroom', 15, 'noun', '{"gender": "neuter", "article": "et", "definite": "badet", "plural": "bad"}'),
    (norwegian_id, 'gang', 'hallway', 15, 'noun', '{"gender": "masculine", "article": "en", "definite": "gangen", "plural": "ganger"}'),
    (norwegian_id, 'tak', 'roof/ceiling', 15, 'noun', '{"gender": "neuter", "article": "et", "definite": "taket", "plural": "tak"}'),
    (norwegian_id, 'gulv', 'floor', 15, 'noun', '{"gender": "neuter", "article": "et", "definite": "gulvet", "plural": "gulv"}'),
    
    -- LEVEL 15 NOUNS - Furniture
    (norwegian_id, 'seng', 'bed', 15, 'noun', '{"gender": "feminine", "article": "ei/en", "definite": "senga/sengen", "plural": "senger"}'),
    (norwegian_id, 'sofa', 'sofa', 15, 'noun', '{"gender": "masculine", "article": "en", "definite": "sofaen", "plural": "sofaer"}'),
    (norwegian_id, 'lampe', 'lamp', 15, 'noun', '{"gender": "feminine", "article": "ei/en", "definite": "lampa/lampen", "plural": "lamper"}'),
    (norwegian_id, 'speil', 'mirror', 15, 'noun', '{"gender": "neuter", "article": "et", "definite": "speilet", "plural": "speil"}'),
    
    -- ========================================================================
    -- LEVEL 16: Daily activities
    -- ========================================================================
    
    -- LEVEL 16 VERBS - Daily routines
    (norwegian_id, 'å stå opp', 'to get up', 16, 'verb', '{"infinitive": "å stå opp", "present": "står opp", "past": "stod opp", "perfect": "stått opp"}'),
    (norwegian_id, 'å våkne', 'to wake up', 16, 'verb', '{"infinitive": "å våkne", "present": "våkner", "past": "våknet", "perfect": "våknet"}'),
    (norwegian_id, 'å sove', 'to sleep', 16, 'verb', '{"infinitive": "å sove", "present": "sover", "past": "sov", "perfect": "sovet"}'),
    (norwegian_id, 'å vaske', 'to wash', 16, 'verb', '{"infinitive": "å vaske", "present": "vasker", "past": "vasket", "perfect": "vasket"}'),
    (norwegian_id, 'å dusje', 'to shower', 16, 'verb', '{"infinitive": "å dusje", "present": "dusjer", "past": "dusjet", "perfect": "dusjet"}'),
    (norwegian_id, 'å pusse tenner', 'to brush teeth', 16, 'verb', '{"infinitive": "å pusse tenner", "present": "pusser tenner", "past": "pusset tenner", "perfect": "pusset tenner"}'),
    (norwegian_id, 'å jobbe', 'to work', 16, 'verb', '{"infinitive": "å jobbe", "present": "jobber", "past": "jobbet", "perfect": "jobbet"}'),
    (norwegian_id, 'å studere', 'to study', 16, 'verb', '{"infinitive": "å studere", "present": "studerer", "past": "studerte", "perfect": "studert"}'),
    
    -- ========================================================================
    -- LEVEL 17: Transportation
    -- ========================================================================
    
    -- LEVEL 17 NOUNS - Transportation
    (norwegian_id, 'buss', 'bus', 17, 'noun', '{"gender": "masculine", "article": "en", "definite": "bussen", "plural": "busser"}'),
    (norwegian_id, 'tog', 'train', 17, 'noun', '{"gender": "neuter", "article": "et", "definite": "toget", "plural": "tog"}'),
    (norwegian_id, 'fly', 'airplane', 17, 'noun', '{"gender": "neuter", "article": "et", "definite": "flyet", "plural": "fly"}'),
    (norwegian_id, 'båt', 'boat', 17, 'noun', '{"gender": "masculine", "article": "en", "definite": "båten", "plural": "båter"}'),
    (norwegian_id, 'sykkel', 'bicycle', 17, 'noun', '{"gender": "masculine", "article": "en", "definite": "sykkelen", "plural": "sykler"}'),
    (norwegian_id, 'trikk', 'tram', 17, 'noun', '{"gender": "masculine", "article": "en", "definite": "trikken", "plural": "trikker"}'),
    (norwegian_id, 'T-bane', 'subway/metro', 17, 'noun', '{"gender": "masculine", "article": "en", "definite": "T-banen", "plural": "T-baner"}'),
    
    -- LEVEL 17 VERBS - Movement
    (norwegian_id, 'å kjøre', 'to drive', 17, 'verb', '{"infinitive": "å kjøre", "present": "kjører", "past": "kjørte", "perfect": "kjørt"}'),
    (norwegian_id, 'å reise', 'to travel', 17, 'verb', '{"infinitive": "å reise", "present": "reiser", "past": "reiste", "perfect": "reist"}'),
    (norwegian_id, 'å fly', 'to fly', 17, 'verb', '{"infinitive": "å fly", "present": "flyr", "past": "fløy", "perfect": "fløyet"}'),
    
    -- ========================================================================
    -- LEVEL 18: Animals and nature
    -- ========================================================================
    
    -- LEVEL 18 NOUNS - Animals
    (norwegian_id, 'dyr', 'animal', 18, 'noun', '{"gender": "neuter", "article": "et", "definite": "dyret", "plural": "dyr"}'),
    (norwegian_id, 'fugl', 'bird', 18, 'noun', '{"gender": "masculine", "article": "en", "definite": "fuglen", "plural": "fugler"}'),
    (norwegian_id, 'hest', 'horse', 18, 'noun', '{"gender": "masculine", "article": "en", "definite": "hesten", "plural": "hester"}'),
    (norwegian_id, 'ku', 'cow', 18, 'noun', '{"gender": "feminine", "article": "ei/en", "definite": "kua/kuen", "plural": "kyr"}'),
    (norwegian_id, 'gris', 'pig', 18, 'noun', '{"gender": "masculine", "article": "en", "definite": "grisen", "plural": "griser"}'),
    (norwegian_id, 'sau', 'sheep', 18, 'noun', '{"gender": "masculine", "article": "en", "definite": "sauen", "plural": "sauer"}'),
    (norwegian_id, 'mus', 'mouse', 18, 'noun', '{"gender": "feminine", "article": "ei/en", "definite": "musa/musen", "plural": "mus"}'),
    
    -- LEVEL 18 NOUNS - Nature
    (norwegian_id, 'tre', 'tree', 18, 'noun', '{"gender": "neuter", "article": "et", "definite": "treet", "plural": "trær"}'),
    (norwegian_id, 'blomst', 'flower', 18, 'noun', '{"gender": "masculine", "article": "en", "definite": "blomsten", "plural": "blomster"}'),
    (norwegian_id, 'gress', 'grass', 18, 'noun', '{"gender": "neuter", "article": "et", "definite": "gresset", "plural": null}'),
    (norwegian_id, 'skog', 'forest', 18, 'noun', '{"gender": "masculine", "article": "en", "definite": "skogen", "plural": "skoger"}'),
    (norwegian_id, 'fjell', 'mountain', 18, 'noun', '{"gender": "neuter", "article": "et", "definite": "fjellet", "plural": "fjell"}'),
    (norwegian_id, 'sjø', 'lake/sea', 18, 'noun', '{"gender": "masculine", "article": "en", "definite": "sjøen", "plural": "sjøer"}'),
    
    -- ========================================================================
    -- LEVEL 19: Professions and work
    -- ========================================================================
    
    -- LEVEL 19 NOUNS - Professions
    (norwegian_id, 'lærer', 'teacher', 19, 'noun', '{"gender": "masculine", "article": "en", "definite": "læreren", "plural": "lærere"}'),
    (norwegian_id, 'lege', 'doctor', 19, 'noun', '{"gender": "masculine", "article": "en", "definite": "legen", "plural": "leger"}'),
    (norwegian_id, 'sykepleier', 'nurse', 19, 'noun', '{"gender": "masculine", "article": "en", "definite": "sykepleieren", "plural": "sykepleiere"}'),
    (norwegian_id, 'politi', 'police officer', 19, 'noun', '{"gender": "neuter", "article": "et", "definite": "politiet", "plural": "politi"}'),
    (norwegian_id, 'kokk', 'chef/cook', 19, 'noun', '{"gender": "masculine", "article": "en", "definite": "kokken", "plural": "kokker"}'),
    (norwegian_id, 'sjåfør', 'driver', 19, 'noun', '{"gender": "masculine", "article": "en", "definite": "sjåføren", "plural": "sjåfører"}'),
    (norwegian_id, 'frisør', 'hairdresser', 19, 'noun', '{"gender": "masculine", "article": "en", "definite": "frisøren", "plural": "frisører"}'),
    (norwegian_id, 'student', 'student', 19, 'noun', '{"gender": "masculine", "article": "en", "definite": "studenten", "plural": "studenter"}'),
    
    -- LEVEL 19 NOUNS - Work related
    (norwegian_id, 'kontor', 'office', 19, 'noun', '{"gender": "neuter", "article": "et", "definite": "kontoret", "plural": "kontorer"}'),
    (norwegian_id, 'fabrikk', 'factory', 19, 'noun', '{"gender": "masculine", "article": "en", "definite": "fabrikken", "plural": "fabrikker"}'),
    (norwegian_id, 'butikk', 'store/shop', 19, 'noun', '{"gender": "masculine", "article": "en", "definite": "butikken", "plural": "butikker"}'),
    
    -- ========================================================================
    -- LEVEL 20: Time expressions
    -- ========================================================================
    
    -- LEVEL 20 NOUNS - Time
    (norwegian_id, 'klokke', 'clock/time', 20, 'noun', '{"gender": "feminine", "article": "ei/en", "definite": "klokka/klokken", "plural": "klokker"}'),
    (norwegian_id, 'time', 'hour', 20, 'noun', '{"gender": "masculine", "article": "en", "definite": "timen", "plural": "timer"}'),
    (norwegian_id, 'minutt', 'minute', 20, 'noun', '{"gender": "neuter", "article": "et", "definite": "minuttet", "plural": "minutter"}'),
    (norwegian_id, 'sekund', 'second', 20, 'noun', '{"gender": "neuter", "article": "et", "definite": "sekundet", "plural": "sekunder"}'),
    (norwegian_id, 'uke', 'week', 20, 'noun', '{"gender": "feminine", "article": "ei/en", "definite": "uka/uken", "plural": "uker"}'),
    (norwegian_id, 'måned', 'month', 20, 'noun', '{"gender": "masculine", "article": "en", "definite": "måneden", "plural": "måneder"}'),
    (norwegian_id, 'år', 'year', 20, 'noun', '{"gender": "neuter", "article": "et", "definite": "året", "plural": "år"}'),
    
    -- LEVEL 20 PHRASES - Time expressions
    (norwegian_id, 'på mandag', 'on Monday', 20, 'phrase', '{"type": "time_expression", "day": "Monday"}'),
    (norwegian_id, 'klokka åtte', 'at eight o''clock', 20, 'phrase', '{"type": "time_expression", "time": "8:00"}'),
    (norwegian_id, 'om morgenen', 'in the morning', 20, 'phrase', '{"type": "time_expression", "period": "morning"}');
    
    RAISE NOTICE 'Successfully populated Norwegian vocabulary with % words across 40 levels!', 
        (SELECT COUNT(*) FROM vocabulary WHERE language_id = norwegian_id);
    
END $$;

-- ============================================================================
-- VERIFICATION QUERY
-- ============================================================================
-- Run this to verify the data was inserted correctly:

SELECT 
    level,
    type,
    COUNT(*) as word_count
FROM vocabulary v 
JOIN language l ON v.language_id = l.id 
WHERE l.name = 'Norwegian'
GROUP BY level, type
ORDER BY level, type;
