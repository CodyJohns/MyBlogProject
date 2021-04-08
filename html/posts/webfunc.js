async function loadPosts() {
	//this loads the misc category upon page load
	try {
		fetch('/api/' + cat)
		.then(function(response) {
			return response.json();
		})
		.then(function(data) {
			
			document.getElementById("postsm").innerHTML = "";
			document.getElementById("postsm").style.textAlign = "left"
			
			if(data.length > 0) {
				for(let ob of data) {
					let extra = "";
							
					if(ob.user === username) {
						extra = "<button class='ui compact icon button' onclick='editPost(\"" + ob._id +"\")'><i class='edit icon'></i></button><button class='ui compact red icon button' onclick='delPost(\"" + ob._id + "\")'><i class='delete icon'></i></button>";
					}
					
					document.getElementById("postsm").innerHTML += "<div class='obj' id='p" + ob._id + "'><div class='obj_top'><b>" + ob.user + " said:</b><i style='float:right;font-size:12px;padding-top:6px;'>" + ob.date + "</i></div><div class='obj_cont' id='msg" + ob._id +"'>" + ob.message + "</div><div class='obj_bottom' id='opt" + ob._id + "'><div class='ui labeled button' id='lbtn" + ob._id + "' tabindex='0'><div class='ui button' onclick='likePost(\"" + ob._id + "\")'><i class='heart icon'></i> Like</div><a class='ui basic label' id='lnum" + ob._id + "'>" + ob.likes + "</a></div>" + extra + "<b style='float:right;font-size:12px;padding-top:15px;cursor:pointer' onclick='showComments(\"" + ob._id + "\")'>Comments</b></div></div><div class='comments' id='cbox" + ob._id + "'></div>";
				}
			} else {
				document.getElementById("postsm").innerHTML = "Sorry there are no posts to display. :(";
			}
		});
	} catch (error) {
		console.log(error);
	}
}

async function postComment(id) {
	let mesg = $("#newc" + id).val();
	
	axios.post('/api/comments/' + id + '/create', {
		username: username,
		msg: mesg,
		datetime: moment().format('MMMM DD, YYYY h:mm a'),
	});
	
	loadComments(id);
}

async function delComment(pid, cid) {
	axios.delete('/api/comments/' + pid + '/' + cid);
	
	$("#comid" + cid).hide();
}

async function showComments(id) {
	let elem = document.getElementById("cbox" + id);
	if(!elem.classList.contains("cshown")) {
		$("#cbox" + id).show();
		elem.classList.add("cshown");
		
		loadComments(id);
	} else {
		$("#cbox" + id).hide();
		elem.classList.remove("cshown");
	}
	
}

async function loadComments(id) {
	let container = document.getElementById("cbox" + id);
		
	container.innerHTML = "";
	
	fetch('/api/comments/' + id + '/getall')
	.then(function(response) {
		return response.json();
	})
	.then(function(data) {
		
		container.innerHTML += "<textarea class='writecomment' id='newc" + id + "' placeholder='Type comment here...'></textarea><button class='ui primary button' onclick='postComment(\"" + id + "\")' style='margin-left:15px;'>Post</button><button class='ui button'>Cancel</button>";
		
		if(data.length > 0) {
			for(let ob of data) {
				let extra = "";
				
				if(ob.user === username) {
					extra = "<b onclick='delComment(\"" + id + "\", \"" + ob._id + "\")' style='color:gray;cursor:pointer;'>delete</b>";
				}
				
				container.innerHTML += "<div class='commentItem' id='comid" + ob._id + "'><b>" + ob.user + " said on " + ob.date + "</b><p>" + ob.message + "</p>" + extra + "</div>";
			}
		} else {
			container.innerHTML += "<center>No one has commented yet. Be the first one!<center>";
		}
	});
}

function selCat(c) {
	cat = c;
	
	loadPosts();
}

async function savePost(id) {
	let newmsg = $("#ed" + id).val();
	
	document.getElementById("msg" + id).innerHTML = newmsg;

	$("#opt" + id).show();
	
	await axios.put('/api/editp/' + id, {
		newmessage: newmsg,
		timedate: "edited " + moment().format('MMMM DD, YYYY h:mm a')
	});
}

function cancelEdit(id, oldmsg) {
	let container = document.getElementById("msg" + id);
	
	container.innerHTML = oldmsg;
	$("#opt" + id).show();
}

function editPost(id) {
	$("#opt" + id).hide();
	let container = document.getElementById("msg" + id);
	let mesg = container.innerHTML;
	container.innerHTML = "<textarea class='editp' id='ed" + id + "'>" + mesg + "</textarea><br><button class='ui primary button' onclick='savePost(\"" + id + "\")'>Save</button><button class='ui button' onclick='cancelEdit(\"" + id + "\", \"" + mesg + "\")'>Cancel</button>";
	//append buttons on the end of ^ line
}

async function delPost(id) {
	try {
		await axios.delete('/api/delete/' + id);
		
		$("#p" + id).hide();
		return true;
	} catch (error) {
		console.log(error);
	}
}

async function likePost(id) {
	let lbtn = document.getElementById("lbtn" + id);
	
	if(!lbtn.classList.contains("teal")) {
	  try {
		lbtn.classList.add("teal") 
		  
		let num = document.getElementById("lnum" + id).innerHTML;
		
		let pnum = parseInt(num);
		
		pnum++;
		
		document.getElementById("lnum" + id).innerHTML = pnum;
		
        await axios.post("/api/like/" + id);
		
        return true;
      } catch (error) {
        console.log(error);
      }
	} else {
		try {
		lbtn.classList.remove("teal") 
		  
		let num = document.getElementById("lnum" + id).innerHTML;
		
		let pnum = parseInt(num);
		
		pnum--;
		
		document.getElementById("lnum" + id).innerHTML = pnum;
		
        await axios.post("/api/unlike/" + id);
		
        return true;
      } catch (error) {
        console.log(error);
      }
	}
}

$(document).ready(function () {
	$("#newpostbtn").click(function() {
		$("#newpost").toggle();
		$("#newpostbtn").hide();
	});
	
	$("#discard").click(function() {
		$("#newp").val("");
		$("#newpost").toggle();
		$("#newpostbtn").toggle();
	});
	
	$("#posth").click(async function() {
		document.getElementById("posth").classList.add('loading');
		
		let msg = $("#newp").val();
		let td = moment().format('MMMM DD, YYYY h:mm a');
		
		//use axios cdn library
		try {
			let resp = await axios.post('/api/newpost', {
			  user: username,
			  message: msg,
			  timedate: td,
			  category: cat
			});
			
			console.log(resp.data);
			
			document.getElementById("posth").classList.remove('loading');
			
			$("#newp").val("");
			$("#newpost").toggle();
			$("#newpostbtn").toggle();
			
			loadPosts();
			return true;
		} catch (error) {
			console.log(error);
		}
	});
	
	loadPosts();
});