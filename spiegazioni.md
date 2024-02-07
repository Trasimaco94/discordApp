# LE FUNZIONI NEL DETTAGLIO 

## *deleteRoom*

1. **Verifica se l'utente è loggato**: 
   - `const isLogged = !!this.#userLogged;` controlla se l'utente è attualmente loggato verificando se `this.#userLogged` è diverso da `null`.
   - Se l'utente non è loggato, viene lanciato un errore con il messaggio "You are not logged in".

2. **Verifica se l'utente è un amministratore di almeno una stanza**:
   - `const isAdmin = this.#rooms.some(...)` verifica se l'utente attualmente loggato è un amministratore di almeno una stanza. Utilizza il metodo `some` sugli array per verificare se almeno un elemento soddisfa una determinata condizione.
   - Utilizziamo la funzione `some` per controllare se l'utente corrente è un amministratore di almeno una stanza. Se non lo è, viene lanciato un errore con il messaggio "You are not allowed to delete rooms".

3. **Trova l'indice della stanza da eliminare**:
   - `const roomIndex = this.#rooms.findIndex(...)` trova l'indice della stanza all'interno dell'array delle stanze.
   - `roomIndex` sarà l'indice della stanza da eliminare nell'array delle stanze.

4. **Verifica se la stanza è stata trovata**:
   - `if (roomIndex === -1)` controlla se l'indice trovato è -1, il che significa che la stanza non è stata trovata nell'array delle stanze.
   - Se la stanza non viene trovata, viene lanciato un errore con il messaggio "Room not found".

5. **Elimina la stanza dall'array delle stanze**:
   - `const deletedRoom = this.#rooms.splice(roomIndex, 1)[0];` rimuove la stanza dall'array delle stanze utilizzando il metodo `splice`, che prende l'indice della stanza da eliminare e il numero di elementi da eliminare (in questo caso 1).
   - `deletedRoom` conterrà i dati della stanza eliminata.

6. **Aggiorna il localStorage**:
   - `localStorage.setItem('rooms', JSON.stringify(this.#rooms));` aggiorna i dati delle stanze nell'archiviazione locale dopo l'eliminazione della stanza.

7. **Restituisce la stanza eliminata**:
   - `return deletedRoom;` restituisce i dati della stanza appena eliminata.

Infine, questo processo assicura che solo gli amministratori possano eliminare le stanze, e una volta eliminata, viene aggiornato lo stato locale dell'applicazione e restituito l'oggetto stanza eliminato.

## *inviteRoom*

1. **Raccolta dei parametri**:
   - `{ roomName, userId, permission = 'user' }: { roomName: TRoom['name']; userId: TUser['id']; permission?: 'moderator' | 'user' }`: Qui definiamo i parametri della funzione `inviteRoom` raccolti in un singolo oggetto. `roomName` rappresenta il nome della stanza, `userId` rappresenta l'ID dell'utente da invitare, e `permission` rappresenta il permesso assegnato all'utente che di default è 'user'.

2. **Verifica se l'utente è loggato**:
   - `const isLogged = !!this.#userLogged;`: Questo controllo verifica se l'utente è attualmente loggato verificando se `this.#userLogged` è diverso da `null`.
   - Se l'utente non è loggato, viene lanciato un errore con il messaggio "You are not logged in".

3. **Verifica se l'utente è un amministratore di almeno una stanza**:
   - `const isAdmin = this.#rooms.some(...)`: Utilizziamo il metodo `some` sugli array per verificare se l'utente corrente è un amministratore di almeno una stanza.
   - Se l'utente non è un amministratore di almeno una stanza, viene lanciato un errore con il messaggio "You are not allowed to invite users".

4. **Trova l'indice della stanza a cui si desidera invitare l'utente**:
   - `const roomIndex = this.#rooms.findIndex(...)`: Utilizziamo il metodo `findIndex` per trovare l'indice della stanza nell'array delle stanze.
   - Se la stanza non viene trovata, viene lanciato un errore con il messaggio "Room not found".

5. **Verifica se l'utente da invitare esiste**:
   - `const isUserExist = this.#users.some(...)`: Controlla se l'utente da invitare esiste all'interno dell'array degli utenti.
   - Se l'utente non esiste, viene lanciato un errore con il messaggio "User not found".

