/*
MIT License

Copyright (c) 2016 github.com/hellcatz

    Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

    The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

//
// Config Variables
//
var zcashcli = "zcash-cli";
var zcash_getinfo_rate = 30000;

//
// Global Variables
//
var zcash_isrunning = false;
var zcash_monitor_opid = ""; // operation id of transaction
var zcash_getinfo_timeout = 0; // id for setTimeout

var zcash_op_id;
var zcash_cli_op_running = false;

// arrays to hold balances for addressses
var taddr_balances = {}; // t-addr's
var shielded_balances = {}; // z-addr's
var shielded_balance = 0.0; // z-addr total balance

// global zcash-cli output
var zcash_output = $("#zcash-cli-output");

// general zcash information
var ztbalance_output = $("#zcash-tbalance");
var zpbalance_output = $("#zcash-pbalance");
var zbalance_output = $("#zcash-balance");

var zblock_output = $("#zcash-block");
var zdifficulty_output = $("#zcash-difficulty");
var zerrors_output = $("#zcash-errors");
var zconnections_output = $("#zcash-connections");

var ztotalrecv_output = $("#zcash-totalrecv");
var ztotalsend_output = $("#zcash-totalsend");
var ztimems_output = $("#zcash-timems");
var znethps_output = $("#zcash-nethps");

// balance tab
var zcash_balance_taddresses_info = $("#zcash-balance-taddresses-info")
var zcash_balance_taddresses_list = $("#zcash-balance-taddresses-list")
var zcash_send_zaddresses_info = $("#zcash-balance-zaddresses-info");

// blocks tab
var zcash_blocks_table = $('#zcash-table-blocks').DataTable({
    searching: false,
    lengthChange: false,
    paging: false,
    info: false,
    scrollY: "200px",
    scrollCollapse: true,
    order: [[0, "desc"]],
    columns: [
        {title: "Blocks"},
        {title: "Timestamp"},
        {title: "Trnxs"},
        {title: "Size"}
    ]
});

// transactions tab
var zcash_transaction_table = $("#zcash-table-transactions").DataTable({
    searching: false,
    lengthChange: false,
    paging: false,
    info: false,
    order: [[3, "desc"]],
    columns: [
        {title: "TXID"},
        {title: "Type"},
        {title: "Amount"},
        {title: "Date"},
        {title: "Address"},
        {title: "Confirms"}
    ],
    columnDefs: [
        {
            "targets": [0],
            "visible": false
        }
    ]
});

// wait z_sendmany opid to complete status
var zcash_wait = $("#zcash-wait");
var zcash_wait_status = $("#zcash-wait-status");

// shield tab
var zcash_shield_taddresses_info = $("#zcash-shield-taddresses-info")
var zcash_shield_taddresses = $("#zcash-shield-taddresses")
var zcash_shield_zaddresses = $("#zcash-shield-zaddresses");
var zcash_shield_extra_fee = $("#zcash-shield-extrafee");
var zcash_shield_amount = $("#zcash-shield-amount");

// send tab
var zcash_send_to_max = 8;
var zcash_send_to_count = 1;

var zcash_send_to_count_output = $("#zcash-send-to-count");
var zcash_send_from = $("#zcash-send-from");
var zcash_send_extra_fee = $("#zcash-send-extrafee");
var zcash_send_to = $(".zcash-send-to");
var zcash_send_amount = $(".zcash-send-amount");
var zcash_send_memo = $(".zcash-send-memo");

var zcash_sending_coins = false;
var zcash_send_to_wrapper = $("#zcash-send-to-wrapper");

// mining tab
var zcash_mine_details = $("#zcash-mine-details");
var zcash_mine_generate = $("#zcash-mine-generate");
var zcash_mine_nproc = $("#zcash-mine-nproc");


// dialog experiments
var zcash_dialog_modal = document.getElementById('zcash-dialog-model');
var zcash_dialog_title = $("#zcash-dialog-title");
var zcash_dialog_text = $("#zcash-dialog-text");
var zcash_dialog_closebtn = document.getElementsByClassName("zcash-dialog-close")[0];
zcash_dialog_closebtn.onclick = function () {
    zcash_dialog_modal.style.display = "none";
}


//
// UI Button Events
//
$("#zcash-refresh").on("click", begin_application);
$("#zcash-send").on("click", zcash_onClickSend);
$("#zcash-shield").on("click", zcash_onClickShield);
$("#zcash-mine-start").on("click", zcash_mine_start);
$("#zcash-cli-input-run").on("click", zcash_cli_input_run);
$("#zcash-send-add").on("click", zcash_send_add_more);

zcash_send_to_wrapper.on("click", ".remove_field", function (e) {
    //user click on remove text
    e.preventDefault();
    $(this).parent('div').remove();
    zcash_send_to_count--;
    zcash_send_to_count_output.empty();
    zcash_send_to_count_output.append(zcash_send_to_count);
});

// use "ready" event to begin_application()
$(document).ready(function () {
    begin_application();
});

//
//  Helper Functions
//

String.prototype.hexEncode = function () {
    var str = '';
    for (var i = 0; i < this.length; i++) {
        str += this[i].charCodeAt(0).toString(16);
    }
    return str;
};
String.prototype.hexDecode = function () {
    for (var bytes = [], c = 0; c < this.length; c += 2) {
        bytes.push(parseInt(this.substr(c, 2), 16));
    }
    return utf8tostr(bytes);
};

function utf8tostr(arr) {
    for (var i = 0, l = arr.length, s = '', c; c = arr[i++];)
        s += String.fromCharCode(
            c > 0xdf && c < 0xf0 && i < l - 1 ?
            (c & 0xf) << 12 | (arr[i++] & 0x3f) << 6 | arr[i++] & 0x3f :
                c > 0x7f && i < l ?
                (c & 0x1f) << 6 | arr[i++] & 0x3f :
                    c
        );
    return s;
}

function isEmpty(data) {
    return (data == null || data == 0 || data.length == null || data.toString().length == 0);
}
;

function round(number) {
    return Math.round(number * 100000000) / 100000000;
}

function showDialog(title, text) {
    zcash_dialog_modal.style.display = "block";
    zcash_dialog_title.empty();
    zcash_dialog_title.append(title);
    zcash_dialog_text.empty();
    zcash_dialog_text.append(text);
}

function showTab(evt, cityName) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    document.getElementById(cityName).style.display = "block";
    if (evt != null) {
        evt.currentTarget.className += " active";
    }

    // BUG work-around until a solution is found
    // forces the column header row to be the proper width
    $('#zcash-table-blocks').resize();
}

function proc_zcash_cli_fail(e) {
    zcash_monitor_opid = "";
    zcash_cli_op_running = false;
    if (zcash_sending_coins == true) {
        zcash_sending_coins = false;
        zcash_wait_operation_fail(e.toString());
    } else {
        alert(e);
    }
}

//
//  Main Application Entry Point
//

function begin_application() {
    if (zcash_cli_op_running == true) {
        alert("Operation already in progress...");
        return;
    }
    // initialize and start over
    zcash_isrunning = false;
    zcash_monitor_opid = "";
    zcash_sending_coins = false;

    taddr_balances = {};
    shielded_balances = {};
    zcash_send_zaddresses_info.empty();

    // check if zcashd is running
    zcash_cli_op_running = true;
    var cmd = ["pidof", "zcashd"];
    var proc = cockpit.spawn(cmd, {
        err: 'out'
    });
    proc.fail(check_zcash_detection_result);
    proc.done(check_zcash_detection_result);
    proc.stream(do_zcashd_detection);
}

function check_zcash_detection_result() {
    zcash_cli_op_running = false;
    if (!zcash_isrunning) {
        alert("zcashd is not running!");
        return;
    }
    zcash_cli_getinfo();
    zcash_cli_getmininginfo();
    zcash_cli_getaddressesbyaccount();
    zcash_cli_listunspent();
    zcash_cli_listtransactions();
    zcash_cli_list_zaddr();
}

function do_zcashd_detection(data) {
    if (!isEmpty(data)) {
        // did we get a pid of zcashd?
        if (parseInt(data) > 0) {
            // zcashd is running
            zcash_isrunning = true;
            // show pid of zcashd
            $("#zcash-pid").empty();
            $("#zcash-pid").append("(zcashd pid: " + data.trim() + ")");
        }
    }
}

//
// 	zcash-cli getinfo
//
function zcash_cli_getinfo() {
    if (zcash_getinfo_timeout != 0) {
        clearTimeout(zcash_getinfo_timeout);
    }
    var cmd = [zcashcli, "getinfo"];
    var proc = cockpit.spawn(cmd, {
        err: 'out'
    });
    proc.done(proc_zcash_cli_getinfo);
    proc.fail(proc_zcash_cli_fail);
}

var lastblock = 0;

function proc_zcash_cli_getinfo(data) {
    var jobj = JSON.parse(data);

    zdifficulty_output.empty();
    zblock_output.empty();
    zerrors_output.empty();
    zconnections_output.empty()

    zblock_output.append(document.createTextNode(jobj["blocks"]));
    zdifficulty_output.append(document.createTextNode(jobj["difficulty"]));
    zerrors_output.append(document.createTextNode(jobj["errors"]));
    zconnections_output.append(document.createTextNode(jobj["connections"]));

    zcash_cli_z_gettotalbalance();

    // detect new blocks and do extra work
    if (lastblock != parseInt(jobj["blocks"])) {

        var missedblocks = (lastblock == 0 ? 3 : Math.min(10, (parseInt(jobj["blocks"]) - lastblock)));

        lastblock = parseInt(jobj["blocks"]);

        for (i = ((lastblock + 1) - missedblocks); i < lastblock; i++) {
            zcash_blocks_table.row.add([i, "...", "...", "..."]);
            zcash_cli_z_getblockinfo(i);
        }
        zcash_blocks_table.row.add([lastblock, "...", "...", "..."]);

        zcash_cli_z_getblockinfo(lastblock);

        if (zcash_blocks_table.rows().data().length > 20) {
            zcash_blocks_table.rows(0).remove();
        }
        zcash_blocks_table.draw();
    }
}

function zcash_cli_z_getblockinfo(block) {
    var cmd = [zcashcli, "getblockhash", block.toString()];
    var proc = cockpit.spawn(cmd, {
        err: 'out'
    });
    proc.done(proc_zcash_cli_z_getblockinfo);
    proc.fail(proc_zcash_cli_fail);
}
function proc_zcash_cli_z_getblockinfo(bhash) {
    // look info up for block hash
    var cmd = [zcashcli, "getblock", bhash.toString().trim()];
    var proc = cockpit.spawn(cmd, {
        err: 'out'
    });
    proc.done(proc_zcash_cli_z_getblock);
    proc.fail(proc_zcash_cli_fail);
}
function getblockrowindex(block) {
    var indexes = zcash_blocks_table.rows().eq(0).filter(function (rowIdx) {
        return zcash_blocks_table.cell(rowIdx, 0).data() == block ? true : false;
    });

    if ($(indexes).size() > 0)
        return indexes[0];

    return null;
}
function proc_zcash_cli_z_getblock(data) {
    var jobj = JSON.parse(data);
    if (jobj != null) {
        var rowData = getblockrowindex(parseInt(jobj["height"]));
        if (rowData != null) {
            zcash_blocks_table.cell(rowData, 1).data(parseInt(jobj["time"]));
            zcash_blocks_table.cell(rowData, 2).data($(jobj["tx"]).size());
            zcash_blocks_table.cell(rowData, 3).data(parseInt(jobj["size"]));
        }
    }
}

function zcash_cli_z_gettxout(txid, n) {
    var cmd = [zcashcli, "gettxout", txid, n];
    var proc = cockpit.spawn(cmd, {
        err: 'out'
    });
    proc.done(function (data) {
        proc_zcash_cli_gettxout(txid, n, data);
    });
    proc.fail(proc_zcash_cli_fail);
}

function gettransactionrowindex(txid) {

    var indexes = zcash_transaction_table.rows().eq(0).filter(function (rowIdx) {
        return zcash_transaction_table.cell(rowIdx, 0).data() == txid ? true : false;
    });

    if ($(indexes).size() > 0)
        return indexes[0];

    return null;
}

function proc_zcash_cli_gettxout(txid, n, data) {
    var jobj = JSON.parse("[" + data + "]")[0];
    if (jobj != null) {

        /*
         var addresses = "";
         $(jobj["scriptPubKey"]["addresses"]).each(function( index ) {
         addresses += jobj["scriptPubKey"]["addresses"][index].toString() + ",";
         });
         addresses = addresses.substr(0, addresses.length - 1);
         */

        /* TODO, this is not the table you seek, create a new table for blockchain tab to show public transactions
         var rowData = gettransactionrowindex(txid);
         if (rowData != null) {
         var amount = parseFloat(jobj["value"]);
         if (!isEmpty(zcash_transaction_table.cell(rowData, 2).data()))
         amount = amount + parseFloat(zcash_transaction_table.cell(rowData, 2).data());

         zcash_transaction_table.cell(rowData, 2).data(round(amount).toString());
         zcash_transaction_table.draw();

         // keep looking for more transactions
         zcash_cli_z_gettxout(txid, n + 1);
         }
         */
    }
}

