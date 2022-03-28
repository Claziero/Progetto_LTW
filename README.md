# EventHub
Progetto EventHub [Linguaggi e Tecnologie per il Web]

# Descrizione
EventHub è un sistema per l'organizzazione e la prenotazione di eventi, incontri, tornei e similari.
Il sistema prevede la possibilità di visualizzare nelle varie pagine tutti gli eventi organizzati, in corso e non. Ciascun evento, organizzato da un utente organizzatore, può essere prenotato da utenti standard (previa iscrizione).

Ogni utente ha la possibilità di accedere al sistema tramite le proprie credenziali e visualizzare gli eventi a cui ha partecipato e quelli attualmente prenotati (disdicibili).

Ogni utente ha anche la possibilità di accedere alla sezione Impostazioni per aggiornare le proprie credenziali di accesso o i propri dati di contatto.

# Organizzazione dei file
I file vengono organizzati secondo la seguente struttura:
- Tutti i file statici che verranno usati sono nella cartella /public, dove:
  - I fogli di stile vengono raccolti nella cartella /public/css (anche quelli di bootstrap, solo i necessari)
  - Gli script JavaScript necessari per le funzioni avanzate del sistema vengono raccolti in /public/js
- Le pagine previste dal sito vengono raccolte in /views
  - La sottocartella /views/partials contiene delle parti di pagina HTML che vengono importati in più pagine, come l'header e il footer che rimangono comuni tra le pagine
  - La sottocartella /views/layouts contiene i layout delle pagine
- I file riguardanti la strutturazione e la gestione del database vengono raccolti in /sql

Tutte le pagine vengono salvate in formato .handlebars, tranne quelle che non contengono alcun riferimento ai placeholder di handlebars all'interno, in tal caso hanno estensione .html .

# Autori
@Claziero, @andrea1199