6. **Verifica se l'utente da invitare non è già presente nella stanza**:
   - `const isUserAlreadyInRoom = this.#rooms[roomIndex].users.some(...)`: Controlla se l'utente da invitare non è già presente nella stanza.
   - Se l'utente è già presente nella stanza, viene lanciato un errore con il messaggio "User is already in the room".

7. **Aggiorna la stanza con l'utente invitato**:
   - `const updatedRoom = {...}`: Creiamo un nuovo oggetto stanza con l'utente aggiunto all'array degli utenti della stanza.
   - `this.#rooms[roomIndex] = updatedRoom;`: Sostituiamo l'elemento corrispondente nell'array delle stanze con il nuovo oggetto stanza aggiornato.

8. **Salva gli aggiornamenti nel localStorage**:
   - `localStorage.setItem('rooms', JSON.stringify(this.#rooms));`: Aggiorniamo i dati delle stanze nell'archiviazione locale dopo l'invito dell'utente.

Infine, questa funzione permette agli amministratori di invitare utenti nelle stanze con il permesso specificato, assicurandosi che l'utente sia loggato, sia un amministratore della stanza, che la stanza esista e che l'utente da invitare non sia già presente nella stanza.

## *writeMessage*

1. **Raccolta dei parametri**:
   - `{ roomName, content, replyTo }: { roomName: TRoom['name']; content: TMessage['content']; replyTo?: TMessage['id'] }`: Qui definiamo i parametri della funzione `writeMessage` raccolti in un singolo oggetto. `roomName` rappresenta il nome della stanza in cui si desidera scrivere il messaggio, `content` rappresenta il contenuto del messaggio da scrivere e `replyTo` rappresenta l'ID del messaggio a cui il nuovo messaggio può essere una risposta (è opzionale).

2. **Verifica se l'utente è loggato**:
   - `const isLogged = !!this.#userLogged;`: Questo controllo verifica se l'utente è attualmente loggato verificando se `this.#userLogged` è diverso da `null`.
   - Se l'utente non è loggato, viene lanciato un errore con il messaggio "You are not logged in".

3. **Trova l'indice della stanza in cui si desidera scrivere il messaggio**:
   - `const roomIndex = this.#rooms.findIndex(room => room.name === roomName);`: Trova l'indice della stanza nell'array delle stanze utilizzando il nome della stanza fornito come parametro.
   - Se la stanza non viene trovata, viene lanciato un errore con il messaggio "Room not found".

4. **Verifica se l'utente è un membro della stanza**:
   - `const userInRoom = this.#rooms[roomIndex].users.find(user => user.idUser === this.#userLogged!.id);`: Verifica se l'utente attualmente loggato è un membro della stanza.
   - Se l'utente non è un membro della stanza, viene lanciato un errore con il messaggio "You are not a member of this room".

5. **Crea il nuovo messaggio**:
   - Viene creato un nuovo oggetto `message` contenente i dettagli del messaggio, come l'ID generato casualmente, il contenuto del messaggio, l'ID dell'utente che ha scritto il messaggio, l'ID della stanza e, se fornito, l'ID del messaggio a cui il nuovo messaggio risponde.

6. **Aggiungi il messaggio all'array dei messaggi della stanza**:
   - `this.#rooms[roomIndex].messages.push(message);`: Aggiunge il nuovo messaggio all'array dei messaggi della stanza.

7. **Salva gli aggiornamenti nel localStorage**:
   - `localStorage.setItem('rooms', JSON.stringify(this.#rooms));`: Aggiorna i dati delle stanze nell'archiviazione locale dopo l'aggiunta del nuovo messaggio.

Infine, questa funzione consente agli utenti di scrivere messaggi nelle stanze a cui sono membri, assicurandosi che l'utente sia loggato, che la stanza esista e che l'utente sia un membro della stanza.

## *deleteMessage*

1. **Raccolta dei parametri**:
   - `{ roomName, messageId }: { roomName: TRoom['name']; messageId: TMessage['id'] }`: Qui definiamo i parametri della funzione `deleteMessage` raccolti in un singolo oggetto. `roomName` rappresenta il nome della stanza dalla quale eliminare il messaggio e `messageId` rappresenta l'ID del messaggio da eliminare.

2. **Verifica se l'utente è loggato**:
   - `const isLogged = !!this.#userLogged;`: Questo controllo verifica se l'utente è attualmente loggato verificando se `this.#userLogged` è diverso da `null`.
   - Se l'utente non è loggato, viene lanciato un errore con il messaggio "You are not logged in".

