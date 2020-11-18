import Route from '@ember/routing/route';

export default class BoardRoute extends Route {
  // #OI
  model() {
    return {
      robot: {
        x: null,
        y: null,
        f: null,
        placed: false
      }
    }
  }
  // /OI
}
