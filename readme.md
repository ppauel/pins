# Unlimited Pins Bot

A work-in-progress fun project to play around with user installable app commands on Discord.

## Disclaimer

The app can only access messages to which the context menu command is applied. Every DM participant needs to install the same App instance in order to pin messages and view pins.

## Features

- `Pin` (context menu in DMs / GDMs)
- `/pins` (command in DMs / GDMs)

## Installation

1. Clone the repository
2. Install node modules
   ```sh
   npm install
   ```
3. Setup SQLite database
   ```sh
   npx prisma migrate dev --name init
   ```
4. Create your `.env` as shown in `.env.example`
5. Build the project
   ```sh
   npm run build
   ```
6. Start the bot
   ```sh
   node .
   ```
7. Add your App to your Discord account (needs to be user installable)
   ```
   https://discord.com/oauth2/authorize?client_id=YOUR_CLIENT_ID
   ```

## ToDo

- [ ] Unpin
- [ ] Pagination
- [ ] Attachment store
