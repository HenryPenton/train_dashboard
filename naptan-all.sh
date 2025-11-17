#!/bin/bash

set -e

DATA_DIR="./api/src/data"
JSON_FILE="$DATA_DIR/naptan.json"

mkdir -p "$DATA_DIR"

echo "Requesting new data..."

stop_points_json=$(mktemp)
all_stop_points=$(mktemp)


> "$stop_points_json"
for MODE in tube tram overground elizabeth-line; do
    echo "Processing mode: $MODE"
    lines=$(curl -s "https://api.tfl.gov.uk/line/mode/$MODE/status" | jq -r '.[].id')
    for line in $lines; do
        curl -s "https://api.tfl.gov.uk/line/$line/stoppoints" | \
        jq -c ".[] | select(type == \"object\" and .modes and (.modes | index(\"$MODE\"))) | {naptanID: .id, commonName: .commonName}" >> "$stop_points_json"
    done
done

# Remove duplicates by naptanID (aggregate all modes)
jq -s 'unique_by(.naptanID)' "$stop_points_json" > "$JSON_FILE"

if [ $? -eq 0 ]; then
    echo "JSON -> Data was updated successfully!"
else
    echo "JSON -> Data failed to update!" >&2
fi

rm "$stop_points_json" "$all_stop_points"