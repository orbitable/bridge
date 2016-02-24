# bridge
A collection of web components and UI related to the Orbitable Application

## Quick start

#### Install engine

Download most recent version of engine **[here](https://github.com/orbitable/engine)**.

Place engine in same folder as bridge, e.g.

> orbitable/bridge

> orbitable/engine




#### Install node and bower

`sudo npm install -g gulp bower`

Install project components
(in project base directory)
`npm install && bower install`

Once dependencies are installed you can launch a test webserver which hosts an example of the angular application.

`gulp`

## Troubleshooting

For debian based systems you may get an error relating to not finding node.

Fix this by making a symbolic link to node's installed location:

`ln -s usr/bin/nodejs usr/bin/node`
