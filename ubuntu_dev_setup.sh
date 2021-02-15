sudo apt update && sudo apt install -y python3-venv python3-pip
pip3 install -r requirements.txt
pip3 install pylint
code --install-extension ms-python.python

curl -sL https://deb.nodesource.com/setup_15.x | sudo -E bash -
sudo apt-get install -y nodejs
cd frontend
npm install
npm run build
