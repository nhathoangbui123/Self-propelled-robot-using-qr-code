var x_old = 0;
var y_old = 0;
var user_x_old = 0;
var user_y_old = 0;
var cc = 0;
var valstop="0";
var valhome="0";
var valstart="0";
window.onload = function onLoad() {
  //tao grid
  gen(6, 7);
  var database = firebase.database();
  var position = database.ref('Robot/robot');
  position.on('value', function (snapshot) {
    var childData = snapshot.val();
    pos = childData;
    var x = pos.slice(0, 1);
    var y = pos.slice(2, 3);
    setColor(x, y);
    console.log("pos+" + pos);
  });

  var usr = database.ref('User/user');
  usr.on('value', function (snapshot) {
    var childData = snapshot.val();
    user = childData;
    var xx = user.slice(0, 1);
    var yy = user.slice(2, 3);
    userdata(xx, yy, user);
  });
  //nut nhan contact goi popup
  popup();
  //nut nhan start
  const button = document.getElementById('button')
  button.addEventListener('click', () => {
    var database = firebase.database();
    var startt = database.ref('Button/start');
    startt.on('value', function (snapshot) {
      var childData = snapshot.val();
      valstart =childData;
    });
    switch(parseInt(valstart)) {
      case 1:
        document.getElementById('button').style.backgroundColor = "hsl(180, 65%, 80%)";
        database.ref('Button/start').set("0");
        window.alert("Robot đã dừng");
        break;
      case 0:
        document.getElementById('button').style.backgroundColor = "red"
        database.ref('Button/start').set("1");
        window.alert("Robot bắt đầu di chuyển theo vị trí bạn đã chọn");
        break;
    }
    clear_user_old();
    start();
    userdata();
  });
  //nut nhan Stop
  const button_stop = document.getElementById('button-stop')
  button_stop.addEventListener('click', () => {
    var database = firebase.database();
    var stop = database.ref('Button/stop');
    stop.on('value', function (snapshot) {
      var childData = snapshot.val();
      valstop =childData;
    });
    switch(parseInt(valstop)) {
      case 1:
        document.getElementById('button-stop').style.backgroundColor = "hsl(180, 65%, 80%)";
        database.ref('Button/stop').set("0");
        window.alert("Robot đã dừng");
        break;
      case 0:
        document.getElementById('button-stop').style.backgroundColor = "red"
        database.ref('Button/stop').set("1");
        window.alert("Robot bắt đầu di chuyển");
        break;
    }
  });
  //nut nhan home
  const button_home = document.getElementById('button-home')
  button_home.addEventListener('click', () => {
    var database = firebase.database();
    var home = database.ref('Button/home');
    home.on('value', function (snapshot) {
      var childData = snapshot.val();
      valhome =childData;
    });
    switch(parseInt(valhome)) {
      case 1:
        document.getElementById('button-home').style.backgroundColor = "hsl(180, 65%, 80%)";
        database.ref('Button/home').set("0");
        window.alert("Robot đã dừng");   
        break;
      case 0:
        document.getElementById('button-home').style.backgroundColor = "red"
        database.ref('Button/home').set("1");
        window.alert("Robot bắt đầu di chuyển về home");
        break;
    }
  });

  // Kiem tra nguoi dung hien tai
  firebase.auth().onAuthStateChanged((user) => {
    if (!user) {
      location.replace("index.html")
    } else {
      document.getElementById("user").innerHTML = "Hello, " + user.email
    }
  })
};
//ham tao grid
function gen(numrow, numcol) {
  for (let i = 1; i <= numrow; i++) {
    $('#container1').append("<ul id='row-" + i + "' class='row'>");
    var $row = $('#row-' + i);
    for (let j = 1; j <= numcol; j++) {
      count = i.toString() + j
      var square = "<li id='sq-" + count + "' class='square'> </li>";
      $row.append(square);
      // dieu khien gen ra cac o ke hang

      if (i >= 2 && i <= 5 && j >= 2 && j <= 3 || i >= 2 && i <= 5 && j >= 5 && j <= 6) {
        document.querySelector('#sq-' + count).style.backgroundColor = "red"
      } else if (i == 1 && j == 1) {
        document.querySelector('#sq-' + count).style.backgroundColor = "black"
      } else {
        document.querySelector('#sq-' + count).style.backgroundColor = "gray"
      }
    }
  }
}
//ham set color tai vi tri x y
function setColor(x, y) {

  var database = firebase.database();
  var old = database.ref('Robot/old');
  old.on('value', function (snapshot) {
    var childData = snapshot.val();
    xy_old = childData;
    x_old = xy_old.slice(0, 1);
    y_old = xy_old.slice(2, 3);
  });

  if (x == x_old && y > y_old) {
    var j = (parseInt(y) - 1).toString();
    if (x >= 2 && x <= 5 && j >= 2 && j <= 3 || x >= 2 && x <= 5 && j >= 5 && j <= 6) {
      document.querySelector('#sq-' + x + j).style.backgroundColor = "red"
      document.querySelector('#sq-' + x + j).style.border = "0em solid red";
    } else if (x == 1 && j == 1) {
      document.querySelector('#sq-' + x + j).style.backgroundColor = "black"
      document.querySelector('#sq-' + x + j).style.border = "0em solid black";
    } else {
      document.querySelector('#sq-' + x + j).style.backgroundColor = "gray"
      document.querySelector('#sq-' + x + j).style.border = "0em solid gray";
    }

    if (x >= 2 && x <= 5 && y >= 2 && y <= 3 || x >= 2 && x <= 5 && y >= 5 && y <= 6) {
      document.querySelector('#sq-' + x + y).style.backgroundColor = "green"
      document.querySelector('#sq-' + x + y).style.border = "0.5em solid red";
    } else if (x == 1 && y == 1) {
      document.querySelector('#sq-' + x + y).style.backgroundColor = "green"
      document.querySelector('#sq-' + x + y).style.border = "0.5em solid black";
    } else {
      document.querySelector('#sq-' + x + y).style.backgroundColor = "green"
      document.querySelector('#sq-' + x + y).style.border = "0.5em solid gray";
    }
    x_y_old = (x + 0 + y).toString();
    var database = firebase.database();
    database.ref('Robot/old').set(x_y_old);
  }

  if (x == x_old && y < y_old) {
    var j = (parseInt(y) + 1).toString();
    if (x >= 2 && x <= 5 && j >= 2 && j <= 3 || x >= 2 && x <= 5 && j >= 5 && j <= 6) {
      document.querySelector('#sq-' + x + j).style.backgroundColor = "red"
      document.querySelector('#sq-' + x + j).style.border = "0em solid red";
    } else if (x == 1 && j == 1) {
      document.querySelector('#sq-' + x + j).style.backgroundColor = "black"
    } else {
      document.querySelector('#sq-' + x + j).style.backgroundColor = "gray"
    }
    if (x >= 2 && x <= 5 && y >= 2 && y <= 3 || x >= 2 && x <= 5 && y >= 5 && y <= 6) {
      document.querySelector('#sq-' + x + y).style.backgroundColor = "green"
      document.querySelector('#sq-' + x + y).style.border = "0.5em solid red";
    } else if (x == 1 && y == 1) {
      document.querySelector('#sq-' + x + y).style.backgroundColor = "green"
      document.querySelector('#sq-' + x + y).style.border = "0.5em solid black";
    } else {
      document.querySelector('#sq-' + x + y).style.backgroundColor = "green"
      document.querySelector('#sq-' + x + y).style.border = "0.5em solid gray";
    }
    x_y_old = (x + 0 + y).toString();
    var database = firebase.database();
    database.ref('Robot/old').set(x_y_old);
  }

  if (y == y_old && x > x_old) {
    var j = (parseInt(x) - 1).toString();
    if (j >= 2 && j <= 5 && y >= 2 && y <= 3 || j >= 2 && j <= 5 && y >= 5 && y <= 6) {
      document.querySelector('#sq-' + j + y).style.backgroundColor = "red"
      document.querySelector('#sq-' + j + y).style.border = "0em solid red";
    } else if (j == 1 && y == 1) {
      document.querySelector('#sq-' + j + y).style.backgroundColor = "black"
    } else {
      document.querySelector('#sq-' + j + y).style.backgroundColor = "gray"
    }
    if (x >= 2 && x <= 5 && y >= 2 && y <= 3 || x >= 2 && x <= 5 && y >= 5 && y <= 6) {
      document.querySelector('#sq-' + x + y).style.backgroundColor = "green"
      document.querySelector('#sq-' + x + y).style.border = "0.5em solid red";
    } else if (x == 1 && y == 1) {
      document.querySelector('#sq-' + x + y).style.backgroundColor = "green"
      document.querySelector('#sq-' + x + y).style.border = "0.5em solid black";
    } else {
      document.querySelector('#sq-' + x + y).style.backgroundColor = "green"
      document.querySelector('#sq-' + x + y).style.border = "0.5em solid gray";
    }
    x_y_old = (x + 0 + y).toString();
    var database = firebase.database();
    database.ref('Robot/old').set(x_y_old);
  }

  if (y == y_old && x < x_old) {
    var j = (parseInt(x) + 1).toString();
    if (j >= 2 && j <= 5 && y >= 2 && y <= 3 || j >= 2 && j <= 5 && y >= 5 && y <= 6) {
      document.querySelector('#sq-' + j + y).style.backgroundColor = "red"
      document.querySelector('#sq-' + j + y).style.border = "0em solid red";
    } else if (j == 1 && y == 1) {
      document.querySelector('#sq-' + j + y).style.backgroundColor = "black"
    } else {
      document.querySelector('#sq-' + j + y).style.backgroundColor = "gray"
    }

    if (x >= 2 && x <= 5 && y >= 2 && y <= 3 || x >= 2 && x <= 5 && y >= 5 && y <= 6) {
      document.querySelector('#sq-' + x + y).style.backgroundColor = "green"
      document.querySelector('#sq-' + x + y).style.border = "0.5em solid red";
    } else if (x == 1 && y == 1) {
      document.querySelector('#sq-' + x + y).style.backgroundColor = "green"
      document.querySelector('#sq-' + x + y).style.border = "0.5em solid black";
    } else {
      document.querySelector('#sq-' + x + y).style.backgroundColor = "green"
      document.querySelector('#sq-' + x + y).style.border = "0.5em solid gray";
    }
    x_y_old = (x + 0 + y).toString();
    var database = firebase.database();
    database.ref('Robot/old').set(x_y_old);
  }
}
//lay user data
function userdata(x, y, ccc) {
  var database = firebase.database();
  var user_old = database.ref('User/old');
  user_old.on('value', function (snapshot) {
    var childData = snapshot.val();
    xxy_old = childData;
    cc = xxy_old.toString();
    user_x_old = xxy_old.slice(0, 1);
    user_y_old = xxy_old.slice(2, 3);
    console.log(user_x_old);
    console.log(user_y_old);
  });
  if (ccc != cc) {
    if (user_x_old >= 2 && user_x_old <= 5 && user_y_old >= 2 && user_y_old <= 3 || user_x_old >= 2 && user_x_old <= 5 && user_y_old >= 5 && user_y_old <= 6) {
      document.querySelector('#sq-' + x + y).style.border = "0.5em solid yellow";
      document.querySelector('#sq-' + user_x_old + user_y_old).style.border = "0.5em";
    } else {
      console.log('#sq-' + user_x_old + user_y_old);
      document.querySelector('#sq-' + x + y).style.border = "0.5em solid yellow";
      document.querySelector('#sq-' + user_x_old + user_y_old).style.border = "0.5em";

    }
    xxy_old = (x + 0 + y).toString();
    var database = firebase.database();
    database.ref('User/old').set(xxy_old);
  }
}
//ham xoa data user old
function clear_user_old() {
  var database = firebase.database();
  var usr_old = database.ref('User/old');
  usr_old.on('value', function (snapshot) {
    var childData = snapshot.val();
    user_old = childData;
    x_old = user.slice(0, 1);
    y_old = user.slice(2, 3);
    console.log(x_old + y_old)
    if (x_old >= 2 && x_old <= 5 && y_old >= 2 && y_old <= 3 || x_old >= 2 && x_old <= 5 && y_old >= 5 && y_old <= 6) {
      document.querySelector('#sq-' + x_old + y_old).style.backgroundColor = "red"
    } else {
      document.querySelector('#sq-' + x_old + y_old).style.backgroundColor = "gray"
    }
  });
}
//ham gui data user len firebase
function start() {
  var x = document.getElementById("input_x").value; // A String value
  var y = document.getElementById("input_y").value; // A String value
  var c = x + 0 + y;
  var database = firebase.database();
  database.ref('User/user').set(c);
};
//ham popup
function popup(){
  document.getElementById("popup").addEventListener("click",function(){
    document.getElementsByClassName("popup")[0].classList.add("active");
  });
   
  document.getElementById("ok-btn").addEventListener("click",function(){
    document.getElementsByClassName("popup")[0].classList.remove("active");
  });
}
//ham logout
function logout() {
  firebase.auth().signOut()
};