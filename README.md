# zcash-cli-cockpit (rc4)

zcash-cli cockpit plugin - a browser based wallet ui for zcash.

I am currently working towards renaming all the "testnet" references to "mainnet". For example, TAZ to ZEC.

<a target="_blank" href="http://z.cash/">z.cash</a> -> 
<a target="_blank" href="https://github.com/zcash/zcash/blob/v1.0.0/doc/payment-api.md">1.0 Payment API</a> |
<a target="_blank" href="https://github.com/zcash/zcash/wiki/1.0-User-Guide">1.0 User Guide</a> |
<a target="_blank" href="https://github.com/zcash/zcash/wiki/Mining-Guide">Mining Guide</a> |
<a target="_blank" href="https://z.cash/support/faq.html">FAQ</a> |
<a target="_blank" href="https://forum.z.cash/">Forums</a>

## install cockpit
Fedora Server comes with Cockpit installed.

Installing Cockpit in Ubuntu 16.04  
http://www.itzgeek.com/how-tos/linux/ubuntu-how-tos/install-cockpit-on-ubuntu-16-04.html

Access cockpit at the following url: https://localhost:9090/

## install zcash

https://z.cash/download.html

Follow the <a target="_blank" href="https://github.com/zcash/zcash/wiki/1.0-User-Guide">Install Guide</a> to build zcash from source.

## prepare your linux system
Login to your linux server with your regular user account to get started.

    nproc and pidof commands are required to be functioning by this plugin.

zcash-cli-cockpit plugin requires "zcash-cli" executable to be in your system path. It is possible to create a symbolic link to the "zcash-cli" binary.

    cd zcash_git_checkout_dir
    sudo ln -sr ./src/zcash-cli /usr/bin/zcash-cli

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

# donate to project

ZEC -> t1bBgVQMfak2LZfCVVk88BGV3Cgu4crE3Ci  
BTC -> 17v5jgu57wGKJnwkhVHvgYhbCVTFt9xXSN
