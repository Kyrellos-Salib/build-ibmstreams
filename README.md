# build-ibmstreams [Beta]
IBM Streams build extension for Atom

### Beta
This is the initial public release.  For best results you should also install these Atom packages:
* language-ibmstreams-spl
* streams-dark-syntax
* streams-light-syntax
* atom-ide-ui
* ide-ibmstreams

### Setup Instructions
#### Build - Streaming Analytics Credentials
The <b>build-ibmstreams</b> package requires a running IBM Streaming Analytics service. SPL applications will be built and deployed on this service. If you need to create one, start <a href="https://cloud.ibm.com/catalog/services/streaming-analytics" rel="noopener" target="_blank">here</a> and follow the instructions to create an account.

<b>Note:</b>The service needs to support V2 of the rest api.

Once you have an account go to your <a href="https://cloud.ibm.com/resources?groups=resource-instance" rel="noopener" target="_blank">dashboard</a> and select the Streaming Analytics service you want to use. You need to make sure it is running and then copy your credentials to the clipboard. To get your credentials select <b>Service Credentials</b> from the actions on the left. From the credentials page, press <b>View credentials</b> for the one you want to use and press the copy button in the upper right side of the credentials to copy them to the clipboard.

In Atom there is a setting in the <b>build-ibmstreams</b> package for the credentials. Go to <b>Atom->Preferences->Packages</b> and press the <b>Settings</b> button on the <b>build-ibmstreams</b> package and paste your credentials into the setting.
![](./images/atomcredssetting.png)


### SPL Application build
![](./images/build.gif)
