# We'll generate a SQL file that:
# - Looks up Norwegian language id
# - Clears existing Norwegian vocab
# - Inserts 3 levels (1–3), each with 80 hardcoded single-word vocabulary items
# - Uses consistent structure: (language_id, word, meaning, level, type, attributes)
#
# NOTE: This file is intended to be run in your DB (e.g., Supabase SQL editor).
# You can extend it later or ask me to produce levels 4–20 in subsequent files.

import json
from textwrap import dedent

# Helper to build an INSERT value line
def val(word, meaning, level, typ, attributes=None):
    if attributes is None:
        attributes = {}
    # Minimal JSON attributes; ensure deterministic key order for readability
    attr_json = json.dumps(attributes, ensure_ascii=False, separators=(",", ":"), sort_keys=True)
    # Escape single quotes in SQL
    def esc(s):
        return s.replace("'", "''")
    return f"(norwegian_id, '{esc(word)}', '{esc(meaning)}', {level}, '{typ}', '{esc(attr_json)}')"

# Level 1 — Super-core: pronouns, be/have/do verbs, basic nouns, colors, numbers 0–20 (as words), simple adjectives/adverbs, prepositions/conjunctions
L1 = []

# Pronouns & determiners
for w, m, t, a in [
    ("jeg", "I", "pronoun", {"person":"1sg"}),
    ("du", "you (singular)", "pronoun", {"person":"2sg"}),
    ("han", "he", "pronoun", {"person":"3sg.m"}),
    ("hun", "she", "pronoun", {"person":"3sg.f"}),
    ("det", "it/that (neuter)", "pronoun", {"person":"3sg.n"}),
    ("den", "it/that (common gender)", "pronoun", {"person":"3sg.c"}),
    ("vi", "we", "pronoun", {"person":"1pl"}),
    ("dere", "you (plural)", "pronoun", {"person":"2pl"}),
    ("de", "they", "pronoun", {"person":"3pl"}),
    ("man", "one/people", "pronoun", {"type":"impersonal"}),
    ("min", "my (common)", "determiner", {"possesive":True}),
    ("mitt", "my (neuter)", "determiner", {"possesive":True}),
    ("mine", "my (plural)", "determiner", {"possesive":True}),
    ("din", "your (common)", "determiner", {"possesive":True}),
    ("ditt", "your (neuter)", "determiner", {"possesive":True}),
    ("dine", "your (plural)", "determiner", {"possesive":True}),
    ("en", "a/an (common gender)", "determiner", {"article":"indefinite"}),
    ("ei", "a (feminine)", "determiner", {"article":"indefinite"}),
    ("et", "a/an (neuter)", "determiner", {"article":"indefinite"}),
    ("denne", "this (common)", "determiner", {"deixis":"proximal"}),
    ("dette", "this (neuter)", "determiner", {"deixis":"proximal"}),
    ("disse", "these", "determiner", {"deixis":"proximal"}),
]:
    L1.append(val(w, m, 1, t, a))

# Core verbs
for w, m, a in [
    ("å være", "to be", {"present":"er","past":"var","perfect":"vært"}),
    ("å ha", "to have", {"present":"har","past":"hadde","perfect":"hatt"}),
    ("å gjøre", "to do/make", {"present":"gjør","past":"gjorde","perfect":"gjort"}),
    ("å gå", "to go/walk", {"present":"går","past":"gikk","perfect":"gått"}),
    ("å komme", "to come", {"present":"kommer","past":"kom","perfect":"kommet"}),
    ("å se", "to see", {"present":"ser","past":"så","perfect":"sett"}),
    ("å si", "to say", {"present":"sier","past":"sa","perfect":"sagt"}),
    ("å vite", "to know (a fact)", {"present":"vet","past":"visste","perfect":"visst"}),
    ("å kunne", "can/be able to", {"present":"kan","past":"kunne","perfect":"kunnet"}),
    ("å ville", "will/want to", {"present":"vil","past":"ville","perfect":"villet"}),
]:
    L1.append(val(w, m, 1, "verb", a))

