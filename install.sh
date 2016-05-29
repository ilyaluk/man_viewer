#!/bin/bash
bower install
mkdir mans
IFS=':' read -ra MANPATHS <<< `man -w`
for i in "${MANPATHS[@]}"; do
  for j in $i/man[[:digit:]]/; do
    if [[ -d $j ]]; then
      yes | cp -rT $j ./mans${j#$i};
    fi
  done
done
python gen_index.py
