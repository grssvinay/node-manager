pwd
chmod "u+x" ./linux/start.sh
chmod "u+x" ./linux/stop.sh

default_shell=`dscl . -read ~/ UserShell | sed 's/UserShell: //'`
echo "DEFAULT SHELL: $default_shell"

if [ "$default_shell" = "/bin/zsh" ]; then
	echo "Identified ZHS as default shell. Exporting variables to ~/.zshrc"
	printf "%s\n" "export ALGORAND_DATA=\"\$HOME/node/data\"" "export PATH=\"\$HOME/node:\$PATH\"" >> ~/.zshrc
else
	echo "Identified ZHS as default shell. Exporting variables to ~/.zshrc"
	printf "%s\n" "export ALGORAND_DATA=\"\$HOME/node/data\"" "export PATH=\"\$HOME/node:\$PATH\"" >> ~/.bashrc
fi


mkdir -p ~/node
cd ~/node
pwd
wget https://raw.githubusercontent.com/algorand/go-algorand/rel/stable/cmd/updater/update.sh
ls -lt
chmod 544 update.sh
echo "AFTER CHMOD"
lt -lt
./update.sh -i -c stable -p ~/node -d ~/node/data -n

export ALGORAND_DATA="$HOME/node/data"
export PATH="$HOME/node:$PATH"

goal node stop
goal node start