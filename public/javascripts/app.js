
function _(el){
	return document.getElementById(el);
}
 _("upload_form").addEventListener("submit",function(event){
	event.preventDefault();
	var name = _("name").value;
	var file = _("image").files[0];
	// alert(file.name+" | "+file.size+" | "+file.type);

	var formdata = new FormData();

	//file input validation
	if(file === undefined){
	   file = 0;
	} 
	else if(file.size > 5e+6 ){
		//alert("image is too big")
		_("image_error").innerHTML = 'image too big, max 5 mb';
	  
		return false;
	}
	
	if(name === ''){
		//alert('fill up name')
		_('name_error').innerHTML = 'please fill up name field';
		return false;
	}
	

	formdata.append("image", file );
	formdata.append("name", name );
	var ajax = new XMLHttpRequest();
	ajax.upload.addEventListener("progress", progressHandler, false)
	ajax.addEventListener("load", completeHandler, false);
	ajax.addEventListener("error", errorHandler, false);
	ajax.addEventListener("abort", abortHandler, false);
	ajax.open("POST", "/posts");
	ajax.send(formdata);
	
})
function progressHandler(event){
	_("loaded_n_total").innerHTML = "Uploaded "+event.loaded+" bytes of "+event.total;
	var percent = (event.loaded / event.total) * 100;
    _("progressBar").style.width = percent + "%";
	// _("status").innerHTML = Math.round(percent)+"% uploaded";
}
function completeHandler(event){
	// _("status").innerHTML = event.target.responseText;
	 _('upload_form').reset();
	  location.href="/success"
	
}
function errorHandler(event){

	_("status").innerHTML = "Upload Failed";
}
function abortHandler(event){
	_("status").innerHTML = "Upload Aborted";
}
