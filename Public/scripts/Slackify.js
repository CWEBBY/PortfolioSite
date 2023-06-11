
const stateSection = document.getElementById("stateLabel");
const params = new URLSearchParams(window.location.search);

var error = params.get("error");
var code = params.get("code");

if (error != null) {
    stateSection.innerText = "An error occured while connecting your Spotify account, please try again.\n[" + error + "]";
}
else if (code != null) {
    stateSection.innerText = "You connected SLACKIFY successfully to your Spotify account.\nYou may now go back to the extension to use it.";
}