var request;
var skills;
var li;

var tokens = document.getElementById("tokens");
var searchInput = document.getElementById("search-field");
var queryInput = document.getElementById("query");
var autocomplete = document.getElementById("autocomplete");
var tags = document.getElementById("tags");
var errors = document.getElementById('notices');

var selectedToken = -1;
var list = autocomplete.childNodes;
var searchFrm = document.form;

if (tags != null) {
  tags = tags.value.split(",");

  for(var i = 0; i < tags.length; i++) {
    addToken(tags[i]);
  }
}

if (window.XMLHttpRequest) {
  request = new XMLHttpRequest();
} else {
  request = new ActiveXObject("Microsoft.XMLHTTP");
}

request.open("GET", "/js/skills.json");

request.onreadystatechange = function() {
  if ((request.readyState===4) && (request.status===200)) {
    skills = JSON.parse(request.responseText);
  }
}

request.send();

function addToAutocomplete(value) {
  var li = document.createElement("li");
  li.appendChild(document.createTextNode(value));

  li.onclick = function() {
    addToken(value);
  };

  autocomplete.appendChild(li);
}

function addToken(value) {
  var listItems = tokens.getElementsByTagName("li");
  var token = document.createElement("li");

  token.appendChild(document.createTextNode(value + ","));
  token.style.marginRight = "6px";

  if (listItems.length < 6) {
    var lastChild = listItems[listItems.length - 1];
    tokens.insertBefore(token, lastChild);
  } else {
    errors.innerHTML = "You can add up to 5 skills";
  }

  searchInput.focus();

  searchInput.value = "";
  searchInput.removeAttribute("placeholder");
  autocomplete.style.display = "none";
}

function deleteToken(token) {
  tokens.removeChild(token);

  if(tokens.childNodes.length == 3) {
    searchInput.setAttribute("placeholder", "e.g. Ruby, Cuba, Redis");
    searchInput.style.width = "200px";
  }
}

tokens.onclick = function() {
  searchInput.focus();
};

document.onclick = function(e) {
  if (e.srcElement.id == "search-field") {
    autocomplete.style.display = "block";

    for (var key in skills) {
      addToAutocomplete(skills[key].name);
    }
  } else {
    autocomplete.style.display = "none";
  }
};

searchInput.onkeydown = function(e) {
  e = e || window.event;

  autocomplete.style.display = "block";
  searchInput.removeAttribute("placeholder");
  searchInput.style.width = "150px";

  if (e.keyCode == '13') {
    if (searchInput.value == "") {
      return true;
    } else if (selectedToken == -1 && searchInput.value != "") {
      addToken(list[selectedToken + 1].innerHTML);
    } else  {
      addToken(list[selectedToken].innerHTML);
      selectedToken = -1;
    }

    return false;
  }

  if ((e.keyCode == '27') || (e.keyCode == '9')) {
    autocomplete.style.display = "none";
  }

  if (e.keyCode == '8') {
    if (searchInput.value == "") {
      var skills = tokens.getElementsByTagName("li");
      var token = skills[skills.length - 2];

      deleteToken(token);
    }
  }
};

searchInput.onkeyup = function(e) {
  var input = searchInput.value;
  var regExp = new RegExp(input, "i");

  autocomplete.innerHTML = "";

  if (searchInput.value.length < 2) {
    autocomplete.style.height = "200px";
    autocomplete.style.overflowY = "scroll";
  } else {
    autocomplete.style.height = "auto";
    autocomplete.style.overflowY = "hidden";
  }

  for (var key in skills) {
    if (skills[key].name.search(regExp) != -1 ) {
      addToAutocomplete(skills[key].name);
    }
  }

  e = e || window.event;

  if (e.keyCode == '38') {
    if(selectedToken > 0) {
      list[--selectedToken].id = "highlight";
    }
  }
  else if (e.keyCode == '40') {
    if(selectedToken < list.length - 1) {
      list[++selectedToken].id = "highlight";
    }
  }
};

postFrm.onsubmit = function() {
  var skills = tokens.getElementsByTagName("li");
  var query = "";

  for (var i = 0; i < skills.length -1; i++) {
    query += skills[i].innerHTML;
  }

  queryInput.value = query;
};
