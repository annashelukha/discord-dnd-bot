//NOTE: Public Version: need to insert valid qualityQuoteChannelID and login values

//startup stuff
const Discord = require('discord.js');
const client = new Discord.Client();
var fs = require('fs');

//start the command with this
const prefix = '?';

//session memory preset
const nextSession = new Date('January 1, 2021 18:00:00');

//better nextsession formatting values
var today = new Date();
var weekday = new Array(7);
weekday[0] = "Sunday";
weekday[1] = "Monday";
weekday[2] = "Tuesday";
weekday[3] = "Wednesday";
weekday[4] = "Thursday";
weekday[5] = "Friday";
weekday[6] = "Saturday";
const monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

//qualityquoteme storage/settings
const qualityQuoteChannelID = '';
var qualityQuotes = new Array();

//current level storage
var curLevel = 0;

//links list (google as default link)
var links = new Array("google.com");

//startup 
client.once('ready', () => {
    //pull from save.txt in pi and parse
    var jsonData = fs.readFileSync('/home/pi/Documents/DiscordBot/save.txt');
    var data = JSON.parse(jsonData);
    var tempSession = new Date(data.nextSession_s);

    //set relevant values
    nextSession.setMonth(tempSession.getMonth());
    nextSession.setDate(tempSession.getDate());
    nextSession.setYear(tempSession.getFullYear());
    curLevel = data.curLevel_s;
    links = data.links_s;

    //bot debug
    client.user.setActivity("?help");
    console.log('bot online');
})

//when a message is received
client.on('message', message => {
    //skip if irrelevant
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    //otherwise, break into chunks
    const args = message.content.slice(prefix.length).split(/ +/);
    const command = args.shift().toLowerCase();

    //ping pong
    if (command == 'ping')
        message.channel.send('pong!');

    //next session command
    if (command == 'nextsession')
    {
        if (args.length == 1)
        {    
            //try to parse the bits, else throw an error message
            try {
                var date = args[0];
                var dates = date.split('/');
                var month = dates[0];
                var day = dates[1];
                nextSession.setMonth(month-1);
                nextSession.setDate(day-1);

                //check year input type
                if (dates[2].length == 2)
                    var year = '20' + dates[2];
                else
                    var year = dates[2];

                nextSession.setYear(year);

                //send update message
                message.channel.send('Next session set: ' + weekday[(nextSession.getDay()+1) %7] + ', ' + monthNames[nextSession.getUTCMonth()] 
                + ' ' + nextSession.getUTCDate() + ', ' + nextSession.getUTCFullYear());
            }
            //said error message
            catch{message.channel.send('Please provide a valid date.');}
        }
        //otherwise just push out the day that's currently set
        else
            message.channel.send('Next session: ' + weekday[(nextSession.getDay()+1) %7] + ', ' + monthNames[nextSession.getUTCMonth()] 
                + ' ' + nextSession.getUTCDate() + ', ' + nextSession.getUTCFullYear());
    }

    //give a random quality quote
    if (command == 'qualityquoteme')
    { 
        var temp = message.channel;

        //first run
        if (qualityQuotes.length == 0)
        {
        channel = client.channels.cache.get(qualityQuoteChannelID);
        channel.messages.fetchPinned()
            .then(messages => 
                 {
                    qualityQuotes = Array.from(messages.values()); 
                    channel = temp;
                    var messagetoSend = qualityQuotes[Math.floor(Math.random() * (qualityQuotes.length))];
                    message.channel.send('\"'+ messagetoSend.content + '\"' + '- ' + '*' + messagetoSend.author.username + '*' 
                        + ', ' + messagetoSend.createdAt.toString().substring(0, messagetoSend.createdAt.toString().length-34));
                 })
            .catch(console.error);  
        }
        //all other runs
        else 
        {
            console.log('++');
	    var messagetoSend = qualityQuotes[Math.floor(Math.random() * (qualityQuotes.length))];
            message.channel.send('\"'+ messagetoSend.content + '\"' + '- ' + '*' + messagetoSend.author.username + '*' 
                        + ', ' + messagetoSend.createdAt.toString().substring(0, messagetoSend.createdAt.toString().length-34));
        }

    }

    //return party current level
    if (command == 'currentlevel')
    {
        if(args.length != 0)
        {
            const parsed = parseInt(args.shift());
            if (!isNaN(parsed))
            {
                curLevel = parsed;
                message.channel.send('Current party level set to ' + curLevel);
            }
            else
                {message.channel.send('Please enter a valid digit.');}
        }
        else
            message.channel.send('Current party level: ' + curLevel);
    }

    //split gold between players
    if (command == 'splitgold')
    {
        if (args.length == 2)
        {
            //get vals
            const parsedGold = parseInt(args.shift());
            const parsedNumber = parseInt(args.shift())
            const totalDivCount = parsedNumber + 1;
            //if both args are values, do the math and return
            if (!isNaN(parsedGold) && !isNaN(parsedNumber))
            {
                const perPlayer = Math.floor(parsedGold/totalDivCount);
                const groupInv = parsedGold - (perPlayer * totalDivCount) + perPlayer;

                message.channel.send('Gold per player: ' + perPlayer + '\, Gold to group inventory: ' + groupInv);
            }
            else
                {message.channel.send('Please enter a valid digit for amounts.');}
        }
        else
            message.channel.send('Enter a value to split');
    }
    
    //link list
    if (command == "links")
    {
        //if removing a link
        if (args.length == 2 && args.shift().toLowerCase() == "remove")
        {
            links.splice(args[0], 1);
        } 
        //adding a link, possibly with a description
        else if (args.length != 0)
        {
            links.push(args.join(' '));
        }
        //otherwise, a get
        else 
        {
            var sendval = "";
            for(i = 0; i < links.length; i++)
            {
                //create a valid link- if no "http", discord doesn't recognize as a link
                if(links[i].includes("http"))
                {
                    sendval += "[" + i + "] - " + links[i] + "\n";
                }
                else 
                {
                    sendval += "[" + i + "] - https://" + links[i] + "\n";
                }
            }
            message.channel.send(sendval);
        }
        
    }
    
    //help command 
    if (command == 'help')
    {
        message.channel.send('Commands: \
        \n ?nextsession: get or set the next DnD date \n\t\t\t --set with \*nextsession [mm/dd/yy]\* \
        \n ?qualityquoteme: get a random message from the pinned messages in qualityquotes \
        \n ?currentlevel: get or set current level \n\t\t\t --set with \*currentlevel [#]\* \
        \n ?splitgold: split gold by the number of \*\*players\*\* receiving gold \n\t\t\t --\*splitgold [amount of gold] [number of players]\* \
        \n ?links: get, add, or remove links from storage \n\t\t\t --set with \*links [link]\* \n\t\t\t --remove with \*links remove [link number]\*'
        );
    }
    
    //[Saving]: Happens every time a command is called, upkeeping a reference at all times for post-crash/restart startup

    //get all relevant data to be saved
    var saveData =
    {
        nextSession_s : nextSession,
        curLevel_s : curLevel,
        links_s : links
    }
    
    //reformat to a string
    saveData = JSON.stringify(saveData);

    //save data to file in the same directory
    fs.writeFile("save.txt", saveData, function(err)
    {
        if (err)
        {
            console.log(err);
        }
    });

})

//bot login
client.login('');