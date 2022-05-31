var http = require("http");
var url = require("url");
var events = require("events");
var NewsService = require("./newsModel/NewsService");
var newsService = new NewsService();

function processOptions(req, res) {
  let resBody = "";
  let resMsg = "";
  let urlObj = url.parse(req.url, true, false);
  let qstr = urlObj.query;
  if (req.method == "GET") {
    // Add a new story function
    if (qstr.storyoptions == "add") {
      resMsg =
        "<form>" +
        '<label for="story-title">Title for story:</label><br>' +
        '<input type="text" id="storytitle" name="storytitle" size="20" value="Enter your headline"></input><br>' +
        '<label for="story-content">Story content:</label><br>' +
        '<textarea id="storycontents" name="storycontent" rows="6" cols="75">Enter your story here</textarea><br>' +
        '<input type="submit" value="Submit"></input><br>' +
        "</form>";
      resBody = resBody + "<html><head><title>Add Story</title></head>";
      resBody = resBody + "<body>" + resMsg;
      res.end(resBody + "\n</body></html>");
      //newsService.addStory();
    } else if (qstr.storyoptions == "edit") {
      resMsg =
        "<form>" +
        '<label for="story-id">Story ID:</label><br>' +
        '<input type="text" id="storyid" name="storyid" size="5"></input><br>' +
        '<label for="edit-content">Content to change to:</label><br>' +
        '<textarea id="editcontent" name="editcontent" rows="6" cols="75">Enter your revised story here</textarea><br>' +
        '<input type="submit" value="Submit"></input><br>' +
        "</form>";
      resBody = resBody + "<html><head><title>Edit Story</title></head>";
      resBody = resBody + "<body>" + resMsg;
      res.end(resBody + "\n</body></html>");
    } else if (qstr.storyoptions == "search") {
      resMsg =
        "<form>" +
        '<label for="search-by">Search by:</label><br>' +
        '<label for="search-title">Title</label><br>' +
        '<input type="text" id="search-title" name="search-title" size="20"></input><br>' +
        '<label for="search-author">Author</label><br>' +
        '<input type="text" id="search-author" name="search-author" size="20"></input><br>' +
        '<label for="search-author">Start date</label><br>' +
        '<input type="date" id="start-date" name="start-date"></input><br>' +
        '<label for="search-author">End date</label><br>' +
        '<input type="date" id="end-date" name="end-date"></input><br>' +
        '<label for="story-title">Story ID:</label><br>' +
        '<input type="text" id="search-id" name="search-id" size="5"></input><br>' +
        '<input type="submit" value="Submit"></input><br>' +
        "</form>";
      resBody = resBody + "<html><head><title>Search for Story</title></head>";
      resBody = resBody + "<body>" + resMsg;
      res.end(resBody + "\n</body></html>");
      //let newsStories = newsService.getStoriesForFilter();
    } else if (qstr.storyoptions == "delete") {
      resMsg =
        "<form>" +
        '<label for="story-title">Story ID to delete:</label><br>' +
        '<input type="text" id="delete-id" name="delete-id" size="5"></input><br>' +
        '<input type="submit" value="Submit"></input><br>' +
        "</form>";
      resBody = resBody + "<html><head><title>Delete Story</title></head>";
      resBody = resBody + "<body>" + resMsg;
      res.end(resBody + "\n</body></html>");
      //newsService.delete();
    } else if (qstr.storyoptions =="update") {
      // update headline
      resMsg =
        "<form>" +
        '<label for="story-id">Story ID:</label><br>' +
        '<input type="text" id="story-id" name="storyid" size="5"></input><br>' +
        '<label for="edit-headline">New headline:</label><br>' +
        '<input type="text" name="editheadline" size="20"></input><br>' +
        '<input type="submit" value="Submit"></input><br>' +
        "</form>";
      resBody = resBody + "<html><head><title>Update Headline</title></head>";
      resBody = resBody + "<body>" + resMsg;
      res.end(resBody + "\n</body></html>");
      //newsService.updateTitle(id, newTitle);
    }
  }
}

async function storiesFunc(req, res) {
  let resBody = "";
  let resMsg = "";
  // This way of parsing a query string is deprecated but I still find it much easier
  // than trying to use the new WhatWG URL object and trying to parse the searchParams
  let urlObj = url.parse(req.url, true, false);
  let qstr = urlObj.query;

  // Let's check the URL first
  if (urlObj.pathname == "/stories") {
    resMsg =
      "<form>" +
      '<label for="story-options">What would you like to do?</label><br>' +
      '<input type="radio" id="Add" name="storyoptions" value="add"><label for="add">Add</label><br>' +
      '<input type="radio" id="Search" name="storyoptions" value="search"><label for="search">Search</label><br>' +
      '<input type="radio" id="Update" name="storyoptions" value="update"><label for="update">Update Headline</label><br>' +
      '<input type="radio" id="Edit" name="storyoptions" value="edit"><label for="edit">Edit</label><br>' +
      '<input type="radio" id="Delete" name="storyoptions" value="delete"><label for="delete">Delete</label><br>' +
      '<input type="submit" value="Submit"></input></br>' +
      "</form>";
    resBody = resBody + "<html><head><title>Story Menu</title></head>";
    resBody = resBody + "<body>" + resMsg;
    let promise = await processOptions(req, res);
    res.end(resBody + "\n</body></html>");

    // to determine what behavior to invoke, we rely on HTTP verbs to tell us
    /*if (req.method == "GET") {
        // query string spec: ?title=<title>&author=<author>
        let newsStories = newsService.getStoriesForFilter(qstr);
        // being optimistic here, error-checking needs to be added
        res.writeHead(200, {
          "Content-Type": "application/json",
        });
        res.end(JSON.stringify(newsStories));
      } else if (req.method == "POST") {
        var reqData = "";
        req.on("data", function (chunk) {
          reqData += chunk;
        });
        req.on("end", function () {
          var postParams = JSON.parse(reqData);
          var isTrueSet = postParams.flag === "true";
          console.log(postParams);
          let storyId = newsService.addStory(
            postParams.title,
            postParams.content,
            postParams.author,
            isTrueSet,
            postParams.date
          );
          res.writeHead(201, {
            "Content-Type": "application/json",
          });
          res.end(
            JSON.stringify({
              storyId: storyId,
            })
          );
        });
      } else {
        // error case, 405 method not supported
        res.writeHead(405, {
          "Content-Type": "application/json",
        });
        res.end(JSON.stringify("method not supported"));
      }*/
  } else if (urlObj.pathname == "/test") {
    res.writeHead(200, { "Content-Type": "text/html" });
    resMsg = "<form>" + '<label for="test">you made it :)</label>' + "</form>";
    resBody += "<html><head><title>Test Menu</title></head>";
    resBody += "<body>" + resMsg;
    res.end(resBody + "\n</body></html>");
  } else {
    // error case, 404 not found
    res.writeHead(404, {
      "Content-Type": "application/json",
    });
    res.end(JSON.stringify("not found :("));
  }
}

http.createServer(storiesFunc).listen(3000);
