/* Inserimento tuple di prova nel DB */
INSERT INTO Users VALUES
    ('Normal', 'User', '2000-01-01', 'M', 'user', 'c2e91e2e25c962e8c913464dc27469d0', 0),
    ('Promoter', 'User', '2000-01-01', 'M', 'promoter', '6eb67e3155abcb9e647ea2fbb8178386', 1),
    ('Root', 'User', '1987-06-19', 'M', 'root', 'e4d38eb457992994cc35352da714f224', 1),
    ('Marco', 'Alberto', '2000-04-25', 'M', 'marco', '292acb4f4f036140438fbe0124f8a856', 0),
    ('Angelo', 'Paletta', '2000-04-25', 'M', 'fisher', '19b7728b8d80838cbd72d4bf72804661', 0),
    ('Mario', 'Destrorsi', '2000-04-25', 'M', 'mariod', '8f4d99e6986f24e404273fd67b4cdcc2', 0),
    ('Annamaria', 'Gonzalez', '2000-04-25', 'F', 'gonza', 'bc2c47c62d01724e1a9baab4e265bedf', 0),
    ('Chiara', 'Lesto', '2000-04-25', 'F', 'chiaral', 'd3558a654a9febf67075f580a09f034c', 0),
    ('Giorgio', 'Corvi', '2000-04-25', 'M', 'graven', 'df9629432aa9cb425a91158e93b1013d', 0),
    ('Tiziano', 'Acqua', '1990-04-23', 'M', 'tizq', 'a8fe87a7263f699d5b26226c531dcf1c', 0);

INSERT INTO ImgMapping VALUES 
    ('NONE', 'Nessuna immagine'),
    ('chess.png', 'Scacchi'),
    ('wrestling.png', 'Wrestling'),
    ('boardgame.png', 'Dadi (giochi da tavolo)'),
    ('armwrestling.png', 'Braccio di ferro'),
    ('tennis.png', 'Tennis'),
    ('volleyball.png', 'Pallone da pallavolo'),
    ('scherma.png', 'Scherma'),
    ('motocross.png', 'Motocross'),
    ('demolitionderby.png', 'Autoscontro'),
    ('sing.png', 'Microfono (canto)'),
    ('dance.png', 'Ballo'),
    ('carrace.png', 'F1 (corsa di auto)'),
    ('soccer.png', 'Pallone da calcio');


INSERT INTO Event VALUES
    -- Eventi passati
    (1, 'promoter', 'Torneo di scacchi', 'Torneo', 'Roma, IT', '2023-01-19 10:30', 
        50, 'Evento torneo di scacchi. 4 persone', False, True, 'chess.png'),
    (2, 'promoter', 'Duello di Wrestling', 'Singolo', 'Napoli, IT', '2023-02-20 11:30', 
        50, 'Evento duello di Wrestling. 2 persone', False, True, 'wrestling.png'),
    (3, 'promoter', 'Torneo di giochi da tavolo', 'Torneo', 'Milano, IT', '2023-03-22 12:00',
        20, 'Evento torneo di giochi da tavolo. 4-8 persone', False, True, 'boardgame.png'),
    
    -- Eventi correnti
    (4, 'promoter', 'Torneo di braccio di ferro', 'Torneo', 'Roma, IT', '2023-05-04 10:30', 
        40, 'Evento torneo di braccio di ferro. 2 persone', True, False, 'armwrestling.png'),
    (5, 'promoter', 'Torneo di tennis', 'Torneo', 'Verona, IT', '2023-05-15 19:30', 
        30, 'Evento torneo di tennis. 2 persone', True, False, 'tennis.png'),
    (6, 'promoter', 'Partita di pallavolo', 'Singolo', 'Firenze, IT', '2023-05-29 21:00', 
        90, 'Evento partita di pallavolo. 10 persone', True, False, 'volleyball.png'),
    (7, 'promoter', 'Duello di scherma', 'Singolo', 'Napoli, IT', '2023-05-31 11:30', 
        30, 'Evento duello di scherma. 2 persone', True, False, 'scherma.png'),
    (8, 'promoter', 'Gara di motocross', 'Singolo', 'Milano, IT', '2023-06-05 12:00', 
        60, 'Evento gara di motocross. 8-12 persone', True, False, 'motocross.png'),
    (9, 'promoter', 'Gara di autoscontro', 'Singolo', 'Bari, IT', '2023-06-22 12:00', 
        90, 'Evento gara di autoscontro. 8-12 persone', True, False, 'demolitionderby.png'),

    -- Eventi futuri
    (10, 'promoter', 'Torneo di D&D', 'Torneo', 'Bari, IT', '2023-08-24 12:00', 
        10, 'Evento torneo di Dungeons & Dragons. 6-8 persone', True, False, 'boardgame.png'),
    (11, 'promoter', 'Esibizione di canto', 'Singolo', 'Palermo, IT', '2023-09-27 12:00', 
        50, 'Evento esibizione di canto. 1 persona', True, False, 'sing.png'),
    (12, 'promoter', 'Torneo di ballo', 'Torneo', 'Verona, IT', '2023-11-30 12:00', 
        100, 'Evento torneo di ballo. 10-16 persone', True, False, 'dance.png');
