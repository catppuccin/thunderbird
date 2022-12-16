#!/bin/bash

which zip &>/dev/null || (echo "This script requires `zip`" && exit 1)

for folder in * ;
do
  if [ -d "$folder" ];
  then
    cd "${folder}"
    echo "Creating ${folder}.xpi"
    if [ -f "../../themes/${folder}.xpi" ];
    then
      rm "../../themes/${folder}.xpi"
    fi
    zip -r -q -9 ../../themes/${folder}.xpi .
    cd ..
  fi
done

