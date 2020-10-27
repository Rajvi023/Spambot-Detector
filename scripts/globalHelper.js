var addRadioButton = d3.select("#add_radio_button");
var deleteRadioButton = d3.select("#delete_radio_button");

var timelineRadioButton = d3.select("#timeline_cp_radio_button");
var drRadioButton = d3.select("#dr_cp_radio_button");
var activityRadioButton = d3.select("#activity_cp_radio_button");
var topicRadioButton = d3.select("#topic_cp_radio_button");
var feRadioButton = d3.select("#fe_cp_radio_button");
var labelAsSpambotBtn = d3.select("#labelAsSpambotBtn");
var labelAsGenuineBtn = d3.select("#labelAsGenuineBtn");
var addAllBtn = d3.select("#AddAllButton");
var subAllBtn = d3.select("#SubtractAllButton");
var addAllGenuineBtn = d3.select("#AddGenuineButton");
var addAllSpamBtn = d3.select("#AddSpamButton");
var feature_explorer_button = d3.select("#feature_explorer_button");

var selectedUsers = {};
var userInfo = {};
var selectionOption = 0;
var currentActivityScreen = 0 // 0 - account | 1 - tweet | 2 - wordcloud

d3.csv("../data/genuine_accounts_sample.csv/users.csv", function(error, data) {
    if (error) throw error;

    // format the data
    data.forEach(function(d) {
        userInfo[d.id] = {
            "id": d.id,
            "name": d.name,
            "screen_name": d.screen_name,
            "created_at": d.created_at,
            "statuses_count": d.statuses_count,
            "friends_count": d.friends_count,
            "followers_count": d.followers_count,
            "favourites_count": d.favourites_count,
        };
    })
});

addRadioButton.on("change", SelectionOptionChanged);
deleteRadioButton.on("change", SelectionOptionChanged);

timelineRadioButton.on("change", subCpSelectionOptionChanged);
drRadioButton.on("change", subCpSelectionOptionChanged);
activityRadioButton.on("change", subCpSelectionOptionChanged);
topicRadioButton.on("change", subCpSelectionOptionChanged);
feRadioButton.on("change", subCpSelectionOptionChanged);

labelAsSpambotBtn.on("click", labelAsSpambotClicked);
labelAsGenuineBtn.on("click", labelAsGenuineClicked);

addAllBtn.on("click", allAllBtnClicked);
subAllBtn.on("click", subAllBtnClicked);
addAllGenuineBtn.on("click", addAllGenuineBtnClicked);
addAllSpamBtn.on("click", addAllSpamBtnClicked);

feature_explorer_button.on("click", refreshFeatureExplorer);

function allAllBtnClicked() {
    var tempSelectionOption = selectionOption;
    selectionOption = 0;
    for(var user in userInfo) {
        onAdding(userInfo[user].id);
    }
    selectionOption = tempSelectionOption;
}

function subAllBtnClicked() {
    var tempSelectionOption = selectionOption;
    selectionOption = 1;
    for(var user in userInfo) {
        onRemoving(userInfo[user].id);
    }
    selectionOption = tempSelectionOption;
}

function addAllGenuineBtnClicked() {
    var tempSelectionOption = selectionOption;
    for(var user in window.label) {
        if(window.label[user] == "genuine") {
            selectionOption = 0;
            onAdding(user);
        } else {
            selectionOption = 1;
            onRemoving(user);
        }
    }
    selectionOption = tempSelectionOption;
}

function addAllSpamBtnClicked() {
    var tempSelectionOption = selectionOption;
    for(var user in window.label) {
        if(window.label[user] == "spambot") {
            selectionOption = 0;
            onAdding(user);
        } else {
            selectionOption = 1;
            onRemoving(user);
        }
    }
    selectionOption = tempSelectionOption;
}

function SelectionOptionChanged() {
    var radios = document.getElementsByName('selection_option');
    var option;
    for (var i = 0, length = radios.length; i < length; i++) {
        if (radios[i].checked) {
            option = radios[i].value;
            break;
        }
    }

    switch(option) {
        case "add":
            selectionOption = 0;
            break;
        case "delete":
            selectionOption = 1;
            break;
    }
}