//
// 	zcash-cli z_gettotalbalance
//
function zcash_cli_z_gettotalbalance() {
    var cmd = [zcashcli, "z_gettotalbalance"];
    var proc = cockpit.spawn(cmd, {
        err: 'out'
    });
    proc.done(proc_zcash_cli_z_gettotalbalance);
    proc.fail(proc_zcash_cli_fail);
}

var zcash_balances = [];

function proc_zcash_cli_z_gettotalbalance(data) {
    var jobj = JSON.parse(data);

    ztbalance_output.empty();
    zpbalance_output.empty();
    zbalance_output.empty();

    zcash_balances = [jobj["transparent"], jobj["private"], jobj["total"]];

    ztbalance_output.css("color", "");
    zpbalance_output.css("color", "");
    zbalance_output.css("color", "");

    ztbalance_output.append(document.createTextNode(jobj["transparent"]));
    zpbalance_output.append(document.createTextNode(jobj["private"]));
    zbalance_output.append(document.createTextNode(jobj["total"]));

    zcash_cli_z_gettotalbalance_unconfirmed();
}

function zcash_cli_z_gettotalbalance_unconfirmed() {
    var cmd = [zcashcli, "z_gettotalbalance", "0"];
    var proc = cockpit.spawn(cmd, {
        err: 'out'
    });
    proc.done(proc_zcash_cli_z_gettotalbalance_unconfirmed);
    proc.fail(proc_zcash_cli_fail);
}

