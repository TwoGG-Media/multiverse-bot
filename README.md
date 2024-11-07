# Multiverse Bot für Discord

Dieser Bot wurde mit Discord.js v14.15.2, enmap 6.0.2 und mysql 2.18.1 entwickelt.

## Installation

1. **Klone das Repository:**
   ```bash
   git clone [https://github.com/TwoGG-Media/multiverse-bot.git](https://github.com/TwoGG-Media/multiverse-bot.git)
   
2. **Navigiere in das Projektverzeichnis:**
   ```bash
   cd multiverse_bot

3. Installiere die Abhängigkeiten:
   ```bash
   npm install

4. Konfiguriere den Bot-Token:
   * Erstelle eine Datei namens config.json im Hauptverzeichnis des Projekts.
   * Füge den folgenden Code in die config.json ein und ersetze DEIN_BOT_TOKEN durch deinen tatsächlichen Bot-Token:
     ```json
     {
       "token": "DEIN_BOT_TOKEN"
     }

  ## Starten des Bots

* Direkt ausführen
  ```bash
  node /src/index.js
(Der Bot läuft nur solange, wie das Terminal geöffnet ist)

* Mit PM2 (empfohlen)
  ```bash
  sudo npm install -g pm2
  pm2 start src/index.js

* Mit forever
  ```bash
  sudo npm install -g forever
  forever start src/index.js

