# What is this?
This is a simple project to track League of Legends ranks for a set number of players. This script is designed to be run periodically by another utility. Running this script will fetch the current rank of the defined players, then compare their current rank to the last rank retrieved by this script and post the comparisons via a discord webhook.

# Getting started
Follow the steps below to set up the project. The pre-requisites only have to be done once.

### Pre-requisites
- Create a `.env.local` file in the same directory as `.env`
- Get a Riot API developer key from https://developer.riotgames.com/. They're free, and can be used for personal development like this
- Load your API key into `.env.local` as `RiotAPIKey=PutYourKeyHere`
- Generate a webhook on a discord channel
- Load your webhook into `.env.local` as `DiscordWebhook=PutYourWebhookURLHere`
- Run `npm i` to install packages

### Running
- Run `npm run start` to run the script

### Modifying default users
By default this project will look for hard coded users defined in `src/helpers/default-players.helpers.ts`. You will have to update this file if you wish to override these players. 

