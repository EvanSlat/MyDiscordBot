require('dotenv').config();
const Discord = require('discord.js');
const bot = new Discord.Client();

const TOKEN = process.env.TOKEN;

const prefix = '!';

var players = new Map();

bot.login(TOKEN);



bot.on('ready', () => {
    console.info('Logged in as' + bot.user.tag);
    bot.user.setAFK(false);
});

//msg.reply  pings them

//msg.channel.send()  just sends to the channel
bot.on('message', msg => {
    if (msg.author.bot) return;
    if (!msg.content.startsWith(prefix)) return;
    const cB = (msg+"").toLowerCase.content.slice(prefix.length);
    const args = cB.split(' ');

    //create a new charictor
    if (args[0] === 'addchar') {
        players.set(args[1], new Player(args[1]));
        msg.channel.send("created player " + args[1]);
        return;
    }

    //eddit and override a stat
    if (args[0] === 'edit') {
        try {
            players.get(args[1]).edit(args[2], args[3]);
            msg.channel.send(args[2] + " is now " + players.get(args[1]).get(args[2]));
        } catch (error) {
            msg.channel.send("There is an error\nInput format is edit [character] [stat name] [New stat]");
        }
        return;
    }

    //add to a stat
    if (args[0] === 'add') {
        try {
            players.get(args[1]).add(args[2], args[3]);

            msg.channel.send(args[2] + " is now " + players.get(args[1]).get(args[2]));
        } catch (error) {
            msg.channel.send("There is an error\nInput format is add [character] [stat name] [New stat]");
        }
        return;
    }

    //show a specific stat
    if (args[0] === 'stat') {
        try {
            var hold = players.get(args[1]).get(args[2]);
            msg.channel.send(args[1] + " " + args[2] + " " + hold);
        } catch (error) {
            msg.channel.send("There is an error\nInput format is stat [character] [stat asked for]");
        }
        return;
    }

    //get all of the stats
    if (args[0] === 'sheet') {
        try {
            var ply = players.get(args[1]);
            var full = "" + args[1] + "\n";
            full = full.concat("Race: " + ply.get("race") + "\n");
            full = full.concat("Class: " + ply.get("class") + "\n");
            full = full.concat("Level: " + ply.get("level") + "\n");
            full = full.concat("HP: " + ply.get("hp") + "\n");
            full = full.concat("AC: " + ply.get("ac") + "\n\n");
            full = full.concat("Str: " + ply.get("str") + "\n");
            full = full.concat("Dex: " + ply.get("dex") + "\n");
            full = full.concat("Con: " + ply.get("con") + "\n");
            full = full.concat("Int: " + ply.get("int") + "\n");
            full = full.concat("Wis: " + ply.get("wis") + "\n");
            full = full.concat("Cha: " + ply.get("cha") + "\n\n");
            full = full.concat("Proficiency Skills: " + ply.get("skill proff") + "\n");
            full = full.concat("Other Proficiencies: " + ply.get("nonskill proff"));
            msg.channel.send(full);
           // console.log(full);
        } catch (error) {
            msg.channel.send("There is an error\nInput format is sheet [character]");
        }
        return;
    }

    if (args[0] === 'help') {
        msg.channel.send("commands are\n!addchar [name] : this will create a new charactor\n!edit [character] [stat name] [New stat] : change one stat on charactor sheet\n!add  [character] [stat name] [Add to stat] : add to one stat on charactor sheet\n!stat [character] [stat asked for] : get one stat on charactor sheet\n!sheet [Character] : prints out entire charactor sheet");
        return;
    }
    if (args[0] === 'close') {
        msg.channel.send('closing bot');
        bot.user.setAFK(true);
        bot.destroy();
        window.stop;
        return;

    }

    msg.channel.send("commands are\n!addchar !edit !add !stat !sheet\ntype !help for descriptions");
    return;
});

class Player {

    constructor(name) {
        this.stats = new Map();
        this.name = "" + name;
        this.stats.set("race", "None");
        this.stats.set("level", 1);
        this.stats.set("classes", "None");
        this.stats.set("hp", 0);
        this.stats.set("speed", 30);
        this.stats.set("ac", 10);
        this.stats.set("str", 10);
        this.stats.set("dex", 10);
        this.stats.set("con", 10);
        this.stats.set("int", 10);
        this.stats.set("wis", 10);
        this.stats.set("cha", 10);
        this.stats.set("skill proff", [null]);
        this.stats.set("nonskill proff", [null]);
    }

    edit(name, val) {
        this.stats.set(name, val);
    }

    add(name, val) {
        let hold = this.stats.get(name);
        if (Array.isArray(hold)) {
            this.stats.set(name, hold.push(val));
        } else {
            this.stats.set(name, parseInt(hold) + parseInt(val));
        }
    }

    get(name) {
        return this.stats.get(name);
    }
}