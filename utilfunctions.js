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
Array.prototype.equals = function (array) {
    // if the other array is a falsy value, return
    if (!array)
        return false;

    // compare lengths - can save a lot of time 
    if (this.length != array.length)
        return false;

    for (var i = 0, l=this.length; i < l; i++) {
        // Check if we have nested arrays
        if (this[i] instanceof Array && array[i] instanceof Array) {
            // recurse into the nested arrays
            if (!this[i].equals(array[i]))
                return false;       
        }           
        else if (this[i] != array[i]) { 
            // Warning - two different object instances will never be equal: {x:20} != {x:20}
            return false;   
        }           
    }       
    return true;
}   
function generateDefaultTruthTable(uniques) {
  var truth_matrix = new Array(Math.pow(2,uniques.length));
  for(i = 0 ; i < Math.pow(2,uniques.length); i++)
    truth_matrix[i] = new Array(uniques.length);      //generates a 2d array the size of the entire truth table
  for(var i = 0; i < uniques.length; i++)
    {
      var current_truth_value = false; 
      for(j = 0, k = 1; j < Math.pow(2,uniques.length); j++,k++)
      {   
        if(k > (Math.pow(2,uniques.length)/Math.pow(2,i+1))) 
        {
           current_truth_value = !current_truth_value;
           k = 1;
        }
        truth_matrix[j][i]=current_truth_value;
      }
    }
  return truth_matrix;
};
function tableCreate()
{

  var input_1 = document.getElementById("equation").value;
  var input_2 = document.getElementById("equation2").value;
  var parsed_input_1 = parseString(input_1);
  if(input_2 != null && input_2 != "")
    var input_2_is_filled = true;
  else
    var input_2_is_filled = false;
  if(input_2_is_filled)
  {
    var parsed_input_2 = parseString(input_2);
    var uniques = getUnique(input_1,input_2);
    var uniques_str = uniques.join(",");
    var c = "function equation2(" + uniques_str + ") {return(" + parsed_input_2 +  ");}";
    try {
      eval(c);
    }
    catch(err)
    {
      throw new SyntaxError("input 2 syntax error");
    }
  }
  else
  {
    var uniques = getUnique(input_1);
    var uniques_str = uniques.join(",");
  }
  var z = "function equation1(" + uniques_str + ") {return(" + parsed_input_1 +  ");}";
  try{
    eval(z);
  }
  catch(err)
  {
    throw new SyntaxError("input 1 syntax error");
  }
  var tbl=document.getElementById('result');
  document.getElementById('result').innerHTML = "";
  var tbdy=document.createElement('tbody');
  var tr = document.createElement('tr');

  var ans_array = [];
  for(var i = 0; i < 2; i++)
  {
      ans_array[i] = new Array(uniques.length);
  }

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
  if(input_2_is_filled)
  {
    var th = document.createElement('th');
    var newContent = document.createTextNode("#2");
    th.appendChild(newContent);
  }
  
  tr.appendChild(th);
  tbdy.appendChild(tr);
  var truth_matrix = generateDefaultTruthTable(uniques);
  for(var i=0;i<Math.pow(2,uniques.length);i++){
      var tr=document.createElement('tr');
      for(var j=0;j<uniques.length;j++){
          var td=document.createElement('td');
          if(truth_matrix[i][j] == true)
            {
              td.appendChild(document.createTextNode("1"));
            }
          else
            {
          td.appendChild(document.createTextNode("0"));
            }
          tr.appendChild(td);
      }
     
     var argument = truth_matrix[i].join(",");

     var ans = equation1.apply(null, truth_matrix[i]); 
     var td=document.createElement('td');
     if(ans)
        td.appendChild(document.createTextNode("1"));
     else
        td.appendChild(document.createTextNode("0"));
      ans_array[0].push(ans);
      tr.appendChild(td);

      if(input_2_is_filled)
      {  
            var ans = equation2.apply(null, truth_matrix[i]);
            ans_array[1].push(ans);
            var td=document.createElement('td');
            if(ans)
              td.appendChild(document.createTextNode("1"));
            else
              td.appendChild(document.createTextNode("0"));
            tr.appendChild(td);
      }
      tbdy.appendChild(tr);
  }
  tbl.appendChild(tbdy);
  if(input_2_is_filled)
  {
    if(ans_array[0].equals(ans_array[1]))
    {
      document.getElementById("isEqual").innerHTML = "#1 and #2 is equal";
    }
    else
    {
      document.getElementById("isEqual").innerHTML = "#1 and #2 is not equal";
    }
  }
  else
  {
    document.getElementById("isEqual").innerHTML = "";
  }
};
function getUnique()
{
  var chars = [];
  for(i = 0; i < arguments.length; i++ )
  {
    for( j = 0; j < arguments[i].length; j++)
    {
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