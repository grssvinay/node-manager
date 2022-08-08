export ALGORAND_DATA="$HOME/node/data"
export PATH="$HOME/node:$PATH"

ls $2

# last_catch_point=$(curl https://algorand-catchpoints.s3.us-east-2.amazonaws.com/channel/mainnet/latest.catchpoint)

# goal node catchup $last_catch_point