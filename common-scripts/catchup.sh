export ALGORAND_DATA="$HOME/node/data"
export PATH="$HOME/node:$PATH"

echo "Syncing Node Network of '$1' using Fast Catchup"
last_catch_point=$(curl https://algorand-catchpoints.s3.us-east-2.amazonaws.com/channel/$1/latest.catchpoint)

goal node catchup $last_catch_point
echo "Started fast catchup with: $last_catch_point"