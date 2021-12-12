# Pi Display

The purpose of this project is to display various data points on an Waveshare 5.83in V2 e-ink display powered by a Raspberry Pi.

This project contains two parts:

1. `/python` contains all the files needed to retrieve and print all the data for the display.
1. `/webapp` contains a web app and node.js server that can be used to remotely refresh data and push custom messages to the display.

Review the READMEs in those respective directories to learn more.

## Pi Set Up

1. Complete the [Waveshare hardware/software set-up instructions](https://www.waveshare.com/wiki/5.83inch_e-Paper_HAT).

2. Install node on the Pi. Note: if using a Raspberry Pi Zero, see note in troubleshooting section below

3. To launch the web app on pi start-up, enter the command `crontab -e` to edit the crontab file. Then save the following line in the file:

    ```@reboot sleep 60 && cd /path/to/repo/pi-display/webapp && /path/to/node/bin/node server.js >> /path/to/log.log 2>&1 &```

4. Set up a cron job to run the display refresh at regular intervals. Enter the command `crontab -e` to edit the crontab file. Then add the following line (this will run the script every 30 minutes):

    ```*/30 * * * * cd /path/to/repo/pi-display && sudo python3 python/main.py```

## Troubleshooting

* If using a Raspberry Pi Zero, you have to use an unofficial build to support the proper architecture:

```NVM_NODEJS_ORG_MIRROR=https://unofficial-builds.nodejs.org/download/release nvm install 14```

* If display is printing incorrect times, you may need to update the timezone of your Pi: `sudo raspi-config` -> `Internationalisation Options` -> `Change Timezone` -> Follow screen directions to change country and time zone

* If you receive errors around the font files, update the font permissions: `chmod 744 python/assets/fonts`