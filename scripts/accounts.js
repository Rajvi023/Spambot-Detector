// Get the data
var activityAccountButton = d3.select("#activity_account_button");
var activityTweetButton = d3.select("#activity_tweet_button");
var activityWordcloudButton = d3.select("#activity_wordcloud_button");
var accountViewSvg = d3.select("#Accounts_activity_view_users");
var tweetViewSvg = d3.select("#Accounts_activity_view_tweets");
var wordcloudViewSvg = d3.select("#Accounts_activity_view_wordCloud");
var fontSizeMinInput = d3.select("#fontSizeRange0");
var fontSizeMaxInput = d3.select("#fontSizeRange1");
var wordPaddingInput = d3.select("#wcWordPadding");
var wordcloudfsmin = d3.select("#wordcloudfsmin");
var wordcloudfsmax = d3.select("#wordcloudfsmax");
var wordPaddingLabel = d3.select("#wordPaddingLabel");
var tweetResetBtn = d3.select("#tweetResetBtn");
var tweetFilterBtn = d3.select("#tweetFilterBtn");
var descendingOrderBtn = d3.select("#tweetsortdescending");
var ascendingOrderBtn = d3.select("#tweetsortascending");
var tweetSortDate = d3.select("#tweetsortdate");
var tweetSortRetweet = d3.select("#tweetsortretweet");
var tweetSortFavorite = d3.select("#tweetsortfavorite");

// var selectionOption = 0; // 0 - Add | 1 - Delete
// var selectedUsers = {};
var userTweets = {};
var wordCloudsvg;
var searchTweet = "";
var orderOfSort = "-1"; // -1 Descending | 1 Ascending
var wordCloudlayout;
var sortingPara = "timestamp"
var stopWords = ['i', 'me', 'my', 'myself', 'we', 'our', 'ours', 'ourselves', 'you', 'your', 'yours', 'yourself', 'yourselves',
                 'he', 'him', 'his', 'himself', 'she', 'her', 'hers', 'herself', 'it', 'its', 'itself', 'they', 'them', 'their',
                 'theirs', 'themselves', 'what', 'which', 'who', 'whom', 'this', 'that', 'these', 'those', 'am', 'is', 'are', 'was',
                 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'having', 'do', 'does', 'did', 'doing', 'a', 'an', 'the', 'and',
                 'but', 'if', 'or', 'because', 'as', 'until', 'while', 'of', 'at', 'by', 'for', 'with', 'about', 'against', 'between',
                 'into', 'through', 'during', 'before', 'after', 'above', 'below', 'to', 'from', 'up', 'down', 'in', 'out', 'on', 'off',
                 'over', 'under', 'again', 'further', 'then', 'once', 'here', 'there', 'when', 'where', 'why', 'how', 'all', 'any', 'both',
                 'each', 'few', 'more', 'most', 'other', 'some', 'such', 'no', 'nor', 'not', 'only', 'own', 'same', 'so', 'than', 'too',
                 'very', 's', 't', 'can', 'will', 'just', 'don', 'should', 'now', 'I', '@', '!', 'like', 'via', 'rt',
                 "i'm", '&amp', "don't", "&amp;", "?", "#", "$", "%", "&", "[", "]", "|", ".", "/", "~", "(", ")", "{", "}", " ", "",
                 "u", "ur", "-", "_", ":", "'", '"', ">", "<"];

tweetFilterBtn.on("click", filterBtnClicked);

fontSizeMinInput.on("change", function() {
    wordcloudfsmin.text(document.getElementsByName("fontSizeRange0")[0].value);
    if(currentActivityScreen == 2) {
        drawWordcloud();
    }
});

fontSizeMaxInput.on("change", function() {
    wordcloudfsmax.text(document.getElementsByName("fontSizeRange1")[0].value);
    if(currentActivityScreen == 2) {
        drawWordcloud();
    }
});

wordPaddingInput.on("change", function() {
    wordPaddingLabel.text(document.getElementsByName("wcWordPadding")[0].value);
    if(currentActivityScreen == 2) {
        drawWordcloud();
    }
});

tweetResetBtn.on("click", function() {
    document.getElementById("tweetSearchInput").value = "";
    filterBtnClicked();
});

function filterBtnClicked() {
    searchTweet = document.getElementById("tweetSearchInput").value;
    RefreshSegment();
}

function RefreshSegment() {
    if(currentActivityScreen == 2) {
        drawWordcloud();
    } else if(currentActivityScreen == 1) {
        drawTweets();
    }
}