function subCpSelectionOptionChanged() {
    var radios = document.getElementsByName('subPanelSelection');
    var option;
    for (var i = 0, length = radios.length; i < length; i++) {
        if (radios[i].checked) {
            option = radios[i].value;
            break;
        }
    }

    d3.select("#Timeline_view_controls").style("display", "none");
    d3.select("#Dimensionality_reduction_view_controls").style("display", "none");
    d3.select("#Accounts_activity_view_controls").style("display", "none");
    d3.select("#topic_view_controls").style("display", "none");
    d3.select("#fe_view_controls").style("display", "none");

    switch(option) {
        case "timeline":
            d3.select("#Timeline_view_controls").style("display", "block");
            break;
        case "dr":
            d3.select("#Dimensionality_reduction_view_controls").style("display", "block");
            break;
        case "activity":
            d3.select("#Accounts_activity_view_controls").style("display", "block");
            break;
        case "topic":

            d3.select("#topic_view_controls").style("display", "block");

            break;
        case "fe":
            d3.select("#fe_view_controls").style("display", "block");
            break;
    }
}

function removeItem(array, item){
    delete array[item];
}

function onAdding(userId) {
    if(!(userId in selectedUsers) && (selectionOption == 0)) {
        selectedUsers[userId] = userInfo[userId];
		d3.selectAll("#TLViewGreen").filter(function(d){
				return d["user_id"] in window.selectedUsers;})
			.attr('fill','red');
		d3.selectAll("#TLViewPurple").filter(function(d){
				return d["user_id"] in window.selectedUsers;})
			.attr('fill','red');
		d3.selectAll("#TLViewBlue").filter(function(d){
				return d["user_id"] in window.selectedUsers;})
			.attr('fill','red');
        activityAccountBtnClick();
        changeActivitySelectColor(userId);

		violins();
		updateTcvView();

        changeClusterViewSelectColor(userId);

    }
}

function onRemoving(userId) {
    if((userId in selectedUsers)  && (selectionOption == 1)) {
        removeItem(selectedUsers, userId);
		d3.selectAll("#TLViewGreen").filter(function(d){
				return d["user_id"] == userId;})
			.attr('fill','green');
		d3.selectAll("#TLViewPurple").filter(function(d){
				return d["user_id"] == userId;})
			.attr('fill','purple');
		d3.selectAll("#TLViewBlue").filter(function(d){
				return d["user_id"] == userId;})
			.attr('fill','blue');
        activityAccountBtnClick();
        changeActivityUnselectColor(userId);

        violins();
        updateTcvView();

        changeClusterViewUnSelectColor(userId);
    }
}

function labelAsGenuineClicked() {
    for(var userId in selectedUsers) {
        window.label[userId] = "genuine";

        // Add individual user id changes here

        changeActivityAccountToGenuine(userId);
    }
    changeClusterViewColor("user_id");
    // Add Bulk Change here
	//d3.select("#tLViewContainer").selectAll("div").remove();
	d3.selectAll("#timeLineViewYAxis").selectAll("svg").remove();
	d3.selectAll("#TimeLineYOut").remove();
	timeLineView = new TimeLineView();
    timeLineView.draw("year", ["2007","2008","2009","2010","2011", "2012", "2013","2014","2015"], [], window.timeLineData);
    violins();
}

function labelAsSpambotClicked() {
    for(var userId in selectedUsers) {
        window.label[userId] = "spambot";

        // Add individual user id changes here

        changeActivityAccountToSpambot(userId);

    }
    changeClusterViewColor("user_id");
    // Add Bulk Change here
	d3.selectAll("#timeLineViewYAxis").selectAll("svg").remove();
	d3.selectAll("#TimeLineYOut").remove();
	timeLineView = new TimeLineView();
    timeLineView.draw("year", ["2007","2008","2009","2010","2011", "2012", "2013","2014","2015"], [], window.timeLineData);
    violins();
}

function refreshFeatureExplorer() {
    var checkboxes = document.getElementsByClassName("fe_cbox");
    var selected_features = [];
    for(i=0;i < checkboxes.length; i++) {
        if (checkboxes[i].checked) {
            selected_features.push(checkboxes[i].value);
        }
    }
    window.features = selected_features.slice(0, 3);
    console.log(window.features);
    violins(window.features);
}