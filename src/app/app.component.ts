import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import * as critical_data from '../assets/crit-weapon.json';
import * as fumble_data from '../assets/fumble-weapon.json';
import * as spell_critical_data from '../assets/crit-spell.json';
import * as spell_fumble_data from '../assets/fumble-spell.json';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = '5e Critter';
  rForm: FormGroup;
  selectedType: 'melee';
  selectedFunction: 'critical';
  roll;
  result;

  critWeapon;
  critSpell;
  fumbleWeapon;
  fumbleSpell;

  static getRandom(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  constructor(private formBuilder: FormBuilder) {

    this.critWeapon = (<any>critical_data);
    this.fumbleWeapon = (<any>fumble_data);
    this.critSpell = (<any>spell_critical_data);
    this.fumbleSpell = (<any>spell_fumble_data);

    this.rForm = formBuilder.group({
      selectedType: 'melee',
      result: '',
      'validate': ''
    });

  }

  addPost(formPost) {
    if (!this.selectedType || this.selectedType == null ) {
      this.selectedType = formPost.selectedType;
    }
    console.log('type: ', this.selectedType);
    console.log('func: ', this.selectedFunction);

    // Get a random number between 1 and 100
    this.roll = AppComponent.getRandom(1, 100);
    const crit = this.getResult(this.roll, this.selectedType, this.selectedFunction);
    this.result = {
      'description': crit.description,
      'effect': crit.effect
    };
  }

  getResult(roll, type, func) {
    let returnValue = {
      'roll': 'Invalid',
      'description': 'Invalid roll',
      'effect': 'Value: ' + roll
    };

    if (roll >= 1 || roll <= 100) {
      if (func === 'critical') {
        if (type === 'melee' || type === 'ranged') {
          returnValue = this.findInList(roll, this.critWeapon);
        } else if (type === 'spell') {
          returnValue = this.findInList(roll, this.critSpell);
        } else {
          returnValue = {
            'roll': 'Invalid',
            'description': 'Invalid attack type',
            'effect': 'Value: ' + type
          };
        }
      } else if (func === 'fumble') {
        if (type === 'melee' || type === 'ranged') {
          returnValue = this.findInMultipurposeList(roll, this.fumbleWeapon, type);
        } else if (type === 'spell') {
          returnValue = this.findInList(roll, this.fumbleSpell);
        } else {
          returnValue = {
            'roll': 'Invalid',
            'description': 'Invalid attack type',
            'effect': 'Value: ' + type
          };
        }
      } else {
        returnValue = {
          'roll': 'Invalid',
          'description': 'Invalid function selection',
          'effect': 'Value: ' + func
        };
      }
    }

    return returnValue;
  }

  findInList(roll, list) {
    let returnValue = {
      'roll': 'n/a',
      'description': 'Not found',
      'effect': 'n/a'
    };
    list.forEach(item => {
      const splitRange = item.roll.split('-');
      if ( roll >= splitRange[0] && roll <= splitRange[1]) {
        returnValue = item;
      }
    });

    return returnValue;
  }

  findInMultipurposeList(roll, list, type) {
    let returnValue = {
      'roll': 'n/a',
      'description': 'Not found',
      'effect': 'n/a'
    };
    list.forEach(item => {
      const splitRange = item.roll.split('-');
      if ( roll >= splitRange[0] && roll <= splitRange[1] && (item.type === type || item.type === 'both')) {
        returnValue = item;
      }
    });

    return returnValue;
  }

  selectAttackType(value) {
    this.selectedType = value;
    this.result = {
      'description': ''
    };
  }

  selectFunction(value) {
    this.selectedFunction = value;
  }

  clearResults() {
    this.result = {
      'description': ''
    };
  }
}