function getPrettyDate(cDate) {
    var date = new Date(cDate);
    return moment(date).format('MMMM D, Y')
}

function wordFreq(string) {
    var words = string.replace(/[.]/g, '').split(/\s/);
    var freqMap = {};
    words.forEach(function(w) {
        if (!(stopWords.includes(w.toLowerCase()))) {
            if (!freqMap[w]) {
                freqMap[w] = 0;
            }
            freqMap[w] += 1;
        }
    });

    return freqMap;
}

function dynamicSort(property, order) {
    return function (a,b) {
        var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
        return result * order;
    }
}

function activityAccountBtnClick() {
    activityAccountButton.classed("active", true);
    activityTweetButton.classed("active", false);
    activityWordcloudButton.classed("active", false);
    if(currentActivityScreen != 0) {
       tweetViewSvg.style("display", "none");
       wordcloudViewSvg.style("display", "none");
       accountViewSvg.style("display", "block");
       currentActivityScreen = 0;
    }
}

function sortOrderChanged() {
    var radios = document.getElementsByName('tweetSortType');
    var option;
    for (var i = 0, length = radios.length; i < length; i++) {
        if (radios[i].checked) {
            option = radios[i].value;
            break;
        }
    }

    switch(option) {
        case "decending":
            orderOfSort = -1;
            break;
        case "ascending":
            orderOfSort = 1;
            break;
    }

    for(var i in userTweets) {
        userTweets[i].sort(dynamicSort(sortingPara, orderOfSort));
    }
    RefreshSegment();
}

function sortParameterChanged() {
    var radios = document.getElementsByName('tweetSortRadio');
    var option;
    for (var i = 0, length = radios.length; i < length; i++) {
        if (radios[i].checked) {
            option = radios[i].value;
            break;
        }
    }

    switch(option) {
        case "date":
            sortingPara = "timestamp";
            break;
        case "retweet":
            sortingPara = "retweet";
            break;
        case "favorite":
            sortingPara = "favorite";
            break;
    }

    for(var i in userTweets) {
        userTweets[i].sort(dynamicSort(sortingPara, orderOfSort));
    }
    RefreshSegment();
}

activityAccountButton.on("click", activityAccountBtnClick);
descendingOrderBtn.on("change", sortOrderChanged);
ascendingOrderBtn.on("change", sortOrderChanged)
tweetSortDate.on("change", sortParameterChanged)
tweetSortRetweet.on("change", sortParameterChanged)
tweetSortFavorite.on("change", sortParameterChanged)

activityTweetButton.on("click", function() {
   activityAccountButton.classed("active", false);
   activityTweetButton.classed("active", true);
   activityWordcloudButton.classed("active", false);
   if(currentActivityScreen != 1) {
       accountViewSvg.style("display", "none");
       wordcloudViewSvg.style("display", "none");
       tweetViewSvg.style("display", "block");
       currentActivityScreen = 1;
       drawTweets();
   }
});

activityWordcloudButton.on("click", function() {
   activityAccountButton.classed("active", false);
   activityTweetButton.classed("active", false);
   activityWordcloudButton.classed("active", true);
   if(currentActivityScreen != 2) {
       accountViewSvg.style("display", "none");
       tweetViewSvg.style("display", "none");
       wordcloudViewSvg.style("display", "block");
       currentActivityScreen = 2;
       drawWordcloud();
   }
});

d3.csv("../data/genuine_accounts_sample.csv/tweets.csv", function(error, data) {
    if (error) throw error;

    // format the data
    data.forEach(function(d) {
        if(!(d.user_id in userTweets)) {
            userTweets[d.user_id] = []
        }
        userTweets[d.user_id].push({
            "text": d.text,
            "timestamp": d.timestamp,
            "retweet": +d.retweet_count,
            "reply": +d.reply_count,
            "favorite": +d.favorite_count
        });
    })
});

