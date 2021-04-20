async function login() {
  let usern = $("#usern").val();
  let pass = $("#passw").val();
  
  pass = md5(md5(pass));
  
  let res = await axios.post('/api/auth/login', {
	username: usern,
	passw: pass
  });
  
  if(res.data === "Ok") {
    window.location.href = "/posts";
  } else {
    document.getElementById("error").innerHTML = "Credentials incorrect.";
  }
}

async function create() {
  let usern = $("#regusern").val();
  let pass = $("#regpassw").val();
  let confpass = $("#regconfpassw").val();
  
  if(pass === confpass) {
  
    pass = md5(md5(pass));
	
	let res = await axios.post('/api/auth/register', {
	  username: usern,
	  passw: pass
	});
	
	console.log(res);
	
	if(res.data === "Ok") {
      window.location.href = "/posts";
    } else {
      document.getElementById("error2").innerHTML = res.data;
    }
  } else {
    document.getElementById("error2").innerHTML = "Passwords do not match.";
  }
}