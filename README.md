# fastify-redis-channels-sse-example

An example used for a [fastify-redis-channels](https://github.com/hearit-io/fastify-redis-channels) plugin. 

## Table of Contents

* [Install](#install)
* [Usage](#usage)
* [Authors and acknowledgment](#authors-and-acknowledgment)
* [License](#license)

## Install

Create a directory and clone the example repository as shown bellow:

```shell
mkdir sse
git clone https://github.com/hearit-io/fastify-redis-channels-sse-example sse
cd sse
npm install
```

## Usage

To try this example make sure you have up and running Redis server on the default host `localhost' and port `6379`. For more info about the installation see on Redis [download](https://redis.io/download) page.

Start a server with a command:

```shell
node server
```

Open on a browser window the url `http://localhost:3333`

Open a new shell and produce a SSE message by calling for example:

```shell
cd sse
node produce 'Hello Wold'
```

You should see an updated information on a browser window.


## Authors and acknowledgment

Emil Usunov

[hearit.io](https://hearit.io)

## License

MIT
