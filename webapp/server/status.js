function DisplayStatus() {
    this.lastRefresh = new Date().toLocaleString('en-US');
    this.isError = false;
    this.isProcessing = false;
    this.message = 'Server initiated.';
    this.isWaiting = false;
    this.setError = (message) => {
        this.isError = true;
        this.message = message;
        this.lastRefresh = new Date().toLocaleString('en-US');
    };
    this.setSuccess = (message) => {
        this.isError = false;
        this.message = message;
        this.lastRefresh = new Date().toLocaleString('en-US');
    };
};

function displayIsBusy(res) {
    const errorMsg = 'Display is busy. Please try again in a few minutes.';
    console.log(`${new Date().toLocaleString('en-US')} ${errorMsg}`);
    res.status(409);
    res.send(
        JSON.stringify({
            code: 409,
            message: errorMsg
        })
    );
}

module.exports = { DisplayStatus, displayIsBusy };
