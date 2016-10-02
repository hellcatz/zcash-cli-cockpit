# zcash-cli-cockpit
<p style="float: left;">Cockpit based zcash-cli command line interface.</p>

    <p>
      z.cash:
      <a target="_blank" href="https://github.com/zcash/zcash/wiki/Beta-Guide">Official Beta Guide</a> |
      <a target="_blank" href="https://github.com/zcash/zcash/wiki/Mining-Guide">Official Mining Guide</a> |
      <a target="_blank" href="https://z.cash/support/faq.html">Official FAQ</a> |
      <a target="_blank" href="https://forum.z.cash/">Official Forums</a>
    </p>

# cockpit required
<p>This requires "Cockpit" to work.</p>
<a href="http://cockpit-project.org/12">http://cockpit-project.org/12</a>

<p>Get Cockpit running...(click on your distro for instructions)</p>
<a href="http://cockpit-project.org/running.html6">http://cockpit-project.org/running.html6</a>

# installing cockpit plugin
<p>Login to your linux server with your user account to get started.</p>

<p>It is expected that you have followed the <a target="_blank" href="https://github.com/zcash/zcash/wiki/Beta-Guide">Official Beta Guide</a>, downloaded and built zcash from source.</p>

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

