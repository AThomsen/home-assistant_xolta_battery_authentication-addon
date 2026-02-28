# Home Assistant Add-on: Xolta battery authentication helper

## What is this?

Helper for the [Xolta Solar Battery integration](https://github.com/AThomsen/home-assistant_xolta_battery) for the [Home Assistant operation system](https://www.home-assistant.io/).

Not to be used directly but called by the integration to get an access token from username and password.

## Installation

Go to Settings -> Add-ons -> Add-on store -> (kebab menu) -> Repositories -> Add "https://github.com/AThomsen/home-assistant_xolta_battery_authentication-addon".

Then search for _Xolta battery authentication_ and install it. Make sure to enable _Start on boot_.

Proceed to install the [Xolta Solar Battery integration](https://github.com/AThomsen/home-assistant_xolta_battery).


## Developing

Build `docker build --build-arg BUILD_FROM=ghcr.io/home-assistant/amd64-base:latest .`

Then test with 
~~~
curl -X POST http://localhost:8000/login \
    -H "Content-Type: application/json" \
    -d '{"username":"test@example.com","password":"p@ssW0rd!"}'
~~~