function proc_zcash_cli_z_gettotalbalance_unconfirmed(data) {
    var jobj = JSON.parse(data);

    var uconf_zcash_balances = [jobj["transparent"], jobj["private"], jobj["total"]];
    var unconfirmedMsg = "* Showing unconfirmed balances. Amounts shown may not be available until confirmed.";

    if (uconf_zcash_balances[0] != zcash_balances[0]) {
        ztbalance_output.css("color", "red");
        ztbalance_output.empty();
        ztbalance_output.append("*" + uconf_zcash_balances[0].toString());
        zerrors_output.empty();
        zerrors_output.append(unconfirmedMsg);
    }

    if (uconf_zcash_balances[1] != zcash_balances[1]) {
        zpbalance_output.css("color", "red");
        zpbalance_output.empty();
        zpbalance_output.append("*" + uconf_zcash_balances[1].toString());
        zerrors_output.empty();
        zerrors_output.append(unconfirmedMsg);
    }

    if (uconf_zcash_balances[2] != zcash_balances[2]) {
        zbalance_output.css("color", "red");
        zbalance_output.empty();
        zbalance_output.append("*" + uconf_zcash_balances[2].toString());
        zerrors_output.empty();
        zerrors_output.append(unconfirmedMsg);
    }

    zcash_cli_getnettotals();
}

