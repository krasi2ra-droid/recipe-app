#!/bin/bash

while true
do
  echo "Pinging server..."
  curl -s https://recipe-app-3jmt.onrender.com/recipes > /dev/null
  sleep 300
done