3. **Trova l'indice della stanza in cui si trova il messaggio da eliminare**:
   - `const roomIndex = this.#rooms.findIndex(room => room.name === roomName);`: Trova l'indice della stanza nell'array delle stanze utilizzando il nome della stanza fornito come parametro.
   - Se la stanza non viene trovata, viene lanciato un errore con il messaggio "Room not found".

4. **Verifica se l'utente è un membro della stanza**:
   - `const userInRoom = this.#rooms[roomIndex].users.find(user => user.idUser === this.#userLogged!.id);`: Verifica se l'utente attualmente loggato è un membro della stanza.
   - Se l'utente non è un membro della stanza, viene lanciato un errore con il messaggio "You are not a member of this room".

5. **Trova l'indice del messaggio da eliminare nella stanza**:
   - `const messageIndex = this.#rooms[roomIndex].messages.findIndex(message => message.id === messageId);`: Trova l'indice del messaggio nell'array dei messaggi della stanza utilizzando l'ID del messaggio fornito come parametro.
   - Se il messaggio non viene trovato, viene lanciato un errore con il messaggio "Message not found".

6. **Elimina il messaggio dalla stanza**:
   - `this.#rooms[roomIndex].messages.splice(messageIndex, 1);`: Utilizzando il metodo `splice`, rimuoviamo il messaggio dall'array dei messaggi della stanza.

7. **Salva gli aggiornamenti nel localStorage**:
   - `localStorage.setItem('rooms', JSON.stringify(this.#rooms));`: Aggiorna i dati delle stanze nell'archiviazione locale dopo l'eliminazione del messaggio.

Infine, questa funzione consente agli utenti di eliminare i propri messaggi nelle stanze a cui sono membri, assicurandosi che l'utente sia loggato, che la stanza esista, che l'utente sia un membro della stanza e che il messaggio da eliminare esista nella stanza.

## *getMessageList*

1. **Verifica se l'utente è loggato**:
   - `const isLogged = !!this.#userLogged;`: Questa riga controlla se l'utente è attualmente loggato verificando se `this.#userLogged` è diverso da `null`. Se `this.#userLogged` è `null`, significa che l'utente non è loggato.
   - Se l'utente non è loggato, viene lanciato un errore con il messaggio "You are not logged in". Questo impedisce agli utenti non autenticati di accedere alla lista dei messaggi.

2. **Trova la stanza richiesta**:
   - `const room = this.#rooms.find(room => room.name === roomName);`: Questa riga cerca la stanza richiesta nell'array delle stanze `this.#rooms` utilizzando il nome della stanza fornito come parametro `roomName`.
   - Se la stanza non viene trovata (ovvero `room` è `undefined`), viene lanciato un errore con il messaggio "Room not found". Questo impedisce agli utenti di accedere alla lista dei messaggi di una stanza che non esiste.

3. **Verifica se l'utente è un membro della stanza**:
   - `const userInRoom = room.users.find(user => user.idUser === this.#userLogged!.id);`: Questa riga cerca l'utente corrente tra i membri della stanza `room` utilizzando l'ID dell'utente corrente `this.#userLogged!.id`.
   - Se l'utente non è un membro della stanza (ovvero `userInRoom` è `undefined`), viene lanciato un errore con il messaggio "You are not a member of this room". Questo impedisce agli utenti di accedere alla lista dei messaggi di una stanza di cui non sono membri.

4. **Costruzione della lista dei messaggi**:
   - `return room.messages.map(message => ({ ... }));`: Questa riga crea una nuova array contenente i dettagli rilevanti di ciascun messaggio nella stanza `room`. Utilizza il metodo `map` sull'array dei messaggi `room.messages` per trasformare ogni oggetto messaggio in un nuovo oggetto contenente solo l'ID del messaggio, il contenuto del messaggio, l'autore del messaggio e il timestamp di creazione.
   - Il risultato di questa operazione viene restituito come output della funzione `getMessageList`.

Infine, questa funzione restituisce una lista di messaggi dalla stanza specificata solo se l'utente è autenticato, se la stanza esiste e se l'utente è un membro della stanza. Questo aiuta a garantire che solo gli utenti autorizzati possano accedere ai messaggi della stanza.