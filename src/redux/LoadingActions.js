export const LOADING = {
  show: 'SHOW_LOADING',
  hide: 'HIDE_LOADING'
};

export class LoadingActions {
  constructor(dispatch) {
      this.dispatch = dispatch;
      this.show  = this.show.bind(this);
      this.hide = this.hide.bind(this);
  }
  show() {
      return this.dispatch({type: LOADING.show});
  }
  hide() {
      return this.dispatch({type: LOADING.hide});
  }
}