//
// 	zcash-cli getnettotals
//
function zcash_cli_getnettotals() {
    var cmd = [zcashcli, "getnettotals"];
    var proc = cockpit.spawn(cmd, {
        err: 'out'
    });
    proc.done(proc_zcash_cli_getnettotals);
    proc.fail(proc_zcash_cli_fail);
}

function proc_zcash_cli_getnettotals(data) {
    var jobj = JSON.parse(data);

    ztotalrecv_output.empty();
    ztotalsend_output.empty();
    ztimems_output.empty();

    var recvbytes = parseFloat(jobj["totalbytesrecv"]);
    var sentbytes = parseFloat(jobj["totalbytessent"]);
    // convert from bytes to megabytes
    recvbytes = recvbytes / 1024;
    recvbytes = recvbytes / 1024;
    sentbytes = sentbytes / 1024;
    sentbytes = sentbytes / 1024;

    var timems = new Date(parseInt(jobj["timemillis"]));
    ztotalrecv_output.append(document.createTextNode(recvbytes.toFixed(3) + " MB"));
    ztotalsend_output.append(document.createTextNode(sentbytes.toFixed(3) + " MB"));
    ztimems_output.append(document.createTextNode(timems.toTimeString()));

    schedule_zcash_cli_getinfo_refresh();
}

function schedule_zcash_cli_getinfo_refresh(method) {
    if (zcash_getinfo_timeout != 0) {
        clearTimeout(zcash_getinfo_timeout);
    }
    zcash_getinfo_timeout = setTimeout(zcash_cli_getinfo, zcash_getinfo_rate);
}

function zcash_cli_getaddressesbyaccount() {
    var cmd = [zcashcli, "getaddressesbyaccount", ""];
    var proc = cockpit.spawn(cmd);
    proc.done(function (data){
        var jobj = JSON.parse(data);
        zcash_balance_taddresses_list.empty();
        $.each(jobj, function (i) {
            zcash_balance_taddresses_list.append(jobj[i]+"<br />");
        });
    });
    proc.fail(proc_zcash_cli_fail);
}

//
// 	Mining Tab
//

//
// 	zcash-cli setgenerate
//
function zcash_mine_start() {
    var cmd = [zcashcli, "setgenerate", zcash_mine_generate.val(), zcash_mine_nproc.val()];
    var proc = cockpit.spawn(cmd, {
        err: 'out'
    });
    proc.done(proc_zcash_mine_start_done);
    proc.fail(proc_zcash_cli_fail);
    zcash_output.empty();
    zcash_output.append(document.createTextNode(cmd.join(" ")));
}

function proc_zcash_mine_start_done() {
    setTimeout(zcash_cli_getmininginfo, 1000);
}

//
// 	zcash-cli getmininginfo
//
function zcash_cli_getmininginfo() {
    var cmd = [zcashcli, "getmininginfo"];
    var proc = cockpit.spawn(cmd, {
        err: 'out'
    });
    proc.done(proc_zcash_cli_getmininginfo);
    proc.fail(proc_zcash_cli_fail);
    zcash_output.empty();
}

function proc_zcash_cli_getmininginfo(data) {
    var jobj = JSON.parse(data);

    var nproc = parseInt(jobj["genproclimit"]);
    //zcash_mine_generate.val((jobj["generate"] == true ? "true" : "false"));
    //zcash_mine_nproc.val(nproc);

    zcash_mine_details.empty();
    zcash_mine_details.append(data);

    znethps_output.empty();
    znethps_output.append(jobj["networkhashps"]);

    var text = "";
    if (jobj["generate"] == true) {
        text += "Mining enabled, using " + nproc + " threads.";
    } else {
        text += "Mining is not enabled.";
    }
    zcash_output.append(document.createTextNode(text));
}

//
// Shield Tab
//

//
// 	zcash-cli listunspent
//
function zcash_cli_listunspent() {
    var cmd = [zcashcli, "listunspent"];
    var proc = cockpit.spawn(cmd);
    proc.done(proc_zcash_cli_listunspent);
    proc.fail(proc_zcash_cli_fail);
    zcash_shield_taddresses.empty();
    zcash_shield_taddresses_info.empty();
    zcash_shield_taddresses_info.append("<small><i>No coins available to shield.</i></small>");
    zcash_balance_taddresses_info.empty();
    zcash_balance_taddresses_info.append("<small><i>No coins available.</i></small>");
}

function proc_zcash_cli_listunspent(data) {
    var jobj = JSON.parse(data);
    var coinsAvailable = false;
    // gather up spendable balances
    $.each(jobj, function (i) {
        if (jobj[i]["spendable"] == true) {
            coinsAvailable = true;
            if (!taddr_balances.hasOwnProperty(jobj[i]["address"])) {
                taddr_balances[jobj[i]["address"]] = jobj[i]["amount"];
            } else {
                taddr_balances[jobj[i]["address"]] = round(taddr_balances[jobj[i]["address"]] + jobj[i]["amount"]);
            }
        }
    });

    if (coinsAvailable == true) {
        zcash_shield_taddresses_info.empty();
        zcash_balance_taddresses_info.empty();
        zcash_shield_amount.val(round(taddr_balances[jobj[0]["address"]] - zcash_shield_extra_fee.val()));
    }

    // generate html
    for (var name in taddr_balances) {
        var shortname = name.substring(0, 7) + "..." + name.substring((name.toString().length - 7)).trim();
        zcash_shield_taddresses.append($("<option/>", {
            value: name,
            text: shortname
        }));
        // generate html for balances
        var html = "<b>" + taddr_balances[name] + "</b> <small>ZEC</small> &rarr; <i><small>t-addr:</small> " + name + "</i><br />";
        zcash_shield_taddresses_info.append(html);
        zcash_balance_taddresses_info.append(html);
    }
}

