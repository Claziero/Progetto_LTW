/* Tabella Utenti iscritti 
 * Gli utenti possono essere di vari tipi (con vari privilegi):
 * Privilegi=0 => Utente standard
 * Privilegi=1 => Utente organizzatore 
 * Privilegi=2 => DBA (massimo livello di privilegi)
 * Password salvate in formato MD5
*/
CREATE TABLE Utente(
    CF                  CHAR(16),
    Nome                VARCHAR NOT NULL,
    Cognome             VARCHAR NOT NULL,
    DataNascita         DATE NOT NULL,
    Sesso               CHAR(1) NOT NULL,
    Email               VARCHAR NOT NULL,
    Passwd              VARCHAR NOT NULL,
    Verificato          BOOLEAN NOT NULL,
    Privilegi           INT NOT NULL,
    
    PRIMARY KEY (CF)
);

/* Tabella Eventi organizzati
 * Un evento può essere ancora disponibile oppure già passato (non prenotabile)
 * ed ha un numero limitato di posti.
*/
CREATE TABLE Evento(
    ID                  INT,
    Organizzatore       CHAR(16) NOT NULL,
    Titolo              VARCHAR NOT NULL,
    Tipo                VARCHAR,
    Luogo               VARCHAR,
    DataOra             DATETIME,
    PostiDisponibili    INT,
    Descrizione         VARCHAR,
    Disponibile         BOOLEAN,
    Passato             BOOLEAN,

    PRIMARY KEY (ID),
    FOREIGN KEY (Organizzatore) REFERENCES Utente
);

/* Tabella delle prenotazioni
 * Ogni persona può prenotare al massimo una sola volta ogni evento
*/
CREATE TABLE Prenotazione(
    ID_Evento           INT,
    CF_Utente           CHAR(16),
    DataOra             DATETIME,

    PRIMARY KEY (ID_Evento, CF_Utente),
    FOREIGN KEY (CF_Utente) REFERENCES Utente,
    FOREIGN KEY (ID_Evento) REFERENCES Evento
);

/* Inserimento utente DBA */
INSERT INTO Utente VALUES
    ('DBADBA12X34Y567Z', 'Database', 'Administrator', '2000-01-01', 'M', 'dba@pgsql.com', '74cc1c60799e0a786ac7094b532f01b1', true, 2);
