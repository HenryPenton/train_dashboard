#!/bin/bash

# Usage: ./csv_to_json.sh input.csv > output.json

csv_file="$1"

awk -F, '
NR==1 {
  for (i=1; i<=NF; i++) {
    if ($i == "ATCOCode") atco_idx = i;
    if ($i == "CommonName") name_idx = i;
  }
  print "["
  next
}
{
  printf "  {\"ATCOCode\": \"%s\", \"CommonName\": \"%s\"}", $atco_idx, $name_idx
  if (NR != 2) print ","
}
END { print "\n]" }
' "$csv_file"