function zcash_onClickShield(e) {
    if (zcash_cli_op_running == true) {
        alert("Operation already in progress...");
        return;
    }
    // make sure we can get a valid balance from the t-addr
    if (zcash_shield_taddresses.val() == null || taddr_balances[zcash_shield_taddresses.val()] == null) {
        alert("No coins available to shield!");
        return;
    }
    var extrafee = round(parseFloat(zcash_shield_extra_fee.val().trim()));
    var maxamount = round(taddr_balances[zcash_shield_taddresses.val().trim()] - extrafee);
    var amount = round(zcash_shield_amount.val().trim());
    if (amount == null || amount == NaN || amount <= 0) {
        alert("Invalid amount entered.");
        return;
    }
    if (amount > maxamount) {
        alert("Insufficient funds for transaction.\nAvailable amount is " + maxamount + " ZEC");
        return;
    }

    zcash_cli_shield(zcash_shield_taddresses.val().trim(), zcash_shield_zaddresses.val().trim(), amount.toFixed(8));
}

function zcash_cli_shield(taddr, zaddr, amount) {

    var ztx = "[{\"amount\": " + amount.toString() + ", \"address\": \"" + zaddr.toString() + "\"}]";

    zcash_cli_op_running = true;
    var cmd = [zcashcli, "z_sendmany", taddr, ztx];

    zcash_output.empty();
    zcash_output.append(cmd.join(" "));

    zcash_wait_operation_start("Shielding Coins...");
    var proc = cockpit.spawn(cmd, {
        err: 'out'
    });
    proc.done(proc_zcash_cli_send_opid);
    proc.fail(proc_zcash_cli_fail);
}

//
// Send Tab
//

//
// 	zcash-cli z_listaddresses
//
function zcash_cli_list_zaddr() {
    var cmd = [zcashcli, "z_listaddresses"];
    var proc = cockpit.spawn(cmd, {
        err: 'out'
    });
    proc.done(proc_zcash_cli_zaddr);
    proc.fail(proc_zcash_cli_fail);
}

function proc_zcash_cli_zaddr(data) {
    var jobj = JSON.parse(data);

    zcash_send_from.empty();
    zcash_shield_zaddresses.empty();

    // zero private balances
    shielded_balance = 0.0;
    $.each(jobj, function (i) {
        shielded_balances[jobj[i]] = 0.0;
    });

    // do we need to generate a zaddr?
    if (shielded_balances[jobj[0]] == null) {
        alert("Private z-addr not found, generating a new private z-addr!");
        var cmd = [zcashcli, "z_getnewaddress"];
        var proc = cockpit.spawn(cmd, {
            err: 'out'
        });
        proc.done(zcash_cli_list_zaddr);
        proc.fail(proc_zcash_cli_fail);
        return;
    }

    // generate html
    for (var name in shielded_balances) {
        var shortname = name.substring(0, 7) + "..." + name.substring((name.toString().length - 7));
        // populate shield tab select options
        zcash_shield_zaddresses.append($("<option/>", {
            value: name,
            text: shortname
        }));
        // populate send tab select options
        zcash_send_from.append($("<option/>", {
            value: name,
            text: shortname
        }));
        // generate html for balances
        var html = " <b><span id=\"" + name + "\">...</span></b> <small>ZEC</small> &rarr; <i><small>z-addr:</small> <span id=\"view" + name + "\" ondblclick=\"show_z_listreceivedbyaddress('" + name + "');\">" + name + "</span></i><br />";
        zcash_send_zaddresses_info.append(html);
        // lookup balance for zaddr
        zcash_cli_getbalance_for_zaddr(name);
    }

    for (var name in taddr_balances) {
        var shortname = name.substring(0, 7) + "..." + name.substring((name.toString().length - 7)).trim();
        // populate send tab select options
        zcash_send_from.append($("<option/>", {
            value: name,
            text: shortname
        }));
    }
}

function zcash_cli_getbalance_for_zaddr(zaddr) {
    var cmd = [zcashcli, "z_getbalance", zaddr];
    var proc = cockpit.spawn(cmd, {
        err: 'out'
    });
    proc.done(function (data) {
        shielded_balances[zaddr] = round(parseFloat(data));
        shielded_balance = round(shielded_balance + shielded_balances[zaddr]);
        $("#" + zaddr).empty();
        $("#" + zaddr).append(shielded_balances[zaddr]);
    });
    proc.fail(proc_zcash_cli_fail);
}

function zcash_send_add_more(e) {

    // prevent clicking on the link itself
    e.preventDefault();

    if (zcash_send_to_count >= zcash_send_to_max) {
        alert("You have reached the maximum amount of recipients.");
        return;
    }
    zcash_send_to_count++;

    zcash_send_to_count_output.empty();
    zcash_send_to_count_output.append(zcash_send_to_count);

    var html = "<div class=\"roundedbox\" style=\"display: inline-block;\">";
    html += "<label>To Address</label> <a style=\"float: right;\" href=\"#tabs\" class=\"remove_field\">Remove</a> <br />";
    html += "<input type=\"text\" name=\"zcash-send-to[]\" class=\"zcash-send-to\" /> <br />";
    html += "<label>Send Amount</label><br />";
    html += "<input type=\"text\" name=\"zcash-send-amount[]\" class=\"zcash-send-amount\" value=\"1.00\" /> <br />";
    html += "<label>Memo</label><br />";
    html += "<input type=\"text\" name=\"zcash-send-memo[]\" class=\"zcash-send-memo\" /><br />";
    html += "</div> ";

    zcash_send_to_wrapper.append(html);
}

