#!/bin/bash

startServer() {

    read -p "Should I Proxy Server now ? (y/n): " start
    if [ $start = 'y' ]
    then

        read -p "Port number: " port
        pm2 kill && npm start $port

    else
        echo "Okay Tell me when you are ready :)"
    fi
}

setup() {

    if [ ! -f ".env" ]
    then
        touch .env
    fi

    if [ "$integratedMode" != "y" ]
    then
        read -p "Is this machine bare metal? (y/n) " isBareMetal
        read -p "BitBucket Username: " user
        read -sp "BitBucket Password: " pass

        if [ "$isBareMetal" = "y" ]
        then
            sudo apt-get update
            sudo apt-get install -y wget
            wget -qO- https://deb.nodesource.com/setup_6.x | bash -
            sudo apt-get install -y nodejs build-essential
        fi
    fi

    if [ "$backEndInstalled" != "y" ]
    then
        yarn install && yarn add -g pm2
        export backEndInstalled="y"

        echo "Backend Setup complete ========"
        startServer

    fi

    envvar="integratedMode=$integratedMode
    isBareMetal=$isBareMetal
    backEndInstalled=$backEndInstalled"

    echo $envvar > .env

}

read -p "Do you want to start Server from scratch? (y/n): " startAfresh

if [ $startAfresh = "y" ]
then
    setup
else

    if [ ! -f ".env" ]
    then

        echo "I don't you have setup this system"
        read -p  "Do you want to setup now ? (y/n): " setupNow
        if [ $setupNow = "y" ]
        then
            setup
        else
            echo "okay Bye"
            exit
        fi
    else

        startServer

    fi

fi
