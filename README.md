# zcash-cli-cockpit (equihash coins)

zcash-cli cockpit plugin - a browser based wallet ui for zcash based coins (now multi-coin configurable)

## install cockpit

Cockpit is a very useful web interface for server admins.

Ubuntu 16.04
    
    sudo apt-get install cockpit

Fedora Server
    
    sudo dnf install cockpit

Access cockpit at the following url: https://localhost:9090/

## setup coin daemon wallet

This cockpit plugin requires the coin-cli binary to be in the executable path (/usr/bin).

    sudo ln -sr ./src/zcash-cli /usr/bin/zcash-cli
    
Below is a cheet sheet for getting up and running for multiple coins.

### zcash

    git clone https://github.com/zcash/zcash
    cd zcash
    git checkout master
    ./zcutil/build.sh -j2
    
    sudo ln -sr ./src/zcash-cli /usr/bin/zcash-cli

### zclassic

    git clone https://github.com/z-classic/zclassic
    cd zclassic
    git checkout master
    ./zcutil/build.sh -j2
    
    sudo ln -sr ./src/zcash-cli /usr/bin/zclassic-cli
    
### zencash

    git clone https://github.com/ZencashOfficial/zen
    cd zen
    git checkout master
    ./zcutil/build.sh -j2
    
    sudo ln -sr ./src/zen-cli /usr/bin/zen-cli
    
### hush

    git clone https://github.com/MyHush/hush
    cd hush
    git checkout master
    ./zcutil/build.sh -j2

    sudo ln -sr ./src/hush-cli /usr/bin/hush-cli
    
### bitcoinz

    git clone https://github.com/bitcoinz-pod/bitcoinz
    cd bitcoinz
    git checkout master
    ./zcutil/build.sh -j2

    sudo ln -sr ./src/zcash-cli /usr/bin/bitcoinz-cli

### votecoin

    git clone https://github.com/Tomas-M/VoteCoin
    cd VoteCoin
    git checkout master
    ./zcutil/build.sh -j2

    sudo ln -sr ./src/zcash-cli /usr/bin/votecoin-cli

### komodo (work-in-progress)

    git clone https://github.com/jl777/komodo
    cd komodo
    git checkout master
    ./zcutil/build.sh -j2
    
    sudo ln -sr ./src/komodo-cli /usr/bin/komodo-cli
    
## installing zcash-cli-cockpit plugin   
Cockpit will search ~/.local/share/cockpit/ directory for plugins.

    mkdir ~/.local/share/cockpit/

Change directory and clone the git repository.
    
    cd ~/.local/share/cockpit/
    git clone https://github.com/hellcatz/zcash-cli-cockpit
    
Copy `config_example.js` to `config.js` and modify as needed.

https://github.com/hellcatz/zcash-cli-cockpit/blob/multi-coin/config_example.js#L1-L7

Upgrading? Since there is no official relase at this time, you must "pull" the lastest from "master" using git.

    cd ~/.local/share/cockpit/zcash-cli-cockpit
    git pull

Open https://localhost:9090/ in your web browser and login to cockpit.

Look for a new menu entry under "Tools" called "zcash-cli".

# multi-coin setup

Change name of menu label for alternate coin.

https://github.com/hellcatz/zcash-cli-cockpit/blob/multi-coin/manifest.json#L6

Make sure to name your daemons and cli binaries unique! Example alternate coins below...

    sudo ln -sr ./src/hush-cli /usr/bin/hush-cli
    sudo ln -sr ./src/komodo-cli /usr/bin/komodo-cli
    sudo ln -sr ./src/zcash-cli /usr/bin/zclassic-cli
    sudo ln -sr ./src/zen-cli /usr/bin/zen-cli
    sudo ln -sr ./src/zcash-cli /usr/bin/zcash-cli

# donate to project author hellcatz

    Donate BTC: 17v5jgu57wGKJnwkhVHvgYhbCVTFt9xXSN
    Donate ZEC: t1bBgVQMfak2LZfCVVk88BGV3Cgu4crE3Ci
    Donate ZEN: znhGeka9zXmixvw6ufzGpcaSXcSACrjx5WZ
    Donate HUSH: t1JiGEWQCZ4T8CyZzMC1PWLUjvk4TqWEXgn
    Donate ZCL: t1f1xRt73TWgVWJQEFAW6DLwKtwmQvFahrN
    Donate KMD: R9xUuaZcodTmeKFrKdNR25gKgoBE47Jt88
    Donate BTCZ: t1MmkgcWyPuDQ8NkzfoKM8PUXTmjtofCSET

<a target="_blank" href="http://z.cash/">z.cash</a> -> 
<a target="_blank" href="https://github.com/zcash/zcash/blob/master/doc/payment-api.md">1.0 Payment API</a> |
<a target="_blank" href="https://github.com/zcash/zcash/wiki/1.0-User-Guide">1.0 User Guide</a> |
<a target="_blank" href="https://github.com/zcash/zcash/wiki/Mining-Guide">Mining Guide</a> |
<a target="_blank" href="https://z.cash/support/faq.html">FAQ</a> |
<a target="_blank" href="https://forum.z.cash/">Forums</a>
