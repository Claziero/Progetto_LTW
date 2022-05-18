# EventHub
Progetto EventHub [Linguaggi e Tecnologie per il Web]

# Descrizione
EventHub è un sistema per l'organizzazione e la prenotazione di eventi, incontri, tornei e similari.
Il sistema prevede la possibilità di visualizzare nelle varie pagine tutti gli eventi organizzati, in corso e non. Ciascun evento, organizzato da un utente organizzatore, può essere prenotato da utenti standard (previa iscrizione) e organizzatori.

Ogni utente ha la possibilità di accedere al sistema tramite le proprie credenziali e visualizzare gli eventi a cui ha partecipato e quelli attualmente prenotati (disdicibili). Per ogni evento prenotato è presente la possibilità di stampare una ricevuta della prenotazione contenente un QR code univoco per la prenotazione.

Ogni utente ha anche la possibilità di accedere alla sezione "Impostazioni" per aggiornare le proprie credenziali di accesso o i propri dati di contatto.

Gli utenti standard possono poi chiedere di diventare utenti organizzatori, salendo di livello, tramite la propria sezione "Il mio profilo".

Gli utenti organizzatori possono inoltre:
- Gestire le richieste di utenti standard che vogliono diventare organizzatori
- Creare nuovi eventi ed eliminare i propri eventi creati nella sezione "Il mio profilo"

Ogni utente standard ha infine la possibilità di rimuovere il proprio account dal sistema qualora non volesse più utilizzarlo.

# Organizzazione dei file
I file vengono organizzati secondo la seguente struttura:
- Tutti i file statici che verranno usati sono nella cartella `/public/`, dove:
  - I fogli di stile vengono raccolti nella cartella `/public/css` (anche quelli di bootstrap e fontAwesome, solo i necessari)
  - Gli script JavaScript necessari per le funzioni avanzate del sistema vengono raccolti in `/public/js`
  - Le immagini e i loghi vengono raccolti nella cartella `/public/img/`
  - File necessari per il funzionamento di fontAwesome vengono raccolti in `/public/webfonts/`
- Le pagine previste dal sito vengono raccolte in `/views/`:
  - La sottocartella `/views/partials/` contiene delle parti di pagina HTML che vengono importati in più pagine, come l'header e il footer che rimangono comuni tra le pagine
  - La sottocartella `/views/layouts/` contiene i layout delle pagine (ne viene usato solo uno, `main.handlebars`)
- I file riguardanti la strutturazione e la gestione del database vengono raccolti in `/sql/`
- I file riguardanti la gestione del database lato server sono contenuti nella cartella `/lib/`, accessibile solo al server

Tutte le pagine HTML vengono salvate in formato `.handlebars`.

# Installazione
Per un funzionamento corretto dell'applicazione è necessario installare il gestore DB "PostGreSQL", e creare un nuovo DB con nome "EventHubDB" e password "biar" (la porta rimane quella di default). In alternativa è possibile cambiare i parametri di connessione al db appena citati nelle righe iniziali del file `/lib/db.js`.
Una volta creato il db basta eseguire nell'ordine gli script sql `createDb.sql`, `dataTry.sql`, `triggers.sql` (localizzati nella cartella `/sql/`)

È necessario inoltre avere `node.js` installato nel pc e tutti i pacchetti che l'applicazione richiede, installabili tramite il comando `npm i`

# Avvio
shell:# `node index`

browser: `127.0.0.1:3000`

# Autori
@Claziero, @andrea1199