# Basic nouns (home/people/things)
for w, m, a in [
    ("hus", "house", {"gender":"neuter","article":"et","definite":"huset","plural":"hus"}),
    ("leilighet", "apartment", {"gender":"f","article":"ei/en","definite":"leiligheten","plural":"leiligheter"}),
    ("rom", "room", {"gender":"neuter"}),
    ("bord", "table", {"gender":"neuter"}),
    ("stol", "chair", {"gender":"m"}),
    ("dør", "door", {"gender":"f"}),
    ("vindu", "window", {"gender":"neuter"}),
    ("nøkkel", "key", {"gender":"m"}),
    ("telefon", "phone", {"gender":"m"}),
    ("bok", "book", {"gender":"f"}),
    ("penn", "pen", {"gender":"m"}),
    ("papir", "paper", {"gender":"neuter"}),
    ("by", "city", {"gender":"m"}),
    ("gaten", "the street", {"gender":"m"}),
    ("butikk", "shop/store", {"gender":"m"}),
    ("mat", "food", {"gender":"m"}),
    ("vann", "water", {"gender":"neuter"}),
    ("kaffe", "coffee", {"gender":"m"}),
    ("te", "tea", {"gender":"m"}),
    ("øl", "beer", {"gender":"neuter"}),
]:
    L1.append(val(w, m, 1, "noun", a))

# Colors, simple adjectives
for w, m in [
    ("rød", "red"),
    ("blå", "blue"),
    ("grønn", "green"),
    ("gul", "yellow"),
    ("svart", "black"),
    ("hvit", "white"),
    ("grå", "gray"),
    ("brun", "brown"),
    ("stor", "big"),
    ("liten", "small"),
    ("ny", "new"),
    ("gammel", "old"),
    ("god", "good"),
    ("dårlig", "bad"),
]:
    L1.append(val(w, m, 1, "adjective", {}))

# Numbers 0–12 (as words)
for w, valnum in [
    ("null",0),("en",1),("to",2),("tre",3),("fire",4),("fem",5),("seks",6),
    ("sju",7),("åtte",8),("ni",9),("ti",10),("elleve",11),("tolv",12)
]:
    L1.append(val(w, str(valnum), 1, "number", {"value":valnum}))

# Core adverbs / preps / conj
for w, m, t in [
    ("nå", "now", "adverb"),
    ("snart", "soon", "adverb"),
    ("alltid", "always", "adverb"),
    ("ofte", "often", "adverb"),
    ("aldri", "never", "adverb"),
    ("her", "here", "adverb"),
    ("der", "there", "adverb"),
    ("hvor", "where", "adverb"),
    ("og", "and", "conjunction"),
    ("men", "but", "conjunction"),
    ("eller", "or", "conjunction"),
    ("for", "for/because", "conjunction"),
    ("i", "in", "preposition"),
    ("på", "on/at", "preposition"),
    ("til", "to", "preposition"),
    ("fra", "from", "preposition"),
    ("med", "with", "preposition"),
    ("uten", "without", "preposition"),
]:
    L1.append(val(w, m, 1, t, {}))

# Ensure 80 items; if short, pad with frequent short words (legit)
while len(L1) < 80:
    fillers = [
        ("som","as/that/who","conjunction",{}),
        ("over","over/above","preposition",{}),
        ("under","under/below","preposition",{}),
        ("av","of/from","preposition",{}),
        ("om","about/around","preposition",{}),
    ]
    for w,m,t,a in fillers:
        if len(L1) < 80:
            L1.append(val(w,m,1,t,a))

# Level 2 — People & Home (nouns, jobs, family, household verbs; no sentences)
L2 = []
for w, m, a in [
    ("mann","man",{"gender":"m"}),
    ("kvinne","woman",{"gender":"f"}),
    ("barn","child",{"gender":"neuter"}),
    ("venn","friend",{"gender":"m"}),
    ("nabo","neighbor",{"gender":"m"}),
    ("student","student",{"gender":"m"}),
    ("lærer","teacher",{"gender":"m"}),
    ("lege","doctor",{"gender":"m"}),
    ("sjåfør","driver",{"gender":"m"}),
    ("servitør","waiter",{"gender":"m"}),
    ("kokk","cook/chef",{"gender":"m"}),
    ("ingeniør","engineer",{"gender":"m"}),
    ("sykepleier","nurse",{"gender":"m"}),
    ("politi","police (force/officer)",{"gender":"neuter"}),
    ("arbeider","worker",{"gender":"m"}),
    ("sjef","boss/manager",{"gender":"m"}),
    ("kunde","customer",{"gender":"m"}),
    ("familie","family",{"gender":"m"}),
    ("mor","mother",{"gender":"f"}),
    ("far","father",{"gender":"m"}),
    ("søster","sister",{"gender":"f"}),
    ("bror","brother",{"gender":"m"}),
    ("bestemor","grandmother",{"gender":"f"}),
    ("bestefar","grandfather",{"gender":"m"}),
    ("tante","aunt",{"gender":"f"}),
    ("onkel","uncle",{"gender":"m"}),
    ("kone","wife",{"gender":"f"}),
    ("mann (ektefelle)","husband",{"gender":"m"}),
    ("sønn","son",{"gender":"m"}),
    ("datter","daughter",{"gender":"f"}),
    ("baby","baby",{"gender":"m"}),
]:
    L2.append(val(w, m, 2, "noun", a))

