//security.mixed_content.block_active_content
//security.csp.enable
(() => {
	
	var chatLastMessages = [];
   
	var mouseDownEvent = new Event('mousedown', { bubbles: true });
	var lastMessage_Previous = "";

	var resetLastPrevious = function() {
		lastMessage_Previous = "";
	}
	
	var check = function () {
	   
		allChats = document.querySelectorAll('.chat');
		console.log(new Date(), "Total chats: " + allChats.length);
		
		console.log("Checking for new messages... ");
		
		firstchat = null;
		
		for(var x = 0; x < allChats.length; x++) {
			//chatLastMessages[]
			chatTitle = allChats[x].querySelector('.chat-title').innerText;
			chatMessage = "";
			chatMessageObject = allChats[x].querySelector('.last-msg');
			if(chatMessageObject != undefined) chatMessage = chatMessageObject.title;
			
			//Compare old value of last message first..
			if(chatMessage == chatLastMessages[chatTitle]) continue;
			
			chatLastMessages[chatTitle] = chatMessage;
			firstchat = allChats[x];
			break;
			
			
		}
		
		
		//firstchat = document.querySelector('.unread.chat');
		
		if(firstchat == null) {
			console.log("Nothing found!");
			setTimeout(check, 3000);
			return;
		}

		var senderDisplayName = firstchat.querySelector('.chat-title').innerText;
		console.log("Clicking chat from " + senderDisplayName);
		firstchat.dispatchEvent(mouseDownEvent);
		var lastMessage = firstchat.querySelector('.last-msg');
		if(lastMessage != undefined) {
			lastMessage = lastMessage.title;
			if(lastMessage.indexOf("!") >= 0 && lastMessage != lastMessage_Previous) {
				lastMessage_Previous = lastMessage;
				setTimeout(resetLastPrevious, 3500);
				lastMessage = lastMessage.substr(lastMessage.indexOf("!"), lastMessage.length - 1);
		   
				console.log("Command: " + lastMessage);

				setTimeout(() => { 
					
					//unread = document.querySelector('.msg-unread');
					//if(unread) unread.dispatchEvent(mouseDownEvent);
					processCommand(firstchat, lastMessage);
					
					
				}, 1000);
		   
			} else {
				//Go Back to the first chat
				setTimeout(() => { 
					//document.querySelector('.chat').dispatchEvent(new Event('mousedown', {bubbles:true})); // click another
				}, 1000);
				//check for new messages 3 seconds later
				setTimeout(check, 3000);
				
				dummyTypeInData();
			}
	   } else {
		   //check for new messages 3 seconds later
		   console.log("Nothing found!");
			setTimeout(check, 3000);
	   }
	   
	   
	   
	   
	   
	};
	
	setTimeout(check, 3000);
	
	var processCommand = function(chat, command) {
		//sendChatMessage(chat, "Command received.");
		
		if(command.indexOf("!ecs") >= 0) {
			setTimeout(function() { console.log("dleay"); sendChatMessage(chat, "Delay test!"); }, 5000); 
		}
		
		else if(command.indexOf("!cat") >= 0) {
			cmd_cat(chat);
		}
		
		else if(command.indexOf("!dog") >= 0) {
			cmd_dog(chat);
		}
		
		else if(command.indexOf("!say") >= 0) {
			cmd_say(chat, command);
		}
		
		else if(command.indexOf("!ud") >= 0) {
			cmd_ud(chat, command);
		}
		
		else if(command.indexOf("!tl") >= 0) {
			cmd_tl(chat, command);
		}
		
		else setTimeout(check, 3000);
	}
	
	
	var sendChatMessage = function(chat, message) {
		
		chat.dispatchEvent(mouseDownEvent);
		
		setTimeout(() => { 
		
			document.querySelector('.input').innerText = message;
			uievent = new UIEvent("input", { bubbles: true, cancelable: true, view: window, detail: 1});
			document.querySelector('.input').dispatchEvent(uievent);
			
						
			setTimeout(() => {
				console.log("Sending Message!");
				document.querySelector('.compose-btn-send').dispatchEvent(new Event('click', {bubbles:true}));
				
				//Go Back to the first chat
				setTimeout(() => { 
					//document.querySelector('.chat').dispatchEvent(new Event('mousedown', {bubbles:true})); // click another
				}, 400);
				
				//check for new messages 3 seconds later
				setTimeout(function() { console.log("ok"); check(); }, 3000);
				
			}, 1000);		
					
		}, 1000);
				
		
	}
	
	
	var dummyTypeInData = function() {
		setTimeout(() => { 
			document.querySelector('.input').innerText = " ";
			uievent = new UIEvent("input", { bubbles: true, cancelable: true, view: window, detail: 1});
			document.querySelector('.input').dispatchEvent(uievent);
		}, 1000);
	}
	
	
	
	var cmd_cat = function(chat) {
		var thechat = chat;
		xhttp = new XMLHttpRequest();
		xhttp.onreadystatechange = function() {
			if (this.readyState == 4 && this.status == 200) {
				
				parser = new DOMParser();
				xmlDoc = parser.parseFromString(this.responseText,"text/xml");


				sendChatMessage(thechat, xmlDoc.getElementsByTagName("url")[0].textContent);
			}
		};
		xhttp.open("GET", "http://thecatapi.com/api/images/get?format=xml&type=jpg", true);
		xhttp.send(); 
  
		
	}
	
	var cmd_dog = function(chat) {
		var thechat = chat;
		xhttp = new XMLHttpRequest();
		xhttp.onreadystatechange = function() {
			if (this.readyState == 4 && this.status == 200) {
				
				data = JSON.parse(this.responseText);


				sendChatMessage(thechat, data.message);
			}
		};
		xhttp.open("GET", "https://dog.ceo/api/breeds/image/random", true);
		xhttp.send(); 
  
		
	}
	
	var cmd_ud = function(chat, command) {
		var thechat = chat;
		text = command.substr(command.indexOf("!ud") + 4, command.length);
		
		xhttp = new XMLHttpRequest();
		xhttp.onreadystatechange = function() {
			if (this.readyState == 4 && this.status == 200) {
				
				data = JSON.parse(this.responseText);
				
				if(data.list.length != 0) {
					var res = data.list[0].definition;
					sendChatMessage(thechat, res);
				} else {
					sendChatMessage(thechat, "No definitions found!");
				}
				
				

				
			}
		};
		text = text.replace(/[^A-Za-z0-9]/g, "");
		xhttp.open("GET", "https://api.urbandictionary.com/v0/define?term=" + text.trim(), true);
		xhttp.send(); 
  
		
	}
	
	var cmd_say = function(chat, command) {
		text = command.substr(command.indexOf("!say") + 4, command.length);
		sendChatMessage(chat, text);
		
	}
	
	
	
	var cmd_tl = function(chat, command) {
		text = command.substr(command.indexOf("!tl") + 4, command.length);
		text = text.replace(/[^A-Za-z0-9?.!-\s]/g, "");
		console.log("->'" + text + "'")
		
		parts = text.split(" ");
		
		
		
		if(!parts || parts < 3) return sendChatMessage(chat, "Incorrect syntax. !tl [source] [destination] [text]");
		
		src = parts[0];
		target = parts[1];
		q = "";
		
		for(i = 2; i < parts.length; i++)
			q += parts[i] + " ";
		
		
		console.log(q);
		
		xhttp = new XMLHttpRequest();
		xhttp.onreadystatechange = function() {
			if (this.readyState == 4 && this.status == 200) {
				
				res = JSON.parse(this.responseText);
				//console.log(res.data.translations[0].translatedText);
				sendChatMessage(chat, res.data.translations[0].translatedText);
			}
		};
		

		xhttp.open("POST", "https://translation.googleapis.com/language/translate/v2", true);
		xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		xhttp.send("key=AIzaSyAaTWcZdolQQ6-GBkDEzLsHRYzvTUTaw6M&q="+q+"&source="+src+"&target="+target+""); 
	}
	
	
	
	
	
	
})()