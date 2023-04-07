/* Tabella Utenti iscritti 
 * Gli utenti possono essere di vari tipi (con vari privilegi):
 * Privileges=0 => Users standard
 * Privileges=1 => Users organizzatore 
 * Privileges=2 => DBA (massimo livello di privilegi)
 * Privileges=3 => Users standard in attesa di diventare organizzatore
 * Password salvate in formato MD5
*/
CREATE TABLE Users(
    Name                VARCHAR NOT NULL,
    Surname             VARCHAR NOT NULL,
    Born                DATE NOT NULL,
    Gender              CHAR(1) NOT NULL,
    Username            VARCHAR,
    Password            VARCHAR NOT NULL,
    Privileges          INT NOT NULL,
    
    PRIMARY KEY (Username)
);

/* Tabella per il mapping tra il nome di un immagine e il suo titolo */
CREATE TABLE ImgMapping(
    Name                VARCHAR,
    Title               VARCHAR,

    PRIMARY KEY (Name)
);

/* Tabella Eventi organizzati
 * Un evento può essere ancora disponibile oppure già passed (non prenotabile)
 * ed ha un numero limitato di posti.
*/
CREATE TABLE Event(
    ID                  INT,
    Organizer           VARCHAR NOT NULL,
    Title               VARCHAR NOT NULL,
    Type                VARCHAR,
    Location            VARCHAR,
    DateTime            TIMESTAMP,
    Seats               INT,
    Description         VARCHAR,
    Available           BOOLEAN,
    Passed              BOOLEAN,
    Image               VARCHAR,

    PRIMARY KEY (ID),
    FOREIGN KEY (Organizer) REFERENCES Users,
    FOREIGN KEY (Image) REFERENCES ImgMapping
);

/* Tabella delle prenotazioni
 * Ogni persona può prenotare al massimo una sola volta ogni evento
*/
CREATE TABLE Booking(
    ID_Event           INT,
    Username_User      VARCHAR,
    DateTime           TIMESTAMP,

    PRIMARY KEY (ID_Event, Username_User),
    FOREIGN KEY (Username_User) REFERENCES Users,
    FOREIGN KEY (ID_Event) REFERENCES Event
);

/* Inserimento utente DBA */
INSERT INTO Users VALUES
    ('Database', 'Administrator', '2000-01-01', 'M', 'psqladmin', '63a9f0ea7bb98050796b649e85481845', 2);
