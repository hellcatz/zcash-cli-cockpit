# zcash-cli-cockpit
<p style="float: left;">zcash-cli cockpit plugin web browser ui command line interface.</p>

<a target="_blank" href="http://z.cash/">z.cash</a>: 
<a target="_blank" href="https://github.com/zcash/zcash/blob/v1.0.0-beta2/doc/payment-api.md">Payment API</a> |
<a target="_blank" href="https://github.com/zcash/zcash/wiki/Beta-Guide">Official Beta Guide</a> |
<a target="_blank" href="https://github.com/zcash/zcash/wiki/Mining-Guide">Official Mining Guide</a> |
<a target="_blank" href="https://z.cash/support/faq.html">Official FAQ</a> |
<a target="_blank" href="https://forum.z.cash/">Official Forums</a>

## cockpit required on linux server
Fedora Server comes with Cockpit installed.

Installing Cockpit in Ubuntu 16.04

http://www.itzgeek.com/how-tos/linux/ubuntu-how-tos/install-cockpit-on-ubuntu-16-04.html

Access cockpit at the following url: https://localhost:9090/

## compile zcash from source
It is expected that you have followed the <a target="_blank" href="https://github.com/zcash/zcash/wiki/Beta-Guide">Official Beta Guide</a>, downloaded and built zcash from source.

## installing cockpit plugin
nproc and pidof are required by this plugin.

Login to your linux server with your user account to get started.

<p>zcash-cli cockpit plugin requires zcash-cli to be in your system path. It is possible to create a symbolic link to the executable.</p>

<pre>cd zcash_dir
sudo ln -sr ./src/zcash-cli /usr/bin/zcash-cli</pre>

<p>Cockpit will search ~/.local/share/cockpit/ directory for plugins.</p>
<pre>mkdir ~/.local/share/cockpit/</pre>

<p>Change directory and download the latest.</p>
<pre>cd ~/.local/share/cockpit/
git clone https://github.com/hellcatz/zcash-cli-cockpit</pre>

<p>Just pull the latest if you already cloned the repostiory.</p>
<pre>cd ~/.local/share/cockpit/zcash-cli-cockpit
git pull</pre>

<p>Open https://localhost:9090/ in your web browser and login to cockpit.</p>
<p>Look for a new menu entry under "Tools" called "zcash-cli".</p>