function zcash_onClickSend(e) {

    if (zcash_cli_op_running == true) {
        alert("Operation already in progress...");
        return;
    }

    var isZADDR = (zcash_send_from.val().toString().match("^z") != null);
    var balances = isZADDR ? shielded_balances : taddr_balances;
    if (balances[zcash_send_from.val()] == null) {
        alert("Invalid from address.");
        return;
    }

    zcash_send_to = $(".zcash-send-to");
    zcash_send_amount = $(".zcash-send-amount");
    zcash_send_memo = $(".zcash-send-memo");

    var extrafee = round(parseFloat(zcash_send_extra_fee.val()));
    var maxamount = round(balances[zcash_send_from.val()] - extrafee);
    if (maxamount <= 0) {
        alert("Insufficient funds for transaction.");
        return;
    }

    var to_addrs = [];
    var amounts = [];
    var memos = [];

    to_addrs = [].map.call(zcash_send_to, function (input) {
        return input.value;
    });
    amounts = [].map.call(zcash_send_amount, function (input) {
        return input.value;
    });
    memos = [].map.call(zcash_send_memo, function (input) {
        return input.value;
    });

    var confirmHtml = "Are you sure you want to send?\n\n";
    var total_amount = 0.0;
    var count = $(to_addrs).size();
    var addrAvailable = false;
    for (i = 0; i < count; i++) {
        // ignore empty to_addrs
        if (isEmpty(to_addrs[i])) {
            continue;
        }
        addrAvailable = true;
    }

    if (!addrAvailable) {
        alert("No address entered.");
        return;
    }

    // early sanity checks and build confirmation html
    for (i = 0; i < count; i++) {
        // ignore empty to_addrs
        if (isEmpty(to_addrs[i])) {
            continue;
        }
        if (isEmpty(amounts[i])) {
            alert("empty amount @ index " + i.toString());
            return;
        }
        if (memos[i].trim().length > 256) {
            alert("Maxlength for memo is 256 chars or 512 bytes.");
            return;
        }

        var shortname = to_addrs[i].substring(0, 7) + "..." + to_addrs[i].substring((to_addrs[i].toString().length - 7));
        confirmHtml += "Amount: " + amounts[i].toString() + " ZEC\n";
        confirmHtml += "To: " + shortname + "\n\n";

        var amount = parseFloat(amounts[i].toString());
        if (amount == null || amount == NaN || amount <= 0) {
            alert("Invalid amount entered.");
            return;
        }
        total_amount += amount;
    }

    if (total_amount == null || total_amount == NaN || total_amount <= 0) {
        alert("Invalid amount entered.");
        return;
    }

    if (total_amount > maxamount) {
        alert("Insufficient funds for transaction.\nAvailable amount is " + maxamount + " ZEC");
        return;
    }

    confirmHtml += "Extra Fee: " + extrafee.toString() + " ZEC\n";
    confirmHtml += "Total Cost: " + round(total_amount + extrafee).toString() + " ZEC\n\n";

    shortname = zcash_send_from.val().trim().substring(0, 7) + "..." + zcash_send_from.val().trim().substring((zcash_send_from.val().trim().toString().length - 7));
    confirmHtml += "From: " + shortname + "\n";
    confirmHtml += "Begin Balance: " + round(maxamount + extrafee).toString() + " ZEC\n";
    confirmHtml += "Ending Balance: " + round(maxamount - total_amount).toString() + " ZEC\n\n";

    var doTrx = confirm(confirmHtml);
    if (doTrx == true) {
        zcash_cli_sendmany(zcash_send_from.val().trim(), to_addrs, amounts, memos, $("#zcash-wait"));
    }
}

function zcash_wait_operation_start(title) {
    zcash_sending_coins = true;
    zcash_wait.empty();
    zcash_wait_status.empty();
    zcash_wait.css("color", "");
    zcash_wait.append("<img id=\"zcash-wait-image\" src=\"zcash-logo-spin.gif\" alt=\"please wait\" align=\"left\" style=\"padding-right: 12px;\" /> <label>" + title.toString() + "</label> <br />");
    showTab(null, "zcashTabWait");
}
function zcash_wait_operation_progress(msg) {
    zcash_wait_status.empty();
    zcash_wait_status.css("color", "blue");
    zcash_wait_status.append(msg);
    showTab(null, "zcashTabWait");
}
function zcash_wait_operation_success(msg) {
    zcash_sending_coins = false;
    zcash_wait_status.empty();
    zcash_wait_status.css("color", "green");
    zcash_wait_status.append(msg);
    $("#zcash-wait-image").attr('src', "success.png");
    showTab(null, "zcashTabWait");
}
function zcash_wait_operation_fail(msg) {
    zcash_sending_coins = false;
    zcash_wait_status.empty();
    zcash_wait_status.css("color", "red");
    zcash_wait_status.append(msg);
    $("#zcash-wait-image").attr('src', "failed.png");
    showTab(null, "zcashTabWait");
}