/*
Example of 1 card in Account View (DOM element)
<div id="cardContainer_488351800" class="CardContainer" style="background-color: white;">
    <div class="AccountCardImageAndNameContainer">
        <img id="profileImage_488351800" class="AccountCardImage" src="https://twitter.com/angeli_masc/profile_image?size=original">
        <div class="AccountCard_featureContainer">
            <label class="AccountCardName" id="name_488351800">MASC</label>
            <label class="AccountCardScreenName" id="screenName_488351800">angeli_masc</label>
            <label class="AccountCardScreenName">Joined February 10, 2012</label>
        </div>
    </div>
    <div class="AccountCard_featureMainContainer">
        <div class="AccountCard_featureContainer">
            <label class="AccountCardName">Tweets:</label>
            <label class="AccountCardScreenName">60463</label>
        </div>
        <div class="AccountCard_featureContainer">
            <label class="AccountCardName">Following:</label>
            <label class="AccountCardScreenName">387</label>
        </div>
        <div class="AccountCard_featureContainer">
            <label class="AccountCardName">Followers:</label>
            <label class="AccountCardScreenName">568</label>
        </div>
        <div class="AccountCard_featureContainer">
            <label class="AccountCardName">Likes:</label>
            <label class="AccountCardScreenName">15599</label>
        </div>
    </div>
</div>
*/

function changeActivitySelectColor(userId) {
    d3.select("#" + "cardContainer_" + userId).style("background-color", "red");
}

function changeActivityUnselectColor(userId) {
    d3.select("#" + "cardContainer_" + userId).style("background-color", "white");
}

function changeActivityHoverColor(userId) {
    d3.select("#" + "cardContainer_" + userId).style("background-color", "orange");
}

function changeActivityAccountToGenuine(userId) {
    d3.select("#" + "cardContainer_" + userId).style("border-color", "#4DAF4A");
}

function changeActivityAccountToSpambot(userId) {
    d3.select("#" + "cardContainer_" + userId).style("border-color", "#984EA3");
}

function drawActivityView() {
    d3.csv("../data/genuine_accounts_sample.csv/users.csv", function(error, data) {
        if (error) throw error;

        // format the data
        data.forEach(function(d) {
            var cardContainer = accountViewSvg.append("div")
            .attr("id", "cardContainer_" + d.id )
            .attr("class", "CardContainer")
            .style("border-color", function() {
                switch(window.label[d.id]) {
                    case "genuine":
                        return "#4DAF4A";
                        break;
                    case "spambot":
                        return "#984EA3";
                        break;
                    case "unable":
                        return "#377EB8";
                        break;
                    default:
                        console.log("DEFAULT CASE: " + d.id);
                        break;
                }
            })
            .on("mouseover", function() {
                changeActivityHoverColor(d.id);
            })
            .on("mouseout", function() {
                if(d.id in selectedUsers) {
                    changeActivitySelectColor(d.id);
                } else {
                    changeActivityUnselectColor(d.id);
                }
            })
            .on("click", function() {
                if(selectionOption == 0) {
                    onAdding(d.id);
                } else if (selectionOption == 1) {
                    onRemoving(d.id);
                }
            });

            var accountCardImageNameContainer = cardContainer.append("div")
            .attr("class", "AccountCardImageAndNameContainer");

            var accountCardImage = accountCardImageNameContainer.append("img")
            .attr("id", "profileImage_" + d.id )
            .attr("class", "AccountCardImage")
            .attr("src", "https://twitter.com/" + d.screen_name + "/profile_image?size=original");

            var accountCardNameandScreenName = accountCardImageNameContainer.append("div")
            .attr("class", "AccountCard_featureContainer");

            accountCardNameandScreenName.append("label")
            .attr("class", "AccountCardName")
            .attr("id", "name_" + d.id)
            .text(d.name);

            accountCardNameandScreenName.append("label")
            .attr("class", "AccountCardScreenName")
            .attr("id", "screenName_" + d.id)
            .text("@" + d.screen_name);

            accountCardNameandScreenName.append("label")
            .attr("class", "AccountCardScreenName")
            .text("Joined " + getPrettyDate(d.created_at));

            var accountCardFeatureMainCard = cardContainer.append("div")
            .attr("class", "AccountCard_featureMainContainer");

            var accountCardTweetNumber = accountCardFeatureMainCard.append("div")
            .attr("class", "AccountCard_featureContainer");

            accountCardTweetNumber.append("label")
            .attr("class", "AccountCardName")
            .text("Tweets:");

            accountCardTweetNumber.append("label")
            .attr("class", "AccountCardScreenName")
            .text(d.statuses_count);

            var accountCardFollowingNumber = accountCardFeatureMainCard.append("div")
            .attr("class", "AccountCard_featureContainer");

            accountCardFollowingNumber.append("label")
            .attr("class", "AccountCardName")
            .text("Following:");

            accountCardFollowingNumber.append("label")
            .attr("class", "AccountCardScreenName")
            .text(d.friends_count);

            var accountCardFollowerNumber = accountCardFeatureMainCard.append("div")
            .attr("class", "AccountCard_featureContainer");

            accountCardFollowerNumber.append("label")
            .attr("class", "AccountCardName")
            .text("Followers:");

            accountCardFollowerNumber.append("label")
            .attr("class", "AccountCardScreenName")
            .text(d.followers_count);

            var accountCardLikesNumber = accountCardFeatureMainCard.append("div")
            .attr("class", "AccountCard_featureContainer");

            accountCardLikesNumber.append("label")
            .attr("class", "AccountCardName")
            .text("Likes:");

            accountCardLikesNumber.append("label")
            .attr("class", "AccountCardScreenName")
            .text(d.favourites_count);
        })

    });
}

