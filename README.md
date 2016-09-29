# zcash-cli-cockpit
Cockpit based zcash-cli command line interface.
        <p align="right">
         z.cash:
         <a target="_blank" href="https://github.com/zcash/zcash/wiki/Beta-Guide">Official Beta Guide</a> |
         <a target="_blank" href="https://z.cash/blog/">Official Blog</a> |
         <a target="_blank" href="https://forum.z.cash/">Official Forums</a>
        </p>
# installing cockpit plugin
<p>Login to your linux server with your user account to get started.</p>

<p>It is expected that you have already followed the Zcash Beta Guide. Downloaded and built from source zcash.</p>
<p>Second, the cockpit plugin requires zcash-cli to be in your system path. It is possible to create a symbolic link to the executable.</p>
<pre>cd zcash_dir
sudo ln -sr ./src/zcash-cli /usr/bin/zcash-cli</pre>

<p>Cockpit will search ~/.local/share/cockpit/ directory for plugins.</p>
<pre>mkdir ~/.local/share/cockpit/</pre>

<p>Change directory and download the latest.</p>
<pre>cd ~/.local/share/cockpit/
git clone https://github.com/hellcatz/zcash-cli-cockpit</pre>

Upgrading to latest revsion?
<pre>git pull</pre>

<p>Open https://localhost:9090/ in your web browser and login to cockpit.</p>
<p>Look for a new menu entry under "Tools" called "zcash-cli".</p>

