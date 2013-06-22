//kamiljs - sınıf tabanlı javascript oluşturma kütüphanesi
//oluşturan Serkan KOCAMAN - KiPSOFT
var LibPath = "../../library/";
var general = require(LibPath + "general/general.objects.js");
var strutils = require(LibPath + "general/general.strutils.js");
var fs = require('fs');

var TType = {
  "Var": 0,
	"Func": 1,
	"If": 2,
	"For": 3,
	"Else": 4,
	"Cmd": 5
};

var TVariable = function() {
	this.Type = null;
	this.Name = "";
	this.DefaultValue = "";
};

var TCmd = function() {
	this.Name = "";
	this.Type = null;
	this.Params = null;
}

	function JSON2Code(json) {		
		var Donus = JSON.stringify(json).replace(/\"([^(\")"]+)\":/g, "$1:");
		//Donus = strutils.ReplaceStr(Donus, "\"|<", "");
		//Donus = strutils.ReplaceStr(Donus, ">|\"", "");
		//ozellik tipi 4 olan kayitlar için geçerlidir.x
		Donus = Donus.replace(/"\|/g, "");
		Donus = Donus.replace(/\|"/g, "");											
		return Donus;
	}

	function CodeGen(object, position) {
		var Code = "";
		if (typeof(object) == "object") {
			if (object.Type == TType.Var) {
				Code = "var " + object.Name;
				if (object.DefaultValue != "" && object.DefaultValue != null) Code += "  " + object.DefaultValue;
			} else if (object.Type == TType.Cmd) {
				Code += object.Name + "(";
				for (var i = 0; i < object.Params.length; i++) {
					if (typeof(object.Params[i]) == "string") if (object.Params[i].substr(0, 5) == "json<") Code += object.Params[i].substr(5, object.Params[i].length - 4) + ",";
					else Code += "\"" + object.Params[i] + "\",";
					else if (typeof(object.Params[i]) == "number" || typeof(object.Params[i]) == "numeric") Code += object.Params[i] + ",";
					else if (typeof(object.Params[i] == "object")) {
						Code += object.Params[i].GetCode();
					}
				}
				if (Code.substr(-1, 1) == ",") Code = Code.substr(0, Code.length - 1);
				Code += ")"
			} else if (object.Type == TType.String) {
				Code += object.Params;
			}			
		} 
		else if (typeof(object) == "string" && object.substr(0, 4) == "var<") Code += object.substr(4, object.length - 3);
		else if (typeof(object) == "string" && position == "l") Code += object;
		else if (typeof(object) == "string" && position == "r") Code += "\"" + object + "\"";		
		else if (typeof(object) == "number" || typeof(object) == "numeric") Code += object;
		return Code;
	}

var TLine = function() {
	this.Name = null;
	this.Left = null;
	this.Right = null;
	this.GetCode = function() {
		if (this.Left == null) throw new Error("unexpected error.");
		var Code = CodeGen(this.Left, "l");
		if (this.Right != null) Code += " = " + CodeGen(this.Right, "r");
		return Code + ";";		
	};
}

var TBlock = function() {
	var Self = this;
	this.Name = "";
	this.Type = null;
	this.Params = "";
	this.Parent = null;
	//this.Variables = new general.TCollection();
	this.Blocks = new general.TCollection();
	this.Lines = new general.TCollection();
	this.SelectedLine = null;
	this.SelectedLineIndex = -1;
	//satır eklemek için kullanılır.
	//var v = new Array(); komutu için
	//AddLine("satir1", Add("v", TType.Var, null), Add("new Array", TType.Cmd, []));
	this.AddLine = function(name, left, right, before) {
		if (name == null) name = this.Name + (new Date()).getTime();		
		var l = new TLine();
		l.Name = name;
		l.Left = left;
		l.Right = right;
		if (before && this.SelectedLineIndex != -1) this.Lines.Add(this.SelectedLineIndex - 1, name, l);
		else this.Lines.Add(-1, name, l);
		this.SelectedLine = l;
		this.SelectedLineIndex = this.Lines.IndexOf(l.Name);
		return l;
	};
	//type değişkeni variable için TType tipindedir
	//params değişkeni array tipindedir.
	this.Add = function(name, type, params) {
		if (type == TType.Var) {
			var v = new TVariable();
			v.Name = name;
			v.DefaultValue = params;
			v.Type = TType.Var;
			//this.Variables.Add(-1, name, v);
			return v;
		} else if (type == TType.Cmd) {
			if (name == null) throw new Error("command name required.");
			var v = new TCmd();
			v.Type = TType.Cmd;
			v.Name = name;
			v.Params = params;
			return v;
		} else {
			if (type == TType.Func && name == null) throw new Error("function name required.");
			if (name == null) name = this.Name + (new Date()).getTime();
			var v = new TBlock();
			v.Name = name;
			v.Params = params;
			v.Type = type;
			v.Parent = Self;
			this.Blocks.Add(-1, name, v);
			return v;
		}
	};	
	this.Find = function(name, type) {
		if (type == TType.Var) {
			return this.Variables.Get(name);
		} else {
			return this.Blocks.Get(name);
		}
	};
	this.FindLine = function(name) {
		this.SelectedLine = this.Lines.Get(name);
		this.SelectedLineIndex = this.Lines.IndexOf(name);
		return this.Lines.Get(name);
	};
	this.PrevLine = function() {
		if (this.SelectedLineIndex + 1 <= this.Lines.Count()) {
			this.SelectedLineIndex++;
			this.SelectedLine = this.Lines.Get(this.SelectedLineIndex);
		}
	};
	this.NextLine = function() {
		if (this.SelectedLineIndex - 1 >= 0) {
			this.SelectedLineIndex--;
			this.SelectedLine = this.Lines.Get(this.SelectedLineIndex);
		}
	};
	this.GetCode = function() {
		var Code = "";
		if (this.Type == null) {
			for (var i = 0; i < this.Lines.Count(); i++) {				
				Code = Code + this.Lines.Get(i).GetCode() + "\n";
			};
			for (var i = 0; i < this.Blocks.Count(); i++) {
				if (this.Blocks.Get(i).Type == TType.Func) Code = Code + this.Blocks.Get(i).GetCode();
			}
		} else {
			Code = "function " + this.Name + "(" + this.Params + ") { \n";
			for (var i = 0; i < this.Lines.Count(); i++) {
				Code = Code + this.Lines.Get(i).GetCode() + "\n";
			};
			Code = Code + "}";
		}
		return Code;
	};
}

var TKamil = function() {
	TKamil.prototype.constructor.call(this);
	this.Depends = new Array();
	this.SaveToFile = function(FileName) {
		fs.writeFileSync(FileName, this.GetCode());
	};
}

TKamil.prototype = Object.create(new TBlock());

exports.TType = TType;
exports.TBlock = TBlock;
exports.TKamil = TKamil;
exports.JSON2Code = JSON2Code;
