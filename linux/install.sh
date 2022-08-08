pwd
chmod "u+x" ./common-scripts/start.sh
chmod "u+x" ./common-scripts/stop.sh
chmod "u+x" ./common-scripts/catchup.sh

default_shell=$SHELL
echo "DEFAULT SHELL: $SHELL"

if [ "$default_shell" = "/bin/bash" ]; then
  echo "Identified bash as default shell. Exporting variables to ~/.bashrc"
  printf "%s\n" "export ALGORAND_DATA=\"\$HOME/node/data\"" "export PATH=\"\$HOME/node:\$PATH\"" >> ~/.bashrc
fi

DIR=$HOME/node
if [ ! -d "$DIR" ] || [ ! "$(ls -A $DIR)" ]; then
  rm -rf $DIR

  mkdir -p $DIR
  cd $DIR
  pwd
  wget https://raw.githubusercontent.com/algorand/go-algorand/rel/stable/cmd/updater/update.sh
  ls -lt
  chmod 544 update.sh
  echo "AFTER CHMOD"
  lt -lt
  ./update.sh -i -c stable -p $DIR -d $DIR/data -n

  export ALGORAND_DATA="$DIR/data"
  export PATH="$DIR:$PATH"

  goal node stop
  goal node start
else
  echo "Error: ${DIR} with files found. Can not continue with installation."
  exit 1
fi