function zcash_cli_sendmany(from_addr, to_addrs, amounts, memos) {

    // TODO, more sanity checks
    if (to_addrs.length != amounts.length) {
        alert("Fatal Error, array size mismatch!");
        return;
    }

    var ztx = "[";
    var count = $(to_addrs).size();
    for (i = 0; i < count; i++) {

        if (isEmpty(to_addrs[i])) {
            continue;
        }
        // make sure the addr string starts with z or t
        if ((to_addrs[i].toString().match("^z") == null && to_addrs[i].toString().match("^t")) == null) {
            continue;
        }

        var tx = "{\"amount\": " + parseFloat(amounts[i].toString()).toFixed(8) + ", \"address\": \"" + to_addrs[i].toString() + "\"}, ";
        // memos only work for z-addr
        if (memos[i].length > 0 && to_addrs[i].toString().match("^z") != null)
            tx = "{\"amount\": " + parseFloat(amounts[i].toString()).toFixed(8) + ", \"memo\": \"" + utf8.encode(memos[i].toString().trim()).hexEncode() + "\", \"address\": \"" + to_addrs[i].toString() + "\"}, ";

        ztx += tx;
    }
    // trim last comma and space ", "
    ztx = ztx.substr(0, ztx.length - 2);
    ztx += "]";

    zcash_cli_op_running = true;
    var cmd = [zcashcli, "z_sendmany", from_addr, ztx];

    zcash_output.empty();
    zcash_output.append(cmd.join(" "));

    zcash_wait_operation_start("Sending Funds...");
    var proc = cockpit.spawn(cmd, {
        err: 'out'
    });
    proc.done(proc_zcash_cli_send_opid);
    proc.fail(proc_zcash_cli_fail);
}

function proc_zcash_cli_send_opid(data) {
    // grab the opid
    zcash_monitor_opid = data.toString().trim();

    zcash_wait_status.empty();
    zcash_wait_status.css("color", "#18C78F");
    zcash_wait_status.append("checking: " + zcash_monitor_opid);

    // monitor operation id
    var cmd = [zcashcli, "z_getoperationstatus" /*, "[\""+zcash_monitor_opid.toString()+"\"]"*/];
    var proc = cockpit.spawn(cmd, {
        err: 'out'
    });
    proc.done(proc_zcash_cli_monitor_opid);
    proc.fail(proc_zcash_cli_fail);
}

function do_zcash_cli_monitor_opid() {
    proc_zcash_cli_send_opid(zcash_monitor_opid);
}

function proc_zcash_cli_monitor_opid(data) {
    var doMonitor = zcash_monitor_opid.length > 0;

    var jobj = JSON.parse(data);
    $.each(jobj, function (i) {
        if (jobj[i]["id"] == zcash_monitor_opid) {

            zcash_wait_operation_progress(jobj[i]["status"] + ": " + zcash_monitor_opid.toString());

            if (jobj[i]["status"] != "executing") {
                doMonitor = false;
                // complete transaction by getting the result
                var cmd = [zcashcli, "z_getoperationresult" /*, "[\""+zcash_monitor_opid.toString()+"\"]"*/];
                var proc = cockpit.spawn(cmd, {
                    err: 'out'
                });
                proc.done(proc_zcash_cli_result_opid);
                proc.fail(proc_zcash_cli_fail);
            }
        }
    });

    if (doMonitor) {
        setTimeout(do_zcash_cli_monitor_opid, 1000);
    }
}

function proc_zcash_cli_result_opid(data) {

    var jobj = JSON.parse(data);
    $.each(jobj, function (i) {
        if (jobj[i]["id"] == zcash_monitor_opid) {
            if (jobj[i]["result"] != null) {
                zcash_wait_operation_success(jobj[i]["status"] + " txid: " + jobj[i]["result"]["txid"]);
            } else if (jobj[i]["error"] != null) {
                zcash_wait_operation_fail(jobj[i]["status"] + ": " + jobj[i]["error"]["message"]);
            } else {
                zcash_wait_operation_fail(jobj[i]["status"] + ": information not provided");
            }
        }
    });

    zcash_output.empty();
    zcash_output.append(data);

    zcash_monitor_opid = "";
    zcash_cli_op_running = false;

    // update balances
    zcash_cli_getinfo();
}

//
// Transaction Tab
//

//
// 	zcash-cli listtransactions
//
function zcash_cli_listtransactions() {
    var cmd = [zcashcli, "listtransactions"];
    var proc = cockpit.spawn(cmd);
    proc.done(proc_zcash_cli_listtransactions);
    proc.fail(proc_zcash_cli_fail);
}

