# Pi Display

The purpose of this project is to display various data points on an Waveshare 5.83in V2 e-ink display powered by a Raspberry Pi.

![Photo of the Pi display displaying all data](python/assets/pi-display.jpg)

This project contains two parts:

1. `/python` contains all the files needed to retrieve and print all the data for the display.
1. `/webapp` contains a web app and node.js server that can be used to remotely trigger commands on the display.

Review the READMEs in those respective directories to learn more.

## Pi Set Up

This set-up guide assumes you are running Rasberry Pi OS Lite on your Pi and have already set up internet access.

1. Complete the [Waveshare hardware/software set-up instructions](https://www.waveshare.com/wiki/5.83inch_e-Paper_HAT).

1. Install node on the Pi. Note: if using a Raspberry Pi Zero, see note in troubleshooting section below

1. Clone this repo to your Pi. For this example, the repo will be stored under a `repos` directory under the home directory.

    ```
    cd ~/repos
    git clone https://github.com/rbitting/pi-display.git
    ```

1. Complete all prerequisites listed in [python/README.md](python/README.md#Prerequisites)

1. Set up a cron job to run the display refresh at regular intervals. Enter the command `crontab -e` to edit the crontab file. Then add the following line (this will run the script every 30 minutes):

    ```*/30 * * * * cd /home/pi/repos/pi-display/python && python3 main.py```

1. Set up a cron job to run the display refresh on Pi start-up. Enter the command `crontab -e` to edit the crontab file. Then add the following line:

    ```@reboot sleep 30 && cd /home/pi/repos/pi-display/python && python3 main.py &```

1. Run `npm install` and `npm run build` from in the `webapp` directory.

1. To launch the web app on Pi start-up, enter the command `crontab -e` to edit the crontab file. Then save the following line in the file (replace the paths with your Pi's paths):

    ```@reboot sleep 30 && cd /home/pi/repos/pi-display/webapp && /home/pi/.nvm/versions/node/v14.18.2/bin/node server.js >> /home/pi/logs/server.log 2>&1 &```

1. Set up a [static IP address](https://thepihut.com/blogs/raspberry-pi-tutorials/how-to-give-your-raspberry-pi-a-static-ip-address-update) for your Pi.

1. Update the Apache configuration file to proxy port 3000 requests. This will allow access to the webapp at the Pi's direct IP. Open the file:

    ```sudo nano /etc/apache2/sites-available/000-default.conf```
    
    then append the following within `<VirtualHost *:80>` under the `DocumentRoot /var/www/html` line:

    ```
    ProxyRequests off
    <Proxy *>
            Order deny,allow
            Allow from all
    </Proxy>
    <Location />
            ProxyPass http://localhost:3000/
            ProxyPassReverse https://localhost:3000/
    </Location>
    ```

1. Reboot the Pi for all updates to take effect.

## Notes

* All logs are stored under the `/logs` directory on your Pi

## Troubleshooting

* If using a Raspberry Pi Zero, you have to use an unofficial build of Node to support the proper architecture:

```NVM_NODEJS_ORG_MIRROR=https://unofficial-builds.nodejs.org/download/release nvm install 14```

* If display is printing incorrect times, you may need to update the timezone of your Pi: `sudo raspi-config` -> `Internationalisation Options` -> `Change Timezone` -> Follow screen directions to change country and time zone

* If you receive errors around the font files, update the font permissions: `chmod 744 python/assets/fonts`