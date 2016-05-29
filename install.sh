#!/bin/bash
echo "Installing libs..."
bower install
echo "Copying man pages..."
mkdir mans
IFS=':' read -ra MANPATHS <<< `man -w`
for i in "${MANPATHS[@]}"; do
  for j in $i/man[[:digit:]]/; do
    if [[ -d $j ]]; then
      yes | cp -rT $j ./mans${j#$i};
    fi
  done
done
echo "Creating indexes"
python gen_index.py
