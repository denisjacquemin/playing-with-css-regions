ColdFusion.Bind.assignValue=function(_31a,_31b,_31c,_31d){
/* this function has been modifed from cfajax.js 
and is 
Copyright 2007 Adobe Systems Incorporated
All Rights Reserved.

Only one line was need for the fix, search for
"this is the line I changed"
*/


	var $C=ColdFusion;
	var $U=$C.Util;
	var $E=$C.Event;
	var $L=$C.Log;
	// _31a = bindTo, _31b = bindToAttr, _31c = ?, _31d = bindToParams
	if(!_31a){return;}
	if(_31a.call){_31a.call(null,_31c,_31d); return;}
	var _31e=$C.objectCache[_31a];
	if(_31e&&_31e._cf_setValue){_31e._cf_setValue(_31c);return;}
	var _31f=document.getElementById(_31a); // get a pointer to the element
	if(!_31f){$C.handleError(null,"bind.assignvalue.elnotfound","bind",[_31a]);}
	if(_31f.tagName=="SELECT"){
		var _320=$U.checkQuery(_31c); // should return "null" since this is an array not a query.
		var _321=$C.objectCache[_31a]; // a pointer to the bound object
		if(_320){ // triggered if this is a query
			if(!_321||(_321&&(!_321.valueCol||!_321.displayCol))){
				$C.handleError(null,"bind.assignvalue.selboxmissingvaldisplay","bind",[_31a]);
				return;
			}
		}else{ // an array was passed
			if(typeof (_31c.length)=="number"&&!_31c.toUpperCase){
				if(_31c.length>0&&(typeof (_31c[0].length)!="number"||_31c[0].toUpperCase)){
					$C.handleError(null,"bind.assignvalue.selboxerror","bind",[_31a]);
					return;
				}
			}else{
				$C.handleError(null,"bind.assignvalue.selboxerror","bind",[_31a]);
				return;
			}
		}
			_31f.options.length=0;
			if(!_320){ // for the array
				for(var i=0;i<_31c.length;i++){
					// this is the line I changed
					//var opt=new Option(_31c[i][1],_31c[i][0]);
					var opt=new Option(_31c[i][1],_31c[i][0],false,_31c[i][2]);
					_31f.options[i]=opt;
				} // if !320
			}else{ // for queries
				if(_320=="col"){
					var _324=_31c.DATA[_321.valueCol];
					var _325=_31c.DATA[_321.displayCol];
					if(!_324||!_325){
						$C.handleError(null,"bind.assignvalue.selboxinvalidvaldisplay","bind",[_31a]);
						return;
					} // if !_324
					for(var i=0;i<_324.length;i++){
						var opt=new Option(_325[i],_324[i]);
						_31f.options[i]=opt;
					}
				} // if _320
				else{
					if(_320=="row"){
						var _326=-1;
						var _327=-1;
						for(var i=0;i<_31c.COLUMNS.length;i++){
							var col=_31c.COLUMNS[i];
							if(col==_321.valueCol){
							_326=i;
						} // for
						if(col==_321.displayCol){_327=i;} 
						if(_326!=-1&&_327!=-1){break;}
					} // if
					if(_326==-1||_327==-1){
						$C.handleError(null,"bind.assignvalue.selboxinvalidvaldisplay","bind",[_31a]);
						return;
					} // if
					for(var i=0;i<_31c.DATA.length;i++){
						var opt=new Option(_31c.DATA[i][_327],_31c.DATA[i][_326]);
						_31f.options[i]=opt;
					} // for
				}
			}
		}
	}else{
		_31f[_31b]=_31c;
	}
	$E.callBindHandlers(_31a,null,"change");
	$L.info("bind.assignvalue.success","bind",[_31c,_31a,_31b]);
};
