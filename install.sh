#!/bin/bash
echo "Installing libs..."
npm install
echo "Copying man pages..."
mkdir -p static/mans
IFS=':' read -ra MANPATHS <<< `man -w`
for i in "${MANPATHS[@]}"; do
  for j in $i/man[[:digit:]]/; do
    if [[ -d $j ]]; then
      yes | cp -rT $j ./mans${j#$i};
    fi
  done
done
echo "Creating indexes"
./gen_index.py
