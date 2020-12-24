require('dotenv').config();
const Discord = require('discord.js');
const bot = new Discord.Client();

const TOKEN = process.env.TOKEN;

const prefix = '!';

const strSkills = [] 
const dexSkills = []
const conSkills = []
const intSkills = []
const wisSkills = []
const chaSkills = []

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
   // console.log(msg);
    const cB = msg.content.toLowerCase().slice(prefix.length);
    const args = cB.split(' ');

    //create a new charictor
    if (args[0] === 'addchar') {
        players.set(args[1], new Player(args[1]));
        msg.channel.send("created character " + args[1]);
        return;
    }

    //remove a charictor
    if (args[0] === 'yeetchar') {
        players.delete(args[1]);
        msg.channel.send("yeeted player " + args[1] +" out of existance");
        return;
    }

    //eddit and override a stat
    if (args[0] === 'edit') {
        if(args[3] == 'skills' || args[3] ==='proficiencies'){
            return;
        }
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
        if(args[3] == 'skills' || args[3] ==='proficiencies'){
            return;
        }
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

    //todo addskill    addprof
    //todo make edit filterout edit or add skill or prof
    if(args[0] === 'addskill'){
        try {
            players.get(args[1]).addToArray(('skills'), args[2]);

            msg.channel.send('Skills are now'+ players.get(args[1]).get('skills'));
        } catch (error) {
            msg.channel.send("There is an error\nInput format is addskill [character] [skill name]");
        }
        return;
    }

    if(args[0] === 'addprof'){
        try {
            players.get(args[1]).addToArray('proficiencies', args[2]);

            msg.channel.send('Proficiencies are now'+ players.get(args[1]).get('proficiencies'));
        } catch (error) {
            msg.channel.send("There is an error\nInput format is addprof [character] [addprof name]");
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
            full = full.concat("Str: " + ply.get("str") + ": " +Math.floor((ply.get("str")-10)/2)+ "\n");
            full = full.concat("Dex: " + ply.get("dex") + ": " +Math.floor((ply.get("dex")-10)/2)+"\n");
            full = full.concat("Con: " + ply.get("con") + ": " +Math.floor((ply.get("con")-10)/2)+"\n");
            full = full.concat("Int: " + ply.get("int") + ": " +Math.floor((ply.get("int")-10)/2)+"\n");
            full = full.concat("Wis: " + ply.get("wis") + ": " +Math.floor((ply.get("wis")-10)/2)+"\n");
            full = full.concat("Cha: " + ply.get("cha") + ": " +Math.floor((ply.get("cha")-10)/2)+"\n\n");
            full = full.concat("Proficiency Skills: " + ply.get("skills") + "\n");
            full = full.concat("Other Proficiencies: " + ply.get("proficiencies"));
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

    msg.channel.send("commands are\n!addchar !edit !add !stat !sheet !addskill !addprof\ntype !help for descriptions");
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
        this.stats.set("skills", [null]);
        this.stats.set("proficiencies", [null]);
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

    addToArray(name,val){
            this.stats.get(name).push(val);
    }

    get(name) {
        return this.stats.get(name);
    }
}