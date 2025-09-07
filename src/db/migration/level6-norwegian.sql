-- ============================================================================
-- LEXIKANI NORWEGIAN VOCABULARY RESET (Level 6, ≥90 words)
-- ============================================================================
-- Frequency-oriented, mixed, no reuse from 1–5. Deletes old L6 entries.
-- ============================================================================

DO $$
DECLARE
    norwegian_id INTEGER;
BEGIN
    SELECT id INTO norwegian_id FROM language WHERE name='Norwegian' LIMIT 1;
    IF norwegian_id IS NULL THEN
        RAISE EXCEPTION 'Norwegian language not found. Please seed first.';
    END IF;

    DELETE FROM vocabulary WHERE language_id=norwegian_id AND level=6;

    INSERT INTO vocabulary (language_id, word, meaning, level, type, attributes) VALUES
(norwegian_id, 'å starte', 'to start', 6, 'verb', '{"present":"starter"}'),
(norwegian_id, 'seng', 'bed', 6, 'noun', '{"gender":"f"}'),
(norwegian_id, 'ren', 'clean', 6, 'adjective', '{}'),
(norwegian_id, 'snart', 'soon', 6, 'adverb', '{}'),
(norwegian_id, 'å slutte', 'to stop/quit', 6, 'verb', '{"present":"slutter"}'),
(norwegian_id, 'pute', 'pillow', 6, 'noun', '{"gender":"m"}'),
(norwegian_id, 'skitten', 'dirty', 6, 'adjective', '{}'),
(norwegian_id, 'aldri', 'never', 6, 'adverb', '{}'),
(norwegian_id, 'å låne', 'to borrow/lend', 6, 'verb', '{"present":"låner"}'),
(norwegian_id, 'teppe', 'blanket', 6, 'noun', '{"gender":"neuter"}'),
(norwegian_id, 'vakker', 'beautiful', 6, 'adjective', '{}'),
(norwegian_id, 'alltid', 'always', 6, 'adverb', '{}'),
(norwegian_id, 'å spare', 'to save', 6, 'verb', '{"present":"sparer"}'),
(norwegian_id, 'gardin', 'curtain', 6, 'noun', '{"gender":"m"}'),
(norwegian_id, 'stygg', 'ugly', 6, 'adjective', '{}'),
(norwegian_id, 'ofte', 'often', 6, 'adverb', '{}'),
(norwegian_id, 'å kaste', 'to throw', 6, 'verb', '{"present":"kaster"}'),
(norwegian_id, 'gulv', 'floor', 6, 'noun', '{"gender":"neuter"}'),
(norwegian_id, 'mørk', 'dark', 6, 'adjective', '{}'),
(norwegian_id, 'sjelden', 'seldom', 6, 'adverb', '{}'),
(norwegian_id, 'å hente', 'to fetch/pick up', 6, 'verb', '{"present":"henter"}'),
(norwegian_id, 'tak', 'roof/ceiling', 6, 'noun', '{"gender":"neuter"}'),
(norwegian_id, 'lys', 'light/bright', 6, 'adjective', '{}'),
(norwegian_id, 'noen', 'some', 6, 'determiner', '{}'),
(norwegian_id, 'å bære', 'to carry', 6, 'verb', '{"past":"bar","perfect":"båret","present":"bærer"}'),
(norwegian_id, 'vegg', 'wall', 6, 'noun', '{"gender":"m"}'),
(norwegian_id, 'tom', 'empty', 6, 'adjective', '{}'),
(norwegian_id, 'ingen', 'none', 6, 'pronoun', '{}'),
(norwegian_id, 'å trekke', 'to pull', 6, 'verb', '{"past":"trakk","perfect":"trukket","present":"trekker"}'),
(norwegian_id, 'dør', 'door', 6, 'noun', '{"gender":"f"}'),
(norwegian_id, 'full', 'full', 6, 'adjective', '{}'),
(norwegian_id, 'hver', 'each/every', 6, 'determiner', '{}'),
(norwegian_id, 'å skyve', 'to push', 6, 'verb', '{"past":"skjøv","perfect":"skjøvet","present":"skyver"}'),
(norwegian_id, 'vindu', 'window', 6, 'noun', '{"gender":"neuter"}'),
(norwegian_id, 'gammeldags', 'old-fashioned', 6, 'adjective', '{}'),
(norwegian_id, 'hvilken', 'which (common)', 6, 'determiner', '{}'),
(norwegian_id, 'å åpne', 'to open', 6, 'verb', '{"present":"åpner"}'),
(norwegian_id, 'lys', 'light', 6, 'noun', '{"gender":"neuter"}'),
(norwegian_id, 'moderne', 'modern', 6, 'adjective', '{}'),
(norwegian_id, 'hvilket', 'which (neuter)', 6, 'determiner', '{}'),
(norwegian_id, 'å lukke', 'to close', 6, 'verb', '{"present":"lukker"}'),
(norwegian_id, 'lampe', 'lamp', 6, 'noun', '{"gender":"f"}'),
(norwegian_id, 'rolig', 'calm', 6, 'adjective', '{}'),
(norwegian_id, 'hvilke', 'which (plural)', 6, 'determiner', '{}'),
(norwegian_id, 'å sende', 'to send', 6, 'verb', '{"present":"sender"}'),
(norwegian_id, 'bord', 'table', 6, 'noun', '{"gender":"neuter"}'),
(norwegian_id, 'travel', 'busy', 6, 'adjective', '{}'),
(norwegian_id, 'enda', 'still/yet', 6, 'adverb', '{}'),
(norwegian_id, 'å motta', 'to receive', 6, 'verb', '{"present":"mottar"}'),
(norwegian_id, 'stol', 'chair', 6, 'noun', '{"gender":"m"}'),
(norwegian_id, 'nydelig', 'lovely', 6, 'adjective', '{}'),
(norwegian_id, 'fortsatt', 'still', 6, 'adverb', '{}'),
(norwegian_id, 'å forklare', 'to explain', 6, 'verb', '{"present":"forklarer"}'),
(norwegian_id, 'sofa', 'sofa', 6, 'noun', '{"gender":"m"}'),
(norwegian_id, 'enkel', 'simple', 6, 'adjective', '{}'),
(norwegian_id, 'allerede', 'already', 6, 'adverb', '{}'),
(norwegian_id, 'å vise', 'to show', 6, 'verb', '{"present":"viser"}'),
(norwegian_id, 'tv', 'TV', 6, 'noun', '{"gender":"m"}'),
(norwegian_id, 'komplisert', 'complicated', 6, 'adjective', '{}'),
(norwegian_id, 'kanskje', 'maybe', 6, 'adverb', '{}'),
(norwegian_id, 'å lære', 'to learn/teach', 6, 'verb', '{"present":"lærer"}'),
(norwegian_id, 'radio', 'radio', 6, 'noun', '{"gender":"m"}'),
(norwegian_id, 'praktisk', 'practical', 6, 'adjective', '{}'),
(norwegian_id, 'sikkert', 'certainly', 6, 'adverb', '{}'),
(norwegian_id, 'å undervise', 'to teach', 6, 'verb', '{"present":"underviser"}'),
(norwegian_id, 'avis', 'newspaper', 6, 'noun', '{"gender":"m"}'),
(norwegian_id, 'umulig', 'impossible', 6, 'adjective', '{}'),
(norwegian_id, 'gjerne', 'gladly', 6, 'adverb', '{}'),
(norwegian_id, 'å studere', 'to study', 6, 'verb', '{"present":"studerer"}'),
(norwegian_id, 'blad', 'magazine/leaf', 6, 'noun', '{"gender":"neuter"}'),
(norwegian_id, 'mulig', 'possible', 6, 'adjective', '{}'),
(norwegian_id, 'heller', 'rather', 6, 'adverb', '{}'),
(norwegian_id, 'å høre', 'to hear', 6, 'verb', '{"present":"hører"}'),
(norwegian_id, 'skrivebord', 'desk', 6, 'noun', '{"gender":"neuter"}'),
(norwegian_id, 'sammen', 'together', 6, 'adverb', '{}'),
(norwegian_id, 'å lytte', 'to listen', 6, 'verb', '{"present":"lytter"}'),
(norwegian_id, 'hylle', 'shelf', 6, 'noun', '{"gender":"m"}'),
(norwegian_id, 'alene', 'alone', 6, 'adverb', '{}'),
(norwegian_id, 'å danse', 'to dance', 6, 'verb', '{"present":"danser"}'),
(norwegian_id, 'bokhylle', 'bookshelf', 6, 'noun', '{"gender":"m"}'),
(norwegian_id, 'deretter', 'afterwards', 6, 'adverb', '{}'),
(norwegian_id, 'å synge', 'to sing', 6, 'verb', '{"present":"synger"}'),
(norwegian_id, 'datarom', 'computer room', 6, 'noun', '{"gender":"neuter"}'),
(norwegian_id, 'dessuten', 'besides', 6, 'adverb', '{}'),
(norwegian_id, 'å spille', 'to play', 6, 'verb', '{"present":"spiller"}'),
(norwegian_id, 'kjøkken', 'kitchen', 6, 'noun', '{"gender":"neuter"}'),
(norwegian_id, 'plutselig', 'suddenly', 6, 'adverb', '{}'),
(norwegian_id, 'å tegne', 'to draw', 6, 'verb', '{"present":"tegner"}'),
(norwegian_id, 'bad', 'bathroom', 6, 'noun', '{"gender":"neuter"}'),
(norwegian_id, 'å male', 'to paint', 6, 'verb', '{"present":"maler"}')
;
    RAISE NOTICE 'Rebuilt Level 6 with frequency-oriented mixed vocab. Rows in Level 6: %',
        (SELECT COUNT(*) FROM vocabulary v JOIN language l ON v.language_id=l.id WHERE l.name='Norwegian' AND level=6);
END $$;

-- Verify Level 6 distribution
SELECT type, COUNT(*) AS word_count
FROM vocabulary v JOIN language l ON v.language_id=l.id
WHERE l.name='Norwegian' AND level=6
GROUP BY type
ORDER BY type;