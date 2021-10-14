#!/bin/bash

echo >&2 "Waiting Backend to be up and running..."
wait-for-it.sh localhost:4000 --strict --timeout=5 -- echo "ahihi"
echo >&2 "Backend is now ready to handle connection."

