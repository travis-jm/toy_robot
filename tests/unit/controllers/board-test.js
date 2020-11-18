import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Controller | board', function(hooks) {
  setupTest(hooks);

  hooks.beforeEach(function() {
    let controller = this.owner.lookup('controller:board');
    controller.model = { robot: { x: null, y: null, f: null, placed: false} };
  });

  // TODO: Replace this with your real tests.
  test('#place action sets model.robot on the table', function(assert) {
    let controller = this.owner.lookup('controller:board');
    controller.send('place', 0, 0, 'NORTH');
    assert.equal(controller.model.robot.x, 0, "Robot X Was Set");
    assert.equal(controller.model.robot.y, 0, "Robot Y Was Set");
    assert.equal(controller.model.robot.f, 0, "Robot F Was Set");
    assert.equal(controller.model.robot.placed, true, "Robot Was Placed");
  });

  test('#place ignores invalid coordinates', function(assert) {
    let controller = this.owner.lookup('controller:board');
    controller.send('place', -1, 6, 'NORTHWEST');
    assert.equal(controller.model.robot.x, null, "Robot X Was Set");
    assert.equal(controller.model.robot.y, null, "Robot Y Was Set");
    assert.equal(controller.model.robot.f, null, "Robot F Was Set");
    assert.equal(controller.model.robot.placed, false, "Robot Was Placed");
  });

  test('#move - moves robot 1 space in the direction its facing', function(assert) {
    let controller = this.owner.lookup('controller:board');
    controller.send('place', 0, 0, 'NORTH');
    controller.send('move');
    assert.equal(controller.model.robot.y, 1, 'Robot was moved one place');
  });

  test('#move command ignored if it would send robot off table', function(assert) {
    let controller = this.owner.lookup('controller:board');
    controller.send('place', 0, 4, 'NORTH');
    controller.send('move');
    assert.equal(controller.model.robot.y, 4, 'Robot was spared certain death');
  });

  test('#left - turns robot counter clockwise', function(assert) {
    let controller = this.owner.lookup('controller:board');
    controller.send('place', 0, 0, 'NORTH');
    controller.send('left');
    assert.equal(controller.model.robot.f, 3, 'Robot was turned counter clockwise');
  });

  test('#right - turns robot clockwise', function(assert) {
    let controller = this.owner.lookup('controller:board');
    controller.send('place', 0, 4, 'NORTH');
    controller.send('right');
    assert.equal(controller.model.robot.f, 1, 'Robot was turned clockwise');
  });

  test('#report - reports robot needs to be placed if it has not been', function(assert) {
    let controller = this.owner.lookup('controller:board');
    controller.send('report');
    assert.equal(controller.reports.length, 1);
    assert.equal(controller.reports[0], 'Must place robot to see report');
  });

  test('#report - reports robots current position if on the table', function(assert) {
    let controller = this.owner.lookup('controller:board');
    controller.send('place', 0, 0, 'NORTH');
    controller.send('report');
    assert.equal(controller.reports.length, 1);
    assert.equal(controller.reports[0], `Robot is at X: 0 Y: 0, facing : NORTH`);
  });

  test('#queueCommand - Adds commands to queue', function(assert) {
    let controller = this.owner.lookup('controller:board');
    controller.send('queueCommand', 'place', 0, 0, 'NORTH');
    controller.send('queueCommand', 'move');
    controller.send('queueCommand', 'move');
    controller.send('queueCommand', 'right');
    controller.send('queueCommand', 'report');
    assert.equal(controller.commands.length, 5);
  });

  test('#executeCommands - execute all commands in the queue', function(assert) {
    let controller = this.owner.lookup('controller:board');
    controller.send('queueCommand', 'place', 0, 0, 'NORTH');
    controller.send('queueCommand', 'move');
    controller.send('queueCommand', 'move');
    controller.send('queueCommand', 'right');
    controller.send('queueCommand', 'report');
    controller.send('executeCommands');
    assert.equal(controller.reports.length, 1);
    assert.equal(controller.reports[0], `Robot is at X: 0 Y: 2, facing : EAST`);
  });

});
