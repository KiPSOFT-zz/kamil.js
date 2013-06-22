kamil.js
========

javascript class-based code generation library (for node.js)

with the help of a few commands you can tracking on kamil.js create javascript code.

structure
========

TKamil = class extends TBlock

TKamil.SaveToFile (FileName)

Writes the data in the block formed.

TBlock = class

The main class of the library. method and contains a lot of base property.

TBlock.AddLine (name, left, right, before)

AddLine method is used to add a command line in the block.
As an example, console.log ("what's up") the output of a AddLine.

name = Unique name to be used for each row.

left and right = TVariable, TCmd or parameters that can TBlock value.
                 Add Method for the return value are equal. In the code "=" (equal) sign
                 should be considered as the left and right side. If there is a synchronization parameter, only the left
                 filled.
                 
Adding a few lines to do before before = is used to specify the desired line.

TBlock.Add (name, type, params)

AddLine lines to be added with the Add method is used to generate the parameters for the left and right.

name = Unique name to be used for each part.

type = Ttype must have a value equal to the constant.
  	There Ttype = {
	    "Yes": 0,
             "Func": 1,
             "If": 2,
             "For": 3,
             "Else": 4,
             "Cmd": 5
	 };

params = add the data into an area that can be processed. fonkisyonların functions of the parameters, the commands
	 constitutes the command parameters. There are definitions of the variable test = "bubirdeneme" statement that
	 "bubirdeneme" is equivalent to the constant.

TBlock.Find (name, type)

Returns the name of the type of the command by.

TBlock.FindLine (name)

Returns the name of the line.

TBlock.PrevLine ()

Positions on the active row to the previous row.

TBlock.NextLine ()

active line is positioned to the next line.

TBlokc.GetCode ()

Returns the output of the block of code.

kamil.js structure of a sample:                 



	var kml = new kamil.TKamil();  
  	var blk = kml.Add("IndexYaz", kamil.TType.Func, "");	
	blk.AddLine("satir1", blk.Add("console.log", kamil.TType.Cmd, ["index html oluşturuluyor."]));	
	blk.AddLine("satir2", blk.Add("$", kamil.TType.Cmd, []), 
		blk.Add("cheerio.load", kamil.TType.Cmd, ["<html></html>"]));	
	blk.AddLine("satir3", blk.Add("$(\"html\").append", kamil.TType.Cmd, ["<head></head>"]));	
	console.log(kml.GetCode());	
  
  result;
  
  
  	function IndexYaz() {
    	  console.log("index.html oluşturuluyor.");
    	  $ = cheerio.load("<html></html>");
    	  $("html").append("<head></head>");
  	}
  
  
.  
