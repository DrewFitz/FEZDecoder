// decoder.js
//
// A little program for inputting FEZ glyph sequences
// and getting statistics on the glyphs used.
//
// Written by Andrew Fitzpatrick
//
//

function Decoder() {
  // Properties
  this.currentLine = {};
  this.symbolEditor = document.getElementById("symbolEditor");
  this.sequenceView = document.getElementById("sequenceView");
  this.statsView = document.getElementById("stats");
  this.guessView = document.getElementById("guesses");
  this.debugView = document.getElementById("debug");

  // Methods
  // Create an image element with the ith symbol image
  this.ithImage = function(i) {
    var imageElement = document.createElement("img");
    var imageString = "symbols/" + i + ".png";
    imageElement.setAttribute("src", imageString);
    imageElement.id = i;
    return imageElement;
  };

  // Update stats view
  this.calculateStats = function() {
    // count up stuff
    var symbolFrequency = {};
    var key;
    var i, j;
    // loop lines
    var lines = this.sequenceView.childNodes;
    var sequence;
    for (i=0; i < lines.length; i+=1) {
      sequence = lines[i].childNodes;
      for (j=0; j < sequence.length; j+=1) {
        var element = sequence[j];
        key = parseInt(element.id, 10);
        if (key !== 0) { // ignore blanks which have a 0 key
          if (symbolFrequency[key]) {
            symbolFrequency[key] += 1;
          } else {
            symbolFrequency[key] = 1;
          }
        }
      }
    }

    // Sort the keys by frequency
    var sortedKeys = [];
    var compare = function(a, b) {
      // sorted inverted, higher numbers first
      return symbolFrequency[b] - symbolFrequency[a];
    };
    for (key in symbolFrequency) {
      if (symbolFrequency.hasOwnProperty(key)) {
        sortedKeys.push(key);
      }
    }
    sortedKeys.sort(compare);

    // display
    var list = document.createElement("ul");
    for (key in sortedKeys) {
      var thisOne = sortedKeys[key];
      if (symbolFrequency.hasOwnProperty(thisOne)) {
        var item = document.createElement("li");
        item.appendChild(this.ithImage(thisOne));

        var p = document.createElement("p");
        p.innerHTML = "- " + symbolFrequency[thisOne];
        item.appendChild(p);

        list.appendChild(item);
      }
    }

    this.statsView.innerHTML = "";
    this.statsView.appendChild(list);
  };

  // add a sequence item
  // called when an editor button is clicked
  this.pushSequence = function(object) {
    var i = object.id;
    if (!i) {
      i = 0;
    }
    // append element
    var image = this.ithImage(i);
    image.classList.add("sequenceItem");
    image.addEventListener("click", this, false);
    this.currentLine.appendChild(image);
    
    this.calculateStats();
  };

  // key event handler
  this.keyHandler = function(evt){
    var code = evt.keyCode;
    switch(code) {
      case 48: // 0
        this.sequenceView.innerHTML = "";
        this.newSequenceRow();
        this.calculateStats();
        break;
      case 13: // enter
        this.newSequenceRow();
        break;
      case 32: // space
        this.insertBlank();
        break;
      default:
        this.debugView.innerHTML = "Key pressed:" + code;
        break;
    }
  };

  // Event handler protocol method ///////////
  this.handleEvent = function(evt) {
    if (evt.type === "click") {
      console.log("button clicked");
      if (evt.currentTarget.classList.contains("symboleditorbutton")) {
        this.pushSequence(evt.currentTarget);
      } else if (evt.currentTarget.classList.contains("sequenceitem")) {
        // remove
        evt.currentTarget.parentNode.removeChild(evt.currentTarget);
        this.calculateStats();
      }
    } else if (evt.type === "keypress") {
      this.keyHandler(evt);
    }
  };

  // key events
  this.newSequenceRow = function(){
    if (!this.sequenceView.firstChild || this.currentLine.firstChild)  {
      this.debugView.innerHTML = "New Row";
      this.currentLine = document.createElement("li");
      this.sequenceView.appendChild(this.currentLine);
    } else {
      this.debugView.innerHTML = "We're not gonna have empty rows.";
    }
  };

  this.insertBlank = function(){
    this.pushSequence(0);
    this.debugView.innerHTML = "Insert space";
  };

  // sets up the editor
  var i;
  for (i = 1; i < 25; i+=1) {
    var newButton = document.createElement("div");
    newButton.classList.add("symbolEditorButton");
    newButton.id = i.toString(10);
    newButton.appendChild(this.ithImage(i));
    newButton.addEventListener("click", this, false);
    this.symbolEditor.appendChild(newButton);
  }


  document.addEventListener("keypress", this, false);
  this.newSequenceRow();
  this.debugView.innerHTML = "Loaded";

}

var decoder = new Decoder();