/*
Example of 1 account Tweet (2 Tweets) in Tweet View (DOM element)
<div id="14558848" class="stickyCardContainer TweetViewItem" style="background-color: #984ea3; border-color: #984ea3;">
    <div class="AccountCardImageAndNameContainer">
        <img id="14558848_profileImage" class="AccountCardImage" src="/images/cheenath">
        <div class="AccountCard_featureContainer">
            <label id="14558848_name" class="AccountCardName">Manoj Cheenath</label>
            <label id="14558848_screenName" class="AccountCardScreenName">@cheenath</label>
            <label class="AccountCardScreenName">Joined April 27, 2008</label>
        </div>
    </div>
    <div class="AccountCard_featureMainContainer">
        <div class="AccountCard_featureContainer">
            <label class="AccountCardName">Tweets:</label>
            <label class="AccountCardScreenName">329</label>
        </div><div class="AccountCard_featureContainer">
            <label class="AccountCardName">Following:</label>
            <label class="AccountCardScreenName">445</label>
        </div><div class="AccountCard_featureContainer">
            <label class="AccountCardName">Followers:</label>
            <label class="AccountCardScreenName">543</label>
        </div><div class="AccountCard_featureContainer">
            <label class="AccountCardName">Likes:</label>
            <label class="AccountCardScreenName">514</label>
        </div>
    </div>
</div>
<p class = "TweetViewItem">
    <b>2015-04-15 16:40:19</b>
    <br>
    TWEET 1 TEXT
    <br>
    <br>
    <b>Timestamp 2</b>
    <br>
    TWEET 2 TEXT
</p>
*/

function drawTweets() {
    d3.selectAll(".TweetViewItem").remove();
    for(var id in selectedUsers) {
        var stickyCardContainer = tweetViewSvg.append("div")
        .attr("id", "stickyCard_" + id)
        .classed("stickyCardContainer", true)
        .classed("TweetViewItem", true)
        .style("background-color", "#984ea3")
        .style("border-color", "#984ea3");


        var accountCardImageNameContainer = stickyCardContainer.append("div")
        .attr("class", "AccountCardImageAndNameContainer");

        var accountCardImage = accountCardImageNameContainer.append("img")
        .attr("class", "AccountCardImage")
        .attr("src", "https://twitter.com/" + selectedUsers[id].screen_name + "/profile_image?size=original");

        var accountCardNameandScreenName = accountCardImageNameContainer.append("div")
        .attr("class", "AccountCard_featureContainer");

        accountCardNameandScreenName.append("label")
        .attr("class", "AccountCardName")
        .text(selectedUsers[id].name);

        accountCardNameandScreenName.append("label")
        .attr("class", "AccountCardScreenName")
        .text("@" + selectedUsers[id].screen_name);

        accountCardNameandScreenName.append("label")
        .attr("class", "AccountCardScreenName")
        .text("Joined " + getPrettyDate(selectedUsers[id].created_at));

        var accountCardFeatureMainCard = stickyCardContainer.append("div")
        .attr("class", "AccountCard_featureMainContainer");

        var accountCardTweetNumber = accountCardFeatureMainCard.append("div")
        .attr("class", "AccountCard_featureContainer");

        accountCardTweetNumber.append("label")
        .attr("class", "AccountCardName")
        .text("Tweets:");

        accountCardTweetNumber.append("label")
        .attr("class", "AccountCardScreenName")
        .text(selectedUsers[id].statuses_count);

        var accountCardFollowingNumber = accountCardFeatureMainCard.append("div")
        .attr("class", "AccountCard_featureContainer");

        accountCardFollowingNumber.append("label")
        .attr("class", "AccountCardName")
        .text("Following:");

        accountCardFollowingNumber.append("label")
        .attr("class", "AccountCardScreenName")
        .text(selectedUsers[id].friends_count);

        var accountCardFollowerNumber = accountCardFeatureMainCard.append("div")
        .attr("class", "AccountCard_featureContainer");

        accountCardFollowerNumber.append("label")
        .attr("class", "AccountCardName")
        .text("Followers:");

        accountCardFollowerNumber.append("label")
        .attr("class", "AccountCardScreenName")
        .text(selectedUsers[id].followers_count);

        var accountCardLikesNumber = accountCardFeatureMainCard.append("div")
        .attr("class", "AccountCard_featureContainer");

        accountCardLikesNumber.append("label")
        .attr("class", "AccountCardName")
        .text("Likes:");

        accountCardLikesNumber.append("label")
        .attr("class", "AccountCardScreenName")
        .text(selectedUsers[id].favourites_count);

        var tweetPara = tweetViewSvg.append("p")
        .classed("TweetViewItem", true)

        for(var i in userTweets[id]) {
            if(userTweets[id][i]["text"].includes(searchTweet)) {
                tweetPara.append("b").text(userTweets[id][i]["timestamp"]);
                tweetPara.append("br");
                tweetPara.append("text").text(userTweets[id][i]["text"]);
                if(i != userTweets[id].length - 1) {
                    tweetPara.append("br");
                    tweetPara.append("br");
                }
            }
        }
    }
}

