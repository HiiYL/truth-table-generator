String.prototype.removeAt=function(index) {
    return this.substr(0, index) + this.substr(index+1);
}
String.prototype.regexLastIndexOf = function(regex, startpos) {
    regex = (regex.global) ? regex : new RegExp(regex.source, "g" + (regex.ignoreCase ? "i" : "") + (regex.multiLine ? "m" : ""));
    if(typeof (startpos) == "undefined") {
        startpos = this.length;
    } else if(startpos < 0) {
        startpos = 0;
    }
    var stringToWorkWith = this.substring(0, startpos + 1);
    var lastIndexOf = -1;
    var nextStop = 0;
    while((result = regex.exec(stringToWorkWith)) != null) {
        lastIndexOf = result.index;
        regex.lastIndex = ++nextStop;
    }
    return lastIndexOf;
}
  function load(uniques) {
  //var uniques = ["A","B"];
  var test = new Array(Math.pow(2,uniques.length));
  for(i = 0 ; i < Math.pow(2,uniques.length); i++)
    test[i] = new Array(uniques.length);
  for(var i = 0; i < uniques.length; i++)
    {
      var x = false; 
      for(j = 0, k = 1; j < Math.pow(2,uniques.length); j++,k++)
      {   
        if(k > (Math.pow(2,uniques.length)/Math.pow(2,i+1))) 
        {
           x = !x;
           k = 1;
        }
        test[j][i]=x;
      }
    }
  return test;
};
function tableCreate()
{
  var x = document.getElementById("equation").value;
  var a = document.getElementById("equation2").value;
  var y = parseString(x);
  if(x == null || x == "")
  {
    document.getElementById("err-msg").innerHTML = "Field 1 must not be blank!";
  }
  else
  {
     document.getElementById("err-msg").innerHTML = "";
  }
  if(a != null && a != "")
    var a_is_filled = true;
  else
    var a_is_filled = false;
  //console.log("A IS FILLED IS " + a_is_filled.toString());
  if(a_is_filled)
  {
    var b = parseString(a);
    var uniques = getUnique(x,a);
    var uniques_str = uniques.join(",");
    var c = "function equation2(" + uniques_str + ") {return(" + b +  ");}";
    eval(c);
    console.log("A IS FILLED AND UNIQUES IS ");
  }
  else
  {
    console.log("A IS NOT FILLED AND UNIQUES IS ");
    var uniques = getUnique(x);
    var uniques_str = uniques.join(",");
  }
  var z = "function wow(" + uniques_str + ") {return(" + y +  ");}";
  eval(z);
  //var body=document.getElementsByTagName('body')[0];
  var tbl=document.getElementById('result');
  document.getElementById('result').innerHTML = "";
  tbl.style.width='100%';
  tbl.setAttribute('border','1');
  var tbdy=document.createElement('tbody');
  var tr = document.createElement('tr');
  for (var i = 0 ; i < uniques.length; i++)
  {
    var th = document.createElement('th');
    var newContent = document.createTextNode(uniques[i]);
    th.appendChild(newContent);
    tr.appendChild(th);
  }
  var th = document.createElement('th');
  var newContent = document.createTextNode("#1");
  th.appendChild(newContent);
  tr.appendChild(th);
  if(a_is_filled)
  {
    var th = document.createElement('th');
    var newContent = document.createTextNode("#2");
    th.appendChild(newContent);
  }
  
  tr.appendChild(th);
  tbdy.appendChild(tr);
  var test = load(uniques);
  for(var i=0;i<Math.pow(2,uniques.length);i++){
      var tr=document.createElement('tr');
      for(var j=0;j<uniques.length;j++){
          var td=document.createElement('td');
          if(test[i][j] == true)
            {
              td.appendChild(document.createTextNode("1"));
            }
          else
            {
          td.appendChild(document.createTextNode("0"));
            }
          tr.appendChild(td);
      }
     var argument = test[i].join(",");
     var ans = wow.apply(null, test[i]); 
     var td=document.createElement('td');
     if(ans)
        td.appendChild(document.createTextNode("1"));
     else
        td.appendChild(document.createTextNode("0"));
      tr.appendChild(td);
      if(a_is_filled)
      {  
            var ans = equation2.apply(null, test[i]);
            var td=document.createElement('td');
            if(ans)
              td.appendChild(document.createTextNode("1"));
            else
              td.appendChild(document.createTextNode("0"));
            //td.appendChild(document.createTextNode(ans.toString()));
            tr.appendChild(td);
      }
      tbdy.appendChild(tr);
  }
  tbl.appendChild(tbdy);
  //body.appendChild(tbl);
};
function getUnique()
{
  var chars = [];
  for(i = 0; i < arguments.length; i++ )
  {
    for( j = 0; j < arguments[i].length; j++)
    {
      //console.log(arguments[i][i] + /[A-Z]/gi.test(arguments[i][i]).toString());
      if(chars.indexOf(arguments[i][j])==-1 && /[A-Z]/gi.test(arguments[i][j]))
      {
        chars.push(arguments[i][j]);
      }
    }
  }
  return chars;
};
function insertAt(src, index, str) {
    return src.substr(0, index) + str + src.substr(index)
};
function parseString(str) {
  l = str.regexLastIndexOf(/[)][']/gi);
  while(l != -1)
  {
    
    m = str.search(/[(].*[)][']/gi);
    str = str.removeAt(l+1);
    str = insertAt(str, m, "!");
    l = str.regexLastIndexOf(/[)][']/gi);
  }
  k = str.search(/[A-Z][']/gi);
  while(k != -1)
  {
    str = str.replace("'","");
    str = insertAt(str, k, "!");
    k = str.search(/[A-Z][']/gi);
  }
  i = str.search(/[A-Z][!]?[(]?[A-Z]/gi);
  while(i != -1)
  {
    str = insertAt(str, i+1, "&&");
    i = str.search(/[A-Z][!]?[A-Z]/gi);
  }
  j = str.search(/[)][A-Z]/gi);
  while(j != -1)
  {
    str = insertAt(str, j+1, "&&");
    j = str.search(/[)][A-Z]/gi);
  }
  str = str.replace(/[+]/g,"||").replace(/[)][(]/g, ")&&(").replace(/\^/g, "!=");

  return str;
};