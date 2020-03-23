/**
 * remote.js
 *
 * Init the remote :
 * 1- download deezer sdk
 * 2- login the user to deezer
 * 3- connect the page to the nodeJS server via socketIO and identify himself as a remote
 * 4- start to listen for user actions
 */

let appId = '262202';
let server = 'http://item-ax31503:4000';
// let appId = '376184';
// let server = 'http://alarmClock:4000';
// let appId = '399804';
// let server = 'http://alarmJeff:4000';

$(document).ready(function() {

    //Init Deezer Player
    window.dzAsyncInit = function() {
        DZ.init({
            appId:      appId, //Your app id
            channelUrl: server + '/channel.html',
            player:     {
                onload: deezerReady
            }
        });
    };
    (function() {
        var e = document.createElement('script');
        e.src = 'https://e-cdns-files.dzcdn.net/js/min/dz.js';
        e.async = true;
        document.getElementById('dz-root').appendChild(e);
    }());

    /**
     * deezerReady method
     *
     * Deezer is loaded, time to log and open a socketIO connection
     *
     * @return void
     */
    function deezerReady() {

        DZ.login(function(response)  //Will prompt a new window asking the user to connect with his deezer account
        {
            if (response.authResponse) //User connected
            {
                flash('Connected', 'green'); //Cool

                //Update Deezer status
                $('div.infosbox li.deezer li span').text('Connected');
                $('div.infosbox li.deezer li span').removeClass('label-important').addClass('label-success');

                //Connect to the server
                socket = io.connect(server);

                var self = 0;

                //When connected
                socket.on('connected', function(data, identification) {

                    self = data.clientId;

                    //Update informations
                    $('div.infosbox li.connection li:first-child span').text(self); //my id
                    $('div.infosbox li.connection li:nth-child(2) span').text(data.msg);
                    if (data.msg == 'Connected') {
                        $('div.infosbox li.connection li:nth-child(2) span').removeClass('label-important').addClass('label-success');
                    }

                    //Identification as a remote
                    identification('remote');
                });

                //@see main.js
                app();

            }
            else { // User cancelled login or did not fully authorize
                flash("You have to be connected to Deezer to use the app. Please reload the page.", "red")
            }
        }, {
            //All the perms
            perms: ['basic_access', 'email', 'offline_access', 'manage_library', 'manage_community', 'delete_library', 'listening_history']
        });

    }

});