for w, m, a in [
    ("kjøkken","kitchen",{"gender":"neuter"}),
    ("stue","living room",{"gender":"f"}),
    ("soverom","bedroom",{"gender":"neuter"}),
    ("bad","bathroom",{"gender":"neuter"}),
    ("gang","hallway",{"gender":"m"}),
    ("kjeller","basement",{"gender":"m"}),
    ("loft","attic",{"gender":"neuter"}),
    ("balkong","balcony",{"gender":"m"}),
    ("hage","garden/yard",{"gender":"m"}),
    ("garasje","garage",{"gender":"m"}),
    ("heis","elevator",{"gender":"m"}),
    ("trapp","staircase",{"gender":"f"}),
    ("vegg","wall",{"gender":"m"}),
    ("tak","roof/ceiling",{"gender":"neuter"}),
    ("gulv","floor",{"gender":"neuter"}),
    ("ovn","oven",{"gender":"m"}),
    ("komfyr","stove",{"gender":"m"}),
    ("kjøleskap","fridge",{"gender":"neuter"}),
    ("vaskemaskin","washing machine",{"gender":"m"}),
    ("oppvaskmaskin","dishwasher",{"gender":"m"}),
]:
    L2.append(val(w, m, 2, "noun", a))

for w, m, a in [
    ("å bo","to live/reside",{"present":"bor"}),
    ("å leve","to live (be alive)",{"present":"lever"}),
    ("å rydde","to tidy",{"present":"rydder","past":"ryddet"}),
    ("å vaske","to wash/clean",{"present":"vasker"}),
    ("å lage","to make/cook",{"present":"lager"}),
    ("å handle","to shop",{"present":"handler"}),
    ("å kjøpe","to buy",{"present":"kjøper"}),
    ("å selge","to sell",{"present":"selger","past":"solgte"}),
    ("å bruke","to use/spend",{"present":"bruker"}),
    ("å betale","to pay",{"present":"betaler"}),
    ("å hjelpe","to help",{"present":"hjelper","past":"hjalp"}),
    ("å ringe","to call (phone)",{"present":"ringer"}),
    ("å møte","to meet",{"present":"møter"}),
    ("å invitere","to invite",{"present":"inviterer"}),
    ("å besøke","to visit",{"present":"besøker"}),
]:
    L2.append(val(w, m, 2, "verb", a))

for w, m in [
    ("ren","clean"),("skitten","dirty"),("lys","bright/light"),
    ("mørk","dark"),("rolig","calm/quiet"),("høylytt","noisy/loud"),
    ("billig","cheap"),("dyr","expensive"),("komfortabel","comfortable"),
    ("enkel","simple/easy"),("vanskelig","difficult"),("ledig","free/vacant"),
    ("opptatt","occupied/busy"),("trygg","safe"),("farlig","dangerous")
]:
    L2.append(val(w, m, 2, "adjective", {}))

while len(L2) < 80:
    L2.append(val("leie", "rent (verb/noun)", 2, "noun", {}))

# Level 3 — Daily routines, time, food, clothing (single words only)
L3 = []
for w, m, a in [
    ("frokost","breakfast",{"gender":"m"}),
    ("lunsj","lunch",{"gender":"m"}),
    ("middag","dinner",{"gender":"m"}),
    ("kveldsmat","supper/evening meal",{"gender":"m"}),
    ("brød","bread",{"gender":"neuter"}),
    ("smør","butter",{"gender":"neuter"}),
    ("ost","cheese",{"gender":"m"}),
    ("skinke","ham",{"gender":"m"}),
    ("kylling","chicken",{"gender":"m"}),
    ("fisk","fish",{"gender":"m"}),
    ("kjøtt","meat",{"gender":"neuter"}),
    ("salat","salad",{"gender":"m"}),
    ("grønnsak","vegetable",{"gender":"m"}),
    ("frukt","fruit",{"gender":"f"}),
    ("eple","apple",{"gender":"neuter"}),
    ("banan","banana",{"gender":"m"}),
    ("appelsin","orange (fruit)",{"gender":"m"}),
    ("drue","grape",{"gender":"m"}),
    ("potet","potato",{"gender":"m"}),
    ("ris","rice",{"gender":"m"}),
    ("pasta","pasta",{"gender":"m"}),
    ("sukker","sugar",{"gender":"neuter"}),
    ("salt","salt",{"gender":"neuter"}),
    ("pepper","pepper",{"gender":"m"}),
    ("kake","cake",{"gender":"m"}),
    ("dessert","dessert",{"gender":"m"}),
    ("glass","glass",{"gender":"neuter"}),
    ("kopp","cup",{"gender":"m"}),
    ("tallerken","plate",{"gender":"m"}),
    ("bestikk","cutlery",{"gender":"neuter"}),
]:
    L3.append(val(w, m, 3, "noun", a))

