# Server

## Setup

To generate a working server on a new instance, you need the following hidden files:

### - .env
```
AIRTABLE_DREAM_API_KEY=
AIRTABLE_WORKOUT_API_KEY=
WHOIS_API_KEY=
KAPUR_KEY=
LAPTOP_KEY=
```

### - keychain.json
```
{
  "api_key": "ipad",
  "api_key": "watch",
  "api_key": "macDev",
  "api_key": "phone",
  "api_key": "macProd"
}
```

where `api_key` is the key for the name of the device.

Additionally, you need to rebuild the mimic script for your local machine.

Finally, you need to initialize an empty directory called "audio" that will store all `.wav.` files.