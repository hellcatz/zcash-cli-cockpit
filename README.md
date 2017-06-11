# zcash-cli-cockpit

zcash-cli cockpit plugin - a browser based wallet ui for zcash based coins

## install cockpit
Installing Cockpit in Ubuntu 16.04  
http://www.itzgeek.com/how-tos/linux/ubuntu-how-tos/install-cockpit-on-ubuntu-16-04.html

Fedora Server comes with Cockpit installed.

Access cockpit at the following url: https://localhost:9090/

## building coin wallet daemon

This cockpit plugin requires the zcash-cli binary to be in the executable path.

Make sure you create a symlink to your cli binary. See examples below.

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

    git clone ???
    cd zen
    git checkout master
    ./zcutil/build.sh -j2
    
    sudo ln -sr ./src/zen-cli /usr/bin/zen-cli
    
### komodo

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
    
Upgrading? Since there is no official relase at this time, you must "pull" the lastest from "master" using git.

    cd ~/.local/share/cockpit/zcash-cli-cockpit
    git pull

Open https://localhost:9090/ in your web browser and login to cockpit.
Look for a new menu entry under "Tools" called "zcash-cli".

# multi-coin setup

Change name of menu label for alternate coin.

    https://github.com/hellcatz/zcash-cli-cockpit/blob/multi-coin/manifest.json#L6
    
Change variables in zcash-cli.js

    https://github.com/hellcatz/zcash-cli-cockpit/blob/multi-coin/zcash-cli.js#L16-L20

Make sure to name your daemons and cli binaries unique! Example alternate coins below...

    sudo ln -sr ./src/komodo-cli /usr/bin/komodo-cli
    sudo ln -sr ./src/zcash-cli /usr/bin/zclassic-cli
    sudo ln -sr ./src/zen-cli /usr/bin/zen-cli
    sudo ln -sr ./src/zcash-cli /usr/bin/zcash-cli

# donate to project author hellcatz

    ZEC -> t1Qecf6zPTwWQ8eEhMHrux65gPQVYjKVDdq

    ZCL -> t1f1xRt73TWgVWJQEFAW6DLwKtwmQvFahrN

    KMD -> R9xUuaZcodTmeKFrKdNR25gKgoBE47Jt88

    BTC -> 17v5jgu57wGKJnwkhVHvgYhbCVTFt9xXSN

<a target="_blank" href="http://z.cash/">z.cash</a> -> 
<a target="_blank" href="https://github.com/zcash/zcash/blob/master/doc/payment-api.md">1.0 Payment API</a> |
<a target="_blank" href="https://github.com/zcash/zcash/wiki/1.0-User-Guide">1.0 User Guide</a> |
<a target="_blank" href="https://github.com/zcash/zcash/wiki/Mining-Guide">Mining Guide</a> |
<a target="_blank" href="https://z.cash/support/faq.html">FAQ</a> |
<a target="_blank" href="https://forum.z.cash/">Forums</a>
