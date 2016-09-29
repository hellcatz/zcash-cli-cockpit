# zcash-cli-cockpit
Cockpit based zcash-cli command line interface.

# installing cockpit plugin
<p>Login to your linux server with your user account to get started.</p>

<p>First, it is expected that you have already followed the Zcash Beta Guide. Downloaded and built from source zcash.</p>
<p>Second, the cockpit plugin requires zcash-cli to be in your system path. It is possible to create a symbolic link to the executable.</p>
<pre>cd zcash_dir
ln -r ./src/zcash-cli /usr/bin/zcash-cli</pre>

<p>Cockpit will search ~/.local/share/cockpit/ directory for plugins.</p>
<pre>mkdir ~/.local/share/cockpit/</pre>

<p>Change directory and download the latest.</p>
<pre>cd ~/.local/share/cockpit/
git clone https://github.com/hellcatz/zcash-cli-cockpit</pre>

<p>Open https://localhost:9090/ in your web browser and login to cockpit.</p>
<p>There should be a new menu entry under "Tools" called "zcash-cli".</p>

