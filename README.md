To run this please follow the steps 

- check your Chrome browser version (open your browser > setting > about)
- go to this URL and download the chrome driver match with your Chrome version
Example: If your browser Chrome version is 107.111.111 then download the 107 version of chrome driver
- Chrome driver download link: https://chromedriver.chromium.org/downloads
- Download the driver, extract the zip and
- Set your chromedriver path to environment variable
- Set the path in Linux,
- export PATH=$PATH:/path/to/dir
- Set the path in Mac 
- echo "export PATH=$PATH:$HOME/bin" >> $HOME/.bash_profile
- type 'chromedriver' on your terminal and check that is the driver run or not. If driver run successfully then close
the terminal.
- Clone the project form github with this URL https://github.com/sraskin/mytoys-automation.git
- run 'npm install'
- Then run the automation script with 'mocha test/ui-automation.spec.js'

** If the script found any mismatch it will show on the terminal and other success results also print or the terminal