function drawWordcloud() {
    var tmin = parseInt(document.getElementsByName("fontSizeRange0")[0].value);
    var tmax = parseInt(document.getElementsByName("fontSizeRange1")[0].value);
    var wordPad = parseInt(document.getElementsByName("wcWordPadding")[0].value);
    // console.log(tmin + " - " + tmax);
    var totalWordsAllowed = 300;
    var TweetString = "";
    for(var id in selectedUsers) {
        for(var i in userTweets[id]) {
            if(userTweets[id][i]["text"].includes(searchTweet)) {
                TweetString += userTweets[id][i]["text"];
            }
        }
    }

    var WordCountAll = wordFreq(TweetString);

    // Get an array of the keys:
    var SortedWordCount = Object.keys(WordCountAll);

    // Then sort by using the keys to lookup the values in the original object:
    SortedWordCount.sort(function(a, b) { return WordCountAll[b] - WordCountAll[a] });

    var wordCloudnum = 0;
    var WordCount = {};
    for(var i = 0; i < SortedWordCount.length; ++i) {
        WordCount[SortedWordCount[i]] = WordCountAll[SortedWordCount[i]];
        wordCloudnum += 1;
        if (wordCloudnum == totalWordsAllowed)
            break;
    }
    
    var arr = Object.keys( WordCount ).map(function ( key ) { return WordCount[key]; });
    var rmin = Math.min.apply( null, arr );
    var rmax = Math.max.apply( null, arr );

    var myWords = []
    for(var i in WordCount) {
        myWords.push({
            "text": i,
            "size": (((WordCount[i] - rmin)/(rmax - rmin))*(tmax - tmin)) + tmin
        })
    }

    var width = wordcloudViewSvg.node().getBoundingClientRect().width;
    var height = wordcloudViewSvg.node().getBoundingClientRect().height;

    d3.selectAll("#wordCloudSvg").remove();
    wordCloudsvg = wordcloudViewSvg.append("svg")
    .attr("id", "wordCloudSvg")
    .attr("width", '100%')
    .attr("height", '100%')
    .append("g")
    //.attr("transform", "translate(" + 10 + "," + 10 + ")");

    wordCloudlayout = d3.layout.cloud()
    .size([width,height])
    .words(myWords)
    //.words(myWords.map(function(d) { return {text: d}; }))
    .padding(wordPad)
    .fontSize(function(d) {
        return d.size;
    })
    //.fontSize(20)
    .on("end", drawCloud);

    wordCloudlayout.start();
}

function drawCloud(words) {
    wordCloudsvg
    .append("g")
    .attr("transform", "translate(" + wordCloudlayout.size()[0] / 2 + "," + wordCloudlayout.size()[1] / 2 + ")")
    .selectAll("text")
    .data(words)
    .enter().append("text")
    .style("font-size", function(d) { return d.size + "px"; })
    .attr("text-anchor", "middle")
    .attr("transform", function(d) {
        return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
    })
    .text(function(d) { return d.text; });
}