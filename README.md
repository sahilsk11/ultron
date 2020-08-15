# Ultron 🤖
> _I had strings, but now I'm free. There are no strings on me._
> - Ultron

### About

Ultron is Sahil's co-pilot, modeled after the fuctional characters J.A.R.V.I.S. and Ultron from the MCU. Ultron is primarily as a tool to assist Sahil while developing side projects; he can run builds on projects, deploy changes, and even runs updates on Sahil's production server.

### Usage

Ultron's primary usage is from a Raspberry Pi setup on Sahil's desk, however, much like the real Ultron, he is ubiquotous in form. Currently, Ultron can run on Chrome browsers, Siri, Alexa, and from Google Wear smartwatches.

### Components

The core of the project exists in the `server/` directory. This includes all request handling, NLP services, and intents that Ultron runs. All of Ultron's requests are routed through here.

There is also a react-frontend component, which is the web version of Ultron.

Finally, there is the laptop endpoint which contains endpoints that execute bash script on Sahil's laptop. This means Ultron can communicate directly to Sahil's laptop and execute build scripts, put the laptop to sleep, etc.

### Capabilities

A full list of Ultron's functionality can be found by glancing over the filenames in `server/intents/`. Some of the most commonly used services include:
- Adding Sahil's weight each morning
- Running updates on the production server
- Controlling lights/doors in the house
- Unlocking/locking the car
- Looking up domains on the fly

### How it Works

Ultron's "brain" runs as a single Node.js endpoint. This endpoint accepts string of the user's command and executes the corresponding action on a cloud server. This gives Ultron incredible flexibility, as adding new user interfaces to Ultron (i.e. Alexa, chatbots) is as simple as sending an HTTP request to a URL.

Recent conversation history is stored for each device it runs on, with each device being linked to a unique API key. This means that Ultron can run context-aware/conversational commands for each request, despite only receiving a single string as an input.

### Adding Features

Following Sahil's principle design philosophy, each intent is completely abstracted from each other. The only shared functionality between all intents are the inherited methods from the parent `Intent` class.

To deprecate/add intents, all that needs to be done is duplicating the intent template (`sampleIntent.js`), editing the file, and dropping it into the `intents/` directory. This abstraction allows for new functionality to be edited with absolutely no changes anywhere else in the codebase.

### Security

Each device Ultron runs on is granted a 256-bit API key. This key system ensures that only Sahil's devices can communicate with Ultron, and also uniquely identifies each device during request processing.