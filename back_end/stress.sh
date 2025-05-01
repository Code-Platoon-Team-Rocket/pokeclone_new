#!/bin/bash

echo "Increasing CPU utilization..."
while :; do
  dd if=/dev/zero of=/dev/null &
  dd if=/dev/zero of=/dev/null &
  dd if=/dev/zero of=/dev/null &
  dd if=/dev/zero of=/dev/null &
  sleep 1
done
