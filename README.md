# zcash-cli-cockpit
<p style="float: left;">zcash-cli cockpit plugin web browser ui command line interface.</p>

<a target="_blank" href="http://z.cash/">z.cash</a>: 
<a target="_blank" href="https://github.com/zcash/zcash/blob/v1.0.0-beta2/doc/payment-api.md">Payment API</a> |
<a target="_blank" href="https://github.com/zcash/zcash/wiki/Beta-Guide">Official Beta Guide</a> |
<a target="_blank" href="https://github.com/zcash/zcash/wiki/Mining-Guide">Official Mining Guide</a> |
<a target="_blank" href="https://z.cash/support/faq.html">Official FAQ</a> |
<a target="_blank" href="https://forum.z.cash/">Official Forums</a>

## install cockpit
Fedora Server comes with Cockpit installed.
Access cockpit at the following url: https://localhost:9090/

Installing Cockpit in Ubuntu 16.04
http://www.itzgeek.com/how-tos/linux/ubuntu-how-tos/install-cockpit-on-ubuntu-16-04.html

## get zcash from source
Follow the <a target="_blank" href="https://github.com/zcash/zcash/wiki/Beta-Guide">Official Beta Guide</a> to downloaded and build zcash.

## prepare your linux system
Login to your linux server with your regular user account to get started.

    nproc and pidof commands are required to be functioning by this plugin.

zcash-cli-cockpit plugin requires "zcash-cli" executable to be in your system path. It is possible to create a symbolic link to the "zcash-cli" executable compiled when following the <a target="_blank" href="https://github.com/zcash/zcash/wiki/Beta-Guide">Official Beta Guide</a>.

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

