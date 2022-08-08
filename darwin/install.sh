pwd
chmod "u+x" ./common-scripts/start.sh
chmod "u+x" ./common-scripts/stop.sh
chmod "u+x" ./common-scripts/catchup.sh

default_shell=`dscl . -read ~/ UserShell | sed 's/UserShell: //'`
echo "DEFAULT SHELL: $default_shell"

if [ "$default_shell" = "/bin/zsh" ]; then
  echo "Identified ZHS as default shell. Exporting variables to ~/.zshrc"
  printf "%s\n" "export ALGORAND_DATA=\"\$HOME/node/data\"" "export PATH=\"\$HOME/node:\$PATH\"" >> ~/.zshrc
else
  echo "Identified bash as default shell. Exporting variables to ~/.bashrc"
  printf "%s\n" "export ALGORAND_DATA=\"\$HOME/node/data\"" "export PATH=\"\$HOME/node:\$PATH\"" >> ~/.bashrc
fi

DIR=$HOME/node
if [ ! -d "$DIR" ] || [ ! "$(ls -A $DIR)" ]; then
  rm -rf $DIR
  
  mkdir -p $DIR
  cd $DIR
  pwd
  curl https://raw.githubusercontent.com/algorand/go-algorand/rel/stable/cmd/updater/update.sh -O
  ls -lt
  chmod 544 update.sh
  echo "AFTER CHMOD"
  ls -lt
  ./update.sh -i -c stable -p $DIR -d $DIR/data -n

  export ALGORAND_DATA="$DIR/data"
  export PATH="$DIR:$PATH"

  goal node stop
  goal node start
else
  echo "Error: ${DIR} with files found. Can not continue with installation."
  exit 1
fi
