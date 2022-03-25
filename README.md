# EventHub
Progetto EventHub [Linguaggi e Tecnologie per il Web]

# Descrizione
EventHub è un sistema per l'organizzazione e la prenotazione di eventi, incontri, tornei e similari.
Il sistema prevede la possibilità di visualizzare nelle varie pagine tutti gli eventi organizzati, in corso e non. Ciascun evento, organizzato da un utente organizzatore, può essere prenotato da utenti standard (previa iscrizione).

Ogni utente ha la possibilità di accedere al sistema tramite le proprie credenziali e visualizzare gli eventi a cui ha partecipato e quelli attualmente prenotati (disdicibili).

Ogni utente ha anche la possibilità di accedere alla sezione Impostazioni per aggiornare le proprie credenziali di accesso o i propri dati di contatto.

# Organizzazione dei file
I file vengono organizzati secondo la seguente struttura:
- I fogli di stile vengono raccolti nella cartella /css
- Le pagine previste dal sito vengono raccolte in /pages
  - La sottocartella /pages/utils contiene delle parti di pagina HTML che vengono importati in più pagine, come l'header e il footer che rimangono comuni tra le pagine
- I file riguardanti la strutturazione e la gestione del database vengono raccolti in /sql
- Gli script JavaScript necessari per le funzioni avanzate del sistema vengono raccolti in /js
- Files di stile Bootstrap vengono raccolti sotto /bootstrap
- Script PHP (principalmente per l'interazione con il DB) vengono raccolti sotto /php

Tutte le pagine vengono salvate in formato .php, tranne quelle che non contengono alcun riferimento PHP all'interno, in tal caso hanno estensione .html .

# Autori
@Claziero, @Andrea
