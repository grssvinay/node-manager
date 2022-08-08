
pwd
chmod "u+x" ./darwin/start.sh
chmod "u+x" ./darwin/stop.sh

default_shell=`dscl . -read ~/ UserShell | sed 's/UserShell: //'`
echo "DEFAULT SHELL: $default_shell"

if [ "$default_shell" = "/bin/zsh" ]; then
	echo "Identified ZHS as default shell. Exporting variables to ~/.zshrc"
	printf "%s\n" "export ALGORAND_DATA=\"\$HOME/node/data\"" "export PATH=\"\$HOME/node:\$PATH\"" >> ~/.zshrc
else
	echo "Identified bash as default shell. Exporting variables to ~/.bashrc"
	printf "%s\n" "export ALGORAND_DATA=\"\$HOME/node/data\"" "export PATH=\"\$HOME/node:\$PATH\"" >> ~/.bashrc
fi



mkdir -p $HOME/node
cd $HOME/node
pwd
curl https://raw.githubusercontent.com/algorand/go-algorand/rel/stable/cmd/updater/update.sh -O
ls -lt
chmod 544 update.sh
echo "AFTER CHMOD"
ls -lt
./update.sh -i -c stable -p $HOME/node -d $HOME/node/data -n

export ALGORAND_DATA="$HOME/node/data"
export PATH="$HOME/node:$PATH"

goal node stop
goal node start