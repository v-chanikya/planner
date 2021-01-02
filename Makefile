help:
	echo "options: pkgs env"

env:
	curl -sL https://deb.nodesource.com/setup_10.x | sudo bash -
	pip3 install virtualenv
	sudo apt install nodejs

pkgs:
	pip install -r requirements.txt
	make -C webapp