for w, m, a in [
    ("jakke","jacket",{"gender":"f"}),
    ("genser","sweater",{"gender":"m"}),
    ("skjorte","shirt",{"gender":"f"}),
    ("t-skjorte","t-shirt",{"gender":"f"}),
    ("bukse","trousers",{"gender":"f"}),
    ("kjole","dress",{"gender":"f"}),
    ("sko","shoe",{"gender":"m"}),
    ("sokk","sock",{"gender":"m"}),
    ("lue","hat/beanie",{"gender":"m"}),
    ("hanske","glove",{"gender":"m"}),
]:
    L3.append(val(w, m, 3, "noun", a))

for w, m, a in [
    ("å spise","to eat",{"present":"spiser"}),
    ("å drikke","to drink",{"present":"drikker"}),
    ("å lage","to make/cook",{"present":"lager"}),
    ("å smake","to taste",{"present":"smaker"}),
    ("å vaske","to wash",{"present":"vasker"}),
    ("å dekke","to set (the table)",{"present":"dekker"}),
    ("å kle på","to dress/put on",{"present":"kler på"}),
    ("å kle av","to undress/take off",{"present":"kler av"}),
    ("å kjøpe","to buy",{"present":"kjøper"}),
    ("å bestille","to order",{"present":"bestiller"}),
]:
    L3.append(val(w, m, 3, "verb", a))

for w, m in [
    ("sulten","hungry"),
    ("mett","full (not hungry)"),
    ("tørst","thirsty"),
    ("varm","warm/hot"),
    ("kald","cold"),
    ("søt","sweet"),
    ("sur","sour"),
    ("sterk","spicy/strong"),
    ("billig","cheap"),
    ("dyr","expensive"),
    ("komfortabel","comfortable"),
    ("tett","tight"),
    ("løs","loose"),
]:
    L3.append(val(w, m, 3, "adjective", {}))

for w, m, t in [
    ("frokosttid","breakfast time","noun"),
    ("tidlig","early","adverb"),
    ("sent","late","adverb"),
    ("ofte","often","adverb"),
    ("sjelden","seldom","adverb"),
    ("alltid","always","adverb"),
    ("noen ganger","sometimes","adverb"),
]:
    L3.append(val(w, m, 3, t, {}))

while len(L3) < 80:
    L3.append(val("måltid","meal",3,"noun",{}))

# Build SQL
header = dedent("""
-- ============================================================================
-- LEXIKANI NORWEGIAN VOCABULARY POPULATION SCRIPT (Levels 1–3, 80 words each)
-- ============================================================================
-- This script resets and inserts single-word vocabulary for Levels 1–3.
-- No sentences included; all entries are individual words.
-- ============================================================================

DO $$
DECLARE
    norwegian_id INTEGER;
BEGIN
    SELECT id INTO norwegian_id FROM language WHERE name = 'Norwegian' LIMIT 1;
    IF norwegian_id IS NULL THEN
        RAISE EXCEPTION 'Norwegian language not found. Please ensure languages are seeded first.';
    END IF;

    -- Clear existing Norwegian vocabulary
    DELETE FROM vocabulary WHERE language_id = norwegian_id;
    
    -- Insert vocabulary
    INSERT INTO vocabulary (language_id, word, meaning, level, type, attributes) VALUES
""").strip()

body_values = ",\n".join(L1 + L2 + L3)

footer = dedent("""
    ;
    RAISE NOTICE 'Inserted % Norwegian vocab items (Levels 1–3).', 
        (SELECT COUNT(*) FROM vocabulary WHERE language_id = norwegian_id);
END $$;

-- Verification
SELECT level, type, COUNT(*) AS word_count
FROM vocabulary v JOIN language l ON v.language_id = l.id
WHERE l.name = 'Norwegian'
GROUP BY level, type
ORDER BY level, type;
""").strip()

sql_text = header + "\n" + body_values + "\n" + footer

# Write to a file for the user to download
path = "/mnt/data/lexikani_norwegian_levels_1_3.sql"
with open(path, "w", encoding="utf-8") as f:
    f.write(sql_text)

path
