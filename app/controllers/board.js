import Controller from '@ember/controller';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class BoardController extends Controller {
  @tracked commands = [];
  @tracked queueMode;
  @action
  queueCommand(command, x = null, y = null, facing = null) {
    this.commands.push({ command, x, y, facing});
    this.commands = this.commands;
  }
  @action
  executeCommands() {
    this.commands.forEach(command => {
      if (command.command == 'place') {
        this[command.command](command.x, command.y, command.facing);
      } else {
        this[command.command]();
      }
    });
    this.commands = [];
  }
  @action
  toggleQueue() {
    this.queueMode = !this.queueMode;
  }
  // #OI
  directions = [
    'NORTH',
    'EAST',
    'SOUTH',
    'WEST'
  ];

  @tracked reports = [];

  @action
  place(x, y, f) {
    if (x == undefined || y == undefined || !this.directions.includes(f) || x > 4 || x < 0 || y > 4 || y < 0) {
      return false;
    }

    this.model.robot.x = x;
    this.model.robot.y = y;
    this.model.robot.f = this.directions.indexOf(f);
    this.model.robot.placed = true;
  }
  @action
  move() {
    if (!this.model.robot.placed) {
      return;
    }
    if (this.model.robot.f === 0 && this.model.robot.y < 4) {
      this.model.robot.y++;
    } else if (this.model.robot.f === 1 && this.model.robot.x < 4) {
      this.model.robot.x++;
    } else if (this.model.robot.f === 2 && this.model.robot.y >= 1) {
      this.model.robot.y--;
    } else if (this.model.robot.f === 3 && this.model.robot.x >= 1) {
      this.model.robot.x--;
    }
  }
  @action
  left() {
    if (!this.model.robot.placed) {
      return;
    }
    let f = this.model.robot.f;
    f--;
    if (f < 0) {
      f = 3;
    }
    this.model.robot.f = f;
  }
  @action
  right(){
    if (!this.model.robot.placed) {
      return;
    }
    let f = this.model.robot.f;
    f++;
    if (f > 3) {
      f = 0;
    }
    this.model.robot.f = f;
  }
  @action
  report() {
    if(this.model.robot.placed) {
      this.reports.push(`Robot is at X: ${this.model.robot.x} Y: ${this.model.robot.y}, facing : ${this.directions[this.model.robot.f]}`);
    } else {
      this.reports.push('Must place robot to see report');
    }
    this.reports = this.reports;
  }
  // /OI
}
