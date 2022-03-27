/* Inserimento tuple di prova nel DB */
INSERT INTO Utente VALUES
    ('NRLUSR12X34Y567Z', 'Normal', 'User', '2000-01-01', 'M', 'normal@user.com', '74cc1c60799e0a786ac7094b532f01b1', true, 0),
    ('PRMUSR12X34Y567Z', 'Promoter', 'User', '2000-01-01', 'M', 'promoter@user.com', '74cc1c60799e0a786ac7094b532f01b1', true, 1);

INSERT INTO Evento VALUES
    (1, 'PRMUSR12X34Y567Z', 'Torneo di scacchi', 'Torneo', 'Rome, IT', '2022-04-01 10:30', 
        200, 'Evento torneo di scacchi. 4 persone', True, False),
    (2, 'PRMUSR12X34Y567Z', 'Duello di Wrestling', 'Singolo', 'Napoli, IT', '2022-04-01 11:30', 
        150, 'Evento duello di Wrestling. 2 persone', True, False),
    (3, 'PRMUSR12X34Y567Z', 'Torneo di giochi da tavolo', 'Torneo', 'Milano, IT', '2022-04-01 12:00',
        50, 'Evento torneo di giochi da tavolo. 4-8 persone', True, False),
    (4, 'PRMUSR12X34Y567Z', 'Torneo di braccio di ferro', 'Torneo', 'Rome, IT', '2022-03-01 10:30', 
        100, 'Evento torneo di braccio di ferro. 2 persone', True, False),
    (5, 'PRMUSR12X34Y567Z', 'Duello di scherma', 'Singolo', 'Napoli, IT', '2022-05-01 11:30', 
        30, 'Evento duello di scherma. 2 persone', True, False),
    (6, 'PRMUSR12X34Y567Z', 'Gara di motocross', 'Singolo', 'Milano, IT', '2022-04-21 12:00', 
        10, 'Evento gara di motocross. 8-12 persone', True, False);
