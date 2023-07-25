#!/bin/bash
emcc -O3 tulipx/tulipx.c tulipx/tiamalgamation.c -o src/tulipx.js \
  -s SINGLE_FILE=1 \
  -s MODULARIZE=1 \
  -s EXPORT_NAME='tulipx' \
  -s ALLOW_MEMORY_GROWTH=1 \
  -s EXPORTED_FUNCTIONS='[
    "_free_task",
    "_free_current",
    "_reset",
    "_init",
    "_new_task",
    "_inputs_number",
    "_inputs_map",
    "_options_number",
    "_outputs_number",
    "_get_inputs_number",
    "_inputs_offset",
    "_outputs_offset",
    "_link_task",
    "_run_task",
    "_run",
    "_sum",
    "_mdb"
  ]'
