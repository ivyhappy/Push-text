$(document).ready(function () {
    $("#enter-room").click(function () {
        var newNo = $("#room-number").val();
        var oldNo = $("#current-number").text();
        enterRoom(newNo, oldNo);
        $("#current-number").text(newNo);
        $("#leave-room").show();
    });

    $("#leave-room").click(function () {
        var roomNo = $("#current-number").text();
        leaveRoom(roomNo);
        $("#current-number").text("无");
        $("#leave-room").hide();
    });

    chrome.storage.local.get('current-room', function (item) {
        if (item['current-room']) {
            var newNo = item['current-room'];
            $("#current-number").text(newNo);
            $("#leave-room").show();
        }
    });
});

function leaveRoom(roomNo) {
    var data = {
        directive: 'leave-room',
        roomNo: roomNo
    };

    chrome.runtime.sendMessage(data, null);
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, data);
    });
    chrome.storage.local.remove('current-room');
}

function enterRoom(newNo, oldNo) {
    var data = {
        directive: 'enter-room',
        newRoom: newNo,
        oldRoom: oldNo
    };

    chrome.runtime.sendMessage(data, null);
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, data);
    });
    chrome.storage.local.set({ 'current-room': newNo });
}