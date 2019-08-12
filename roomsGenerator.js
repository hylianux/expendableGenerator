function getArrayOutput(x) {
  if (x instanceof Array) {
    let output = '[';
    x.forEach(element => {
      output += `${element},`;
    });
    output = output.substring(0, output.length - 1);
    output += `]`;
  } else {
    throw `Expected an Array, instead got [type: ${typeof x}, value: ${x}]\n${new Error().stack}`;
  }
}
class Skill {
  constructor(name, value) {
    this.name = name;
    this.value = value;
  }
  get name() {
    return this._name;
  }
  set name(x) {
    if (typeof x === 'string' || x instanceof String) {
      this._name = x;
    } else {
      throw `Expected string type for skill name, instead got [type: ${typeof x}, value: ${x}]\n${new Error().stack}`;
    }
  }
  get value() {
    return this._value;
  }
  set value(x) {
    if (typeof x === 'number' || x instanceof Number) {
      this._value = x;
    } else {
      throw `Expected Number type for skill value, instead got [type: ${typeof x}, value: ${x}]\n${new Error().stack}`;
    }
  }
}
class Stat {
  constructor(name, value) {
    this.name = name;
    this.value = value;
  }
  get name() {
    return this._name;
  }
  set name(x) {
    if (typeof x === 'string' || x instanceof String) {
      if (Stats.indexOf(x) > -1) {
        this._name = x;
      } else {
        throw `Expected one of the stats listed in the Stats constant ${getArrayOutput(Stats)} and instead got ${x}\n${
          new Error().stack
        }`;
      }
    } else {
      throw `Expected string type for stat name, instead got [type: ${typeof x}, value: ${x}]\n${new Error().stack}`;
    }
  }
  get value() {
    return this._value;
  }
  set value(x) {
    if (typeof x === 'number' || x instanceof Number) {
      this._value = x;
    } else {
      throw `Expected Number type for stat value, instead got [type: ${typeof x}, value: ${x}]\n${new Error().stack}`;
    }
  }
  static generateStat(name) {
    if (Stats.indexOf(name) > -1) {
      let result = 11;
      do {
        let roll1 = Math.floor(Math.random() * 6 + 1);
        let roll2 = Math.floor(Math.random() * 6 + 1);
        result = roll1 + roll2;
        if (result <= 10) {
          return new Stat(name, result);
        }
      } while (result > 10);
    } else {
      throw `Expected one of the stats listed in the Stats constant ${getArrayOutput(Stats)} and instead got ${name}\n${
        new Error().stack
      }`;
    }
  }
}
class Role {
  constructor(name, skills) {
    this.name = name;
    this.skills = skills;
  }
  get name() {
    return this._name;
  }
  set name(x) {
    if (typeof x === 'string' || x instanceof String) {
      if (Roles.indexOf(x) > -1) {
        this._name = x;
      } else {
        let output = `Expected one of the roles listed in the Roles constant for role name [`;
        Roles.forEach(role => {
          output += `${role},`;
        });
        output = output.substring(0, output.length - 1);
        output += `], instead got ${x}\n${new Error().stack}`;
        throw output;
      }
    } else {
      throw `Expected string type for role name, instead got [type: ${typeof x}, value: ${x}]\n${new Error().stack}`;
    }
  }
  get skills() {
    return this._skills;
  }
  set skills(x) {
    if (x instanceof Array) {
      x.forEach(skill => {
        try {
          this.addSkill(skill);
        } catch (e) {
          throw e;
        }
      });
    } else {
      throw `Expected Array type for role skills, [type: ${typeof x}, value: ${x}]\n${new Error().stack}`;
    }
  }
  addSkill(skill) {
    if (skill instanceof Skill) {
      if (!this._skills) {
        this._skills = [];
      }
      this._skills.push(skill);
    } else {
      throw `Expected Skill(name: string, value: number) type for adding a skill to role, instead got [constructor: ${
        skill.constructor.name
      }, type: ${typeof skill}, value: ${skill}]\n${new Error().stack}`;
    }
  }
  static stirUpSkills(skills) {
    for (let i = 0; i < 50; ++i) {
      // find the index of the skill you wanna take a point from
      let minus = Math.floor(Math.random() * skills.length);
      // find the index of the skill you wanna add a point to
      let plus = Math.floor(Math.random() * skills.length);
      // if you can't take away from a skill, or if you can't add to the skill
      // then start over
      if (skills[minus].value < 2 || skills[plus].value > 9) {
        --i;
        continue;
      } else {
        skills[minus].value--;
        skills[plus].value++;
      }
    }
  }
  generatePickupSkills(weapons, pickupPoints) {
    if (!(typeof pickupPoints === 'number' || pickupPoints instanceof Number)) {
      throw `Expected type Number for pickupPoints in generatePickupSkills, instead got [type: ${typeof pickupPoints}, value: ${pickupPoints}]\n${
        new Error().stack
      }`;
    } else {
      if (!(weapons instanceof Array)) {
        throw `Expected type Array for weapons in generatePickupSkills, instead got [type: ${typeof weapons}, value: ${weapons}]\n${
          new Error().stack
        }`;
      } else {
        let newSkills = [];
        // first let's see if you got skills enough to use your weapons...
        weapons.forEach(weapon => {
          if (!(weapon instanceof Weapon)) {
            throw `Expected type Weapon for weapon in generatedPickupSkills, instead got [constructor: ${
              weapon.constructor.name
            }, type: ${typeof weapon}, value: ${weapon}]\n${new Error().stack}`;
          } else {
            this.skills.forEach(skill => {
              if (skill.name === weapon.skill) {
                let thisSkill = new Skill(weapon.skill, 0);
                if (newSkills.indexOf(thisSkill) < 0) {
                  newSkills.push(thisSkill);
                }
              }
            });
          }
        });
        // mkay, now i need a way to determine how many extra skills to add
        // they're enemies, so i'd imagine they wanna use skills that are actually helpful towards combat
        // got it: we'll separate it into 3 categories: movement, tech, and bullshit (intimidation and stealth)
        // y'know, cuz stealthing and intimidating your way out of a situation is fucking bullshit.
        // or, from another point of view, bullshitting your way out of a situtation involves intimidation and stealth.
        // but i digress.  man this comment is long.
        // hey, you, the reader of this.  how are you doing?
        // don't answer that.  this is a comment in the code.  what sort of person answers code comments?
        // more importantly, HOW are you answering?  are you just shouting at your screen?
        // freakin' weirdo is what you are.
        // ok back to the code.
        let movement = [new Skill('Dodge & Escape', 0)];
        if (this.name !== Roles[1]) {
          movement.push(new Skill('Endurance', 0));
        }
        if (this.name !== Roles[2] && this.name !== Roles[1]) {
          movement.push(new Skill('Athletics', 0));
        }

        let tech = [new Skill('Operate Heavy Machinery', 0), new Skill('Pilot', 0)];

        let bullshit = [new Skill('Intimidate', 0)];
        if (this.name !== 'solo') {
          bullshit.push(new Skill('Stealth', 0));
        }
        newSkills.push(movement[Math.floor(Math.random() * movement.length)]);
        newSkills.push(tech[Math.floor(Math.random() * tech.length)]);
        newSkills.push(bullshit[Math.floor(Math.random() * bullshit.length)]);
        // ok, now we got some new skills.  let's start pissin pickup points into it.
        let pointsInvest = Math.ceil(pickupPoints / newSkills.length);
        newSkills.forEach(skill => {
          if (pickupPoints > pointsInvest) {
            skill.value += pointsInvest;
            pickupPoints -= pointsInvest;
          } else {
            skill.value += pointsInvest;
          }
        });
        // ok, now let's STIRRRRR 'em up!
        Role.stirUpSkills(newSkills);
        // k.  now let's attach 'em to the main list
        newSkills.forEach(skill => {
          this.addSkill(skill);
        });
      }
    }
  }
  static generateRole(rolestring) {
    if (Roles.indexOf(rolestring) > -1) {
      let skills = [];
      switch (rolestring) {
        case Roles[0]:
          skills.push(new Skill('Jury Rig', 4));
          skills.push(new Skill('Awareness/Notice', 4));
          skills.push(new Skill('Basic Tech', 4));
          skills.push(new Skill('CyberTech', 4));
          skills.push(new Skill('Teaching', 4));
          skills.push(new Skill('Education', 4));
          skills.push(new Skill('Electronics', 4));
          skills.push(new Skill('Weapons Tech', 4));
          skills.push(new Skill('Electrical Security', 4));
          skills.push(new Skill('Demolitions', 4));
          break;
        case Roles[1]:
          skills.push(new Skill('Family', 4));
          skills.push(new Skill('Awareness/Notice', 4));
          skills.push(new Skill('Endurance', 4));
          skills.push(new Skill('Melee', 4));
          skills.push(new Skill('Rifle', 4));
          skills.push(new Skill('Drive', 4));
          skills.push(new Skill('Basic Tech', 4));
          skills.push(new Skill('Athletics', 4));
          skills.push(new Skill('Wilderness Survival', 4));
          skills.push(new Skill('Brawling', 4));
          break;
        case Roles[2]:
          skills.push(new Skill('Combat Sense', 4));
          skills.push(new Skill('Awareness/Notice', 4));
          skills.push(new Skill('Handgun', 4));
          skills.push(new Skill('Brawling', 4));
          skills.push(new Skill('Melee', 4));
          skills.push(new Skill('Weapons Tech', 4));
          skills.push(new Skill('Rifle', 4));
          skills.push(new Skill('Athletics', 4));
          skills.push(new Skill('Submachinegun', 4));
          skills.push(new Skill('Stealth', 4));
          break;
      }
      this.stirUpSkills(skills);
      return new Role(rolestring, skills);
    } else {
      throw `Expected one of the roles listed in the Roles constant ${getArrayOutput(Roles)} and instead got ${x}\n${
        new Error().stack
      }`;
    }
  }
}
class Weapon {
  constructor(name, skill, accuracy, damage, ammunition, numberOfShots, rateOfFire, reliability, range) {
    this.name = name;
    this.skill = skill;
    this.accuracy = accuracy;
    this.damage = damage;
    this.ammunition = ammunition;
    this.numberOfShots = numberOfShots;
    this.rateOfFire = rateOfFire;
    this.reliability = reliability; // VR = 3, ST = 5, UR = 8
    this.range = range;
  }
  get name() {
    return this._name;
  }
  set name(x) {
    if (typeof x === 'string' || x instanceof String) {
      this._name = x;
    } else {
      throw `Expected string type for weapon name, instead got [type: ${typeof x}, value: ${x}]\n${new Error().stack}`;
    }
  }
  get skill() {
    return this._skill;
  }
  set skill(x) {
    if (typeof x === 'string' || x instanceof String) {
      this._skill = x;
    } else {
      throw `Expected string type for weapon's associated skill, [type: ${typeof x}, value: ${x}]\n${
        new Error().stack
      }`;
    }
  }
  get accuracy() {
    return this._accuracy;
  }
  set accuracy(x) {
    if (typeof x === 'number' || x instanceof Number) {
      this._accuracy = x;
    } else {
      throw `Expected Number type for weapon accuracy, instead got [type: ${typeof x}, value: ${x}]\n${
        new Error().stack
      }`;
    }
  }
  get damage() {
    return this._damage;
  }
  set damage(x) {
    if (typeof x === 'string' || x instanceof String) {
      this._damage = x;
    } else {
      throw `Expected string type for weapon damage, instead got [type: ${typeof x}, value: ${x}]\n${
        new Error().stack
      }`;
    }
  }
  get ammunition() {
    return this._ammunition;
  }
  set ammunition(x) {
    if (typeof x === 'string' || x instanceof String) {
      this._ammunition = x;
    } else {
      throw `Expected string type for weapon ammunition type, instead got [type: ${typeof x}, value: ${x}]\n${
        new Error().stack
      }`;
    }
  }
  get numberOfShots() {
    return this._numberOfShots;
  }
  set numberOfShots(x) {
    if (typeof x === 'number' || x instanceof Number) {
      this._numberOfShots = x;
    } else {
      throw `Expected Number type for weapon's number of shots, instead got [type: ${typeof x}, value: ${x}]\n${
        new Error().stack
      }`;
    }
  }
  get rateOfFire() {
    return this._rateOfFire;
  }
  set rateOfFire(x) {
    if (typeof x === 'number' || x instanceof Number) {
      this._rateOfFire = x;
    } else {
      throw `Expected Number type for weapon rate of fire, instead got [type: ${typeof x}, value: ${x}]\n${
        new Error().stack
      }`;
    }
  }
  get reliability() {
    return this._reliability;
  }
  set reliability(x) {
    if (typeof x === 'number' || x instanceof Number) {
      let isReliable = false;
      for (let key in Reliability) {
        if (x === Reliability[key]) {
          isReliable = true;
        }
      }
      if (isReliable) {
        this._reliability = x;
      } else {
        let errorOutput = 'Expected a number specified in the list of Reliability constants for weapon reliability: [';
        for (const i of Reliability) {
          errorOutput += i + ',';
        }
        errorOutput = errorOutput.substring(0, errorOutput.length - 1);
        errorOutput += `], instead got ${x}\n${new Error().stack}`;
        throw errorOutput;
      }
    } else {
      throw `Expected Number type for weapon reliability, instead got [type: ${typeof x}, value: ${x}]\n${
        new Error().stack
      }`;
    }
  }
  get range() {
    return this._range;
  }
  set range(x) {
    if (typeof x === 'number' || x instanceof Number) {
      this._range = x;
    } else {
      throw `Expected Number type for weapon range, instead got [type: ${typeof x}, value: ${x}]\n${new Error().stack}`;
    }
  }
}
class Armor {
  constructor(name, covers, sp, ev) {
    this.name = name;
    this.covers = covers;
    this.sp = sp;
    this.ev = ev;
  }
  get name() {
    return this._name;
  }
  set name(x) {
    if (typeof x === 'string' || x instanceof String) {
      this._name = x;
    } else {
      throw `Expected string type for armor name, instead got [type: ${typeof x}, value: ${x}]\n${new Error().stack}`;
    }
  }
  get covers() {
    return this._covers;
  }
  set covers(x) {
    if (x instanceof Array) {
      for (let cover of x) {
        try {
          this.addCover(cover);
        } catch (e) {
          throw e;
        }
      }
    } else {
      throw `Expected Array type for armor covers, instead got [type: ${typeof x}, value: ${x}]\n${new Error().stack}`;
    }
  }
  addCover(x) {
    if (typeof x === 'string' || x instanceof String) {
      if (!this._covers) {
        this._covers = [];
      }
      this._covers.push(x);
    } else {
      throw `Expected string type for armor cover type, instead got [type: ${typeof x}, value: ${x}]\n${
        new Error().stack
      }`;
    }
  }
  get sp() {
    return this._sp;
  }
  set sp(x) {
    if (typeof x === 'number' || x instanceof Number) {
      this._sp = x;
    } else {
      throw `Expected Number type for armor stopping power (sp), [type: ${typeof x}, value: ${x}]\n${
        new Error().stack
      }`;
    }
  }
  get ev() {
    return this._ev;
  }
  set ev(x) {
    if (typeof x === 'number' || x instanceof Number) {
      this._ev = x;
    } else {
      throw `Expected Number type for armor encumbrance value (ev), instead got [type: ${typeof x}, value: ${x}]\n${
        new Error().stack
      }`;
    }
  }
}
class Gear {
  constructor(armor, weapons, cyberware) {
    this.armor = armor;
    if (weapons) {
      this.weapons = weapons;
    }
    if (cyberware) {
      this.cyberware = cyberware;
    }
  }
  get armor() {
    return this._armor;
  }
  set armor(x) {
    if (x instanceof Armor) {
      this._armor = x;
    } else {
      throw `Expected Armor() type for gear armor, instead got [constructor: ${
        x.constructor.name
      }, type: ${typeof x}, value: ${x}]\n${new Error().stack}`;
    }
  }
  get weapons() {
    return this._weapons;
  }
  set weapons(x) {
    if (x instanceof Array) {
      x.forEach(weapon => {
        try {
          this.addWeapon(weapon);
        } catch (e) {
          throw e;
        }
      });
    } else {
      throw `Expected Array type for gear weapons, instead got [constructor: ${
        x.constructor.name
      }, type: ${typeof x}, value: ${x}]\n${new Error().stack}`;
    }
  }
  addWeapon(weapon) {
    if (weapon instanceof Weapon) {
      if (!this._weapons) {
        this._weapons = [];
      }
      this._weapons.push(weapon);
    } else {
      throw `Expected Weapon() type for gear weapons, instead got [constructor: ${
        weapon.constructor.name
      }, type: ${typeof x}, value: ${x}]\n${new Error().stack}`;
    }
  }
  get cyberware() {
    return this._cyberware;
  }
  set cyberware(x) {
    if (x instanceof Array) {
      x.forEach(cyberware => {
        try {
          this.addCyberware(cyberware);
        } catch (e) {
          throw e;
        }
      });
    } else {
      throw `Expected Array type for gear cyberware, instead got [constructor: ${
        x.constructor.name
      }, type: ${typeof x}, value: ${x}]\n${new Error().stack}`;
    }
  }
  addCyberware(x) {
    if (x instanceof Cyberware) {
      if (!this._cyberware) {
        this._cyberware = [];
      }
      this._cyberware.push(x);
    } else {
      throw `Expected Cyberware() type for gear cyberware, instead got [constructor: ${
        x.constructor.name
      }, type: ${typeof x}, value: ${x}]\n${new Error().stack}`;
    }
  }
  addToGear(x) {
    let handleIndividual = gear => {
      if (x instanceof Weapon) {
        this.addWeapon(gear);
      } else if (x instanceof Cyberware) {
        this.addCyberware(gear);
      } else {
        throw `Expected Weapon() or Cyberware() type for adding to gear, instead got [constructor: ${
          x.constructor.name
        }, type: ${typeof x}, value: ${x}]\n${new Error().stack}`;
      }
    };
    if (x instanceof Array) {
      x.forEach(gear => {
        handleIndividual(gear);
      });
    } else if (x instanceof Weapon || x instanceof Cyberware) {
      handleIndividual(x);
    } else {
      throw `Expected Array of Weapon() or Cyberware(), or single Weapon() or single Cyberware() type for adding to gear, instead got [constructor: ${
        x.constructor.name
      }, type: ${typeof x}, value: ${x}]\n${new Error().stack}`;
    }
  }
  static generateGear(difficulty, role) {
    let difficultyOk = typeof difficulty === 'number' || difficulty instanceof Number;
    let roleOk = typeof role === 'string' || role instanceof String;
    if (!difficultyOk || !roleOk) {
      throw `${
        difficultyOk
          ? ''
          : `Expected Number type for difficulty, instead got [type: ${typeof difficulty}, value: ${difficulty} `
      }${
        roleOk ? '' : `Expected string for role, instead got [type: ${typeof role}, value: ${role} `
      }for generating gear\n${new Error().stack}`;
    } else {
      if (Roles.indexOf(role) < 0) {
        throw `Expected one of predefined roles ${getArrayOutput(Roles)} for generating gear, instead got [${role}]\n${
          new Error().stack
        }`;
      } else {
        let weapon = null;
        let armor = null;
        let roleModifier = 0;
        if (role === Roles[1]) {
          roleModifier = 2;
        } else if (role === Roles[2]) {
          roleModifier = 3;
        }
        let packRoll = Math.floor(Math.random() * 6 + 1) + difficulty + roleModifier;
        switch (packRoll) {
          case 1:
            armor = armors[0];
            weapon = weapons.melee[0];
            break;
          case 2:
            armor = armors[1];
            weapon = weapons.lightPistol[Math.floor(Math.random() * weapons.lightPistol.length)];
            break;
          case 3:
            armor = armors[2];
            weapon = weapons.mediumPistol[Math.floor(Math.random() * weapons.mediumPistol.length)];
            break;
          case 4:
            armor = armors[2];
            weapon = weapons.heavyPistol[Math.floor(Math.random() * weapons.heavyPistol.length)];
            break;
          case 5:
            armor = armors[3];
            weapon = weapons.heavyPistol[Math.floor(Math.random() * weapons.heavyPistol.length)];
            break;
          case 6:
            armor = armors[3];
            weapon = weapons.lightSMG[Math.floor(Math.random() * weapons.lightSMG.length)];
            break;
          case 7:
            armor = armors[3];
            weapon = weapons.lightAssaultRifle[Math.floor(Math.random() * weapons.lightAssaultRifle.length)];
            break;
          case 8:
            armor = armors[4];
            weapon = weapons.mediumAssaultRifle[Math.floor(Math.random() * weapons.mediumAssaultRifle.length)];
            break;
          case 9:
            armor = armors[4];
            weapon = weapons.heavyAssaultRifle[Math.floor(Math.random() * weapons.heavyAssaultRifle.length)];
            break;
          default:
            armor = armors[5];
            weapon = weapons.heavyAssaultRifle[Math.floor(Math.random() * weapons.heavyAssaultRifle.length)];
            break;
        }
        let gear = new Gear(armor);
        gear.addToGear(weapon);
        Cyberware.generateCyberware(role, gear);
        return gear;
      }
    }
  }
}
class Cyberware {
  constructor(name, skill, value) {
    this.name = name;
    this.skill = skill;
    this.value = value;
  }
  get name() {
    return this._name;
  }
  set name(x) {
    if (typeof x === 'string' || x instanceof String) {
      this._name = x;
    } else {
      throw `Expected string type for cyberware name, instead got [type: ${typeof x}, value: ${x}]\n${
        new Error().stack
      }`;
    }
  }
  get skill() {
    return this._skill;
  }
  set skill(x) {
    if (typeof x === 'string' || x instanceof String) {
      this._skill = x;
    } else {
      throw `Expected string type for cyberware associated skill, instead got [type: ${typeof x}, value: ${x}]\n${
        new Error().stack
      }`;
    }
  }
  get value() {
    return this._value;
  }
  set value(x) {
    if (typeof x === 'number' || x instanceof Number) {
      this._value = x;
    } else {
      throw `Expected Number type for cyberware associated skill value, instead got [type: ${typeof x}, value: ${x}]\n${
        new Error().stack
      }`;
    }
  }
  static generateCyberware(role, gear) {
    let gearOk = gear instanceof Gear;
    let roleOk = typeof role === 'string' || role instanceof String;
    if (!gearOk || !roleOk) {
      throw `${
        gearOk
          ? ''
          : `Expected Gear() type for cyberware generator, instead got: [constructor: ${
              gear.constructor.name
            }, type: ${typeof gear}, value: ${gear}]`
      }${roleOk ? '' : `Expected string for role, instead got [type: ${typeof role}, value: ${role} `}\n${
        new Error().stack
      }`;
    } else {
      if (Roles.indexOf(role) < 0) {
        throw `Expected role to be in predefined roles ${getArrayOutput(
          Roles
        )} for generating Cyberware, instead got [${role}]\n${new Error().stack}`;
      }
      let iterations = 3;
      if (role === Roles[2]) {
        iterations += 3;
      }
      let rolls = [];
      for (let i = 0; i < iterations; ++i) {
        let roll = Math.floor(Math.random() * 10);
        switch (roll) {
          case 0: // cyberoptics
            if (rolls.indexOf(0) > -1) {
              --i;
            } else {
              rolls.push(0);
              let optics = Math.floor(Math.random() * cyberwares.cyberoptics.length);
              gear.addToGear(cyberwares.cyberoptics[optics]);
            }
            break;
          case 1: // cyberarm
            if (rolls.indexOf(1) > -1) {
              --i;
            } else {
              rolls.push(1);
              let cyberarm = Math.floor(Math.random() * 6);
              switch (cyberarm) {
                case 0:
                  gear.addToGear(weapons.mediumPistol[Math.floor(Math.random() * weapons.mediumPistol.length)]);
                  break;
                case 1:
                  gear.addToGear(weapons.lightPistol[Math.floor(Math.random() * weapons.lightPistol.length)]);
                  break;
                case 2:
                  gear.addToGear(weapons.mediumPistol[Math.floor(Math.random() * weapons.mediumPistol.length)]);
                  break;
                case 3:
                  gear.addToGear(weapons.lightSMG[Math.floor(Math.random() * weapons.lightSMG.length)]);
                  break;
                case 4:
                  gear.addToGear(weapons.veryHeavyPistol[Math.floor(Math.random() * weapons.veryHeavyPistol.length)]);
                  break;
                case 5:
                  gear.addToGear(weapons.heavyPistol[Math.floor(Math.random() * weapons.heavyPistol.length)]);
                  break;
              }
            }
            break;
          case 2: // cyberaudio
            if (rolls.indexOf(2) > -1) {
              --i;
            } else {
              rolls.push(2);
              gear.addToGear(cyberwares.cyberaudio[Math.floor(Math.random() * cyberwares.cyberaudio.length)]);
            }
            break;
          case 3:
            if (rolls.indexOf(3) > -1) {
              --i;
            } else {
              rolls.push(3);
              gear.addToGear(new Weapon('BigKnucks', 'Melee', 0, '1d6+2', '', 0, 0, Reliability.MELEE, 1));
            }
            break;
          case 4:
            if (rolls.indexOf(4) > -1) {
              --i;
            } else {
              rolls.push(4);
              gear.addToGear(new Weapon('Rippers', 'Melee', 0, '1d6+3', '', 0, 0, Reliability.MELEE, 1));
            }
            break;
          case 5:
            if (rolls.indexOf(5) > -1) {
              --i;
            } else {
              rolls.push(5);
              gear.addToGear(new Weapon('Vampires', 'Melee', 0, '1d6/3', '', 0, 0, Reliability.MELEE, 1));
            }
            break;
          case 6:
            if (rolls.indexOf(6) > -1) {
              --i;
            } else {
              rolls.push(6);
              gear.addToGear(new Weapon("Slice n'dice", 'Melee', 0, '2d6', '', 0, 0, Reliability.MELEE, 1));
            }
            break;
          case 7:
            if (rolls.indexOf(7) > -1) {
              --i;
            } else {
              rolls.push(7);
              gear.addToGear(cyberwares.reflexBoost[0]);
            }
            break;
          case 8:
            if (rolls.indexOf(8) > -1) {
              --i;
            } else {
              rolls.push(8);
              gear.addToGear(cyberwares.reflexBoost[1]);
            }
            break;
          default:
            break;
        }
      }
    }
  }
}
const Stats = ['int', 'ref', 'tech', 'cool', 'att', 'luck', 'ma', 'body', 'emp'];
const Roles = ['techie', 'nomad', 'solo'];
const Reliability = {
  ST: 5,
  VR: 3,
  UR: 8,
  MELEE: 0,
};
const armors = [
  new Armor('Heavy Leather', ['torso', 'leftArm', 'rightArm', 'leftLeg', 'rightLeg'], 4, 0),
  new Armor('Armor Vest', ['torso'], 10, 0),
  new Armor('Light Armor Jacket', ['torso', 'leftArm', 'rightArm'], 14, 0),
  new Armor('Medium Armor Jacket', ['torso', 'leftArm', 'rightArm'], 18, 0),
  new Armor('Heavy Armor Jacket', ['torso', 'leftArm', 'rightArm'], 20, 2),
  new Armor('MetalGear(TM)', ['head', 'torso', 'leftArm', 'rightArm', 'leftLeg', 'rightLeg'], 25, 2),
];
const weapons = {
  melee: [new Weapon('Knife', 'Melee', 0, '1d6', '', 0, 0, Reliability.MELEE, 1)],
  lightPistol: [
    new Weapon('BudgetArms C-13', 'Handgun', -1, '1d6', '5mm', 8, 2, Reliability.ST, 50),
    new Weapon('Dai Lung Cybermag 15', 'Handgun', -1, '1d6+1', '6mm', 10, 2, Reliability.UR, 50),
    new Weapon('Federated Arms X-22', 'Handgun', 0, '1d6+1', '6mm', 10, 2, Reliability.ST, 50),
  ],
  mediumPistol: [
    new Weapon('Militech Arms Avenger', 'Handgun', 0, '2d6+1', '9mm', 10, 2, Reliability.VR, 50),
    new Weapon('Dai Lung Streetmaster', 'Handgun', 0, '2d6+3', '10mm', 12, 2, Reliability.UR, 50),
    new Weapon('Federated Arms X-9mm', 'Handgun', 0, '2d6+1', '9mm', 12, 2, Reliability.ST, 50),
  ],
  heavyPistol: [
    new Weapon('BudgetArms Auto 3', 'Handgun', -1, '3d6', '11mm', 8, 2, Reliability.UR, 50),
    new Weapon('Sternmeyer Type 35', 'Handgun', 0, '3d6', '11mm', 8, 2, Reliability.VR, 50),
  ],
  lightSMG: [
    new Weapon('Uzi Miniauto 9', 'Submachinegun', 1, '2d6+1', '9mm', 30, 35, Reliability.VR, 150),
    new Weapon('H&K MP-2013', 'Submachinegun', 1, '2d6+3', '10mm', 35, 32, Reliability.ST, 150),
    new Weapon('Federal Arms Tech Assualt II', 'Submachinegun', 1, '1d6+1', '6mm', 50, 25, Reliability.ST, 150),
  ],
  lightAssaultRifle: [
    new Weapon('Militich Ronin Light Assault', 'Rifle', 1, '5d6', '5.56', 35, 30, Reliability.VR, 400),
  ],
  mediumAssaultRifle: [new Weapon('AKR-20 Medium Assault', 'Rifle', 0, '5d6', '5.56', 30, 30, Reliability.ST, 400)],
  heavyAssaultRifle: [
    new Weapon('FN-RAL Heavy Assault Rifle', 'Rifle', -1, '6d6+2', '7.62', 30, 30, Reliability.VR, 400),
    new Weapon('Kalishnikov A-80 Heavy Rifle', 'Rifle', -1, '6d6+2', '7.62', 35, 25, Reliability.ST, 400),
  ],
  veryHeavyPistol: [
    new Weapon('Armalite 44', 'Handgun', 0, '4d6+1', '12mm', 8, 1, Reliability.ST, 50),
    new Weapon('Colt AMT Model 2000', 'Handgun', 0, '4d6+1', '12mm', 8, 1, Reliability.VR, 50),
  ],
};
const cyberwares = {
  cyberoptics: [
    new Cyberware('Infrared', '', 0),
    new Cyberware('Low-Lite(TM)', '', 0),
    new Cyberware('Digital Camera', '', 0),
    new Weapon('Dartgun', 'Eye Darts', 2, '0', 'dart', 1, 1, Reliability.MELEE, 1),
    new Cyberware('Anti-dazzle protection', '', 0),
    new Cyberware('Targeting Scope', 'Handgun', 1),
  ],
  cyberaudio: [
    new Cyberware('Wearman(TM)', '', 0),
    new Cyberware('Radio Link', '', 0),
    new Cyberware('Phone Splice', '', 0),
    new Cyberware('Amplified Hearing', 'Awareness', 1),
    new Cyberware('Sound Editing', 'Awareness', 2),
    new Cyberware('Digital Recording Link', '', 0),
  ],
  reflexBoost: [new Cyberware('Kerenzikov', 'Initiative', 1), new Cyberware('Sandevistan', 'Initiative', 3)],
};

class Enemy {
  constructor(name, difficulty) {
    this.name = name;
    this.role = Role.generateRole(Roles[Math.floor(Math.random() * Roles.length)]);
    this.stats = this.generateStats();
    this.gear = Gear.generateGear(difficulty, this.role.name);
    let pickupPoints = this.stats[Stats.indexOf('ref')].value + this.stats[Stats.indexOf('int')].value;
    this.role.generatePickupSkills(this.gear.weapons, pickupPoints);
  }
  get name() {
    return this._name;
  }
  set name(x) {
    if (typeof x === 'string' || x instanceof String) {
      this._name = x;
    } else {
      throw `Expected string type for enemy name, instead got [type: ${typeof x}, value: ${x}]\n${new Error().stack}`;
    }
  }
  get role() {
    return this._role;
  }
  set role(x) {
    if (x instanceof Role) {
      this._role = x;
    } else {
      throw `Expected Role() type for enemy role, instead got [constructor: ${
        x.constructor.name
      }, type: ${typeof x}, value: ${x}]\n${new Error().stack}`;
    }
  }
  get stats() {
    return this._stats;
  }
  set stats(x) {
    if (x instanceof Array) {
      x.forEach(stat => {
        if (!this._stats) {
          this._stats = [];
        }
        if (stat instanceof Stat) {
          this._stats.push(stat);
        } else {
          throw `Expected Stat() type for enemy stats, instead got [constructor: ${
            stat.constructor.name
          }, type: ${typeof stat}, value: ${stat}]`;
        }
      });
    } else {
      throw `Expected Array type for enemy stats, instead got [type: ${typeof x}, value: ${x}]\n${new Error().stack}`;
    }
  }
  get gear() {
    return this._gear;
  }
  set gear(x) {
    if (x instanceof Gear) {
      this._gear = x;
    } else {
      throw `Expected Gear() type for enemy stats, instead got [constructor: ${
        x.constructor.name
      }, type: ${typeof x}, value: ${x}]\n${new Error().stack}`;
    }
  }
  generateStats() {
    let stats = [];
    for (let i = 0; i < 9; ++i) {
      stats.push(Stat.generateStat(Stats[i]));
    }
    return stats;
  }
}

// enemy array is array with numbers of enemy types
// [1, 3, 20] means 1 enemy of type 1, 3 enemies of type 2, and 20 of type 3
// the index of the array determines the difficulty modifier
class Room {
  constructor(name, enemyArray) {
    this.name = name;
    enemyArray.forEach((enemyType, difficulty) => {
      let enemies = [];
      for (let i = 0; i < enemyType; ++i) {
        let name = `type ${enemyType} - ${i}`;
        this.addEnemy(new Enemy(name, difficulty));
      }
    });
  }
  get name() {
    return this._name;
  }
  set name(x) {
    if (typeof x === 'string' || x instanceof String) {
      this._name = x;
    } else {
      throw `Expected type string for room name, instead got [type: ${typeof x}, value: ${x}]\n${new Error().stack}`;
    }
  }
  get enemies() {
    return this._enemies;
  }
  set enemies(enemies) {
    if (!(enemies instanceof Array)) {
      throw `Expected type Array for enemies in Room class, instead got: [type: ${typeof enemies}, value: ${enemies}]\n${
        new Error().stack
      }`;
    } else {
      enemies.forEach(enemy => {
        try {
          this.addEnemy(enemy);
        } catch (e) {
          throw e;
        }
      });
    }
  }
  addEnemy(enemy) {
    if (!(enemy instanceof Enemy)) {
      throw `Expected type Enemy for adding enemy in Room class, instead got [constructor: ${
        enemy.constructor.name
      }, type: ${typeof enemy}, value: ${enemy}]\n${new Error().stack}`;
    } else {
      if (!this._enemies) {
        this._enemies = [];
      }
      this._enemies.push(enemy);
    }
  }
}

let rooms = [
  new Room('Green Armor Room', [0, 4]),
  new Room('Computer Room', [2, 4]),
  new Room('Acid Room', [3, 3, 2]),
  new Room('Final Room', [4, 1, 1]),
  new Room('Elevator Room', [0, 0, 1]),
  new Room('Secret Elevator Room', [0, 1]),
  new Room('Secret Acid Room', [0, 2]),
];
module.exports = Room;
/*
let output = '# Your generated Map Stats\n\n';
rooms.forEach(room => {
    output += '## ' + room.name + '\n\nEnemy Name|';
    statNames.forEach(statName => {
        output += statName + '|';
    });
    output = output.substring(0, output.lastIndexOf('|') + 1);
    output += '\n---|---|---|---|---|---|---|---|---|---\n';
    room.enemies.forEach(enemyType => {
        enemyType.forEach(enemy => {
            output += enemy.name;
            enemy.stats.forEach(stat => {
                output += '|' + stat.num;
            });
            output += '\n';
        });
    });
    output += '\n';
});
*/
