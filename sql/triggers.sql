-- Funzione per diminuire di 1 il numero di posti disponibili dopo una booking
CREATE OR REPLACE FUNCTION diminuisci_posti() RETURNS TRIGGER AS
$$
	BEGIN
		UPDATE event
			SET seats = seats - 1
            WHERE ID = NEW.ID_Event;
		RETURN null;
	END;
$$ LANGUAGE PLPGSQL;

-- Funzione per aumentare di 1 il numero di posti disponibili dopo una disdetta della booking
CREATE OR REPLACE FUNCTION aumenta_posti() RETURNS TRIGGER AS
$$
	BEGIN
		UPDATE event
			SET seats = seats + 1
            WHERE ID = OLD.ID_Event;
		RETURN null;
	END;
$$ LANGUAGE PLPGSQL;

-- Triggers per attivare le funzioni
CREATE OR REPLACE TRIGGER trigger_insert_prenotazione AFTER INSERT ON booking
FOR EACH ROW EXECUTE PROCEDURE diminuisci_posti();

CREATE OR REPLACE TRIGGER trigger_delete_prenotazione AFTER DELETE ON booking
FOR EACH ROW EXECUTE PROCEDURE aumenta_posti();

-- Funzione per aggiornare i flag "passed" e "available" in base al timestamp attuale
CREATE OR REPLACE FUNCTION set_flags() RETURNS TRIGGER AS
$$
	BEGIN
		UPDATE event
			SET passed = true, available = false
            WHERE datetime < (SELECT NOW()::timestamp);
		RETURN null;
	END;
$$ LANGUAGE PLPGSQL;

-- Triggers per attivare la funzione
-- I flag verranno aggiornati ad ogni booking inserita o tolta
CREATE OR REPLACE TRIGGER trigger_insert_prenotazione_flags AFTER INSERT ON booking
FOR EACH ROW EXECUTE PROCEDURE set_flags();

CREATE OR REPLACE TRIGGER trigger_delete_prenotazione_flags AFTER DELETE ON booking
FOR EACH ROW EXECUTE PROCEDURE set_flags();