function proc_zcash_cli_listtransactions(data) {
    var jobj = JSON.parse(data);

    // gather up spendable balances
    $.each(jobj.reverse(), function (i) {

        var txid = jobj[i]["txid"];
        var type = jobj[i]["category"];
        var amount = parseFloat(jobj[i]["amount"]);
        //var date = new Date(parseInt(jobj[i]["time"]) * 1000);
        var date = parseInt(jobj[i]["time"]);
        var address = jobj[i]["address"];
        if (isEmpty(address))
            address = "* private z-addr *";

        var confs = jobj[i]["confirmations"];

        var rowData = gettransactionrowindex(txid);
        if (rowData != null) {
            zcash_transaction_table.cell(rowData, 0).data(txid.toString());
            zcash_transaction_table.cell(rowData, 1).data(type.toString());
            zcash_transaction_table.cell(rowData, 2).data(round(amount).toString());
            zcash_transaction_table.cell(rowData, 3).data(date.toString());
            zcash_transaction_table.cell(rowData, 4).data(address.toString());
            zcash_transaction_table.cell(rowData, 5).data(confs.toString());
        } else {
            zcash_transaction_table.row.add([txid, type, round(amount).toString(), date, address, confs]);
        }

        // TODO, style the row color

        /*
         var html = " <p><span id=\"" + jobj[i]["txid"] + "\">" + date + " - confirmations: " + jobj[i]["confirmations"] + "<br /><i><small>txid:</small> " + jobj[i]["txid"] + "</i><br /> " + jobj[i]["category"] + " <b>" + jobj[i]["amount"] + "</b> <small>ZEC</small> <small>for t-addr: <b>" + jobj[i]["address"] + "</b></small> </span></p>";
         zcash_transaction_info.append(html);
         if (jobj[i]["category"] == "generate") {
         // this coin was mined and verified
         $("#" + jobj[i]["txid"]).css("color", "green");
         } else if (jobj[i]["category"] == "immature") {
         // this coin was just mined and immature
         $("#" + jobj[i]["txid"]).css("color", "red");
         }
         */
    });

    zcash_transaction_table.draw();

    // TODO, look up z-addr received by transactions and add to table
    // get_all_zaddr_received_transactions();
}

function get_all_zaddr_received_transactions() {

    // TODO, this is not the perfered way
    // TODO some z-addr could have 1000's of transactions

    var cmd = [zcashcli, "z_listaddresses"];
    var proc = cockpit.spawn(cmd);
    proc.done(function (list) {
        var jobj = JSON.parse(list);
        $.each(jobj, function (i) {

            cockpit.spawn([zcashcli, "z_listreceivedbyaddress", jobj[i].toString().trim()]).done(function (data) {

                var zaddr = jobj[i].toString().trim();
                var shortzaddr = zaddr.substring(0, 7) + "..." + zaddr.substring((zaddr.toString().length - 7));

                var jobj2 = JSON.parse(data);
                $.each(jobj2, function (i) {

                    var txid = jobj2[i]["txid"];
                    var amount = parseFloat(jobj2[i]["amount"]);
                    var memo = jobj2[i]["memo"];

                    var rowData = gettransactionrowindex(txid);
                    if (rowData != null) {
                        zcash_transaction_table.cell(rowData, 0).data(txid.toString());
                        zcash_transaction_table.cell(rowData, 1).data("receive");
                        zcash_transaction_table.cell(rowData, 2).data(round(amount).toString());
                        zcash_transaction_table.cell(rowData, 4).data(shortzaddr);
                        zcash_transaction_table.cell(rowData, 5).data(memo.toString().hexDecode());
                    } else {
                        //zcash_transaction_table.row.add([txid, "receive", round(amount).toString(), "", shortzaddr, ""]);
                    }

                });

            }).fail(proc_zcash_cli_fail);
        });
    });
    proc.fail(proc_zcash_cli_fail);
}

function show_z_listreceivedbyaddress(zaddr) {
    var shortname = zaddr.substring(0, 12) + "..." + zaddr.substring((zaddr.toString().length - 12));
    showDialog("Transactions for " + shortname, "Loading...");
    zcash_cli_z_listreceivedbyaddress(zaddr);
}

function zcash_cli_z_listreceivedbyaddress(addr) {
    var cmd = [zcashcli, "z_listreceivedbyaddress", addr.toString().trim()];
    var proc = cockpit.spawn(cmd);
    proc.done(proc_zcash_cli_z_listreceivedbyaddress);
    proc.fail(proc_zcash_cli_fail);
}

function proc_zcash_cli_z_listreceivedbyaddress(data) {
    var jobj = JSON.parse(data);
    zcash_dialog_text.empty();
    $.each(jobj.reverse(), function (i) {
        var html = "<p>";
        html += "<small>txid: " + jobj[i]["txid"] + "</small><br />";
        html += "<small>receive</small> <b>" + jobj[i]["amount"] + "</b> <small>ZEC</small> ";
        if (!isEmpty(jobj[i]["memo"])) {
            html += " Memo: <i>" + jobj[i]["memo"].hexDecode() + "</i>";
        }
        html += "</p>";

        zcash_dialog_text.append(html);
    });
}

//
// Console Tab
//

//
// 	zcash-cli console function
//
function zcash_cli_input_run() {
    if (zcash_cli_op_running == true) {
        alert("Operation already in progress...");
        return;
    }
    if ($("#zcash-cli-input-cmd").val().length <= 0) {
        alert("Empty command!");
        return;
    }

    zcash_output.empty();
    zcash_cli_op_running = true;

    var cmd = [zcashcli];
    // tokenize the console input ",',[
    var argv = $("#zcash-cli-input-cmd").val().match(/"[^"]+"|\[[^\[]+\]|'[^']+'|\S+/g);
    for (var i in argv) {
        // TODO, better ways to correct syntax input
        // Detect "" empty strings
        if (argv[i] == "\"\"")
            cmd.push("");
        else
            cmd.push(argv[i]);
    }
    zcash_output.append(cmd.join(" "));
    var proc = cockpit.spawn(cmd, {
        err: 'out'
    });
    proc.done(proc_zcash_cli_output);
    proc.fail(proc_zcash_cli_fail);
}

function proc_zcash_cli_output(data) {
    zcash_cli_op_running = false;
    zcash_output.empty();
    zcash_output.append(document.createTextNode(data));
}
